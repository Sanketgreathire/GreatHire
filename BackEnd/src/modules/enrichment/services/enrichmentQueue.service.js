import Bull from "bull";
import { getRedisConnection } from "../../../config/redis.js";
import { enrichCandidate } from "./candidateEnrichment.service.js";
import { saveEnrichmentRecord } from "./enrichmentHistory.service.js";

const ENRICHMENT_QUEUE_NAME = "enrichment-bulk-processing";

let enrichmentQueue = null;

export async function getEnrichmentQueue() {
  if (!enrichmentQueue) {
    const connection = await getRedisConnection();
    enrichmentQueue = new Bull(ENRICHMENT_QUEUE_NAME, {
      redis: {
        host: connection.options.host,
        port: connection.options.port,
        password: connection.options.password,
        db: connection.options.db
      },
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000
        }
      }
    });
    
    enrichmentQueue.process("bulk-enrichment", 3, processBulkEnrichment);
    enrichmentQueue.process("single-enrichment", 5, processSingleEnrichment);
    enrichmentQueue.process("github-analysis", 2, processGitHubAnalysis);
    enrichmentQueue.process("skill-inference", 4, processSkillInference);
  }
  
  return enrichmentQueue;
}

export async function enqueueBulkEnrichment(queueData) {
  try {
    const queue = await getEnrichmentQueue();
    
    const job = await queue.add("bulk-enrichment", queueData, {
      priority: 10,
      delay: 0,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000
      }
    });
    
    return job.id;
  } catch (error) {
    console.error("Error enqueuing bulk enrichment:", error);
    throw new Error(`Failed to enqueue bulk enrichment: ${error.message}`);
  }
}

export async function enqueueSingleEnrichment(queueData, priority = 5) {
  try {
    const queue = await getEnrichmentQueue();
    
    const job = await queue.add("single-enrichment", queueData, {
      priority,
      delay: 0,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000
      }
    });
    
    return job.id;
  } catch (error) {
    console.error("Error enqueuing single enrichment:", error);
    throw new Error(`Failed to enqueue single enrichment: ${error.message}`);
  }
}

export async function enqueueGitHubAnalysis(queueData) {
  try {
    const queue = await getEnrichmentQueue();
    
    const job = await queue.add("github-analysis", queueData, {
      priority: 8,
      delay: 0,
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 3000
      }
    });
    
    return job.id;
  } catch (error) {
    console.error("Error enqueuing GitHub analysis:", error);
    throw new Error(`Failed to enqueue GitHub analysis: ${error.message}`);
  }
}

export async function enqueueSkillInference(queueData) {
  try {
    const queue = await getEnrichmentQueue();
    
    const job = await queue.add("skill-inference", queueData, {
      priority: 7,
      delay: 0,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000
      }
    });
    
    return job.id;
  } catch (error) {
    console.error("Error enqueuing skill inference:", error);
    throw new Error(`Failed to enqueue skill inference: ${error.message}`);
  }
}

async function processBulkEnrichment(job) {
  try {
    const {
      candidateIds,
      recruiterId,
      batchSize,
      force,
      enrichGithub,
      inferSkills
    } = job.data;

    const results = {
      total: candidateIds.length,
      successful: 0,
      failed: 0,
      errors: [],
      enrichmentIds: []
    };

    const batches = [];
    for (let i = 0; i < candidateIds.length; i += batchSize) {
      batches.push(candidateIds.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (candidateId) => {
        try {
          const enrichmentResult = await enrichCandidate(candidateId, {
            recruiterId,
            force,
            enrichGithub,
            inferSkills
          });

          results.successful++;
          results.enrichmentIds.push(enrichmentResult.candidateId);
          
          return {
            candidateId,
            success: true,
            enrichmentId: enrichmentResult.candidateId
          };
        } catch (error) {
          results.failed++;
          results.errors.push({
            candidateId,
            error: error.message
          });
          
          return {
            candidateId,
            success: false,
            error: error.message
          };
        }
      });

      await Promise.allSettled(batchPromises);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    job.progress(100);
    
    await updateBulkEnrichmentStatus(job.id, 'completed', results);
    
    return results;
  } catch (error) {
    console.error("Error processing bulk enrichment:", error);
    await updateBulkEnrichmentStatus(job.id, 'failed', { error: error.message });
    throw error;
  }
}

async function processSingleEnrichment(job) {
  try {
    const {
      candidateId,
      recruiterId,
      force,
      enrichGithub,
      inferSkills
    } = job.data;

    const result = await enrichCandidate(candidateId, {
      recruiterId,
      force,
      enrichGithub,
      inferSkills
    });

    job.progress(100);
    
    await updateSingleEnrichmentStatus(job.id, 'completed', result);
    
    return result;
  } catch (error) {
    console.error("Error processing single enrichment:", error);
    await updateSingleEnrichmentStatus(job.id, 'failed', { error: error.message });
    throw error;
  }
}

async function processGitHubAnalysis(job) {
  try {
    const { candidateId, githubUrl } = job.data;
    
    const { analyzeGitHubProfile } = await import("./githubAnalysis.service.js");
    const analysisResult = await analyzeGitHubProfile({ socialLinks: [{ platform: 'github', url: githubUrl }] });
    
    job.progress(100);
    
    await updateGitHubAnalysisStatus(job.id, 'completed', analysisResult);
    
    return analysisResult;
  } catch (error) {
    console.error("Error processing GitHub analysis:", error);
    await updateGitHubAnalysisStatus(job.id, 'failed', { error: error.message });
    throw error;
  }
}

async function processSkillInference(job) {
  try {
    const {
      candidateId,
      candidateData,
      githubAnalysis
    } = job.data;
    
    const { inferCandidateSkills } = await import("./skillInference.service.js");
    const inferenceResult = await inferCandidateSkills(candidateData, githubAnalysis);
    
    job.progress(100);
    
    await updateSkillInferenceStatus(job.id, 'completed', inferenceResult);
    
    return inferenceResult;
  } catch (error) {
    console.error("Error processing skill inference:", error);
    await updateSkillInferenceStatus(job.id, 'failed', { error: error.message });
    throw error;
  }
}

async function updateBulkEnrichmentStatus(jobId, status, result) {
  try {
    const queue = await getEnrichmentQueue();
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.progress(100);
      await job.update({
        status,
        result,
        completedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Error updating bulk enrichment status:", error);
  }
}

async function updateSingleEnrichmentStatus(jobId, status, result) {
  try {
    const queue = await getEnrichmentQueue();
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.progress(100);
      await job.update({
        status,
        result,
        completedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Error updating single enrichment status:", error);
  }
}

async function updateGitHubAnalysisStatus(jobId, status, result) {
  try {
    const queue = await getEnrichmentQueue();
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.progress(100);
      await job.update({
        status,
        result,
        completedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Error updating GitHub analysis status:", error);
  }
}

async function updateSkillInferenceStatus(jobId, status, result) {
  try {
    const queue = await getEnrichmentQueue();
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.progress(100);
      await job.update({
        status,
        result,
        completedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Error updating skill inference status:", error);
  }
}

export async function getBulkEnrichmentStatus(jobId) {
  try {
    const queue = await getEnrichmentQueue();
    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    return {
      id: job.id,
      data: job.data,
      progress: job.progress(),
      status: await job.getState(),
      createdAt: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      result: job.returnvalue
    };
  } catch (error) {
    console.error("Error getting bulk enrichment status:", error);
    throw new Error(`Failed to get bulk enrichment status: ${error.message}`);
  }
}

export async function cancelBulkEnrichment(jobId) {
  try {
    const queue = await getEnrichmentQueue();
    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    await job.remove();
    
    return { success: true, message: "Bulk enrichment job cancelled" };
  } catch (error) {
    console.error("Error cancelling bulk enrichment:", error);
    throw new Error(`Failed to cancel bulk enrichment: ${error.message}`);
  }
}

export async function getQueueStats() {
  try {
    const queue = await getEnrichmentQueue();
    
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
    console.error("Error getting queue stats:", error);
    throw new Error(`Failed to get queue stats: ${error.message}`);
  }
}

export async function pauseQueue() {
  try {
    const queue = await getEnrichmentQueue();
    await queue.pause();
    return { success: true, message: "Enrichment queue paused" };
  } catch (error) {
    console.error("Error pausing queue:", error);
    throw new Error(`Failed to pause queue: ${error.message}`);
  }
}

export async function resumeQueue() {
  try {
    const queue = await getEnrichmentQueue();
    await queue.resume();
    return { success: true, message: "Enrichment queue resumed" };
  } catch (error) {
    console.error("Error resuming queue:", error);
    throw new Error(`Failed to resume queue: ${error.message}`);
  }
}

export async function cleanQueue() {
  try {
    const queue = await getEnrichmentQueue();
    
    await queue.clean(24 * 60 * 60 * 1000, "completed");
    await queue.clean(24 * 60 * 60 * 1000, "failed");
    
    return { success: true, message: "Queue cleaned" };
  } catch (error) {
    console.error("Error cleaning queue:", error);
    throw new Error(`Failed to clean queue: ${error.message}`);
  }
}

process.on('SIGTERM', async () => {
  if (enrichmentQueue) {
    console.log('Closing enrichment queue...');
    await enrichmentQueue.close();
  }
});

process.on('SIGINT', async () => {
  if (enrichmentQueue) {
    console.log('Closing enrichment queue...');
    await enrichmentQueue.close();
  }
});
