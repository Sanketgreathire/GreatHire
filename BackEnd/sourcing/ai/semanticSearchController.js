/**
 * semanticSearchController.js
 * GET  /api/v1/sourcing/semantic-search
 * POST /api/v1/sourcing/semantic-search
 * GET  /api/v1/sourcing/ai-health
 */
import { hybridSearch }          from "./hybridRankingService.js";
import { checkAiHealth }         from "./aiServiceClient.js";
import { enqueueEmbedding }      from "./embeddingQueue.js";
import { SourcingCandidate }     from "../../models/sourcing/sourcingCandidate.model.js";

// GET /api/v1/sourcing/semantic-search?q=fintech+backend&topK=10
export const semanticSearchHandler = async (req, res) => {
  try {
    const recruiterId = req.id;
    const {
      q, query,
      topK           = 20,
      scoreThreshold = 0.25,
      location, designation, minExp, maxExp, skills, sourceType,
    } = req.query;

    const searchQuery = (q || query || "").trim();
    if (!searchQuery) {
      return res.status(400).json({ success: false, message: "Query parameter 'q' is required." });
    }

    const filters = {};
    if (location)    filters.location    = location;
    if (designation) filters.designation = designation;
    if (minExp)      filters.minExp      = minExp;
    if (maxExp)      filters.maxExp      = maxExp;
    if (sourceType)  filters.sourceType  = sourceType;
    if (skills) {
      filters.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const result = await hybridSearch(searchQuery, recruiterId, {
      topK:           Math.min(100, parseInt(topK, 10) || 20),
      scoreThreshold: parseFloat(scoreThreshold) || 0.25,
      filters,
    });

    return res.status(200).json({
      success: true,
      query:   searchQuery,
      mode:    result.mode,
      total:   result.total,
      timings: result.timings,
      results: result.results,
    });
  } catch (err) {
    console.error("semanticSearch error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/sourcing/ai-health
export const aiHealthHandler = async (req, res) => {
  const health = await checkAiHealth();
  const status = health.status === "ok" ? 200 : 503;
  return res.status(status).json({ success: health.status === "ok", ...health });
};

// POST /api/v1/sourcing/reindex/:id — manually trigger re-embedding
export const reindexCandidate = async (req, res) => {
  try {
    const candidate = await SourcingCandidate.findOne({
      _id: req.params.id, createdBy: req.id,
    });
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found." });
    }

    await SourcingCandidate.findByIdAndUpdate(req.params.id, {
      $set: { embeddingStatus: "PENDING" },
    });

    const job = await enqueueEmbedding(req.params.id, 1); // priority 1 = high
    return res.status(202).json({
      success: true,
      message: "Candidate queued for re-indexing.",
      queued:  !!job,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/v1/sourcing/reindex-pending — reindex all PENDING/FAILED candidates
export const reindexPending = async (req, res) => {
  try {
    const candidates = await SourcingCandidate.find({
      createdBy:       req.id,
      embeddingStatus: { $in: ["PENDING", "FAILED"] },
    }).select("_id").limit(500).lean();

    if (!candidates.length) {
      return res.status(200).json({ success: true, message: "No pending candidates.", queued: 0 });
    }

    const ids = candidates.map((c) => c._id.toString());
    const { enqueueBulkEmbedding } = await import("./embeddingQueue.js");
    await enqueueBulkEmbedding(ids);

    return res.status(202).json({
      success: true,
      message: `${ids.length} candidates queued for embedding.`,
      queued:  ids.length,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
