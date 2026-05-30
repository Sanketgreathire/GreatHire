import { getRecruiterMemory } from "../../models/recruiterMemory.model.js";
import { getRecruiterInteractions } from "./interactionTracking.service.js";

export async function prepareAdaptiveRanking(recruiterId, options = {}) {
  const { timeRange = '30d', updateWeights = true } = options;
  
  try {
    const recruiterMemory = await getRecruiterMemory(recruiterId);
    const recruiterInteractions = await getRecruiterInteractions(recruiterId, { 
      limit: 1000,
      startDate: getDateRange(timeRange).startDate
    });

    const adaptiveData = {
      skillPreferences: calculateSkillPreferences(recruiterInteractions),
      locationPreferences: calculateLocationPreferences(recruiterInteractions),
      designationPreferences: calculateDesignationPreferences(recruiterInteractions),
      experiencePreferences: calculateExperiencePreferences(recruiterInteractions),
      companyPreferences: calculateCompanyPreferences(recruiterInteractions),
      interactionPatterns: analyzeInteractionPatterns(recruiterInteractions),
      successFactors: identifySuccessFactors(recruiterInteractions),
      rejectionPatterns: analyzeRejectionPatterns(recruiterInteractions),
      temporalPatterns: analyzeTemporalPatterns(recruiterInteractions),
      qualitySignals: calculateQualitySignals(recruiterInteractions)
    };

    if (updateWeights) {
      await updateAdaptiveWeights(recruiterId, adaptiveData, recruiterMemory);
    }

    return adaptiveData;
  } catch (error) {
    console.error('Error preparing adaptive ranking:', error);
    throw new Error(`Adaptive ranking preparation failed: ${error.message}`);
  }
}

function calculateSkillPreferences(interactions) {
  const skillScores = new Map();
  const skillCounts = new Map();
  const skillSuccess = new Map();

  interactions.forEach(interaction => {
    const weight = getInteractionWeight(interaction.interactionType);
    const isSuccess = isSuccessInteraction(interaction);
    
    if (interaction.candidateData?.skills) {
      interaction.candidateData.skills.forEach(skill => {
        const normalizedSkill = skill.toLowerCase();
        
        skillScores.set(normalizedSkill, (skillScores.get(normalizedSkill) || 0) + weight);
        skillCounts.set(normalizedSkill, (skillCounts.get(normalizedSkill) || 0) + 1);
        
        if (isSuccess) {
          skillSuccess.set(normalizedSkill, (skillSuccess.get(normalizedSkill) || 0) + 1);
        }
      });
    }
  });

  const preferences = [];
  skillScores.forEach((score, skill) => {
    const count = skillCounts.get(skill) || 0;
    const successCount = skillSuccess.get(skill) || 0;
    const successRate = count > 0 ? successCount / count : 0;
    
    preferences.push({
      skill,
      score: Math.max(-10, Math.min(10, score)),
      frequency: count,
      successRate: Math.round(successRate * 100) / 100,
      confidence: calculateConfidence(count, interactions.length)
    });
  });

  return preferences
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
}

function calculateLocationPreferences(interactions) {
  const locationScores = new Map();
  const locationCounts = new Map();

  interactions.forEach(interaction => {
    const weight = getInteractionWeight(interaction.interactionType);
    const location = interaction.candidateData?.location?.toLowerCase();
    
    if (location) {
      locationScores.set(location, (locationScores.get(location) || 0) + weight);
      locationCounts.set(location, (locationCounts.get(location) || 0) + 1);
    }
  });

  const preferences = [];
  locationScores.forEach((score, location) => {
    const count = locationCounts.get(location) || 0;
    
    preferences.push({
      location,
      score: Math.max(-10, Math.min(10, score)),
      frequency: count,
      confidence: calculateConfidence(count, interactions.length)
    });
  });

  return preferences
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

function calculateDesignationPreferences(interactions) {
  const designationScores = new Map();
  const designationCounts = new Map();

  interactions.forEach(interaction => {
    const weight = getInteractionWeight(interaction.interactionType);
    const designation = interaction.candidateData?.designation?.toLowerCase();
    
    if (designation) {
      designationScores.set(designation, (designationScores.get(designation) || 0) + weight);
      designationCounts.set(designation, (designationCounts.get(designation) || 0) + 1);
    }
  });

  const preferences = [];
  designationScores.forEach((score, designation) => {
    const count = designationCounts.get(designation) || 0;
    
    preferences.push({
      designation,
      score: Math.max(-10, Math.min(10, score)),
      frequency: count,
      confidence: calculateConfidence(count, interactions.length)
    });
  });

  return preferences
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

function calculateExperiencePreferences(interactions) {
  const experienceScores = new Map();
  const experienceCounts = new Map();

  interactions.forEach(interaction => {
    const weight = getInteractionWeight(interaction.interactionType);
    const experience = interaction.candidateData?.totalExperience || 0;
    const expRange = getExperienceRange(experience);
    
    experienceScores.set(expRange, (experienceScores.get(expRange) || 0) + weight);
    experienceCounts.set(expRange, (experienceCounts.get(expRange) || 0) + 1);
  });

  const preferences = [];
  experienceScores.forEach((score, expRange) => {
    const count = experienceCounts.get(expRange) || 0;
    
    preferences.push({
      experienceRange: expRange,
      score: Math.max(-10, Math.min(10, score)),
      frequency: count,
      confidence: calculateConfidence(count, interactions.length)
    });
  });

  return preferences.sort((a, b) => b.score - a.score);
}

function calculateCompanyPreferences(interactions) {
  const companyScores = new Map();
  const companyCounts = new Map();

  interactions.forEach(interaction => {
    const weight = getInteractionWeight(interaction.interactionType);
    const company = interaction.candidateData?.company?.toLowerCase();
    
    if (company) {
      companyScores.set(company, (companyScores.get(company) || 0) + weight);
      companyCounts.set(company, (companyCounts.get(company) || 0) + 1);
    }
  });

  const preferences = [];
  companyScores.forEach((score, company) => {
    const count = companyCounts.get(company) || 0;
    
    preferences.push({
      company,
      score: Math.max(-10, Math.min(10, score)),
      frequency: count,
      confidence: calculateConfidence(count, interactions.length)
    });
  });

  return preferences
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);
}

function analyzeInteractionPatterns(interactions) {
  const patterns = {
    timeOfDay: analyzeTimeOfDayPattern(interactions),
    dayOfWeek: analyzeDayOfWeekPattern(interactions),
    sessionLength: analyzeSessionLengthPattern(interactions),
    searchToContact: analyzeSearchToContactPattern(interactions),
    viewToShortlist: analyzeViewToShortlistPattern(interactions)
  };

  return patterns;
}

function identifySuccessFactors(interactions) {
  const successFactors = new Map();
  
  interactions.forEach(interaction => {
    if (isSuccessInteraction(interaction)) {
      const factors = extractSuccessFactors(interaction);
      factors.forEach(factor => {
        successFactors.set(factor, (successFactors.get(factor) || 0) + 1);
      });
    }
  });

  const factors = [];
  successFactors.forEach((count, factor) => {
    factors.push({
      factor,
      frequency: count,
      successRate: count / interactions.filter(i => isSuccessInteraction(i)).length
    });
  });

  return factors.sort((a, b) => b.frequency - a.frequency);
}

function analyzeRejectionPatterns(interactions) {
  const rejections = interactions.filter(i => i.interactionType === 'rejected');
  const patterns = {
    reasons: {},
    experienceLevels: {},
    skillGaps: {},
    locations: {}
  };

  rejections.forEach(rejection => {
    if (rejection.feedback?.reason) {
      patterns.reasons[rejection.feedback.reason] = (patterns.reasons[rejection.feedback.reason] || 0) + 1;
    }

    if (rejection.candidateData?.totalExperience !== undefined) {
      const expRange = getExperienceRange(rejection.candidateData.totalExperience);
      patterns.experienceLevels[expRange] = (patterns.experienceLevels[expRange] || 0) + 1;
    }

    if (rejection.metadata?.searchFilters?.skills) {
      const requiredSkills = rejection.metadata.searchFilters.skills;
      const candidateSkills = rejection.candidateData?.skills || [];
      const missingSkills = requiredSkills.filter(req => 
        !candidateSkills.some(cand => cand.toLowerCase().includes(req.toLowerCase()))
      );
      
      missingSkills.forEach(skill => {
        patterns.skillGaps[skill] = (patterns.skillGaps[skill] || 0) + 1;
      });
    }

    if (rejection.candidateData?.location) {
      const location = rejection.candidateData.location.toLowerCase();
      patterns.locations[location] = (patterns.locations[location] || 0) + 1;
    }
  });

  return patterns;
}

function analyzeTemporalPatterns(interactions) {
  const hourlyActivity = new Array(24).fill(0);
  const dailyActivity = new Array(7).fill(0);
  const weeklyActivity = new Array(52).fill(0);

  interactions.forEach(interaction => {
    const date = new Date(interaction.timestamp);
    hourlyActivity[date.getHours()]++;
    dailyActivity[date.getDay()]++;
    const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    weeklyActivity[Math.min(weekNumber, 51)]++;
  });

  return {
    hourlyActivity,
    dailyActivity,
    weeklyActivity,
    peakHours: getPeakHours(hourlyActivity),
    peakDays: getPeakDays(dailyActivity)
  };
}

function calculateQualitySignals(interactions) {
  const signals = {
    averageRating: 0,
    ratingDistribution: {},
    feedbackFrequency: 0,
    responseTime: 0,
    conversionRate: 0
  };

  const ratings = interactions
    .filter(i => i.feedback?.rating)
    .map(i => i.feedback.rating);

  if (ratings.length > 0) {
    signals.averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    signals.feedbackFrequency = ratings.length / interactions.length;
    
    ratings.forEach(rating => {
      signals.ratingDistribution[rating] = (signals.ratingDistribution[rating] || 0) + 1;
    });
  }

  const conversions = interactions.filter(i => 
    ['contacted', 'interviewed'].includes(i.interactionType)
  ).length;
  signals.conversionRate = conversions / Math.max(1, interactions.length);

  const viewToContactTimes = [];
  for (let i = 0; i < interactions.length - 1; i++) {
    const current = interactions[i];
    const next = interactions[i + 1];
    
    if (current.interactionType === 'viewed' && 
        ['contacted', 'interviewed', 'shortlisted'].includes(next.interactionType) &&
        current.candidateId.toString() === next.candidateId.toString()) {
      viewToContactTimes.push(new Date(next.timestamp) - new Date(current.timestamp));
    }
  }

  if (viewToContactTimes.length > 0) {
    signals.responseTime = viewToContactTimes.reduce((sum, time) => sum + time, 0) / viewToContactTimes.length;
  }

  return signals;
}

async function updateAdaptiveWeights(recruiterId, adaptiveData, recruiterMemory) {
  try {
    adaptiveData.skillPreferences.forEach(pref => {
      recruiterMemory.updateSkillWeight(pref.skill, pref.score * 0.1);
    });

    adaptiveData.locationPreferences.forEach(pref => {
      recruiterMemory.updateLocationWeight(pref.location, pref.score * 0.1);
    });

    adaptiveData.designationPreferences.forEach(pref => {
      recruiterMemory.updateDesignationWeight(pref.designation, pref.score * 0.1);
    });

    const insights = recruiterMemory.insights || {};
    insights.topSkills = adaptiveData.skillPreferences.slice(0, 10);
    insights.successPatterns = adaptiveData.successFactors.slice(0, 5);
    insights.rejectionPatterns = adaptiveData.rejectionPatterns;
    insights.performanceMetrics = {
      ...insights.performanceMetrics,
      averageMatchQuality: adaptiveData.qualitySignals.averageRating,
      conversionRate: adaptiveData.qualitySignals.conversionRate
    };

    await recruiterMemory.save();
  } catch (error) {
    console.error('Error updating adaptive weights:', error);
  }
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

function isSuccessInteraction(interaction) {
  return ['shortlisted', 'contacted', 'interviewed'].includes(interaction.interactionType) &&
         (!interaction.feedback?.wouldHire || interaction.feedback.wouldHire === true);
}

function extractSuccessFactors(interaction) {
  const factors = [];
  
  if (interaction.candidateData?.experience >= 5) {
    factors.push('experienced_candidate');
  }
  
  if (interaction.candidateData?.skills?.length >= 8) {
    factors.push('diverse_skills');
  }
  
  if (interaction.candidateData?.company?.toLowerCase().includes('startup')) {
    factors.push('startup_experience');
  }
  
  if (interaction.metadata?.source === 'semantic_match') {
    factors.push('semantic_match');
  }
  
  if (interaction.context?.matchingScore >= 0.8) {
    factors.push('high_match_score');
  }
  
  return factors;
}

function getExperienceRange(experience) {
  if (experience < 2) return 'entry';
  if (experience < 5) return 'junior';
  if (experience < 10) return 'mid';
  if (experience < 15) return 'senior';
  return 'lead';
}

function calculateConfidence(count, total) {
  return Math.min(1, count / Math.max(1, total * 0.1));
}

function getDateRange(timeRange) {
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  return { startDate, endDate: now };
}

function analyzeTimeOfDayPattern(interactions) {
  const hourlyActivity = new Array(24).fill(0);
  
  interactions.forEach(interaction => {
    const hour = new Date(interaction.timestamp).getHours();
    hourlyActivity[hour]++;
  });
  
  return hourlyActivity;
}

function analyzeDayOfWeekPattern(interactions) {
  const dailyActivity = new Array(7).fill(0);
  
  interactions.forEach(interaction => {
    const day = new Date(interaction.timestamp).getDay();
    dailyActivity[day]++;
  });
  
  return dailyActivity;
}

function analyzeSessionLengthPattern(interactions) {
  const sessionLengths = [];
  
  for (let i = 0; i < interactions.length - 1; i++) {
    const current = interactions[i];
    const next = interactions[i + 1];
    
    if (current.session === next.session) {
      sessionLengths.push(new Date(next.timestamp) - new Date(current.timestamp));
    }
  }
  
  return sessionLengths.length > 0 
    ? sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length 
    : 0;
}

function analyzeSearchToContactPattern(interactions) {
  let totalSearches = 0;
  let contactsFromSearch = 0;
  
  interactions.forEach(interaction => {
    if (interaction.metadata?.source === 'search') {
      totalSearches++;
      if (interaction.interactionType === 'contacted') {
        contactsFromSearch++;
      }
    }
  });
  
  return totalSearches > 0 ? contactsFromSearch / totalSearches : 0;
}

function analyzeViewToShortlistPattern(interactions) {
  let views = 0;
  let shortlists = 0;
  
  interactions.forEach(interaction => {
    if (interaction.interactionType === 'viewed') views++;
    if (interaction.interactionType === 'shortlisted') shortlists++;
  });
  
  return views > 0 ? shortlists / views : 0;
}

function getPeakHours(hourlyActivity) {
  const maxActivity = Math.max(...hourlyActivity);
  return hourlyActivity
    .map((activity, hour) => ({ hour, activity }))
    .filter(item => item.activity === maxActivity)
    .map(item => item.hour);
}

function getPeakDays(dailyActivity) {
  const maxActivity = Math.max(...dailyActivity);
  return dailyActivity
    .map((activity, day) => ({ day, activity }))
    .filter(item => item.activity === maxActivity)
    .map(item => item.day);
}
