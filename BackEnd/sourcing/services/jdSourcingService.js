import { GitHubScraper } from '../scrapers/githubScraper.js';
import axios from 'axios';
import { GeminiJdMatcher } from './geminiJdMatcher.js';

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

      // Step 1: Source candidates from GitHub
      console.log('🔍 Sourcing candidates from GitHub...');
      const candidates = await this.sourceCandidates({ skills, location, designation }, limit);
      
      if (candidates.length === 0) {
        return { success: true, candidates: [], total: 0 };
      }

      // Step 2: Filter by experience if provided
      let filteredCandidates = candidates;
      if (minExp !== undefined || maxExp !== undefined) {
        filteredCandidates = candidates.filter(c => {
          const exp = c.totalExperience || 0;
          if (minExp !== undefined && exp < parseFloat(minExp)) return false;
          if (maxExp !== undefined && exp > parseFloat(maxExp)) return false;
          return true;
        });
      }

      // Step 3: Score against JD if provided
      if (jobDescription && jobDescription.trim()) {
        console.log('🎯 Scoring candidates against job description...');
        const scoredCandidates = await this.scoreCandidatesAgainstJD(filteredCandidates, jobDescription);
        
        // Sort by score descending
        scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);
        
        return { 
          success: true, 
          candidates: scoredCandidates, 
          total: scoredCandidates.length,
          mode: 'jd_matched'
        };
      }

      // Return without scoring
      return { 
        success: true, 
        candidates: filteredCandidates.map(c => ({ ...c, matchScore: null })), 
        total: filteredCandidates.length,
        mode: 'filter_only'
      };

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

      const candidates = await this.githubScraper.searchDevelopers(
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

        return candidates.filter(c => {
          const candidateSkills = (c.skills || []).map(s => s.toLowerCase());
          return requiredSkills.some(rs => 
            candidateSkills.some(cs => cs.includes(rs) || rs.includes(cs))
          );
        });
      }

      return candidates;

    } catch (error) {
      console.error('GitHub sourcing error:', error);
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
