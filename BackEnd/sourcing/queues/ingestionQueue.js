import { Queue } from "bullmq";
import { getRedisConnection, isRedisAvailable } from "./redisConnection.js";

export const QUEUE_NAME = "sourcing-ingestion";

// Job type constants — used by workers to route processing
export const JOB_TYPES = {
  RESUME:  "RESUME_UPLOAD",
  CSV:     "CSV_IMPORT",
  GITHUB:  "GITHUB_PROFILE",
  API:     "API_IMPORT",
  MANUAL:  "MANUAL",
};

let _queue    = null;
let _available = false;

export async function getIngestionQueue() {
  if (_queue) return _queue;

  _available = await isRedisAvailable();
  if (!_available) {
    console.warn("⚠️  Redis unavailable — queue disabled, jobs run synchronously.");
    return null;
  }

  _queue = new Queue(QUEUE_NAME, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts:         3,
      backoff:          { type: "exponential", delay: 3000 },
      removeOnComplete: { count: 200 },
      removeOnFail:     { count: 100 },
    },
  });

  console.log(`✅ Ingestion queue ready [${QUEUE_NAME}]`);
  return _queue;
}

export function isQueueAvailable() { return _available; }

/**
 * Enqueue a job. Returns the BullMQ Job or null if queue unavailable.
 */
export async function enqueue(jobType, payload, opts = {}) {
  const q = await getIngestionQueue();
  if (!q) return null;
  return q.add(jobType, payload, opts);
}
