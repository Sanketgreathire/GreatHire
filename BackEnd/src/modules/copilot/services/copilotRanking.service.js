import { getRecruiterMemory } from "../../../models/recruiterMemory.model.js";
import { getRecruiterInteractions } from "./interactionTracking.service.js";

const SEMANTIC_WEIGHT = 0.4;
const SKILL_WEIGHT = 0.3;
const EXPERIENCE_WEIGHT = 0.15;
const ADAPTIVE_WEIGHT = 0.15;

export async function rankCandidates(semanticResults, keywordResults, expandedQuery, recruiterMemory, options = {}) {
  const { aiAvailable, queryType, recruiterId } = options;
  
  const semanticMap = new Map(semanticResults.map(r => [r.candidate_id, r.score]));
  const keywordMap = new Map(keywordResults.map(d => [d._id.toString(), 1]));
  
  const allIds = new Set([...keywordMap.keys(), ...semanticMap.keys()]);
  const ranked = [];

  const recruiterInteractions = await getRecruiterInteractions(recruiterId);
  const adaptivePreferences = calculateAdaptivePreferences(recruiterMemory, recruiterInteractions);

  for (const candidateId of allIds) {
    let candidate = keywordResults.find(d => d._id.toString() === candidateId);
    
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
    const skillScore = calculateSkillScore(candidate.skills || [], expandedQuery.expandedSkills || []);
    const expScore = calculateExperienceScore(candidate.totalExperience || 0, expandedQuery.experience);
    const adaptiveScore = calculateAdaptiveScore(candidate, adaptivePreferences, recruiterInteractions);

    const totalScore = aiAvailable
      ? (SEMANTIC_WEIGHT * semScore) + (SKILL_WEIGHT * skillScore) + (EXPERIENCE_WEIGHT * expScore) + (ADAPTIVE_WEIGHT * adaptiveScore)
      : (0.5 * skillScore) + (0.3 * expScore) + (0.2 * adaptiveScore);

    const { matchedSkills, missingSkills } = analyzeSkillMatch(candidate.skills || [], expandedQuery.expandedSkills || []);

    ranked.push({
      ...candidate,
      _scores: {
        semantic: +semScore.toFixed(4),
        skill: +skillScore.toFixed(4),
        experience: +expScore.toFixed(4),
        adaptive: +adaptiveScore.toFixed(4),
        hybrid: +totalScore.toFixed(4)
      },
      _insights: {
        matchQuality: getMatchQuality(totalScore),
        skillMatchPercentage: getSkillMatchPercentage(matchedSkills, missingSkills),
        recommendationReason: getRecommendationReason(candidate, semScore, skillScore, adaptiveScore, queryType),
        riskFactors: identifyRiskFactors(candidate, expandedQuery),
        strengths: identifyStrengths(candidate, expandedQuery)
      },
      matchedSkills,
      missingSkills,
      _metadata: {
        source: semanticMap.has(candidateId) && keywordMap.has(candidateId) ? 'both' : 
                semanticMap.has(candidateId) ? 'semantic' : 'keyword',
        interactionCount: recruiterInteractions.filter(i => i.candidateId.toString() === candidateId).length,
        lastInteraction: getLastInteraction(candidateId, recruiterInteractions),
        isNewCandidate: isNewCandidate(candidate, recruiterInteractions)
      }
    });
  }

  ranked.sort((a, b) => b._scores.hybrid - a._scores.hybrid);

  return ranked;
}

function calculateAdaptivePreferences(recruiterMemory, recruiterInteractions) {
  const preferences = {
    skills: {},
    experience: {},
    locations: {},
    designations: {},
    companies: {}
  };

  if (recruiterMemory.preferences?.skills) {
    recruiterMemory.preferences.skills.forEach(skill => {
      preferences.skills[skill.toLowerCase()] = (preferences.skills[skill.toLowerCase()] || 0) + 2;
    });
  }

  recruiterInteractions.forEach(interaction => {
    const weight = getInteractionWeight(interaction.type);
    
    if (interaction.candidateSkills) {
      interaction.candidateSkills.forEach(skill => {
        preferences.skills[skill.toLowerCase()] = (preferences.skills[skill.toLowerCase()] || 0) + weight;
      });
    }

    if (interaction.candidateExperience !== undefined) {
      const expRange = getExperienceRange(interaction.candidateExperience);
      preferences.experience[expRange] = (preferences.experience[expRange] || 0) + weight;
    }

    if (interaction.candidateLocation) {
      const location = interaction.candidateLocation.toLowerCase();
      preferences.locations[location] = (preferences.locations[location] || 0) + weight;
    }

    if (interaction.candidateDesignation) {
      const designation = interaction.candidateDesignation.toLowerCase();
      preferences.designations[designation] = (preferences.designations[designation] || 0) + weight;
    }

    if (interaction.candidateCompany) {
      const company = interaction.candidateCompany.toLowerCase();
      preferences.companies[company] = (preferences.companies[company] || 0) + weight;
    }
  });

  return preferences;
}

function calculateAdaptiveScore(candidate, adaptivePreferences, recruiterInteractions) {
  let score = 0.5;

  if (candidate.skills) {
    const skillScore = candidate.skills.reduce((acc, skill) => {
      const preference = adaptivePreferences.skills[skill.toLowerCase()];
      return acc + (preference || 0);
    }, 0) / candidate.skills.length;
    score += Math.min(0.3, skillScore / 10);
  }

  const candidateExpRange = getExperienceRange(candidate.totalExperience);
  if (adaptivePreferences.experience[candidateExpRange]) {
    score += Math.min(0.2, adaptivePreferences.experience[candidateExpRange] / 5);
  }

  if (candidate.location && adaptivePreferences.locations[candidate.location.toLowerCase()]) {
    score += Math.min(0.15, adaptivePreferences.locations[candidate.location.toLowerCase()] / 3);
  }

  if (candidate.designation && adaptivePreferences.designations[candidate.designation.toLowerCase()]) {
    score += Math.min(0.15, adaptivePreferences.designations[candidate.designation.toLowerCase()] / 3);
  }

  const previousInteractions = recruiterInteractions.filter(i => 
    i.candidateId.toString() === candidate._id.toString()
  );

  if (previousInteractions.length > 0) {
    const lastInteraction = previousInteractions[previousInteractions.length - 1];
    if (lastInteraction.type === 'shortlisted' || lastInteraction.type === 'contacted') {
      score += 0.1;
    } else if (lastInteraction.type === 'rejected') {
      score -= 0.2;
    }
  }

  return Math.max(0, Math.min(1, score));
}

function getInteractionWeight(interactionType) {
  const weights = {
    'viewed': 1,
    'shortlisted': 3,
    'contacted': 5,
    'interviewed': 4,
    'rejected': -2
  };
  return weights[interactionType] || 0;
}

function getExperienceRange(experience) {
  if (experience < 2) return 'entry';
  if (experience < 5) return 'junior';
  if (experience < 10) return 'mid';
  if (experience < 15) return 'senior';
  return 'lead';
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

  const rangeMatch = requiredExp.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    if (candidateExp >= min && candidateExp <= max) return 1.0;
    if (candidateExp < min) return Math.max(0, candidateExp / min);
    if (candidateExp > max) return Math.max(0.5, 1.0 - ((candidateExp - max) / max) * 0.3);
  }

  const plusMatch = requiredExp.match(/(\d+)\+?/);
  if (plusMatch) {
    const min = parseInt(plusMatch[1]);
    return candidateExp >= min ? 1.0 : Math.max(0, candidateExp / min);
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

function getMatchQuality(score) {
  if (score >= 0.8) return 'excellent';
  if (score >= 0.6) return 'good';
  if (score >= 0.4) return 'fair';
  return 'poor';
}

function getSkillMatchPercentage(matchedSkills, missingSkills) {
  const total = (matchedSkills?.length || 0) + (missingSkills?.length || 0);
  if (total === 0) return 0;
  return Math.round(((matchedSkills?.length || 0) / total) * 100);
}

function getRecommendationReason(candidate, semScore, skillScore, adaptiveScore, queryType) {
  const reasons = [];

  if (semScore >= 0.8) reasons.push("Strong semantic similarity");
  if (skillScore >= 0.8) reasons.push("Excellent skill match");
  if (adaptiveScore >= 0.7) reasons.push("Matches your preferences");
  
  if (candidate.totalExperience >= 10) reasons.push("Extensive experience");
  if (candidate.currentCompany?.toLowerCase().includes('startup')) reasons.push("Startup experience");
  if (candidate.skills?.length >= 10) reasons.push("Diverse skill set");

  if (reasons.length === 0) reasons.push("Potential match");
  return reasons.join(", ");
}

function identifyRiskFactors(candidate, expandedQuery) {
  const risks = [];

  if (!candidate.skills || candidate.skills.length === 0) {
    risks.push("No skills listed");
  }

  if (candidate.totalExperience < 1) {
    risks.push("Limited experience");
  }

  if (!candidate.location) {
    risks.push("Location not specified");
  }

  if (expandedQuery.experience && candidate.totalExperience < 2) {
    risks.push("Experience may be insufficient");
  }

  return risks;
}

function identifyStrengths(candidate, expandedQuery) {
  const strengths = [];

  if (candidate.totalExperience >= 5) {
    strengths.push("Experienced professional");
  }

  if (candidate.skills && candidate.skills.length >= 8) {
    strengths.push("Broad skill set");
  }

  if (candidate.currentCompany && candidate.currentCompany.length > 0) {
    strengths.push("Current employment");
  }

  if (candidate.summary && candidate.summary.length > 100) {
    strengths.push("Detailed profile");
  }

  return strengths;
}

function getLastInteraction(candidateId, recruiterInteractions) {
  const interactions = recruiterInteractions.filter(i => i.candidateId.toString() === candidateId);
  if (interactions.length === 0) return null;
  
  return interactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
}

function isNewCandidate(candidate, recruiterInteractions) {
  return !recruiterInteractions.some(i => i.candidateId.toString() === candidate._id.toString());
}

export async function getPersonalizedRecommendations(recruiterId, options = {}) {
  const { type = 'all', limit = 10 } = options;
  
  const recruiterMemory = await getRecruiterMemory(recruiterId);
  const recruiterInteractions = await getRecruiterInteractions(recruiterId);
  
  const recommendations = {
    hiddenGems: [],
    adjacentSkills: [],
    startupExperience: [],
    highSemanticMatch: [],
    recentActivity: []
  };

  if (type === 'all' || type === 'hiddenGems') {
    recommendations.hiddenGems = await getHiddenGemCandidates(recruiterId, recruiterInteractions, limit);
  }

  if (type === 'all' || type === 'adjacentSkills') {
    recommendations.adjacentSkills = await getAdjacentSkillCandidates(recruiterMemory, recruiterInteractions, limit);
  }

  if (type === 'all' || type === 'startupExperience') {
    recommendations.startupExperience = await getStartupExperienceCandidates(recruiterInteractions, limit);
  }

  if (type === 'all' || type === 'highSemanticMatch') {
    recommendations.highSemanticMatch = await getHighSemanticMatchCandidates(recruiterMemory, limit);
  }

  if (type === 'all' || type === 'recentActivity') {
    recommendations.recentActivity = await getRecentActivityCandidates(recruiterInteractions, limit);
  }

  return recommendations;
}

async function getHiddenGemCandidates(recruiterId, recruiterInteractions, limit) {
  const interactedIds = recruiterInteractions.map(i => i.candidateId);
  
  const candidates = await SourcingCandidate.find({
    _id: { $nin: interactedIds },
    skills: { $exists: true, $ne: [] },
    totalExperience: { $gte: 2 }
  })
  .select('-parsedText')
  .limit(limit * 2)
  .lean();

  return candidates.slice(0, limit).map(candidate => ({
    ...candidate,
    reason: "Hidden gem - not previously viewed",
    _metadata: {
      isNew: true,
      interactionCount: 0
    }
  }));
}

async function getAdjacentSkillCandidates(recruiterMemory, recruiterInteractions, limit) {
  const preferredSkills = recruiterMemory.preferences?.skills || [];
  if (preferredSkills.length === 0) return [];

  const adjacentSkills = [];
  preferredSkills.forEach(skill => {
    const techStack = TECHNOLOGY_STACK_MAP[skill.toLowerCase()];
    if (techStack) {
      adjacentSkills.push(...techStack);
    }
  });

  const candidates = await SourcingCandidate.find({
    skills: { $in: adjacentSkills },
    _id: { $nin: recruiterInteractions.map(i => i.candidateId).slice(-20) }
  })
  .select('-parsedText')
  .limit(limit)
  .lean();

  return candidates.map(candidate => ({
    ...candidate,
    reason: "Adjacent skills to your preferences",
    _metadata: {
      adjacentSkills: candidate.skills?.filter(skill => 
        adjacentSkills.some(adj => adj.toLowerCase() === skill.toLowerCase())
      ) || []
    }
  }));
}

async function getStartupExperienceCandidates(recruiterInteractions, limit) {
  const candidates = await SourcingCandidate.find({
    currentCompany: { $regex: /startup|inc|llc|technologies|solutions/i },
    _id: { $nin: recruiterInteractions.map(i => i.candidateId).slice(-10) }
  })
  .select('-parsedText')
  .limit(limit)
  .lean();

  return candidates.map(candidate => ({
    ...candidate,
    reason: "Startup experience",
    _metadata: {
      companyType: "startup"
    }
  }));
}

async function getHighSemanticMatchCandidates(recruiterMemory, limit) {
  const preferredSkills = recruiterMemory.preferences?.skills || [];
  if (preferredSkills.length === 0) return [];

  const candidates = await SourcingCandidate.find({
    skills: { $in: preferredSkills }
  })
  .select('-parsedText')
  .limit(limit)
  .lean();

  return candidates.map(candidate => ({
    ...candidate,
    reason: "High semantic match to your preferences",
    _metadata: {
      semanticScore: 0.8
    }
  }));
}

async function getRecentActivityCandidates(recruiterInteractions, limit) {
  const recentInteractions = recruiterInteractions
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);

  const candidateIds = recentInteractions.map(i => i.candidateId);
  const candidates = await SourcingCandidate.find({
    _id: { $in: candidateIds }
  })
  .select('-parsedText')
  .lean();

  return candidates.map(candidate => {
    const interaction = recentInteractions.find(i => i.candidateId.toString() === candidate._id.toString());
    return {
      ...candidate,
      reason: `Recently ${interaction.type}`,
      _metadata: {
        lastInteraction: interaction,
        interactionType: interaction.type
      }
    };
  });
}
