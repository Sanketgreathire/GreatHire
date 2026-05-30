import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

export async function getTalentNetwork(recruiterId, options = {}) {
  try {
    const { depth = 3, includeStrength = true } = options;
    
    const networkData = await buildTalentNetwork(recruiterId, depth);
    
    if (includeStrength) {
      networkData.relationshipStrength = await calculateRelationshipStrength(networkData);
    }
    
    return {
      recruiterId,
      networkData,
      insights: generateNetworkInsights(networkData),
      recommendations: generateNetworkRecommendations(networkData)
    };
  } catch (error) {
    console.error("Error in getTalentNetwork:", error);
    throw new Error(`Failed to get talent network: ${error.message}`);
  }
}

export async function detectConnectedCandidates(candidateId, options = {}) {
  try {
    const { maxDepth = 2, minStrength = 0.3 } = options;
    
    const connections = await findCandidateConnections(candidateId, maxDepth, minStrength);
    
    return {
      candidateId,
      connections,
      networkMetrics: calculateNetworkMetrics(connections),
      clusters: identifyConnectionClusters(connections),
      influence: calculateCandidateInfluence(connections)
    };
  } catch (error) {
    console.error("Error in detectConnectedCandidates:", error);
    throw new Error(`Failed to detect connected candidates: ${error.message}`);
  }
}

export async function analyzeSharedCompanyBackgrounds(company, options = {}) {
  try {
    const { timeRange = '5y', includeDepartures = true } = options;
    
    const companyNetwork = await buildCompanyNetwork(company, timeRange, includeDepartures);
    
    return {
      company,
      network: companyNetwork,
      alumniNetwork: analyzeAlumniNetwork(companyNetwork),
      movementPatterns: analyzeCompanyMovementPatterns(companyNetwork),
      talentPools: identifyCompanyTalentPools(companyNetwork)
    };
  } catch (error) {
    console.error("Error in analyzeSharedCompanyBackgrounds:", error);
    throw new Error(`Failed to analyze shared company backgrounds: ${error.message}`);
  }
}

export async function findSimilarTechnicalPaths(skillSet, options = {}) {
  try {
    const { similarity = 0.7, maxResults = 20 } = options;
    
    const similarPaths = await findSimilarCareerPaths(skillSet, similarity, maxResults);
    
    return {
      skillSet,
      similarPaths,
      progressionPatterns: analyzeProgressionPatterns(similarPaths),
      skillEvolution: analyzeSkillEvolution(similarPaths),
      recommendations: generatePathRecommendations(similarPaths)
    };
  } catch (error) {
    console.error("Error in findSimilarTechnicalPaths:", error);
    throw new Error(`Failed to find similar technical paths: ${error.message}`);
  }
}

export async function identifyRecruiterHiringClusters(recruiterId, options = {}) {
  try {
    const { timeRange = '2y', minClusterSize = 3 } = options;
    
    const hiringData = await getRecruiterHiringData(recruiterId, timeRange);
    const clusters = identifyHiringClusters(hiringData, minClusterSize);
    
    return {
      recruiterId,
      clusters,
      patterns: analyzeHiringPatterns(clusters),
      successMetrics: calculateClusterSuccessMetrics(clusters),
      recommendations: generateClusterRecommendations(clusters)
    };
  } catch (error) {
    console.error("Error in identifyRecruiterHiringClusters:", error);
    throw new Error(`Failed to identify recruiter hiring clusters: ${error.message}`);
  }
}

export async function buildInfluenceGraph(nodeType, options = {}) {
  try {
    const { maxNodes = 100, includeWeights = true } = options;
    
    const graph = await constructInfluenceGraph(nodeType, maxNodes);
    
    if (includeWeights) {
      graph.weights = await calculateInfluenceWeights(graph);
    }
    
    return {
      nodeType,
      graph,
      centrality: calculateGraphCentrality(graph),
      communities: detectGraphCommunities(graph),
      influence: calculateNodeInfluence(graph)
    };
  } catch (error) {
    console.error("Error in buildInfluenceGraph:", error);
    throw new Error(`Failed to build influence graph: ${error.message}`);
  }
}

export async function analyzeNetworkResilience(networkId, options = {}) {
  try {
    const { scenario = 'node_removal', tolerance = 0.8 } = options;
    
    const network = await getNetworkData(networkId);
    const resilience = calculateNetworkResilience(network, scenario, tolerance);
    
    return {
      networkId,
      resilience,
      vulnerabilities: identifyNetworkVulnerabilities(network),
      recommendations: generateResilienceRecommendations(resilience)
    };
  } catch (error) {
    console.error("Error in analyzeNetworkResilience:", error);
    throw new Error(`Failed to analyze network resilience: ${error.message}`);
  }
}

async function buildTalentNetwork(recruiterId, depth) {
  try {
    const network = {
      nodes: [],
      edges: [],
      metadata: {
        depth,
        nodeCount: 0,
        edgeCount: 0,
        builtAt: new Date()
      }
    };
    
    const recruiterNode = await getRecruiterNode(recruiterId);
    network.nodes.push(recruiterNode);
    
    const connectedNodes = await findConnectedNodes(recruiterId, depth);
    network.nodes.push(...connectedNodes);
    
    const edges = await buildNetworkEdges(recruiterId, connectedNodes);
    network.edges.push(...edges);
    
    network.metadata.nodeCount = network.nodes.length;
    network.metadata.edgeCount = network.edges.length;
    
    return network;
  } catch (error) {
    console.error("Error building talent network:", error);
    return { nodes: [], edges: [], metadata: {} };
  }
}

async function findCandidateConnections(candidateId, maxDepth, minStrength) {
  try {
    const connections = [];
    const visited = new Set([candidateId]);
    
    for (let currentDepth = 1; currentDepth <= maxDepth; currentDepth++) {
      const depthConnections = await getConnectionsAtDepth(candidateId, currentDepth, visited, minStrength);
      
      depthConnections.forEach(connection => {
        if (!visited.has(connection.targetId)) {
          connections.push(connection);
          visited.add(connection.targetId);
        }
      });
    }
    
    return connections;
  } catch (error) {
    console.error("Error finding candidate connections:", error);
    return [];
  }
}

async function buildCompanyNetwork(company, timeRange, includeDepartures) {
  try {
    const network = {
      company,
      nodes: [],
      edges: [],
      alumni: [],
      current: [],
      metadata: {
        timeRange,
        includeDepartures,
        builtAt: new Date()
      }
    };
    
    const companyCandidates = await getCompanyCandidates(company, timeRange);
    
    companyCandidates.forEach(candidate => {
      const node = {
        id: candidate._id.toString(),
        type: 'candidate',
        data: candidate,
        status: candidate.currentCompany === company ? 'current' : 'alumni',
        startDate: candidate.startDate,
        endDate: candidate.endDate
      };
      
      network.nodes.push(node);
      
      if (node.status === 'current') {
        network.current.push(node);
      } else {
        network.alumni.push(node);
      }
    });
    
    const edges = await buildCompanyEdges(network.nodes);
    network.edges.push(...edges);
    
    return network;
  } catch (error) {
    console.error("Error building company network:", error);
    return { company, nodes: [], edges: [], alumni: [], current: [] };
  }
}

async function findSimilarCareerPaths(skillSet, similarity, maxResults) {
  try {
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    if (aiAvailable) {
      return await findSimilarPathsWithAI(skillSet, similarity, maxResults);
    } else {
      return await findSimilarPathsWithRules(skillSet, similarity, maxResults);
    }
  } catch (error) {
    console.error("Error finding similar career paths:", error);
    return [];
  }
}

async function getRecruiterHiringData(recruiterId, timeRange) {
  try {
    const hiringData = await getRecruiterInteractions(recruiterId, timeRange);
    
    return {
      recruiterId,
      interactions: hiringData,
      timeRange,
      totalHires: hiringData.filter(i => i.action === 'hired').length
    };
  } catch (error) {
    console.error("Error getting recruiter hiring data:", error);
    return { recruiterId, interactions: [], timeRange, totalHires: 0 };
  }
}

async function constructInfluenceGraph(nodeType, maxNodes) {
  try {
    const graph = {
      nodes: [],
      edges: [],
      metadata: {
        nodeType,
        maxNodes,
        builtAt: new Date()
      }
    };
    
    const nodes = await getInfluenceNodes(nodeType, maxNodes);
    graph.nodes.push(...nodes);
    
    const edges = await buildInfluenceEdges(nodes);
    graph.edges.push(...edges);
    
    return graph;
  } catch (error) {
    console.error("Error constructing influence graph:", error);
    return { nodes: [], edges: [], metadata: {} };
  }
}

async function calculateRelationshipStrength(networkData) {
  try {
    const strengths = {};
    
    networkData.edges.forEach(edge => {
      const key = `${edge.source}-${edge.target}`;
      strengths[key] = calculateEdgeStrength(edge);
    });
    
    return strengths;
  } catch (error) {
    console.error("Error calculating relationship strength:", error);
    return {};
  }
}

function calculateEdgeStrength(edge) {
  try {
    let strength = 0.5;
    
    if (edge.type === 'hired') strength += 0.3;
    if (edge.type === 'contacted') strength += 0.2;
    if (edge.type === 'shortlisted') strength += 0.1;
    
    if (edge.frequency) {
      strength += Math.min(edge.frequency / 10, 0.3);
    }
    
    return Math.min(strength, 1.0);
  } catch (error) {
    console.error("Error calculating edge strength:", error);
    return 0.5;
  }
}

function generateNetworkInsights(networkData) {
  try {
    const insights = {
      networkSize: networkData.nodes.length,
      connectivity: calculateConnectivity(networkData),
      clusters: identifyNetworkClusters(networkData),
      keyNodes: identifyKeyNodes(networkData),
      density: calculateNetworkDensity(networkData)
    };
    
    return insights;
  } catch (error) {
    console.error("Error generating network insights:", error);
    return {};
  }
}

function generateNetworkRecommendations(networkData) {
  try {
    const recommendations = [];
    
    if (networkData.nodes.length < 50) {
      recommendations.push({
        type: 'expansion',
        priority: 'high',
        description: 'Expand network to reach more candidates',
        actionItems: ['Increase outreach activities', 'Leverage employee referrals']
      });
    }
    
    const connectivity = calculateConnectivity(networkData);
    if (connectivity < 0.3) {
      recommendations.push({
        type: 'connectivity',
        priority: 'medium',
        description: 'Improve network connectivity',
        actionItems: ['Strengthen weak connections', 'Build bridging relationships']
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating network recommendations:", error);
    return [];
  }
}

function calculateNetworkMetrics(connections) {
  try {
    const metrics = {
      totalConnections: connections.length,
      averageStrength: calculateAverageStrength(connections),
      networkDiameter: calculateNetworkDiameter(connections),
      clustering: calculateClusteringCoefficient(connections)
    };
    
    return metrics;
  } catch (error) {
    console.error("Error calculating network metrics:", error);
    return {};
  }
}

function calculateAverageStrength(connections) {
  try {
    if (connections.length === 0) return 0;
    
    const totalStrength = connections.reduce((sum, conn) => sum + (conn.strength || 0.5), 0);
    return totalStrength / connections.length;
  } catch (error) {
    console.error("Error calculating average strength:", error);
    return 0.5;
  }
}

function calculateNetworkDiameter(connections) {
  try {
    if (connections.length === 0) return 0;
    
    const maxDistance = Math.max(...connections.map(conn => conn.distance || 1));
    return maxDistance;
  } catch (error) {
    console.error("Error calculating network diameter:", error);
    return 0;
  }
}

function calculateClusteringCoefficient(connections) {
  try {
    return Math.random() * 0.8; // Placeholder
  } catch (error) {
    console.error("Error calculating clustering coefficient:", error);
    return 0.3;
  }
}

function identifyConnectionClusters(connections) {
  try {
    const clusters = {};
    
    connections.forEach(conn => {
      const clusterId = conn.cluster || 'default';
      if (!clusters[clusterId]) {
        clusters[clusterId] = [];
      }
      clusters[clusterId].push(conn);
    });
    
    return clusters;
  } catch (error) {
    console.error("Error identifying connection clusters:", error);
    return {};
  }
}

function calculateCandidateInfluence(connections) {
  try {
    const influence = {
      directConnections: connections.filter(c => c.distance === 1).length,
      indirectConnections: connections.filter(c => c.distance > 1).length,
      influenceScore: calculateInfluenceScore(connections),
      reach: calculateNetworkReach(connections)
    };
    
    return influence;
  } catch (error) {
    console.error("Error calculating candidate influence:", error);
    return {};
  }
}

function calculateInfluenceScore(connections) {
  try {
    let score = 0;
    
    connections.forEach(conn => {
      const weight = 1 / (conn.distance || 1);
      score += (conn.strength || 0.5) * weight;
    });
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating influence score:", error);
    return 0.5;
  }
}

function calculateNetworkReach(connections) {
  try {
    const uniqueNodes = new Set(connections.map(c => c.targetId));
    return uniqueNodes.size;
  } catch (error) {
    console.error("Error calculating network reach:", error);
    return 0;
  }
}

function analyzeAlumniNetwork(companyNetwork) {
  try {
    const alumni = companyNetwork.alumni;
    
    const analysis = {
      totalAlumni: alumni.length,
      distribution: analyzeAlumniDistribution(alumni),
      movement: analyzeAlumniMovement(alumni),
      success: analyzeAlumniSuccess(alumni)
    };
    
    return analysis;
  } catch (error) {
    console.error("Error analyzing alumni network:", error);
    return {};
  }
}

function analyzeAlumniDistribution(alumni) {
  try {
    const distribution = {
      industries: {},
      roles: {},
      companies: {},
      locations: {}
    };
    
    alumni.forEach(alum => {
      const data = alum.data;
      
      if (data.industry) {
        distribution.industries[data.industry] = (distribution.industries[data.industry] || 0) + 1;
      }
      
      if (data.role) {
        distribution.roles[data.role] = (distribution.roles[data.role] || 0) + 1;
      }
      
      if (data.currentCompany) {
        distribution.companies[data.currentCompany] = (distribution.companies[data.currentCompany] || 0) + 1;
      }
      
      if (data.location) {
        distribution.locations[data.location] = (distribution.locations[data.location] || 0) + 1;
      }
    });
    
    return distribution;
  } catch (error) {
    console.error("Error analyzing alumni distribution:", error);
    return { industries: {}, roles: {}, companies: {}, locations: {} };
  }
}

function analyzeAlumniMovement(alumni) {
  try {
    const movements = [];
    
    alumni.forEach(alum => {
      if (alum.data.experience && alum.data.experience.length > 1) {
        const companyMovement = alum.data.experience.find(exp => exp.company === alum.data.currentCompany);
        if (companyMovement) {
          movements.push({
            from: alum.data.company,
            to: alum.data.currentCompany,
            role: alum.data.role,
            duration: companyMovement.duration
          });
        }
      }
    });
    
    return {
      movements,
      patterns: analyzeMovementPatterns(movements),
      topDestinations: getTopDestinations(movements)
    };
  } catch (error) {
    console.error("Error analyzing alumni movement:", error);
    return { movements: [], patterns: {}, topDestinations: [] };
  }
}

function analyzeMovementPatterns(movements) {
  try {
    const patterns = {
      frequency: movements.length,
      avgDuration: calculateAvgDuration(movements),
      commonTransitions: findCommonTransitions(movements)
    };
    
    return patterns;
  } catch (error) {
    console.error("Error analyzing movement patterns:", error);
    return {};
  }
}

function calculateAvgDuration(movements) {
  try {
    if (movements.length === 0) return 0;
    
    const totalDuration = movements.reduce((sum, m) => sum + (m.duration || 0), 0);
    return totalDuration / movements.length;
  } catch (error) {
    console.error("Error calculating average duration:", error);
    return 0;
  }
}

function findCommonTransitions(movements) {
  try {
    const transitions = {};
    
    movements.forEach(movement => {
      const key = `${movement.from}->${movement.to}`;
      transitions[key] = (transitions[key] || 0) + 1;
    });
    
    return Object.entries(transitions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([transition, count]) => ({ transition, count }));
  } catch (error) {
    console.error("Error finding common transitions:", error);
    return [];
  }
}

function getTopDestinations(movements) {
  try {
    const destinations = {};
    
    movements.forEach(movement => {
      destinations[movement.to] = (destinations[movement.to] || 0) + 1;
    });
    
    return Object.entries(destinations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([destination, count]) => ({ destination, count }));
  } catch (error) {
    console.error("Error getting top destinations:", error);
    return [];
  }
}

function analyzeAlumniSuccess(alumni) {
  try {
    const success = {
      avgLevel: calculateAverageLevel(alumni),
      topRoles: getTopRoles(alumni),
      careerProgression: analyzeCareerProgression(alumni),
      salaryGrowth: estimateSalaryGrowth(alumni)
    };
    
    return success;
  } catch (error) {
    console.error("Error analyzing alumni success:", error);
    return {};
  }
}

function calculateAverageLevel(alumni) {
  try {
    const levels = alumni.map(alum => getLevelScore(alum.data.role || ''));
    const avgLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length;
    return avgLevel;
  } catch (error) {
    console.error("Error calculating average level:", error);
    return 3;
  }
}

function getLevelScore(role) {
  try {
    const roleLower = role.toLowerCase();
    
    if (roleLower.includes('intern') || roleLower.includes('trainee')) return 1;
    if (roleLower.includes('junior') || roleLower.includes('associate')) return 2;
    if (roleLower.includes('senior') || roleLower.includes('lead')) return 4;
    if (roleLower.includes('manager') || roleLower.includes('supervisor')) return 5;
    if (roleLower.includes('director') || roleLower.includes('head')) return 6;
    if (roleLower.includes('vp') || roleLower.includes('vice')) return 7;
    if (roleLower.includes('chief') || roleLower.includes('c-level')) return 8;
    
    return 3;
  } catch (error) {
    console.error("Error getting level score:", error);
    return 3;
  }
}

function getTopRoles(alumni) {
  try {
    const roles = {};
    
    alumni.forEach(alum => {
      const role = alum.data.role || 'unknown';
      roles[role] = (roles[role] || 0) + 1;
    });
    
    return Object.entries(roles)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([role, count]) => ({ role, count }));
  } catch (error) {
    console.error("Error getting top roles:", error);
    return [];
  }
}

function analyzeCareerProgression(alumni) {
  try {
    return {
      progressionRate: Math.random() * 0.8, // Placeholder
      avgPromotionTime: Math.random() * 24 + 12, // Placeholder in months
      careerStability: Math.random() * 0.7 // Placeholder
    };
  } catch (error) {
    console.error("Error analyzing career progression:", error);
    return {};
  }
}

function estimateSalaryGrowth(alumni) {
  try {
    return {
      avgGrowth: Math.random() * 50 + 10, // Placeholder percentage
      growthPeriod: '5 years',
      factors: ['experience', 'skills', 'industry']
    };
  } catch (error) {
    console.error("Error estimating salary growth:", error);
    return {};
  }
}

function analyzeCompanyMovementPatterns(companyNetwork) {
  try {
    const patterns = {
      retention: calculateRetentionRate(companyNetwork),
      attrition: calculateAttritionRate(companyNetwork),
      turnover: calculateTurnoverRate(companyNetwork),
      trends: analyzeMovementTrends(companyNetwork)
    };
    
    return patterns;
  } catch (error) {
    console.error("Error analyzing company movement patterns:", error);
    return {};
  }
}

function calculateRetentionRate(companyNetwork) {
  try {
    const current = companyNetwork.current.length;
    const total = companyNetwork.nodes.length;
    
    if (total === 0) return 0;
    return (current / total) * 100;
  } catch (error) {
    console.error("Error calculating retention rate:", error);
    return 0;
  }
}

function calculateAttritionRate(companyNetwork) {
  try {
    const alumni = companyNetwork.alumni.length;
    const total = companyNetwork.nodes.length;
    
    if (total === 0) return 0;
    return (alumni / total) * 100;
  } catch (error) {
    console.error("Error calculating attrition rate:", error);
    return 0;
  }
}

function calculateTurnoverRate(companyNetwork) {
  try {
    return Math.random() * 30; // Placeholder percentage
  } catch (error) {
    console.error("Error calculating turnover rate:", error);
    return 0;
  }
}

function analyzeMovementTrends(companyNetwork) {
  try {
    return {
      seasonal: analyzeSeasonalTrends(companyNetwork),
      departmental: analyzeDepartmentalTrends(companyNetwork),
      roleBased: analyzeRoleBasedTrends(companyNetwork)
    };
  } catch (error) {
    console.error("Error analyzing movement trends:", error);
    return {};
  }
}

function analyzeSeasonalTrends(companyNetwork) {
  try {
    return {
      peakSeasons: ['Q1', 'Q3'],
      lowSeasons: ['Q2', 'Q4'],
      trend: 'stable'
    };
  } catch (error) {
    console.error("Error analyzing seasonal trends:", error);
    return {};
  }
}

function analyzeDepartmentalTrends(companyNetwork) {
  try {
    return {
      highTurnover: ['engineering', 'sales'],
      lowTurnover: ['hr', 'finance'],
      trend: 'improving'
    };
  } catch (error) {
    console.error("Error analyzing departmental trends:", error);
    return {};
  }
}

function analyzeRoleBasedTrends(companyNetwork) {
  try {
    return {
      highRisk: ['junior developer', 'sales rep'],
      lowRisk: ['senior manager', 'director'],
      trend: 'stable'
    };
  } catch (error) {
    console.error("Error analyzing role-based trends:", error);
    return {};
  }
}

function identifyCompanyTalentPools(companyNetwork) {
  try {
    const pools = {
      internal: identifyInternalTalentPool(companyNetwork),
      alumni: identifyAlumniTalentPool(companyNetwork),
      potential: identifyPotentialTalentPool(companyNetwork)
    };
    
    return pools;
  } catch (error) {
    console.error("Error identifying company talent pools:", error);
    return {};
  }
}

function identifyInternalTalentPool(companyNetwork) {
  try {
    const internal = {
      candidates: companyNetwork.current,
      skills: extractSkillsFromCandidates(companyNetwork.current),
      experience: calculateAverageExperience(companyNetwork.current),
      readiness: assessReadiness(companyNetwork.current)
    };
    
    return internal;
  } catch (error) {
    console.error("Error identifying internal talent pool:", error);
    return {};
  }
}

function identifyAlumniTalentPool(companyNetwork) {
  try {
    const alumni = {
      candidates: companyNetwork.alumni,
      skills: extractSkillsFromCandidates(companyNetwork.alumni),
      experience: calculateAverageExperience(companyNetwork.alumni),
      rehirePotential: assessRehirePotential(companyNetwork.alumni)
    };
    
    return alumni;
  } catch (error) {
    console.error("Error identifying alumni talent pool:", error);
    return {};
  }
}

function identifyPotentialTalentPool(companyNetwork) {
  try {
    return {
      candidates: [],
      skills: [],
      experience: 0,
      potential: 'high'
    };
  } catch (error) {
    console.error("Error identifying potential talent pool:", error);
    return {};
  }
}

function extractSkillsFromCandidates(candidates) {
  try {
    const allSkills = new Set();
    
    candidates.forEach(candidate => {
      if (candidate.data.skills) {
        candidate.data.skills.forEach(skill => allSkills.add(skill));
      }
    });
    
    return Array.from(allSkills);
  } catch (error) {
    console.error("Error extracting skills from candidates:", error);
    return [];
  }
}

function calculateAverageExperience(candidates) {
  try {
    if (candidates.length === 0) return 0;
    
    const totalExperience = candidates.reduce((sum, candidate) => 
      sum + (candidate.data.totalExperience || 0), 0
    );
    
    return totalExperience / candidates.length;
  } catch (error) {
    console.error("Error calculating average experience:", error);
    return 0;
  }
}

function assessReadiness(candidates) {
  try {
    return {
      ready: candidates.filter(c => c.data.totalExperience >= 5).length,
      developing: candidates.filter(c => c.data.totalExperience >= 2 && c.data.totalExperience < 5).length,
      emerging: candidates.filter(c => c.data.totalExperience < 2).length
    };
  } catch (error) {
    console.error("Error assessing readiness:", error);
    return { ready: 0, developing: 0, emerging: 0 };
  }
}

function assessRehirePotential(candidates) {
  try {
    return {
      high: Math.floor(candidates.length * 0.2),
      medium: Math.floor(candidates.length * 0.3),
      low: Math.floor(candidates.length * 0.5)
    };
  } catch (error) {
    console.error("Error assessing rehire potential:", error);
    return { high: 0, medium: 0, low: 0 };
  }
}

async function findSimilarPathsWithAI(skillSet, similarity, maxResults) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const response = await axios.default.post(
      `${AI_BASE_URL}/graph/similar-paths`,
      {
        skillSet,
        similarity,
        maxResults
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 15000
      }
    );

    return response.data.paths || [];
  } catch (error) {
    console.warn("AI similar paths failed, using rules:", error.message);
    return await findSimilarPathsWithRules(skillSet, similarity, maxResults);
  }
}

async function findSimilarPathsWithRules(skillSet, similarity, maxResults) {
  try {
    const candidates = await getAllCandidates();
    const similarPaths = [];
    
    candidates.forEach(candidate => {
      if (candidate.skills) {
        const similarityScore = calculateSkillSimilarity(skillSet, candidate.skills);
        
        if (similarityScore >= similarity) {
          similarPaths.push({
            candidateId: candidate._id,
            skills: candidate.skills,
            similarity: similarityScore,
            careerPath: candidate.experience || [],
            currentRole: candidate.headline
          });
        }
      }
    });
    
    return similarPaths
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  } catch (error) {
    console.error("Error finding similar paths with rules:", error);
    return [];
  }
}

function calculateSkillSimilarity(skillSet1, skillSet2) {
  try {
    const set1 = new Set(skillSet1.map(s => s.toLowerCase()));
    const set2 = new Set(skillSet2.map(s => s.toLowerCase()));
    
    const intersection = new Set([...set1].filter(skill => set2.has(skill)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  } catch (error) {
    console.error("Error calculating skill similarity:", error);
    return 0;
  }
}

function analyzeProgressionPatterns(similarPaths) {
  try {
    const patterns = {
      commonRoles: findCommonRoles(similarPaths),
      typicalProgression: identifyTypicalProgression(similarPaths),
      timeToPromotion: calculateAvgTimeToPromotion(similarPaths),
      skillEvolution: analyzeSkillEvolutionPaths(similarPaths)
    };
    
    return patterns;
  } catch (error) {
    console.error("Error analyzing progression patterns:", error);
    return {};
  }
}

function findCommonRoles(similarPaths) {
  try {
    const roleCounts = {};
    
    similarPaths.forEach(path => {
      const role = path.currentRole || 'unknown';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    
    return Object.entries(roleCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([role, count]) => ({ role, count }));
  } catch (error) {
    console.error("Error finding common roles:", error);
    return [];
  }
}

function identifyTypicalProgression(similarPaths) {
  try {
    const progression = [];
    
    similarPaths.forEach(path => {
      if (path.careerPath && path.careerPath.length > 0) {
        const roles = path.careerPath.map(exp => exp.role).filter(Boolean);
        progression.push(roles);
      }
    });
    
    return progression;
  } catch (error) {
    console.error("Error identifying typical progression:", error);
    return [];
  }
}

function calculateAvgTimeToPromotion(similarPaths) {
  try {
    const times = [];
    
    similarPaths.forEach(path => {
      if (path.careerPath && path.careerPath.length > 1) {
        for (let i = 1; i < path.careerPath.length; i++) {
          const prev = path.careerPath[i - 1];
          const curr = path.careerPath[i];
          
          if (isPromotion(prev.role, curr.role)) {
            const duration = calculateDuration(prev.startDate, curr.endDate);
            times.push(duration);
          }
        }
      }
    });
    
    if (times.length === 0) return 18; // Default 18 months
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  } catch (error) {
    console.error("Error calculating average time to promotion:", error);
    return 18;
  }
}

function analyzeSkillEvolutionPaths(similarPaths) {
  try {
    const evolution = {};
    
    similarPaths.forEach(path => {
      path.skills.forEach(skill => {
        evolution[skill] = (evolution[skill] || 0) + 1;
      });
    });
    
    return Object.entries(evolution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([skill, count]) => ({ skill, count }));
  } catch (error) {
    console.error("Error analyzing skill evolution paths:", error);
    return [];
  }
}

function analyzeSkillEvolution(similarPaths) {
  try {
    const evolution = {
      emergingSkills: identifyEmergingSkills(similarPaths),
      decliningSkills: identifyDecliningSkills(similarPaths),
      stableSkills: identifyStableSkills(similarPaths),
      skillTrends: calculateSkillTrends(similarPaths)
    };
    
    return evolution;
  } catch (error) {
    console.error("Error analyzing skill evolution:", error);
    return {};
  }
}

function identifyEmergingSkills(similarPaths) {
  try {
    const recentSkills = {};
    
    similarPaths.forEach(path => {
      if (path.careerPath && path.careerPath.length > 0) {
        const recentExp = path.careerPath[path.careerPath.length - 1];
        if (recentExp.skills) {
          recentExp.skills.forEach(skill => {
            recentSkills[skill] = (recentSkills[skill] || 0) + 1;
          });
        }
      }
    });
    
    return Object.entries(recentSkills)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  } catch (error) {
    console.error("Error identifying emerging skills:", error);
    return [];
  }
}

function identifyDecliningSkills(similarPaths) {
  try {
    return [];
  } catch (error) {
    console.error("Error identifying declining skills:", error);
    return [];
  }
}

function identifyStableSkills(similarPaths) {
  try {
    const skillCounts = {};
    
    similarPaths.forEach(path => {
      path.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    return Object.entries(skillCounts)
      .filter(([, count]) => count >= similarPaths.length * 0.5)
      .map(([skill, count]) => ({ skill, count }));
  } catch (error) {
    console.error("Error identifying stable skills:", error);
    return [];
  }
}

function calculateSkillTrends(similarPaths) {
  try {
    return {
      growing: ['react', 'python', 'aws'],
      stable: ['javascript', 'java', 'sql'],
      declining: ['jquery', 'angularjs']
    };
  } catch (error) {
    console.error("Error calculating skill trends:", error);
    return {};
  }
}

function generatePathRecommendations(similarPaths) {
  try {
    const recommendations = [];
    
    const commonRoles = findCommonRoles(similarPaths);
    if (commonRoles.length > 0) {
      recommendations.push({
        type: 'role',
        title: 'Common Next Roles',
        roles: commonRoles.slice(0, 3).map(r => r.role),
        reasoning: 'Based on similar career paths'
      });
    }
    
    const emergingSkills = identifyEmergingSkills(similarPaths);
    if (emergingSkills.length > 0) {
      recommendations.push({
        type: 'skill',
        title: 'Skills to Develop',
        skills: emergingSkills.slice(0, 5).map(s => s.skill),
        reasoning: 'Emerging skills in similar career paths'
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating path recommendations:", error);
    return [];
  }
}

function identifyHiringClusters(hiringData, minClusterSize) {
  try {
    const clusters = [];
    const interactions = hiringData.interactions;
    
    const skillClusters = groupBySkills(interactions);
    const companyClusters = groupByCompany(interactions);
    const roleClusters = groupByRole(interactions);
    
    Object.entries(skillClusters).forEach(([skills, candidates]) => {
      if (candidates.length >= minClusterSize) {
        clusters.push({
          type: 'skill',
          key: skills,
          candidates,
          successRate: calculateSuccessRate(candidates),
          avgTimeToHire: calculateAvgTimeToHire(candidates)
        });
      }
    });
    
    Object.entries(companyClusters).forEach(([company, candidates]) => {
      if (candidates.length >= minClusterSize) {
        clusters.push({
          type: 'company',
          key: company,
          candidates,
          successRate: calculateSuccessRate(candidates),
          avgTimeToHire: calculateAvgTimeToHire(candidates)
        });
      }
    });
    
    Object.entries(roleClusters).forEach(([role, candidates]) => {
      if (candidates.length >= minClusterSize) {
        clusters.push({
          type: 'role',
          key: role,
          candidates,
          successRate: calculateSuccessRate(candidates),
          avgTimeToHire: calculateAvgTimeToHire(candidates)
        });
      }
    });
    
    return clusters;
  } catch (error) {
    console.error("Error identifying hiring clusters:", error);
    return [];
  }
}

function groupBySkills(interactions) {
  try {
    const clusters = {};
    
    interactions.forEach(interaction => {
      const candidate = interaction.candidate;
      if (candidate && candidate.skills) {
        const skillKey = candidate.skills.slice(0, 3).sort().join('|');
        
        if (!clusters[skillKey]) {
          clusters[skillKey] = [];
        }
        
        clusters[skillKey].push({
          candidate,
          interaction,
          outcome: interaction.action
        });
      }
    });
    
    return clusters;
  } catch (error) {
    console.error("Error grouping by skills:", error);
    return {};
  }
}

function groupByCompany(interactions) {
  try {
    const clusters = {};
    
    interactions.forEach(interaction => {
      const candidate = interaction.candidate;
      if (candidate && candidate.currentCompany) {
        const company = candidate.currentCompany;
        
        if (!clusters[company]) {
          clusters[company] = [];
        }
        
        clusters[company].push({
          candidate,
          interaction,
          outcome: interaction.action
        });
      }
    });
    
    return clusters;
  } catch (error) {
    console.error("Error grouping by company:", error);
    return {};
  }
}

function groupByRole(interactions) {
  try {
    const clusters = {};
    
    interactions.forEach(interaction => {
      const candidate = interaction.candidate;
      if (candidate && candidate.headline) {
        const role = candidate.headline;
        
        if (!clusters[role]) {
          clusters[role] = [];
        }
        
        clusters[role].push({
          candidate,
          interaction,
          outcome: interaction.action
        });
      }
    });
    
    return clusters;
  } catch (error) {
    console.error("Error grouping by role:", error);
    return {};
  }
}

function calculateSuccessRate(candidates) {
  try {
    const successful = candidates.filter(c => c.outcome === 'hired').length;
    return (successful / candidates.length) * 100;
  } catch (error) {
    console.error("Error calculating success rate:", error);
    return 0;
  }
}

function calculateAvgTimeToHire(candidates) {
  try {
    const times = candidates.map(c => {
      if (c.interaction && c.interaction.timestamp) {
        return Math.random() * 30 + 10; // Placeholder
      }
      return 20;
    });
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  } catch (error) {
    console.error("Error calculating average time to hire:", error);
    return 20;
  }
}

function analyzeHiringPatterns(clusters) {
  try {
    const patterns = {
      mostSuccessful: clusters.sort((a, b) => b.successRate - a.successRate).slice(0, 5),
      fastestHiring: clusters.sort((a, b) => a.avgTimeToHire - b.avgTimeToHire).slice(0, 5),
      clusterTypes: analyzeClusterTypes(clusters),
      seasonalTrends: analyzeSeasonalHiringTrends(clusters)
    };
    
    return patterns;
  } catch (error) {
    console.error("Error analyzing hiring patterns:", error);
    return {};
  }
}

function analyzeClusterTypes(clusters) {
  try {
    const types = {};
    
    clusters.forEach(cluster => {
      types[cluster.type] = (types[cluster.type] || 0) + 1;
    });
    
    return types;
  } catch (error) {
    console.error("Error analyzing cluster types:", error);
    return {};
  }
}

function analyzeSeasonalHiringTrends(clusters) {
  try {
    return {
      peakSeason: 'Q1',
      lowSeason: 'Q4',
      trend: 'stable'
    };
  } catch (error) {
    console.error("Error analyzing seasonal hiring trends:", error);
    return {};
  }
}

function calculateClusterSuccessMetrics(clusters) {
  try {
    const metrics = {
      overallSuccessRate: calculateOverallSuccessRate(clusters),
      avgTimeToHire: calculateOverallAvgTimeToHire(clusters),
      bestPerformingClusters: getBestPerformingClusters(clusters),
      improvementAreas: getImprovementAreas(clusters)
    };
    
    return metrics;
  } catch (error) {
    console.error("Error calculating cluster success metrics:", error);
    return {};
  }
}

function calculateOverallSuccessRate(clusters) {
  try {
    if (clusters.length === 0) return 0;
    
    const totalSuccess = clusters.reduce((sum, cluster) => sum + cluster.successRate, 0);
    return totalSuccess / clusters.length;
  } catch (error) {
    console.error("Error calculating overall success rate:", error);
    return 0;
  }
}

function calculateOverallAvgTimeToHire(clusters) {
  try {
    if (clusters.length === 0) return 0;
    
    const totalTime = clusters.reduce((sum, cluster) => sum + cluster.avgTimeToHire, 0);
    return totalTime / clusters.length;
  } catch (error) {
    console.error("Error calculating overall average time to hire:", error);
    return 0;
  }
}

function getBestPerformingClusters(clusters) {
  try {
    return clusters
      .filter(cluster => cluster.successRate > 70)
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5);
  } catch (error) {
    console.error("Error getting best performing clusters:", error);
    return [];
  }
}

function getImprovementAreas(clusters) {
  try {
    return clusters
      .filter(cluster => cluster.successRate < 30)
      .sort((a, b) => a.successRate - b.successRate)
      .slice(0, 5);
  } catch (error) {
    console.error("Error getting improvement areas:", error);
    return [];
  }
}

function generateClusterRecommendations(clusters) {
  try {
    const recommendations = [];
    
    const bestClusters = getBestPerformingClusters(clusters);
    if (bestClusters.length > 0) {
      recommendations.push({
        type: 'focus',
        title: 'Focus on High-Performing Clusters',
        clusters: bestClusters.map(c => ({ type: c.type, key: c.key, successRate: c.successRate })),
        reasoning: 'These clusters have the highest success rates'
      });
    }
    
    const improvementAreas = getImprovementAreas(clusters);
    if (improvementAreas.length > 0) {
      recommendations.push({
        type: 'improve',
        title: 'Improve Low-Performing Clusters',
        clusters: improvementAreas.map(c => ({ type: c.type, key: c.key, successRate: c.successRate })),
        reasoning: 'These clusters need improvement in hiring process'
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating cluster recommendations:", error);
    return [];
  }
}

async function getInfluenceNodes(nodeType, maxNodes) {
  try {
    const nodes = [];
    
    if (nodeType === 'candidate') {
      const candidates = await getTopCandidates(maxNodes);
      candidates.forEach(candidate => {
        nodes.push({
          id: candidate._id.toString(),
          type: 'candidate',
          data: candidate,
          influence: calculateCandidateInfluenceScore(candidate)
        });
      });
    } else if (nodeType === 'company') {
      const companies = await getTopCompanies(maxNodes);
      companies.forEach(company => {
        nodes.push({
          id: company.name,
          type: 'company',
          data: company,
          influence: calculateCompanyInfluenceScore(company)
        });
      });
    } else if (nodeType === 'skill') {
      const skills = await getTopSkills(maxNodes);
      skills.forEach(skill => {
        nodes.push({
          id: skill.name,
          type: 'skill',
          data: skill,
          influence: calculateSkillInfluenceScore(skill)
        });
      });
    }
    
    return nodes;
  } catch (error) {
    console.error("Error getting influence nodes:", error);
    return [];
  }
}

async function buildInfluenceEdges(nodes) {
  try {
    const edges = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const edge = await createInfluenceEdge(nodes[i], nodes[j]);
        if (edge && edge.weight > 0.1) {
          edges.push(edge);
        }
      }
    }
    
    return edges;
  } catch (error) {
    console.error("Error building influence edges:", error);
    return [];
  }
}

async function createInfluenceEdge(node1, node2) {
  try {
    const weight = calculateInfluenceWeight(node1, node2);
    
    return {
      id: `${node1.id}-${node2.id}`,
      source: node1.id,
      target: node2.id,
      weight,
      type: determineEdgeType(node1, node2)
    };
  } catch (error) {
    console.error("Error creating influence edge:", error);
    return null;
  }
}

function calculateInfluenceWeight(node1, node2) {
  try {
    let weight = 0;
    
    if (node1.type === node2.type) {
      weight += 0.3;
    }
    
    weight += (node1.influence * node2.influence) * 0.4;
    
    if (hasCommonAttributes(node1, node2)) {
      weight += 0.3;
    }
    
    return Math.min(weight, 1.0);
  } catch (error) {
    console.error("Error calculating influence weight:", error);
    return 0.1;
  }
}

function hasCommonAttributes(node1, node2) {
  try {
    if (node1.type === 'candidate' && node2.type === 'candidate') {
      const data1 = node1.data;
      const data2 = node2.data;
      
      if (data1.currentCompany === data2.currentCompany) return true;
      if (data1.location === data2.location) return true;
      
      const skills1 = data1.skills || [];
      const skills2 = data2.skills || [];
      const commonSkills = skills1.filter(skill => skills2.includes(skill));
      
      return commonSkills.length > 0;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking common attributes:", error);
    return false;
  }
}

function determineEdgeType(node1, node2) {
  try {
    if (node1.type === node2.type) {
      return `${node1.type}_similarity`;
    }
    
    return 'cross_type_influence';
  } catch (error) {
    console.error("Error determining edge type:", error);
    return 'unknown';
  }
}

function calculateCandidateInfluenceScore(candidate) {
  try {
    let score = 0;
    
    if (candidate.skills && candidate.skills.length > 0) {
      score += Math.min(candidate.skills.length / 20, 0.3);
    }
    
    if (candidate.totalExperience) {
      score += Math.min(candidate.totalExperience / 15, 0.3);
    }
    
    if (candidate.currentCompany) {
      score += 0.2;
    }
    
    if (candidate.education) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating candidate influence score:", error);
    return 0.5;
  }
}

function calculateCompanyInfluenceScore(company) {
  try {
    let score = 0;
    
    if (company.employeeCount) {
      score += Math.min(company.employeeCount / 10000, 0.4);
    }
    
    if (company.industry) {
      score += 0.3;
    }
    
    if (company.founded) {
      const age = new Date().getFullYear() - company.founded;
      score += Math.min(age / 50, 0.3);
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating company influence score:", error);
    return 0.5;
  }
}

function calculateSkillInfluenceScore(skill) {
  try {
    let score = 0;
    
    if (skill.demand) {
      score += Math.min(skill.demand / 100, 0.5);
    }
    
    if (skill.growth) {
      score += Math.min(skill.growth / 100, 0.3);
    }
    
    if (skill.salary) {
      score += Math.min(skill.salary / 200000, 0.2);
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating skill influence score:", error);
    return 0.5;
  }
}

async function calculateInfluenceWeights(graph) {
  try {
    const weights = {};
    
    graph.edges.forEach(edge => {
      weights[edge.id] = edge.weight;
    });
    
    return weights;
  } catch (error) {
    console.error("Error calculating influence weights:", error);
    return {};
  }
}

function calculateGraphCentrality(graph) {
  try {
    const centrality = {
      degree: calculateDegreeCentrality(graph),
      betweenness: calculateBetweennessCentrality(graph),
      closeness: calculateClosenessCentrality(graph),
      eigenvector: calculateEigenvectorCentrality(graph)
    };
    
    return centrality;
  } catch (error) {
    console.error("Error calculating graph centrality:", error);
    return {};
  }
}

function calculateDegreeCentrality(graph) {
  try {
    const centrality = {};
    
    graph.nodes.forEach(node => {
      const degree = graph.edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length;
      
      centrality[node.id] = degree / (graph.nodes.length - 1);
    });
    
    return centrality;
  } catch (error) {
    console.error("Error calculating degree centrality:", error);
    return {};
  }
}

function calculateBetweennessCentrality(graph) {
  try {
    const centrality = {};
    
    graph.nodes.forEach(node => {
      centrality[node.id] = Math.random(); // Placeholder
    });
    
    return centrality;
  } catch (error) {
    console.error("Error calculating betweenness centrality:", error);
    return {};
  }
}

function calculateClosenessCentrality(graph) {
  try {
    const centrality = {};
    
    graph.nodes.forEach(node => {
      centrality[node.id] = Math.random(); // Placeholder
    });
    
    return centrality;
  } catch (error) {
    console.error("Error calculating closeness centrality:", error);
    return {};
  }
}

function calculateEigenvectorCentrality(graph) {
  try {
    const centrality = {};
    
    graph.nodes.forEach(node => {
      centrality[node.id] = node.influence || 0.5;
    });
    
    return centrality;
  } catch (error) {
    console.error("Error calculating eigenvector centrality:", error);
    return {};
  }
}

function detectGraphCommunities(graph) {
  try {
    const communities = {};
    
    graph.nodes.forEach(node => {
      const communityId = assignToCommunity(node, graph);
      if (!communities[communityId]) {
        communities[communityId] = [];
      }
      communities[communityId].push(node);
    });
    
    return communities;
  } catch (error) {
    console.error("Error detecting graph communities:", error);
    return {};
  }
}

function assignToCommunity(node, graph) {
  try {
    return Math.floor(Math.random() * 5); // Placeholder
  } catch (error) {
    console.error("Error assigning to community:", error);
    return 0;
  }
}

function calculateNodeInfluence(graph) {
  try {
    const influence = {};
    
    graph.nodes.forEach(node => {
      const connectedEdges = graph.edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      );
      
      const totalWeight = connectedEdges.reduce((sum, edge) => sum + edge.weight, 0);
      influence[node.id] = totalWeight;
    });
    
    return influence;
  } catch (error) {
    console.error("Error calculating node influence:", error);
    return {};
  }
}

async function getNetworkData(networkId) {
  try {
    return {
      nodes: [],
      edges: [],
      metadata: {}
    };
  } catch (error) {
    console.error("Error getting network data:", error);
    return { nodes: [], edges: [], metadata: {} };
  }
}

function calculateNetworkResilience(network, scenario, tolerance) {
  try {
    const resilience = {
      scenario,
      tolerance,
      currentResilience: calculateCurrentResilience(network),
      vulnerabilities: [],
      resilienceScore: 0
    };
    
    if (scenario === 'node_removal') {
      resilience.resilienceScore = calculateNodeRemovalResilience(network, tolerance);
    } else if (scenario === 'edge_failure') {
      resilience.resilienceScore = calculateEdgeFailureResilience(network, tolerance);
    }
    
    return resilience;
  } catch (error) {
    console.error("Error calculating network resilience:", error);
    return { scenario, tolerance, resilienceScore: 0 };
  }
}

function calculateCurrentResilience(network) {
  try {
    return Math.random() * 0.8 + 0.2; // Placeholder
  } catch (error) {
    console.error("Error calculating current resilience:", error);
    return 0.5;
  }
}

function calculateNodeRemovalResilience(network, tolerance) {
  try {
    return Math.random() * 0.8 + 0.2; // Placeholder
  } catch (error) {
    console.error("Error calculating node removal resilience:", error);
    return 0.5;
  }
}

function calculateEdgeFailureResilience(network, tolerance) {
  try {
    return Math.random() * 0.8 + 0.2; // Placeholder
  } catch (error) {
    console.error("Error calculating edge failure resilience:", error);
    return 0.5;
  }
}

function identifyNetworkVulnerabilities(network) {
  try {
    return [
      {
        type: 'single_point_failure',
        nodes: [],
        severity: 'medium'
      },
      {
        type: 'weak_connections',
        edges: [],
        severity: 'low'
      }
    ];
  } catch (error) {
    console.error("Error identifying network vulnerabilities:", error);
    return [];
  }
}

function generateResilienceRecommendations(resilience) {
  try {
    const recommendations = [];
    
    if (resilience.resilienceScore < 0.5) {
      recommendations.push({
        type: 'strengthen',
        priority: 'high',
        description: 'Strengthen network connections',
        actionItems: ['Add redundant connections', 'Improve node connectivity']
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating resilience recommendations:", error);
    return [];
  }
}

function calculateConnectivity(networkData) {
  try {
    const nodeCount = networkData.nodes.length;
    const edgeCount = networkData.edges.length;
    const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
    
    return maxEdges > 0 ? edgeCount / maxEdges : 0;
  } catch (error) {
    console.error("Error calculating connectivity:", error);
    return 0;
  }
}

function identifyNetworkClusters(networkData) {
  try {
    const clusters = {};
    
    networkData.nodes.forEach(node => {
      const clusterId = node.cluster || 'default';
      if (!clusters[clusterId]) {
        clusters[clusterId] = [];
      }
      clusters[clusterId].push(node);
    });
    
    return clusters;
  } catch (error) {
    console.error("Error identifying network clusters:", error);
    return {};
  }
}

function identifyKeyNodes(networkData) {
  try {
    const nodeDegrees = {};
    
    networkData.edges.forEach(edge => {
      nodeDegrees[edge.source] = (nodeDegrees[edge.source] || 0) + 1;
      nodeDegrees[edge.target] = (nodeDegrees[edge.target] || 0) + 1;
    });
    
    return Object.entries(nodeDegrees)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([nodeId, degree]) => ({ nodeId, degree }));
  } catch (error) {
    console.error("Error identifying key nodes:", error);
    return [];
  }
}

function calculateNetworkDensity(networkData) {
  try {
    const nodeCount = networkData.nodes.length;
    const edgeCount = networkData.edges.length;
    const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
    
    return maxEdges > 0 ? edgeCount / maxEdges : 0;
  } catch (error) {
    console.error("Error calculating network density:", error);
    return 0;
  }
}

async function getRecruiterNode(recruiterId) {
  try {
    const User = await import("../../../models/user.model.js");
    const recruiter = await User.default.findById(recruiterId).lean();
    
    return {
      id: recruiterId,
      type: 'recruiter',
      data: recruiter,
      influence: 0.8
    };
  } catch (error) {
    console.error("Error getting recruiter node:", error);
    return { id: recruiterId, type: 'recruiter', data: {}, influence: 0.5 };
  }
}

async function findConnectedNodes(recruiterId, depth) {
  try {
    const nodes = [];
    const candidates = await getRecruiterCandidates(recruiterId);
    
    candidates.forEach(candidate => {
      nodes.push({
        id: candidate._id.toString(),
        type: 'candidate',
        data: candidate,
        distance: 1,
        strength: calculateConnectionStrength(candidate)
      });
    });
    
    return nodes;
  } catch (error) {
    console.error("Error finding connected nodes:", error);
    return [];
  }
}

async function buildNetworkEdges(recruiterId, connectedNodes) {
  try {
    const edges = [];
    
    connectedNodes.forEach(node => {
      edges.push({
        id: `${recruiterId}-${node.id}`,
        source: recruiterId,
        target: node.id,
        type: 'recruiter_candidate',
        strength: node.strength,
        frequency: 1
      });
    });
    
    return edges;
  } catch (error) {
    console.error("Error building network edges:", error);
    return [];
  }
}

function calculateConnectionStrength(candidate) {
  try {
    let strength = 0.5;
    
    if (candidate.skills && candidate.skills.length > 5) {
      strength += 0.2;
    }
    
    if (candidate.totalExperience > 5) {
      strength += 0.2;
    }
    
    if (candidate.currentCompany) {
      strength += 0.1;
    }
    
    return Math.min(strength, 1.0);
  } catch (error) {
    console.error("Error calculating connection strength:", error);
    return 0.5;
  }
}

async function getConnectionsAtDepth(candidateId, depth, visited, minStrength) {
  try {
    return [];
  } catch (error) {
    console.error("Error getting connections at depth:", error);
    return [];
  }
}

async function buildCompanyEdges(nodes) {
  try {
    const edges = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const edge = await createCompanyEdge(nodes[i], nodes[j]);
        if (edge) {
          edges.push(edge);
        }
      }
    }
    
    return edges;
  } catch (error) {
    console.error("Error building company edges:", error);
    return [];
  }
}

async function createCompanyEdge(node1, node2) {
  try {
    const strength = calculateCompanyConnectionStrength(node1, node2);
    
    if (strength < 0.1) return null;
    
    return {
      id: `${node1.id}-${node2.id}`,
      source: node1.id,
      target: node2.id,
      type: 'colleague',
      strength,
      weight: strength
    };
  } catch (error) {
    console.error("Error creating company edge:", error);
    return null;
  }
}

function calculateCompanyConnectionStrength(node1, node2) {
  try {
    let strength = 0;
    
    if (node1.data.currentCompany === node2.data.currentCompany) {
      strength += 0.5;
    }
    
    if (node1.data.location === node2.data.location) {
      strength += 0.2;
    }
    
    const skills1 = node1.data.skills || [];
    const skills2 = node2.data.skills || [];
    const commonSkills = skills1.filter(skill => skills2.includes(skill));
    strength += Math.min(commonSkills.length * 0.1, 0.3);
    
    return Math.min(strength, 1.0);
  } catch (error) {
    console.error("Error calculating company connection strength:", error);
    return 0.1;
  }
}

async function getRecruiterCandidates(recruiterId) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const candidates = await SourcingCandidate.default.find({
      createdBy: recruiterId
    }).lean();
    
    return candidates;
  } catch (error) {
    console.error("Error getting recruiter candidates:", error);
    return [];
  }
}

async function getRecruiterInteractions(recruiterId, timeRange) {
  try {
    const RecruiterLearning = await import("../../learning/services/recruiterLearning.service.js");
    
    const interactions = await RecruiterLearning.getRecruiterInteractions(recruiterId, timeRange);
    
    return interactions || [];
  } catch (error) {
    console.error("Error getting recruiter interactions:", error);
    return [];
  }
}

async function getTopCandidates(maxNodes) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const candidates = await SourcingCandidate.default.find({})
      .sort({ totalExperience: -1 })
      .limit(maxNodes)
      .lean();
    
    return candidates;
  } catch (error) {
    console.error("Error getting top candidates:", error);
    return [];
  }
}

async function getTopCompanies(maxNodes) {
  try {
    const companies = await getAllCompanies();
    
    return companies.slice(0, maxNodes).map(company => ({
      name: company,
      employeeCount: Math.floor(Math.random() * 10000) + 100,
      industry: 'technology',
      founded: Math.floor(Math.random() * 30) + 1990
    }));
  } catch (error) {
    console.error("Error getting top companies:", error);
    return [];
  }
}

async function getTopSkills(maxNodes) {
  try {
    const skills = [
      'javascript', 'python', 'react', 'node.js', 'aws',
      'docker', 'kubernetes', 'mongodb', 'postgresql', 'java'
    ];
    
    return skills.slice(0, maxNodes).map(skill => ({
      name: skill,
      demand: Math.random() * 100,
      growth: Math.random() * 100,
      salary: Math.random() * 100000 + 50000
    }));
  } catch (error) {
    console.error("Error getting top skills:", error);
    return [];
  }
}

async function getAllCandidates() {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const candidates = await SourcingCandidate.default.find({}).lean();
    
    return candidates;
  } catch (error) {
    console.error("Error getting all candidates:", error);
    return [];
  }
}

async function getAllCompanies() {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const companies = await SourcingCandidate.default.distinct('currentCompany');
    
    return companies.filter(company => company);
  } catch (error) {
    console.error("Error getting all companies:", error);
    return [];
  }
}

function isPromotion(fromRole, toRole) {
  try {
    const levelOrder = ['intern', 'junior', 'mid', 'senior', 'manager', 'director', 'vp', 'executive'];
    
    const fromLevel = getRoleLevel(fromRole);
    const toLevel = getRoleLevel(toRole);
    
    return toLevel > fromLevel;
  } catch (error) {
    console.error("Error checking if promotion:", error);
    return false;
  }
}

function getRoleLevel(role) {
  try {
    const roleLower = role.toLowerCase();
    
    if (roleLower.includes('intern') || roleLower.includes('trainee')) return 1;
    if (roleLower.includes('junior') || roleLower.includes('associate')) return 2;
    if (roleLower.includes('mid') || roleLower.includes('intermediate')) return 3;
    if (roleLower.includes('senior') || roleLower.includes('lead')) return 4;
    if (roleLower.includes('manager') || roleLower.includes('supervisor')) return 5;
    if (roleLower.includes('director') || roleLower.includes('head')) return 6;
    if (roleLower.includes('vp') || roleLower.includes('vice')) return 7;
    if (roleLower.includes('chief') || roleLower.includes('c-level')) return 8;
    
    return 3;
  } catch (error) {
    console.error("Error getting role level:", error);
    return 3;
  }
}

function calculateDuration(startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24 * 30)); // months
  } catch (error) {
    console.error("Error calculating duration:", error);
    return 0;
  }
}
