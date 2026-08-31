import { Queue } from "bullmq";
import {
  getRedisConnection,
  isRedisAvailable,
} from "../../sourcing/queues/redisConnection.js";

export const JOB_MATCH_NOTIFICATION_QUEUE = "job-match-notifications";

let _queue = null;

export async function getJobMatchNotificationQueue() {
  if (_queue) return _queue;

  const ok = await isRedisAvailable();
  if (!ok) return null;

  _queue = new Queue(JOB_MATCH_NOTIFICATION_QUEUE, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 100 },
    },
  });

  return _queue;
}

export async function enqueueJobMatchNotification(
  matchId,
  opts = {}
) {
  const q = await getJobMatchNotificationQueue();

  if (!q) return null;

  return q.add(
    "send_job_match_notification",
    {
      matchId: matchId.toString(),
    },
    opts
  );
}