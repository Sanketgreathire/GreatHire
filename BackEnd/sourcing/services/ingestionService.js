/**
 * ingestionService.js
 * Core pipeline: Normalize → Deduplicate → Save → Enqueue Embedding → ES Index
 */
import { SourcingCandidate }  from "../../models/sourcing/sourcingCandidate.model.js";
import { normalizeCandidate } from "./normalizationService.js";
import { findDuplicate, buildDedupHash, mergeSourceHistory } from "./deduplicationService.js";
import { indexCandidate as esIndex } from "./elasticsearchSyncService.js";

// Lazy import to avoid circular deps
async function tryEnqueueEmbedding(candidateId) {
  try {
    const { enqueueEmbedding } = await import("../ai/embeddingQueue.js");
    await enqueueEmbedding(candidateId);
  } catch {
    // Queue unavailable — embedding will be triggered manually or on next run
  }
}

export async function ingestCandidate(rawCandidate, recruiterId, sourceInfo = {}) {
  try {
    // 1. Normalize
    const normalized = normalizeCandidate(rawCandidate);
    if (!normalized.fullName) return { status: "failed", error: "fullName is required" };

    // 2. Deduplicate
    const { isDuplicate, existing } = await findDuplicate(normalized, recruiterId);
    if (isDuplicate) {
      await mergeSourceHistory(existing._id, {
        sourceType: sourceInfo.sourceType || "MANUAL",
        sourceUrl:  sourceInfo.sourceUrl  || "",
        importedBy: recruiterId,
        importedAt: new Date(),
        batchId:    sourceInfo.batchId    || "",
      });
      return { status: "duplicate", candidate: existing };
    }

    // 3. Build dedup hash
    const dedupHash = buildDedupHash(normalized);

    // 4. Save to MongoDB
    const candidate = await SourcingCandidate.create({
      ...normalized,
      dedupHash,
      sourceType:      sourceInfo.sourceType || "MANUAL",
      sourceUrl:       sourceInfo.sourceUrl  || "",
      importedAt:      new Date(),
      batchId:         sourceInfo.batchId    || "",
      createdBy:       recruiterId,
      ingestionStatus: "COMPLETED",
      embeddingStatus: "PENDING",
      sourceHistory: [{
        sourceType: sourceInfo.sourceType || "MANUAL",
        sourceUrl:  sourceInfo.sourceUrl  || "",
        importedBy: recruiterId,
        importedAt: new Date(),
        batchId:    sourceInfo.batchId    || "",
      }],
    });

    // 5. Enqueue embedding (non-blocking)
    tryEnqueueEmbedding(candidate._id.toString());

    // 6. ES index (non-blocking)
    esIndex(candidate).catch(() => {});

    return { status: "created", candidate };
  } catch (error) {
    console.error("ingestCandidate error:", error.message);
    return { status: "failed", error: error.message };
  }
}

export async function ingestBatch(rawCandidates, recruiterId, sourceInfo = {}) {
  const stats = { total: rawCandidates.length, created: 0, duplicates: 0, failed: 0, errors: [] };

  for (let i = 0; i < rawCandidates.length; i++) {
    const result = await ingestCandidate(rawCandidates[i], recruiterId, sourceInfo);
    if      (result.status === "created")   stats.created++;
    else if (result.status === "duplicate") stats.duplicates++;
    else {
      stats.failed++;
      stats.errors.push({ row: i + 1, message: result.error, data: rawCandidates[i] });
    }
  }

  return stats;
}
