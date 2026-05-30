// import { getCandidateGraph } from "../services/talentGraph.service.js";
// import { getCompanyGraph } from "../services/talentGraph.service.js";
// import { getSkillGraph } from "../services/talentGraph.service.js";
import { getGraphInsights } from "../services/talentGraph.service.js";
import { getTalentNetwork } from "../services/networkIntelligence.service.js";
import { getGraphStats } from "../services/talentGraph.service.js";
import { buildTalentGraph } from "../services/talentGraph.service.js";
import { searchTalentGraph } from "../services/talentGraph.service.js";

export const getCandidateGraphController = async (req, res) => {
  try {
    const { id } = req.params;
    const { depth = 2, includeScores = true } = req.query;

    const graphData = await getCandidateGraph(id, {
      depth: parseInt(depth),
      includeScores: includeScores === 'true'
    });

    return res.status(200).json({
      success: true,
      data: graphData
    });
  } catch (error) {
    console.error("Error in getCandidateGraphController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get candidate graph",
      error: error.message
    });
  }
};

export const getCompanyGraphController = async (req, res) => {
  try {
    const { company } = req.params;
    const { depth = 2, includeMovement = true } = req.query;

    const graphData = await getCompanyGraph(company, {
      depth: parseInt(depth),
      includeMovement: includeMovement === 'true'
    });

    return res.status(200).json({
      success: true,
      data: graphData
    });
  } catch (error) {
    console.error("Error in getCompanyGraphController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get company graph",
      error: error.message
    });
  }
};

export const getSkillGraphController = async (req, res) => {
  try {
    const { skill } = req.params;
    const { depth = 2, includeClusters = true } = req.query;

    const graphData = await getSkillGraph(skill, {
      depth: parseInt(depth),
      includeClusters: includeClusters === 'true'
    });

    return res.status(200).json({
      success: true,
      data: graphData
    });
  } catch (error) {
    console.error("Error in getSkillGraphController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get skill graph",
      error: error.message
    });
  }
};

export const getGraphInsightsController = async (req, res) => {
  try {
    const { type = 'overview', timeRange = '30d' } = req.query;

    const insights = await getGraphInsights(type, timeRange);

    return res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error("Error in getGraphInsightsController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get graph insights",
      error: error.message
    });
  }
};

export const getTalentNetworkController = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const { depth = 3, includeStrength = true } = req.query;

    const networkData = await getTalentNetwork(recruiterId, {
      depth: parseInt(depth),
      includeStrength: includeStrength === 'true'
    });

    return res.status(200).json({
      success: true,
      data: networkData
    });
  } catch (error) {
    console.error("Error in getTalentNetworkController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get talent network",
      error: error.message
    });
  }
};

export const getGraphStatsController = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;

    const stats = await getGraphStats(timeRange);

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error in getGraphStatsController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get graph stats",
      error: error.message
    });
  }
};

export const buildTalentGraphController = async (req, res) => {
  try {
    const { force = false, updateType = 'full' } = req.body;

    const result = await buildTalentGraph({
      force,
      updateType
    });

    return res.status(200).json({
      success: true,
      message: "Talent graph build initiated",
      data: result
    });
  } catch (error) {
    console.error("Error in buildTalentGraphController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to build talent graph",
      error: error.message
    });
  }
};

export const searchGraphController = async (req, res) => {
  try {
    const {
      query,
      nodeType = 'candidate',
      maxResults = 20,
      includeMetadata = true
    } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const validNodeTypes = ['candidate', 'company', 'skill', 'industry', 'recruiter'];
    if (!validNodeTypes.includes(nodeType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid node type. Valid types: candidate, company, skill, industry, recruiter"
      });
    }

    const searchResults = await searchTalentGraph({
      query,
      nodeType,
      maxResults: parseInt(maxResults),
      includeMetadata: includeMetadata === 'true'
    });

    return res.status(200).json({
      success: true,
      data: searchResults
    });
  } catch (error) {
    console.error("Error in searchGraphController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search talent graph",
      error: error.message
    });
  }
};
