import { Queue, Worker } from 'bullmq';
import { connection } from '../../../config/redis.js';
import { portfolioConnector } from '../connectors/portfolio/portfolioConnector.service.js';
import { profileNormalizationService } from '../services/profileNormalization.service.js';
import { profileDeduplicationService } from '../services/profileDeduplication.service.js';
import { enqueueEmbedding } from '../../../../sourcing/ai/embeddingQueue.js';
import { enqueueSingleEnrichment } from '../../enrichment/services/enrichmentQueue.service.js';
import { updateIngestionHistoryService } from '../services/discoveryStats.service.js';
// import cherio from 'cherio';


const PORTFOLIO_DISCOVERY_QUEUE_NAME = "portfolio-discovery";

let portfolioDiscoveryQueue = null;
let portfolioDiscoveryWorker = null;

export function getPortfolioDiscoveryQueue() {
  if (!portfolioDiscoveryQueue) {
    portfolioDiscoveryQueue = new Queue(PORTFOLIO_DISCOVERY_QUEUE_NAME, {
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
  return portfolioDiscoveryQueue;
}

export async function enqueuePortfolioDiscovery(data, options = {}) {
  const queue = getPortfolioDiscoveryQueue();
  
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

export async function enqueueBulkPortfolioDiscovery(options = {}) {
  return await enqueuePortfolioDiscovery({
    type: 'bulk-discovery',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 5 });
}

export async function enqueueSinglePortfolioDiscovery(url, options = {}) {
  return await enqueuePortfolioDiscovery({
    type: 'single-discovery',
    url,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 8 });
}

export async function enqueueBatchPortfolioDiscovery(urls, options = {}) {
  return await enqueuePortfolioDiscovery({
    type: 'batch-discovery',
    urls,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 7 });
}

export async function getPortfolioDiscoveryQueueStats() {
  const queue = getPortfolioDiscoveryQueue();
  
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

export async function clearPortfolioDiscoveryQueue() {
  const queue = getPortfolioDiscoveryQueue();
  await queue.obliterate({ force: true });
}

export async function pausePortfolioDiscoveryQueue() {
  const queue = getPortfolioDiscoveryQueue();
  await queue.pause();
}

export async function resumePortfolioDiscoveryQueue() {
  const queue = getPortfolioDiscoveryQueue();
  await queue.resume();
}

export async function startPortfolioDiscoveryWorker() {
  if (portfolioDiscoveryWorker) {
    console.log('Portfolio discovery worker already running');
    return portfolioDiscoveryWorker;
  }

  const { isRedisAvailable } = await import('../../../config/redis.js');
  if (!(await isRedisAvailable())) {
    console.warn('⚠️  Portfolio discovery worker: Redis unavailable or version too old, skipping startup');
    return null;
  }

  portfolioDiscoveryWorker = new Worker(
    PORTFOLIO_DISCOVERY_QUEUE_NAME,
    async (job) => {
      const { type, data } = job;
      
      try {
        console.log(`Processing portfolio discovery job: ${type}`, { jobId: job.id });
        
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
          connectorName: 'portfolio-discovery',
          status: 'completed',
          jobId: job.id,
          startedAt: new Date(job.timestamp),
          completedAt: new Date(),
          options: data.options,
          result
        });
        
        console.log(`Completed portfolio discovery job: ${type}`, { jobId: job.id });
        return result;
        
      } catch (error) {
        console.error(`Failed portfolio discovery job: ${type}`, { jobId: job.id, error: error.message });
        
        await updateIngestionHistoryService({
          connectorName: 'portfolio-discovery',
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
      concurrency: 5, // Moderate concurrency for web crawling
      limiter: {
        max: 20, // Max 20 jobs per minute
        duration: 60000 // 1 minute
      }
    }
  );

  portfolioDiscoveryWorker.on('completed', (job) => {
    console.log(`Portfolio discovery job completed: ${job.name}`, { jobId: job.id });
  });

  portfolioDiscoveryWorker.on('failed', (job, err) => {
    console.error(`Portfolio discovery job failed: ${job.name}`, { jobId: job.id, error: err.message });
  });

  portfolioDiscoveryWorker.on('error', (err) => {
    console.error('Portfolio discovery worker error:', err);
  });

  console.log('Portfolio discovery worker started');
  return portfolioDiscoveryWorker;
}

export async function stopPortfolioDiscoveryWorker() {
  if (portfolioDiscoveryWorker) {
    await portfolioDiscoveryWorker.close();
    portfolioDiscoveryWorker = null;
    console.log('Portfolio discovery worker stopped');
  }
}

async function processBulkDiscovery(data) {
  const { options = {} } = data;
  
  const discoveryResult = await portfolioConnector.bulkDiscover({
    queries: options.queries || [
      'software developer portfolio site:.com',
      'web developer portfolio site:.org',
      'full stack developer portfolio site:.io',
      'frontend developer portfolio site:.dev',
      'backend developer portfolio site:.me',
      'devops engineer portfolio site:.co',
      'mobile developer portfolio site:.app',
      'data scientist portfolio site:.tech',
      'ui/ux designer portfolio site:.design'
    ],
    domains: options.domains || [],
    limit: options.limit || 100
  });

  const processedProfiles = [];
  
  for (const portfolioData of discoveryResult.results) {
    try {
      const processedProfile = await processPortfolioProfile(portfolioData);
      if (processedProfile) {
        processedProfiles.push(processedProfile);
      }
    } catch (error) {
      console.error('Error processing portfolio profile:', error);
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
  
  const portfolioData = await portfolioConnector.crawlPortfolioUrl(url);
  
  if (!portfolioData) {
    throw new Error(`Failed to crawl portfolio URL: ${url}`);
  }

  const processedProfile = await processPortfolioProfile(portfolioData);
  
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
      const portfolioData = await portfolioConnector.crawlPortfolioUrl(url);
      
      if (portfolioData) {
        const processedProfile = await processPortfolioProfile(portfolioData);
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

async function processPortfolioProfile(portfolioData) {
  try {
    // Normalize profile
    const normalizedProfile = await profileNormalizationService.normalizeProfile(portfolioData, 'portfolio');
    
    // Deduplicate profile
    const deduplicationResult = await profileDeduplicationService.deduplicateProfiles([normalizedProfile]);
    
    if (deduplicationResult.duplicates.length > 0) {
      console.log(`Duplicate profile found for ${portfolioData.url}`);
      return null;
    }
    
    // Save candidate
    const candidate = await portfolioConnector.savePortfolioProfile(portfolioData);
    
    // Enqueue for embedding
    await enqueueEmbedding(candidate._id);
    
    // Enqueue for enrichment
    await enqueueSingleEnrichment({ candidateId: candidate._id.toString() });
    
    return {
      candidateId: candidate._id,
      portfolioUrl: portfolioData.url,
      name: normalizedProfile.name,
      email: normalizedProfile.email,
      skills: normalizedProfile.skills,
      portfolioScore: portfolioData.portfolioScore,
      engineeringSignals: portfolioData.engineeringSignals
    };
    
  } catch (error) {
    console.error('Error processing portfolio profile:', error);
    throw error;
  }
}

export async function schedulePortfolioDiscovery(options = {}) {
  const {
    cronExpression = '0 3 * * *', // Daily at 3 AM
    queries,
    limit = 100,
    priority = 5
  } = options;

  return await enqueuePortfolioDiscovery({
    type: 'scheduled-discovery',
    options: {
      queries,
      limit,
      cronExpression
    },
    timestamp: new Date().toISOString()
  }, { priority });
}

export async function getPortfolioDiscoveryMetrics(timeRange = '24h') {
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
    pagesCrawled: 0,
    profilesExtracted: 0,
    failedCrawls: 0,
    duplicateCandidates: 0,
    enrichmentQueueSize: 0,
    averageProcessingTime: 0,
    successRate: 0
  };
}

export async function retryFailedPortfolioDiscovery(jobId) {
  const queue = getPortfolioDiscoveryQueue();
  const job = await queue.getJob(jobId);
  
  if (job) {
    await job.retry();
    return { success: true, message: `Job ${jobId} retry started` };
  }
  
  throw new Error(`Job ${jobId} not found`);
}

export async function cancelPortfolioDiscovery(jobId) {
  const queue = getPortfolioDiscoveryQueue();
  const job = await queue.getJob(jobId);
  
  if (job) {
    await job.remove();
    return { success: true, message: `Job ${jobId} cancelled` };
  }
  
  throw new Error(`Job ${jobId} not found`);
}

export default {
  getPortfolioDiscoveryQueue,
  enqueuePortfolioDiscovery,
  enqueueBulkPortfolioDiscovery,
  enqueueSinglePortfolioDiscovery,
  enqueueBatchPortfolioDiscovery,
  getPortfolioDiscoveryQueueStats,
  clearPortfolioDiscoveryQueue,
  pausePortfolioDiscoveryQueue,
  resumePortfolioDiscoveryQueue,
  startPortfolioDiscoveryWorker,
  stopPortfolioDiscoveryWorker,
  schedulePortfolioDiscovery,
  getPortfolioDiscoveryMetrics,
  retryFailedPortfolioDiscovery,
  cancelPortfolioDiscovery
};
