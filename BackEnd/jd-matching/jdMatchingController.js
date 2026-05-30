/**
 * jdMatchingController.js
 * POST /api/v1/jd-matching/parse-jd
 * POST /api/v1/jd-matching/match-candidates/:jobId
 * GET  /api/v1/jd-matching/:jobId/matches
 * GET  /api/v1/jd-matching/:jobId/recommendations
 * PATCH /api/v1/jd-matching/feedback/:matchId
 * GET  /api/v1/jd-matching/:jobId/feedback-analytics
 * GET  /api/v1/jd-matching/:jobId/recruiter-insights
 * GET  /api/v1/jd-matching/candidate/:candidateId/history
 */
import { Job }                           from "../models/job.model.js";
import { JDEmbedding }                   from "./models/jdEmbedding.model.js";
import { CandidateJobMatch }             from "./models/candidateJobMatch.model.js";
import { parseJobDescription }           from "./services/jdParserService.js";
import { runMatchingPipeline }           from "./services/matchingPipelineService.js";
import { buildRecommendations, updateMatchFeedback } from "./services/recommendationEngine.js";
import {
  recordFeedback,
  getFeedbackAnalytics,
  getCandidateFeedbackHistory,
  getRecruiterInsights,
  batchUpdateFeedback,
} from "./services/recruiterFeedbackService.js";
import { enqueueJdMatch }                from "./queues/jdMatchingQueue.js";
import { isRedisAvailable }              from "../sourcing/queues/redisConnection.js";
import logger                            from "../utils/logger.js";

// ── POST /api/v1/jd-matching/parse-jd ────────────────────────────────────────
export const parseJd = async (req, res) => {
  try {
    const { jobId, rawText } = req.body;
    if (!rawText?.trim()) {
      return res.status(400).json({ success: false, message: "rawText is required." });
    }

    let jobData = {};
    if (jobId) {
      const job = await Job.findById(jobId).lean();
      if (job) {
        jobData = {
          title:      job.jobDetails?.title,
          skills:     job.jobDetails?.skills || [],
          experience: job.jobDetails?.experience,
          location:   job.jobDetails?.location,
        };
      }
    }

    const parsedData = parseJobDescription(rawText, jobData);

    return res.status(200).json({ success: true, parsedData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/v1/jd-matching/match-candidates/:jobId ─────────────────────────
export const matchCandidates = async (req, res) => {
  try {
    const { jobId }     = req.params;
    const recruiterId   = req.id;

    const job = await Job.findOne({ _id: jobId, created_by: recruiterId }).lean();
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });

    // Try queue first
    const redisOk = await isRedisAvailable();
    if (redisOk) {
      const qJob = await enqueueJdMatch(jobId, recruiterId);
      if (qJob) {
        return res.status(202).json({
          success: true,
          queued:  true,
          message: "Candidate matching queued for background processing.",
          jobId,
          pollUrl: `/api/v1/jd-matching/${jobId}/matches`,
        });
      }
    }

    // Synchronous fallback
    const stats = await runMatchingPipeline(jobId, recruiterId);
    return res.status(200).json({
      success: true,
      queued:  false,
      jobId,
      stats,
    });
  } catch (err) {
    console.error("matchCandidates error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/v1/jd-matching/:jobId/matches ────────────────────────────────────
export const getMatches = async (req, res) => {
  try {
    const { jobId }     = req.params;
    const recruiterId   = req.id;
    const {
      page = 1, limit = 20,
      tier, category, feedbackStatus,
      minScore = 0,
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10));

    const filter = { jobId, recruiterId, matchScore: { $gte: parseInt(minScore) } };
    if (tier)           filter.tier              = tier.toUpperCase();
    if (category)       filter.category          = category.toUpperCase();
    if (feedbackStatus) filter["feedback.status"] = feedbackStatus.toUpperCase();

    const [matches, total] = await Promise.all([
      CandidateJobMatch.find(filter)
        .populate("candidateId", "fullName designation currentCompany location skills totalExperience emails phones githubUrl")
        .sort({ matchScore: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      CandidateJobMatch.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      jobId,
      matches,
      pagination: {
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/v1/jd-matching/:jobId/recommendations ───────────────────────────
export const getRecommendations = async (req, res) => {
  try {
    const { jobId }   = req.params;
    const recruiterId = req.id;
    const recs = await buildRecommendations(jobId, recruiterId);
    return res.status(200).json({ success: true, ...recs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/v1/jd-matching/feedback/:matchId ───────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const { matchId }   = req.params;
    const recruiterId   = req.id;
    const { status, note } = req.body;

    const VALID = ["PENDING","SHORTLISTED","REJECTED","CONTACTED","HIRED","ON_HOLD"];
    if (!VALID.includes(status?.toUpperCase())) {
      return res.status(400).json({ success: false, message: `status must be one of: ${VALID.join(", ")}` });
    }

    const match = await updateMatchFeedback(matchId, recruiterId, status.toUpperCase(), note || "");
    if (!match) return res.status(404).json({ success: false, message: "Match not found." });

    return res.status(200).json({ success: true, match });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/v1/jd-matching/:jobId/parsed-jd ─────────────────────────────────
export const getParsedJd = async (req, res) => {
  try {
    const jdEmb = await JDEmbedding.findOne({ jobId: req.params.jobId, recruiterId: req.id }).lean();
    if (!jdEmb) return res.status(404).json({ success: false, message: "Parsed JD not found. Run match first." });
    return res.status(200).json({ success: true, parsedData: jdEmb.parsedData, stats: { totalMatches: jdEmb.totalMatches, lastMatchRun: jdEmb.lastMatchRun } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/v1/jd-matching/:jobId/feedback-analytics ────────────────────────
export const getFeedbackAnalyticsEndpoint = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.id;

    // Verify job ownership
    const job = await Job.findOne({ _id: jobId, created_by: recruiterId }).lean();
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });

    const analytics = await getFeedbackAnalytics(jobId, recruiterId);
    return res.status(200).json({ success: true, jobId, analytics });
  } catch (err) {
    logger.error("getFeedbackAnalytics", err.message, err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/v1/jd-matching/:jobId/recruiter-insights ──────────────────────
export const getRecruiterInsightsEndpoint = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.id;

    const insights = await getRecruiterInsights(jobId, recruiterId);
    return res.status(200).json({ success: true, ...insights });
  } catch (err) {
    logger.error("getRecruiterInsights", err.message, err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/v1/jd-matching/candidate/:candidateId/history ──────────────────
export const getCandidateFeedbackHistoryEndpoint = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const recruiterId = req.id;

    const history = await getCandidateFeedbackHistory(candidateId, recruiterId);
    return res.status(200).json({ success: true, candidateId, history });
  } catch (err) {
    logger.error("getCandidateFeedbackHistory", err.message, err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/v1/jd-matching/feedback/:matchId ──────────────────────────────
export const submitFeedbackEnhanced = async (req, res) => {
  try {
    const { matchId } = req.params;
    const recruiterId = req.id;
    const { status, note, metadata } = req.body;

    const VALID = ["PENDING", "SHORTLISTED", "REJECTED", "CONTACTED", "HIRED", "ON_HOLD"];
    if (!VALID.includes(status?.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${VALID.join(", ")}`,
      });
    }

    const match = await recordFeedback(matchId, recruiterId, status.toUpperCase(), note || "", metadata || {});

    logger.feedback(`Feedback recorded: match=${matchId} status=${status}`, {
      recruiterId,
      matchId,
      status,
    });

    return res.status(200).json({ success: true, match });
  } catch (err) {
    logger.error("submitFeedback", err.message, err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/v1/jd-matching/feedback/batch ──────────────────────────────────
export const batchSubmitFeedback = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ success: false, message: "updates array required" });
    }

    const recruiterId = req.id;
    const results = await batchUpdateFeedback(updates, recruiterId);

    logger.feedback(`Batch feedback: ${results.length} updates`, { recruiterId });

    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;

    return res.status(200).json({
      success: true,
      updated: successful,
      failed,
      results,
    });
  } catch (err) {
    logger.error("batchSubmitFeedback", err.message, err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
