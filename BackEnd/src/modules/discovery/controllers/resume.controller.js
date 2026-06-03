import {
  enqueueBulkResumeDiscovery,
  enqueueSingleResumeDiscovery,
  enqueueBatchResumeDiscovery,
  getResumeDiscoveryQueueStats,
  retryFailedResumeDiscovery,
  cancelResumeDiscovery,
  pauseResumeDiscoveryQueue,
  resumeResumeDiscoveryQueue,
  getResumeDiscoveryMetrics
} from "../workers/resumeDiscovery.worker.js";
import { resumeDiscovery } from "../connectors/resume/resumeDiscovery.service.js";
import { ResumeCandidateMetadata } from "../../../models/resumeCandidateMetadata.model.js";
// import { SourcingCandidate } from "../../../models/sourcingCandidate.model.js";
import { updateIngestionHistoryService } from "../services/discoveryStats.service.js";

export const runResumeDiscovery = async (req, res) => {
  try {
    const { type = 'bulk', options = {} } = req.body;

    let result;
    switch (type) {
      case 'bulk':
        result = await enqueueBulkResumeDiscovery(options);
        break;
      case 'single':
        if (!options.url) {
          return res.status(400).json({
            success: false,
            message: "URL is required for single discovery"
          });
        }
        result = await enqueueSingleResumeDiscovery(options.url, options);
        break;
      case 'batch':
        if (!options.urls || !Array.isArray(options.urls)) {
          return res.status(400).json({
            success: false,
            message: "URLs array is required for batch discovery"
          });
        }
        result = await enqueueBatchResumeDiscovery(options.urls, options);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid discovery type. Must be 'bulk', 'single', or 'batch'"
        });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: `Resume ${type} discovery started successfully`
    });
  } catch (error) {
    console.error("Error running resume discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run resume discovery",
      error: error.message
    });
  }
};

export const testResumeConnector = async (req, res) => {
  try {
    const testUrl = req.body.url || 'https://example.com/resume.pdf';
    const result = await resumeDiscovery.downloadResume(testUrl);
    
    return res.status(200).json({
      success: true,
      data: {
        url: testUrl,
        success: !!result,
        result: result ? {
          documentType: result.documentType,
          size: result.size,
          fileName: result.fileName
        } : null
      },
      message: "Resume connector test completed"
    });
  } catch (error) {
    console.error("Error testing resume connector:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to test resume connector",
      error: error.message
    });
  }
};

export const getResumeDiscoveryStatus = async (req, res) => {
  try {
    const queueStats = await getResumeDiscoveryQueueStats();
    const metrics = await getResumeDiscoveryMetrics();
    
    return res.status(200).json({
      success: true,
      data: {
        queue: queueStats,
        metrics,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error getting resume discovery status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume discovery status",
      error: error.message
    });
  }
};

export const getResumeDiscoveryStats = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const stats = await ResumeCandidateMetadata.getAggregatedStats(timeRange);
    const queueStats = await getResumeDiscoveryQueueStats();
    
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
    console.error("Error getting resume discovery stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume discovery stats",
      error: error.message
    });
  }
};

export const getResumeDiscoveryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, timeRange = '30d' } = req.query;
    
    const history = await updateIngestionHistoryService({
      page: parseInt(page),
      limit: parseInt(limit),
      connectorName: 'resume-discovery',
      status,
      timeRange
    });
    
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error("Error getting resume discovery history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume discovery history",
      error: error.message
    });
  }
};

export const getResumeDiscoveryMetricsHandler = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const metrics = await getResumeDiscoveryMetrics(timeRange);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error("Error getting resume discovery metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume discovery metrics",
      error: error.message
    });
  }
};

export const pauseResumeDiscovery = async (req, res) => {
  try {
    await pauseResumeDiscoveryQueue();
    
    return res.status(200).json({
      success: true,
      message: "Resume discovery queue paused"
    });
  } catch (error) {
    console.error("Error pausing resume discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to pause resume discovery",
      error: error.message
    });
  }
};

export const resumeResumeDiscovery = async (req, res) => {
  try {
    await resumeResumeDiscoveryQueue();
    
    return res.status(200).json({
      success: true,
      message: "Resume discovery queue resumed"
    });
  } catch (error) {
    console.error("Error resuming resume discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resume resume discovery",
      error: error.message
    });
  }
};

export const cancelResumeDiscoveryHandler = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const result = await cancelResumeDiscovery(jobId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Resume discovery job ${jobId} cancelled`
    });
  } catch (error) {
    console.error("Error cancelling resume discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel resume discovery",
      error: error.message
    });
  }
};

export const retryResumeDiscovery = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const result = await retryFailedResumeDiscovery(jobId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Resume discovery job ${jobId} retry started`
    });
  } catch (error) {
    console.error("Error retrying resume discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retry resume discovery",
      error: error.message
    });
  }
};

export const getResumeCandidates = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      minConfidence, 
      documentType, 
      location,
      active,
      flagged 
    } = req.query;

    let candidates;
    
    if (minConfidence) {
      candidates = await ResumeCandidateMetadata.getHighConfidenceResumes(
        parseInt(minConfidence), 
        parseInt(limit)
      );
    } else if (active === 'true') {
      candidates = await ResumeCandidateMetadata.getRecentlyProcessed(
        7, // 7 days
        parseInt(limit)
      );
    } else if (documentType) {
      candidates = await ResumeCandidateMetadata.getByDocumentType(
        documentType,
        parseInt(limit)
      );
    } else if (flagged === 'true') {
      candidates = await ResumeCandidateMetadata.getFlaggedResumes(
        null,
        parseInt(limit)
      );
    } else {
      // Default: get all candidates with pagination
      candidates = await ResumeCandidateMetadata.find({ flagged: false })
        .sort({ parsingConfidence: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('candidateId', 'name email resumeUrl location skills');
    }

    return res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: candidates.length
      }
    });
  } catch (error) {
    console.error("Error getting resume candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume candidates",
      error: error.message
    });
  }
};

export const getResumeCandidateByUrl = async (req, res) => {
  try {
    const { url } = req.params;
    
    const candidate = await ResumeCandidateMetadata.findByDocumentUrl(url);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: `Resume candidate ${url} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error("Error getting resume candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume candidate",
      error: error.message
    });
  }
};

export const searchResumeCandidates = async (req, res) => {
  try {
    const criteria = req.body;
    
    const candidates = await ResumeCandidateMetadata.searchResumes(criteria);
    
    return res.status(200).json({
      success: true,
      data: candidates,
      total: candidates.length
    });
  } catch (error) {
    console.error("Error searching resume candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search resume candidates",
      error: error.message
    });
  }
};

export const flagResumeCandidate = async (req, res) => {
  try {
    const { url } = req.params;
    const { reason, notes } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required for flagging"
      });
    }
    
    const candidate = await ResumeCandidateMetadata.flagResume(null, reason, notes);
    
    return res.status(200).json({
      success: true,
      data: candidate,
      message: `Resume candidate ${url} flagged`
    });
  } catch (error) {
    console.error("Error flagging resume candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to flag resume candidate",
      error: error.message
    });
  }
};

export const unflagResumeCandidate = async (req, res) => {
  try {
    const { url } = req.params;
    
    const candidate = await ResumeCandidateMetadata.unflagResume(null);
    
    return res.status(200).json({
      success: true,
      data: candidate,
      message: `Resume candidate ${url} unflagged`
    });
  } catch (error) {
    console.error("Error unflagging resume candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unflag resume candidate",
      error: error.message
    });
  }
};

export const getResumeDocumentTypeDistribution = async (req, res) => {
  try {
    const distribution = await ResumeCandidateMetadata.getDocumentTypeDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting resume document type distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume document type distribution",
      error: error.message
    });
  }
};

export const getResumeParsingConfidenceDistribution = async (req, res) => {
  try {
    const distribution = await ResumeCandidateMetadata.getParsingConfidenceDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting resume parsing confidence distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume parsing confidence distribution",
      error: error.message
    });
  }
};

export const getResumeQualityMetrics = async (req, res) => {
  try {
    const metrics = await ResumeCandidateMetadata.getQualityMetricsDistribution();
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error("Error getting resume quality metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume quality metrics",
      error: error.message
    });
  }
};

export const syncResumeCandidate = async (req, res) => {
  try {
    const { url } = req.params;
    
    // Enqueue single discovery for sync
    const result = await enqueueSingleResumeDiscovery(url, { sync: true });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Resume candidate ${url} sync started`
    });
  } catch (error) {
    console.error("Error syncing resume candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync resume candidate",
      error: error.message
    });
  }
};

export const bulkSyncResumeCandidates = async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({
        success: false,
        message: "URLs array is required"
      });
    }
    
    const result = await enqueueBatchResumeDiscovery(urls, { sync: true });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Bulk sync started for ${urls.length} candidates`
    });
  } catch (error) {
    console.error("Error bulk syncing resume candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk sync resume candidates",
      error: error.message
    });
  }
};
