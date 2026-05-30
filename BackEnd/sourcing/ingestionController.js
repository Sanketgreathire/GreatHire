import fs from "fs";
import { randomBytes } from "crypto";
import { IngestionJob }       from "../models/sourcing/ingestionJob.model.js";
import { parseCsvFile }       from "./parsers/csvParser.js";
import { validateGithubUrl, extractLinkedinUsername } from "./validators/ingestionValidators.js";
import { enqueue, JOB_TYPES, isQueueAvailable } from "./queues/ingestionQueue.js";
import { ingestBatch, ingestCandidate } from "./services/ingestionService.js";
import { parseGithubProfile }  from "./parsers/githubParser.js";
import {
  importLinkedinProfile,
  importBulkLinkedinUrls,
  importBulkJson,
  importManualCandidate,
} from "./services/manualImport.js";

const SYNC_THRESHOLD = 50;

function makeBatchId() {
  return `batch_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

// ─── POST /api/v1/ingestion/import-csv ───────────────────────────────────────
export const importCsv = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No CSV file uploaded." });

  const recruiterId = req.id;
  const filePath    = req.file.path;
  const fileName    = req.file.originalname;
  const batchId     = makeBatchId();

  let rows, parseErrors;
  try {
    ({ rows, parseErrors } = parseCsvFile(filePath));
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  if (!rows.length) return res.status(400).json({ success: false, message: "No valid rows found in CSV.", parseErrors });
  if (rows.length > 10000) return res.status(400).json({ success: false, message: "CSV exceeds 10,000 row limit." });

  const sourceInfo = { sourceType: "CSV_IMPORT", batchId, sourceUrl: fileName };

  await IngestionJob.create({
    batchId, sourceType: "CSV_IMPORT", createdBy: recruiterId,
    status: "QUEUED", totalRows: rows.length, fileName,
  });

  if (rows.length > SYNC_THRESHOLD && isQueueAvailable()) {
    const job = await enqueue(JOB_TYPES.CSV, { batchId, rows, recruiterId, sourceInfo });
    if (job) {
      return res.status(202).json({
        success: true, queued: true, batchId,
        message: `${rows.length} rows queued for background processing.`,
        totalRows: rows.length, parseErrors: parseErrors.slice(0, 10),
        pollUrl: `/api/v1/ingestion/job/${batchId}`,
      });
    }
  }

  await IngestionJob.findOneAndUpdate({ batchId }, { $set: { status: "PROCESSING", startedAt: new Date() } });
  const stats = await ingestBatch(rows, recruiterId, sourceInfo);
  const status = stats.failed === stats.total ? "FAILED" : stats.failed > 0 ? "PARTIAL" : "COMPLETED";

  await IngestionJob.findOneAndUpdate({ batchId }, {
    $set: {
      status, processed: stats.total, created: stats.created,
      duplicates: stats.duplicates, failed: stats.failed,
      errors: stats.errors.slice(0, 50), completedAt: new Date(),
    },
  });

  return res.status(200).json({
    success: true, queued: false, batchId,
    stats: { total: stats.total, created: stats.created, duplicates: stats.duplicates, failed: stats.failed },
    parseErrors: parseErrors.slice(0, 10),
    errors: stats.errors.slice(0, 10),
  });
};

// ─── POST /api/v1/ingestion/import-github ────────────────────────────────────
export const importGithub = async (req, res) => {
  const { githubUrl } = req.body;
  const recruiterId   = req.id;

  const validationError = validateGithubUrl(githubUrl);
  if (validationError) return res.status(400).json({ success: false, message: validationError });

  const batchId    = makeBatchId();
  const sourceInfo = { sourceType: "GITHUB_PROFILE", batchId, sourceUrl: githubUrl };

  await IngestionJob.create({
    batchId, sourceType: "GITHUB_PROFILE", createdBy: recruiterId,
    status: "QUEUED", totalRows: 1, sourceUrl: githubUrl,
  });

  if (isQueueAvailable()) {
    const job = await enqueue(JOB_TYPES.GITHUB, { batchId, githubUrl, recruiterId, sourceInfo });
    if (job) {
      return res.status(202).json({
        success: true, queued: true, batchId,
        message: "GitHub profile queued for import.",
        pollUrl: `/api/v1/ingestion/job/${batchId}`,
      });
    }
  }

  await IngestionJob.findOneAndUpdate({ batchId }, { $set: { status: "PROCESSING", startedAt: new Date() } });

  try {
    const rawCandidate = await parseGithubProfile(githubUrl);
    const result       = await ingestCandidate(rawCandidate, recruiterId, sourceInfo);

    const finalStatus = result.status === "failed" ? "FAILED" : "COMPLETED";
    await IngestionJob.findOneAndUpdate({ batchId }, {
      $set: {
        status: finalStatus, processed: 1,
        created:    result.status === "created"   ? 1 : 0,
        duplicates: result.status === "duplicate" ? 1 : 0,
        failed:     result.status === "failed"    ? 1 : 0,
        completedAt: new Date(),
      },
    });

    if (result.status === "duplicate") return res.status(200).json({ success: true, duplicate: true, batchId, message: "Already imported.", candidate: result.candidate });
    if (result.status === "failed")    return res.status(500).json({ success: false, message: result.error, batchId });

    return res.status(201).json({
      success: true, batchId, message: "GitHub profile imported successfully.",
      candidate: {
        _id: result.candidate._id, fullName: result.candidate.fullName,
        skills: result.candidate.skills, currentCompany: result.candidate.currentCompany,
        location: result.candidate.location, githubUrl: result.candidate.githubUrl,
        sourceType: result.candidate.sourceType,
      },
    });
  } catch (err) {
    await IngestionJob.findOneAndUpdate({ batchId }, { $set: { status: "FAILED", completedAt: new Date(), ingestionError: err.message } });
    const code = err.message.includes("not found") ? 404 : err.message.includes("rate limit") ? 429 : 500;
    return res.status(code).json({ success: false, message: err.message, batchId });
  }
};

// ─── POST /api/v1/ingestion/import-linkedin ──────────────────────────────────
export const importLinkedin = async (req, res) => {
  const { linkedinUrl } = req.body;
  const recruiterId     = req.id;

  if (!linkedinUrl?.trim()) return res.status(400).json({ success: false, message: "linkedinUrl is required." });
  if (!extractLinkedinUsername(linkedinUrl)) return res.status(400).json({ success: false, message: "Invalid LinkedIn URL. Expected: https://linkedin.com/in/username" });

  try {
    const result = await importLinkedinProfile(linkedinUrl.trim(), recruiterId);

    if (result.status === "duplicate") return res.status(200).json({ success: true, duplicate: true, message: "Already imported.", candidate: result.candidate });
    if (result.status === "failed")    return res.status(500).json({ success: false, message: result.error });

    return res.status(201).json({
      success: true, message: "LinkedIn profile imported.",
      candidate: {
        _id: result.candidate._id, fullName: result.candidate.fullName,
        designation: result.candidate.designation, skills: result.candidate.skills,
        location: result.candidate.location, linkedinUrl: result.candidate.linkedinUrl,
        sourceType: result.candidate.sourceType,
      },
    });
  } catch (err) {
    const code = err.message.includes("not found") ? 404 : err.message.includes("rate limit") ? 429 : 500;
    return res.status(code).json({ success: false, message: err.message });
  }
};

// ─── POST /api/v1/ingestion/import-linkedin-bulk ─────────────────────────────
export const importLinkedinBulk = async (req, res) => {
  const { urls } = req.body;
  const recruiterId = req.id;

  if (!Array.isArray(urls) || !urls.length) return res.status(400).json({ success: false, message: "urls array is required." });
  if (urls.length > 100) return res.status(400).json({ success: false, message: "Max 100 LinkedIn URLs per request." });

  const validUrls = urls.filter((u) => extractLinkedinUsername(u));
  if (!validUrls.length) return res.status(400).json({ success: false, message: "No valid LinkedIn URLs found." });

  try {
    const stats = await importBulkLinkedinUrls(validUrls, recruiterId);
    return res.status(200).json({ success: true, stats, invalidUrls: urls.length - validUrls.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/v1/ingestion/import-manual ────────────────────────────────────
export const importManual = async (req, res) => {
  const recruiterId = req.id;
  const { fullName, emails, phones, skills, designation, currentCompany, location, totalExperience, linkedinUrl, githubUrl, summary } = req.body;

  if (!fullName?.trim()) return res.status(400).json({ success: false, message: "fullName is required." });

  const raw = {
    fullName: fullName.trim(),
    emails:   Array.isArray(emails) ? emails : (emails ? [emails] : []),
    phones:   Array.isArray(phones) ? phones : (phones ? [phones] : []),
    skills:   Array.isArray(skills) ? skills : (skills ? skills.split(",").map((s) => s.trim()) : []),
    designation:     designation     || "",
    currentCompany:  currentCompany  || "",
    location:        location        || "",
    totalExperience: parseFloat(totalExperience) || 0,
    linkedinUrl:     linkedinUrl     || "",
    githubUrl:       githubUrl       || "",
    summary:         summary         || "",
    education:       [],
  };

  try {
    const result = await importManualCandidate(raw, recruiterId);
    if (result.status === "duplicate") return res.status(200).json({ success: true, duplicate: true, message: "Candidate already exists.", candidate: result.candidate });
    if (result.status === "failed")    return res.status(500).json({ success: false, message: result.error });

    return res.status(201).json({ success: true, message: "Candidate added.", candidate: result.candidate });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/v1/ingestion/import-json ──────────────────────────────────────
// Accepts JSON array from any portal (Naukri, Indeed, Monster, etc.)
export const importJson = async (req, res) => {
  const recruiterId = req.id;
  const { candidates, source = "API_IMPORT" } = req.body;

  if (!Array.isArray(candidates) || !candidates.length) return res.status(400).json({ success: false, message: "candidates array is required." });
  if (candidates.length > 5000) return res.status(400).json({ success: false, message: "Max 5,000 candidates per request." });

  const VALID_SOURCES = ["API_IMPORT", "CSV_IMPORT", "MANUAL", "PUBLIC_PROFILE"];
  const sourceType = VALID_SOURCES.includes(source.toUpperCase()) ? source.toUpperCase() : "API_IMPORT";

  try {
    const stats = await importBulkJson(candidates, recruiterId, sourceType);
    return res.status(200).json({
      success: true,
      stats: { total: stats.total, created: stats.created, duplicates: stats.duplicates, failed: stats.failed },
      errors: stats.errors.slice(0, 20),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/v1/ingestion/job/:jobId ────────────────────────────────────────
export const getJobStatus = async (req, res) => {
  try {
    const job = await IngestionJob.findOne({ batchId: req.params.jobId, createdBy: req.id }).lean();
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/v1/ingestion/jobs ──────────────────────────────────────────────
export const listJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10));
    const filter   = { createdBy: req.id };
    if (status) filter.status = status.toUpperCase();

    const [jobs, total] = await Promise.all([
      IngestionJob.find(filter).select("-errors").sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      IngestionJob.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true, jobs,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/v1/ingestion/stats ─────────────────────────────────────────────
export const getIngestionStats = async (req, res) => {
  try {
    const { SourcingCandidate } = await import("../models/sourcing/sourcingCandidate.model.js");
    const recruiterId = req.id;

    const [total, bySource, embeddingStats] = await Promise.all([
      SourcingCandidate.countDocuments({ createdBy: recruiterId }),
      SourcingCandidate.aggregate([
        { $match: { createdBy: recruiterId } },
        { $group: { _id: "$sourceType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      SourcingCandidate.aggregate([
        { $match: { createdBy: recruiterId } },
        { $group: { _id: "$embeddingStatus", count: { $sum: 1 } } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        total,
        bySource: bySource.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
        embedding: embeddingStats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
