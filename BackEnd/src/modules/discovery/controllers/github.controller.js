import {
  enqueueBulkGitHubDiscovery,
  enqueueSingleGitHubDiscovery,
  enqueueBatchGitHubDiscovery,
  getGitHubDiscoveryQueueStats,
  retryFailedGitHubDiscovery,
  cancelGitHubDiscovery,
  pauseGitHubDiscoveryQueue,
  resumeGitHubDiscoveryQueue,
  getGitHubDiscoveryMetrics
} from "../workers/githubDiscovery.worker.js";
import { githubConnector } from "../connectors/github/githubConnector.service.js";
import { GitHubCandidateMetadata } from "../../../models/githubCandidateMetadata.model.js";
// import { SourcingCandidate } from "../../../models/sourcingCandidate.model.js";
import { updateIngestionHistoryService } from "../services/discoveryStats.service.js";

export const runGitHubDiscovery = async (req, res) => {
  try {
    const { type = 'bulk', options = {} } = req.body;

    let result;
    switch (type) {
      case 'bulk':
        result = await enqueueBulkGitHubDiscovery(options);
        break;
      case 'single':
        if (!options.username) {
          return res.status(400).json({
            success: false,
            message: "Username is required for single discovery"
          });
        }
        result = await enqueueSingleGitHubDiscovery(options.username, options);
        break;
      case 'batch':
        if (!options.usernames || !Array.isArray(options.usernames)) {
          return res.status(400).json({
            success: false,
            message: "Usernames array is required for batch discovery"
          });
        }
        result = await enqueueBatchGitHubDiscovery(options.usernames, options);
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
      message: `GitHub ${type} discovery started successfully`
    });
  } catch (error) {
    console.error("Error running GitHub discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run GitHub discovery",
      error: error.message
    });
  }
};

export const testGitHubConnector = async (req, res) => {
  try {
    const result = await githubConnector.testConnection();
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "GitHub connector test completed"
    });
  } catch (error) {
    console.error("Error testing GitHub connector:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to test GitHub connector",
      error: error.message
    });
  }
};

export const getGitHubDiscoveryStatus = async (req, res) => {
  try {
    const queueStats = await getGitHubDiscoveryQueueStats();
    const metrics = await getGitHubDiscoveryMetrics();
    
    return res.status(200).json({
      success: true,
      data: {
        queue: queueStats,
        metrics,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error getting GitHub discovery status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub discovery status",
      error: error.message
    });
  }
};

export const getGitHubDiscoveryStats = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const stats = await GitHubCandidateMetadata.getAggregatedStats(timeRange);
    const queueStats = await getGitHubDiscoveryQueueStats();
    
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
    console.error("Error getting GitHub discovery stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub discovery stats",
      error: error.message
    });
  }
};

export const getGitHubDiscoveryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, timeRange = '30d' } = req.query;
    
    const history = await updateIngestionHistoryService({
      page: parseInt(page),
      limit: parseInt(limit),
      connectorName: 'github-discovery',
      status,
      timeRange
    });
    
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error("Error getting GitHub discovery history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub discovery history",
      error: error.message
    });
  }
};

export const getGitHubDiscoveryMetricsHandler = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const metrics = await getGitHubDiscoveryMetrics(timeRange);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error("Error getting GitHub discovery metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub discovery metrics",
      error: error.message
    });
  }
};

export const pauseGitHubDiscovery = async (req, res) => {
  try {
    await pauseGitHubDiscoveryQueue();
    
    return res.status(200).json({
      success: true,
      message: "GitHub discovery queue paused"
    });
  } catch (error) {
    console.error("Error pausing GitHub discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to pause GitHub discovery",
      error: error.message
    });
  }
};

export const resumeGitHubDiscovery = async (req, res) => {
  try {
    await resumeGitHubDiscoveryQueue();
    
    return res.status(200).json({
      success: true,
      message: "GitHub discovery queue resumed"
    });
  } catch (error) {
    console.error("Error resuming GitHub discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resume GitHub discovery",
      error: error.message
    });
  }
};

export const cancelGitHubDiscoveryHandler = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const result = await cancelGitHubDiscovery(jobId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `GitHub discovery job ${jobId} cancelled`
    });
  } catch (error) {
    console.error("Error cancelling GitHub discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel GitHub discovery",
      error: error.message
    });
  }
};

export const retryGitHubDiscovery = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const result = await retryFailedGitHubDiscovery(jobId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `GitHub discovery job ${jobId} retry started`
    });
  } catch (error) {
    console.error("Error retrying GitHub discovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retry GitHub discovery",
      error: error.message
    });
  }
};

export const getGitHubCandidates = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      minScore, 
      specialization, 
      seniority, 
      skills, 
      location,
      active,
      flagged 
    } = req.query;

    let candidates;
    
    if (minScore) {
      candidates = await GitHubCandidateMetadata.getHighScoringDevelopers(
        parseInt(minScore), 
        parseInt(limit)
      );
    } else if (active === 'true') {
      candidates = await GitHubCandidateMetadata.getActiveDevelopers(
        6, // 6 months
        parseInt(limit)
      );
    } else if (specialization) {
      candidates = await GitHubCandidateMetadata.getBySpecialization(
        specialization,
        parseInt(limit)
      );
    } else if (seniority) {
      candidates = await GitHubCandidateMetadata.getBySeniority(
        seniority,
        parseInt(limit)
      );
    } else if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      candidates = await GitHubCandidateMetadata.getBySkills(
        skillArray,
        parseInt(limit)
      );
    } else if (flagged === 'true') {
      candidates = await GitHubCandidateMetadata.getFlaggedProfiles(
        null,
        parseInt(limit)
      );
    } else {
      // Default: get all candidates with pagination
      candidates = await GitHubCandidateMetadata.find({ flagged: false })
        .sort({ developerScore: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('candidateId', 'name email githubUrl location skills');
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
    console.error("Error getting GitHub candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub candidates",
      error: error.message
    });
  }
};

export const getGitHubCandidateByUser = async (req, res) => {
  try {
    const { username } = req.params;
    
    const candidate = await GitHubCandidateMetadata.findByGithubUsername(username);
    
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: `GitHub candidate ${username} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error("Error getting GitHub candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub candidate",
      error: error.message
    });
  }
};

export const searchGitHubCandidates = async (req, res) => {
  try {
    const criteria = req.body;
    
    const candidates = await GitHubCandidateMetadata.searchDevelopers(criteria);
    
    return res.status(200).json({
      success: true,
      data: candidates,
      total: candidates.length
    });
  } catch (error) {
    console.error("Error searching GitHub candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search GitHub candidates",
      error: error.message
    });
  }
};

export const flagGitHubCandidate = async (req, res) => {
  try {
    const { username } = req.params;
    const { reason, notes } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required for flagging"
      });
    }
    
    const candidate = await GitHubCandidateMetadata.flagProfile(null, reason, notes);
    
    return res.status(200).json({
      success: true,
      data: candidate,
      message: `GitHub candidate ${username} flagged`
    });
  } catch (error) {
    console.error("Error flagging GitHub candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to flag GitHub candidate",
      error: error.message
    });
  }
};

export const unflagGitHubCandidate = async (req, res) => {
  try {
    const { username } = req.params;
    
    const candidate = await GitHubCandidateMetadata.unflagProfile(null);
    
    return res.status(200).json({
      success: true,
      data: candidate,
      message: `GitHub candidate ${username} unflagged`
    });
  } catch (error) {
    console.error("Error unflagging GitHub candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to unflag GitHub candidate",
      error: error.message
    });
  }
};

export const getGitHubSkillDistribution = async (req, res) => {
  try {
    const distribution = await GitHubCandidateMetadata.getSkillDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting GitHub skill distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub skill distribution",
      error: error.message
    });
  }
};

export const getGitHubSeniorityDistribution = async (req, res) => {
  try {
    const distribution = await GitHubCandidateMetadata.getSeniorityDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting GitHub seniority distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub seniority distribution",
      error: error.message
    });
  }
};

export const getGitHubSpecializationDistribution = async (req, res) => {
  try {
    const distribution = await GitHubCandidateMetadata.getSpecializationDistribution();
    
    return res.status(200).json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error("Error getting GitHub specialization distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get GitHub specialization distribution",
      error: error.message
    });
  }
};

export const syncGitHubCandidate = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Enqueue single discovery for sync
    const result = await enqueueSingleGitHubDiscovery(username, { sync: true });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `GitHub candidate ${username} sync started`
    });
  } catch (error) {
    console.error("Error syncing GitHub candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync GitHub candidate",
      error: error.message
    });
  }
};

export const bulkSyncGitHubCandidates = async (req, res) => {
  try {
    const { usernames } = req.body;
    
    if (!usernames || !Array.isArray(usernames)) {
      return res.status(400).json({
        success: false,
        message: "Usernames array is required"
      });
    }
    
    const result = await enqueueBatchGitHubDiscovery(usernames, { sync: true });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Bulk sync started for ${usernames.length} candidates`
    });
  } catch (error) {
    console.error("Error bulk syncing GitHub candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to bulk sync GitHub candidates",
      error: error.message
    });
  }
};
