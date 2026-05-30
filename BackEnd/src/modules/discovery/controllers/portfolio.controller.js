import {
  enqueueBulkPortfolioDiscovery,
  enqueueSinglePortfolioDiscovery,
  enqueueBatchPortfolioDiscovery,
  getPortfolioDiscoveryQueueStats,
  retryFailedPortfolioDiscovery,
  cancelPortfolioDiscovery,
  pausePortfolioDiscoveryQueue,
  resumePortfolioDiscoveryQueue,
  getPortfolioDiscoveryMetrics
} from "../workers/portfolioDiscovery.worker.js";
import { portfolioConnector } from "../connectors/portfolio/portfolioConnector.service.js";
import { PortfolioCandidateMetadata } from "../../../models/portfolioCandidateMetadata.model.js";
// import { SourcingCandidate } from "../../../models/sourcingCandidate.model.js";
import { updateIngestionHistoryService } from "../services/discoveryStats.service.js";

export const runPortfolioDiscovery = async (req, res) => {
  try {
    const { type = 'bulk', options = {} } = req.body;

    let result;
    switch (type) {
      case 'bulk':
        result = await enqueueBulkPortfolioDiscovery(options);
        break;
      case 'single':
        if (!options.url) {
          return res.status(400).json({
            success: false,
            message: "URL is required for single discovery"
          });
        }
        result = await enqueueSinglePortfolioDiscovery(options.url, options);
        break;
      case 'batch':
        if (!options.urls || !Array.isArray(options.urls)) {
          return res.status(400).json({
            success: false,
            message: "URLs array is required for batch discovery"
          });
        }
        result = await enqueueBatchPortfolioDiscovery(options.urls, options);
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
      message: `Portfolio ${type} discovery started successfully`
    });
  } catch (error) {
    console.error("Error running portfolio discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run portfolio discovery",
      error: error.message
    });
  }
};

export const testPortfolioConnector = async (req, res) => {
  try {
    const testUrl = req.body.url || 'https://example.com';
    const result = await portfolioConnector.crawlPortfolioUrl(testUrl);
    
    return res.status(200).json({
      success: true,
      data: {
        url: testUrl,
        success: !!result,
        result: result ? {
          name: result.name,
          projects: result.projects?.length || 0,
          technologies: result.detectedTechnologies?.all?.length || 0,
          portfolioScore: result.portfolioScore
        } : null
      },
      message: "Portfolio connector test completed"
    });
  } catch (error) {
    console.error("Error testing portfolio connector:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to test portfolio connector",
      error: error.message
    });
  }
};

export const getPortfolioDiscoveryStatus = async (req, res) => {
  try {
    const queueStats = await getPortfolioDiscoveryQueueStats();
    const metrics = await getPortfolioDiscoveryMetrics();
    
    return res.status(200).json({
      success: true,
      data: {
        queue: queueStats,
        metrics,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error getting portfolio discovery status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio discovery status",
      error: error.message
    });
  }
};

export const getPortfolioDiscoveryStats = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const stats = await PortfolioCandidateMetadata.getAggregatedStats(timeRange);
    const queueStats = await getPortfolioDiscoveryQueueStats();
    
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
    console.error("Error getting portfolio discovery stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio discovery stats",
      error: error.message
    });
  }
};

export const getPortfolioDiscoveryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, timeRange = '30d' } = req.query;
    
    const history = await updateIngestionHistoryService({
      page: parseInt(page),
      limit: parseInt(limit),
      connectorName: 'portfolio-discovery',
      status,
      timeRange
    });
    
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error("Error getting portfolio discovery history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio discovery history",
      error: error.message
    });
  }
};

export const getPortfolioDiscoveryMetricsHandler = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const metrics = await getPortfolioDiscoveryMetrics(timeRange);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error("Error getting portfolio discovery metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio discovery metrics",
      error: error.message
    });
  }
};

export const pausePortfolioDiscovery = async (req, res) => {
  try {
    await pausePortfolioDiscoveryQueue();
    
    return res.status(200).json({
      success: true,
      message: "Portfolio discovery queue paused"
    });
  } catch (error) {
    console.error("Error pausing portfolio discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to pause portfolio discovery",
      error: error.message
    });
  }
};

export const resumePortfolioDiscovery = async (req, res) => {
  try {
    await resumePortfolioDiscoveryQueue();
    
    return res.status(200).json({
      success: true,
      message: "Portfolio discovery queue resumed"
    });
  } catch (error) {
    console.error("Error resuming portfolio discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resume portfolio discovery",
      error: error.message
    });
  }
};

export const cancelPortfolioDiscoveryHandler = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const result = await cancelPortfolioDiscovery(jobId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Portfolio discovery job ${jobId} cancelled`
    });
  } catch (error) {
    console.error("Error cancelling portfolio discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel portfolio discovery",
      error: error.message
    });
  }
};

export const retryPortfolioDiscovery = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const result = await retryFailedPortfolioDiscovery(jobId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Portfolio discovery job ${jobId} retry started`
    });
  } catch (error) {
    console.error("Error retrying portfolio discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retry portfolio discovery",
      error: error.message
    });
  }
};

export const getPortfolioCandidates = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      minScore, 
      specialization, 
      seniority, 
      technologies, 
      location,
      active,
      flagged 
    } = req.query;

    let candidates;
    
    if (minScore) {
      candidates = await PortfolioCandidateMetadata.getHighScoringPortfolios(
        parseInt(minScore), 
        parseInt(limit)
      );
    } else if (active === 'true') {
      candidates = await PortfolioCandidateMetadata.getActivePortfolios(
        6, // 6 months
        parseInt(limit)
      );
    } else if (specialization) {
      candidates = await PortfolioCandidateMetadata.getBySpecialization(
        specialization,
        parseInt(limit)
      );
    } else if (seniority) {
      candidates = await PortfolioCandidateMetadata.getBySeniority(
        seniority,
        parseInt(limit)
      );
    } else if (technologies) {
      const techArray = Array.isArray(technologies) ? technologies : [technologies];
      candidates = await PortfolioCandidateMetadata.getByTechnologies(
        techArray,
        parseInt(limit)
      );
    } else if (flagged === 'true') {
      candidates = await PortfolioCandidateMetadata.getFlaggedPortfolios(
        null,
        parseInt(limit)
      );
    } else {
      // Default: get all candidates with pagination
      candidates = await PortfolioCandidateMetadata.find({ flagged: false })
        .sort({ portfolioScore: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('candidateId', 'name email portfolioUrl location skills');
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
    console.error("Error getting portfolio candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio candidates",
      error: error.message
    });
  }
};

export const getPortfolioCandidateByUrl = async (req, res) => {
  try {
    const { url } = req.params;
    
    const candidate = await PortfolioCandidateMetadata.findByPortfolioUrl(url);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: `Portfolio candidate ${url} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error("Error getting portfolio candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio candidate",
      error: error.message
    });
  }
};

export const searchPortfolioCandidates = async (req, res) => {
  try {
    const criteria = req.body;
    
    const candidates = await PortfolioCandidateMetadata.searchPortfolios(criteria);
    
    return res.status(200).json({
      success: true,
      data: candidates,
      total: candidates.length
    });
  } catch (error) {
    console.error("Error searching portfolio candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search portfolio candidates",
      error: error.message
    });
  }
};

export const flagPortfolioCandidate = async (req, res) => {
  try {
    const { url } = req.params;
    const { reason, notes } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required for flagging"
      });
    }
    
    const candidate = await PortfolioCandidateMetadata.flagPortfolio(null, reason, notes);
    
    return res.status(200).json({
      success: true,
      data: candidate,
      message: `Portfolio candidate ${url} flagged`
    });
  } catch (error) {
    console.error("Error flagging portfolio candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to flag portfolio candidate",
      error: error.message
    });
  }
};

export const unflagPortfolioCandidate = async (req, res) => {
  try {
    const { url } = req.params;
    
    const candidate = await PortfolioCandidateMetadata.unflagPortfolio(null);
    
    return res.status(200).json({
      success: true,
      data: candidate,
      message: `Portfolio candidate ${url} unflagged`
    });
  } catch (error) {
    console.error("Error unflagging portfolio candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unflag portfolio candidate",
      error: error.message
    });
  }
};

export const getPortfolioTechnologyDistribution = async (req, res) => {
  try {
    const distribution = await PortfolioCandidateMetadata.getTechnologyDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting portfolio technology distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio technology distribution",
      error: error.message
    });
  }
};

export const getPortfolioSeniorityDistribution = async (req, res) => {
  try {
    const distribution = await PortfolioCandidateMetadata.getSeniorityDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting portfolio seniority distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio seniority distribution",
      error: error.message
    });
  }
};

export const getPortfolioSpecializationDistribution = async (req, res) => {
  try {
    const distribution = await PortfolioCandidateMetadata.getSpecializationDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting portfolio specialization distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get portfolio specialization distribution",
      error: error.message
    });
  }
};

export const syncPortfolioCandidate = async (req, res) => {
  try {
    const { url } = req.params;
    
    // Enqueue single discovery for sync
    const result = await enqueueSinglePortfolioDiscovery(url, { sync: true });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Portfolio candidate ${url} sync started`
    });
  } catch (error) {
    console.error("Error syncing portfolio candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync portfolio candidate",
      error: error.message
    });
  }
};

export const bulkSyncPortfolioCandidates = async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({
        success: false,
        message: "URLs array is required"
      });
    }
    
    const result = await enqueueBatchPortfolioDiscovery(urls, { sync: true });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Bulk sync started for ${urls.length} candidates`
    });
  } catch (error) {
    console.error("Error bulk syncing portfolio candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk sync portfolio candidates",
      error: error.message
    });
  }
};
