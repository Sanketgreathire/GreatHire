import { processCopilotQuery } from "../services/copilot.service.js";
import { getRecruiterMemory, updateRecruiterMemory } from "../../../models/recruiterMemory.model.js";
import { trackRecruiterInteraction } from "../services/interactionTracking.service.js";
import { getPersonalizedRecommendations } from "../services/copilotRanking.service.js";

export const chatController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { message, context = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const result = await processCopilotQuery(message, recruiterId, context);

    await updateRecruiterMemory(recruiterId, {
      lastSearch: {
        query: message,
        intent: result.interpretedIntent,
        timestamp: new Date(),
        resultCount: result.candidates?.length || 0
      }
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in copilot chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process copilot query",
      error: error.message
    });
  }
};

export const getRecruiterMemoryController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const memory = await getRecruiterMemory(recruiterId);

    return res.status(200).json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error("Error fetching recruiter memory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter memory",
      error: error.message
    });
  }
};

export const updateRecruiterMemoryController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { preferences, settings } = req.body;

    const updatedMemory = await updateRecruiterMemory(recruiterId, {
      preferences,
      settings
    });

    return res.status(200).json({
      success: true,
      data: updatedMemory
    });
  } catch (error) {
    console.error("Error updating recruiter memory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update recruiter memory",
      error: error.message
    });
  }
};

export const trackInteractionController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { candidateId, interactionType, metadata = {} } = req.body;

    if (!candidateId || !interactionType) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID and interaction type are required"
      });
    }

    const validTypes = ['viewed', 'shortlisted', 'rejected', 'contacted', 'interviewed'];
    if (!validTypes.includes(interactionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interaction type"
      });
    }

    await trackRecruiterInteraction(recruiterId, candidateId, interactionType, metadata);

    return res.status(200).json({
      success: true,
      message: "Interaction tracked successfully"
    });
  } catch (error) {
    console.error("Error tracking interaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to track interaction",
      error: error.message
    });
  }
};

export const getRecommendationsController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { type = 'all', limit = 10 } = req.query;

    const recommendations = await getPersonalizedRecommendations(recruiterId, {
      type,
      limit: parseInt(limit)
    });

    return res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations",
      error: error.message
    });
  }
};

export const getSearchHistoryController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { limit = 20, offset = 0 } = req.query;

    const memory = await getRecruiterMemory(recruiterId);
    const searchHistory = memory.searchHistory || [];
    
    const paginatedHistory = searchHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    return res.status(200).json({
      success: true,
      data: {
        history: paginatedHistory,
        total: searchHistory.length,
        hasMore: parseInt(offset) + parseInt(limit) < searchHistory.length
      }
    });
  } catch (error) {
    console.error("Error fetching search history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch search history",
      error: error.message
    });
  }
};
