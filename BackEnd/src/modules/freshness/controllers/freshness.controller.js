import {
  enqueueFreshnessProcessing,
  enqueueBatchFreshnessProcessing,
  enqueueStaleCandidateRefresh,
  enqueueActivityAnalysis,
  enqueueMovementDetection,
  enqueueOpenToWorkAnalysis,
  enqueueRelevanceDecay,
  enqueueProfileReprocessing,
  getFreshnessQueueStats,
  scheduleFreshnessProcessing,
  scheduleStaleRefresh,
  getFreshnessMetrics,
  getWorkerHealth
} from "../workers/freshness.worker.js";
// import { candidateFreshnessService } from "../services/candidateFreshness.service.js";
import { CandidateFreshness } from "../../../models/candidateFreshness.model.js";
// import { SourcingCandidate } from "../../../../models/sourcingCandidate.model.js";

export const runFreshnessProcessing = async (req, res) => {
  try {
    const { type = 'batch', options = {} } = req.body;

    let result;
    switch (type) {
      case 'batch':
        result = await enqueueBatchFreshnessProcessing(options.candidateIds || []);
        break;
      case 'stale-refresh':
        result = await enqueueStaleCandidateRefresh(options.daysThreshold, options.limit);
        break;
      case 'activity-analysis':
        result = await enqueueActivityAnalysis(options.candidateIds || []);
        break;
      case 'movement-detection':
        result = await enqueueMovementDetection(options.candidateIds || []);
        break;
      case 'open-to-work-analysis':
        result = await enqueueOpenToWorkAnalysis(options.candidateIds || []);
        break;
      case 'relevance-decay':
        result = await enqueueRelevanceDecay(options.candidateIds || []);
        break;
      case 'profile-reprocessing':
        result = await enqueueProfileReprocessing(options.candidateIds || []);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid processing type"
        });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: `Freshness ${type} processing started successfully`
    });
  } catch (error) {
    console.error("Error running freshness processing:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run freshness processing",
      error: error.message
    });
  }
};

export const getFreshnessStatus = async (req, res) => {
  try {
    const queueStats = await getFreshnessQueueStats();
    const workerHealth = await getWorkerHealth();
    const metrics = await getFreshnessMetrics();
    
    return res.status(200).json({
      success: true,
      data: {
        queue: queueStats,
        worker: workerHealth,
        metrics,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error getting freshness status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get freshness status",
      error: error.message
    });
  }
};

export const getFreshnessStats = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const stats = await CandidateFreshness.getAggregatedStats(timeRange);
    const queueStats = await getFreshnessQueueStats();
    
    return res.status(200).json({
      success: true,
      data: {
        timeRange,
        candidates: stats,
        queue: queueStats,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error getting freshness stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get freshness stats",
      error: error.message
    });
  }
};

export const getFreshnessHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, timeRange = '30d' } = req.query;
    
    const trends = await CandidateFreshness.getActivityTrends(timeRange);
    
    return res.status(200).json({
      success: true,
      data: {
        timeRange,
        trends,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: trends.length
        }
      }
    });
  } catch (error) {
    console.error("Error getting freshness history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get freshness history",
      error: error.message
    });
  }
};

export const getFreshnessMetricsHandler = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const metrics = await getFreshnessMetrics(timeRange);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error("Error getting freshness metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get freshness metrics",
      error: error.message
    });
  }
};

export const pauseFreshnessProcessing = async (req, res) => {
  try {
    // This would pause the freshness queue
    return res.status(200).json({
      success: true,
      message: "Freshness processing paused"
    });
  } catch (error) {
    console.error("Error pausing freshness processing:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to pause freshness processing",
      error: error.message
    });
  }
};

export const resumeFreshnessProcessing = async (req, res) => {
  try {
    // This would resume the freshness queue
    return res.status(200).json({
      success: true,
      message: "Freshness processing resumed"
    });
  } catch (error) {
    console.error("Error resuming freshness processing:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resume freshness processing",
      error: error.message
    });
  }
};

export const cancelFreshnessJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // This would cancel a specific job
    return res.status(200).json({
      success: true,
      message: `Freshness job ${jobId} cancelled`
    });
  } catch (error) {
    console.error("Error cancelling freshness job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel freshness job",
      error: error.message
    });
  }
};

export const retryFreshnessJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // This would retry a specific job
    return res.status(200).json({
      success: true,
      message: `Freshness job ${jobId} retry started`
    });
  } catch (error) {
    console.error("Error retrying freshness job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retry freshness job",
      error: error.message
    });
  }
};

export const getFreshCandidates = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      minScore = 60, 
      maxScore = 100,
      level,
      limit: limitParam 
    } = req.query;

    let candidates;
    
    if (level) {
      candidates = await CandidateFreshness.getByFreshnessLevel(level, limitParam);
    } else {
      candidates = await CandidateFreshness.getFreshCandidates(minScore, limitParam);
    }

    return res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limitParam || limit),
        total: candidates.length
      }
    });
  } catch (error) {
    console.error("Error getting fresh candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get fresh candidates",
      error: error.message
    });
  }
};

export const getOpenToWorkCandidates = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      minScore = 50, 
      maxScore = 100,
      limit: limitParam 
    } = req.query;

    const candidates = await CandidateFreshness.getOpenToWorkCandidates(minScore, maxScore, limitParam);

    return res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limitParam || limit),
        total: candidates.length
      }
    });
  } catch (error) {
    console.error("Error getting open to work candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get open to work candidates",
      error: error.message
    });
  }
};

export const getStaleCandidates = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      daysThreshold = 90,
      limit: limitParam 
    } = req.query;

    const candidates = await CandidateFreshness.getStaleCandidates(daysThreshold, limitParam);

    return res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limitParam || limit),
        total: candidates.length
      }
    });
  } catch (error) {
    console.error("Error getting stale candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get stale candidates",
      error: error.message
    });
  }
};

export const getMovementCandidates = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      movementType,
      limit: limitParam 
    } = req.query;

    if (!movementType) {
      return res.status(400).json({
        success: false,
        message: "Movement type is required"
      });
    }

    const candidates = await CandidateFreshness.getMovementCandidates(movementType, limitParam);

    return res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limitParam || limit),
        total: candidates.length
      }
    });
  } catch (error) {
    console.error("Error getting movement candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get movement candidates",
      error: error.message
    });
  }
};

export const getFreshnessDistribution = async (req, res) => {
  try {
    const distribution = await CandidateFreshness.getFreshnessDistribution();

    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting freshness distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get freshness distribution",
      error: error.message
    });
  }
};

export const getOpenToWorkDistribution = async (req, res) => {
  try {
    const distribution = await CandidateFreshness.getOpenToWorkDistribution();

    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting open to work distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get open to work distribution",
      error: error.message
    });
  }
};

export const getMovementTrends = async (req, res) => {
  try {
    const { timeRange = '90d' } = req.query;
    
    const trends = await CandidateFreshness.getMovementTrends(timeRange);

    return res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error("Error getting movement trends:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get movement trends",
      error: error.message
    });
  }
};

export const getQualityMetrics = async (req, res) => {
  try {
    const metrics = await CandidateFreshness.getQualityMetrics();

    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error("Error getting quality metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get quality metrics",
      error: error.message
    });
  }
};

export const searchFreshness = async (req, res) => {
  try {
    const criteria = req.body;
    
    const candidates = await CandidateFreshness.searchFreshness(criteria);

    return res.status(200).json({
      success: true,
      data: candidates,
      total: candidates.length
    });
  } catch (error) {
    console.error("Error searching freshness:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search freshness",
      error: error.message
    });
  }
};

export const flagFreshness = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { reason, notes } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required for flagging"
      });
    }
    
    const candidate = await CandidateFreshness.flagCandidate(candidateId, reason, notes);
    
    return res.status(200).json({
      success: true,
      data: candidate,
      message: `Candidate ${candidateId} flagged`
    });
  } catch (error) {
    console.error("Error flagging freshness:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to flag freshness",
      error: error.message
    });
  }
};

export const unflagFreshness = async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const candidate = await CandidateFreshness.unflagCandidate(candidateId);
    
    return res.status(200).json({
      success: true,
      data: candidate,
      message: `Candidate ${candidateId} unflagged`
    });
  } catch (error) {
    console.error("Error unflagging freshness:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unflag freshness",
      error: error.message
    });
  }
};

export const scheduleFreshnessProcessingHandler = async (req, res) => {
  try {
    const { cronExpression, candidateIds, processingType } = req.body;
    
    const result = await scheduleFreshnessProcessing({
      cronExpression,
      candidateIds,
      processingType
    });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Freshness processing scheduled successfully"
    });
  } catch (error) {
    console.error("Error scheduling freshness processing:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule freshness processing",
      error: error.message
    });
  }
};

export const scheduleStaleRefreshHandler = async (req, res) => {
  try {
    const { cronExpression, daysThreshold, limit } = req.body;
    
    const result = await scheduleStaleRefresh({
      cronExpression,
      daysThreshold,
      limit
    });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Stale refresh scheduled successfully"
    });
  } catch (error) {
    console.error("Error scheduling stale refresh:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule stale refresh",
      error: error.message
    });
  }
};
