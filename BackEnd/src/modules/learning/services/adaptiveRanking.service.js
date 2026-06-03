import { getRecruiterLearningRecord } from "./recruiterPreference.service.js";
import { getRecruiterBehavior } from "./hiringBehavior.service.js";
import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

export async function getAdaptiveRanking(recruiterId, options = {}) {
  try {
    const { candidateIds, context = {}, rankingType = 'default' } = options;

    const [learningRecord, behaviorData] = await Promise.all([
      getRecruiterLearningRecord(recruiterId),
      getRecruiterBehavior(recruiterId)
    ]);

    const rankingScores = await Promise.all(
      candidateIds.map(candidateId => 
        calculateCandidateRankingScore(recruiterId, candidateId, learningRecord, behaviorData, context, rankingType)
      )
    );

    const rankedCandidates = candidateIds.map((candidateId, index) => ({
      candidateId,
      rankingScore: rankingScores[index],
      components: rankingScores[index].components,
      confidence: rankingScores[index].confidence
    })).sort((a, b) => b.rankingScore.totalScore - a.rankingScore.totalScore);

    return {
      success: true,
      rankedCandidates,
      rankingMetadata: {
        recruiterId,
        rankingType,
        context,
        totalCandidates: candidateIds.length,
        learningModelVersion: learningRecord?.modelVersion || '1.0',
        generatedAt: new Date()
      }
    };
  } catch (error) {
    console.error("Error in getAdaptiveRanking:", error);
    throw new Error(`Failed to get adaptive ranking: ${error.message}`);
  }
}

async function calculateCandidateRankingScore(recruiterId, candidateId, learningRecord, behaviorData, context, rankingType) {
  try {
    const components = {
      preferenceScore: 0,
      behaviorScore: 0,
      semanticScore: 0,
      historicalScore: 0,
      contextScore: 0
    };

    if (rankingType === 'default' || rankingType === 'semantic') {
      components.semanticScore = await calculateSemanticScore(candidateId, learningRecord);
    }

    if (rankingType === 'default' || rankingType === 'behavioral') {
      components.behaviorScore = calculateBehaviorScore(candidateId, behaviorData);
    }

    if (rankingType === 'default' || rankingType === 'hybrid') {
      components.preferenceScore = calculatePreferenceScore(candidateId, learningRecord);
      components.historicalScore = calculateHistoricalScore(candidateId, learningRecord);
    }

    if (context && Object.keys(context).length > 0) {
      components.contextScore = calculateContextScore(candidateId, context, learningRecord);
    }

    const weights = getRankingWeights(rankingType, learningRecord);
    const totalScore = Object.entries(components).reduce((sum, [key, value]) => {
      return sum + (value * (weights[key] || 0));
    }, 0);

    const confidence = calculateRankingConfidence(components, learningRecord);

    return {
      totalScore: Math.round(totalScore),
      components,
      confidence,
      rank: 0
    };
  } catch (error) {
    console.error("Error calculating candidate ranking score:", error);
    return {
      totalScore: 0,
      components: {
        preferenceScore: 0,
        behaviorScore: 0,
        semanticScore: 0,
        historicalScore: 0,
        contextScore: 0
      },
      confidence: 0,
      rank: 0
    };
  }
}

async function calculateSemanticScore(candidateId, learningRecord) {
  try {
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    if (!aiAvailable) {
      return calculateRuleBasedSemanticScore(candidateId, learningRecord);
    }

    return await calculateAIBasedSemanticScore(candidateId, learningRecord);
  } catch (error) {
    console.error("Error calculating semantic score:", error);
    return 0;
  }
}

async function calculateAIBasedSemanticScore(candidateId, learningRecord) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const candidateData = await getCandidateData(candidateId);
    const recruiterProfile = learningRecord?.learnedPreferences || {};

    const response = await axios.default.post(
      `${AI_BASE_URL}/rank/semantic`,
      {
        candidate: candidateData,
        recruiterProfile,
        rankingContext: {
          interactionHistory: learningRecord?.interactionHistory || [],
          preferences: recruiterProfile,
          behavior: learningRecord?.behavioralPatterns || {}
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 10000
      }
    );

    return response.data.semanticScore || 0;
  } catch (error) {
    console.warn("AI semantic scoring failed, using rules:", error.message);
    return calculateRuleBasedSemanticScore(candidateId, learningRecord);
  }
}

function calculateRuleBasedSemanticScore(candidateId, learningRecord) {
  try {
    const candidateData = getCandidateDataSync(candidateId);
    const preferences = learningRecord?.learnedPreferences || {};
    
    let score = 0;
    const maxScore = 100;

    if (preferences.preferredSkills && preferences.preferredSkills.length > 0) {
      const candidateSkills = candidateData.skills || [];
      const skillMatches = candidateSkills.filter(skill => 
        preferences.preferredSkills.some(pref => 
          skill.toLowerCase().includes(pref.toLowerCase()) || 
          pref.toLowerCase().includes(skill.toLowerCase())
        )
      );
      score += Math.min((skillMatches.length / preferences.preferredSkills.length) * 30, 30);
    }

    if (preferences.preferredIndustries && preferences.preferredIndustries.length > 0) {
      const candidateCompany = candidateData.currentCompany || '';
      const industryMatches = preferences.preferredIndustries.filter(industry => 
        candidateCompany.toLowerCase().includes(industry.toLowerCase())
      );
      score += Math.min((industryMatches.length / preferences.preferredIndustries.length) * 20, 20);
    }

    if (preferences.preferredExperienceLevels && preferences.preferredExperienceLevels.length > 0) {
      const candidateExperience = candidateData.totalExperience || 0;
      const experienceMatch = preferences.preferredExperienceLevels.some(level => {
        if (level === 'entry' && candidateExperience < 2) return true;
        if (level === 'junior' && candidateExperience >= 2 && candidateExperience < 5) return true;
        if (level === 'mid' && candidateExperience >= 5 && candidateExperience < 8) return true;
        if (level === 'senior' && candidateExperience >= 8) return true;
        return false;
      });
      if (experienceMatch) score += 15;
    }

    if (preferences.preferredLocations && preferences.preferredLocations.length > 0) {
      const candidateLocation = candidateData.location || '';
      const locationMatches = preferences.preferredLocations.filter(location => 
        candidateLocation.toLowerCase().includes(location.toLowerCase())
      );
      score += Math.min((locationMatches.length / preferences.preferredLocations.length) * 15, 15);
    }

    if (preferences.preferredCompanyTypes && preferences.preferredCompanyTypes.length > 0) {
      const candidateCompany = candidateData.currentCompany || '';
      const companyTypeMatches = preferences.preferredCompanyTypes.filter(type => 
        candidateCompany.toLowerCase().includes(type.toLowerCase())
      );
      score += Math.min((companyTypeMatches.length / preferences.preferredCompanyTypes.length) * 20, 20);
    }

    return Math.min(score, maxScore);
  } catch (error) {
    console.error("Error calculating rule-based semantic score:", error);
    return 0;
  }
}

function calculateBehaviorScore(candidateId, behaviorData) {
  try {
    if (!behaviorData || !behaviorData.interactionPatterns) {
      return 0;
    }

    const candidateData = getCandidateDataSync(candidateId);
    const patterns = behaviorData.interactionPatterns;
    
    let score = 0;
    const maxScore = 100;

    if (patterns.successfulSkills && patterns.successfulSkills.length > 0) {
      const candidateSkills = candidateData.skills || [];
      const skillMatches = candidateSkills.filter(skill => 
        patterns.successfulSkills.some(successSkill => 
          skill.toLowerCase().includes(successSkill.toLowerCase()) || 
          successSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      score += Math.min((skillMatches.length / patterns.successfulSkills.length) * 40, 40);
    }

    if (patterns.successfulIndustries && patterns.successfulIndustries.length > 0) {
      const candidateCompany = candidateData.currentCompany || '';
      const industryMatches = patterns.successfulIndustries.filter(industry => 
        candidateCompany.toLowerCase().includes(industry.toLowerCase())
      );
      score += Math.min((industryMatches.length / patterns.successfulIndustries.length) * 30, 30);
    }

    if (patterns.successfulExperienceLevels && patterns.successfulExperienceLevels.length > 0) {
      const candidateExperience = candidateData.totalExperience || 0;
      const experienceMatch = patterns.successfulExperienceLevels.some(level => {
        if (level === 'entry' && candidateExperience < 2) return true;
        if (level === 'junior' && candidateExperience >= 2 && candidateExperience < 5) return true;
        if (level === 'mid' && candidateExperience >= 5 && candidateExperience < 8) return true;
        if (level === 'senior' && candidateExperience >= 8) return true;
        return false;
      });
      if (experienceMatch) score += 30;
    }

    return Math.min(score, maxScore);
  } catch (error) {
    console.error("Error calculating behavior score:", error);
    return 0;
  }
}

function calculatePreferenceScore(candidateId, learningRecord) {
  try {
    if (!learningRecord || !learningRecord.learnedPreferences) {
      return 0;
    }

    const preferences = learningRecord.learnedPreferences;
    const candidateData = getCandidateDataSync(candidateId);
    
    let score = 0;
    const maxScore = 100;

    if (preferences.skillWeights && Object.keys(preferences.skillWeights).length > 0) {
      const candidateSkills = candidateData.skills || [];
      let skillScore = 0;
      candidateSkills.forEach(skill => {
        const weight = preferences.skillWeights[skill.toLowerCase()] || 0;
        skillScore += weight;
      });
      score += Math.min(skillScore, 40);
    }

    if (preferences.locationWeights && Object.keys(preferences.locationWeights).length > 0) {
      const candidateLocation = candidateData.location || '';
      const locationWeight = preferences.locationWeights[candidateLocation.toLowerCase()] || 0;
      score += Math.min(locationWeight * 20, 20);
    }

    if (preferences.experienceWeights && Object.keys(preferences.experienceWeights).length > 0) {
      const candidateExperience = candidateData.totalExperience || 0;
      const experienceLevel = getExperienceLevel(candidateExperience);
      const experienceWeight = preferences.experienceWeights[experienceLevel] || 0;
      score += Math.min(experienceWeight * 20, 20);
    }

    if (preferences.companyWeights && Object.keys(preferences.companyWeights).length > 0) {
      const candidateCompany = candidateData.currentCompany || '';
      const companyWeight = preferences.companyWeights[candidateCompany.toLowerCase()] || 0;
      score += Math.min(companyWeight * 20, 20);
    }

    return Math.min(score, maxScore);
  } catch (error) {
    console.error("Error calculating preference score:", error);
    return 0;
  }
}

function calculateHistoricalScore(candidateId, learningRecord) {
  try {
    if (!learningRecord || !learningRecord.interactionHistory) {
      return 0;
    }

    const history = learningRecord.interactionHistory;
    const candidateInteractions = history.filter(interaction => 
      interaction.candidateId === candidateId
    );

    if (candidateInteractions.length === 0) {
      return 0;
    }

    let score = 0;
    const maxScore = 100;

    const actionWeights = {
      'viewed': 5,
      'shortlisted': 20,
      'contacted': 30,
      'interviewed': 40,
      'hired': 50,
      'rejected': -10,
      'not_interested': -5
    };

    candidateInteractions.forEach(interaction => {
      const weight = actionWeights[interaction.action] || 0;
      score += weight;
    });

    const recencyBonus = calculateRecencyBonus(candidateInteractions);
    score += recencyBonus;

    return Math.min(Math.max(score, 0), maxScore);
  } catch (error) {
    console.error("Error calculating historical score:", error);
    return 0;
  }
}

function calculateContextScore(candidateId, context, learningRecord) {
  try {
    if (!context || Object.keys(context).length === 0) {
      return 0;
    }

    let score = 0;
    const maxScore = 100;

    if (context.jobId) {
      const jobAlignmentScore = calculateJobAlignmentScore(candidateId, context.jobId);
      score += Math.min(jobAlignmentScore * 50, 50);
    }

    if (context.searchQuery) {
      const searchAlignmentScore = calculateSearchAlignmentScore(candidateId, context.searchQuery);
      score += Math.min(searchAlignmentScore * 30, 30);
    }

    if (context.prioritySkills && context.prioritySkills.length > 0) {
      const candidateData = getCandidateDataSync(candidateId);
      const candidateSkills = candidateData.skills || [];
      const priorityMatches = context.prioritySkills.filter(skill => 
        candidateSkills.some(candidateSkill => 
          candidateSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(candidateSkill.toLowerCase())
        )
      );
      score += Math.min((priorityMatches.length / context.prioritySkills.length) * 20, 20);
    }

    return Math.min(score, maxScore);
  } catch (error) {
    console.error("Error calculating context score:", error);
    return 0;
  }
}

function getRankingWeights(rankingType, learningRecord) {
  const defaultWeights = {
    preferenceScore: 0.25,
    behaviorScore: 0.25,
    semanticScore: 0.25,
    historicalScore: 0.15,
    contextScore: 0.10
  };

  switch (rankingType) {
    case 'semantic':
      return {
        ...defaultWeights,
        semanticScore: 0.50,
        preferenceScore: 0.20,
        behaviorScore: 0.15,
        historicalScore: 0.10,
        contextScore: 0.05
      };
    
    case 'behavioral':
      return {
        ...defaultWeights,
        behaviorScore: 0.50,
        preferenceScore: 0.20,
        semanticScore: 0.15,
        historicalScore: 0.10,
        contextScore: 0.05
      };
    
    case 'hybrid':
      return {
        ...defaultWeights,
        preferenceScore: 0.30,
        behaviorScore: 0.30,
        semanticScore: 0.20,
        historicalScore: 0.15,
        contextScore: 0.05
      };
    
    default:
      if (learningRecord?.customWeights) {
        return { ...defaultWeights, ...learningRecord.customWeights };
      }
      return defaultWeights;
  }
}

function calculateRankingConfidence(components, learningRecord) {
  try {
    const nonZeroComponents = Object.values(components).filter(score => score > 0).length;
    const totalComponents = Object.keys(components).length;
    
    let baseConfidence = (nonZeroComponents / totalComponents) * 100;
    
    if (learningRecord && learningRecord.interactionHistory) {
      const interactionCount = learningRecord.interactionHistory.length;
      const experienceBonus = Math.min(interactionCount / 10, 20);
      baseConfidence += experienceBonus;
    }

    return Math.min(Math.round(baseConfidence), 100);
  } catch (error) {
    console.error("Error calculating ranking confidence:", error);
    return 50;
  }
}

function calculateRecencyBonus(interactions) {
  try {
    if (interactions.length === 0) return 0;

    const now = new Date();
    const latestInteraction = interactions.reduce((latest, interaction) => {
      const interactionDate = new Date(interaction.timestamp);
      return interactionDate > latest ? interactionDate : latest;
    }, new Date(0));

    const daysSinceLastInteraction = Math.floor((now - latestInteraction) / (1000 * 60 * 60 * 24));

    if (daysSinceLastInteraction <= 7) return 10;
    if (daysSinceLastInteraction <= 30) return 5;
    if (daysSinceLastInteraction <= 90) return 2;
    return 0;
  } catch (error) {
    console.error("Error calculating recency bonus:", error);
    return 0;
  }
}

function calculateJobAlignmentScore(candidateId, jobId) {
  try {
    return 50;
  } catch (error) {
    console.error("Error calculating job alignment score:", error);
    return 0;
  }
}

function calculateSearchAlignmentScore(candidateId, searchQuery) {
  try {
    const candidateData = getCandidateDataSync(candidateId);
    const query = searchQuery.toLowerCase();
    const searchText = `${candidateData.fullName} ${candidateData.headline} ${candidateData.bio} ${(candidateData.skills || []).join(' ')}`.toLowerCase();
    
    const queryTerms = query.split(' ').filter(term => term.length > 2);
    const matchedTerms = queryTerms.filter(term => searchText.includes(term));
    
    return queryTerms.length > 0 ? (matchedTerms.length / queryTerms.length) * 100 : 0;
  } catch (error) {
    console.error("Error calculating search alignment score:", error);
    return 0;
  }
}

async function getCandidateData(candidateId) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    const candidate = await SourcingCandidate.default.findById(candidateId).lean();
    return candidate || {};
  } catch (error) {
    console.error("Error getting candidate data:", error);
    return {};
  }
}

function getCandidateDataSync(candidateId) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting candidate data sync:", error);
    return {};
  }
}

function getExperienceLevel(experience) {
  if (experience < 2) return 'entry';
  if (experience < 5) return 'junior';
  if (experience < 8) return 'mid';
  return 'senior';
}
