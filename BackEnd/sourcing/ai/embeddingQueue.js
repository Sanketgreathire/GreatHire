import { Queue } from "bullmq";
import { getRedisConnection, isRedisAvailable } from "../queues/redisConnection.js";

export const EMBEDDING_QUEUE_NAME = "sourcing-embeddings";

let _queue     = null;
let _available = false;

export async function getEmbeddingQueue() {
  if (_queue) return _queue;
  _available = await isRedisAvailable();
  if (!_available) return null;

  _queue = new Queue(EMBEDDING_QUEUE_NAME, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts:         3,
      backoff:          { type: "exponential", delay: 5000 },
      removeOnComplete: { count: 500 },
      removeOnFail:     { count: 100 },
    },
  });
  return _queue;
}

export async function enqueueEmbedding(candidateId, priority = 10) {
  const q = await getEmbeddingQueue();
  if (!q) return null;
  return q.add("embed_candidate", { candidateId }, { priority });
}

export async function enqueueBulkEmbedding(candidateIds) {
  const q = await getEmbeddingQueue();
  if (!q) return null;
  const jobs = candidateIds.map((id) => ({
    name: "embed_candidate",
    data: { candidateId: id },
    opts: { priority: 20 },
  }));
  return q.addBulk(jobs);
}
