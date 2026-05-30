import { semanticSearch, isAiServiceAvailable } from "../../../../sourcing/ai/aiServiceClient.js";
import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import JobMatch from "../../../models/jobMatch.model.js";
import mongoose from "mongoose";

const SEMANTIC_WEIGHT = 0.6;
const SKILL_WEIGHT = 0.3;
const EXPERIENCE_WEIGHT = 0.1;

export async function matchCandidatesForJob(jobData, options = {}) {
  const { topK = 20, scoreThreshold = 0.3 } = options;
  const { jobId, title, description, skills, experience, location, designation, seniority } = jobData;
  
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  const timings = {};
  const aiAvailable = await isAiServiceAvailable();

  let semanticResults = [];
  if (aiAvailable && description) {
    try {
      const t0 = Date.now();
      const searchQuery = `${title || ''} ${description || ''} ${skills ? skills.join(' ') : ''}`.trim();
      
      const res = await semanticSearch({
        query: searchQuery,
        recruiterId: null,
        topK: topK * 2,
        scoreThreshold: scoreThreshold * 0.8,
        filters: null
      });
      
      semanticResults = res.results || [];
      timings.semantic_ms = Date.now() - t0;
    } catch (error) {
      console.warn("Semantic search failed, using keyword only:", error.message);
    }
  }

  const t1 = Date.now();
  const mongoQuery = {};

  if (skills && skills.length > 0) {
    mongoQuery.skills = { $in: skills.map(skill => new RegExp(skill, 'i')) };
  }

  if (experience) {
    const expRange = parseExperienceRange(experience);
    if (expRange.min !== null || expRange.max !== null) {
      mongoQuery.totalExperience = {};
      if (expRange.min !== null) mongoQuery.totalExperience.$gte = expRange.min;
      if (expRange.max !== null) mongoQuery.totalExperience.$lte = expRange.max;
    }
  }

  if (location) {
    const isRemote = /\b(remote|wfh|work from home|hybrid)\b/i.test(location);
    if (isRemote) {
      mongoQuery.$or = [
        { location: { $regex: /remote|wfh|work from home/i } },
        { location: { $regex: location, $options: 'i' } }
      ];
    } else {
      mongoQuery.location = { $regex: location, $options: 'i' };
    }
  }

  if (designation) {
    mongoQuery.designation = { $regex: designation, $options: 'i' };
  }

  const keywordDocs = await SourcingCandidate.find(mongoQuery)
    .select('-parsedText')
    .limit(topK * 2)
    .lean();

  timings.keyword_ms = Date.now() - t1;

  const t2 = Date.now();
  const semanticMap = new Map(semanticResults.map(r => [r.candidate_id, r.score]));
  const keywordMap = new Map(keywordDocs.map(d => [d._id.toString(), 1]));

  const allIds = new Set([...keywordMap.keys(), ...semanticMap.keys()]);
  const scored = [];

  for (const candidateId of allIds) {
    let candidate = keywordDocs.find(d => d._id.toString() === candidateId);
    
    if (!candidate) {
      try {
        candidate = await SourcingCandidate.findById(candidateId).select('-parsedText').lean();
      } catch (error) {
        console.warn(`Failed to fetch candidate ${candidateId}:`, error.message);
        continue;
      }
    }

    if (!candidate) continue;

    const semScore = semanticMap.get(candidateId) || 0;
    const skillScore = calculateSkillScore(candidate.skills || [], skills || []);
    const expScore = calculateExperienceScore(candidate.totalExperience || 0, experience);
    const locationScore = calculateLocationScore(candidate.location || '', location);
    const designationScore = calculateDesignationScore(candidate.designation || '', designation);

    const totalScore = aiAvailable
      ? (SEMANTIC_WEIGHT * semScore) + (SKILL_WEIGHT * skillScore) + (EXPERIENCE_WEIGHT * expScore)
      : (0.5 * skillScore) + (0.3 * expScore) + (0.2 * locationScore);

    if (totalScore >= scoreThreshold) {
      const { matchedSkills, missingSkills } = analyzeSkillMatch(candidate.skills || [], skills || []);

      scored.push({
        candidateId,
        semanticScore: +semScore.toFixed(4),
        skillScore: +skillScore.toFixed(4),
        experienceScore: +expScore.toFixed(4),
        locationScore: +locationScore.toFixed(4),
        designationScore: +designationScore.toFixed(4),
        totalScore: +totalScore.toFixed(4),
        matchedSkills,
        missingSkills,
        candidate: {
          fullName: candidate.fullName,
          email: candidate.email,
          skills: candidate.skills,
          totalExperience: candidate.totalExperience,
          location: candidate.location,
          designation: candidate.designation,
          currentCompany: candidate.currentCompany,
          summary: candidate.summary
        }
      });
    }
  }

  scored.sort((a, b) => b.totalScore - a.totalScore);
  timings.merge_ms = Date.now() - t2;
  timings.total_ms = (timings.semantic_ms || 0) + timings.keyword_ms + timings.merge_ms;

  await saveJobMatches(jobId, scored.slice(0, topK));

  return {
    results: scored.slice(0, topK),
    total: scored.length,
    timings,
    mode: aiAvailable ? 'hybrid' : 'keyword'
  };
}

function parseExperienceRange(experienceText) {
  const rangeMatch = experienceText.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  }

  const plusMatch = experienceText.match(/(\d+)\+?/);
  if (plusMatch) {
    return { min: parseInt(plusMatch[1]), max: null };
  }

  const exactMatch = experienceText.match(/(\d+)/);
  if (exactMatch) {
    const years = parseInt(exactMatch[1]);
    return { min: years, max: years };
  }

  return { min: null, max: null };
}

function calculateSkillScore(candidateSkills, requiredSkills) {
  if (!requiredSkills || requiredSkills.length === 0) return 1.0;
  if (!candidateSkills || candidateSkills.length === 0) return 0.0;

  const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

  const matchedSkills = requiredSkillsLower.filter(reqSkill =>
    candidateSkillsLower.some(candSkill => candSkill.includes(reqSkill) || reqSkill.includes(candSkill))
  );

  return matchedSkills.length / requiredSkillsLower.length;
}

function calculateExperienceScore(candidateExp, requiredExp) {
  if (!requiredExp) return 1.0;

  const requiredRange = parseExperienceRange(requiredExp);
  if (requiredRange.min === null && requiredRange.max === null) return 1.0;

  if (requiredRange.min !== null && candidateExp < requiredRange.min) {
    return Math.max(0, candidateExp / requiredRange.min);
  }

  if (requiredRange.max !== null && candidateExp > requiredRange.max) {
    const excess = candidateExp - requiredRange.max;
    return Math.max(0.5, 1.0 - (excess / requiredRange.max) * 0.3);
  }

  return 1.0;
}

function calculateLocationScore(candidateLocation, requiredLocation) {
  if (!requiredLocation) return 1.0;
  if (!candidateLocation) return 0.5;

  const candidateLower = candidateLocation.toLowerCase();
  const requiredLower = requiredLocation.toLowerCase();

  if (requiredLower.includes('remote') || requiredLower.includes('wfh') || requiredLower.includes('work from home')) {
    if (candidateLower.includes('remote') || candidateLower.includes('wfh') || candidateLower.includes('work from home')) {
      return 1.0;
    }
    return 0.7;
  }

  if (candidateLower.includes(requiredLower) || requiredLower.includes(candidateLower)) {
    return 1.0;
  }

  return 0.3;
}

function calculateDesignationScore(candidateDesignation, requiredDesignation) {
  if (!requiredDesignation) return 1.0;
  if (!candidateDesignation) return 0.5;

  const candidateLower = candidateDesignation.toLowerCase();
  const requiredLower = requiredDesignation.toLowerCase();

  if (candidateLower.includes(requiredLower) || requiredLower.includes(candidateLower)) {
    return 1.0;
  }

  const seniorityMatch = calculateSeniorityMatch(candidateLower, requiredLower);
  return seniorityMatch;
}

function calculateSeniorityMatch(candidate, required) {
  const seniorityLevels = {
    junior: ['junior', 'jr', 'entry level', 'intern', 'trainee', 'apprentice', 'associate', 'assistant'],
    mid: ['mid', 'mid-level', 'intermediate', 'experienced', 'professional'],
    senior: ['senior', 'sr', 'lead', 'principal', 'staff', 'head', 'chief', 'director', 'manager', 'vp', 'vice president']
  };

  for (const [level, keywords] of Object.entries(seniorityLevels)) {
    const candidateHasLevel = keywords.some(keyword => candidate.includes(keyword));
    const requiredHasLevel = keywords.some(keyword => required.includes(keyword));
    
    if (candidateHasLevel && requiredHasLevel) {
      return 1.0;
    }
  }

  return 0.5;
}

function analyzeSkillMatch(candidateSkills, requiredSkills) {
  const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkillsLower.forEach(requiredSkill => {
    const isMatched = candidateSkillsLower.some(candidateSkill =>
      candidateSkill.includes(requiredSkill) || requiredSkill.includes(candidateSkill)
    );

    if (isMatched) {
      const matched = candidateSkills.find((skill, index) => 
        candidateSkillsLower[index].includes(requiredSkill) || requiredSkill.includes(candidateSkillsLower[index])
      );
      if (matched) matchedSkills.push(matched);
    } else {
      missingSkills.push(requiredSkills.find((skill, index) => 
        requiredSkillsLower[index] === requiredSkill
      ) || requiredSkill);
    }
  });

  return { matchedSkills, missingSkills };
}

async function saveJobMatches(jobId, matches) {
  try {
    await JobMatch.deleteMany({ jobId });

    const matchDocuments = matches.map(match => ({
      jobId: new mongoose.Types.ObjectId(jobId),
      candidateId: new mongoose.Types.ObjectId(match.candidateId),
      semanticScore: match.semanticScore,
      skillScore: match.skillScore,
      experienceScore: match.experienceScore,
      locationScore: match.locationScore,
      designationScore: match.designationScore,
      totalScore: match.totalScore,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (matchDocuments.length > 0) {
      await JobMatch.insertMany(matchDocuments);
      console.log(`Saved ${matchDocuments.length} job matches for job ${jobId}`);
    }

    return matchDocuments.length;
  } catch (error) {
    console.error('Error saving job matches:', error);
    throw error;
  }
}
