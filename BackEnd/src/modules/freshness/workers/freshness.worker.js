import { Queue, Worker } from 'bullmq';
import { connection } from '../../../config/redis.js';
import { candidateFreshnessService } from '../services/candidateFreshness.service.js';
import { activitySignalService } from '../services/activitySignal.service.js';
import { jobMovementDetectionService } from '../services/jobMovementDetection.service.js';
import { openToWorkPredictionService } from '../services/openToWorkPrediction.service.js';
import { SourcingCandidate } from '../../../../models/sourcing/sourcingCandidate.model.js';
import { CandidateFreshness } from '../../../models/candidateFreshness.model.js';
import { enqueueEmbedding } from '../../../../sourcing/ai/embeddingQueue.js';
import { enqueueSingleEnrichment } from '../../enrichment/services/enrichmentQueue.service.js';

const FRESHNESS_QUEUE_NAME = "freshness-processing";

let freshnessQueue = null;
let freshnessWorker = null;

export function getFreshnessQueue() {
  if (!freshnessQueue) {
    freshnessQueue = new Queue(FRESHNESS_QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    });
  }
  return freshnessQueue;
}

export async function enqueueFreshnessProcessing(data, options = {}) {
  const queue = getFreshnessQueue();
  
  return await queue.add(data.type || 'calculate-freshness', data, {
    priority: options.priority || 10,
    delay: options.delay || 0,
    attempts: options.attempts || 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    ...options
  });
}

export async function enqueueBatchFreshnessProcessing(candidateIds, options = {}) {
  return await enqueueFreshnessProcessing({
    type: 'batch-freshness',
    candidateIds,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 5 });
}

export async function enqueueStaleCandidateRefresh(daysThreshold = 90, limit = 100) {
  return await enqueueFreshnessProcessing({
    type: 'stale-refresh',
    daysThreshold,
    limit,
    timestamp: new Date().toISOString()
  }, { priority: 7 });
}

export async function enqueueActivityAnalysis(candidateIds, options = {}) {
  return await enqueueFreshnessProcessing({
    type: 'activity-analysis',
    candidateIds,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 8 });
}

export async function enqueueMovementDetection(candidateIds, options = {}) {
  return await enqueueFreshnessProcessing({
    type: 'movement-detection',
    candidateIds,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 8 });
}

export async function enqueueOpenToWorkAnalysis(candidateIds, options = {}) {
  return await enqueueFreshnessProcessing({
    type: 'open-to-work-analysis',
    candidateIds,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 8 });
}

export async function enqueueRelevanceDecay(candidateIds, options = {}) {
  return await enqueueFreshnessProcessing({
    type: 'relevance-decay',
    candidateIds,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 6 });
}

export async function enqueueProfileReprocessing(candidateIds, options = {}) {
  return await enqueueFreshnessProcessing({
    type: 'profile-reprocessing',
    candidateIds,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 9 });
}

export async function getFreshnessQueueStats() {
  const queue = getFreshnessQueue();
  
  const [waiting, active, completed, failed] = await Promise.all([
    queue.getWaiting(),
    queue.getActive(),
    queue.getCompleted(),
    queue.getFailed()
  ]);

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
    total: waiting.length + active.length + completed.length + failed.length
  };
}

export function startFreshnessWorker() {
  if (freshnessWorker) {
    console.log('Freshness worker already running');
    return freshnessWorker;
  }

  freshnessWorker = new Worker(
    FRESHNESS_QUEUE_NAME,
    async (job) => {
      const { type, data } = job;
      
      try {
        console.log(`Processing freshness job: ${type}`, { jobId: job.id });
        
        let result;
        
        switch (type) {
          case 'calculate-freshness':
            result = await processFreshnessCalculation(data);
            break;
            
          case 'batch-freshness':
            result = await processBatchFreshness(data);
            break;
            
          case 'stale-refresh':
            result = await processStaleRefresh(data);
            break;
            
          case 'activity-analysis':
            result = await processActivityAnalysis(data);
            break;
            
          case 'movement-detection':
            result = await processMovementDetection(data);
            break;
            
          case 'open-to-work-analysis':
            result = await processOpenToWorkAnalysis(data);
            break;
            
          case 'relevance-decay':
            result = await processRelevanceDecay(data);
            break;
            
          case 'profile-reprocessing':
            result = await processProfileReprocessing(data);
            break;
            
          default:
            throw new Error(`Unknown job type: ${type}`);
        }
        
        console.log(`Completed freshness job: ${type}`, { jobId: job.id });
        return result;
        
      } catch (error) {
        console.error(`Failed freshness job: ${type}`, { jobId: job.id, error: error.message });
        throw error;
      }
    },
    {
      connection,
      concurrency: 5, // Moderate concurrency for freshness processing
      limiter: {
        max: 20, // Max 20 jobs per minute
        duration: 60000 // 1 minute
      }
    }
  );

  freshnessWorker.on('completed', (job) => {
    console.log(`Freshness job completed: ${job.name}`, { jobId: job.id });
  });

  freshnessWorker.on('failed', (job, err) => {
    console.error(`Freshness job failed: ${job.name}`, { jobId: job.id, error: err.message });
  });

  freshnessWorker.on('error', (err) => {
    console.error('Freshness worker error:', err);
  });

  console.log('Freshness worker started');
  return freshnessWorker;
}

export async function stopFreshnessWorker() {
  if (freshnessWorker) {
    await freshnessWorker.close();
    freshnessWorker = null;
    console.log('Freshness worker stopped');
  }
}

async function processFreshnessCalculation(data) {
  const { candidateId, options = {} } = data;
  
  const freshnessData = await candidateFreshnessService.calculateFreshnessScore(candidateId);
  await candidateFreshnessService.updateCandidateFreshness(candidateId, freshnessData);
  
  return {
    success: true,
    type: 'freshness-calculation',
    candidateId,
    freshnessScore: freshnessData.overallScore,
    freshnessLevel: freshnessData.freshnessLevel
  };
}

async function processBatchFreshness(data) {
  const { candidateIds, options = {} } = data;
  
  const results = await candidateFreshnessService.batchCalculateFreshness(candidateIds);
  
  return {
    success: true,
    type: 'batch-freshness',
    totalCandidates: results.length,
    results
  };
}

async function processStaleRefresh(data) {
  const { daysThreshold = 90, limit = 100 } = data;
  
  const refreshResult = await candidateFreshnessService.refreshStaleCandidates(daysThreshold, limit);
  
  return {
    success: true,
    type: 'stale-refresh',
    totalStale: refreshResult.totalStale,
    refreshed: refreshResult.refreshed,
    failed: refreshResult.failed,
    results: refreshResult.results
  };
}

async function processActivityAnalysis(data) {
  const { candidateIds, options = {} } = data;
  
  const results = [];
  
  for (const candidateId of candidateIds) {
    try {
      const activityData = await activitySignalService.analyzeCandidateActivity(candidateId);
      await activitySignalService.updateCandidateActivity(candidateId, activityData);
      results.push(activityData);
    } catch (error) {
      console.error(`Error analyzing activity for candidate ${candidateId}:`, error);
      results.push({
        candidateId,
        error: error.message
      });
    }
  }
  
  return {
    success: true,
    type: 'activity-analysis',
    totalCandidates: results.length,
    results
  };
}

async function processMovementDetection(data) {
  const { candidateIds, options = {} } = data;
  
  const results = await jobMovementDetectionService.batchDetectMovements(candidateIds);
  
  return {
    success: true,
    type: 'movement-detection',
    totalCandidates: results.length,
    results
  };
}

async function processOpenToWorkAnalysis(data) {
  const { candidateIds, options = {} } = data;
  
  const results = await openToWorkPredictionService.batchPredictOpenToWork(candidateIds);
  
  return {
    success: true,
    type: 'open-to-work-analysis',
    totalCandidates: results.length,
    results
  };
}

async function processRelevanceDecay(data) {
  const { candidateIds, options = {} } = data;
  
  const results = [];
  
  for (const candidateId of candidateIds) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (candidate && candidate.lastActivityAt) {
        const daysSinceActivity = Math.floor(
          (new Date() - new Date(candidate.lastActivityAt)) / (1000 * 60 * 60 * 24)
        );
        
        const decayResult = await candidateFreshnessService.applyRelevanceDecay(candidateId, daysSinceActivity);
        results.push(decayResult);
      }
    } catch (error) {
      console.error(`Error applying relevance decay for candidate ${candidateId}:`, error);
      results.push({
        candidateId,
        error: error.message
      });
    }
  }
  
  return {
    success: true,
    type: 'relevance-decay',
    totalCandidates: results.length,
    results
  };
}

async function processProfileReprocessing(data) {
  const { candidateIds, options = {} } = data;
  
  const results = [];
  
  for (const candidateId of candidateIds) {
    try {
      // Re-enqueue for embedding
      await enqueueEmbedding(candidateId);
      
      // Re-enqueue for enrichment
      await enqueueSingleEnrichment({ candidateId: candidateId.toString() });
      
      // Update reprocessing status
      await CandidateFreshness.updateReprocessingStatus(candidateId, true);
      
      results.push({
        candidateId,
        reprocessed: true,
        timestamp: new Date()
      });
    } catch (error) {
      console.error(`Error reprocessing profile for candidate ${candidateId}:`, error);
      results.push({
        candidateId,
        reprocessed: false,
        error: error.message
      });
    }
  }
  
  return {
    success: true,
    type: 'profile-reprocessing',
    totalCandidates: results.length,
    results
  };
}

export async function scheduleFreshnessProcessing(options = {}) {
  const {
    cronExpression = '0 2 * * *', // Daily at 2 AM
    candidateIds,
    processingType = 'batch-freshness',
    priority = 5
  } = options;

  return await enqueueFreshnessProcessing({
    type: 'scheduled-processing',
    processingType,
    candidateIds,
    options: {
      cronExpression,
      ...options
    },
    timestamp: new Date().toISOString()
  }, { priority });
}

export async function scheduleStaleRefresh(options = {}) {
  const {
    cronExpression = '0 3 * * 0', // Weekly on Sunday at 3 AM
    daysThreshold = 90,
    limit = 100,
    priority = 7
  } = options;

  return await enqueueFreshnessProcessing({
    type: 'scheduled-stale-refresh',
    daysThreshold,
    limit,
    options: {
      cronExpression,
      ...options
    },
    timestamp: new Date().toISOString()
  }, { priority });
}

export async function getFreshnessMetrics(timeRange = '24h') {
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case '1h':
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  // This would typically query your metrics database
  // For now, return placeholder data
  return {
    timeRange,
    profilesRefreshed: 0,
    staleProfiles: 0,
    activeCandidates: 0,
    detectedMovements: 0,
    freshnessProcessingFailures: 0,
    averageProcessingTime: 0,
    successRate: 0
  };
}

export async function getWorkerHealth() {
  try {
    const queueStats = await getFreshnessQueueStats();
    
    return {
      status: 'healthy',
      queue: queueStats,
      workerRunning: !!freshnessWorker,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting freshness worker health:', error);
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    };
  }
}

export async function clearFreshnessQueue() {
  const queue = getFreshnessQueue();
  await queue.obliterate({ force: true });
}

export async function pauseFreshnessQueue() {
  const queue = getFreshnessQueue();
  await queue.pause();
}

export async function resumeFreshnessQueue() {
  const queue = getFreshnessQueue();
  await queue.resume();
}

// Auto-refresh scheduler
export async function startAutoRefreshScheduler() {
  // This would integrate with your cron/scheduling system
  // For now, return a promise that would be resolved by the scheduler
  return new Promise((resolve) => {
    console.log('Freshness auto-refresh scheduler started');
    resolve();
  });
}

export async function stopAutoRefreshScheduler() {
  // This would stop the scheduler
  return new Promise((resolve) => {
    console.log('Freshness auto-refresh scheduler stopped');
    resolve();
  });
}

export default {
  getFreshnessQueue,
  enqueueFreshnessProcessing,
  enqueueBatchFreshnessProcessing,
  enqueueStaleCandidateRefresh,
  enqueueActivityAnalysis,
  enqueueMovementDetection,
  enqueueOpenToWorkAnalysis,
  enqueueRelevanceDecay,
  enqueueProfileReprocessing,
  getFreshnessQueueStats,
  startFreshnessWorker,
  stopFreshnessWorker,
  scheduleFreshnessProcessing,
  scheduleStaleRefresh,
  getFreshnessMetrics,
  getWorkerHealth,
  clearFreshnessQueue,
  pauseFreshnessQueue,
  resumeFreshnessQueue,
  startAutoRefreshScheduler,
  stopAutoRefreshScheduler
};
