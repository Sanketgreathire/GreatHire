/**
 * csvIngestionWorker.js
 * Processes CSV_IMPORT jobs: parse rows → normalize → deduplicate → save → ES sync
 */
import { IngestionJob } from "../../models/sourcing/ingestionJob.model.js";
import { ingestBatch }  from "../services/ingestionService.js";

/**
 * Process a single CSV ingestion job.
 * Called by the main worker dispatcher.
 *
 * job.data = {
 *   batchId:    string,
 *   rows:       Object[],   // already parsed CSV rows
 *   recruiterId: string,
 *   sourceInfo: { sourceType, batchId, sourceUrl }
 * }
 */
export async function processCsvJob(job) {
  const { batchId, rows, recruiterId, sourceInfo } = job.data;

  console.log(`📄 [CSV Worker] batchId=${batchId} rows=${rows?.length}`);

  await IngestionJob.findOneAndUpdate(
    { batchId },
    { $set: { status: "PROCESSING", startedAt: new Date() } }
  );

  try {
    const stats = await ingestBatch(rows || [], recruiterId, {
      ...sourceInfo,
      sourceType: "CSV_IMPORT",
    });

    const status = stats.failed === stats.total ? "FAILED"
      : stats.failed > 0 ? "PARTIAL"
      : "COMPLETED";

    await IngestionJob.findOneAndUpdate({ batchId }, {
      $set: {
        status,
        processed:   stats.total,
        created:     stats.created,
        duplicates:  stats.duplicates,
        failed:      stats.failed,
        errors:      stats.errors.slice(0, 50),
        completedAt: new Date(),
      },
    });

    console.log(`✅ [CSV Worker] done batchId=${batchId} created=${stats.created} dupes=${stats.duplicates} failed=${stats.failed}`);
    return stats;
  } catch (err) {
    await IngestionJob.findOneAndUpdate({ batchId }, {
      $set: { status: "FAILED", completedAt: new Date(), ingestionError: err.message },
    });
    throw err;
  }
}
