import { Queue } from 'bullmq';
import { connection } from '../../config/redis.js';

export const ENRICHMENT_QUEUE_NAME = "candidates:enrichment";

let enrichmentQueue = null;

export function getEnrichmentQueue() {
  if (!enrichmentQueue) {
    enrichmentQueue = new Queue(ENRICHMENT_QUEUE_NAME, {
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
  return enrichmentQueue;
}

export async function enqueueEnrichment(candidateId, options = {}) {
  const queue = getEnrichmentQueue();
  
  return await queue.add('enrich-candidate', {
    candidateId,
    options: {
      ...options,
      timestamp: new Date().toISOString()
    }
  }, {
    priority: options.priority || 0,
    delay: options.delay || 0,
    attempts: options.attempts || 3
  });
}

export async function enqueueBulkEnrichment(candidateIds, options = {}) {
  const queue = getEnrichmentQueue();
  
  return await queue.add('bulk-enrich-candidates', {
    candidateIds,
    options: {
      ...options,
      timestamp: new Date().toISOString()
    }
  }, {
    priority: options.priority || 0,
    delay: options.delay || 0,
    attempts: options.attempts || 3
  });
}

export async function isEnrichmentQueueAvailable() {
  try {
    const queue = getEnrichmentQueue();
    await queue.getWaiting();
    return true;
  } catch (error) {
    console.error('Enrichment queue error:', error);
    return false;
  }
}

export default {
  getEnrichmentQueue,
  enqueueEnrichment,
  enqueueBulkEnrichment,
  isEnrichmentQueueAvailable
};
