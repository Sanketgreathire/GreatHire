import { Queue, Worker } from 'bullmq';
import { connection } from '../../../config/redis.js';
import { resumeDiscovery } from '../connectors/resume/resumeDiscovery.service.js';
import { profileNormalizationService } from '../services/profileNormalization.service.js';
import { profileDeduplicationService } from '../services/profileDeduplication.service.js';
import { enqueueEmbedding } from '../../../../sourcing/ai/embeddingQueue.js';
import { enqueueSingleEnrichment } from '../../enrichment/services/enrichmentQueue.service.js';
import { updateIngestionHistoryService } from '../services/discoveryStats.service.js';

const RESUME_DISCOVERY_QUEUE_NAME = "resume-discovery";

let resumeDiscoveryQueue = null;
let resumeDiscoveryWorker = null;

export function getResumeDiscoveryQueue() {
  if (!resumeDiscoveryQueue) {
    resumeDiscoveryQueue = new Queue(RESUME_DISCOVERY_QUEUE_NAME, {
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
  return resumeDiscoveryQueue;
}

export async function enqueueResumeDiscovery(data, options = {}) {
  const queue = getResumeDiscoveryQueue();
  
  return await queue.add(data.type || 'bulk-discovery', data, {
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

export async function enqueueBulkResumeDiscovery(options = {}) {
  return await enqueueResumeDiscovery({
    type: 'bulk-discovery',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 5 });
}

export async function enqueueSingleResumeDiscovery(url, options = {}) {
  return await enqueueResumeDiscovery({
    type: 'single-discovery',
    url,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 8 });
}

export async function enqueueBatchResumeDiscovery(urls, options = {}) {
  return await enqueueResumeDiscovery({
    type: 'batch-discovery',
    urls,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 7 });
}

export async function getResumeDiscoveryQueueStats() {
  const queue = getResumeDiscoveryQueue();
  
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

export async function clearResumeDiscoveryQueue() {
  const queue = getResumeDiscoveryQueue();
  await queue.obliterate({ force: true });
}

export async function pauseResumeDiscoveryQueue() {
  const queue = getResumeDiscoveryQueue();
  await queue.pause();
}

export async function resumeResumeDiscoveryQueue() {
  const queue = getResumeDiscoveryQueue();
  await queue.resume();
}

export async function startResumeDiscoveryWorker() {
  if (resumeDiscoveryWorker) {
    console.log('Resume discovery worker already running');
    return resumeDiscoveryWorker;
  }

  const { isRedisAvailable } = await import('../../../config/redis.js');
  if (!(await isRedisAvailable())) {
    console.warn('⚠️  Resume discovery worker: Redis unavailable or version too old, skipping startup');
    return null;
  }

  resumeDiscoveryWorker = new Worker(
    RESUME_DISCOVERY_QUEUE_NAME,
    async (job) => {
      const { type, data } = job;
      
      try {
        console.log(`Processing resume discovery job: ${type}`, { jobId: job.id });
        
        let result;
        
        switch (type) {
          case 'bulk-discovery':
            result = await processBulkDiscovery(data);
            break;
            
          case 'single-discovery':
            result = await processSingleDiscovery(data);
            break;
            
          case 'batch-discovery':
            result = await processBatchDiscovery(data);
            break;
            
          default:
            throw new Error(`Unknown job type: ${type}`);
        }
        
        await updateIngestionHistoryService({
          connectorName: 'resume-discovery',
          status: 'completed',
          jobId: job.id,
          startedAt: new Date(job.timestamp),
          completedAt: new Date(),
          options: data.options,
          result
        });
        
        console.log(`Completed resume discovery job: ${type}`, { jobId: job.id });
        return result;
        
      } catch (error) {
        console.error(`Failed resume discovery job: ${type}`, { jobId: job.id, error: error.message });
        
        await updateIngestionHistoryService({
          connectorName: 'resume-discovery',
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
      concurrency: 3, // Moderate concurrency for document processing
      limiter: {
        max: 15, // Max 15 jobs per minute
        duration: 60000 // 1 minute
      }
    }
  );

  resumeDiscoveryWorker.on('completed', (job) => {
    console.log(`Resume discovery job completed: ${job.name}`, { jobId: job.id });
  });

  resumeDiscoveryWorker.on('failed', (job, err) => {
    console.error(`Resume discovery job failed: ${job.name}`, { jobId: job.id, error: err.message });
  });

  resumeDiscoveryWorker.on('error', (err) => {
    console.error('Resume discovery worker error:', err);
  });

  console.log('Resume discovery worker started');
  return resumeDiscoveryWorker;
}

export async function stopResumeDiscoveryWorker() {
  if (resumeDiscoveryWorker) {
    await resumeDiscoveryWorker.close();
    resumeDiscoveryWorker = null;
    console.log('Resume discovery worker stopped');
  }
}

async function processBulkDiscovery(data) {
  const { options = {} } = data;
  
  const discoveryResult = await resumeDiscovery.bulkDiscover({
    queries: options.queries || [
      'software developer resume filetype:pdf',
      'web developer resume filetype:doc',
      'full stack developer resume filetype:docx',
      'frontend developer resume filetype:pdf',
      'backend developer resume filetype:pdf',
      'devops engineer resume filetype:pdf',
      'mobile developer resume filetype:pdf',
      'data scientist resume filetype:pdf'
    ],
    domains: options.domains || [],
    limit: options.limit || 100
  });

  const processedProfiles = [];
  
  for (const documentInfo of discoveryResult.results) {
    try {
      const processedProfile = await processResumeProfile(documentInfo);
      if (processedProfile) {
        processedProfiles.push(processedProfile);
      }
    } catch (error) {
      console.error('Error processing resume profile:', error);
    }
  }

  return {
    success: true,
    type: 'bulk-discovery',
    totalProfiles: processedProfiles.length,
    profiles: processedProfiles,
    stats: discoveryResult.stats
  };
}

async function processSingleDiscovery(data) {
  const { url, options = {} } = data;
  
  const documentInfo = await resumeDiscovery.downloadResume(url);
  
  if (!documentInfo) {
    throw new Error(`Failed to download resume from ${url}`);
  }

  const processedProfile = await processResumeProfile(documentInfo);
  
  return {
    success: true,
    type: 'single-discovery',
    url,
    profile: processedProfile
  };
}

async function processBatchDiscovery(data) {
  const { urls, options = {} } = data;
  
  const processedProfiles = [];
  
  for (const url of urls) {
    try {
      const documentInfo = await resumeDiscovery.downloadResume(url);
      
      if (documentInfo) {
        const processedProfile = await processResumeProfile(documentInfo);
        if (processedProfile) {
          processedProfiles.push(processedProfile);
        }
      }
    } catch (error) {
      console.error(`Error processing batch discovery for ${url}:`, error);
    }
  }

  return {
    success: true,
    type: 'batch-discovery',
    totalProfiles: processedProfiles.length,
    profiles: processedProfiles
  };
}

async function processResumeProfile(documentInfo) {
  try {
    // Process resume document
    const resumeData = await resumeDiscovery.processResume(documentInfo);
    
    // Normalize profile
    const normalizedProfile = await profileNormalizationService.normalizeProfile(resumeData.normalizedData, 'resume');
    
    // Deduplicate profile
    const deduplicationResult = await profileDeduplicationService.deduplicateProfiles([normalizedProfile]);
    
    if (deduplicationResult.duplicates.length > 0) {
      console.log(`Duplicate profile found for ${documentInfo.url}`);
      return null;
    }
    
    // Save candidate
    const candidate = await resumeDiscovery.saveResumeProfile(resumeData);
    
    // Enqueue for embedding
    await enqueueEmbedding(candidate._id);
    
    // Enqueue for enrichment
    await enqueueSingleEnrichment({ candidateId: candidate._id.toString() });
    
    return {
      candidateId: candidate._id,
      resumeUrl: documentInfo.url,
      name: normalizedProfile.name,
      email: normalizedProfile.email,
      skills: normalizedProfile.skills,
      parsingConfidence: resumeData.parsingConfidence,
      documentType: documentInfo.documentType
    };
    
  } catch (error) {
    console.error('Error processing resume profile:', error);
    throw error;
  }
}

export async function scheduleResumeDiscovery(options = {}) {
  const {
    cronExpression = '0 4 * * *', // Daily at 4 AM
    queries,
    limit = 100,
    priority = 5
  } = options;

  return await enqueueResumeDiscovery({
    type: 'scheduled-discovery',
    options: {
      queries,
      limit,
      cronExpression
    },
    timestamp: new Date().toISOString()
  }, { priority });
}

export async function getResumeDiscoveryMetrics(timeRange = '24h') {
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
    documentsProcessed: 0,
    parseSuccessRate: 0,
    duplicateProfiles: 0,
    failedDownloads: 0,
    failedParsingJobs: 0,
    enrichmentQueueSize: 0,
    averageProcessingTime: 0,
    successRate: 0
  };
}

export async function retryFailedResumeDiscovery(jobId) {
  const queue = getResumeDiscoveryQueue();
  const job = await queue.getJob(jobId);
  
  if (job) {
    await job.retry();
    return { success: true, message: `Job ${jobId} retry started` };
  }
  
  throw new Error(`Job ${jobId} not found`);
}

export async function cancelResumeDiscovery(jobId) {
  const queue = getResumeDiscoveryQueue();
  const job = await queue.getJob(jobId);
  
  if (job) {
    await job.remove();
    return { success: true, message: `Job ${jobId} cancelled` };
  }
  
  throw new Error(`Job ${jobId} not found`);
}

// Distributed workers for different stages
export async function startDocumentDownloadWorker() {
  const downloadWorker = new Worker(
    'resume-document-download',
    async (job) => {
      const { url, options = {} } = job.data;
      
      try {
        const documentInfo = await resumeDiscovery.downloadResume(url);
        return { success: true, data: documentInfo };
      } catch (error) {
        console.error(`Document download failed for ${url}:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 5,
      limiter: {
        max: 20,
        duration: 60000
      }
    }
  );

  downloadWorker.on('error', (err) => {
    console.error('Document download worker error:', err);
  });

  return downloadWorker;
}

export async function startDocumentParsingWorker() {
  const parsingWorker = new Worker(
    'resume-document-parsing',
    async (job) => {
      const { documentInfo, options = {} } = job.data;
      
      try {
        const resumeData = await resumeDiscovery.processResume(documentInfo);
        return { success: true, data: resumeData };
      } catch (error) {
        console.error(`Document parsing failed for ${documentInfo.url}:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 3,
      limiter: {
        max: 15,
        duration: 60000
      }
    }
  );

  parsingWorker.on('error', (err) => {
    console.error('Document parsing worker error:', err);
  });

  return parsingWorker;
}

export async function startNormalizationWorker() {
  const normalizationWorker = new Worker(
    'resume-normalization',
    async (job) => {
      const { resumeData, options = {} } = job.data;
      
      try {
        const normalizedProfile = await profileNormalizationService.normalizeProfile(resumeData.normalizedData, 'resume');
        return { success: true, data: normalizedProfile };
      } catch (error) {
        console.error(`Normalization failed for ${resumeData.url}:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 10,
      limiter: {
        max: 50,
        duration: 60000
      }
    }
  );

  normalizationWorker.on('error', (err) => {
    console.error('Normalization worker error:', err);
  });

  return normalizationWorker;
}

export async function startDeduplicationWorker() {
  const deduplicationWorker = new Worker(
    'resume-deduplication',
    async (job) => {
      const { profiles, options = {} } = job.data;
      
      try {
        const deduplicationResult = await profileDeduplicationService.deduplicateProfiles(profiles);
        return { success: true, data: deduplicationResult };
      } catch (error) {
        console.error('Deduplication failed:', error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 5,
      limiter: {
        max: 20,
        duration: 60000
      }
    }
  );

  deduplicationWorker.on('error', (err) => {
    console.error('Deduplication worker error:', err);
  });

  return deduplicationWorker;
}

export async function startEmbeddingWorker() {
  const embeddingWorker = new Worker(
    'resume-embedding',
    async (job) => {
      const { candidateId, options = {} } = job.data;
      
      try {
        await enqueueEmbedding(candidateId);
        return { success: true, candidateId };
      } catch (error) {
        console.error(`Embedding failed for candidate ${candidateId}:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 8,
      limiter: {
        max: 30,
        duration: 60000
      }
    }
  );

  embeddingWorker.on('error', (err) => {
    console.error('Embedding worker error:', err);
  });

  return embeddingWorker;
}

export async function startEnrichmentWorker() {
  const enrichmentWorker = new Worker(
    'resume-enrichment',
    async (job) => {
      const { candidateId, options = {} } = job.data;
      
      try {
        await enqueueSingleEnrichment({ candidateId: candidateId.toString() });
        return { success: true, candidateId };
      } catch (error) {
        console.error(`Enrichment failed for candidate ${candidateId}:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 5,
      limiter: {
        max: 20,
        duration: 60000
      }
    }
  );

  enrichmentWorker.on('error', (err) => {
    console.error('Enrichment worker error:', err);
  });

  return enrichmentWorker;
}

export async function startAllResumeWorkers() {
  const workers = await Promise.all([
    startDocumentDownloadWorker(),
    startDocumentParsingWorker(),
    startNormalizationWorker(),
    startDeduplicationWorker(),
    startEmbeddingWorker(),
    startEnrichmentWorker()
  ]);

  console.log('All resume workers started');
  return workers;
}

export async function stopAllResumeWorkers() {
  const workers = await Promise.all([
    stopResumeDiscoveryWorker()
  ]);

  console.log('All resume workers stopped');
  return workers;
}

export default {
  getResumeDiscoveryQueue,
  enqueueResumeDiscovery,
  enqueueBulkResumeDiscovery,
  enqueueSingleResumeDiscovery,
  enqueueBatchResumeDiscovery,
  getResumeDiscoveryQueueStats,
  clearResumeDiscoveryQueue,
  pauseResumeDiscoveryQueue,
  resumeResumeDiscoveryQueue,
  startResumeDiscoveryWorker,
  stopResumeDiscoveryWorker,
  scheduleResumeDiscovery,
  getResumeDiscoveryMetrics,
  retryFailedResumeDiscovery,
  cancelResumeDiscovery,
  startDocumentDownloadWorker,
  startDocumentParsingWorker,
  startNormalizationWorker,
  startDeduplicationWorker,
  startEmbeddingWorker,
  startEnrichmentWorker,
  startAllResumeWorkers,
  stopAllResumeWorkers
};
