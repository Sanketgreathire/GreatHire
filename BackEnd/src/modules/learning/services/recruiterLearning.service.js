import { enqueueLearningJob } from "./learningQueue.service.js";
import { getRecruiterLearningRecord } from "./recruiterPreference.service.js";
import { updateLearningStats } from "./hiringBehavior.service.js";

export async function trackRecruiterInteraction(recruiterId, interactionData) {
  try {
    const {
      candidateId,
      action,
      context,
      metadata,
      timestamp
    } = interactionData;

    const learningJob = {
      recruiterId,
      interactionData: {
        candidateId,
        action,
        context: context || {},
        metadata: metadata || {},
        timestamp: timestamp || new Date()
      }
    };

    const jobId = await enqueueLearningJob('track-interaction', learningJob);

    await updateLearningStats(recruiterId, action, candidateId, timestamp);

    return {
      success: true,
      jobId,
      message: "Recruiter interaction tracked and queued for learning"
    };
  } catch (error) {
    console.error("Error in trackRecruiterInteraction:", error);
    throw new Error(`Failed to track recruiter interaction: ${error.message}`);
  }
}

export async function getRecruiterLearningStats(recruiterId, timeRange = '30d') {
  try {
    const learningRecord = await getRecruiterLearningRecord(recruiterId);
    
    if (!learningRecord) {
      return {
        totalInteractions: 0,
        actionBreakdown: {},
        timeRange,
        learningScore: 0,
        accuracy: 0
      };
    }

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

    const filteredInteractions = learningRecord.interactionHistory.filter(
      interaction => new Date(interaction.timestamp) >= startDate
    );

    const actionBreakdown = {};
    filteredInteractions.forEach(interaction => {
      actionBreakdown[interaction.action] = (actionBreakdown[interaction.action] || 0) + 1;
    });

    const learningScore = calculateLearningScore(learningRecord, timeRange);
    const accuracy = calculateAccuracy(learningRecord, timeRange);

    return {
      totalInteractions: filteredInteractions.length,
      actionBreakdown,
      timeRange,
      learningScore,
      accuracy,
      lastUpdated: learningRecord.lastLearningUpdate
    };
  } catch (error) {
    console.error("Error in getRecruiterLearningStats:", error);
    throw new Error(`Failed to get recruiter learning stats: ${error.message}`);
  }
}

export async function triggerLearningModel(recruiterId, options = {}) {
  try {
    const { force = false, modelType = 'all' } = options;

    const learningJob = {
      recruiterId,
      modelType,
      force,
      triggeredAt: new Date()
    };

    const jobId = await enqueueLearningJob('train-model', learningJob);

    return {
      success: true,
      jobId,
      message: `Learning model training triggered for ${modelType}`,
      modelType,
      force
    };
  } catch (error) {
    console.error("Error in triggerLearningModel:", error);
    throw new Error(`Failed to trigger learning model: ${error.message}`);
  }
}

export async function updateRecruiterModel(recruiterId, modelUpdate) {
  try {
    const learningJob = {
      recruiterId,
      modelUpdate,
      updatedAt: new Date()
    };

    const jobId = await enqueueLearningJob('update-model', learningJob);

    return {
      success: true,
      jobId,
      message: "Recruiter model update queued"
    };
  } catch (error) {
    console.error("Error in updateRecruiterModel:", error);
    throw new Error(`Failed to update recruiter model: ${error.message}`);
  }
}

export async function getLearningProgress(recruiterId) {
  try {
    const learningRecord = await getRecruiterLearningRecord(recruiterId);
    
    if (!learningRecord) {
      return {
        progress: 0,
        stage: 'not_started',
        lastUpdate: null,
        nextUpdate: null
      };
    }

    const progress = calculateProgress(learningRecord);
    const stage = determineLearningStage(learningRecord);

    return {
      progress,
      stage,
      lastUpdate: learningRecord.lastLearningUpdate,
      nextUpdate: calculateNextUpdate(learningRecord)
    };
  } catch (error) {
    console.error("Error in getLearningProgress:", error);
    throw new Error(`Failed to get learning progress: ${error.message}`);
  }
}

function calculateLearningScore(learningRecord, timeRange) {
  try {
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

    const recentInteractions = learningRecord.interactionHistory.filter(
      interaction => new Date(interaction.timestamp) >= startDate
    );

    if (recentInteractions.length === 0) return 0;

    const actionWeights = {
      'viewed': 1,
      'shortlisted': 3,
      'contacted': 5,
      'interviewed': 7,
      'hired': 10,
      'rejected': 2,
      'not_interested': 1
    };

    let weightedScore = 0;
    let maxPossibleScore = 0;

    recentInteractions.forEach(interaction => {
      const weight = actionWeights[interaction.action] || 1;
      weightedScore += weight;
      maxPossibleScore += 10;
    });

    const baseScore = maxPossibleScore > 0 ? (weightedScore / maxPossibleScore) * 100 : 0;
    
    const consistencyBonus = calculateConsistencyBonus(recentInteractions);
    const diversityBonus = calculateDiversityBonus(recentInteractions);

    return Math.min(Math.round(baseScore + consistencyBonus + diversityBonus), 100);
  } catch (error) {
    console.error("Error calculating learning score:", error);
    return 0;
  }
}

function calculateAccuracy(learningRecord, timeRange) {
  try {
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

    const recentInteractions = learningRecord.interactionHistory.filter(
      interaction => new Date(interaction.timestamp) >= startDate
    );

    const shortlistedInteractions = recentInteractions.filter(
      interaction => interaction.action === 'shortlisted'
    );

    const hiredInteractions = recentInteractions.filter(
      interaction => interaction.action === 'hired'
    );

    if (shortlistedInteractions.length === 0) return 0;

    const accuracy = (hiredInteractions.length / shortlistedInteractions.length) * 100;
    return Math.round(accuracy);
  } catch (error) {
    console.error("Error calculating accuracy:", error);
    return 0;
  }
}

function calculateConsistencyBonus(interactions) {
  try {
    if (interactions.length < 5) return 0;

    const dailyInteractions = {};
    interactions.forEach(interaction => {
      const date = new Date(interaction.timestamp).toDateString();
      dailyInteractions[date] = (dailyInteractions[date] || 0) + 1;
    });

    const dailyCounts = Object.values(dailyInteractions);
    const avgInteractions = dailyCounts.reduce((sum, count) => sum + count, 0) / dailyCounts.length;
    const variance = dailyCounts.reduce((sum, count) => sum + Math.pow(count - avgInteractions, 2), 0) / dailyCounts.length;

    const consistency = variance < 4 ? 10 : variance < 9 ? 5 : 0;
    return consistency;
  } catch (error) {
    console.error("Error calculating consistency bonus:", error);
    return 0;
  }
}

function calculateDiversityBonus(interactions) {
  try {
    const uniqueActions = new Set(interactions.map(i => i.action));
    const uniqueCandidates = new Set(interactions.map(i => i.candidateId));
    const uniqueContexts = new Set(interactions.map(i => JSON.stringify(i.context || {})));

    let diversityScore = 0;
    
    if (uniqueActions.size >= 4) diversityScore += 3;
    else if (uniqueActions.size >= 2) diversityScore += 1;
    
    if (uniqueCandidates.size >= 10) diversityScore += 4;
    else if (uniqueCandidates.size >= 5) diversityScore += 2;
    else if (uniqueCandidates.size >= 2) diversityScore += 1;
    
    if (uniqueContexts.size >= 3) diversityScore += 3;
    else if (uniqueContexts.size >= 2) diversityScore += 1;

    return diversityScore;
  } catch (error) {
    console.error("Error calculating diversity bonus:", error);
    return 0;
  }
}

function calculateProgress(learningRecord) {
  try {
    const totalInteractions = learningRecord.interactionHistory.length;
    const uniqueCandidates = new Set(learningRecord.interactionHistory.map(i => i.candidateId)).size;
    const uniqueActions = new Set(learningRecord.interactionHistory.map(i => i.action)).size;
    const hasPreferences = learningRecord.learnedPreferences && Object.keys(learningRecord.learnedPreferences).length > 0;
    const hasRankingSignals = learningRecord.rankingSignals && Object.keys(learningRecord.rankingSignals).length > 0;

    let progress = 0;
    
    if (totalInteractions >= 10) progress += 20;
    else if (totalInteractions >= 5) progress += 10;
    
    if (uniqueCandidates >= 20) progress += 20;
    else if (uniqueCandidates >= 10) progress += 15;
    else if (uniqueCandidates >= 5) progress += 10;
    
    if (uniqueActions >= 4) progress += 20;
    else if (uniqueActions >= 3) progress += 15;
    else if (uniqueActions >= 2) progress += 10;
    
    if (hasPreferences) progress += 20;
    if (hasRankingSignals) progress += 20;

    return Math.min(progress, 100);
  } catch (error) {
    console.error("Error calculating progress:", error);
    return 0;
  }
}

function determineLearningStage(learningRecord) {
  try {
    const progress = calculateProgress(learningRecord);
    const totalInteractions = learningRecord.interactionHistory.length;

    if (totalInteractions === 0) return 'not_started';
    if (totalInteractions < 10) return 'initial';
    if (progress < 40) return 'learning';
    if (progress < 70) return 'developing';
    if (progress < 90) return 'mature';
    return 'expert';
  } catch (error) {
    console.error("Error determining learning stage:", error);
    return 'unknown';
  }
}

function calculateNextUpdate(learningRecord) {
  try {
    const lastUpdate = learningRecord.lastLearningUpdate;
    if (!lastUpdate) return new Date(Date.now() + 24 * 60 * 60 * 1000);

    const totalInteractions = learningRecord.interactionHistory.length;
    const stage = determineLearningStage(learningRecord);

    let updateInterval;
    switch (stage) {
      case 'not_started':
      case 'initial':
        updateInterval = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      case 'learning':
        updateInterval = 5 * 24 * 60 * 60 * 1000; // 5 days
        break;
      case 'developing':
        updateInterval = 3 * 24 * 60 * 60 * 1000; // 3 days
        break;
      case 'mature':
      case 'expert':
        updateInterval = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      default:
        updateInterval = 7 * 24 * 60 * 60 * 1000;
    }

    return new Date(new Date(lastUpdate).getTime() + updateInterval);
  } catch (error) {
    console.error("Error calculating next update:", error);
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
}
