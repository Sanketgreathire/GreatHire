/**
 * resumeIngestionWorker.js
 * Processes RESUME_UPLOAD jobs: extract text → parse fields → normalize → deduplicate → save → ES sync
 */
import fs from "fs";
import { IngestionJob }    from "../../models/sourcing/ingestionJob.model.js";
import { ingestCandidate } from "../services/ingestionService.js";

// Lazy import to avoid loading pdf-parse/mammoth at startup
async function getResumeParser() {
  const { extractResumeText, parseResumeFields } = await import(
    "../../controllers/sourcing/resumeParser.service.js"
  );
  return { extractResumeText, parseResumeFields };
}

/**
 * Process a single resume ingestion job.
 *
 * job.data = {
 *   batchId:      string,
 *   filePath:     string,   // absolute path to uploaded file
 *   fileName:     string,
 *   resumeUrl:    string,   // relative URL e.g. /resumes/file.pdf
 *   recruiterId:  string,
 *   fullNameHint: string,   // optional override from form
 *   sourceInfo:   { sourceType, batchId, sourceUrl }
 * }
 */
export async function processResumeJob(job) {
  const { batchId, filePath, fileName, resumeUrl, recruiterId, fullNameHint, sourceInfo } = job.data;

  console.log(`📄 [Resume Worker] batchId=${batchId} file=${fileName}`);

  await IngestionJob.findOneAndUpdate(
    { batchId },
    { $set: { status: "PROCESSING", startedAt: new Date() } }
  );

  try {
    const { extractResumeText, parseResumeFields } = await getResumeParser();

    // 1. Extract text
    const parsedText = await extractResumeText(filePath);

    // 2. Parse structured fields
    const parsed = parseResumeFields(parsedText);

    // 3. Determine fullName
    const fullName =
      fullNameHint?.trim() ||
      parsedText.split(/\r?\n/).find((l) => l.trim().length > 2 && l.trim().length < 60)?.trim() ||
      "Unknown";

    const rawCandidate = {
      fullName,
      ...parsed,
      resumeUrl,
      resumeOriginalName: fileName,
      parsedText,
    };

    // 4. Run ingestion pipeline
    const result = await ingestCandidate(rawCandidate, recruiterId, {
      ...sourceInfo,
      sourceType: "RESUME_UPLOAD",
    });

    const status = result.status === "failed" ? "FAILED" : "COMPLETED";

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

    console.log(`✅ [Resume Worker] done batchId=${batchId} status=${result.status}`);
    return result;
  } catch (err) {
    // Clean up file on failure
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch {}
    }
    await IngestionJob.findOneAndUpdate({ batchId }, {
      $set: { status: "FAILED", completedAt: new Date(), ingestionError: err.message },
    });
    throw err;
  }
}
