import {
  enqueueSignalAggregation,
  enqueueBatchSignalProcessing,
  enqueueSignalRefresh,
  getTalentSignalQueueStats,
  getTalentSignalMetrics,
  getWorkerHealth,
  getStaleCandidates,
  refreshStaleCandidates
} from "../workers/talentSignal.worker.js";
import { talentSignalAggregatorService } from "../services/talentSignalAggregator.service.js";
import { TalentSignal } from "../../../models/talentSignal.model.js";
// import { SourcingCandidate } from "../../../../models/sourcingCandidate.model.js";

export const runTalentSignalProcessing = async (req, res) => {
  try {
    const { type = 'aggregate', candidateId, candidateIds } = req.body;

    let result;
    
    switch (type) {
      case 'aggregate':
        if (!candidateId) {
          return res.status(400).json({
            success: false,
            message: "Candidate ID is required for aggregation"
          });
        }
        result = await enqueueSignalAggregation(candidateId);
        break;
        
      case 'batch':
        if (!candidateIds || !Array.isArray(candidateIds)) {
          return res.status(400).json({
            success: false,
            message: "Candidate IDs array is required for batch processing"
          });
        }
        result = await enqueueBatchSignalProcessing(candidateIds);
        break;
        
      case 'refresh':
        if (!candidateId) {
          return res.status(400).json({
            success: false,
            message: "Candidate ID is required for refresh"
          });
        }
        result = await enqueueSignalRefresh(candidateId);
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
      message: `${type} processing started successfully`
    });
  } catch (error) {
    console.error("Error running talent signal processing:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run talent signal processing",
      error: error.message
    });
  }
};

export const getCandidateTalentSignals = async (req, res) => {
  try {
    const { id } = req.params;
    
    const talentSignal = await TalentSignal.findOne({ candidateId: id })
      .populate('candidateId', 'name email location currentTitle experience skills');
    
    if (!talentSignal) {
      return res.status(404).json({
        success: false,
        message: "Talent signals not found for candidate"
      });
    }

    return res.status(200).json({
      success: true,
      data: talentSignal
    });
  } catch (error) {
    console.error("Error getting candidate talent signals:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get candidate talent signals",
      error: error.message
    });
  }
};

export const getTalentSignalStats = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const queueStats = await getTalentSignalQueueStats();
    const metrics = await getTalentSignalMetrics(timeRange);
    const workerHealth = await getWorkerHealth();
    
    // Get additional stats from database
    const processingStats = await TalentSignal.getProcessingStats();
    const qualityMetrics = await TalentSignal.getQualityMetrics();
    
    // Get score distributions
    const opportunityDistribution = await TalentSignal.getScoreDistribution('opportunityScore');
    const priorityDistribution = await TalentSignal.getScoreDistribution('sourcingPriorityScore');
    const targetingDistribution = await TalentSignal.getScoreDistribution('recruiterTargetingScore');
    const momentumDistribution = await TalentSignal.getScoreDistribution('talentMomentumScore');

    return res.status(200).json({
      success: true,
      data: {
        timeRange,
        queue: queueStats,
        worker: workerHealth,
        metrics,
        processing: processingStats,
        quality: qualityMetrics,
        distributions: {
          opportunity: opportunityDistribution,
          priority: priorityDistribution,
          targeting: targetingDistribution,
          momentum: momentumDistribution
        }
      }
    });
  } catch (error) {
    console.error("Error getting talent signal stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get talent signal stats",
      error: error.message
    });
  }
};

export const getTopCandidates = async (req, res) => {
  try {
    const { 
      scoreType = 'opportunityScore', 
      limit = 50, 
      minScore = 0.5,
      maxScore = 1.0 
    } = req.query;

    let candidates;
    
    if (minScore && maxScore) {
      candidates = await TalentSignal.findByScoreRange(scoreType, parseFloat(minScore), parseFloat(maxScore), parseInt(limit));
    } else {
      candidates = await TalentSignal.find({})
        .sort({ [scoreType]: -1 })
        .limit(parseInt(limit))
        .populate('candidateId', 'name email location currentTitle');
    }

    return res.status(200).json({
      success: true,
      data: {
        scoreType,
        candidates: candidates.map(signal => ({
          candidateId: signal.candidateId._id,
          name: signal.candidateId.name,
          email: signal.candidateId.email,
          location: signal.candidateId.location,
          currentTitle: signal.candidateId.currentTitle,
          scores: {
            opportunity: signal.opportunityScore,
            sourcingPriority: signal.sourcingPriorityScore,
            recruiterTargeting: signal.recruiterTargetingScore,
            talentMomentum: signal.talentMomentumScore,
            openToWork: signal.openToWorkScore,
            recruiterResponse: signal.recruiterResponseScore,
            startupAffinity: signal.startupAffinityScore,
            leadership: signal.leadershipScore
          },
          lastUpdated: signal.lastUpdated,
          confidence: signal.getOverallConfidence(),
          insights: signal.getInsightsByCategory('combined'),
          recommendations: signal.getActionableRecommendations()
        }))
      }
    });
  } catch (error) {
    console.error("Error getting top candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get top candidates",
      error: error.message
    });
  }
};

export const getCandidateSegments = async (req, res) => {
  try {
    const segments = await talentSignalAggregatorService.getCandidateSegments();
    
    return res.status(200).json({
      success: true,
      data: segments
    });
  } catch (error) {
    console.error("Error getting candidate segments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get candidate segments",
      error: error.message
    });
  }
};

export const getSignalAnalytics = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    const analytics = await talentSignalAggregatorService.getSignalAnalytics(timeRange);
    
    return res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error("Error getting signal analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get signal analytics",
      error: error.message
    });
  }
};

export const getHighOpportunityCandidates = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const candidates = await TalentSignal.findHighOpportunityCandidates(parseInt(limit));
    
    return res.status(200).json({
      success: true,
      data: candidates.map(signal => ({
        candidateId: signal.candidateId._id,
        name: signal.candidateId.name,
        email: signal.candidateId.email,
        location: signal.candidateId.location,
        currentTitle: signal.candidateId.currentTitle,
        opportunityScore: signal.opportunityScore,
        confidence: signal.getOverallConfidence(),
        lastUpdated: signal.lastUpdated
      }))
    });
  } catch (error) {
    console.error("Error getting high opportunity candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get high opportunity candidates",
      error: error.message
    });
  }
};

export const getHighPriorityCandidates = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const candidates = await TalentSignal.findHighPriorityCandidates(parseInt(limit));
    
    return res.status(200).json({
      success: true,
      data: candidates.map(signal => ({
        candidateId: signal.candidateId._id,
        name: signal.candidateId.name,
        email: signal.candidateId.email,
        location: signal.candidateId.location,
        currentTitle: signal.candidateId.currentTitle,
        sourcingPriorityScore: signal.sourcingPriorityScore,
        confidence: signal.getOverallConfidence(),
        lastUpdated: signal.lastUpdated
      }))
    });
  } catch (error) {
    console.error("Error getting high priority candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get high priority candidates",
      error: error.message
    });
  }
};

export const getStartupCandidates = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const candidates = await TalentSignal.findStartupCandidates(parseInt(limit));
    
    return res.status(200).json({
      success: true,
      data: candidates.map(signal => ({
        candidateId: signal.candidateId._id,
        name: signal.candidateId.name,
        email: signal.candidateId.email,
        location: signal.candidateId.location,
        currentTitle: signal.candidateId.currentTitle,
        startupAffinityScore: signal.startupAffinityScore,
        leadershipScore: signal.leadershipScore,
        confidence: signal.getOverallConfidence(),
        lastUpdated: signal.lastUpdated
      }))
    });
  } catch (error) {
    console.error("Error getting startup candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get startup candidates",
      error: error.message
    });
  }
};

export const getLeadershipCandidates = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const candidates = await TalentSignal.findLeadershipCandidates(parseInt(limit));
    
    return res.status(200).json({
      success: true,
      data: candidates.map(signal => ({
        candidateId: signal.candidateId._id,
        name: signal.candidateId.name,
        email: signal.candidateId.email,
        location: signal.candidateId.location,
        currentTitle: signal.candidateId.currentTitle,
        leadershipScore: signal.leadershipScore,
        confidence: signal.getOverallConfidence(),
        lastUpdated: signal.lastUpdated
      }))
    });
  } catch (error) {
    console.error("Error getting leadership candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get leadership candidates",
      error: error.message
    });
  }
};

export const getOpenToWorkCandidates = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const candidates = await TalentSignal.findOpenToWorkCandidates(parseInt(limit));
    
    return res.status(200).json({
      success: true,
      data: candidates.map(signal => ({
        candidateId: signal.candidateId._id,
        name: signal.candidateId.name,
        email: signal.candidateId.email,
        location: signal.candidateId.location,
        currentTitle: signal.candidateId.currentTitle,
        openToWorkScore: signal.openToWorkScore,
        confidence: signal.getOverallConfidence(),
        lastUpdated: signal.lastUpdated
      }))
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

export const refreshCandidateSignals = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await enqueueSignalRefresh(id);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Candidate signal refresh started"
    });
  } catch (error) {
    console.error("Error refreshing candidate signals:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh candidate signals",
      error: error.message
    });
  }
};

export const getStaleCandidatesHandler = async (req, res) => {
  try {
    const { daysThreshold = 30 } = req.query;
    
    const staleCandidates = await getStaleCandidates(parseInt(daysThreshold));
    
    return res.status(200).json({
      success: true,
      data: {
        daysThreshold: parseInt(daysThreshold),
        candidates: staleCandidates,
        count: staleCandidates.length
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

export const refreshStaleCandidatesHandler = async (req, res) => {
  try {
    const { daysThreshold = 30 } = req.body;
    
    const result = await refreshStaleCandidates(parseInt(daysThreshold));
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Stale candidates refresh initiated"
    });
  } catch (error) {
    console.error("Error refreshing stale candidates:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh stale candidates",
      error: error.message
    });
  }
};

export const searchCandidatesBySignals = async (req, res) => {
  try {
    const {
      minOpportunityScore,
      maxOpportunityScore,
      minPriorityScore,
      maxPriorityScore,
      minTargetingScore,
      maxTargetingScore,
      minMomentumScore,
      maxMomentumScore,
      minOpenToWorkScore,
      maxOpenToWorkScore,
      minStartupAffinityScore,
      maxStartupAffinityScore,
      minLeadershipScore,
      maxLeadershipScore,
      limit = 50
    } = req.query;

    // Build query based on provided filters
    const query = {};
    
    if (minOpportunityScore !== undefined || maxOpportunityScore !== undefined) {
      query.opportunityScore = {};
      if (minOpportunityScore !== undefined) query.opportunityScore.$gte = parseFloat(minOpportunityScore);
      if (maxOpportunityScore !== undefined) query.opportunityScore.$lte = parseFloat(maxOpportunityScore);
    }
    
    if (minPriorityScore !== undefined || maxPriorityScore !== undefined) {
      query.sourcingPriorityScore = {};
      if (minPriorityScore !== undefined) query.sourcingPriorityScore.$gte = parseFloat(minPriorityScore);
      if (maxPriorityScore !== undefined) query.sourcingPriorityScore.$lte = parseFloat(maxPriorityScore);
    }
    
    if (minTargetingScore !== undefined || maxTargetingScore !== undefined) {
      query.recruiterTargetingScore = {};
      if (minTargetingScore !== undefined) query.recruiterTargetingScore.$gte = parseFloat(minTargetingScore);
      if (maxTargetingScore !== undefined) query.recruiterTargetingScore.$lte = parseFloat(maxTargetingScore);
    }
    
    if (minMomentumScore !== undefined || maxMomentumScore !== undefined) {
      query.talentMomentumScore = {};
      if (minMomentumScore !== undefined) query.talentMomentumScore.$gte = parseFloat(minMomentumScore);
      if (maxMomentumScore !== undefined) query.talentMomentumScore.$lte = parseFloat(maxMomentumScore);
    }
    
    if (minOpenToWorkScore !== undefined || maxOpenToWorkScore !== undefined) {
      query.openToWorkScore = {};
      if (minOpenToWorkScore !== undefined) query.openToWorkScore.$gte = parseFloat(minOpenToWorkScore);
      if (maxOpenToWorkScore !== undefined) query.openToWorkScore.$lte = parseFloat(maxOpenToWorkScore);
    }
    
    if (minStartupAffinityScore !== undefined || maxStartupAffinityScore !== undefined) {
      query.startupAffinityScore = {};
      if (minStartupAffinityScore !== undefined) query.startupAffinityScore.$gte = parseFloat(minStartupAffinityScore);
      if (maxStartupAffinityScore !== undefined) query.startupAffinityScore.$lte = parseFloat(maxStartupAffinityScore);
    }
    
    if (minLeadershipScore !== undefined || maxLeadershipScore !== undefined) {
      query.leadershipScore = {};
      if (minLeadershipScore !== undefined) query.leadershipScore.$gte = parseFloat(minLeadershipScore);
      if (maxLeadershipScore !== undefined) query.leadershipScore.$lte = parseFloat(maxLeadershipScore);
    }

    const candidates = await TalentSignal.find(query)
      .sort({ opportunityScore: -1, sourcingPriorityScore: -1 })
      .limit(parseInt(limit))
      .populate('candidateId', 'name email location currentTitle');

    return res.status(200).json({
      success: true,
      data: {
        query,
        candidates: candidates.map(signal => ({
          candidateId: signal.candidateId._id,
          name: signal.candidateId.name,
          email: signal.candidateId.email,
          location: signal.candidateId.location,
          currentTitle: signal.candidateId.currentTitle,
          scores: {
            opportunity: signal.opportunityScore,
            sourcingPriority: signal.sourcingPriorityScore,
            recruiterTargeting: signal.recruiterTargetingScore,
            talentMomentum: signal.talentMomentumScore,
            openToWork: signal.openToWorkScore,
            startupAffinity: signal.startupAffinityScore,
            leadership: signal.leadershipScore
          },
          lastUpdated: signal.lastUpdated,
          confidence: signal.getOverallConfidence()
        }))
      }
    });
  } catch (error) {
    console.error("Error searching candidates by signals:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search candidates by signals",
      error: error.message
    });
  }
};

export const getSignalInsights = async (req, res) => {
  try {
    const { category, candidateId } = req.query;
    
    let signals;
    
    if (candidateId) {
      const signal = await TalentSignal.findOne({ candidateId });
      if (!signal) {
        return res.status(404).json({
          success: false,
          message: "Talent signals not found for candidate"
        });
      }
      
      signals = category ? 
        signal.getInsightsByCategory(category) : 
        signal.predictionMetadata.aggregated?.insights || [];
    } else {
      // Get insights across all candidates
      const allSignals = await TalentSignal.find({
        'predictionMetadata.aggregated.insights': { $exists: true }
      });
      
      let allInsights = [];
      allSignals.forEach(signal => {
        const insights = signal.predictionMetadata.aggregated?.insights || [];
        if (category) {
          allInsights.push(...insights.filter(insight => insight.category === category));
        } else {
          allInsights.push(...insights);
        }
      });
      
      // Group insights by type and count occurrences
      const insightGroups = allInsights.reduce((acc, insight) => {
        const key = `${insight.type}_${insight.category}`;
        if (!acc[key]) {
          acc[key] = {
            type: insight.type,
            category: insight.category,
            count: 0,
            avgConfidence: 0,
            examples: []
          };
        }
        acc[key].count++;
        acc[key].avgConfidence += insight.confidence;
        if (acc[key].examples.length < 3) {
          acc[key].examples.push(insight.message);
        }
        return acc;
      }, {});
      
      // Calculate average confidence
      Object.values(insightGroups).forEach(group => {
        group.avgConfidence = group.avgConfidence / group.count;
      });
      
      signals = Object.values(insightGroups);
    }
    
    return res.status(200).json({
      success: true,
      data: {
        category,
        insights: signals
      }
    });
  } catch (error) {
    console.error("Error getting signal insights:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get signal insights",
      error: error.message
    });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { type, candidateId } = req.query;
    
    let recommendations;
    
    if (candidateId) {
      const signal = await TalentSignal.findOne({ candidateId });
      if (!signal) {
        return res.status(404).json({
          success: false,
          message: "Talent signals not found for candidate"
        });
      }
      
      recommendations = type ? 
        signal.getRecommendationsByType(type) : 
        signal.getActionableRecommendations();
    } else {
      // Get recommendations across all candidates
      const allSignals = await TalentSignal.find({
        'predictionMetadata.aggregated.recommendations': { $exists: true }
      });
      
      let allRecommendations = [];
      allSignals.forEach(signal => {
        const recs = signal.predictionMetadata.aggregated?.recommendations || [];
        if (type) {
          allRecommendations.push(...recs.filter(rec => rec.type === type));
        } else {
          allRecommendations.push(...recs);
        }
      });
      
      // Group recommendations by type and priority
      const recommendationGroups = allRecommendations.reduce((acc, rec) => {
        const key = `${rec.type}_${rec.priority}`;
        if (!acc[key]) {
          acc[key] = {
            type: rec.type,
            priority: rec.priority,
            count: 0,
            actions: []
          };
        }
        acc[key].count++;
        if (!acc[key].actions.includes(rec.action)) {
          acc[key].actions.push(rec.action);
        }
        return acc;
      }, {});
      
      recommendations = Object.values(recommendationGroups);
    }
    
    return res.status(200).json({
      success: true,
      data: {
        type,
        recommendations
      }
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
      error: error.message
    });
  }
};
