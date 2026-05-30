import Bull from "bull";
import { getRedisConnection } from "../../../config/redis.js";
import { updateRecruiterModel } from "./recruiterLearning.service.js";
import { updateRecruiterPreferences } from "./recruiterPreference.service.js";
import { updateRecruiterBehavior } from "./hiringBehavior.service.js";

const LEARNING_QUEUE_NAME = "learning-processing";

let learningQueue = null;

export async function getLearningQueue() {
  if (!learningQueue) {
    const redisClient = await getRedisClient();
    learningQueue = new Bull(LEARNING_QUEUE_NAME, {
      redis: {
        host: redisClient.options.host,
        port: redisClient.options.port,
        password: redisClient.options.password,
        db: redisClient.options.db
      },
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 25,
        attempts: 2,
        backoff: {
          type: "exponential",
          delay: 2000
        }
      }
    });
    
    learningQueue.process("track-interaction", 10, processTrackInteraction);
    learningQueue.process("update-preferences", 3, processUpdatePreferences);
    learningQueue.process("train-model", 1, processTrainModel);
    learningQueue.process("update-model", 2, processUpdateModel);
    learningQueue.process("update-stats", 5, processUpdateStats);
  }
  
  return learningQueue;
}

export async function enqueueLearningJob(jobType, jobData) {
  try {
    const queue = await getLearningQueue();
    
    const job = await queue.add(jobType, jobData, {
      priority: getJobPriority(jobType),
      delay: 0,
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 2000
      }
    });
    
    return job.id;
  } catch (error) {
    console.error("Error enqueuing learning job:", error);
    throw new Error(`Failed to enqueue learning job: ${error.message}`);
  }
}

function getJobPriority(jobType) {
  const priorities = {
    "track-interaction": 10,
    "update-stats": 8,
    "update-preferences": 5,
    "update-model": 3,
    "train-model": 1
  };
  
  return priorities[jobType] || 5;
}

async function processTrackInteraction(job) {
  try {
    const { recruiterId, interactionData } = job.data;
    
    const RecruiterLearning = await import("../../models/recruiterLearning.model.js");
    
    let learningRecord = await RecruiterLearning.default.findOne({ recruiterId });
    
    if (!learningRecord) {
      learningRecord = new RecruiterLearning.default({
        recruiterId,
        interactionHistory: [interactionData]
      });
    } else {
      learningRecord.interactionHistory.push(interactionData);
    }
    
    await learningRecord.save();
    
    await updateRecruiterBehavior(recruiterId, interactionData);
    
    job.progress(100);
    
    return {
      success: true,
      interactionId: interactionData._id,
      recruiterId
    };
  } catch (error) {
    console.error("Error processing track interaction:", error);
    throw error;
  }
}

async function processUpdatePreferences(job) {
  try {
    const { recruiterId, learnedPreferences, updateType, confidence } = job.data;
    
    const RecruiterLearning = await import("../../models/recruiterLearning.model.js");
    
    const learningRecord = await RecruiterLearning.default.findOne({ recruiterId });
    
    if (!learningRecord) {
      throw new Error("Learning record not found for recruiter");
    }
    
    await learningRecord.updatePreferences(learnedPreferences);
    
    if (confidence) {
      learningRecord.modelMetadata.confidence = confidence;
      await learningRecord.save();
    }
    
    job.progress(100);
    
    return {
      success: true,
      recruiterId,
      updateType,
      preferencesUpdated: Object.keys(learnedPreferences).length
    };
  } catch (error) {
    console.error("Error processing update preferences:", error);
    throw error;
  }
}

async function processTrainModel(job) {
  try {
    const { recruiterId, modelType, force } = job.data;
    
    const RecruiterLearning = await import("../../models/recruiterLearning.model.js");
    
    const learningRecord = await RecruiterLearning.default.findOne({ recruiterId });
    
    if (!learningRecord) {
      throw new Error("Learning record not found for recruiter");
    }
    
    let trainingResult;
    
    switch (modelType) {
      case "preferences":
        trainingResult = await trainPreferencesModel(learningRecord);
        break;
      case "ranking":
        trainingResult = await trainRankingModel(learningRecord);
        break;
      case "behavior":
        trainingResult = await trainBehaviorModel(learningRecord);
        break;
      case "all":
        trainingResult = await trainAllModels(learningRecord);
        break;
      default:
        trainingResult = await trainAllModels(learningRecord);
    }
    
    learningRecord.modelMetadata.trainingIterations += 1;
    learningRecord.modelMetadata.lastLearningUpdate = new Date();
    learningRecord.modelMetadata.modelAccuracy = trainingResult.accuracy || learningRecord.modelMetadata.modelAccuracy;
    await learningRecord.save();
    
    job.progress(100);
    
    return {
      success: true,
      recruiterId,
      modelType,
      trainingResult,
      iterations: learningRecord.modelMetadata.trainingIterations
    };
  } catch (error) {
    console.error("Error processing train model:", error);
    throw error;
  }
}

async function processUpdateModel(job) {
  try {
    const { recruiterId, modelUpdate } = job.data;
    
    const RecruiterLearning = await import("../../models/recruiterLearning.model.js");
    
    const learningRecord = await RecruiterLearning.default.findOne({ recruiterId });
    
    if (!learningRecord) {
      throw new Error("Learning record not found for recruiter");
    }
    
    await updateRecruiterModel(recruiterId, modelUpdate);
    
    job.progress(100);
    
    return {
      success: true,
      recruiterId,
      modelUpdate
    };
  } catch (error) {
    console.error("Error processing update model:", error);
    throw error;
  }
}

async function processUpdateStats(job) {
  try {
    const { recruiterId, action, candidateId, timestamp } = job.data;
    
    const RecruiterLearning = await import("../../models/recruiterLearning.model.js");
    
    const learningRecord = await RecruiterLearning.default.findOne({ recruiterId });
    
    if (!learningRecord) {
      throw new Error("Learning record not found for recruiter");
    }
    
    await updateRecruiterBehavior(recruiterId, { action, candidateId, timestamp });
    
    job.progress(100);
    
    return {
      success: true,
      recruiterId,
      statsUpdated: true
    };
  } catch (error) {
    console.error("Error processing update stats:", error);
    throw error;
  }
}

async function trainPreferencesModel(learningRecord) {
  try {
    const interactions = learningRecord.interactionHistory || [];
    const successfulInteractions = interactions.filter(i => 
      ['shortlisted', 'contacted', 'hired', 'interviewed'].includes(i.action)
    );
    
    if (successfulInteractions.length < 5) {
      return {
        success: false,
        message: "Insufficient data for training",
        accuracy: 0
      };
    }
    
    const preferences = await extractPreferencesFromInteractions(successfulInteractions);
    const accuracy = calculatePreferenceAccuracy(successfulInteractions, preferences);
    
    return {
      success: true,
      preferences,
      accuracy,
      trainedOn: successfulInteractions.length
    };
  } catch (error) {
    console.error("Error training preferences model:", error);
    return {
      success: false,
      error: error.message,
      accuracy: 0
    };
  }
}

async function trainRankingModel(learningRecord) {
  try {
    const interactions = learningRecord.interactionHistory || [];
    const successfulInteractions = interactions.filter(i => 
      ['hired', 'interviewed'].includes(i.action)
    );
    
    if (successfulInteractions.length < 3) {
      return {
        success: false,
        message: "Insufficient data for ranking training",
        accuracy: 0
      };
    }
    
    const rankingSignals = await extractRankingSignals(successfulInteractions);
    const accuracy = calculateRankingAccuracy(successfulInteractions, rankingSignals);
    
    return {
      success: true,
      rankingSignals,
      accuracy,
      trainedOn: successfulInteractions.length
    };
  } catch (error) {
    console.error("Error training ranking model:", error);
    return {
      success: false,
      error: error.message,
      accuracy: 0
    };
  }
}

async function trainBehaviorModel(learningRecord) {
  try {
    const interactions = learningRecord.interactionHistory || [];
    
    if (interactions.length < 10) {
      return {
        success: false,
        message: "Insufficient data for behavior training",
        accuracy: 0
      };
    }
    
    const behavioralPatterns = await extractBehavioralPatterns(interactions);
    const accuracy = calculateBehaviorAccuracy(interactions, behavioralPatterns);
    
    return {
      success: true,
      behavioralPatterns,
      accuracy,
      trainedOn: interactions.length
    };
  } catch (error) {
    console.error("Error training behavior model:", error);
    return {
      success: false,
      error: error.message,
      accuracy: 0
    };
  }
}

async function trainAllModels(learningRecord) {
  try {
    const [preferencesResult, rankingResult, behaviorResult] = await Promise.allSettled([
      trainPreferencesModel(learningRecord),
      trainRankingModel(learningRecord),
      trainBehaviorModel(learningRecord)
    ]);
    
    const overallAccuracy = [
      preferencesResult.value?.accuracy || 0,
      rankingResult.value?.accuracy || 0,
      behaviorResult.value?.accuracy || 0
    ].reduce((sum, acc) => sum + acc, 0) / 3;
    
    return {
      success: true,
      preferences: preferencesResult.value,
      ranking: rankingResult.value,
      behavior: behaviorResult.value,
      overallAccuracy,
      trainedOn: learningRecord.interactionHistory.length
    };
  } catch (error) {
    console.error("Error training all models:", error);
    return {
      success: false,
      error: error.message,
      accuracy: 0
    };
  }
}

async function extractPreferencesFromInteractions(interactions) {
  try {
    const preferences = {
      preferredSkills: [],
      preferredIndustries: [],
      preferredExperienceLevels: [],
      preferredCompanyTypes: [],
      preferredLocations: []
    };
    
    const skillCounts = {};
    const industryCounts = {};
    const experienceCounts = {};
    const companyTypeCounts = {};
    const locationCounts = {};
    
    for (const interaction of interactions) {
      try {
        const candidateData = await getCandidateData(interaction.candidateId);
        
        if (candidateData.skills) {
          candidateData.skills.forEach(skill => {
            const normalizedSkill = skill.toLowerCase().trim();
            skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
          });
        }
        
        if (candidateData.currentCompany) {
          const industry = inferIndustryFromCompany(candidateData.currentCompany);
          if (industry) {
            industryCounts[industry] = (industryCounts[industry] || 0) + 1;
          }
          
          const companyType = inferCompanyType(candidateData.currentCompany);
          if (companyType) {
            companyTypeCounts[companyType] = (companyTypeCounts[companyType] || 0) + 1;
          }
        }
        
        if (candidateData.totalExperience !== undefined) {
          const level = getExperienceLevel(candidateData.totalExperience);
          experienceCounts[level] = (experienceCounts[level] || 0) + 1;
        }
        
        if (candidateData.location) {
          const normalizedLocation = candidateData.location.toLowerCase().trim();
          locationCounts[normalizedLocation] = (locationCounts[normalizedLocation] || 0) + 1;
        }
      } catch (error) {
        console.error("Error processing candidate data for preference extraction:", error);
      }
    }
    
    preferences.preferredSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([skill, count]) => ({ skill, count }));
    
    preferences.preferredIndustries = Object.entries(industryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([industry, count]) => ({ industry, count }));
    
    preferences.preferredExperienceLevels = Object.entries(experienceCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([level, count]) => ({ level, count }));
    
    preferences.preferredCompanyTypes = Object.entries(companyTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => ({ type, count }));
    
    preferences.preferredLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([location, count]) => ({ location, count }));
    
    return preferences;
  } catch (error) {
    console.error("Error extracting preferences from interactions:", error);
    return {
      preferredSkills: [],
      preferredIndustries: [],
      preferredExperienceLevels: [],
      preferredCompanyTypes: [],
      preferredLocations: []
    };
  }
}

async function extractRankingSignals(interactions) {
  try {
    const signals = {
      semanticPatterns: [],
      behavioralPatterns: [],
      contextualWeights: new Map(),
      historicalWeights: new Map()
    };
    
    const patternCounts = {};
    
    interactions.forEach(interaction => {
      const context = interaction.context || {};
      const pattern = `${context.source || 'unknown'}-${context.method || 'unknown'}`;
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    });
    
    signals.behavioralPatterns = Object.entries(patternCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([pattern, frequency]) => ({
        pattern,
        weight: Math.min(frequency / interactions.length * 100, 100),
        confidence: Math.min(frequency / interactions.length, 1),
        successRate: calculatePatternSuccessRate(interactions, pattern),
        lastUsed: new Date()
      }));
    
    return signals;
  } catch (error) {
    console.error("Error extracting ranking signals:", error);
    return {
      semanticPatterns: [],
      behavioralPatterns: [],
      contextualWeights: new Map(),
      historicalWeights: new Map()
    };
  }
}

async function extractBehavioralPatterns(interactions) {
  try {
    const patterns = {
      sourcingChannels: [],
      interactionSpeed: {
        averageResponseTime: 0,
        averageDecisionTime: 0,
        viewedToShortlisted: 0,
        shortlistedToContacted: 0
      },
      timePatterns: {
        mostActiveHour: 9,
        mostActiveDay: "Monday",
        peakActivityPeriod: "morning",
        consistency: 0
      },
      decisionPatterns: {
        riskTolerance: "medium",
        thoroughness: "moderate",
        conversionFactors: []
      }
    };
    
    const channelCounts = {};
    const hourCounts = {};
    const dayCounts = {};
    
    interactions.forEach(interaction => {
      const context = interaction.context || {};
      const channel = context.source || 'unknown';
      const date = new Date(interaction.timestamp);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      
      channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
    });
    
    patterns.sourcingChannels = Object.entries(channelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([channel, frequency]) => ({
        channel,
        effectiveness: (frequency / interactions.length) * 100,
        frequency,
        lastUsed: new Date()
      }));
    
    const mostActiveHour = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)[0];
    if (mostActiveHour) {
      patterns.timePatterns.mostActiveHour = parseInt(mostActiveHour[0]);
    }
    
    const mostActiveDay = Object.entries(dayCounts)
      .sort(([, a], [, b]) => b - a)[0];
    if (mostActiveDay) {
      patterns.timePatterns.mostActiveDay = getDayName(mostActiveDay[0]);
    }
    
    return patterns;
  } catch (error) {
    console.error("Error extracting behavioral patterns:", error);
    return {
      sourcingChannels: [],
      interactionSpeed: {
        averageResponseTime: 0,
        averageDecisionTime: 0,
        viewedToShortlisted: 0,
        shortlistedToContacted: 0
      },
      timePatterns: {
        mostActiveHour: 9,
        mostActiveDay: "Monday",
        peakActivityPeriod: "morning",
        consistency: 0
      },
      decisionPatterns: {
        riskTolerance: "medium",
        thoroughness: "moderate",
        conversionFactors: []
      }
    };
  }
}

function calculatePreferenceAccuracy(interactions, preferences) {
  try {
    if (interactions.length === 0) return 0;
    
    let correctPredictions = 0;
    let totalPredictions = 0;
    
    interactions.forEach(interaction => {
      const context = interaction.context || {};
      
      if (context.preferredSkills && preferences.preferredSkills) {
        const predictedSkills = context.preferredSkills;
        const actualSkills = preferences.preferredSkills.map(p => p.skill);
        const skillMatches = predictedSkills.filter(skill => 
          actualSkills.some(actual => actual.includes(skill))
        ).length;
        
        totalPredictions += predictedSkills.length;
        correctPredictions += skillMatches;
      }
    });
    
    return totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
  } catch (error) {
    console.error("Error calculating preference accuracy:", error);
    return 0;
  }
}

function calculateRankingAccuracy(interactions, signals) {
  try {
    if (interactions.length === 0) return 0;
    
    let correctPredictions = 0;
    let totalPredictions = 0;
    
    interactions.forEach(interaction => {
      const context = interaction.context || {};
      const predictedPattern = `${context.source || 'unknown'}-${context.method || 'unknown'}`;
      
      const actualPattern = signals.behavioralPatterns.find(p => p.pattern === predictedPattern);
      if (actualPattern) {
        totalPredictions += 1;
        if (actualPattern.successRate > 50) {
          correctPredictions += 1;
        }
      }
    });
    
    return totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
  } catch (error) {
    console.error("Error calculating ranking accuracy:", error);
    return 0;
  }
}

function calculateBehaviorAccuracy(interactions, patterns) {
  try {
    if (interactions.length === 0) return 0;
    
    const actualChannels = patterns.sourcingChannels.map(c => c.channel);
    let correctPredictions = 0;
    
    interactions.forEach(interaction => {
      const context = interaction.context || {};
      const actualChannel = context.source || 'unknown';
      
      if (actualChannels.includes(actualChannel)) {
        correctPredictions += 1;
      }
    });
    
    return (correctPredictions / interactions.length) * 100;
  } catch (error) {
    console.error("Error calculating behavior accuracy:", error);
    return 0;
  }
}

function calculatePatternSuccessRate(interactions, pattern) {
  try {
    const patternInteractions = interactions.filter(i => {
      const context = i.context || {};
      const interactionPattern = `${context.source || 'unknown'}-${context.method || 'unknown'}`;
      return interactionPattern === pattern;
    });
    
    if (patternInteractions.length === 0) return 0;
    
    const successfulInteractions = patternInteractions.filter(i => 
      ['hired', 'interviewed', 'contacted'].includes(i.action)
    );
    
    return (successfulInteractions.length / patternInteractions.length) * 100;
  } catch (error) {
    console.error("Error calculating pattern success rate:", error);
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

function getDayName(dayIndex) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

export async function getLearningQueueStatus() {
  try {
    const queue = await getLearningQueue();
    
    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();
    const delayed = await queue.getDelayed();
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      total: waiting.length + active.length + completed.length + failed.length + delayed.length
    };
  } catch (error) {
    console.error("Error getting learning queue status:", error);
    throw new Error(`Failed to get queue status: ${error.message}`);
  }
}

export async function pauseLearningQueue() {
  try {
    const queue = await getLearningQueue();
    await queue.pause();
    return { success: true, message: "Learning queue paused" };
  } catch (error) {
    console.error("Error pausing learning queue:", error);
    throw new Error(`Failed to pause queue: ${error.message}`);
  }
}

export async function resumeLearningQueue() {
  try {
    const queue = await getLearningQueue();
    await queue.resume();
    return { success: true, message: "Learning queue resumed" };
  } catch (error) {
    console.error("Error resuming learning queue:", error);
    throw new Error(`Failed to resume queue: ${error.message}`);
  }
}

export async function cleanLearningQueue() {
  try {
    const queue = await getLearningQueue();
    
    await queue.clean(24 * 60 * 60 * 1000, "completed");
    await queue.clean(24 * 60 * 60 * 1000, "failed");
    
    return { success: true, message: "Learning queue cleaned" };
  } catch (error) {
    console.error("Error cleaning learning queue:", error);
    throw new Error(`Failed to clean queue: ${error.message}`);
  }
}

process.on('SIGTERM', async () => {
  if (learningQueue) {
    console.log('Closing learning queue...');
    await learningQueue.close();
  }
});

process.on('SIGINT', async () => {
  if (learningQueue) {
    console.log('Closing learning queue...');
    await learningQueue.close();
  }
});
