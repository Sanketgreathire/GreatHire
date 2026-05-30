/**
 * jdMatchingWorker.js
 * BullMQ worker — runs the full JD→candidate matching pipeline.
 */
import { Worker }                from "bullmq";
import { getRedisConnection, isRedisAvailable } from "../../sourcing/queues/redisConnection.js";
import { JD_MATCH_QUEUE }        from "../queues/jdMatchingQueue.js";
import { runMatchingPipeline }   from "../services/matchingPipelineService.js";
import logger                    from "../../utils/logger.js";

let worker = null;

async function processJob(job) {
  const { jobId, recruiterId } = job.data;
  logger.queue(`🔄 Processing match job for jobId=${jobId}`, { jobId, recruiterId, attempt: job.attemptsMade });
  
  try {
    const result = await runMatchingPipeline(jobId, recruiterId);
    logger.queue(`✅ Job ${jobId} completed: matched=${result.matched} skipped=${result.skipped} errors=${result.errors}`, result);
    return result;
  } catch (err) {
    logger.error("jd-matching-worker", `Failed to process job ${jobId}`, err, { jobId, attempt: job.attemptsMade });
    throw err;
  }
}

export async function startJdMatchingWorker() {
  if (worker) return worker;
  const ok = await isRedisAvailable();
  if (!ok) { 
    logger.warn("jd-matching-worker", "Redis unavailable — JD matching worker not started");
    return null; 
  }

  worker = new Worker(JD_MATCH_QUEUE, processJob, {
    connection:  getRedisConnection(),
    concurrency: 2,
  });

  worker.on("completed", (job) => {
    logger.queue(`✅ JD match job ${job.id} completed`, { jobId: job.data.jobId });
  });
  worker.on("failed", (job, err) => {
    logger.error("jd-matching-worker", `Job ${job?.id} failed`, err, { jobId: job?.data?.jobId });
  });
  worker.on("error", (err) => {
    logger.error("jd-matching-worker", "Worker error", err);
  });

  logger.queue(`✅ JD matching worker started [${JD_MATCH_QUEUE}]`);
  return worker;
}

export async function stopJdMatchingWorker() {
  if (worker) { 
    await worker.close();
    worker = null;
    logger.queue("JD matching worker stopped");
  }
}
