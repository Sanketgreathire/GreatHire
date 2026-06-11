import { Queue, Worker } from 'bullmq';
import { connection } from '../../../config/redis.js';
import connectorRegistry from './connectorRegistry.service.js';
import { updateIngestionHistoryService } from './discoveryStats.service.js';

const DISCOVERY_QUEUE_NAME = "discovery-ingestion";

let discoveryQueue = null;
let discoveryWorker = null;

export function getDiscoveryQueue() {
  if (!discoveryQueue) {
    discoveryQueue = new Queue(DISCOVERY_QUEUE_NAME, {
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
  return discoveryQueue;
}

export async function enqueueDiscoveryJob(jobName, data, options = {}) {
  const queue = getDiscoveryQueue();
  
  return await queue.add(jobName, data, {
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

export async function enqueueGitHubIngestion(options = {}) {
  return await enqueueDiscoveryJob('github-connector', {
    connectorName: 'github',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 5 });
}

export async function enqueuePublicProfileIngestion(options = {}) {
  return await enqueueDiscoveryJob('public-profile-connector', {
    connectorName: 'public-profile',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 7 });
}

export async function enqueueResumeUrlIngestion(options = {}) {
  return await enqueueDiscoveryJob('resume-url-connector', {
    connectorName: 'resume-url',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 6 });
}

export async function enqueueNormalizationJob(profiles, sourceType) {
  return await enqueueDiscoveryJob('normalization', {
    profiles,
    sourceType,
    timestamp: new Date().toISOString()
  }, { priority: 8 });
}

export async function enqueueDeduplicationJob(profiles) {
  return await enqueueDiscoveryJob('deduplication', {
    profiles,
    timestamp: new Date().toISOString()
  }, { priority: 9 });
}

export async function enqueueEmbeddingJob(candidateId) {
  return await enqueueDiscoveryJob('embedding', {
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 10 });
}

export async function enqueueEnrichmentJob(candidateId) {
  return await enqueueDiscoveryJob('enrichment', {
    candidateId,
    timestamp: new Date().toISOString()
  }, { priority: 10 });
}

export async function getDiscoveryQueueStats() {
  const queue = getDiscoveryQueue();
  
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

export async function clearDiscoveryQueue() {
  const queue = getDiscoveryQueue();
  await queue.obliterate({ force: true });
}

export async function pauseDiscoveryQueue() {
  const queue = getDiscoveryQueue();
  await queue.pause();
}

export async function resumeDiscoveryQueue() {
  const queue = getDiscoveryQueue();
  await queue.resume();
}

export async function startDiscoveryWorker() {
  if (discoveryWorker) {
    console.log('Discovery worker already running');
    return discoveryWorker;
  }

  // Check Redis availability
  const { isRedisAvailable } = await import('../../../config/redis.js');
  if (!(await isRedisAvailable())) {
    console.warn('⚠️  Discovery worker: Redis unavailable or version too old, skipping startup');
    return null;
  }

  discoveryWorker = new Worker(
    DISCOVERY_QUEUE_NAME,
    async (job) => {
      const { name, data } = job;
      
      try {
        console.log(`Processing discovery job: ${name}`, { jobId: job.id });
        
        let result;
        
        switch (name) {
          case 'run-github':
          case 'github-connector':
            result = await processGitHubConnector(data);
            break;
            
          case 'run-public-profile':
          case 'public-profile-connector':
            result = await processPublicProfileConnector(data);
            break;
            
          case 'run-resume-url':
          case 'resume-url-connector':
            result = await processResumeUrlConnector(data);
            break;
            
          case 'normalization':
            result = await processNormalization(data);
            break;
            
          case 'deduplication':
            result = await processDeduplication(data);
            break;
            
          case 'embedding':
            result = await processEmbedding(data);
            break;
            
          case 'enrichment':
            result = await processEnrichment(data);
            break;
            
          default:
            throw new Error(`Unknown job type: ${name}`);
        }
        
        await updateIngestionHistoryService({
          connectorName: data.connectorName || 'unknown',
          status: 'completed',
          jobId: job.id,
          startedAt: new Date(job.timestamp),
          completedAt: new Date(),
          options: data.options,
          result
        });
        
        console.log(`Completed discovery job: ${name}`, { jobId: job.id });
        return result;
        
      } catch (error) {
        console.error(`Failed discovery job: ${name}`, { jobId: job.id, error: error.message });
        
        await updateIngestionHistoryService({
          connectorName: data.connectorName || 'unknown',
          status: 'failed',
          jobId: job.id,
          startedAt: new Date(job.timestamp),
          completedAt: new Date(),
          options: data.options,
          error: error.message
        });
        
        throw error;
      }
    },
    {
      connection,
      concurrency: 5,
      limiter: {
        max: 20,
        duration: 60000 // 1 minute
      }
    }
  );

  discoveryWorker.on('completed', (job) => {
    console.log(`Discovery job completed: ${job.name}`, { jobId: job.id });
  });

  discoveryWorker.on('failed', (job, err) => {
    console.error(`Discovery job failed: ${job.name}`, { jobId: job.id, error: err.message });
  });

  discoveryWorker.on('error', (err) => {
    console.error('Discovery worker error:', err);
  });

  console.log('Discovery worker started');
  return discoveryWorker;
}

export async function stopDiscoveryWorker() {
  if (discoveryWorker) {
    await discoveryWorker.close();
    discoveryWorker = null;
    console.log('Discovery worker stopped');
  }
}

async function processGitHubConnector(data) {
  const connector = connectorRegistry.getConnector('github');
  if (!connector) {
    throw new Error('GitHub connector not found');
  }
  
  return await connector.processProfiles(data.options || {});
}

async function processPublicProfileConnector(data) {
  const connector = connectorRegistry.getConnector('public-profile');
  if (!connector) {
    throw new Error('Public profile connector not found');
  }
  
  return await connector.processProfiles(data.options || {});
}

async function processResumeUrlConnector(data) {
  const connector = connectorRegistry.getConnector('resume-url');
  if (!connector) {
    throw new Error('Resume URL connector not found');
  }
  
  return await connector.processProfiles(data.options || {});
}

async function processNormalization(data) {
  const { profileNormalizationService } = await import('./profileNormalization.service.js');
  return await profileNormalizationService.normalizeProfiles(data.profiles, data.sourceType);
}

async function processDeduplication(data) {
  const { profileDeduplicationService } = await import('./profileDeduplication.service.js');
  return await profileDeduplicationService.deduplicateProfiles(data.profiles);
}

async function processEmbedding(data) {
  const { enqueueEmbedding } = await import('../../../../sourcing/ai/embeddingQueue.js');
  await enqueueEmbedding(data.candidateId);
  return { success: true, candidateId: data.candidateId };
}

async function processEnrichment(data) {
  const { enqueueSingleEnrichment } = await import('../../enrichment/services/enrichmentQueue.service.js');
  await enqueueSingleEnrichment({ candidateId: data.candidateId });
  return { success: true, candidateId: data.candidateId };
}

export default {
  getDiscoveryQueue,
  enqueueDiscoveryJob,
  enqueueGitHubIngestion,
  enqueuePublicProfileIngestion,
  enqueueResumeUrlIngestion,
  enqueueNormalizationJob,
  enqueueDeduplicationJob,
  enqueueEmbeddingJob,
  enqueueEnrichmentJob,
  getDiscoveryQueueStats,
  clearDiscoveryQueue,
  pauseDiscoveryQueue,
  resumeDiscoveryQueue,
  startDiscoveryWorker,
  stopDiscoveryWorker
};
