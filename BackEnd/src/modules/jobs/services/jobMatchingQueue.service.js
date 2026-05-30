import { Queue } from "bullmq";
import { getRedisConnection, isRedisAvailable } from "../../../../sourcing/queues/redisConnection.js";

export const JOB_MATCHING_QUEUE_NAME = "jobs-matching";

let _queue = null;
let _available = false;

export async function getJobMatchingQueue() {
  if (_queue) return _queue;
  _available = await isRedisAvailable();
  if (!_available) return null;

  _queue = new Queue(JOB_MATCHING_QUEUE_NAME, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    },
  });
  return _queue;
}

export async function enqueueJobMatching(jobData, options = {}) {
  const { topK = 20, scoreThreshold = 0.3, priority = 10 } = options;
  
  const q = await getJobMatchingQueue();
  if (!q) return null;

  return q.add("match_candidates", { 
    jobData,
    options: { topK, scoreThreshold }
  }, { 
    priority,
    delay: options.delay || 0,
    removeOnComplete: options.removeOnComplete || 100
  });
}

export async function enqueueBulkJobMatching(jobsData, options = {}) {
  const { topK = 20, scoreThreshold = 0.3, priority = 10 } = options;
  
  const q = await getJobMatchingQueue();
  if (!q) return null;

  const jobs = jobsData.map(jobData => ({
    name: "match_candidates",
    data: { 
      jobData,
      options: { topK, scoreThreshold }
    },
    opts: { priority }
  }));

  return q.addBulk(jobs);
}

export async function getJobMatchingStatus(jobId) {
  const q = await getJobMatchingQueue();
  if (!q) return null;

  const jobs = await q.getJobs(['waiting', 'active', 'completed', 'failed'], 0, -1, true);
  const job = jobs.find(j => j.data.jobData?.jobId === jobId);
  
  if (!job) return null;

  return {
    id: job.id,
    status: await job.getState(),
    progress: job.progress,
    data: job.data,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
    failedReason: job.failedReason,
    attemptsMade: job.attemptsMade,
    opts: job.opts
  };
}

export async function cancelJobMatching(jobId) {
  const q = await getJobMatchingQueue();
  if (!q) return false;

  const jobs = await q.getJobs(['waiting', 'active'], 0, -1, true);
  const job = jobs.find(j => j.data.jobData?.jobId === jobId);
  
  if (!job) return false;

  await job.remove();
  return true;
}

export async function getJobMatchingQueueStats() {
  const q = await getJobMatchingQueue();
  if (!q) return null;

  const waiting = await q.getWaiting();
  const active = await q.getActive();
  const completed = await q.getCompleted();
  const failed = await q.getFailed();
  const delayed = await q.getDelayed();

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
    delayed: delayed.length,
    total: waiting.length + active.length + completed.length + failed.length + delayed.length
  };
}

export async function clearJobMatchingQueue() {
  const q = await getJobMatchingQueue();
  if (!q) return false;

  await q.drain();
  return true;
}

export async function pauseJobMatchingQueue() {
  const q = await getJobMatchingQueue();
  if (!q) return false;

  await q.pause();
  return true;
}

export async function resumeJobMatchingQueue() {
  const q = await getJobMatchingQueue();
  if (!q) return false;

  await q.resume();
  return true;
}
