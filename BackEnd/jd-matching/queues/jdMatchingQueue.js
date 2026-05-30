import { Queue } from "bullmq";
import { getRedisConnection, isRedisAvailable } from "../../sourcing/queues/redisConnection.js";

export const JD_MATCH_QUEUE = "jd-matching";

let _queue = null;

export async function getJdMatchQueue() {
  if (_queue) return _queue;
  const ok = await isRedisAvailable();
  if (!ok) return null;
  _queue = new Queue(JD_MATCH_QUEUE, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts:         2,
      backoff:          { type: "exponential", delay: 5000 },
      removeOnComplete: { count: 100 },
      removeOnFail:     { count: 50 },
    },
  });
  return _queue;
}

export async function enqueueJdMatch(jobId, recruiterId, opts = {}) {
  const q = await getJdMatchQueue();
  if (!q) return null;
  return q.add("match_candidates", { jobId: jobId.toString(), recruiterId: recruiterId.toString() }, opts);
}
