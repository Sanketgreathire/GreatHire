import { Queue, Worker } from 'bullmq';
import { connection } from '../../../config/redis.js';
import { githubConnector } from '../connectors/github/githubConnector.service.js';
import { profileNormalizationService } from '../services/profileNormalization.service.js';
import { profileDeduplicationService } from '../services/profileDeduplication.service.js';
import { enqueueEmbedding } from '../../../../sourcing/ai/embeddingQueue.js';
import { enqueueSingleEnrichment } from '../../enrichment/services/enrichmentQueue.service.js';
import { updateIngestionHistoryService } from '../services/discoveryStats.service.js';

const GITHUB_DISCOVERY_QUEUE_NAME = "github-discovery";

let githubDiscoveryQueue = null;
let githubDiscoveryWorker = null;

export function getGitHubDiscoveryQueue() {
  if (!githubDiscoveryQueue) {
    githubDiscoveryQueue = new Queue(GITHUB_DISCOVERY_QUEUE_NAME, {
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
  return githubDiscoveryQueue;
}

export async function enqueueGitHubDiscovery(data, options = {}) {
  const queue = getGitHubDiscoveryQueue();
  
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

export async function enqueueBulkGitHubDiscovery(options = {}) {
  return await enqueueGitHubDiscovery({
    type: 'bulk-discovery',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 5 });
}

export async function enqueueSingleGitHubDiscovery(username, options = {}) {
  return await enqueueGitHubDiscovery({
    type: 'single-discovery',
    username,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 8 });
}

export async function enqueueBatchGitHubDiscovery(usernames, options = {}) {
  return await enqueueGitHubDiscovery({
    type: 'batch-discovery',
    usernames,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 7 });
}

export async function getGitHubDiscoveryQueueStats() {
  const queue = getGitHubDiscoveryQueue();
  
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

export async function clearGitHubDiscoveryQueue() {
  const queue = getGitHubDiscoveryQueue();
  await queue.obliterate({ force: true });
}

export async function pauseGitHubDiscoveryQueue() {
  const queue = getGitHubDiscoveryQueue();
  await queue.pause();
}

export async function resumeGitHubDiscoveryQueue() {
  const queue = getGitHubDiscoveryQueue();
  await queue.resume();
}

export function startGitHubDiscoveryWorker() {
  if (githubDiscoveryWorker) {
    console.log('GitHub discovery worker already running');
    return githubDiscoveryWorker;
  }

  githubDiscoveryWorker = new Worker(
    GITHUB_DISCOVERY_QUEUE_NAME,
    async (job) => {
      const { type, data } = job;
      
      try {
        console.log(`Processing GitHub discovery job: ${type}`, { jobId: job.id });
        
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
          connectorName: 'github-discovery',
          status: 'completed',
          jobId: job.id,
          startedAt: new Date(job.timestamp),
          completedAt: new Date(),
          options: data.options,
          result
        });
        
        console.log(`Completed GitHub discovery job: ${type}`, { jobId: job.id });
        return result;
        
      } catch (error) {
        console.error(`Failed GitHub discovery job: ${type}`, { jobId: job.id, error: error.message });
        
        await updateIngestionHistoryService({
          connectorName: 'github-discovery',
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
      concurrency: 3, // Lower concurrency for GitHub API
      limiter: {
        max: 10, // Max 10 jobs per minute
        duration: 60000 // 1 minute
      }
    }
  );

  githubDiscoveryWorker.on('completed', (job) => {
    console.log(`GitHub discovery job completed: ${job.name}`, { jobId: job.id });
  });

  githubDiscoveryWorker.on('failed', (job, err) => {
    console.error(`GitHub discovery job failed: ${job.name}`, { jobId: job.id, error: err.message });
  });

  githubDiscoveryWorker.on('error', (err) => {
    console.error('GitHub discovery worker error:', err);
  });

  console.log('GitHub discovery worker started');
  return githubDiscoveryWorker;
}

export async function stopGitHubDiscoveryWorker() {
  if (githubDiscoveryWorker) {
    await githubDiscoveryWorker.close();
    githubDiscoveryWorker = null;
    console.log('GitHub discovery worker stopped');
  }
}

async function processBulkDiscovery(data) {
  const { options = {} } = data;
  
  const discoveryResult = await githubConnector.bulkDiscover({
    queries: options.queries || [
      'software developer location:"San Francisco" followers:>50',
      'full stack developer location:"New York" followers:>30',
      'frontend developer location:"London" followers:>40',
      'backend developer location:"Berlin" followers:>35',
      'devops engineer location:"Amsterdam" followers:>25',
      'machine learning engineer location:"Boston" followers:>45',
      'data scientist location:"Seattle" followers:>40',
      'react developer location:"Austin" followers:>30',
      'node.js developer location:"Toronto" followers:>35',
      'python developer location:"Chicago" followers:>30'
    ],
    limit: options.limit || 100,
    followers: options.followers || '>=50',
    repos: options.repos || '>=10'
  });

  const processedProfiles = [];
  
  for (const result of discoveryResult.results) {
    for (const profile of result.profiles) {
      try {
        const processedProfile = await processGitHubProfile(profile);
        if (processedProfile) {
          processedProfiles.push(processedProfile);
        }
      } catch (error) {
        console.error('Error processing GitHub profile:', error);
      }
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
  const { username, options = {} } = data;
  
  const profile = await githubConnector.fetchCompleteProfile(username);
  
  if (!profile) {
    throw new Error(`Failed to fetch profile for ${username}`);
  }

  const processedProfile = await processGitHubProfile(profile);
  
  return {
    success: true,
    type: 'single-discovery',
    username,
    profile: processedProfile
  };
}

async function processBatchDiscovery(data) {
  const { usernames, options = {} } = data;
  
  const processedProfiles = [];
  
  for (const username of usernames) {
    try {
      const profile = await githubConnector.fetchCompleteProfile(username);
      
      if (profile) {
        const processedProfile = await processGitHubProfile(profile);
        if (processedProfile) {
          processedProfiles.push(processedProfile);
        }
      }
    } catch (error) {
      console.error(`Error processing batch discovery for ${username}:`, error);
    }
  }

  return {
    success: true,
    type: 'batch-discovery',
    totalProfiles: processedProfiles.length,
    profiles: processedProfiles
  };
}

async function processGitHubProfile(profile) {
  try {
    // Normalize profile
    const normalizedProfile = await profileNormalizationService.normalizeProfile(profile, 'github');
    
    // Deduplicate profile
    const deduplicationResult = await profileDeduplicationService.deduplicateProfiles([normalizedProfile]);
    
    if (deduplicationResult.duplicates.length > 0) {
      console.log(`Duplicate profile found for ${profile.githubUsername}`);
      return null;
    }
    
    // Save candidate
    const candidate = await githubConnector.saveProfile(normalizedProfile);
    
    // Enqueue for embedding
    await enqueueEmbedding(candidate._id);
    
    // Enqueue for enrichment
    await enqueueSingleEnrichment({ candidateId: candidate._id.toString() });
    
    return {
      candidateId: candidate._id,
      githubUsername: profile.githubUsername,
      name: normalizedProfile.name,
      email: normalizedProfile.email,
      skills: normalizedProfile.skills,
      inferredSkills: profile.inferredSkills,
      contributionScore: profile.contributionScore,
      developerScore: profile.developerScore
    };
    
  } catch (error) {
    console.error('Error processing GitHub profile:', error);
    throw error;
  }
}

export async function scheduleGitHubDiscovery(options = {}) {
  const {
    cronExpression = '0 2 * * *', // Daily at 2 AM
    queries,
    limit = 100,
    priority = 5
  } = options;

  return await enqueueGitHubDiscovery({
    type: 'scheduled-discovery',
    options: {
      queries,
      limit,
      cronExpression
    },
    timestamp: new Date().toISOString()
  }, { priority });
}

export async function getGitHubDiscoveryMetrics(timeRange = '24h') {
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
    profilesFetched: 0,
    profilesIndexed: 0,
    failedProfiles: 0,
    duplicateProfiles: 0,
    enrichmentQueueSize: 0,
    averageProcessingTime: 0,
    successRate: 0
  };
}

export async function retryFailedGitHubDiscovery(jobId) {
  const queue = getGitHubDiscoveryQueue();
  const job = await queue.getJob(jobId);
  
  if (job) {
    await job.retry();
    return { success: true, message: `Job ${jobId} retry started` };
  }
  
  throw new Error(`Job ${jobId} not found`);
}

export async function cancelGitHubDiscovery(jobId) {
  const queue = getGitHubDiscoveryQueue();
  const job = await queue.getJob(jobId);
  
  if (job) {
    await job.remove();
    return { success: true, message: `Job ${jobId} cancelled` };
  }
  
  throw new Error(`Job ${jobId} not found`);
}

export default {
  getGitHubDiscoveryQueue,
  enqueueGitHubDiscovery,
  enqueueBulkGitHubDiscovery,
  enqueueSingleGitHubDiscovery,
  enqueueBatchGitHubDiscovery,
  getGitHubDiscoveryQueueStats,
  clearGitHubDiscoveryQueue,
  pauseGitHubDiscoveryQueue,
  resumeGitHubDiscoveryQueue,
  startGitHubDiscoveryWorker,
  stopGitHubDiscoveryWorker,
  scheduleGitHubDiscovery,
  getGitHubDiscoveryMetrics,
  retryFailedGitHubDiscovery,
  cancelGitHubDiscovery
};
