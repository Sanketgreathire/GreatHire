import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";
import { enqueueLearningJob } from "./learningQueue.service.js";

export async function getRecruiterPreferences(recruiterId) {
  try {
    const learningRecord = await getRecruiterLearningRecord(recruiterId);
    
    if (!learningRecord) {
      return getDefaultPreferences();
    }

    const preferences = learningRecord.learnedPreferences || {};
    const customWeights = learningRecord.customWeights || {};

    return {
      preferredSkills: preferences.preferredSkills || [],
      preferredIndustries: preferences.preferredIndustries || [],
      preferredExperienceLevels: preferences.preferredExperienceLevels || [],
      preferredCompanyTypes: preferences.preferredCompanyTypes || [],
      preferredLocations: preferences.preferredLocations || [],
      skillWeights: preferences.skillWeights || {},
      locationWeights: preferences.locationWeights || {},
      experienceWeights: preferences.experienceWeights || {},
      companyWeights: preferences.companyWeights || {},
      customWeights,
      lastUpdated: learningRecord.lastPreferenceUpdate,
      confidence: calculatePreferenceConfidence(learningRecord)
    };
  } catch (error) {
    console.error("Error in getRecruiterPreferences:", error);
    return getDefaultPreferences();
  }
}

export async function updateRecruiterPreferences(recruiterId, preferenceData) {
  try {
    const learningJob = {
      recruiterId,
      preferenceData,
      updateType: 'manual',
      updatedAt: new Date()
    };

    const jobId = await enqueueLearningJob('update-preferences', learningJob);

    return {
      success: true,
      jobId,
      message: "Recruiter preferences update queued for processing"
    };
  } catch (error) {
    console.error("Error in updateRecruiterPreferences:", error);
    throw new Error(`Failed to update recruiter preferences: ${error.message}`);
  }
}

export async function learnFromInteractions(recruiterId, interactions) {
  try {
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    if (aiAvailable) {
      return await learnWithAI(recruiterId, interactions);
    } else {
      return await learnWithRules(recruiterId, interactions);
    }
  } catch (error) {
    console.error("Error in learnFromInteractions:", error);
    throw new Error(`Failed to learn from interactions: ${error.message}`);
  }
}

async function learnWithAI(recruiterId, interactions) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const prompt = buildLearningPrompt(interactions);

    const response = await axios.default.post(
      `${AI_BASE_URL}/learn/preferences`,
      {
        prompt,
        recruiterId,
        interactions,
        learningContext: {
          totalInteractions: interactions.length,
          timeRange: calculateTimeRange(interactions),
          interactionTypes: [...new Set(interactions.map(i => i.action))]
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 15000
      }
    );

    const learnedPreferences = response.data.preferences || {};
    
    const learningJob = {
      recruiterId,
      learnedPreferences,
      updateType: 'ai_learning',
      confidence: response.data.confidence || 0.5,
      updatedAt: new Date()
    };

    const jobId = await enqueueLearningJob('update-preferences', learningJob);

    return {
      success: true,
      jobId,
      learnedPreferences,
      confidence: response.data.confidence || 0.5,
      method: 'ai'
    };
  } catch (error) {
    console.warn("AI learning failed, using rules:", error.message);
    return await learnWithRules(recruiterId, interactions);
  }
}

function buildLearningPrompt(interactions) {
  let prompt = `Learn recruiter preferences from these interactions:\n\n`;
  
  prompt += `INTERACTIONS:\n`;
  interactions.forEach((interaction, index) => {
    prompt += `${index + 1}. Action: ${interaction.action}, Candidate: ${interaction.candidateId}, Context: ${JSON.stringify(interaction.context || {})}, Timestamp: ${interaction.timestamp}\n`;
  });
  
  prompt += `\nPREFERENCE LEARNING REQUIREMENTS:\n`;
  prompt += `1. Identify preferred skills from successful interactions (shortlisted, contacted, hired)\n`;
  prompt += `2. Identify preferred industries from successful candidates\n`;
  prompt += `3. Determine preferred experience levels\n`;
  prompt += `4. Identify preferred company types\n`;
  prompt += `5. Determine preferred locations\n`;
  prompt += `6. Calculate skill weights based on success patterns\n`;
  prompt += `7. Calculate location weights based on success patterns\n`;
  prompt += `8. Calculate experience weights based on success patterns\n`;
  prompt += `9. Calculate company weights based on success patterns\n`;
  prompt += `10. Provide confidence scores for each learned preference\n`;
  prompt += `11. Return structured JSON with all preferences and weights\n`;
  
  return prompt;
}

async function learnWithRules(recruiterId, interactions) {
  try {
    const learnedPreferences = extractPreferencesFromInteractions(interactions);
    
    const learningJob = {
      recruiterId,
      learnedPreferences,
      updateType: 'rule_learning',
      confidence: calculateRuleBasedConfidence(interactions),
      updatedAt: new Date()
    };

    const jobId = await enqueueLearningJob('update-preferences', learningJob);

    return {
      success: true,
      jobId,
      learnedPreferences,
      confidence: calculateRuleBasedConfidence(interactions),
      method: 'rules'
    };
  } catch (error) {
    console.error("Error in rule-based learning:", error);
    throw error;
  }
}

async function extractPreferencesFromInteractions(interactions) {
  try {
    const successfulInteractions = interactions.filter(interaction => 
      ['shortlisted', 'contacted', 'hired', 'interviewed'].includes(interaction.action)
    );

    const rejectedInteractions = interactions.filter(interaction => 
      ['rejected', 'not_interested'].includes(interaction.action)
    );

    const preferences = {
      preferredSkills: [],
      preferredIndustries: [],
      preferredExperienceLevels: [],
      preferredCompanyTypes: [],
      preferredLocations: [],
      skillWeights: {},
      locationWeights: {},
      experienceWeights: {},
      companyWeights: {}
    };

    if (successfulInteractions.length > 0) {
      const candidateData = await Promise.all(
        successfulInteractions.map(interaction => getCandidateData(interaction.candidateId))
      );

      preferences.preferredSkills = extractPreferredSkills(candidateData, rejectedInteractions);
      preferences.preferredIndustries = extractPreferredIndustries(candidateData, rejectedInteractions);
      preferences.preferredExperienceLevels = extractPreferredExperienceLevels(candidateData, rejectedInteractions);
      preferences.preferredCompanyTypes = extractPreferredCompanyTypes(candidateData, rejectedInteractions);
      preferences.preferredLocations = extractPreferredLocations(candidateData, rejectedInteractions);

      preferences.skillWeights = calculateSkillWeights(candidateData, rejectedInteractions);
      preferences.locationWeights = calculateLocationWeights(candidateData, rejectedInteractions);
      preferences.experienceWeights = calculateExperienceWeights(candidateData, rejectedInteractions);
      preferences.companyWeights = calculateCompanyWeights(candidateData, rejectedInteractions);
    }

    return preferences;
  } catch (error) {
    console.error("Error extracting preferences from interactions:", error);
    return getDefaultPreferences();
  }
}

function extractPreferredSkills(candidateData, rejectedInteractions) {
  try {
    const skillCounts = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      if (rejectedCandidates.has(candidate._id?.toString())) return;
      
      const skills = candidate.skills || [];
      skills.forEach(skill => {
        const normalizedSkill = skill.toLowerCase().trim();
        skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
      });
    });

    const sortedSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([skill]) => skill);

    return sortedSkills;
  } catch (error) {
    console.error("Error extracting preferred skills:", error);
    return [];
  }
}

function extractPreferredIndustries(candidateData, rejectedInteractions) {
  try {
    const industryCounts = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      if (rejectedCandidates.has(candidate._id?.toString())) return;
      
      const company = candidate.currentCompany || '';
      const industry = inferIndustryFromCompany(company);
      
      if (industry) {
        industryCounts[industry] = (industryCounts[industry] || 0) + 1;
      }
    });

    const sortedIndustries = Object.entries(industryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([industry]) => industry);

    return sortedIndustries;
  } catch (error) {
    console.error("Error extracting preferred industries:", error);
    return [];
  }
}

function extractPreferredExperienceLevels(candidateData, rejectedInteractions) {
  try {
    const experienceCounts = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      if (rejectedCandidates.has(candidate._id?.toString())) return;
      
      const experience = candidate.totalExperience || 0;
      const level = getExperienceLevel(experience);
      
      experienceCounts[level] = (experienceCounts[level] || 0) + 1;
    });

    const sortedLevels = Object.entries(experienceCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([level]) => level);

    return sortedLevels;
  } catch (error) {
    console.error("Error extracting preferred experience levels:", error);
    return [];
  }
}

function extractPreferredCompanyTypes(candidateData, rejectedInteractions) {
  try {
    const companyTypeCounts = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      if (rejectedCandidates.has(candidate._id?.toString())) return;
      
      const company = candidate.currentCompany || '';
      const companyType = inferCompanyType(company);
      
      if (companyType) {
        companyTypeCounts[companyType] = (companyTypeCounts[companyType] || 0) + 1;
      }
    });

    const sortedTypes = Object.entries(companyTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([type]) => type);

    return sortedTypes;
  } catch (error) {
    console.error("Error extracting preferred company types:", error);
    return [];
  }
}

function extractPreferredLocations(candidateData, rejectedInteractions) {
  try {
    const locationCounts = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      if (rejectedCandidates.has(candidate._id?.toString())) return;
      
      const location = candidate.location || '';
      
      if (location) {
        const normalizedLocation = location.toLowerCase().trim();
        locationCounts[normalizedLocation] = (locationCounts[normalizedLocation] || 0) + 1;
      }
    });

    const sortedLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([location]) => location);

    return sortedLocations;
  } catch (error) {
    console.error("Error extracting preferred locations:", error);
    return [];
  }
}

function calculateSkillWeights(candidateData, rejectedInteractions) {
  try {
    const skillWeights = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      const isRejected = rejectedCandidates.has(candidate._id?.toString());
      const weightMultiplier = isRejected ? -1 : 1;
      
      const skills = candidate.skills || [];
      skills.forEach(skill => {
        const normalizedSkill = skill.toLowerCase().trim();
        skillWeights[normalizedSkill] = (skillWeights[normalizedSkill] || 0) + (1 * weightMultiplier);
      });
    });

    const normalizedWeights = {};
    const maxWeight = Math.max(...Object.values(skillWeights).map(Math.abs));
    
    if (maxWeight > 0) {
      Object.entries(skillWeights).forEach(([skill, weight]) => {
        normalizedWeights[skill] = (weight / maxWeight) * 100;
      });
    }

    return normalizedWeights;
  } catch (error) {
    console.error("Error calculating skill weights:", error);
    return {};
  }
}

function calculateLocationWeights(candidateData, rejectedInteractions) {
  try {
    const locationWeights = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      const isRejected = rejectedCandidates.has(candidate._id?.toString());
      const weightMultiplier = isRejected ? -1 : 1;
      
      const location = candidate.location || '';
      if (location) {
        const normalizedLocation = location.toLowerCase().trim();
        locationWeights[normalizedLocation] = (locationWeights[normalizedLocation] || 0) + (1 * weightMultiplier);
      }
    });

    const normalizedWeights = {};
    const maxWeight = Math.max(...Object.values(locationWeights).map(Math.abs));
    
    if (maxWeight > 0) {
      Object.entries(locationWeights).forEach(([location, weight]) => {
        normalizedWeights[location] = (weight / maxWeight) * 100;
      });
    }

    return normalizedWeights;
  } catch (error) {
    console.error("Error calculating location weights:", error);
    return {};
  }
}

function calculateExperienceWeights(candidateData, rejectedInteractions) {
  try {
    const experienceWeights = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      const isRejected = rejectedCandidates.has(candidate._id?.toString());
      const weightMultiplier = isRejected ? -1 : 1;
      
      const experience = candidate.totalExperience || 0;
      const level = getExperienceLevel(experience);
      
      experienceWeights[level] = (experienceWeights[level] || 0) + (1 * weightMultiplier);
    });

    const normalizedWeights = {};
    const maxWeight = Math.max(...Object.values(experienceWeights).map(Math.abs));
    
    if (maxWeight > 0) {
      Object.entries(experienceWeights).forEach(([level, weight]) => {
        normalizedWeights[level] = (weight / maxWeight) * 100;
      });
    }

    return normalizedWeights;
  } catch (error) {
    console.error("Error calculating experience weights:", error);
    return {};
  }
}

function calculateCompanyWeights(candidateData, rejectedInteractions) {
  try {
    const companyWeights = {};
    const rejectedCandidates = new Set(rejectedInteractions.map(i => i.candidateId));

    candidateData.forEach((candidate, index) => {
      const isRejected = rejectedCandidates.has(candidate._id?.toString());
      const weightMultiplier = isRejected ? -1 : 1;
      
      const company = candidate.currentCompany || '';
      if (company) {
        const normalizedCompany = company.toLowerCase().trim();
        companyWeights[normalizedCompany] = (companyWeights[normalizedCompany] || 0) + (1 * weightMultiplier);
      }
    });

    const normalizedWeights = {};
    const maxWeight = Math.max(...Object.values(companyWeights).map(Math.abs));
    
    if (maxWeight > 0) {
      Object.entries(companyWeights).forEach(([company, weight]) => {
        normalizedWeights[company] = (weight / maxWeight) * 100;
      });
    }

    return normalizedWeights;
  } catch (error) {
    console.error("Error calculating company weights:", error);
    return {};
  }
}

function inferIndustryFromCompany(company) {
  if (!company) return null;
  
  const companyLower = company.toLowerCase();
  
  const industryMap = {
    'google': 'technology',
    'microsoft': 'technology',
    'amazon': 'technology',
    'facebook': 'technology',
    'apple': 'technology',
    'netflix': 'technology',
    'uber': 'technology',
    'airbnb': 'technology',
    'spotify': 'technology',
    'linkedin': 'technology',
    'twitter': 'technology',
    'instagram': 'technology',
    'jpmorgan': 'finance',
    'goldman sachs': 'finance',
    'bank of america': 'finance',
    'citibank': 'finance',
    'wells fargo': 'finance',
    'mckinsey': 'consulting',
    'deloitte': 'consulting',
    'accenture': 'consulting',
    'pwc': 'consulting',
    'kpmg': 'consulting',
    'ernst & young': 'consulting',
    'johnson & johnson': 'healthcare',
    'pfizer': 'healthcare',
    'merck': 'healthcare',
    'novartis': 'healthcare',
    'procter & gamble': 'consumer',
    'coca-cola': 'consumer',
    'pepsico': 'consumer',
    'nestle': 'consumer',
    'unilever': 'consumer',
    'toyota': 'automotive',
    'ford': 'automotive',
    'general motors': 'automotive',
    'volkswagen': 'automotive',
    'bmw': 'automotive'
  };

  for (const [key, industry] of Object.entries(industryMap)) {
    if (companyLower.includes(key)) {
      return industry;
    }
  }

  return null;
}

function inferCompanyType(company) {
  if (!company) return null;
  
  const companyLower = company.toLowerCase();
  
  if (companyLower.includes('startup') || companyLower.includes('inc.') || companyLower.includes('llc')) {
    return 'startup';
  }
  
  if (companyLower.includes('corporation') || companyLower.includes('corp') || companyLower.includes('ltd')) {
    return 'enterprise';
  }
  
  if (companyLower.includes('university') || companyLower.includes('college')) {
    return 'academic';
  }
  
  if (companyLower.includes('government') || companyLower.includes('federal') || companyLower.includes('state')) {
    return 'government';
  }
  
  return null;
}

function getExperienceLevel(experience) {
  if (experience < 2) return 'entry';
  if (experience < 5) return 'junior';
  if (experience < 8) return 'mid';
  return 'senior';
}

function calculateTimeRange(interactions) {
  if (interactions.length === 0) return 'unknown';
  
  const timestamps = interactions.map(i => new Date(i.timestamp));
  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date(Math.max(...timestamps));
  const daysDiff = Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 7) return 'week';
  if (daysDiff <= 30) return 'month';
  if (daysDiff <= 90) return 'quarter';
  if (daysDiff <= 365) return 'year';
  return 'long_term';
}

function calculateRuleBasedConfidence(interactions) {
  try {
    if (interactions.length < 5) return 0.2;
    if (interactions.length < 10) return 0.4;
    if (interactions.length < 25) return 0.6;
    if (interactions.length < 50) return 0.8;
    return 0.9;
  } catch (error) {
    console.error("Error calculating rule-based confidence:", error);
    return 0.5;
  }
}

function calculatePreferenceConfidence(learningRecord) {
  try {
    if (!learningRecord || !learningRecord.learnedPreferences) {
      return 0;
    }

    const preferences = learningRecord.learnedPreferences;
    const interactionCount = learningRecord.interactionHistory?.length || 0;
    
    let confidence = 0;
    
    if (preferences.preferredSkills && preferences.preferredSkills.length > 0) {
      confidence += 20;
    }
    
    if (preferences.skillWeights && Object.keys(preferences.skillWeights).length > 0) {
      confidence += 20;
    }
    
    if (preferences.preferredIndustries && preferences.preferredIndustries.length > 0) {
      confidence += 15;
    }
    
    if (preferences.preferredExperienceLevels && preferences.preferredExperienceLevels.length > 0) {
      confidence += 15;
    }
    
    if (preferences.preferredLocations && preferences.preferredLocations.length > 0) {
      confidence += 15;
    }
    
    if (interactionCount >= 10) {
      confidence += 15;
    } else if (interactionCount >= 5) {
      confidence += 10;
    }

    return Math.min(confidence, 100);
  } catch (error) {
    console.error("Error calculating preference confidence:", error);
    return 0;
  }
}

function getDefaultPreferences() {
  return {
    preferredSkills: [],
    preferredIndustries: [],
    preferredExperienceLevels: [],
    preferredCompanyTypes: [],
    preferredLocations: [],
    skillWeights: {},
    locationWeights: {},
    experienceWeights: {},
    companyWeights: {},
    customWeights: {},
    lastUpdated: null,
    confidence: 0
  };
}

export async function getRecruiterLearningRecord(recruiterId) {
  try {
    const RecruiterLearning = await import("../../models/recruiterLearning.model.js");
    const record = await RecruiterLearning.default.findOne({ recruiterId }).lean();
    return record;
  } catch (error) {
    console.error("Error getting recruiter learning record:", error);
    return null;
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
