import { trackRecruiterInteraction } from "../services/recruiterLearning.service.js";
import { getRecruiterPreferences } from "../services/recruiterPreference.service.js";
import { getRecruiterInsights } from "../services/hiringBehavior.service.js";
import { updateRecruiterPreferences } from "../services/recruiterPreference.service.js";
import { getRecruiterLearningStats } from "../services/recruiterLearning.service.js";
import { triggerLearningModel } from "../services/recruiterLearning.service.js";
import { getAdaptiveRanking } from "../services/adaptiveRanking.service.js";

export const trackRecruiterFeedbackController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const {
      candidateId,
      action,
      context,
      metadata,
      timestamp
    } = req.body;

    if (!candidateId || !action) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID and action are required"
      });
    }

    const validActions = ['viewed', 'shortlisted', 'rejected', 'contacted', 'hired', 'interviewed', 'not_interested'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Valid actions: viewed, shortlisted, rejected, contacted, hired, interviewed, not_interested"
      });
    }

    const result = await trackRecruiterInteraction(recruiterId, {
      candidateId,
      action,
      context: context || {},
      metadata: metadata || {},
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    return res.status(200).json({
      success: true,
      message: "Recruiter feedback tracked successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in trackRecruiterFeedbackController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to track recruiter feedback",
      error: error.message
    });
  }
};

export const getRecruiterPreferencesController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentRecruiterId = req.id;

    if (id !== currentRecruiterId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own preferences."
      });
    }

    const preferences = await getRecruiterPreferences(id);

    return res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error("Error in getRecruiterPreferencesController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get recruiter preferences",
      error: error.message
    });
  }
};

export const getRecruiterInsightsController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentRecruiterId = req.id;
    const { timeRange = '30d' } = req.query;

    if (id !== currentRecruiterId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own insights."
      });
    }

    const insights = await getRecruiterInsights(id, timeRange);

    return res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error("Error in getRecruiterInsightsController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get recruiter insights",
      error: error.message
    });
  }
};

export const updateRecruiterPreferencesController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentRecruiterId = req.id;
    const {
      preferredSkills,
      preferredIndustries,
      preferredExperienceLevels,
      preferredCompanyTypes,
      preferredLocations,
      customWeights
    } = req.body;

    if (id !== currentRecruiterId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own preferences."
      });
    }

    const result = await updateRecruiterPreferences(id, {
      preferredSkills: preferredSkills || [],
      preferredIndustries: preferredIndustries || [],
      preferredExperienceLevels: preferredExperienceLevels || [],
      preferredCompanyTypes: preferredCompanyTypes || [],
      preferredLocations: preferredLocations || [],
      customWeights: customWeights || {}
    });

    return res.status(200).json({
      success: true,
      message: "Recruiter preferences updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in updateRecruiterPreferencesController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update recruiter preferences",
      error: error.message
    });
  }
};

export const getRecruiterLearningStatsController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentRecruiterId = req.id;
    const { timeRange = '30d' } = req.query;

    if (id !== currentRecruiterId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own learning stats."
      });
    }

    const stats = await getRecruiterLearningStats(id, timeRange);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error in getRecruiterLearningStatsController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get recruiter learning stats",
      error: error.message
    });
  }
};

export const triggerLearningModelController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { force = false, modelType = 'all' } = req.body;

    const validModelTypes = ['all', 'preferences', 'ranking', 'behavior'];
    if (!validModelTypes.includes(modelType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid model type. Valid types: all, preferences, ranking, behavior"
      });
    }

    const result = await triggerLearningModel(recruiterId, {
      force,
      modelType
    });

    return res.status(200).json({
      success: true,
      message: "Learning model triggered successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in triggerLearningModelController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to trigger learning model",
      error: error.message
    });
  }
};

export const getAdaptiveRankingController = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const currentRecruiterId = req.id;
    const {
      candidateIds,
      context,
      rankingType = 'default'
    } = req.body;

    if (recruiterId !== currentRecruiterId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only get your own adaptive ranking."
      });
    }

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Candidate IDs array is required"
      });
    }

    const validRankingTypes = ['default', 'semantic', 'behavioral', 'hybrid'];
    if (!validRankingTypes.includes(rankingType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ranking type. Valid types: default, semantic, behavioral, hybrid"
      });
    }

    const result = await getAdaptiveRanking(recruiterId, {
      candidateIds,
      context: context || {},
      rankingType
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in getAdaptiveRankingController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get adaptive ranking",
      error: error.message
    });
  }
};
