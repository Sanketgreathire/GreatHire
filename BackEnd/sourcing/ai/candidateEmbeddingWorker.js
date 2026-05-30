/**
 * candidateEmbeddingWorker.js
 * BullMQ worker — generates embeddings for candidates via Python AI service.
 * Updates embeddingStatus in MongoDB after each job.
 */
import { Worker }                from "bullmq";
import { getRedisConnection, isRedisAvailable } from "../queues/redisConnection.js";
import { EMBEDDING_QUEUE_NAME }  from "./embeddingQueue.js";
import { SourcingCandidate }     from "../../models/sourcing/sourcingCandidate.model.js";
import { indexCandidate, isAiServiceAvailable } from "./aiServiceClient.js";

let worker = null;

async function processEmbeddingJob(job) {
  const { candidateId } = job.data;

  // Mark as PROCESSING
  await SourcingCandidate.findByIdAndUpdate(candidateId, {
    $set: { embeddingStatus: "PROCESSING" },
  });

  try {
    // Fetch candidate with parsedText (normally excluded)
    const candidate = await SourcingCandidate.findById(candidateId)
      .select("+parsedText")
      .lean();

    if (!candidate) {
      console.warn(`[EmbeddingWorker] Candidate ${candidateId} not found — skipping`);
      return;
    }

    // Check AI service is up
    const aiAvailable = await isAiServiceAvailable();
    if (!aiAvailable) {
      throw new Error("AI service unavailable");
    }

    // Send to Python AI service for embedding + Qdrant indexing
    await indexCandidate(candidate);

    // Mark as DONE
    await SourcingCandidate.findByIdAndUpdate(candidateId, {
      $set: { embeddingStatus: "DONE", esIndexed: true, esIndexedAt: new Date() },
    });

    console.log(`✅ [EmbeddingWorker] Embedded candidate ${candidateId}`);
  } catch (err) {
    // Mark as FAILED — will retry via BullMQ backoff
    await SourcingCandidate.findByIdAndUpdate(candidateId, {
      $set: { embeddingStatus: "FAILED", ingestionError: err.message },
    });
    console.error(`❌ [EmbeddingWorker] Failed ${candidateId}:`, err.message);
    throw err; // re-throw so BullMQ retries
  }
}

export async function startEmbeddingWorker() {
  if (worker) return worker;

  const available = await isRedisAvailable();
  if (!available) {
    console.warn("⚠️  Redis unavailable — embedding worker not started.");
    return null;
  }

  worker = new Worker(EMBEDDING_QUEUE_NAME, processEmbeddingJob, {
    connection:  getRedisConnection(),
    concurrency: 3,
    limiter:     { max: 10, duration: 1000 }, // max 10 embeddings/sec
  });

  worker.on("completed", (job) => console.log(`✅ Embedding job ${job.id} done`));
  worker.on("failed",    (job, err) => console.error(`❌ Embedding job ${job?.id} failed:`, err.message));
  worker.on("error",     (err) => console.error("EmbeddingWorker error:", err.message));

  console.log(`✅ Embedding worker started [${EMBEDDING_QUEUE_NAME}]`);
  return worker;
}

export async function stopEmbeddingWorker() {
  if (worker) { await worker.close(); worker = null; }
}
