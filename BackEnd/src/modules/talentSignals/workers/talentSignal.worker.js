import { Queue, Worker } from 'bullmq';
import { connection } from '../../../config/redis.js';
import { talentSignalAggregatorService } from '../services/talentSignalAggregator.service.js';
import { openToWorkPredictionService } from '../services/openToWorkPrediction.service.js';
import { recruiterResponsePredictionService } from '../services/recruiterResponsePrediction.service.js';
import { careerTransitionPredictionService } from '../services/careerTransitionPrediction.service.js';
import { startupAffinityService } from '../services/startupAffinity.service.js';
import { leadershipPotentialService } from '../services/leadershipPotential.service.js';
import { TalentSignal } from '../../../models/talentSignal.model.js';

const TALENT_SIGNAL_QUEUE_NAME = "talent-signal-processing";

let talentSignalQueue = null;
let talentSignalWorker = null;

export function getTalentSignalQueue() {
  if (!talentSignalQueue) {
    talentSignalQueue = new Queue(TALENT_SIGNAL_QUEUE_NAME, {
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
  return talentSignalQueue;
}

export async function enqueueTalentSignalProcessing(data, options = {}) {
  const queue = getTalentSignalQueue();
  
  return await queue.add(data.type || 'aggregate-signals', data, {
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

export async function enqueueSignalAggregation(candidateId, options = {}) {
  return await enqueueTalentSignalProcessing({
    type: 'aggregate-signals',
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 5, ...options });
}

export async function enqueueOpenToWorkPrediction(candidateId, options = {}) {
  return await enqueueTalentSignalProcessing({
    type: 'open-to-work-prediction',
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 6, ...options });
}

export async function enqueueRecruiterResponsePrediction(candidateId, options = {}) {
  return await enqueueTalentSignalProcessing({
    type: 'recruiter-response-prediction',
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 6, ...options });
}

export async function enqueueCareerTransitionPrediction(candidateId, options = {}) {
  return await enqueueTalentSignalProcessing({
    type: 'career-transition-prediction',
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 6, ...options });
}

export async function enqueueStartupAffinityPrediction(candidateId, options = {}) {
  return await enqueueTalentSignalProcessing({
    type: 'startup-affinity-prediction',
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 6, ...options });
}

export async function enqueueLeadershipPotentialPrediction(candidateId, options = {}) {
  return await enqueueTalentSignalProcessing({
    type: 'leadership-potential-prediction',
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 6, ...options });
}

export async function enqueueBatchSignalProcessing(candidateIds, options = {}) {
  return await enqueueTalentSignalProcessing({
    type: 'batch-signal-processing',
    candidateIds,
    timestamp: new Date().toISOString()
  }, { priority: 3, ...options });
}

export async function enqueueSignalRefresh(candidateId, options = {}) {
  return await enqueueTalentSignalProcessing({
    type: 'signal-refresh',
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 4, ...options });
}

export async function getTalentSignalQueueStats() {
  const queue = getTalentSignalQueue();
  
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

export async function startTalentSignalWorker() {
  if (talentSignalWorker) {
    console.log('Talent signal worker already running');
    return talentSignalWorker;
  }

  const { isRedisAvailable } = await import('../../../config/redis.js');
  if (!(await isRedisAvailable())) {
    console.warn('⚠️  Talent signal worker: Redis unavailable or version too old, skipping startup');
    return null;
  }

  talentSignalWorker = new Worker(
    TALENT_SIGNAL_QUEUE_NAME,
    async (job) => {
      const { type, data } = job;
      
      try {
        console.log(`Processing talent signal job: ${type}`, { jobId: job.id });
        
        let result;
        
        switch (type) {
          case 'aggregate-signals':
            result = await processSignalAggregation(data);
            break;
            
          case 'open-to-work-prediction':
            result = await processOpenToWorkPrediction(data);
            break;
            
          case 'recruiter-response-prediction':
            result = await processRecruiterResponsePrediction(data);
            break;
            
          case 'career-transition-prediction':
            result = await processCareerTransitionPrediction(data);
            break;
            
          case 'startup-affinity-prediction':
            result = await processStartupAffinityPrediction(data);
            break;
            
          case 'leadership-potential-prediction':
            result = await processLeadershipPotentialPrediction(data);
            break;
            
          case 'batch-signal-processing':
            result = await processBatchSignalProcessing(data);
            break;
            
          case 'signal-refresh':
            result = await processSignalRefresh(data);
            break;
            
          default:
            throw new Error(`Unknown job type: ${type}`);
        }
        
        console.log(`Completed talent signal job: ${type}`, { jobId: job.id });
        return result;
        
      } catch (error) {
        console.error(`Failed talent signal job: ${type}`, { jobId: job.id, error: error.message });
        throw error;
      }
    },
    {
      connection,
      concurrency: 5, // Higher concurrency for signal processing
      limiter: {
        max: 20, // Max 20 jobs per minute
        duration: 60000 // 1 minute
      }
    }
  );

  talentSignalWorker.on('completed', (job) => {
    console.log(`Talent signal job completed: ${job.name}`, { jobId: job.id });
  });

  talentSignalWorker.on('failed', (job, err) => {
    console.error(`Talent signal job failed: ${job.name}`, { jobId: job.id, error: err.message });
  });

  talentSignalWorker.on('error', (err) => {
    console.error('Talent signal worker error:', err);
  });

  console.log('Talent signal worker started');
  return talentSignalWorker;
}

export async function stopTalentSignalWorker() {
  if (talentSignalWorker) {
    await talentSignalWorker.close();
    talentSignalWorker = null;
    console.log('Talent signal worker stopped');
  }
}

async function processSignalAggregation(data) {
  const { candidateId } = data;
  
  const result = await talentSignalAggregatorService.aggregateTalentSignals(candidateId);
  
  // Update search indices
  await updateSearchIndices(candidateId, result);
  
  return {
    success: true,
    candidateId,
    aggregatedScores: result.aggregatedScores,
    timestamp: new Date()
  };
}

async function processOpenToWorkPrediction(data) {
  const { candidateId } = data;
  
  const prediction = await openToWorkPredictionService.predictOpenToWork(candidateId);
  await openToWorkPredictionService.updateTalentSignal(candidateId, prediction);
  
  return {
    success: true,
    candidateId,
    openToWorkScore: prediction.openToWorkScore,
    timestamp: new Date()
  };
}

async function processRecruiterResponsePrediction(data) {
  const { candidateId } = data;
  
  const prediction = await recruiterResponsePredictionService.predictRecruiterResponse(candidateId);
  await recruiterResponsePredictionService.updateTalentSignal(candidateId, prediction);
  
  return {
    success: true,
    candidateId,
    responseProbability: prediction.responseProbability,
    timestamp: new Date()
  };
}

async function processCareerTransitionPrediction(data) {
  const { candidateId } = data;
  
  const prediction = await careerTransitionPredictionService.predictCareerTransition(candidateId);
  await careerTransitionPredictionService.updateTalentSignal(candidateId, prediction);
  
  return {
    success: true,
    candidateId,
    transitionProbability: prediction.transitionProbability,
    timestamp: new Date()
  };
}

async function processStartupAffinityPrediction(data) {
  const { candidateId } = data;
  
  const prediction = await startupAffinityService.predictStartupAffinity(candidateId);
  await startupAffinityService.updateTalentSignal(candidateId, prediction);
  
  return {
    success: true,
    candidateId,
    startupAffinityScore: prediction.startupAffinityScore,
    timestamp: new Date()
  };
}

async function processLeadershipPotentialPrediction(data) {
  const { candidateId } = data;
  
  const prediction = await leadershipPotentialService.predictLeadershipPotential(candidateId);
  await leadershipPotentialService.updateTalentSignal(candidateId, prediction);
  
  return {
    success: true,
    candidateId,
    leadershipScore: prediction.leadershipScore,
    timestamp: new Date()
  };
}

async function processBatchSignalProcessing(data) {
  const { candidateIds } = data;
  
  const results = await talentSignalAggregatorService.batchAggregateSignals(candidateIds);
  
  // Update search indices for all candidates
  await Promise.all(
    results.map(result => {
      if (result.candidateId && !result.error) {
        return updateSearchIndices(result.candidateId, result);
      }
      return Promise.resolve();
    })
  );
  
  return {
    success: true,
    processedCount: results.length,
    successCount: results.filter(r => !r.error).length,
    timestamp: new Date()
  };
}

async function processSignalRefresh(data) {
  const { candidateId } = data;
  
  const result = await talentSignalAggregatorService.refreshCandidateSignals(candidateId);
  
  // Update search indices
  await updateSearchIndices(candidateId, result);
  
  return {
    success: true,
    candidateId,
    refreshedScores: result.aggregatedScores,
    timestamp: new Date()
  };
}

async function updateSearchIndices(candidateId, signalData) {
  try {
    // Update Elasticsearch index
    await updateElasticsearchIndex(candidateId, signalData);
    
    // Update Qdrant vector
    await updateQdrantVector(candidateId, signalData);
    
  } catch (error) {
    console.error('Error updating search indices:', error);
    // Don't fail the job for search index errors
  }
}

async function updateElasticsearchIndex(candidateId, signalData) {
  // This would integrate with your Elasticsearch client
  // For now, return placeholder
  console.log(`Updating Elasticsearch index for candidate ${candidateId}`);
}

async function updateQdrantVector(candidateId, signalData) {
  // This would integrate with your Qdrant client
  // For now, return placeholder
  console.log(`Updating Qdrant vector for candidate ${candidateId}`);
}

export async function getTalentSignalMetrics(timeRange = '24h') {
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
    signalsGenerated: 0,
    averageConfidence: 0,
    stalePredictions: 0,
    failedSignalJobs: 0,
    processingThroughput: 0
  };
}

export async function getWorkerHealth() {
  try {
    const queueStats = await getTalentSignalQueueStats();
    
    return {
      status: 'healthy',
      queue: queueStats,
      workerRunning: !!talentSignalWorker,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    };
  }
}

export async function clearTalentSignalQueue() {
  const queue = getTalentSignalQueue();
  await queue.obliterate({ force: true });
}

export async function pauseTalentSignalQueue() {
  const queue = getTalentSignalQueue();
  await queue.pause();
}

export async function resumeTalentSignalQueue() {
  const queue = getTalentSignalQueue();
  await queue.resume();
}

export async function schedulePeriodicSignalRefresh(cronExpression = '0 2 * * *') {
  // This would integrate with a cron scheduler
  // For now, return placeholder
  return {
    scheduled: true,
    cronExpression,
    message: 'Periodic signal refresh scheduled'
  };
}

export async function getStaleCandidates(daysThreshold = 30) {
  try {
    const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
    
    const staleCandidates = await TalentSignal.find({
      lastUpdated: { $lt: thresholdDate }
    })
    .select('candidateId lastUpdated')
    .lean();

    return staleCandidates.map(candidate => ({
      candidateId: candidate.candidateId,
      lastUpdated: candidate.lastUpdated,
      daysSinceUpdate: Math.floor((Date.now() - new Date(candidate.lastUpdated).getTime()) / (24 * 60 * 60 * 1000))
    }));
  } catch (error) {
    console.error('Error getting stale candidates:', error);
    return [];
  }
}

export async function refreshStaleCandidates(daysThreshold = 30) {
  try {
    const staleCandidates = await getStaleCandidates(daysThreshold);
    
    const refreshPromises = staleCandidates.map(candidate => 
      enqueueSignalRefresh(candidate.candidateId, { priority: 2 })
    );

    await Promise.all(refreshPromises);
    
    return {
      success: true,
      candidatesQueued: staleCandidates.length,
      threshold: daysThreshold,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error refreshing stale candidates:', error);
    throw error;
  }
}

export default {
  getTalentSignalQueue,
  enqueueTalentSignalProcessing,
  enqueueSignalAggregation,
  enqueueOpenToWorkPrediction,
  enqueueRecruiterResponsePrediction,
  enqueueCareerTransitionPrediction,
  enqueueStartupAffinityPrediction,
  enqueueLeadershipPotentialPrediction,
  enqueueBatchSignalProcessing,
  enqueueSignalRefresh,
  getTalentSignalQueueStats,
  startTalentSignalWorker,
  stopTalentSignalWorker,
  getTalentSignalMetrics,
  getWorkerHealth,
  clearTalentSignalQueue,
  pauseTalentSignalQueue,
  resumeTalentSignalQueue,
  schedulePeriodicSignalRefresh,
  getStaleCandidates,
  refreshStaleCandidates
};
