import { generateOutreach } from "../services/outreachGeneration.service.js";
import { sendOutreachMessage } from "../services/outreachGeneration.service.js";
import { getOutreachHistory } from "../services/outreachHistory.service.js";
import { getOutreachStatistics } from "../services/outreachHistory.service.js";
import { bulkGenerateOutreach } from "../services/outreachGeneration.service.js";
import { getOutreachTemplates } from "../services/outreachGeneration.service.js";
import { saveOutreachTemplate } from "../services/outreachGeneration.service.js";
import { trackRecruiterInteraction } from "../../copilot/services/interactionTracking.service.js";

export const generateOutreachController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const {
      candidateId,
      jobId,
      outreachType,
      tone,
      customInstructions,
      templateId
    } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required"
      });
    }

    const validOutreachTypes = ['email', 'linkedin', 'followup', 'cold'];
    if (!outreachType || !validOutreachTypes.includes(outreachType)) {
      return res.status(400).json({
        success: false,
        message: "Valid outreach type is required (email, linkedin, followup, cold)"
      });
    }

    const validTones = ['professional', 'startup_casual', 'aggressive_hiring', 'executive_hiring'];
    if (!tone || !validTones.includes(tone)) {
      return res.status(400).json({
        success: false,
        message: "Valid tone is required (professional, startup_casual, aggressive_hiring, executive_hiring)"
      });
    }

    const result = await generateOutreach({
      candidateId,
      jobId,
      recruiterId,
      outreachType,
      tone,
      customInstructions,
      templateId
    });

    await trackRecruiterInteraction(recruiterId, candidateId, 'contacted', {
      source: 'outreach',
      outreachType,
      tone,
      metadata: {
        generatedAt: new Date(),
        jobId: jobId || null
      }
    });

    return res.status(200).json({
      success: true,
      message: "Outreach message generated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in generateOutreachController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate outreach message",
      error: error.message
    });
  }
};

export const sendOutreachController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const {
      candidateId,
      outreachId,
      subject,
      message,
      outreachType,
      sendMethod,
      scheduledAt
    } = req.body;

    if (!candidateId || !message) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID and message are required"
      });
    }

    const result = await sendOutreachMessage({
      candidateId,
      outreachId,
      recruiterId,
      subject,
      message,
      outreachType,
      sendMethod,
      scheduledAt
    });

    await trackRecruiterInteraction(recruiterId, candidateId, 'contacted', {
      source: 'outreach',
      outreachType,
      sendMethod,
      metadata: {
        sentAt: new Date(),
        scheduledAt: scheduledAt || null
      }
    });

    return res.status(200).json({
      success: true,
      message: "Outreach message sent successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in sendOutreachController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send outreach message",
      error: error.message
    });
  }
};

export const getOutreachHistoryController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const {
      limit = 20,
      offset = 0,
      candidateId,
      outreachType,
      status,
      dateRange
    } = req.query;

    const filters = {};
    if (candidateId) filters.candidateId = candidateId;
    if (outreachType) filters.outreachType = outreachType;
    if (status) filters.status = status;
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      filters.dateRange = { startDate, endDate };
    }

    const result = await getOutreachHistory(recruiterId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error in getOutreachHistoryController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get outreach history",
      error: error.message
    });
  }
};

export const getOutreachStatsController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { timeRange = '30d' } = req.query;

    const stats = await getOutreachStatistics(recruiterId, timeRange);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error in getOutreachStatsController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get outreach statistics",
      error: error.message
    });
  }
};

export const bulkGenerateOutreachController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const {
      candidateIds,
      jobId,
      outreachType,
      tone,
      customInstructions,
      templateId,
      batchSize = 5
    } = req.body;

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Candidate IDs array is required"
      });
    }

    const validOutreachTypes = ['email', 'linkedin', 'followup', 'cold'];
    if (!outreachType || !validOutreachTypes.includes(outreachType)) {
      return res.status(400).json({
        success: false,
        message: "Valid outreach type is required"
      });
    }

    const validTones = ['professional', 'startup_casual', 'aggressive_hiring', 'executive_hiring'];
    if (!tone || !validTones.includes(tone)) {
      return res.status(400).json({
        success: false,
        message: "Valid tone is required"
      });
    }

    const result = await bulkGenerateOutreach({
      candidateIds,
      jobId,
      recruiterId,
      outreachType,
      tone,
      customInstructions,
      templateId,
      batchSize: parseInt(batchSize)
    });

    candidateIds.forEach(candidateId => {
      trackRecruiterInteraction(recruiterId, candidateId, 'contacted', {
        source: 'outreach',
        outreachType,
        tone,
        metadata: {
          bulkGenerated: true,
          generatedAt: new Date(),
          jobId: jobId || null
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: "Bulk outreach generation initiated",
      data: result
    });
  } catch (error) {
    console.error("Error in bulkGenerateOutreachController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to initiate bulk outreach generation",
      error: error.message
    });
  }
};

export const getOutreachTemplatesController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { outreachType, tone } = req.query;

    const filters = {};
    if (outreachType) filters.outreachType = outreachType;
    if (tone) filters.tone = tone;

    const templates = await getOutreachTemplates(recruiterId, filters);

    return res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error("Error in getOutreachTemplatesController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get outreach templates",
      error: error.message
    });
  }
};

export const saveOutreachTemplateController = async (req, res) => {
  try {
    const recruiterId = req.id;
    const {
      name,
      description,
      outreachType,
      tone,
      template,
      variables,
      isPublic = false
    } = req.body;

    if (!name || !outreachType || !tone || !template) {
      return res.status(400).json({
        success: false,
        message: "Name, outreach type, tone, and template are required"
      });
    }

    const validOutreachTypes = ['email', 'linkedin', 'followup', 'cold'];
    if (!validOutreachTypes.includes(outreachType)) {
      return res.status(400).json({
        success: false,
        message: "Valid outreach type is required"
      });
    }

    const validTones = ['professional', 'startup_casual', 'aggressive_hiring', 'executive_hiring'];
    if (!validTones.includes(tone)) {
      return res.status(400).json({
        success: false,
        message: "Valid tone is required"
      });
    }

    const result = await saveOutreachTemplate({
      name,
      description,
      outreachType,
      tone,
      template,
      variables: variables || [],
      isPublic,
      createdBy: recruiterId
    });

    return res.status(200).json({
      success: true,
      message: "Outreach template saved successfully",
      data: result
    });
  } catch (error) {
    console.error("Error in saveOutreachTemplateController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save outreach template",
      error: error.message
    });
  }
};
