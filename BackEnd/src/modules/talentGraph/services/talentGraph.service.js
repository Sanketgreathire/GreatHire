import { enqueueGraphJob } from "./graphQueue.service.js";
import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

// export async function getCandidateGraph(candidateId, options = {}) {
//   try {
//     const { depth = 2, includeScores = true } = options;
    
//     const graphData = await getTalentGraphRecord(candidateId, 'candidate', depth);
    
//     if (!graphData) {
//       return buildCandidateGraph(candidateId, depth, includeScores);
//     }
    
//     if (includeScores) {
//       graphData.nodes = await calculateNodeScores(graphData.nodes);
//       graphData.edges = await calculateEdgeScores(graphData.edges);
//     }
    
//     return graphData;
//   } catch (error) {
//     console.error("Error in getCandidateGraph:", error);
//     throw new Error(`Failed to get candidate graph: ${error.message}`);
//   }
// }

// export async function getCompanyGraph(company, options = {}) {
//   try {
//     const { depth = 2, includeMovement = true } = options;
    
//     const graphData = await getTalentGraphRecord(company, 'company', depth);
    
//     if (!graphData) {
//       return buildCompanyGraph(company, depth, includeMovement);
//     }
    
//     if (includeMovement) {
//       graphData.movementData = await getCompanyMovementData(company);
//     }
    
//     return graphData;
//   } catch (error) {
//     console.error("Error in getCompanyGraph:", error);
//     throw new Error(`Failed to get company graph: ${error.message}`);
//   }
// }



export async function getGraphInsights(type = 'overview', timeRange = '30d') {
  try {
    const insights = {
      overview: await getOverviewInsights(timeRange),
      movement: await getMovementInsights(timeRange),
      skills: await getSkillInsights(timeRange),
      companies: await getCompanyInsights(timeRange),
      networks: await getNetworkInsights(timeRange)
    };
    
    return insights[type] || insights.overview;
  } catch (error) {
    console.error("Error in getGraphInsights:", error);
    throw new Error(`Failed to get graph insights: ${error.message}`);
  }
}

export async function getGraphStats(timeRange = '30d') {
  try {
    const stats = {
      nodeCounts: await getNodeCounts(timeRange),
      edgeCounts: await getEdgeCounts(timeRange),
      graphMetrics: await getGraphMetrics(timeRange),
      growthTrends: await getGrowthTrends(timeRange),
      topPerformers: await getTopPerformers(timeRange)
    };
    
    return stats;
  } catch (error) {
    console.error("Error in getGraphStats:", error);
    throw new Error(`Failed to get graph stats: ${error.message}`);
  }
}

export async function buildTalentGraph(options = {}) {
  try {
    const { force = false, updateType = 'full' } = options;
    
    const buildJob = {
      updateType,
      force,
      timestamp: new Date()
    };
    
    const jobId = await enqueueGraphJob('build-graph', buildJob);
    
    return {
      success: true,
      jobId,
      message: "Talent graph build initiated",
      updateType,
      force
    };
  } catch (error) {
    console.error("Error in buildTalentGraph:", error);
    throw new Error(`Failed to build talent graph: ${error.message}`);
  }
}

export async function searchTalentGraph(searchOptions = {}) {
  try {
    const { query, nodeType = 'candidate', maxResults = 20, includeMetadata = true } = searchOptions;
    
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    if (aiAvailable) {
      return await searchWithAI(query, nodeType, maxResults, includeMetadata);
    } else {
      return await searchWithRules(query, nodeType, maxResults, includeMetadata);
    }
  } catch (error) {
    console.error("Error in searchTalentGraph:", error);
    throw new Error(`Failed to search talent graph: ${error.message}`);
  }
}

async function buildCandidateGraph(candidateId, depth, includeScores) {
  try {
    const candidateData = await getCandidateData(candidateId);
    
    const graph = {
      id: candidateId,
      type: 'candidate',
      nodes: [],
      edges: [],
      metadata: {
        depth,
        builtAt: new Date(),
        nodeCount: 0,
        edgeCount: 0
      }
    };
    
    const centralNode = {
      id: candidateId,
      type: 'candidate',
      data: candidateData,
      score: includeScores ? await calculateCandidateScore(candidateData) : 0
    };
    
    graph.nodes.push(centralNode);
    
    const relatedNodes = await findRelatedNodes(candidateId, depth);
    graph.nodes.push(...relatedNodes);
    
    const edges = await buildEdges(candidateId, relatedNodes);
    graph.edges.push(...edges);
    
    graph.metadata.nodeCount = graph.nodes.length;
    graph.metadata.edgeCount = graph.edges.length;
    
    await saveTalentGraph(graph);
    
    return graph;
  } catch (error) {
    console.error("Error building candidate graph:", error);
    throw error;
  }
}

async function buildCompanyGraph(company, depth, includeMovement) {
  try {
    const companyData = await getCompanyData(company);
    
    const graph = {
      id: company,
      type: 'company',
      nodes: [],
      edges: [],
      metadata: {
        depth,
        builtAt: new Date(),
        nodeCount: 0,
        edgeCount: 0
      }
    };
    
    const centralNode = {
      id: company,
      type: 'company',
      data: companyData,
      score: await calculateCompanyScore(companyData)
    };
    
    graph.nodes.push(centralNode);
    
    const relatedNodes = await findCompanyRelatedNodes(company, depth);
    graph.nodes.push(...relatedNodes);
    
    const edges = await buildCompanyEdges(company, relatedNodes);
    graph.edges.push(...edges);
    
    if (includeMovement) {
      graph.movementData = await getCompanyMovementData(company);
    }
    
    graph.metadata.nodeCount = graph.nodes.length;
    graph.metadata.edgeCount = graph.edges.length;
    
    await saveTalentGraph(graph);
    
    return graph;
  } catch (error) {
    console.error("Error building company graph:", error);
    throw error;
  }
}

async function buildSkillGraph(skill, depth, includeClusters) {
  try {
    const skillData = await getSkillData(skill);
    
    const graph = {
      id: skill,
      type: 'skill',
      nodes: [],
      edges: [],
      metadata: {
        depth,
        builtAt: new Date(),
        nodeCount: 0,
        edgeCount: 0
      }
    };
    
    const centralNode = {
      id: skill,
      type: 'skill',
      data: skillData,
      score: await calculateSkillScore(skillData)
    };
    
    graph.nodes.push(centralNode);
    
    const relatedNodes = await findSkillRelatedNodes(skill, depth);
    graph.nodes.push(...relatedNodes);
    
    const edges = await buildSkillEdges(skill, relatedNodes);
    graph.edges.push(...edges);
    
    if (includeClusters) {
      graph.clusters = await getSkillClusters(skill);
    }
    
    graph.metadata.nodeCount = graph.nodes.length;
    graph.metadata.edgeCount = graph.edges.length;
    
    await saveTalentGraph(graph);
    
    return graph;
  } catch (error) {
    console.error("Error building skill graph:", error);
    throw error;
  }
}

async function findRelatedNodes(candidateId, depth) {
  try {
    const nodes = [];
    const visited = new Set([candidateId]);
    
    for (let currentDepth = 1; currentDepth <= depth; currentDepth++) {
      const depthNodes = await getNodesAtDepth(candidateId, currentDepth, visited);
      
      depthNodes.forEach(node => {
        if (!visited.has(node.id)) {
          nodes.push(node);
          visited.add(node.id);
        }
      });
    }
    
    return nodes;
  } catch (error) {
    console.error("Error finding related nodes:", error);
    return [];
  }
}

async function buildEdges(centralId, relatedNodes) {
  try {
    const edges = [];
    
    for (const node of relatedNodes) {
      const edge = await createEdge(centralId, node.id, node.type);
      if (edge) {
        edges.push(edge);
      }
    }
    
    return edges;
  } catch (error) {
    console.error("Error building edges:", error);
    return [];
  }
}

async function createEdge(fromId, toId, toType) {
  try {
    const strength = await calculateEdgeStrength(fromId, toId, toType);
    
    return {
      id: `${fromId}-${toId}`,
      from: fromId,
      to: toId,
      type: determineEdgeType(toType),
      strength,
      metadata: {
        createdAt: new Date(),
        lastUpdated: new Date()
      }
    };
  } catch (error) {
    console.error("Error creating edge:", error);
    return null;
  }
}

function determineEdgeType(nodeType) {
  const edgeTypes = {
    'candidate': 'knows',
    'company': 'works_at',
    'skill': 'has_skill',
    'industry': 'in_industry',
    'recruiter': 'recruited_by'
  };
  
  return edgeTypes[nodeType] || 'related_to';
}

async function calculateEdgeStrength(fromId, toId, toType) {
  try {
    const baseStrength = 0.5;
    
    switch (toType) {
      case 'candidate':
        return await calculateCandidateEdgeStrength(fromId, toId);
      case 'company':
        return await calculateCompanyEdgeStrength(fromId, toId);
      case 'skill':
        return await calculateSkillEdgeStrength(fromId, toId);
      default:
        return baseStrength;
    }
  } catch (error) {
    console.error("Error calculating edge strength:", error);
    return 0.5;
  }
}

async function calculateCandidateEdgeStrength(fromId, toId) {
  try {
    const fromData = await getCandidateData(fromId);
    const toData = await getCandidateData(toId);
    
    let strength = 0;
    
    if (fromData.currentCompany === toData.currentCompany) {
      strength += 0.3;
    }
    
    if (fromData.location === toData.location) {
      strength += 0.2;
    }
    
    const commonSkills = getCommonSkills(fromData.skills || [], toData.skills || []);
    strength += Math.min(commonSkills.length * 0.1, 0.3);
    
    if (fromData.education && toData.education) {
      if (fromData.education.school === toData.education.school) {
        strength += 0.2;
      }
    }
    
    return Math.min(strength, 1.0);
  } catch (error) {
    console.error("Error calculating candidate edge strength:", error);
    return 0.5;
  }
}

async function calculateCompanyEdgeStrength(fromId, toId) {
  try {
    const fromData = await getCandidateData(fromId);
    const toData = await getCompanyData(toId);
    
    let strength = 0;
    
    if (fromData.currentCompany === toId) {
      strength = 1.0;
    } else if (fromData.experience) {
      const workedAtCompany = fromData.experience.some(exp => exp.company === toId);
      if (workedAtCompany) {
        strength = 0.8;
      }
    }
    
    return strength;
  } catch (error) {
    console.error("Error calculating company edge strength:", error);
    return 0.5;
  }
}

async function calculateSkillEdgeStrength(fromId, toId) {
  try {
    const fromData = await getCandidateData(fromId);
    
    if (fromData.skills && fromData.skills.includes(toId)) {
      return 1.0;
    }
    
    if (fromData.experience) {
      const skillInExperience = fromData.experience.some(exp => 
        exp.skills && exp.skills.includes(toId)
      );
      if (skillInExperience) {
        return 0.7;
      }
    }
    
    return 0.3;
  } catch (error) {
    console.error("Error calculating skill edge strength:", error);
    return 0.5;
  }
}

async function calculateNodeScores(nodes) {
  try {
    const scoredNodes = await Promise.all(
      nodes.map(async (node) => {
        const score = await calculateNodeScore(node);
        return { ...node, score };
      })
    );
    
    return scoredNodes;
  } catch (error) {
    console.error("Error calculating node scores:", error);
    return nodes;
  }
}

async function calculateNodeScore(node) {
  try {
    switch (node.type) {
      case 'candidate':
        return await calculateCandidateScore(node.data);
      case 'company':
        return await calculateCompanyScore(node.data);
      case 'skill':
        return await calculateSkillScore(node.data);
      default:
        return 0.5;
    }
  } catch (error) {
    console.error("Error calculating node score:", error);
    return 0.5;
  }
}

async function calculateCandidateScore(candidateData) {
  try {
    let score = 0;
    
    if (candidateData.skills && candidateData.skills.length > 0) {
      score += Math.min(candidateData.skills.length * 0.05, 0.3);
    }
    
    if (candidateData.totalExperience) {
      score += Math.min(candidateData.totalExperience * 0.02, 0.2);
    }
    
    if (candidateData.currentCompany) {
      score += 0.1;
    }
    
    if (candidateData.education) {
      score += 0.1;
    }
    
    if (candidateData.enrichmentMetadata) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating candidate score:", error);
    return 0.5;
  }
}

async function calculateCompanyScore(companyData) {
  try {
    let score = 0;
    
    if (companyData.employeeCount) {
      score += Math.min(companyData.employeeCount / 10000, 0.3);
    }
    
    if (companyData.industry) {
      score += 0.2;
    }
    
    if (companyData.founded) {
      const age = new Date().getFullYear() - companyData.founded;
      score += Math.min(age / 50, 0.2);
    }
    
    if (companyData.funding) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating company score:", error);
    return 0.5;
  }
}

async function calculateSkillScore(skillData) {
  try {
    let score = 0;
    
    if (skillData.demand) {
      score += Math.min(skillData.demand / 100, 0.4);
    }
    
    if (skillData.growth) {
      score += Math.min(skillData.growth / 100, 0.3);
    }
    
    if (skillData.salary) {
      score += Math.min(skillData.salary / 200000, 0.3);
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating skill score:", error);
    return 0.5;
  }
}

async function calculateEdgeScores(edges) {
  try {
    const scoredEdges = await Promise.all(
      edges.map(async (edge) => {
        const score = await calculateEdgeScore(edge);
        return { ...edge, score };
      })
    );
    
    return scoredEdges;
  } catch (error) {
    console.error("Error calculating edge scores:", error);
    return edges;
  }
}

async function calculateEdgeScore(edge) {
  try {
    return edge.strength || 0.5;
  } catch (error) {
    console.error("Error calculating edge score:", error);
    return 0.5;
  }
}

async function searchWithAI(query, nodeType, maxResults, includeMetadata) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const response = await axios.default.post(
      `${AI_BASE_URL}/graph/search`,
      {
        query,
        nodeType,
        maxResults,
        includeMetadata
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 10000
      }
    );

    return response.data.results || [];
  } catch (error) {
    console.warn("AI graph search failed, using rules:", error.message);
    return await searchWithRules(query, nodeType, maxResults, includeMetadata);
  }
}

async function searchWithRules(query, nodeType, maxResults, includeMetadata) {
  try {
    const results = [];
    
    switch (nodeType) {
      case 'candidate':
        return await searchCandidates(query, maxResults, includeMetadata);
      case 'company':
        return await searchCompanies(query, maxResults, includeMetadata);
      case 'skill':
        return await searchSkills(query, maxResults, includeMetadata);
      default:
        return results;
    }
  } catch (error) {
    console.error("Error in rule-based search:", error);
    return [];
  }
}

async function searchCandidates(query, maxResults, includeMetadata) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const searchRegex = new RegExp(query, 'i');
    
    const candidates = await SourcingCandidate.default.find({
      $or: [
        { fullName: searchRegex },
        { headline: searchRegex },
        { bio: searchRegex },
        { skills: searchRegex },
        { currentCompany: searchRegex },
        { location: searchRegex }
      ]
    }).limit(maxResults).lean();
    
    return candidates.map(candidate => ({
      id: candidate._id.toString(),
      type: 'candidate',
      data: candidate,
      score: calculateSearchScore(candidate, query),
      metadata: includeMetadata ? {
        skills: candidate.skills,
        experience: candidate.totalExperience,
        company: candidate.currentCompany
      } : null
    }));
  } catch (error) {
    console.error("Error searching candidates:", error);
    return [];
  }
}

async function searchCompanies(query, maxResults, includeMetadata) {
  try {
    const candidates = await searchCandidates(query, maxResults * 2, true);
    const companyCounts = {};
    
    candidates.forEach(candidate => {
      const company = candidate.data.currentCompany;
      if (company && company.toLowerCase().includes(query.toLowerCase())) {
        companyCounts[company] = (companyCounts[company] || 0) + 1;
      }
    });
    
    const results = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxResults)
      .map(([company, count]) => ({
        id: company,
        type: 'company',
        data: { name: company, candidateCount: count },
        score: count / candidates.length,
        metadata: includeMetadata ? { candidateCount: count } : null
      }));
    
    return results;
  } catch (error) {
    console.error("Error searching companies:", error);
    return [];
  }
}

async function searchSkills(query, maxResults, includeMetadata) {
  try {
    const candidates = await searchCandidates(query, maxResults * 2, true);
    const skillCounts = {};
    
    candidates.forEach(candidate => {
      const skills = candidate.data.skills || [];
      skills.forEach(skill => {
        if (skill.toLowerCase().includes(query.toLowerCase())) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        }
      });
    });
    
    const results = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxResults)
      .map(([skill, count]) => ({
        id: skill,
        type: 'skill',
        data: { name: skill, candidateCount: count },
        score: count / candidates.length,
        metadata: includeMetadata ? { candidateCount: count, demand: 'high' } : null
      }));
    
    return results;
  } catch (error) {
    console.error("Error searching skills:", error);
    return [];
  }
}

function calculateSearchScore(candidate, query) {
  try {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    if (candidate.fullName && candidate.fullName.toLowerCase().includes(queryLower)) {
      score += 0.4;
    }
    
    if (candidate.headline && candidate.headline.toLowerCase().includes(queryLower)) {
      score += 0.3;
    }
    
    if (candidate.skills && candidate.skills.some(skill => skill.toLowerCase().includes(queryLower))) {
      score += 0.2;
    }
    
    if (candidate.currentCompany && candidate.currentCompany.toLowerCase().includes(queryLower)) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating search score:", error);
    return 0.5;
  }
}

function getCommonSkills(skills1, skills2) {
  try {
    const set1 = new Set(skills1.map(s => s.toLowerCase()));
    const set2 = new Set(skills2.map(s => s.toLowerCase()));
    return [...set1].filter(skill => set2.has(skill));
  } catch (error) {
    console.error("Error getting common skills:", error);
    return [];
  }
}

async function getCandidateData(candidateId) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    const candidate = await SourcingCandidate.default.findById(candidateId).lean();
    return candidate || {};
  } catch (error) {
    console.error("Error getting candidate data:", error);
    return {};
  }
}

async function getCompanyData(company) {
  try {
    return { name: company, type: 'company' };
  } catch (error) {
    console.error("Error getting company data:", error);
    return {};
  }
}

async function getSkillData(skill) {
  try {
    return { name: skill, type: 'skill' };
  } catch (error) {
    console.error("Error getting skill data:", error);
    return {};
  }
}

async function getNodesAtDepth(candidateId, depth, visited) {
  try {
    return [];
  } catch (error) {
    console.error("Error getting nodes at depth:", error);
    return [];
  }
}

async function findCompanyRelatedNodes(company, depth) {
  try {
    return [];
  } catch (error) {
    console.error("Error finding company related nodes:", error);
    return [];
  }
}

async function buildCompanyEdges(company, relatedNodes) {
  try {
    return [];
  } catch (error) {
    console.error("Error building company edges:", error);
    return [];
  }
}

async function findSkillRelatedNodes(skill, depth) {
  try {
    return [];
  } catch (error) {
    console.error("Error finding skill related nodes:", error);
    return [];
  }
}

async function buildSkillEdges(skill, relatedNodes) {
  try {
    return [];
  } catch (error) {
    console.error("Error building skill edges:", error);
    return [];
  }
}

async function getSkillClusters(skill) {
  try {
    return [];
  } catch (error) {
    console.error("Error getting skill clusters:", error);
    return [];
  }
}

async function getCompanyMovementData(company) {
  try {
    return [];
  } catch (error) {
    console.error("Error getting company movement data:", error);
    return [];
  }
}

async function getOverviewInsights(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting overview insights:", error);
    return {};
  }
}

async function getMovementInsights(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting movement insights:", error);
    return {};
  }
}

async function getSkillInsights(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting skill insights:", error);
    return {};
  }
}

async function getCompanyInsights(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting company insights:", error);
    return {};
  }
}

async function getNetworkInsights(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting network insights:", error);
    return {};
  }
}

async function getNodeCounts(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting node counts:", error);
    return {};
  }
}

async function getEdgeCounts(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting edge counts:", error);
    return {};
  }
}

async function getGraphMetrics(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting graph metrics:", error);
    return {};
  }
}

async function getGrowthTrends(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting growth trends:", error);
    return {};
  }
}

async function getTopPerformers(timeRange) {
  try {
    return {};
  } catch (error) {
    console.error("Error getting top performers:", error);
    return {};
  }
}

async function saveTalentGraph(graph) {
  try {
    const TalentGraph = await import("../../models/talentGraph.model.js");
    
    const existingGraph = await TalentGraph.default.findOne({
      id: graph.id,
      type: graph.type
    });
    
    if (existingGraph) {
      await TalentGraph.default.updateOne(
        { id: graph.id, type: graph.type },
        { $set: graph }
      );
    } else {
      await TalentGraph.default.create(graph);
    }
  } catch (error) {
    console.error("Error saving talent graph:", error);
  }
}
