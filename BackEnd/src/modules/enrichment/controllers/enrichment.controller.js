import { enrichCandidate } from "../services/candidateEnrichment.service.js";
import { bulkEnrichCandidates } from "../services/candidateEnrichment.service.js";
import { getCandidateIntelligence } from "../services/candidateEnrichment.service.js";
import { getEnrichmentStatus } from "../services/candidateEnrichment.service.js";
import { getEnrichmentStatistics } from "../services/candidateEnrichment.service.js";
import { triggerFullEnrichment } from "../services/candidateEnrichment.service.js";
import { trackRecruiterInteraction } from "../../copilot/services/interactionTracking.service.js";

export const enrichCandidateController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { id } = req.params;
    const { force = false, enrichGithub = true, inferSkills = true } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    const result = await enrichCandidate(id, {
      recruiterId,
      force,
      enrichGithub,
      inferSkills
    });

    await trackRecruiterInteraction(recruiterId, id, 'enriched', {
      source: 'enrichment',
      metadata: {
        enrichedAt: new Date(),
        force,
        enrichGithub,
        inferSkills
      }
    });

    return res.status(200).json({
      success: true,
      message: "Candidate enrichment completed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in enrichCandidateController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to enrich candidate",
      error: error.message
    });
  }
};

export const bulkEnrichCandidatesController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { candidateIds, batchSize = 5, force = false, enrichGithub = true, inferSkills = true } = req.body;

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Candidate IDs array is required"
      });
    }

    const result = await bulkEnrichCandidates(candidateIds, {
      recruiterId,
      batchSize: parseInt(batchSize),
      force,
      enrichGithub,
      inferSkills
    });

    candidateIds.forEach(candidateId => {
      trackRecruiterInteraction(recruiterId, candidateId, 'enriched', {
        source: 'enrichment',
        metadata: {
          bulkEnriched: true,
          enrichedAt: new Date(),
          force,
          enrichGithub,
          inferSkills
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: "Bulk candidate enrichment initiated",
      data: result
    });
  } catch (error) {
    console.error("Error in bulkEnrichCandidatesController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate bulk candidate enrichment",
      error: error.message
    });
  }
};

export const getCandidateIntelligenceController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { id } = req.params;
    const { includeRaw = false, includeHistory = false } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    const result = await getCandidateIntelligence(id, {
      recruiterId,
      includeRaw: includeRaw === 'true',
      includeHistory: includeHistory === 'true'
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in getCandidateIntelligenceController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get candidate intelligence",
      error: error.message
    });
  }
};

export const getEnrichmentStatusController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required"
      });
    }

    const status = await getEnrichmentStatus(jobId, recruiterId);

    return res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error("Error in getEnrichmentStatusController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get enrichment status",
      error: error.message
    });
  }
};

export const getEnrichmentStatsController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { timeRange = '30d' } = req.query;

    const stats = await getEnrichmentStatistics(recruiterId, timeRange);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error in getEnrichmentStatsController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get enrichment statistics",
      error: error.message
    });
  }
};

export const triggerFullEnrichmentController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { candidateIds, filters = {}, batchSize = 10 } = req.body;

    const result = await triggerFullEnrichment({
      recruiterId,
      candidateIds,
      filters,
      batchSize: parseInt(batchSize)
    });

    return res.status(200).json({
      success: true,
      message: "Full enrichment pipeline triggered",
      data: result
    });
  } catch (error) {
    console.error("Error in triggerFullEnrichmentController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to trigger full enrichment",
      error: error.message
    });
  }
};
