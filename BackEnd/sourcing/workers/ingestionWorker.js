/**
 * ingestionWorker.js
 * Main BullMQ worker — dispatches each job to the correct source worker.
 */
import { Worker }                from "bullmq";
import { getRedisConnection, isRedisAvailable } from "../queues/redisConnection.js";
import { QUEUE_NAME, JOB_TYPES } from "../queues/ingestionQueue.js";
import { processCsvJob }         from "./csvIngestionWorker.js";
import { processGithubJob }      from "./githubIngestionWorker.js";
import { processResumeJob }      from "./resumeIngestionWorker.js";

let worker = null;

// ─── Job dispatcher ───────────────────────────────────────────────────────────
async function dispatch(job) {
  switch (job.name) {
    case JOB_TYPES.CSV:    return processCsvJob(job);
    case JOB_TYPES.GITHUB: return processGithubJob(job);
    case JOB_TYPES.RESUME: return processResumeJob(job);
    default:
      console.warn(`⚠️  Unknown job type: ${job.name}`);
      return null;
  }
}

// ─── Start worker ─────────────────────────────────────────────────────────────
export async function startIngestionWorker() {
  if (worker) return worker;

  const available = await isRedisAvailable();
  if (!available) {
    console.warn("⚠️  Redis unavailable — ingestion worker not started. Jobs run synchronously.");
    return null;
  }

  worker = new Worker(QUEUE_NAME, dispatch, {
    connection:  getRedisConnection(),
    concurrency: 5,
  });

  worker.on("completed", (job) =>
    console.log(`✅ Worker completed [${job.name}] id=${job.id}`)
  );
  worker.on("failed", (job, err) =>
    console.error(`❌ Worker failed [${job?.name}] id=${job?.id}:`, err.message)
  );
  worker.on("error", (err) =>
    console.error("Worker error:", err.message)
  );

  console.log(`✅ Ingestion worker started [concurrency=5] queue=${QUEUE_NAME}`);
  return worker;
}

export async function stopIngestionWorker() {
  if (worker) { await worker.close(); worker = null; }
}
