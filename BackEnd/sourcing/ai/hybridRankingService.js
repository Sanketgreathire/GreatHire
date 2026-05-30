/**
 * hybridRankingService.js
 * Combines MongoDB text score (keyword) + Qdrant cosine score (semantic)
 * into a single weighted hybrid score.
 */
import { SourcingCandidate } from "../../models/sourcing/sourcingCandidate.model.js";
import { semanticSearch, isAiServiceAvailable } from "./aiServiceClient.js";

// Helper function to get adaptive ranking score
async function getAdaptiveRankingScore(candidateId, recruiterId, query, filters) {
  try {
    // Import the adaptive ranking service
    const { getAdaptiveRanking } = await import("../../modules/learning/services/adaptiveRanking.service.js");
    
    const result = await getAdaptiveRanking(recruiterId, {
      candidateIds: [candidateId],
      context: { query, filters },
      rankingType: 'hybrid'
    });
    
    if (result.success && result.rankedCandidates.length > 0) {
      return result.rankedCandidates[0].rankingScore.totalScore / 100; // Normalize to 0-1
    }
    
    return 0;
  } catch (error) {
    console.error("Error getting adaptive ranking score:", error);
    return 0;
  }
}

// Helper function to get graph intelligence score
async function getGraphIntelligenceScore(candidateId, recruiterId, query, filters) {
  try {
    // Import the talent graph service
    const { getCandidateGraph } = await import("../../modules/talentGraph/services/talentGraph.service.js");
    
    const graphData = await getCandidateGraph(candidateId, {
      depth: 2,
      includeScores: true
    });
    
    if (graphData && graphData.nodes && graphData.nodes.length > 0) {
      // Calculate graph influence score
      const candidateNode = graphData.nodes.find(node => node.id === candidateId);
      if (candidateNode && candidateNode.score) {
        return candidateNode.score;
      }
      
      // Fallback to network influence calculation
      const networkSize = graphData.nodes.length;
      const edgeCount = graphData.edges ? graphData.edges.length : 0;
      const networkDensity = networkSize > 1 ? edgeCount / (networkSize * (networkSize - 1) / 2) : 0;
      
      // Graph score based on network metrics
      const graphScore = Math.min((networkSize / 50) * 0.3 + networkDensity * 0.4 + 0.3, 1.0);
      return graphScore;
    }
    
    return 0;
  } catch (error) {
    console.error("Error getting graph intelligence score:", error);
    return 0;
  }
}

const SEMANTIC_WEIGHT = 0.65;
const KEYWORD_WEIGHT  = 0.35;

export async function hybridSearch(query, recruiterId, opts = {}) {
  const { topK = 20, scoreThreshold = 0.25, filters = {} } = opts;
  const timings = {};
  const aiAvailable = await isAiServiceAvailable();

  // ── 1. Semantic search ────────────────────────────────────────────────────
  let semanticResults = [];
  if (aiAvailable) {
    try {
      const t0  = Date.now();
      const res = await semanticSearch({
        query, recruiterId,
        topK: topK * 2,
        scoreThreshold,
        filters: filters.sourceType ? { source_type: filters.sourceType } : null,
      });
      semanticResults    = res.results || [];
      timings.semantic_ms = Date.now() - t0;
    } catch (err) {
      console.warn("Semantic search failed, using keyword only:", err.message);
    }
  }

  // ── 2. Keyword search (MongoDB $text) ─────────────────────────────────────
  const t1 = Date.now();
  const mongoQuery = { createdBy: recruiterId };

  if (query.trim())        mongoQuery.$text        = { $search: query };
  if (filters.location)    mongoQuery.location     = { $regex: filters.location,    $options: "i" };
  if (filters.designation) mongoQuery.designation  = { $regex: filters.designation, $options: "i" };
  if (filters.minExp !== undefined) mongoQuery.totalExperience = { $gte: parseFloat(filters.minExp) };
  if (filters.maxExp !== undefined) {
    mongoQuery.totalExperience = { ...(mongoQuery.totalExperience || {}), $lte: parseFloat(filters.maxExp) };
  }
  if (filters.skills?.length) {
    mongoQuery.skills = { $all: filters.skills.map((s) => new RegExp(s, "i")) };
  }

  const projection = query.trim() ? { score: { $meta: "textScore" } } : {};
  const sort       = query.trim() ? { score: { $meta: "textScore" } } : { createdAt: -1 };

  const keywordDocs = await SourcingCandidate.find(mongoQuery, projection)
    .select("-parsedText")
    .sort(sort)
    .limit(topK * 2)
    .lean();

  timings.keyword_ms = Date.now() - t1;

  // ── 3. Merge + re-rank ────────────────────────────────────────────────────
  const t2 = Date.now();

  const semanticMap = new Map(semanticResults.map((r) => [r.candidate_id, r.score]));
  const keywordMap  = new Map(keywordDocs.map((d) => [d._id.toString(), d.score || 0]));
  const maxKw       = Math.max(...keywordDocs.map((d) => d.score || 0), 1);

  // Fetch docs for semantic-only IDs
  const semanticOnlyIds = semanticResults
    .map((r) => r.candidate_id)
    .filter((id) => !keywordMap.has(id));

  let extraDocs = [];
  if (semanticOnlyIds.length) {
    extraDocs = await SourcingCandidate.find({
      _id: { $in: semanticOnlyIds }, createdBy: recruiterId,
    }).select("-parsedText").lean();
  }

  const docMap = new Map([
    ...keywordDocs.map((d) => [d._id.toString(), d]),
    ...extraDocs.map((d)   => [d._id.toString(), d]),
  ]);

  const allIds = new Set([...keywordMap.keys(), ...semanticMap.keys()]);
  const scored = [];

  for (const id of allIds) {
    const doc = docMap.get(id);
    if (!doc) continue;

    const semScore = semanticMap.get(id) || 0;
    const kwScore  = (keywordMap.get(id) || 0) / maxKw;
    
    // Apply adaptive ranking if recruiterId is provided
    let adaptiveScore = 0;
    if (recruiterId) {
      adaptiveScore = await getAdaptiveRankingScore(id, recruiterId, query, filters);
    }
    
    // Apply graph intelligence scoring
    let graphScore = 0;
    if (recruiterId) {
      graphScore = await getGraphIntelligenceScore(id, recruiterId, query, filters);
    }
    
    const baseHybrid = aiAvailable
      ? (SEMANTIC_WEIGHT * semScore) + (KEYWORD_WEIGHT * kwScore)
      : kwScore;
    
    // Combine all scores: 60% base, 20% adaptive, 20% graph
    let hybrid = baseHybrid;
    if (adaptiveScore > 0 && graphScore > 0) {
      hybrid = (baseHybrid * 0.6) + (adaptiveScore * 0.2) + (graphScore * 0.2);
    } else if (adaptiveScore > 0) {
      hybrid = (baseHybrid * 0.7) + (adaptiveScore * 0.3);
    } else if (graphScore > 0) {
      hybrid = (baseHybrid * 0.8) + (graphScore * 0.2);
    }

    scored.push({
      ...doc,
      _scores: {
        hybrid:   +hybrid.toFixed(4),
        semantic: +semScore.toFixed(4),
        keyword:  +kwScore.toFixed(4),
        adaptive: +adaptiveScore.toFixed(4),
        graph:    +graphScore.toFixed(4),
      },
    });
  }

  scored.sort((a, b) => b._scores.hybrid - a._scores.hybrid);
  timings.merge_ms = Date.now() - t2;
  timings.total_ms = (timings.semantic_ms || 0) + timings.keyword_ms + timings.merge_ms;

  return {
    results: scored.slice(0, topK),
    mode:    aiAvailable ? "hybrid" : "keyword",
    total:   Math.min(scored.length, topK),
    timings,
  };
}
