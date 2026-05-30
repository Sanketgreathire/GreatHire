import { checkAiHealth } from "../../../sourcing/ai/aiServiceClient.js";

export async function calculateRelationshipStrength(graph, relationshipType, options = {}) {
  try {
    const { useAI = true, fallbackToRules = true } = options;
    
    if (useAI) {
      const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
      
      if (aiAvailable) {
        return await calculateStrengthWithAI(graph, relationshipType);
      }
    }
    
    if (fallbackToRules) {
      return await calculateStrengthWithRules(graph, relationshipType);
    }
    
    return getDefaultStrengthScores(graph);
  } catch (error) {
    console.error("Error in calculateRelationshipStrength:", error);
    throw new Error(`Failed to calculate relationship strength: ${error.message}`);
  }
}

export async function calculateSkillProximity(skill1, skill2, options = {}) {
  try {
    const { includeCooccurrence = true, includeCompatibility = true } = options;
    
    const proximity = {
      jaccardSimilarity: calculateJaccardSimilarity(skill1, skill2),
      cooccurrence: includeCooccurrence ? await getSkillCooccurrence(skill1, skill2) : 0,
      compatibility: includeCompatibility ? await calculateSkillCompatibility(skill1, skill2) : 0,
      semanticSimilarity: await getSemanticSimilarity(skill1, skill2)
    };
    
    proximity.overallScore = calculateOverallProximity(proximity);
    
    return proximity;
  } catch (error) {
    console.error("Error in calculateSkillProximity:", error);
    throw new Error(`Failed to calculate skill proximity: ${error.message}`);
  }
}

export async function calculateCompanySimilarity(company1, company2, options = {}) {
  try {
    const { includeSize = true, includeIndustry = true, includeLocation = true } = options;
    
    const similarity = {
      industry: includeIndustry ? await getIndustrySimilarity(company1, company2) : 0,
      size: includeSize ? await getSizeSimilarity(company1, company2) : 0,
      location: includeLocation ? await getLocationSimilarity(company1, company2) : 0,
      talentFlow: await getTalentFlowSimilarity(company1, company2),
      marketPosition: await getMarketPositionSimilarity(company1, company2)
    };
    
    similarity.overallScore = calculateOverallSimilarity(similarity);
    
    return similarity;
  } catch (error) {
    console.error("Error in calculateCompanySimilarity:", error);
    throw new Error(`Failed to calculate company similarity: ${error.message}`);
  }
}

export async function calculateCandidateInfluence(candidateId, options = {}) {
  try {
    const { includeNetwork = true, includeSkills = true, includeExperience = true } = options;
    
    const influence = {
      networkCentrality: includeNetwork ? await calculateNetworkCentrality(candidateId) : 0,
      skillInfluence: includeSkills ? await calculateSkillInfluence(candidateId) : 0,
      experienceInfluence: includeExperience ? await calculateExperienceInfluence(candidateId) : 0,
      companyInfluence: await calculateCompanyInfluence(candidateId),
      careerProgression: await calculateCareerProgressionInfluence(candidateId)
    };
    
    influence.overallScore = calculateOverallInfluence(influence);
    
    return influence;
  } catch (error) {
    console.error("Error in calculateCandidateInfluence:", error);
    throw new Error(`Failed to calculate candidate influence: ${error.message}`);
  }
}

export async function calculateGraphMetrics(graph, options = {}) {
  try {
    const { includeCentrality = true, includeClustering = true, includeResilience = true } = options;
    
    const metrics = {
      basic: calculateBasicMetrics(graph),
      centrality: includeCentrality ? await calculateGraphCentrality(graph) : {},
      clustering: includeClustering ? calculateClusteringMetrics(graph) : {},
      resilience: includeResilience ? await calculateResilienceMetrics(graph) : {},
      dynamics: calculateDynamicMetrics(graph)
    };
    
    return metrics;
  } catch (error) {
    console.error("Error in calculateGraphMetrics:", error);
    throw new Error(`Failed to calculate graph metrics: ${error.message}`);
  }
}

export async function updateGraphScores(graphId, scoringData) {
  try {
    const TalentGraph = await import("../../models/talentGraph.model.js");
    
    const graph = await TalentGraph.default.findById(graphId);
    if (!graph) {
      throw new Error("Graph not found");
    }
    
    // Update node scores
    if (scoringData.nodeScores) {
      for (const [nodeId, score] of Object.entries(scoringData.nodeScores)) {
        await graph.updateNodeScore(nodeId, score);
      }
    }
    
    // Update edge strengths
    if (scoringData.edgeStrengths) {
      for (const [edgeId, strength] of Object.entries(scoringData.edgeStrengths)) {
        await graph.updateEdgeStrength(edgeId, strength);
      }
    }
    
    // Update scoring maps
    if (scoringData.relationshipStrength) {
      for (const [key, data] of Object.entries(scoringData.relationshipStrength)) {
        graph.scoring.relationshipStrength.set(key, {
          strength: data.strength,
          confidence: data.confidence || 0.5,
          lastUpdated: new Date()
        });
      }
    }
    
    if (scoringData.skillProximity) {
      for (const [key, data] of Object.entries(scoringData.skillProximity)) {
        graph.scoring.skillProximity.set(key, {
          proximity: data.proximity,
          cooccurrence: data.cooccurrence || 0,
          compatibility: data.compatibility || 0.5,
          lastUpdated: new Date()
        });
      }
    }
    
    if (scoringData.companySimilarity) {
      for (const [key, data] of Object.entries(scoringData.companySimilarity)) {
        graph.scoring.companySimilarity.set(key, {
          similarity: data.similarity,
          industry: data.industry || 0,
          size: data.size || 0,
          location: data.location || 0,
          lastUpdated: new Date()
        });
      }
    }
    
    if (scoringData.candidateInfluence) {
      for (const [key, data] of Object.entries(scoringData.candidateInfluence)) {
        graph.scoring.candidateInfluence.set(key, {
          influence: data.influence,
          reach: data.reach || 0,
          centrality: data.centrality || {
            degree: 0,
            betweenness: 0,
            closeness: 0,
            eigenvector: 0
          },
          lastUpdated: new Date()
        });
      }
    }
    
    await graph.save();
    
    return {
      success: true,
      graphId,
      updatedNodes: Object.keys(scoringData.nodeScores || {}).length,
      updatedEdges: Object.keys(scoringData.edgeStrengths || {}).length
    };
  } catch (error) {
    console.error("Error updating graph scores:", error);
    throw new Error(`Failed to update graph scores: ${error.message}`);
  }
}

async function calculateStrengthWithAI(graph, relationshipType) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const edges = graph.edges.filter(edge => edge.type === relationshipType);
    
    const response = await axios.default.post(
      `${AI_BASE_URL}/graph/calculate-strength`,
      {
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          type: edge.type,
          metadata: edge.metadata
        })),
        relationshipType
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 15000
      }
    );

    return response.data.strengths || {};
  } catch (error) {
    console.warn("AI strength calculation failed, using rules:", error.message);
    return await calculateStrengthWithRules(graph, relationshipType);
  }
}

async function calculateStrengthWithRules(graph, relationshipType) {
  try {
    const strengths = {};
    const edges = graph.edges.filter(edge => edge.type === relationshipType);
    
    edges.forEach(edge => {
      const strength = calculateRuleBasedStrength(edge, graph);
      strengths[edge.id] = strength;
    });
    
    return strengths;
  } catch (error) {
    console.error("Error calculating strength with rules:", error);
    return {};
  }
}

function calculateRuleBasedStrength(edge, graph) {
  try {
    let strength = 0.5;
    
    // Base strength from existing data
    strength = edge.strength || 0.5;
    
    // Adjust based on frequency
    if (edge.frequency > 1) {
      strength += Math.min(edge.frequency * 0.05, 0.3);
    }
    
    // Adjust based on node types
    const sourceNode = graph.nodes.find(n => n.id === edge.source);
    const targetNode = graph.nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      // Same type nodes get higher strength
      if (sourceNode.type === targetNode.type) {
        strength += 0.1;
      }
      
      // High influence nodes get higher strength
      if (sourceNode.influence > 0.7 && targetNode.influence > 0.7) {
        strength += 0.2;
      }
    }
    
    // Adjust based on relationship type
    const typeWeights = {
      'knows': 0.6,
      'works_at': 0.8,
      'has_skill': 0.7,
      'in_industry': 0.5,
      'recruited_by': 0.9,
      'colleague': 0.7,
      'classmate': 0.8,
      'similar_skills': 0.6,
      'career_progression': 0.8,
      'company_transition': 0.7,
      'skill_adjacency': 0.6,
      'network_connection': 0.5
    };
    
    strength *= (typeWeights[edge.type] || 0.5);
    
    return Math.min(strength, 1.0);
  } catch (error) {
    console.error("Error calculating rule-based strength:", error);
    return 0.5;
  }
}

function getDefaultStrengthScores(graph) {
  try {
    const strengths = {};
    
    graph.edges.forEach(edge => {
      strengths[edge.id] = edge.strength || 0.5;
    });
    
    return strengths;
  } catch (error) {
    console.error("Error getting default strength scores:", error);
    return {};
  }
}

function calculateJaccardSimilarity(skill1, skill2) {
  try {
    const set1 = new Set([skill1.toLowerCase()]);
    const set2 = new Set([skill2.toLowerCase()]);
    
    const intersection = new Set([...set1].filter(skill => set2.has(skill)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  } catch (error) {
    console.error("Error calculating Jaccard similarity:", error);
    return 0;
  }
}

async function getSkillCooccurrence(skill1, skill2) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const candidates = await SourcingCandidate.default.find({
      skills: { $all: [skill1, skill2] }
    }).lean();
    
    const totalCandidates = await SourcingCandidate.default.countDocuments({
      skills: { $in: [skill1, skill2] }
    });
    
    if (totalCandidates === 0) return 0;
    
    return candidates.length / totalCandidates;
  } catch (error) {
    console.error("Error getting skill cooccurrence:", error);
    return 0;
  }
}

async function calculateSkillCompatibility(skill1, skill2) {
  try {
    const compatibilityMatrix = {
      'javascript': { 'react': 0.9, 'node.js': 0.9, 'typescript': 0.8, 'vue': 0.7 },
      'python': { 'django': 0.9, 'flask': 0.8, 'machine learning': 0.8, 'data science': 0.7 },
      'react': { 'javascript': 0.9, 'typescript': 0.8, 'redux': 0.8, 'next.js': 0.7 },
      'aws': { 'docker': 0.8, 'kubernetes': 0.7, 'lambda': 0.9, 'ec2': 0.8 },
      'docker': { 'kubernetes': 0.9, 'aws': 0.8, 'microservices': 0.7, 'devops': 0.8 }
    };
    
    const skill1Lower = skill1.toLowerCase();
    const skill2Lower = skill2.toLowerCase();
    
    if (compatibilityMatrix[skill1Lower] && compatibilityMatrix[skill1Lower][skill2Lower]) {
      return compatibilityMatrix[skill1Lower][skill2Lower];
    }
    
    if (compatibilityMatrix[skill2Lower] && compatibilityMatrix[skill2Lower][skill1Lower]) {
      return compatibilityMatrix[skill2Lower][skill1Lower];
    }
    
    // Default compatibility based on category
    const categories = {
      'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
      'backend': ['node.js', 'python', 'java', 'c#', 'go', 'ruby', 'php'],
      'database': ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch'],
      'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform'],
      'devops': ['jenkins', 'gitlab', 'github', 'ci/cd', 'ansible', 'puppet']
    };
    
    for (const [category, skills] of Object.entries(categories)) {
      if (skills.includes(skill1Lower) && skills.includes(skill2Lower)) {
        return 0.7; // Same category compatibility
      }
    }
    
    return 0.3; // Default low compatibility
  } catch (error) {
    console.error("Error calculating skill compatibility:", error);
    return 0.3;
  }
}

async function getSemanticSimilarity(skill1, skill2) {
  try {
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    if (!aiAvailable) {
      return calculateRuleBasedSemanticSimilarity(skill1, skill2);
    }
    
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const response = await axios.default.post(
      `${AI_BASE_URL}/embed/semantic-similarity`,
      {
        text1: skill1,
        text2: skill2
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 10000
      }
    );

    return response.data.similarity || 0;
  } catch (error) {
    console.warn("Semantic similarity failed, using rules:", error.message);
    return calculateRuleBasedSemanticSimilarity(skill1, skill2);
  }
}

function calculateRuleBasedSemanticSimilarity(skill1, skill2) {
  try {
    const skill1Lower = skill1.toLowerCase();
    const skill2Lower = skill2.toLowerCase();
    
    // Exact match
    if (skill1Lower === skill2Lower) return 1.0;
    
    // Substring match
    if (skill1Lower.includes(skill2Lower) || skill2Lower.includes(skill1Lower)) {
      return 0.8;
    }
    
    // Common prefixes/suffixes
    const commonPrefixes = ['java', 'python', 'react', 'angular', 'vue', 'node'];
    for (const prefix of commonPrefixes) {
      if (skill1Lower.startsWith(prefix) && skill2Lower.startsWith(prefix)) {
        return 0.6;
      }
    }
    
    // Common suffixes
    const commonSuffixes = ['.js', '.py', 'script', 'framework', 'library'];
    for (const suffix of commonSuffixes) {
      if (skill1Lower.endsWith(suffix) && skill2Lower.endsWith(suffix)) {
        return 0.5;
      }
    }
    
    return 0.1; // Low similarity
  } catch (error) {
    console.error("Error calculating rule-based semantic similarity:", error);
    return 0.1;
  }
}

function calculateOverallProximity(proximity) {
  try {
    const weights = {
      jaccardSimilarity: 0.2,
      cooccurrence: 0.3,
      compatibility: 0.3,
      semanticSimilarity: 0.2
    };
    
    let score = 0;
    for (const [metric, weight] of Object.entries(weights)) {
      score += (proximity[metric] || 0) * weight;
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating overall proximity:", error);
    return 0.5;
  }
}

async function getIndustrySimilarity(company1, company2) {
  try {
    const industry1 = await getCompanyIndustry(company1);
    const industry2 = await getCompanyIndustry(company2);
    
    if (industry1 === industry2) return 1.0;
    
    // Industry similarity matrix
    const industrySimilarity = {
      'technology': ['software', 'internet', 'fintech', 'healthtech'],
      'finance': ['banking', 'insurance', 'investment', 'fintech'],
      'healthcare': ['medical', 'pharmaceutical', 'healthtech', 'biotech'],
      'consulting': ['management', 'strategy', 'technology', 'finance']
    };
    
    for (const [industry, related] of Object.entries(industrySimilarity)) {
      if (related.includes(industry1) && related.includes(industry2)) {
        return 0.7;
      }
    }
    
    return 0.1;
  } catch (error) {
    console.error("Error getting industry similarity:", error);
    return 0.1;
  }
}

async function getSizeSimilarity(company1, company2) {
  try {
    const size1 = await getCompanySize(company1);
    const size2 = await getCompanySize(company2);
    
    if (size1 === 0 || size2 === 0) return 0.5;
    
    const ratio = Math.min(size1, size2) / Math.max(size1, size2);
    return ratio;
  } catch (error) {
    console.error("Error getting size similarity:", error);
    return 0.5;
  }
}

async function getLocationSimilarity(company1, company2) {
  try {
    const location1 = await getCompanyLocation(company1);
    const location2 = await getCompanyLocation(company2);
    
    if (location1 === location2) return 1.0;
    
    // Same country
    if (location1 && location2 && location1.split(',').pop() === location2.split(',').pop()) {
      return 0.6;
    }
    
    return 0.1;
  } catch (error) {
    console.error("Error getting location similarity:", error);
    return 0.1;
  }
}

async function getTalentFlowSimilarity(company1, company2) {
  try {
    const flow1 = await getTalentFlow(company1);
    const flow2 = await getTalentFlow(company2);
    
    const commonDestinations = new Set([
      ...Object.keys(flow1.toCompanies),
      ...Object.keys(flow2.toCompanies)
    ]);
    
    let similarity = 0;
    commonDestinations.forEach(dest => {
      const flow1Count = flow1.toCompanies[dest] || 0;
      const flow2Count = flow2.toCompanies[dest] || 0;
      
      if (flow1Count > 0 && flow2Count > 0) {
        similarity += Math.min(flow1Count, flow2Count) / Math.max(flow1Count, flow2Count);
      }
    });
    
    return commonDestinations.size > 0 ? similarity / commonDestinations.size : 0;
  } catch (error) {
    console.error("Error getting talent flow similarity:", error);
    return 0;
  }
}

async function getMarketPositionSimilarity(company1, company2) {
  try {
    const position1 = await getMarketPosition(company1);
    const position2 = await getMarketPosition(company2);
    
    const positionScores = {
      'leader': 4,
      'established': 3,
      'growing': 2,
      'emerging': 1
    };
    
    const score1 = positionScores[position1] || 2;
    const score2 = positionScores[position2] || 2;
    
    return 1 - Math.abs(score1 - score2) / 3;
  } catch (error) {
    console.error("Error getting market position similarity:", error);
    return 0.5;
  }
}

function calculateOverallSimilarity(similarity) {
  try {
    const weights = {
      industry: 0.3,
      size: 0.2,
      location: 0.2,
      talentFlow: 0.2,
      marketPosition: 0.1
    };
    
    let score = 0;
    for (const [metric, weight] of Object.entries(weights)) {
      score += (similarity[metric] || 0) * weight;
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating overall similarity:", error);
    return 0.5;
  }
}

async function calculateNetworkCentrality(candidateId) {
  try {
    const TalentGraph = await import("../../models/talentGraph.model.js");
    
    const graphs = await TalentGraph.default.find({
      "nodes.id": candidateId,
      isActive: true
    });
    
    let maxCentrality = 0;
    
    graphs.forEach(graph => {
      const centrality = graph.calculateCentrality(candidateId);
      if (centrality) {
        const avgCentrality = (
          centrality.degree + 
          centrality.betweenness + 
          centrality.closeness + 
          centrality.eigenvector
        ) / 4;
        
        maxCentrality = Math.max(maxCentrality, avgCentrality);
      }
    });
    
    return maxCentrality;
  } catch (error) {
    console.error("Error calculating network centrality:", error);
    return 0;
  }
}

async function calculateSkillInfluence(candidateId) {
  try {
    const candidate = await getCandidateData(candidateId);
    
    if (!candidate || !candidate.skills) return 0;
    
    // Calculate influence based on skill rarity and demand
    const skillInfluence = await Promise.all(
      candidate.skills.map(async skill => {
        const demand = await getSkillDemand(skill);
        const rarity = await getSkillRarity(skill);
        return demand * (1 - rarity); // High demand, low rarity = high influence
      })
    );
    
    const avgInfluence = skillInfluence.reduce((sum, inf) => sum + inf, 0) / skillInfluence.length;
    
    return Math.min(avgInfluence, 1.0);
  } catch (error) {
    console.error("Error calculating skill influence:", error);
    return 0;
  }
}

async function calculateExperienceInfluence(candidateId) {
  try {
    const candidate = await getCandidateData(candidateId);
    
    if (!candidate) return 0;
    
    const experience = candidate.totalExperience || 0;
    
    // Experience influence peaks at 10-15 years
    if (experience < 2) return 0.1;
    if (experience < 5) return 0.3;
    if (experience < 10) return 0.6;
    if (experience < 15) return 0.8;
    if (experience < 20) return 0.7;
    return 0.5;
  } catch (error) {
    console.error("Error calculating experience influence:", error);
    return 0;
  }
}

async function calculateCompanyInfluence(candidateId) {
  try {
    const candidate = await getCandidateData(candidateId);
    
    if (!candidate || !candidate.currentCompany) return 0;
    
    const companyInfluence = await getCompanyInfluence(candidate.currentCompany);
    
    return companyInfluence;
  } catch (error) {
    console.error("Error calculating company influence:", error);
    return 0;
  }
}

async function calculateCareerProgressionInfluence(candidateId) {
  try {
    const candidate = await getCandidateData(candidateId);
    
    if (!candidate || !candidate.experience) return 0;
    
    const careerProgression = analyzeCareerProgression(candidate.experience);
    
    return careerProgression.influence;
  } catch (error) {
    console.error("Error calculating career progression influence:", error);
    return 0;
  }
}

function calculateOverallInfluence(influence) {
  try {
    const weights = {
      networkCentrality: 0.3,
      skillInfluence: 0.25,
      experienceInfluence: 0.2,
      companyInfluence: 0.15,
      careerProgression: 0.1
    };
    
    let score = 0;
    for (const [metric, weight] of Object.entries(weights)) {
      score += (influence[metric] || 0) * weight;
    }
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating overall influence:", error);
    return 0.5;
  }
}

function calculateBasicMetrics(graph) {
  try {
    return {
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      density: graph.graphMetadata.density || 0,
      avgDegree: graph.nodes.length > 0 ? (graph.edges.length * 2) / graph.nodes.length : 0,
      maxDegree: calculateMaxDegree(graph),
      minDegree: calculateMinDegree(graph)
    };
  } catch (error) {
    console.error("Error calculating basic metrics:", error);
    return {};
  }
}

async function calculateGraphCentrality(graph) {
  try {
    const centralities = {};
    
    graph.nodes.forEach(node => {
      const centrality = graph.calculateCentrality(node.id);
      if (centrality) {
        centralities[node.id] = centrality;
      }
    });
    
    const avgCentralities = {
      degree: 0,
      betweenness: 0,
      closeness: 0,
      eigenvector: 0
    };
    
    const centralityCount = Object.keys(centralities).length;
    if (centralityCount > 0) {
      Object.values(centralities).forEach(centrality => {
        avgCentralities.degree += centrality.degree;
        avgCentralities.betweenness += centrality.betweenness;
        avgCentralities.closeness += centrality.closeness;
        avgCentralities.eigenvector += centrality.eigenvector;
      });
      
      Object.keys(avgCentralities).forEach(key => {
        avgCentralities[key] /= centralityCount;
      });
    }
    
    return {
      centralities,
      avgCentralities,
      maxCentralities: getMaxCentralities(centralities)
    };
  } catch (error) {
    console.error("Error calculating graph centrality:", error);
    return {};
  }
}

function calculateClusteringMetrics(graph) {
  try {
    const communities = graph.detectCommunities();
    const modularity = graph.calculateModularity(communities);
    
    const clusteringCoefficients = {};
    graph.nodes.forEach(node => {
      clusteringCoefficients[node.id] = calculateLocalClustering(node.id, graph);
    });
    
    const avgClustering = Object.values(clusteringCoefficients)
      .reduce((sum, coeff) => sum + coeff, 0) / Object.keys(clusteringCoefficients).length;
    
    return {
      communities: communities.size,
      modularity,
      localClustering: clusteringCoefficients,
      avgClustering,
      communitySizes: getCommunitySizes(communities)
    };
  } catch (error) {
    console.error("Error calculating clustering metrics:", error);
    return {};
  }
}

function calculateLocalClustering(nodeId, graph) {
  try {
    const neighbors = graph.getNeighbors(nodeId, 1);
    
    if (neighbors.length < 2) return 0;
    
    let neighborConnections = 0;
    
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        if (graph.edges.some(edge => 
          (edge.source === neighbors[i] && edge.target === neighbors[j]) ||
          (edge.source === neighbors[j] && edge.target === neighbors[i])
        )) {
          neighborConnections++;
        }
      }
    }
    
    const possibleConnections = (neighbors.length * (neighbors.length - 1)) / 2;
    
    return possibleConnections > 0 ? neighborConnections / possibleConnections : 0;
  } catch (error) {
    console.error("Error calculating local clustering:", error);
    return 0;
  }
}

function getCommunitySizes(communities) {
  try {
    const sizes = {};
    
    communities.forEach((communityId, nodeId) => {
      sizes[communityId] = (sizes[communityId] || 0) + 1;
    });
    
    return sizes;
  } catch (error) {
    console.error("Error getting community sizes:", error);
    return {};
  }
}

async function calculateResilienceMetrics(graph) {
  try {
    const resilience = {
      connectivity: calculateConnectivityResilience(graph),
      redundancy: calculateRedundancy(graph),
      vulnerability: calculateVulnerability(graph),
      robustness: calculateRobustness(graph)
    };
    
    return resilience;
  } catch (error) {
    console.error("Error calculating resilience metrics:", error);
    return {};
  }
}

function calculateConnectivityResilience(graph) {
  try {
    const avgDegree = (graph.edges.length * 2) / graph.nodes.length;
    
    // Higher average degree = more resilient
    return Math.min(avgDegree / 10, 1.0);
  } catch (error) {
    console.error("Error calculating connectivity resilience:", error);
    return 0.5;
  }
}

function calculateRedundancy(graph) {
  try {
    const nodeDegrees = {};
    
    graph.nodes.forEach(node => {
      const degree = graph.edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length;
      nodeDegrees[node.id] = degree;
    });
    
    const avgDegree = Object.values(nodeDegrees)
      .reduce((sum, degree) => sum + degree, 0) / Object.keys(nodeDegrees).length;
    
    // More nodes with degree > 1 = more redundant
    const redundantNodes = Object.values(nodeDegrees)
      .filter(degree => degree > 1).length;
    
    return redundantNodes / graph.nodes.length;
  } catch (error) {
    console.error("Error calculating redundancy:", error);
    return 0.5;
  }
}

function calculateVulnerability(graph) {
  try {
    // Find articulation points (nodes whose removal would disconnect the graph)
    const articulationPoints = findArticulationPoints(graph);
    
    // More articulation points = more vulnerable
    return articulationPoints.length / graph.nodes.length;
  } catch (error) {
    console.error("Error calculating vulnerability:", error);
    return 0.5;
  }
}

function calculateRobustness(graph) {
  try {
    const connectivity = calculateConnectivityResilience(graph);
    const redundancy = calculateRedundancy(graph);
    const vulnerability = calculateVulnerability(graph);
    
    // Robustness = high connectivity + high redundancy - low vulnerability
    return Math.max(0, (connectivity + redundancy - vulnerability) / 2);
  } catch (error) {
    console.error("Error calculating robustness:", error);
    return 0.5;
  }
}

function findArticulationPoints(graph) {
  try {
    // Simplified articulation point detection
    const articulationPoints = [];
    
    graph.nodes.forEach(node => {
      const degree = graph.edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length;
      
      // Nodes with degree 1 are not articulation points
      if (degree === 1) return;
      
      // Check if removing this node would disconnect the graph
      const neighbors = graph.getNeighbors(node.id, 1);
      
      if (neighbors.length > 0) {
        // Simple heuristic: if node connects different communities, it might be an articulation point
        const communities = graph.detectCommunities();
        const nodeCommunity = communities.get(node.id);
        
        const neighborCommunities = new Set();
        neighbors.forEach(neighborId => {
          neighborCommunities.add(communities.get(neighborId));
        });
        
        if (neighborCommunities.size > 1) {
          articulationPoints.push(node.id);
        }
      }
    });
    
    return articulationPoints;
  } catch (error) {
    console.error("Error finding articulation points:", error);
    return [];
  }
}

function calculateDynamicMetrics(graph) {
  try {
    return {
      growthRate: calculateGrowthRate(graph),
      stability: calculateStability(graph),
      evolution: calculateEvolution(graph),
      churn: calculateChurn(graph)
    };
  } catch (error) {
    console.error("Error calculating dynamic metrics:", error);
    return {};
  }
}

function calculateGrowthRate(graph) {
  try {
    // Calculate growth based on creation timestamps
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentNodes = graph.nodes.filter(node => 
      new Date(node.createdAt) > oneMonthAgo
    ).length;
    
    const growthRate = graph.nodes.length > 0 ? recentNodes / graph.nodes.length : 0;
    
    return growthRate;
  } catch (error) {
    console.error("Error calculating growth rate:", error);
    return 0;
  }
}

function calculateStability(graph) {
  try {
    // Calculate stability based on update frequency
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const updatedNodes = graph.nodes.filter(node => 
      new Date(node.updatedAt) > oneMonthAgo
    ).length;
    
    const stability = graph.nodes.length > 0 ? 1 - (updatedNodes / graph.nodes.length) : 1;
    
    return stability;
  } catch (error) {
    console.error("Error calculating stability:", error);
    return 0.5;
  }
}

function calculateEvolution(graph) {
  try {
    // Calculate evolution based on node and edge changes over time
    const nodeEvolution = calculateNodeEvolution(graph);
    const edgeEvolution = calculateEdgeEvolution(graph);
    
    return {
      nodeEvolution,
      edgeEvolution,
      overallEvolution: (nodeEvolution + edgeEvolution) / 2
    };
  } catch (error) {
    console.error("Error calculating evolution:", error);
    return { nodeEvolution: 0, edgeEvolution: 0, overallEvolution: 0 };
  }
}

function calculateNodeEvolution(graph) {
  try {
    const nodeAges = graph.nodes.map(node => 
      (new Date() - new Date(node.createdAt)) / (1000 * 60 * 60 * 24) // days
    );
    
    const avgAge = nodeAges.reduce((sum, age) => sum + age, 0) / nodeAges.length;
    
    // Younger graph = more evolution
    return Math.max(0, 1 - (avgAge / 365)); // Normalize to 1 year
  } catch (error) {
    console.error("Error calculating node evolution:", error);
    return 0.5;
  }
}

function calculateEdgeEvolution(graph) {
  try {
    const edgeAges = graph.edges.map(edge => 
      (new Date() - new Date(edge.createdAt)) / (1000 * 60 * 60 * 24) // days
    );
    
    const avgAge = edgeAges.reduce((sum, age) => sum + age, 0) / edgeAges.length;
    
    // Younger edges = more evolution
    return Math.max(0, 1 - (avgAge / 365)); // Normalize to 1 year
  } catch (error) {
    console.error("Error calculating edge evolution:", error);
    return 0.5;
  }
}

function calculateChurn(graph) {
  try {
    // Calculate churn based on inactive nodes
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const inactiveNodes = graph.nodes.filter(node => 
      new Date(node.updatedAt) < threeMonthsAgo
    ).length;
    
    const churn = graph.nodes.length > 0 ? inactiveNodes / graph.nodes.length : 0;
    
    return churn;
  } catch (error) {
    console.error("Error calculating churn:", error);
    return 0;
  }
}

function calculateMaxDegree(graph) {
  try {
    const degrees = {};
    
    graph.nodes.forEach(node => {
      degrees[node.id] = graph.edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length;
    });
    
    return Math.max(...Object.values(degrees), 0);
  } catch (error) {
    console.error("Error calculating max degree:", error);
    return 0;
  }
}

function calculateMinDegree(graph) {
  try {
    const degrees = {};
    
    graph.nodes.forEach(node => {
      degrees[node.id] = graph.edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      ).length;
    });
    
    return Math.min(...Object.values(degrees), 0);
  } catch (error) {
    console.error("Error calculating min degree:", error);
    return 0;
  }
}

function getMaxCentralities(centralities) {
  try {
    const maxCentralities = {
      degree: 0,
      betweenness: 0,
      closeness: 0,
      eigenvector: 0
    };
    
    Object.values(centralities).forEach(centrality => {
      maxCentralities.degree = Math.max(maxCentralities.degree, centrality.degree);
      maxCentralities.betweenness = Math.max(maxCentralities.betweenness, centrality.betweenness);
      maxCentralities.closeness = Math.max(maxCentralities.closeness, centrality.closeness);
      maxCentralities.eigenvector = Math.max(maxCentralities.eigenvector, centrality.eigenvector);
    });
    
    return maxCentralities;
  } catch (error) {
    console.error("Error getting max centralities:", error);
    return { degree: 0, betweenness: 0, closeness: 0, eigenvector: 0 };
  }
}

async function getCandidateData(candidateId) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    const candidate = await SourcingCandidate.default.findById(candidateId).lean();
    return candidate;
  } catch (error) {
    console.error("Error getting candidate data:", error);
    return null;
  }
}

async function getCompanyIndustry(company) {
  try {
    const industryMap = {
      'google': 'technology',
      'microsoft': 'technology',
      'amazon': 'technology',
      'apple': 'technology',
      'facebook': 'technology',
      'jpmorgan': 'finance',
      'goldman sachs': 'finance',
      'bank of america': 'finance',
      'mckinsey': 'consulting',
      'deloitte': 'consulting',
      'johnson & johnson': 'healthcare',
      'pfizer': 'healthcare'
    };
    
    const companyLower = company.toLowerCase();
    for (const [key, industry] of Object.entries(industryMap)) {
      if (companyLower.includes(key)) {
        return industry;
      }
    }
    
    return 'unknown';
  } catch (error) {
    console.error("Error getting company industry:", error);
    return 'unknown';
  }
}

async function getCompanySize(company) {
  try {
    const sizeMap = {
      'google': 150000,
      'microsoft': 180000,
      'amazon': 1600000,
      'apple': 147000,
      'facebook': 80000,
      'jpmorgan': 250000,
      'goldman sachs': 40000,
      'mckinsey': 30000,
      'deloitte': 350000
    };
    
    const companyLower = company.toLowerCase();
    for (const [key, size] of Object.entries(sizeMap)) {
      if (companyLower.includes(key)) {
        return size;
      }
    }
    
    return 1000; // Default size
  } catch (error) {
    console.error("Error getting company size:", error);
    return 1000;
  }
}

async function getCompanyLocation(company) {
  try {
    const locationMap = {
      'google': 'Mountain View, CA, USA',
      'microsoft': 'Redmond, WA, USA',
      'amazon': 'Seattle, WA, USA',
      'apple': 'Cupertino, CA, USA',
      'facebook': 'Menlo Park, CA, USA',
      'jpmorgan': 'New York, NY, USA',
      'goldman sachs': 'New York, NY, USA',
      'mckinsey': 'New York, NY, USA'
    };
    
    const companyLower = company.toLowerCase();
    for (const [key, location] of Object.entries(locationMap)) {
      if (companyLower.includes(key)) {
        return location;
      }
    }
    
    return 'Unknown';
  } catch (error) {
    console.error("Error getting company location:", error);
    return 'Unknown';
  }
}

async function getTalentFlow(company) {
  try {
    return {
      toCompanies: {},
      fromCompanies: {},
      netFlow: 0
    };
  } catch (error) {
    console.error("Error getting talent flow:", error);
    return { toCompanies: {}, fromCompanies: {}, netFlow: 0 };
  }
}

async function getMarketPosition(company) {
  try {
    const positionMap = {
      'google': 'leader',
      'microsoft': 'leader',
      'amazon': 'leader',
      'apple': 'leader',
      'facebook': 'established',
      'mckinsey': 'leader',
      'deloitte': 'established'
    };
    
    const companyLower = company.toLowerCase();
    for (const [key, position] of Object.entries(positionMap)) {
      if (companyLower.includes(key)) {
        return position;
      }
    }
    
    return 'emerging';
  } catch (error) {
    console.error("Error getting market position:", error);
    return 'emerging';
  }
}

async function getSkillDemand(skill) {
  try {
    const demandMap = {
      'javascript': 0.9,
      'python': 0.85,
      'react': 0.8,
      'node.js': 0.75,
      'aws': 0.8,
      'docker': 0.7,
      'kubernetes': 0.75,
      'machine learning': 0.9,
      'data science': 0.85
    };
    
    const skillLower = skill.toLowerCase();
    for (const [key, demand] of Object.entries(demandMap)) {
      if (skillLower.includes(key)) {
        return demand;
      }
    }
    
    return 0.5; // Default demand
  } catch (error) {
    console.error("Error getting skill demand:", error);
    return 0.5;
  }
}

async function getSkillRarity(skill) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const totalCandidates = await SourcingCandidate.default.countDocuments();
    const skillCandidates = await SourcingCandidate.default.countDocuments({
      skills: skill
    });
    
    return totalCandidates > 0 ? 1 - (skillCandidates / totalCandidates) : 0.5;
  } catch (error) {
    console.error("Error getting skill rarity:", error);
    return 0.5;
  }
}

async function getCompanyInfluence(company) {
  try {
    const influenceMap = {
      'google': 0.95,
      'microsoft': 0.9,
      'amazon': 0.9,
      'apple': 0.9,
      'facebook': 0.85,
      'jpmorgan': 0.8,
      'goldman sachs': 0.8,
      'mckinsey': 0.75,
      'deloitte': 0.7
    };
    
    const companyLower = company.toLowerCase();
    for (const [key, influence] of Object.entries(influenceMap)) {
      if (companyLower.includes(key)) {
        return influence;
      }
    }
    
    return 0.5; // Default influence
  } catch (error) {
    console.error("Error getting company influence:", error);
    return 0.5;
  }
}

function analyzeCareerProgression(experience) {
  try {
    if (!experience || experience.length === 0) {
      return { influence: 0.3, progression: 'stable' };
    }
    
    const levels = experience.map(exp => getLevelScore(exp.role));
    const progression = levels[levels.length - 1] - levels[0];
    
    let influence = 0.5;
    
    if (progression > 2) influence = 0.8;
    else if (progression > 1) influence = 0.6;
    else if (progression > 0) influence = 0.5;
    else if (progression < -1) influence = 0.3;
    
    return {
      influence,
      progression: progression > 1 ? 'rapid' : progression > 0 ? 'steady' : 'declining'
    };
  } catch (error) {
    console.error("Error analyzing career progression:", error);
    return { influence: 0.3, progression: 'stable' };
  }
}

function getLevelScore(role) {
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
    console.error("Error getting level score:", error);
    return 3;
  }
}
