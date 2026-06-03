/**
 * githubIngestionWorker.js
 * Processes GITHUB_PROFILE jobs: fetch profile → parse → normalize → deduplicate → save → ES sync
 */
import { IngestionJob }      from "../../models/sourcing/ingestionJob.model.js";
import { parseGithubProfile } from "../parsers/githubParser.js";
import { ingestCandidate }    from "../services/ingestionService.js";

/**
 * Process a single GitHub profile ingestion job.
 *
 * job.data = {
 *   batchId:     string,
 *   githubUrl:   string,
 *   recruiterId: string,
 *   sourceInfo:  { sourceType, batchId, sourceUrl }
 * }
 */
export async function processGithubJob(job) {
  const { batchId, githubUrl, recruiterId, sourceInfo } = job.data;

  console.log(`🐙 [GitHub Worker] batchId=${batchId} url=${githubUrl}`);

  await IngestionJob.findOneAndUpdate(
    { batchId },
    { $set: { status: "PROCESSING", startedAt: new Date() } }
  );

  try {
    // 1. Fetch + parse GitHub profile
    const rawCandidate = await parseGithubProfile(githubUrl);

    // 2. Run through ingestion pipeline
    const result = await ingestCandidate(rawCandidate, recruiterId, {
      ...sourceInfo,
      sourceType: "GITHUB_PROFILE",
      sourceUrl:  githubUrl,
    });

    const status = result.status === "created"   ? "COMPLETED"
      : result.status === "duplicate" ? "COMPLETED"
      : "FAILED";

    await IngestionJob.findOneAndUpdate({ batchId }, {
      $set: {
        status,
        processed:   1,
        created:     result.status === "created"   ? 1 : 0,
        duplicates:  result.status === "duplicate" ? 1 : 0,
        failed:      result.status === "failed"    ? 1 : 0,
        errors:      result.status === "failed" ? [{ row: 1, message: result.error }] : [],
        completedAt: new Date(),
      },
    });

    console.log(`✅ [GitHub Worker] done batchId=${batchId} status=${result.status}`);
    return result;
  } catch (err) {
    await IngestionJob.findOneAndUpdate({ batchId }, {
      $set: { status: "FAILED", completedAt: new Date(), ingestionError: err.message },
    });
    throw err;
  }
}
