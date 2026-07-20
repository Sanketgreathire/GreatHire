import { GitHubScraper } from '../scrapers/githubScraper.js';
import axios from 'axios';
import { GeminiJdMatcher } from './geminiJdMatcher.js';
import { AISourcedCandidate } from '../../models/sourcing/aiSourcedCandidate.model.js';

const AI_BASE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';
const AI_API_KEY = process.env.AI_SERVICE_API_KEY || 'greathire-ai-secret-key-change-in-prod';

/**
 * JD-Based Sourcing Service
 * Sources candidates from external platforms and scores them against job description
 */
export class JdSourcingService {
  constructor() {
    this.githubScraper = new GitHubScraper();
  }

  /**
   * Source candidates based on filters and score against JD
   * @param {Object} filters - { skills, location, designation, minExp, maxExp, jobDescription }
   * @param {Number} limit - Max candidates to source
   */
  async sourceAndScore(filters, limit = 20) {
    try {
      const { skills, location, designation, minExp, maxExp, jobDescription } = filters;

      // Step 1: Check the saved-candidates database first; only fall back to a live
      // GitHub fetch if the database doesn't already have enough matches.
      console.log('🔍 Checking saved candidates database first...');
      const savedCandidates = await this.getSavedCandidates({ skills, location, designation, minExp, maxExp });

      let candidates;
      if (savedCandidates.length >= limit) {
        console.log(`✅ Found ${savedCandidates.length} matching candidates in the database, skipping live GitHub fetch`);
        candidates = savedCandidates;
      } else {
        console.log(`⚠️ Only ${savedCandidates.length} in the database, sourcing more from GitHub...`);
        const freshCandidates = await this.sourceCandidates({ skills, location, designation }, limit);
        const seenKeys = new Set();
        candidates = [...savedCandidates, ...freshCandidates].filter(c => {
          const key = (c.githubUrl || c.emails?.[0] || c.fullName || '').toLowerCase();
          if (!key || seenKeys.has(key)) return false;
          seenKeys.add(key);
          return true;
        });
      }

      if (candidates.length === 0) {
        return { success: true, candidates: [], total: 0 };
      }

      // Step 2: Only keep candidates with at least an email or phone
      let filteredCandidates = candidates.filter(c =>
        (c.emails?.length || 0) > 0 || (c.phones?.length || 0) > 0
      );

      // Step 3: Filter by experience if provided
      if (minExp !== undefined || maxExp !== undefined) {
        filteredCandidates = filteredCandidates.filter(c => {
          const exp = c.totalExperience || 0;
          if (minExp !== undefined && exp < parseFloat(minExp)) return false;
          if (maxExp !== undefined && exp > parseFloat(maxExp)) return false;
          return true;
        });
      }

      // Step 4: Score by filter match or JD
      if (jobDescription && jobDescription.trim()) {
        console.log('🎯 Scoring candidates against job description...');
        const scoredCandidates = await this.scoreCandidatesAgainstJD(filteredCandidates, jobDescription);
        scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);
        return { success: true, candidates: scoredCandidates, total: scoredCandidates.length, mode: 'jd_matched' };
      }

      // No JD — score by filter match (skills, location, designation, exp)
      const scored = filteredCandidates.map(c => {
        let score = 0;
        const reasons = [];

        if (skills) {
          const required = skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
          const cSkills = (c.skills || []).map(s => s.toLowerCase());
          const matched = required.filter(rs => cSkills.some(cs => cs.includes(rs) || rs.includes(cs)));
          if (matched.length) {
            score += Math.round((matched.length / required.length) * 50);
            reasons.push(`Matched skills: ${matched.join(', ')}`);
          }
        } else {
          score += 30; // no skill filter = partial credit
        }

        if (location && c.location) {
          if (c.location.toLowerCase().includes(location.toLowerCase())) {
            score += 20;
            reasons.push(`Location matches: ${c.location}`);
          }
        } else if (!location) {
          score += 10;
        }

        if (designation && c.designation) {
          if (c.designation.toLowerCase().includes(designation.toLowerCase())) {
            score += 20;
            reasons.push(`Designation matches: ${c.designation}`);
          }
        } else if (!designation) {
          score += 10;
        }

        if ((minExp !== undefined || maxExp !== undefined) && c.totalExperience > 0) {
          const exp = c.totalExperience;
          const inRange =
            (minExp === undefined || exp >= parseFloat(minExp)) &&
            (maxExp === undefined || exp <= parseFloat(maxExp));
          if (inRange) { score += 10; reasons.push(`Experience ${exp}y in range`); }
        } else if (minExp === undefined && maxExp === undefined) {
          score += 10;
        }

        return { ...c, matchScore: Math.min(score, 100), matchReasons: reasons };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      return { success: true, candidates: scored, total: scored.length, mode: 'filter_matched' };

    } catch (error) {
      console.error('JD Sourcing error:', error);
      throw error;
    }
  }

  /**
   * Source candidates from GitHub
   */
  async sourceCandidates(criteria, limit) {
    try {
      // Extract primary skill/language for GitHub search
      const primarySkill = criteria.skills 
        ? criteria.skills.split(',')[0].trim() 
        : null;

      const searchCriteria = {
        language: primarySkill,
        location: criteria.location || undefined,
        minRepos: 5,
        minFollowers: 0
      };

      let candidates = await this.githubScraper.searchDevelopers(
        searchCriteria,
        limit,
        1
      );

      // Additional filtering by skills if multiple provided
      if (criteria.skills && criteria.skills.includes(',')) {
        const requiredSkills = criteria.skills
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(Boolean);

        candidates = candidates.filter(c => {
          const candidateSkills = (c.skills || []).map(s => s.toLowerCase());
          return requiredSkills.some(rs =>
            candidateSkills.some(cs => cs.includes(rs) || rs.includes(cs))
          );
        });
      }

      // Filter by designation so e.g. a "frontend developer" search doesn't return backend profiles
      if (criteria.designation?.trim()) {
        const wanted = criteria.designation.trim().toLowerCase();
        candidates = candidates.filter(c => {
          const d = (c.designation || '').toLowerCase();
          return d.length > 0 && (d.includes(wanted) || wanted.includes(d));
        });
      }

      return candidates;

    } catch (error) {
      console.error('GitHub sourcing error:', error);
      return [];
    }
  }

  /**
   * Fetch previously GitHub-sourced candidates (company-wide, shared pool — not
   * scoped to a single recruiter, since auto-sourcing runs independently of who searches) that match the same criteria
   */
  async getSavedCandidates(criteria) {
    try {
      const { skills, location, designation, minExp, maxExp } = criteria;

      const query = {
        aiSourceType: 'GITHUB',
        $or: [
          { email: { $exists: true, $ne: null } },
          { phone: { $exists: true, $ne: null } },
        ],
      };
      if (location?.trim()) query.location = { $regex: location.trim(), $options: 'i' };
      if (designation?.trim()) query.designation = { $regex: designation.trim(), $options: 'i' };
      if (skills?.trim()) {
        const arr = skills.split(',').map(s => s.trim()).filter(Boolean);
        if (arr.length) query.skills = { $all: arr.map(s => new RegExp(s, 'i')) };
      }
      if (minExp !== undefined || maxExp !== undefined) {
        query.totalExperience = {};
        if (minExp !== undefined) query.totalExperience.$gte = parseFloat(minExp);
        if (maxExp !== undefined) query.totalExperience.$lte = parseFloat(maxExp);
      }

      const docs = await AISourcedCandidate.find(query).sort({ createdAt: -1 }).limit(50).lean();
      return docs.map(c => ({
        ...c,
        emails: c.email ? [c.email] : [],
        phones: c.phone ? [c.phone] : [],
        fromDatabase: true,
      }));
    } catch (error) {
      console.error('getSavedCandidates error:', error.message);
      return [];
    }
  }

  /**
   * Score candidates against job description using AI
   */
  async scoreCandidatesAgainstJD(candidates, jobDescription) {
    try {
      // Try AI microservice first
      const scored = await this.scoreWithAiService(candidates, jobDescription);
      if (scored) return scored;

      // Fallback to Gemini
      console.log('AI service unavailable, using Gemini fallback...');
      return await this.scoreWithGemini(candidates, jobDescription);

    } catch (error) {
      console.error('All scoring methods failed:', error);
      // Return candidates with default scores
      return candidates.map(c => ({ ...c, matchScore: 50, matchReasons: ['Scoring unavailable'] }));
    }
  }

  /**
   * Score using AI microservice
   */
  async scoreWithAiService(candidates, jobDescription) {
    try {
      const aiClient = axios.create({
        baseURL: AI_BASE_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        }
      });

      const candidateProfiles = candidates.map(c => ({
        id: c.githubUrl || c.fullName,
        fullName: c.fullName,
        skills: c.skills || [],
        designation: c.designation || '',
        location: c.location || '',
        experience: c.totalExperience || 0,
        summary: c.summary || c.bio || '',
        company: c.company || c.currentCompany || ''
      }));

      const { data } = await aiClient.post('/match/job-description', {
        job_description: jobDescription,
        candidates: candidateProfiles
      });

      return candidates.map(c => {
        const matchResult = data.matches?.find(m => 
          m.candidate_id === (c.githubUrl || c.fullName)
        );
        
        return {
          ...c,
          matchScore: matchResult ? Math.round(matchResult.score * 100) : 0,
          matchReasons: matchResult?.reasons || []
        };
      });

    } catch (error) {
      console.warn('AI service scoring failed:', error.message);
      return null;
    }
  }

  /**
   * Score using Gemini fallback
   */
  async scoreWithGemini(candidates, jobDescription) {
    try {
      const geminiMatcher = new GeminiJdMatcher();
      
      const candidateProfiles = candidates.map(c => ({
        id: c.githubUrl || c.fullName,
        fullName: c.fullName,
        skills: c.skills || [],
        designation: c.designation || '',
        location: c.location || '',
        experience: c.totalExperience || 0,
        summary: c.summary || c.bio || '',
        company: c.company || c.currentCompany || ''
      }));

      const scores = await geminiMatcher.scoreBatch(jobDescription, candidateProfiles, 500);

      return candidates.map(c => {
        const matchResult = scores.find(s => 
          s.candidate_id === (c.githubUrl || c.fullName)
        );
        
        return {
          ...c,
          matchScore: matchResult ? matchResult.percentage : 50,
          matchReasons: matchResult?.reasons || []
        };
      });

    } catch (error) {
      console.error('Gemini scoring error:', error);
      throw error;
    }
  }
}
