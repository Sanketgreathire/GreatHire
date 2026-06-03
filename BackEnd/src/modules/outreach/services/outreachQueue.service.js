import Bull from "bull";
import { getRedisConnection } from "../../../config/redis.js";
import { generateOutreach } from "./outreachGeneration.service.js";
import { saveOutreachRecord } from "./outreachHistory.service.js";

const OUTREACH_QUEUE_NAME = "outreach-bulk-generation";

let outreachQueue = null;

export async function getOutreachQueue() {
  if (!outreachQueue) {
    const redisClient = await getRedisClient();
    outreachQueue = new Bull(OUTREACH_QUEUE_NAME, {
      redis: {
        host: redisClient.options.host,
        port: redisClient.options.port,
        password: redisClient.options.password,
        db: redisClient.options.db
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
    
    outreachQueue.process("bulk-outreach", 5, processBulkOutreach);
    outreachQueue.process("scheduled-outreach", 10, processScheduledOutreach);
  }
  
  return outreachQueue;
}

export async function enqueueBulkOutreach(queueData) {
  try {
    const queue = await getOutreachQueue();
    
    const job = await queue.add("bulk-outreach", queueData, {
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
    console.error("Error enqueuing bulk outreach:", error);
    throw new Error(`Failed to enqueue bulk outreach: ${error.message}`);
  }
}

export async function enqueueScheduledOutreach(queueData, scheduledAt) {
  try {
    const queue = await getOutreachQueue();
    
    const delay = new Date(scheduledAt).getTime() - Date.now();
    if (delay <= 0) {
      throw new Error("Scheduled time must be in the future");
    }
    
    const job = await queue.add("scheduled-outreach", queueData, {
      priority: 5,
      delay: delay,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000
      }
    });
    
    return job.id;
  } catch (error) {
    console.error("Error enqueuing scheduled outreach:", error);
    throw new Error(`Failed to enqueue scheduled outreach: ${error.message}`);
  }
}

async function processBulkOutreach(job) {
  try {
    const {
      candidateIds,
      jobId,
      recruiterId,
      outreachType,
      tone,
      customInstructions,
      templateId,
      batchSize
    } = job.data;

    const results = {
      total: candidateIds.length,
      successful: 0,
      failed: 0,
      errors: [],
      outreachIds: []
    };

    const batches = [];
    for (let i = 0; i < candidateIds.length; i += batchSize) {
      batches.push(candidateIds.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (candidateId) => {
        try {
          const outreachResult = await generateOutreach({
            candidateId,
            jobId,
            recruiterId,
            outreachType,
            tone,
            customInstructions,
            templateId
          });

          results.successful++;
          results.outreachIds.push(outreachResult.outreachId);
          
          return {
            candidateId,
            success: true,
            outreachId: outreachResult.outreachId
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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    job.progress(100);
    
    await updateBulkOutreachStatus(job.id, 'completed', results);
    
    return results;
  } catch (error) {
    console.error("Error processing bulk outreach:", error);
    await updateBulkOutreachStatus(job.id, 'failed', { error: error.message });
    throw error;
  }
}

async function processScheduledOutreach(job) {
  try {
    const {
      outreachId,
      candidateId,
      recruiterId,
      subject,
      message,
      outreachType,
      sendMethod
    } = job.data;

    const { sendOutreachMessage } = await import("./outreachGeneration.service.js");
    
    const result = await sendOutreachMessage({
      candidateId,
      outreachId,
      recruiterId,
      subject,
      message,
      outreachType,
      sendMethod
    });

    await updateScheduledOutreachStatus(job.id, 'sent', result);
    
    return result;
  } catch (error) {
    console.error("Error processing scheduled outreach:", error);
    await updateScheduledOutreachStatus(job.id, 'failed', { error: error.message });
    throw error;
  }
}

async function updateBulkOutreachStatus(jobId, status, result) {
  try {
    const queue = await getOutreachQueue();
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
    console.error("Error updating bulk outreach status:", error);
  }
}

async function updateScheduledOutreachStatus(jobId, status, result) {
  try {
    const queue = await getOutreachQueue();
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
    console.error("Error updating scheduled outreach status:", error);
  }
}

export async function getBulkOutreachStatus(jobId) {
  try {
    const queue = await getOutreachQueue();
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
    console.error("Error getting bulk outreach status:", error);
    throw new Error(`Failed to get bulk outreach status: ${error.message}`);
  }
}

export async function cancelBulkOutreach(jobId) {
  try {
    const queue = await getOutreachQueue();
    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new Error("Job not found");
    }
    
    await job.remove();
    
    return { success: true, message: "Bulk outreach job cancelled" };
  } catch (error) {
    console.error("Error cancelling bulk outreach:", error);
    throw new Error(`Failed to cancel bulk outreach: ${error.message}`);
  }
}

export async function getQueueStats() {
  try {
    const queue = await getOutreachQueue();
    
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
    const queue = await getOutreachQueue();
    await queue.pause();
    return { success: true, message: "Outreach queue paused" };
  } catch (error) {
    console.error("Error pausing queue:", error);
    throw new Error(`Failed to pause queue: ${error.message}`);
  }
}

export async function resumeQueue() {
  try {
    const queue = await getOutreachQueue();
    await queue.resume();
    return { success: true, message: "Outreach queue resumed" };
  } catch (error) {
    console.error("Error resuming queue:", error);
    throw new Error(`Failed to resume queue: ${error.message}`);
  }
}

export async function cleanQueue() {
  try {
    const queue = await getOutreachQueue();
    
    await queue.clean(24 * 60 * 60 * 1000, "completed");
    await queue.clean(24 * 60 * 60 * 1000, "failed");
    
    return { success: true, message: "Queue cleaned" };
  } catch (error) {
    console.error("Error cleaning queue:", error);
    throw new Error(`Failed to clean queue: ${error.message}`);
  }
}

process.on('SIGTERM', async () => {
  if (outreachQueue) {
    console.log('Closing outreach queue...');
    await outreachQueue.close();
  }
});

process.on('SIGINT', async () => {
  if (outreachQueue) {
    console.log('Closing outreach queue...');
    await outreachQueue.close();
  }
});
