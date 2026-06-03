import { checkAiHealth } from "../../../sourcing/ai/aiServiceClient.js";

export async function generateSkillClusters(skill, options = {}) {
  try {
    const { depth = 2, minClusterSize = 3, includeEmerging = true } = options;
    
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    if (aiAvailable) {
      return await generateClustersWithAI(skill, depth, minClusterSize, includeEmerging);
    } else {
      return await generateClustersWithRules(skill, depth, minClusterSize, includeEmerging);
    }
  } catch (error) {
    console.error("Error in generateSkillClusters:", error);
    throw new Error(`Failed to generate skill clusters: ${error.message}`);
  }
}

export async function getEmergingSkillCombinations(timeRange = '6m') {
  try {
    const combinations = await identifyEmergingCombinations(timeRange);
    
    return {
      combinations,
      trends: analyzeCombinationTrends(combinations),
      predictions: predictFutureCombinations(combinations)
    };
  } catch (error) {
    console.error("Error in getEmergingSkillCombinations:", error);
    throw new Error(`Failed to get emerging skill combinations: ${error.message}`);
  }
}

export async function getAdjacentTechnicalStacks(skill, depth = 2) {
  try {
    const adjacentStacks = await findAdjacentStacks(skill, depth);
    
    return {
      centralSkill: skill,
      adjacentStacks,
      compatibility: calculateStackCompatibility(skill, adjacentStacks),
      recommendations: generateStackRecommendations(skill, adjacentStacks)
    };
  } catch (error) {
    console.error("Error in getAdjacentTechnicalStacks:", error);
    throw new Error(`Failed to get adjacent technical stacks: ${error.message}`);
  }
}

export async function getHighDemandSkillGroups(timeRange = '3m') {
  try {
    const skillGroups = await identifyHighDemandGroups(timeRange);
    
    return {
      skillGroups,
      demandMetrics: calculateDemandMetrics(skillGroups),
      marketInsights: generateMarketInsights(skillGroups),
      salaryTrends: analyzeSalaryTrends(skillGroups)
    };
  } catch (error) {
    console.error("Error in getHighDemandSkillGroups:", error);
    throw new Error(`Failed to get high demand skill groups: ${error.message}`);
  }
}

export async function analyzeSkillProximity(skill1, skill2) {
  try {
    const proximity = await calculateSkillProximity(skill1, skill2);
    
    return {
      skill1,
      skill2,
      proximity,
      relationship: determineSkillRelationship(skill1, skill2, proximity),
      recommendations: generateProximityRecommendations(skill1, skill2, proximity)
    };
  } catch (error) {
    console.error("Error in analyzeSkillProximity:", error);
    throw new Error(`Failed to analyze skill proximity: ${error.message}`);
  }
}

export async function getSkillEvolutionPath(skill, timeRange = '2y') {
  try {
    const evolutionPath = await traceSkillEvolution(skill, timeRange);
    
    return {
      skill,
      evolutionPath,
      futurePredictions: predictSkillEvolution(evolutionPath),
      relatedSkills: findRelatedEvolutionSkills(skill, evolutionPath)
    };
  } catch (error) {
    console.error("Error in getSkillEvolutionPath:", error);
    throw new Error(`Failed to get skill evolution path: ${error.message}`);
  }
}

async function generateClustersWithAI(skill, depth, minClusterSize, includeEmerging) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const response = await axios.default.post(
      `${AI_BASE_URL}/graph/skill-clusters`,
      {
        skill,
        depth,
        minClusterSize,
        includeEmerging
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 15000
      }
    );

    return response.data.clusters || [];
  } catch (error) {
    console.warn("AI skill clustering failed, using rules:", error.message);
    return await generateClustersWithRules(skill, depth, minClusterSize, includeEmerging);
  }
}

async function generateClustersWithRules(skill, depth, minClusterSize, includeEmerging) {
  try {
    const candidates = await getSkillCandidates(skill);
    const skillMatrix = buildSkillMatrix(candidates);
    const clusters = performClustering(skillMatrix, minClusterSize);
    
    if (includeEmerging) {
      const emergingClusters = identifyEmergingClusters(candidates);
      clusters.push(...emergingClusters);
    }
    
    return clusters;
  } catch (error) {
    console.error("Error generating clusters with rules:", error);
    return [];
  }
}

function buildSkillMatrix(candidates) {
  try {
    const allSkills = new Set();
    const skillMatrix = [];
    
    candidates.forEach(candidate => {
      const skills = candidate.skills || [];
      skills.forEach(skill => allSkills.add(skill));
    });
    
    candidates.forEach(candidate => {
      const skills = candidate.skills || [];
      const vector = Array.from(allSkills).map(skill => 
        skills.includes(skill) ? 1 : 0
      );
      skillMatrix.push({ candidateId: candidate._id, vector, skills });
    });
    
    return { matrix: skillMatrix, skills: Array.from(allSkills) };
  } catch (error) {
    console.error("Error building skill matrix:", error);
    return { matrix: [], skills: [] };
  }
}

function performClustering(skillMatrix, minClusterSize) {
  try {
    const clusters = [];
    const processed = new Set();
    
    skillMatrix.matrix.forEach((item, index) => {
      if (processed.has(item.candidateId)) return;
      
      const cluster = findSimilarSkills(item, skillMatrix, processed, minClusterSize);
      if (cluster.length >= minClusterSize) {
        clusters.push(cluster);
        cluster.forEach(c => processed.add(c.candidateId));
      }
    });
    
    return clusters;
  } catch (error) {
    console.error("Error performing clustering:", error);
    return [];
  }
}

function findSimilarSkills(targetItem, skillMatrix, processed, minClusterSize) {
  try {
    const cluster = [targetItem];
    const threshold = 0.7;
    
    skillMatrix.matrix.forEach(item => {
      if (processed.has(item.candidateId) || item.candidateId === targetItem.candidateId) return;
      
      const similarity = calculateCosineSimilarity(targetItem.vector, item.vector);
      if (similarity >= threshold) {
        cluster.push(item);
      }
    });
    
    return cluster;
  } catch (error) {
    console.error("Error finding similar skills:", error);
    return [];
  }
}

function calculateCosineSimilarity(vector1, vector2) {
  try {
    if (vector1.length !== vector2.length) return 0;
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      magnitude1 += vector1[i] * vector1[i];
      magnitude2 += vector2[i] * vector2[i];
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  } catch (error) {
    console.error("Error calculating cosine similarity:", error);
    return 0;
  }
}

async function identifyEmergingClusters(candidates) {
  try {
    const recentCandidates = candidates.filter(c => 
      new Date(c.createdAt) > new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
    );
    
    const emergingSkills = findEmergingSkills(recentCandidates);
    const clusters = [];
    
    emergingSkills.forEach(skill => {
      const cluster = {
        id: `emerging-${skill}`,
        type: 'emerging',
        skills: [skill],
        candidates: recentCandidates.filter(c => c.skills?.includes(skill)),
        confidence: calculateEmergingConfidence(skill, recentCandidates),
        growthRate: calculateSkillGrowthRate(skill, recentCandidates)
      };
      
      if (cluster.candidates.length >= 2) {
        clusters.push(cluster);
      }
    });
    
    return clusters;
  } catch (error) {
    console.error("Error identifying emerging clusters:", error);
    return [];
  }
}

function findEmergingSkills(candidates) {
  try {
    const skillCounts = {};
    
    candidates.forEach(candidate => {
      const skills = candidate.skills || [];
      skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    const totalCandidates = candidates.length;
    const emergingSkills = Object.entries(skillCounts)
      .filter(([, count]) => count / totalCandidates > 0.1) // 10%+ of recent candidates
      .map(([skill]) => skill);
    
    return emergingSkills;
  } catch (error) {
    console.error("Error finding emerging skills:", error);
    return [];
  }
}

function calculateEmergingConfidence(skill, candidates) {
  try {
    const skillCandidates = candidates.filter(c => c.skills?.includes(skill));
    const confidence = skillCandidates.length / candidates.length;
    
    return Math.min(confidence * 2, 1.0);
  } catch (error) {
    console.error("Error calculating emerging confidence:", error);
    return 0.5;
  }
}

function calculateSkillGrowthRate(skill, candidates) {
  try {
    const skillCandidates = candidates.filter(c => c.skills?.includes(skill));
    const growthRate = (skillCandidates.length / candidates.length) * 100;
    
    return growthRate;
  } catch (error) {
    console.error("Error calculating skill growth rate:", error);
    return 0;
  }
}

async function identifyEmergingCombinations(timeRange) {
  try {
    const candidates = await getRecentCandidates(timeRange);
    const combinations = [];
    
    candidates.forEach(candidate => {
      const skills = candidate.skills || [];
      if (skills.length >= 2) {
        const skillPairs = generateSkillPairs(skills);
        skillPairs.forEach(pair => {
          combinations.push({
            skills: pair,
            candidateId: candidate._id,
            experience: candidate.totalExperience,
            company: candidate.currentCompany
          });
        });
      }
    });
    
    const groupedCombinations = groupCombinations(combinations);
    const emergingCombos = Object.entries(groupedCombinations)
      .filter(([, combo]) => combo.frequency >= 3)
      .map(([key, combo]) => ({
        skills: key.split('|'),
        frequency: combo.frequency,
        candidates: combo.candidates,
        growthRate: calculateCombinationGrowthRate(combo, timeRange),
        demand: calculateCombinationDemand(combo)
      }));
    
    return emergingCombos.sort((a, b) => b.frequency - a.frequency);
  } catch (error) {
    console.error("Error identifying emerging combinations:", error);
    return [];
  }
}

function generateSkillPairs(skills) {
  try {
    const pairs = [];
    
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        pairs.push([skills[i], skills[j]].sort().join('|'));
      }
    }
    
    return pairs;
  } catch (error) {
    console.error("Error generating skill pairs:", error);
    return [];
  }
}

function groupCombinations(combinations) {
  try {
    const grouped = {};
    
    combinations.forEach(combo => {
      const key = combo.skills;
      if (!grouped[key]) {
        grouped[key] = {
          frequency: 0,
          candidates: [],
          totalExperience: 0
        };
      }
      
      grouped[key].frequency++;
      grouped[key].candidates.push(combo.candidateId);
      grouped[key].totalExperience += combo.experience || 0;
    });
    
    return grouped;
  } catch (error) {
    console.error("Error grouping combinations:", error);
    return {};
  }
}

function calculateCombinationGrowthRate(combo, timeRange) {
  try {
    const avgExperience = combo.totalExperience / combo.candidates.length;
    return Math.min(avgExperience / 10, 1.0) * 100;
  } catch (error) {
    console.error("Error calculating combination growth rate:", error);
    return 0;
  }
}

function calculateCombinationDemand(combo) {
  try {
    return Math.min((combo.frequency / 10) * 100, 100);
  } catch (error) {
    console.error("Error calculating combination demand:", error);
    return 0;
  }
}

function analyzeCombinationTrends(combinations) {
  try {
    const trends = {
      rising: [],
      stable: [],
      declining: []
    };
    
    combinations.forEach(combo => {
      if (combo.growthRate > 20) {
        trends.rising.push(combo);
      } else if (combo.growthRate < 5) {
        trends.declining.push(combo);
      } else {
        trends.stable.push(combo);
      }
    });
    
    return trends;
  } catch (error) {
    console.error("Error analyzing combination trends:", error);
    return { rising: [], stable: [], declining: [] };
  }
}

function predictFutureCombinations(combinations) {
  try {
    const predictions = combinations
      .filter(combo => combo.growthRate > 15)
      .slice(0, 10)
      .map(combo => ({
        skills: combo.skills,
        predictedDemand: combo.demand * (1 + combo.growthRate / 100),
        confidence: Math.min(combo.frequency / 5, 1.0),
        timeframe: '6 months'
      }));
    
    return predictions;
  } catch (error) {
    console.error("Error predicting future combinations:", error);
    return [];
  }
}

async function findAdjacentStacks(skill, depth) {
  try {
    const candidates = await getSkillCandidates(skill);
    const adjacentStacks = {};
    
    candidates.forEach(candidate => {
      const skills = candidate.skills || [];
      const skillIndex = skills.indexOf(skill);
      
      if (skillIndex !== -1) {
        skills.forEach((candidateSkill, index) => {
          if (candidateSkill !== skill) {
            const distance = Math.abs(index - skillIndex);
            if (!adjacentStacks[candidateSkill]) {
              adjacentStacks[candidateSkill] = {
                skill: candidateSkill,
                frequency: 0,
                avgDistance: 0,
                contexts: []
              };
            }
            
            adjacentStacks[candidateSkill].frequency++;
            adjacentStacks[candidateSkill].avgDistance += distance;
            adjacentStacks[candidateSkill].contexts.push({
              candidateId: candidate._id,
              distance,
              context: candidate.headline
            });
          }
        });
      }
    });
    
    Object.values(adjacentStacks).forEach(stack => {
      stack.avgDistance = stack.avgDistance / stack.frequency;
      stack.proximity = 1 / (1 + stack.avgDistance);
    });
    
    return Object.values(adjacentStacks)
      .sort((a, b) => b.proximity - a.proximity)
      .slice(0, 20);
  } catch (error) {
    console.error("Error finding adjacent stacks:", error);
    return [];
  }
}

function calculateStackCompatibility(centralSkill, adjacentStacks) {
  try {
    const compatibility = {};
    
    adjacentStacks.forEach(stack => {
      compatibility[stack.skill] = {
        score: stack.proximity,
        compatibility: determineCompatibilityLevel(stack.proximity),
        recommendations: generateCompatibilityRecommendations(centralSkill, stack)
      };
    });
    
    return compatibility;
  } catch (error) {
    console.error("Error calculating stack compatibility:", error);
    return {};
  }
}

function determineCompatibilityLevel(proximity) {
  try {
    if (proximity > 0.8) return 'high';
    if (proximity > 0.6) return 'medium';
    if (proximity > 0.4) return 'low';
    return 'minimal';
  } catch (error) {
    console.error("Error determining compatibility level:", error);
    return 'minimal';
  }
}

function generateCompatibilityRecommendations(centralSkill, stack) {
  try {
    const recommendations = [];
    
    if (stack.proximity > 0.7) {
      recommendations.push(`Consider candidates with both ${centralSkill} and ${stack.skill}`);
      recommendations.push(`Target ${stack.skill} for cross-training opportunities`);
    }
    
    if (stack.avgDistance < 2) {
      recommendations.push(`${stack.skill} is commonly used alongside ${centralSkill}`);
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating compatibility recommendations:", error);
    return [];
  }
}

function generateStackRecommendations(centralSkill, adjacentStacks) {
  try {
    const recommendations = [];
    
    const topStacks = adjacentStacks.slice(0, 5);
    recommendations.push({
      type: 'primary',
      title: 'Most Compatible Skills',
      skills: topStacks.map(s => s.skill),
      reasoning: `These skills are most frequently found alongside ${centralSkill}`
    });
    
    const emergingStacks = adjacentStacks
      .filter(s => s.frequency < 5)
      .slice(0, 3);
    
    if (emergingStacks.length > 0) {
      recommendations.push({
        type: 'emerging',
        title: 'Emerging Combinations',
        skills: emergingStacks.map(s => s.skill),
        reasoning: `These skills are emerging in combination with ${centralSkill}`
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating stack recommendations:", error);
    return [];
  }
}

async function identifyHighDemandGroups(timeRange) {
  try {
    const candidates = await getRecentCandidates(timeRange);
    const skillGroups = {};
    
    candidates.forEach(candidate => {
      const skills = candidate.skills || [];
      const experience = candidate.totalExperience || 0;
      const company = candidate.currentCompany;
      
      if (skills.length >= 3) {
        const groupKey = skills.slice(0, 3).sort().join('|');
        
        if (!skillGroups[groupKey]) {
          skillGroups[groupKey] = {
            skills: skills.slice(0, 3),
            candidates: [],
            totalExperience: 0,
            companies: new Set(),
            demand: 0
          };
        }
        
        skillGroups[groupKey].candidates.push(candidate._id);
        skillGroups[groupKey].totalExperience += experience;
        skillGroups[groupKey].companies.add(company);
        skillGroups[groupKey].demand++;
      }
    });
    
    const highDemandGroups = Object.values(skillGroups)
      .filter(group => group.demand >= 5)
      .map(group => ({
        ...group,
        companies: Array.from(group.companies),
        avgExperience: group.totalExperience / group.candidates.length,
        demandScore: calculateDemandScore(group)
      }))
      .sort((a, b) => b.demandScore - a.demandScore)
      .slice(0, 20);
    
    return highDemandGroups;
  } catch (error) {
    console.error("Error identifying high demand groups:", error);
    return [];
  }
}

function calculateDemandScore(group) {
  try {
    const candidateScore = group.candidates.length;
    const experienceScore = group.avgExperience / 10;
    const companyScore = group.companies.length / 5;
    
    return (candidateScore + experienceScore + companyScore) * 10;
  } catch (error) {
    console.error("Error calculating demand score:", error);
    return 0;
  }
}

function calculateDemandMetrics(skillGroups) {
  try {
    const metrics = {
      totalGroups: skillGroups.length,
      avgDemand: skillGroups.reduce((sum, group) => sum + group.demand, 0) / skillGroups.length,
      topSkills: getTopSkillsAcrossGroups(skillGroups),
      experienceDistribution: calculateExperienceDistribution(skillGroups),
      companyDistribution: calculateCompanyDistribution(skillGroups)
    };
    
    return metrics;
  } catch (error) {
    console.error("Error calculating demand metrics:", error);
    return {};
  }
}

function getTopSkillsAcrossGroups(skillGroups) {
  try {
    const skillCounts = {};
    
    skillGroups.forEach(group => {
      group.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + group.demand;
      });
    });
    
    return Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  } catch (error) {
    console.error("Error getting top skills across groups:", error);
    return [];
  }
}

function calculateExperienceDistribution(skillGroups) {
  try {
    const distribution = {
      '0-2': 0,
      '2-5': 0,
      '5-10': 0,
      '10+': 0
    };
    
    skillGroups.forEach(group => {
      if (group.avgExperience < 2) distribution['0-2']++;
      else if (group.avgExperience < 5) distribution['2-5']++;
      else if (group.avgExperience < 10) distribution['5-10']++;
      else distribution['10+']++;
    });
    
    return Object.entries(distribution).map(([range, count]) => ({
      range,
      count,
      percentage: (count / skillGroups.length) * 100
    }));
  } catch (error) {
    console.error("Error calculating experience distribution:", error);
    return [];
  }
}

function calculateCompanyDistribution(skillGroups) {
  try {
    const companyCounts = {};
    
    skillGroups.forEach(group => {
      group.companies.forEach(company => {
        companyCounts[company] = (companyCounts[company] || 0) + 1;
      });
    });
    
    return Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([company, count]) => ({ company, count }));
  } catch (error) {
    console.error("Error calculating company distribution:", error);
    return [];
  }
}

function generateMarketInsights(skillGroups) {
  try {
    const insights = {
      trendingSkills: identifyTrendingSkills(skillGroups),
      marketDemand: analyzeMarketDemand(skillGroups),
      skillEvolution: analyzeSkillEvolution(skillGroups),
      competitiveLandscape: analyzeCompetitiveLandscape(skillGroups)
    };
    
    return insights;
  } catch (error) {
    console.error("Error generating market insights:", error);
    return {};
  }
}

function identifyTrendingSkills(skillGroups) {
  try {
    const skillGrowth = {};
    
    skillGroups.forEach(group => {
      group.skills.forEach(skill => {
        if (!skillGrowth[skill]) {
          skillGrowth[skill] = { demand: 0, groups: 0 };
        }
        skillGrowth[skill].demand += group.demand;
        skillGrowth[skill].groups++;
      });
    });
    
    return Object.entries(skillGrowth)
      .map(([skill, data]) => ({
        skill,
        avgDemand: data.demand / data.groups,
        growthRate: (data.groups / skillGroups.length) * 100
      }))
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 10);
  } catch (error) {
    console.error("Error identifying trending skills:", error);
    return [];
  }
}

function analyzeMarketDemand(skillGroups) {
  try {
    const totalDemand = skillGroups.reduce((sum, group) => sum + group.demand, 0);
    const avgGroupSize = skillGroups.reduce((sum, group) => sum + group.candidates.length, 0) / skillGroups.length;
    
    return {
      totalDemand,
      avgGroupSize,
      demandDistribution: calculateDemandDistribution(skillGroups),
      marketSaturation: calculateMarketSaturation(skillGroups)
    };
  } catch (error) {
    console.error("Error analyzing market demand:", error);
    return {};
  }
}

function calculateDemandDistribution(skillGroups) {
  try {
    const distribution = {
      'low': 0,
      'medium': 0,
      'high': 0,
      'very_high': 0
    };
    
    skillGroups.forEach(group => {
      if (group.demand < 10) distribution['low']++;
      else if (group.demand < 20) distribution['medium']++;
      else if (group.demand < 50) distribution['high']++;
      else distribution['very_high']++;
    });
    
    return distribution;
  } catch (error) {
    console.error("Error calculating demand distribution:", error);
    return {};
  }
}

function calculateMarketSaturation(skillGroups) {
  try {
    const uniqueSkills = new Set();
    
    skillGroups.forEach(group => {
      group.skills.forEach(skill => uniqueSkills.add(skill));
    });
    
    return {
      totalSkills: uniqueSkills.size,
      saturationRate: (uniqueSkills.size / (skillGroups.length * 3)) * 100,
      diversityIndex: calculateDiversityIndex(uniqueSkills.size, skillGroups.length)
    };
  } catch (error) {
    console.error("Error calculating market saturation:", error);
    return {};
  }
}

function calculateDiversityIndex(uniqueSkills, totalGroups) {
  try {
    return (uniqueSkills / (totalGroups * 3)) * 100;
  } catch (error) {
    console.error("Error calculating diversity index:", error);
    return 0;
  }
}

function analyzeSkillEvolution(skillGroups) {
  try {
    return {
      evolutionStages: identifyEvolutionStages(skillGroups),
      skillProgression: mapSkillProgression(skillGroups),
      futurePredictions: predictSkillEvolution(skillGroups)
    };
  } catch (error) {
    console.error("Error analyzing skill evolution:", error);
    return {};
  }
}

function identifyEvolutionStages(skillGroups) {
  try {
    return {
      emerging: skillGroups.filter(g => g.demand < 10).length,
      growing: skillGroups.filter(g => g.demand >= 10 && g.demand < 30).length,
      mature: skillGroups.filter(g => g.demand >= 30 && g.demand < 50).length,
      saturated: skillGroups.filter(g => g.demand >= 50).length
    };
  } catch (error) {
    console.error("Error identifying evolution stages:", error);
    return {};
  }
}

function mapSkillProgression(skillGroups) {
  try {
    const progression = {};
    
    skillGroups.forEach(group => {
      const key = group.skills.join('->');
      progression[key] = {
        skills: group.skills,
        demand: group.demand,
        stage: determineEvolutionStage(group.demand)
      };
    });
    
    return progression;
  } catch (error) {
    console.error("Error mapping skill progression:", error);
    return {};
  }
}

function determineEvolutionStage(demand) {
  try {
    if (demand < 10) return 'emerging';
    if (demand < 30) return 'growing';
    if (demand < 50) return 'mature';
    return 'saturated';
  } catch (error) {
    console.error("Error determining evolution stage:", error);
    return 'emerging';
  }
}

function predictSkillEvolution(skillGroups) {
  try {
    return skillGroups
      .filter(group => group.demandScore > 20)
      .slice(0, 10)
      .map(group => ({
        skills: group.skills,
        currentDemand: group.demand,
        predictedDemand: group.demand * 1.5,
        timeframe: '12 months',
        confidence: Math.min(group.demand / 20, 1.0)
      }));
  } catch (error) {
    console.error("Error predicting skill evolution:", error);
    return [];
  }
}

function analyzeCompetitiveLandscape(skillGroups) {
  try {
    return {
      topCompanies: getTopCompanies(skillGroups),
      skillCompetition: analyzeSkillCompetition(skillGroups),
      marketLeaders: identifyMarketLeaders(skillGroups)
    };
  } catch (error) {
    console.error("Error analyzing competitive landscape:", error);
    return {};
  }
}

function getTopCompanies(skillGroups) {
  try {
    const companyCounts = {};
    
    skillGroups.forEach(group => {
      group.companies.forEach(company => {
        companyCounts[company] = (companyCounts[company] || 0) + 1;
      });
    });
    
    return Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([company, count]) => ({ company, count }));
  } catch (error) {
    console.error("Error getting top companies:", error);
    return [];
  }
}

function analyzeSkillCompetition(skillGroups) {
  try {
    const competition = {};
    
    skillGroups.forEach(group => {
      group.skills.forEach(skill => {
        if (!competition[skill]) {
          competition[skill] = { demand: 0, companies: new Set() };
        }
        competition[skill].demand += group.demand;
        group.companies.forEach(company => competition[skill].companies.add(company));
      });
    });
    
    return Object.entries(competition)
      .map(([skill, data]) => ({
        skill,
        demand: data.demand,
        companyCount: data.companies.size,
        competitionLevel: determineCompetitionLevel(data.demand, data.companies.size)
      }))
      .sort((a, b) => b.demand - a.demand);
  } catch (error) {
    console.error("Error analyzing skill competition:", error);
    return [];
  }
}

function determineCompetitionLevel(demand, companyCount) {
  try {
    const score = demand * companyCount;
    if (score > 100) return 'high';
    if (score > 50) return 'medium';
    return 'low';
  } catch (error) {
    console.error("Error determining competition level:", error);
    return 'low';
  }
}

function identifyMarketLeaders(skillGroups) {
  try {
    const companyScores = {};
    
    skillGroups.forEach(group => {
      group.companies.forEach(company => {
        if (!companyScores[company]) {
          companyScores[company] = { score: 0, groups: 0 };
        }
        companyScores[company].score += group.demandScore;
        companyScores[company].groups++;
      });
    });
    
    return Object.entries(companyScores)
      .map(([company, data]) => ({
        company,
        avgScore: data.score / data.groups,
        groups: data.groups
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);
  } catch (error) {
    console.error("Error identifying market leaders:", error);
    return [];
  }
}

function analyzeSalaryTrends(skillGroups) {
  try {
    return {
      averageSalary: calculateAverageSalary(skillGroups),
      salaryRanges: calculateSalaryRanges(skillGroups),
      salaryGrowth: calculateSalaryGrowth(skillGroups),
      highPayingSkills: identifyHighPayingSkills(skillGroups)
    };
  } catch (error) {
    console.error("Error analyzing salary trends:", error);
    return {};
  }
}

function calculateAverageSalary(skillGroups) {
  try {
    const totalSalary = skillGroups.reduce((sum, group) => sum + (group.avgSalary || 80000), 0);
    return totalSalary / skillGroups.length;
  } catch (error) {
    console.error("Error calculating average salary:", error);
    return 80000;
  }
}

function calculateSalaryRanges(skillGroups) {
  try {
    const ranges = {
      '0-50k': 0,
      '50-75k': 0,
      '75-100k': 0,
      '100-150k': 0,
      '150k+': 0
    };
    
    skillGroups.forEach(group => {
      const salary = group.avgSalary || 80000;
      if (salary < 50000) ranges['0-50k']++;
      else if (salary < 75000) ranges['50-75k']++;
      else if (salary < 100000) ranges['75-100k']++;
      else if (salary < 150000) ranges['100-150k']++;
      else ranges['150k+']++;
    });
    
    return ranges;
  } catch (error) {
    console.error("Error calculating salary ranges:", error);
    return {};
  }
}

function calculateSalaryGrowth(skillGroups) {
  try {
    return Math.random() * 20; // Placeholder
  } catch (error) {
    console.error("Error calculating salary growth:", error);
    return 0;
  }
}

function identifyHighPayingSkills(skillGroups) {
  try {
    return skillGroups
      .filter(group => (group.avgSalary || 80000) > 120000)
      .sort((a, b) => (b.avgSalary || 80000) - (a.avgSalary || 80000))
      .slice(0, 10)
      .map(group => ({
        skills: group.skills,
        avgSalary: group.avgSalary || 80000,
        demand: group.demand
      }));
  } catch (error) {
    console.error("Error identifying high paying skills:", error);
    return [];
  }
}

async function calculateSkillProximity(skill1, skill2) {
  try {
    const candidates1 = await getSkillCandidates(skill1);
    const candidates2 = await getSkillCandidates(skill2);
    
    const intersection = candidates1.filter(c1 => 
      candidates2.some(c2 => c1._id.toString() === c2._id.toString())
    );
    
    const union = new Set([...candidates1, ...candidates2]);
    const jaccardSimilarity = intersection.length / union.size;
    
    const cooccurrenceRate = intersection.length / Math.min(candidates1.length, candidates2.length);
    
    return {
      jaccardSimilarity,
      cooccurrenceRate,
      combinedScore: (jaccardSimilarity + cooccurrenceRate) / 2
    };
  } catch (error) {
    console.error("Error calculating skill proximity:", error);
    return { jaccardSimilarity: 0, cooccurrenceRate: 0, combinedScore: 0 };
  }
}

function determineSkillRelationship(skill1, skill2, proximity) {
  try {
    if (proximity.combinedScore > 0.7) return 'strongly_related';
    if (proximity.combinedScore > 0.4) return 'moderately_related';
    if (proximity.combinedScore > 0.2) return 'weakly_related';
    return 'unrelated';
  } catch (error) {
    console.error("Error determining skill relationship:", error);
    return 'unrelated';
  }
}

function generateProximityRecommendations(skill1, skill2, proximity) {
  try {
    const recommendations = [];
    
    if (proximity.combinedScore > 0.5) {
      recommendations.push(`Consider candidates with both ${skill1} and ${skill2}`);
      recommendations.push(`Target cross-training between ${skill1} and ${skill2}`);
    }
    
    if (proximity.jaccardSimilarity > 0.6) {
      recommendations.push(`${skill1} and ${skill2} often appear together in job descriptions`);
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating proximity recommendations:", error);
    return [];
  }
}

async function traceSkillEvolution(skill, timeRange) {
  try {
    const candidates = await getSkillCandidatesByTimeRange(skill, timeRange);
    const evolutionPath = [];
    
    const timePoints = generateTimePoints(timeRange);
    
    timePoints.forEach(timePoint => {
      const timeCandidates = candidates.filter(c => 
        new Date(c.createdAt) >= timePoint.start && new Date(c.createdAt) < timePoint.end
      );
      
      evolutionPath.push({
        timePoint: timePoint.label,
        candidateCount: timeCandidates.length,
        avgExperience: calculateAvgExperience(timeCandidates),
        topCompanies: getTopCompaniesForTimePoint(timeCandidates),
        demand: timeCandidates.length
      });
    });
    
    return evolutionPath;
  } catch (error) {
    console.error("Error tracing skill evolution:", error);
    return [];
  }
}

function generateTimePoints(timeRange) {
  try {
    const points = [];
    const now = new Date();
    const months = timeRange === '2y' ? 24 : 12;
    
    for (let i = months; i >= 0; i -= 3) {
      const end = new Date(now.getTime() - (i - 3) * 30 * 24 * 60 * 60 * 1000);
      const start = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000);
      
      points.push({
        label: `${i}-${i-3} months ago`,
        start,
        end
      });
    }
    
    return points;
  } catch (error) {
    console.error("Error generating time points:", error);
    return [];
  }
}

function calculateAvgExperience(candidates) {
  try {
    if (candidates.length === 0) return 0;
    
    const totalExperience = candidates.reduce((sum, c) => sum + (c.totalExperience || 0), 0);
    return totalExperience / candidates.length;
  } catch (error) {
    console.error("Error calculating average experience:", error);
    return 0;
  }
}

function getTopCompaniesForTimePoint(candidates) {
  try {
    const companyCounts = {};
    
    candidates.forEach(candidate => {
      const company = candidate.currentCompany;
      if (company) {
        companyCounts[company] = (companyCounts[company] || 0) + 1;
      }
    });
    
    return Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }));
  } catch (error) {
    console.error("Error getting top companies for time point:", error);
    return [];
  }
}

function predictSkillEvolution(evolutionPath) {
  try {
    const recentGrowth = calculateRecentGrowth(evolutionPath);
    const trend = determineTrend(evolutionPath);
    
    return {
      nextQuarter: evolutionPath[evolutionPath.length - 1].demand * (1 + trend),
      nextYear: evolutionPath[evolutionPath.length - 1].demand * (1 + trend * 4),
      confidence: Math.min(recentGrowth / 10, 1.0)
    };
  } catch (error) {
    console.error("Error predicting skill evolution:", error);
    return { nextQuarter: 0, nextYear: 0, confidence: 0 };
  }
}

function calculateRecentGrowth(evolutionPath) {
  try {
    if (evolutionPath.length < 2) return 0;
    
    const recent = evolutionPath.slice(-3);
    const growth = recent[recent.length - 1].demand - recent[0].demand;
    
    return growth / recent[0].demand * 100;
  } catch (error) {
    console.error("Error calculating recent growth:", error);
    return 0;
  }
}

function determineTrend(evolutionPath) {
  try {
    if (evolutionPath.length < 2) return 0;
    
    const first = evolutionPath[0].demand;
    const last = evolutionPath[evolutionPath.length - 1].demand;
    
    return (last - first) / first;
  } catch (error) {
    console.error("Error determining trend:", error);
    return 0;
  }
}

function findRelatedEvolutionSkills(skill, evolutionPath) {
  try {
    return [];
  } catch (error) {
    console.error("Error finding related evolution skills:", error);
    return [];
  }
}

async function getSkillCandidates(skill) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const candidates = await SourcingCandidate.default.find({
      skills: skill
    }).lean();
    
    return candidates;
  } catch (error) {
    console.error("Error getting skill candidates:", error);
    return [];
  }
}

async function getRecentCandidates(timeRange) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const cutoffDate = new Date(Date.now() - getTimeRangeMs(timeRange));
    
    const candidates = await SourcingCandidate.default.find({
      createdAt: { $gte: cutoffDate }
    }).lean();
    
    return candidates;
  } catch (error) {
    console.error("Error getting recent candidates:", error);
    return [];
  }
}

function getTimeRangeMs(timeRange) {
  try {
    const ranges = {
      '1m': 30 * 24 * 60 * 60 * 1000,
      '3m': 90 * 24 * 60 * 60 * 1000,
      '6m': 180 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
      '2y': 730 * 24 * 60 * 60 * 1000
    };
    
    return ranges[timeRange] || ranges['3m'];
  } catch (error) {
    console.error("Error getting time range ms:", error);
    return 90 * 24 * 60 * 60 * 1000;
  }
}

async function getSkillCandidatesByTimeRange(skill, timeRange) {
  try {
    const SourcingCandidate = await import("../../../models/sourcing/sourcingCandidate.model.js");
    
    const cutoffDate = new Date(Date.now() - getTimeRangeMs(timeRange));
    
    const candidates = await SourcingCandidate.default.find({
      skills: skill,
      createdAt: { $gte: cutoffDate }
    }).lean();
    
    return candidates;
  } catch (error) {
    console.error("Error getting skill candidates by time range:", error);
    return [];
  }
}
