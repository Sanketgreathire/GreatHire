import { Queue } from "bullmq";
import {
  getRedisConnection,
  isRedisAvailable,
} from "../../sourcing/queues/redisConnection.js";

export const JOB_MATCH_EMAIL_QUEUE = "job-match-email";

let _queue = null;

export async function getJobMatchEmailQueue() {
  if (_queue) return _queue;

  const ok = await isRedisAvailable();
  if (!ok) return null;

  _queue = new Queue(JOB_MATCH_EMAIL_QUEUE, {
    connection: getRedisConnection(),

    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 60 * 60 * 1000, // 1 hour
      },

      removeOnComplete: {
        count: 100,
      },

      removeOnFail: {
        count: 100,
      },
    },
  });

  return _queue;
}

export async function enqueueJobMatchEmail({
  matchId,
  jobId,
  candidateId,
}) {
  const queue = await getJobMatchEmailQueue();

  if (!queue) return null;

  return queue.add(
    "send_job_match_email",
    {
      matchId: matchId.toString(),
      jobId: jobId.toString(),
      candidateId: candidateId.toString(),
    },
    {
      jobId: `job-match-email-${matchId}`,
    }
  );
}