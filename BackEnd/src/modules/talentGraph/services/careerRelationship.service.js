import { checkAiHealth } from "../../../sourcing/ai/aiServiceClient.js";

export async function inferCareerProgressionPatterns(candidateId, options = {}) {
  try {
    const { depth = 5, includePredictions = true } = options;
    
    const careerPath = await getCareerPath(candidateId, depth);
    const patterns = analyzeProgressionPatterns(careerPath);
    
    if (includePredictions) {
      patterns.predictions = predictCareerProgression(careerPath, patterns);
    }
    
    return {
      candidateId,
      careerPath,
      patterns,
      insights: generateCareerInsights(patterns)
    };
  } catch (error) {
    console.error("Error in inferCareerProgressionPatterns:", error);
    throw new Error(`Failed to infer career progression patterns: ${error.message}`);
  }
}

export async function analyzeLeadershipProgression(candidateId, options = {}) {
  try {
    const { timeRange = '5y' } = options;
    
    const careerPath = await getCareerPath(candidateId, timeRange);
    const leadershipData = extractLeadershipData(careerPath);
    
    return {
      candidateId,
      leadershipProgression: analyzeLeadershipTrajectory(leadershipData),
      leadershipScore: calculateLeadershipScore(leadershipData),
      potentialRoles: identifyPotentialLeadershipRoles(leadershipData),
      developmentPath: generateLeadershipDevelopmentPath(leadershipData)
    };
  } catch (error) {
    console.error("Error in analyzeLeadershipProgression:", error);
    throw new Error(`Failed to analyze leadership progression: ${error.message}`);
  }
}

export async function identifyDomainSpecialization(candidateId, options = {}) {
  try {
    const { minExperience = 3 } = options;
    
    const careerPath = await getCareerPath(candidateId);
    const domainData = extractDomainData(careerPath);
    
    const specializations = identifySpecializations(domainData, minExperience);
    const expertise = calculateDomainExpertise(specializations);
    const trends = analyzeDomainTrends(specializations);
    
    return {
      candidateId,
      specializations,
      expertise,
      trends,
      recommendations: generateSpecializationRecommendations(specializations, expertise)
    };
  } catch (error) {
    console.error("Error in identifyDomainSpecialization:", error);
    throw new Error(`Failed to identify domain specialization: ${error.message}`);
  }
}

export async function analyzeEngineeringGrowthPaths(candidateId, options = {}) {
  try {
    const { includeTechnical = true, includeManagement = true } = options;
    
    const careerPath = await getCareerPath(candidateId);
    const engineeringData = extractEngineeringData(careerPath);
    
    const growthPaths = {
      technical: includeTechnical ? analyzeTechnicalGrowth(engineeringData) : null,
      management: includeManagement ? analyzeManagementGrowth(engineeringData) : null,
      hybrid: includeTechnical && includeManagement ? analyzeHybridGrowth(engineeringData) : null
    };
    
    return {
      candidateId,
      growthPaths,
      currentLevel: determineCurrentLevel(engineeringData),
      nextSteps: recommendNextSteps(growthPaths),
      marketAlignment: assessMarketAlignment(engineeringData)
    };
  } catch (error) {
    console.error("Error in analyzeEngineeringGrowthPaths:", error);
    throw new Error(`Failed to analyze engineering growth paths: ${error.message}`);
  }
}

export async function buildCareerRelationshipGraph(candidateId, options = {}) {
  try {
    const { maxDepth = 3, includeWeakTies = false } = options;
    
    const centralCandidate = await getCandidateData(candidateId);
    const relationships = await findCareerRelationships(candidateId, maxDepth);
    
    const graph = {
      centralNode: {
        id: candidateId,
        type: 'candidate',
        data: centralCandidate,
        relationships: relationships
      },
      nodes: await buildRelationshipNodes(relationships),
      edges: await buildRelationshipEdges(relationships),
      clusters: identifyRelationshipClusters(relationships),
      influence: calculateInfluenceMetrics(relationships)
    };
    
    if (includeWeakTies) {
      graph.weakTies = await identifyWeakTies(candidateId, relationships);
    }
    
    return graph;
  } catch (error) {
    console.error("Error in buildCareerRelationshipGraph:", error);
    throw new Error(`Failed to build career relationship graph: ${error.message}`);
  }
}

export async function predictCareerTransitions(candidateId, options = {}) {
  try {
    const { timeHorizon = '2y', probability = 0.7 } = options;
    
    const careerPath = await getCareerPath(candidateId);
    const marketData = await getMarketTrends();
    
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    let transitions;
    if (aiAvailable) {
      transitions = await predictTransitionsWithAI(candidateId, careerPath, marketData, timeHorizon);
    } else {
      transitions = await predictTransitionsWithRules(candidateId, careerPath, marketData, timeHorizon);
    }
    
    const filteredTransitions = transitions.filter(t => t.probability >= probability);
    
    return {
      candidateId,
      transitions: filteredTransitions,
      timeHorizon,
      confidence: calculatePredictionConfidence(filteredTransitions),
      recommendations: generateTransitionRecommendations(filteredTransitions)
    };
  } catch (error) {
    console.error("Error in predictCareerTransitions:", error);
    throw new Error(`Failed to predict career transitions: ${error.message}`);
  }
}

async function getCareerPath(candidateId, depth = 5) {
  try {
    const candidate = await getCandidateData(candidateId);
    const careerPath = [];
    
    if (candidate.experience && candidate.experience.length > 0) {
      careerPath.push(...candidate.experience.map(exp => ({
        company: exp.company,
        role: exp.role,
        startDate: exp.startDate,
        endDate: exp.endDate,
        duration: calculateDuration(exp.startDate, exp.endDate),
        skills: exp.skills || [],
        level: inferLevel(exp.role, exp.duration),
        industry: inferIndustry(exp.company)
      })));
    }
    
    if (candidate.education) {
      careerPath.unshift({
        type: 'education',
        institution: candidate.education.school,
        degree: candidate.education.degree,
        field: candidate.education.field,
        startDate: candidate.education.startDate,
        endDate: candidate.education.endDate,
        level: 'education'
      });
    }
    
    return careerPath.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  } catch (error) {
    console.error("Error getting career path:", error);
    return [];
  }
}

function analyzeProgressionPatterns(careerPath) {
  try {
    const patterns = {
      progression: analyzeCareerProgression(careerPath),
      transitions: analyzeRoleTransitions(careerPath),
      skillEvolution: analyzeSkillEvolution(careerPath),
      companyMovement: analyzeCompanyMovement(careerPath),
      industryMovement: analyzeIndustryMovement(careerPath),
      levelProgression: analyzeLevelProgression(careerPath)
    };
    
    return patterns;
  } catch (error) {
    console.error("Error analyzing progression patterns:", error);
    return {};
  }
}

function analyzeCareerProgression(careerPath) {
  try {
    const progression = {
      totalRoles: careerPath.filter(p => p.type !== 'education').length,
      avgDuration: calculateAverageDuration(careerPath),
      progressionRate: calculateProgressionRate(careerPath),
      stability: calculateCareerStability(careerPath),
      growth: calculateCareerGrowth(careerPath)
    };
    
    return progression;
  } catch (error) {
    console.error("Error analyzing career progression:", error);
    return {};
  }
}

function analyzeRoleTransitions(careerPath) {
  try {
    const transitions = [];
    const workExperience = careerPath.filter(p => p.type !== 'education');
    
    for (let i = 1; i < workExperience.length; i++) {
      const from = workExperience[i - 1];
      const to = workExperience[i];
      
      transitions.push({
        from: from.role,
        to: to.role,
        fromCompany: from.company,
        toCompany: to.company,
        transitionType: classifyTransition(from, to),
        duration: from.duration,
        gap: calculateGap(from.endDate, to.startDate)
      });
    }
    
    return {
      transitions,
      patterns: identifyTransitionPatterns(transitions),
      frequency: calculateTransitionFrequency(transitions)
    };
  } catch (error) {
    console.error("Error analyzing role transitions:", error);
    return { transitions: [], patterns: {}, frequency: 0 };
  }
}

function analyzeSkillEvolution(careerPath) {
  try {
    const skillTimeline = {};
    const allSkills = new Set();
    
    careerPath.forEach(position => {
      if (position.skills) {
        position.skills.forEach(skill => allSkills.add(skill));
        
        const year = new Date(position.startDate).getFullYear();
        if (!skillTimeline[year]) {
          skillTimeline[year] = new Set();
        }
        position.skills.forEach(skill => skillTimeline[year].add(skill));
      }
    });
    
    const evolution = {
      totalSkills: allSkills.size,
      skillAcquisition: calculateSkillAcquisition(skillTimeline),
      skillRetention: calculateSkillRetention(skillTimeline),
      skillProgression: calculateSkillProgression(skillTimeline),
      emergingSkills: identifyEmergingSkills(skillTimeline)
    };
    
    return evolution;
  } catch (error) {
    console.error("Error analyzing skill evolution:", error);
    return {};
  }
}

function analyzeCompanyMovement(careerPath) {
  try {
    const movements = [];
    const workExperience = careerPath.filter(p => p.type !== 'education');
    
    for (let i = 1; i < workExperience.length; i++) {
      const from = workExperience[i - 1];
      const to = workExperience[i];
      
      if (from.company !== to.company) {
        movements.push({
          fromCompany: from.company,
          toCompany: to.company,
          fromIndustry: from.industry,
          toIndustry: to.industry,
          transitionType: classifyCompanyTransition(from, to),
          careerImpact: assessCareerImpact(from, to)
        });
      }
    }
    
    return {
      movements,
      patterns: identifyMovementPatterns(movements),
      loyalty: calculateCompanyLoyalty(workExperience),
      diversity: calculateCompanyDiversity(movements)
    };
  } catch (error) {
    console.error("Error analyzing company movement:", error);
    return { movements: [], patterns: {}, loyalty: 0, diversity: 0 };
  }
}

function analyzeIndustryMovement(careerPath) {
  try {
    const industries = careerPath.map(p => p.industry).filter(Boolean);
    const industryChanges = [];
    
    for (let i = 1; i < industries.length; i++) {
      if (industries[i] !== industries[i - 1]) {
        industryChanges.push({
          from: industries[i - 1],
          to: industries[i],
          changeType: classifyIndustryChange(industries[i - 1], industries[i])
        });
      }
    }
    
    return {
      industries,
      changes: industryChanges,
      specialization: calculateIndustrySpecialization(industries),
      diversity: calculateIndustryDiversity(industries)
    };
  } catch (error) {
    console.error("Error analyzing industry movement:", error);
    return { industries: [], changes: [], specialization: 0, diversity: 0 };
  }
}

function analyzeLevelProgression(careerPath) {
  try {
    const levels = careerPath.map(p => p.level).filter(Boolean);
    const progression = [];
    
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] !== levels[i - 1]) {
        progression.push({
          from: levels[i - 1],
          to: levels[i],
          timeToPromotion: calculateTimeToPromotion(careerPath[i - 1], careerPath[i]),
          promotionType: classifyPromotion(levels[i - 1], levels[i])
        });
      }
    }
    
    return {
      levels,
      progression,
      trajectory: calculateLevelTrajectory(levels),
      velocity: calculatePromotionVelocity(progression)
    };
  } catch (error) {
    console.error("Error analyzing level progression:", error);
    return { levels: [], progression: [], trajectory: 'stable', velocity: 0 };
  }
}

function extractLeadershipData(careerPath) {
  try {
    const leadershipRoles = careerPath.filter(position => 
      isLeadershipRole(position.role)
    );
    
    const leadershipData = {
      roles: leadershipRoles,
      totalLeadershipExperience: calculateTotalLeadershipExperience(leadershipRoles),
      teamSizes: extractTeamSizes(leadershipRoles),
      leadershipSkills: extractLeadershipSkills(leadershipRoles),
      managementStyles: inferManagementStyles(leadershipRoles),
      impact: calculateLeadershipImpact(leadershipRoles)
    };
    
    return leadershipData;
  } catch (error) {
    console.error("Error extracting leadership data:", error);
    return { roles: [], totalLeadershipExperience: 0, teamSizes: [], leadershipSkills: [], managementStyles: [], impact: 0 };
  }
}

function isLeadershipRole(role) {
  try {
    const leadershipKeywords = [
      'manager', 'lead', 'director', 'vp', 'vice president', 'head', 'chief',
      'supervisor', 'team lead', 'principal', 'senior', 'executive'
    ];
    
    const roleLower = role.toLowerCase();
    return leadershipKeywords.some(keyword => roleLower.includes(keyword));
  } catch (error) {
    console.error("Error checking if role is leadership:", error);
    return false;
  }
}

function analyzeLeadershipTrajectory(leadershipData) {
  try {
    const trajectory = {
      entryPoint: identifyLeadershipEntryPoint(leadershipData.roles),
      progression: mapLeadershipProgression(leadershipData.roles),
      acceleration: calculateLeadershipAcceleration(leadershipData.roles),
      plateau: identifyLeadershipPlateau(leadershipData.roles)
    };
    
    return trajectory;
  } catch (error) {
    console.error("Error analyzing leadership trajectory:", error);
    return {};
  }
}

function calculateLeadershipScore(leadershipData) {
  try {
    let score = 0;
    
    score += Math.min(leadershipData.totalLeadershipExperience / 10, 0.3);
    
    const avgTeamSize = leadershipData.teamSizes.length > 0 
      ? leadershipData.teamSizes.reduce((sum, size) => sum + size, 0) / leadershipData.teamSizes.length
      : 0;
    score += Math.min(avgTeamSize / 20, 0.2);
    
    score += Math.min(leadershipData.leadershipSkills.length / 10, 0.2);
    
    score += Math.min(leadershipData.impact / 100, 0.3);
    
    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Error calculating leadership score:", error);
    return 0.5;
  }
}

function identifyPotentialLeadershipRoles(leadershipData) {
  try {
    const currentLevel = getCurrentLeadershipLevel(leadershipData.roles);
    const potentialRoles = [];
    
    if (currentLevel === 'none') {
      potentialRoles.push('Team Lead', 'Project Manager');
    } else if (currentLevel === 'team_lead') {
      potentialRoles.push('Engineering Manager', 'Senior Manager');
    } else if (currentLevel === 'manager') {
      potentialRoles.push('Director', 'Senior Director');
    } else if (currentLevel === 'director') {
      potentialRoles.push('VP', 'Senior VP');
    } else if (currentLevel === 'vp') {
      potentialRoles.push('C-Level Executive');
    }
    
    return potentialRoles;
  } catch (error) {
    console.error("Error identifying potential leadership roles:", error);
    return [];
  }
}

function generateLeadershipDevelopmentPath(leadershipData) {
  try {
    const path = {
      currentGaps: identifyLeadershipGaps(leadershipData),
      recommendedTraining: recommendLeadershipTraining(leadershipData),
      mentorshipOpportunities: identifyMentorshipOpportunities(leadershipData),
      timeline: estimateLeadershipTimeline(leadershipData)
    };
    
    return path;
  } catch (error) {
    console.error("Error generating leadership development path:", error);
    return {};
  }
}

function extractDomainData(careerPath) {
  try {
    const domainData = {
      industries: [...new Set(careerPath.map(p => p.industry).filter(Boolean))],
      specializations: identifyCareerSpecializations(careerPath),
      experience: calculateDomainExperience(careerPath),
      skills: aggregateDomainSkills(careerPath),
      achievements: extractDomainAchievements(careerPath)
    };
    
    return domainData;
  } catch (error) {
    console.error("Error extracting domain data:", error);
    return { industries: [], specializations: [], experience: 0, skills: [], achievements: [] };
  }
}

function identifySpecializations(domainData, minExperience) {
  try {
    const specializations = [];
    
    domainData.industries.forEach(industry => {
      const industryExperience = domainData.experience[industry] || 0;
      if (industryExperience >= minExperience) {
        specializations.push({
          domain: industry,
          experience: industryExperience,
          confidence: calculateSpecializationConfidence(industryExperience, domainData.totalExperience),
          relatedSkills: getRelatedSkills(industry, domainData.skills)
        });
      }
    });
    
    return specializations.sort((a, b) => b.experience - a.experience);
  } catch (error) {
    console.error("Error identifying specializations:", error);
    return [];
  }
}

function calculateDomainExpertise(specializations) {
  try {
    const expertise = {};
    
    specializations.forEach(spec => {
      expertise[spec.domain] = {
        level: determineExpertiseLevel(spec.experience),
        confidence: spec.confidence,
        marketValue: calculateMarketValue(spec.domain, spec.experience),
        growth: calculateGrowthPotential(spec.domain)
      };
    });
    
    return expertise;
  } catch (error) {
    console.error("Error calculating domain expertise:", error);
    return {};
  }
}

function analyzeDomainTrends(specializations) {
  try {
    const trends = {
      emergingDomains: identifyEmergingDomains(specializations),
      decliningDomains: identifyDecliningDomains(specializations),
      stableDomains: identifyStableDomains(specializations),
      marketDemand: calculateMarketDemand(specializations)
    };
    
    return trends;
  } catch (error) {
    console.error("Error analyzing domain trends:", error);
    return {};
  }
}

function generateSpecializationRecommendations(specializations, expertise) {
  try {
    const recommendations = [];
    
    Object.entries(expertise).forEach(([domain, data]) => {
      if (data.level === 'expert' && data.growth > 0.7) {
        recommendations.push({
          type: 'deepen',
          domain,
          reasoning: `Strong expertise in growing ${domain} domain`,
          action: 'Consider senior/leadership roles in this domain'
        });
      } else if (data.level === 'intermediate' && data.growth > 0.8) {
        recommendations.push({
          type: 'expand',
          domain,
          reasoning: `${domain} domain has high growth potential`,
          action: 'Invest in additional training and certifications'
        });
      }
    });
    
    return recommendations;
  } catch (error) {
    console.error("Error generating specialization recommendations:", error);
    return [];
  }
}

function extractEngineeringData(careerPath) {
  try {
    const engineeringData = {
      technicalSkills: extractTechnicalSkills(careerPath),
      managementSkills: extractManagementSkills(careerPath),
      projectTypes: identifyProjectTypes(careerPath),
      teamSizes: extractTeamSizes(careerPath),
      technologies: aggregateTechnologies(careerPath),
      methodologies: extractMethodologies(careerPath)
    };
    
    return engineeringData;
  } catch (error) {
    console.error("Error extracting engineering data:", error);
    return { technicalSkills: [], managementSkills: [], projectTypes: [], teamSizes: [], technologies: [], methodologies: [] };
  }
}

function analyzeTechnicalGrowth(engineeringData) {
  try {
    const growth = {
      skillProgression: analyzeTechnicalSkillProgression(engineeringData.technicalSkills),
      technologyAdoption: analyzeTechnologyAdoption(engineeringData.technologies),
      complexityGrowth: analyzeComplexityGrowth(engineeringData.projectTypes),
      specialization: analyzeTechnicalSpecialization(engineeringData.technicalSkills)
    };
    
    return growth;
  } catch (error) {
    console.error("Error analyzing technical growth:", error);
    return {};
  }
}

function analyzeManagementGrowth(engineeringData) {
  try {
    const growth = {
      teamSizeProgression: analyzeTeamSizeProgression(engineeringData.teamSizes),
      managementSkills: analyzeManagementSkillDevelopment(engineeringData.managementSkills),
      projectComplexity: analyzeProjectComplexityGrowth(engineeringData.projectTypes),
      leadershipEvolution: analyzeLeadershipEvolution(engineeringData.managementSkills)
    };
    
    return growth;
  } catch (error) {
    console.error("Error analyzing management growth:", error);
    return {};
  }
}

function analyzeHybridGrowth(engineeringData) {
  try {
    const growth = {
      balance: analyzeTechnicalManagementBalance(engineeringData),
      transitionPoints: identifyTransitionPoints(engineeringData),
      hybridSkills: identifyHybridSkills(engineeringData),
      effectiveness: calculateHybridEffectiveness(engineeringData)
    };
    
    return growth;
  } catch (error) {
    console.error("Error analyzing hybrid growth:", error);
    return {};
  }
}

function determineCurrentLevel(engineeringData) {
  try {
    const technicalScore = calculateTechnicalScore(engineeringData);
    const managementScore = calculateManagementScore(engineeringData);
    
    if (managementScore > 0.7) return 'management';
    if (technicalScore > 0.8) return 'senior_technical';
    if (technicalScore > 0.6) return 'technical';
    return 'junior';
  } catch (error) {
    console.error("Error determining current level:", error);
    return 'unknown';
  }
}

function recommendNextSteps(growthPaths) {
  try {
    const steps = [];
    
    if (growthPaths.technical) {
      steps.push(...generateTechnicalNextSteps(growthPaths.technical));
    }
    
    if (growthPaths.management) {
      steps.push(...generateManagementNextSteps(growthPaths.management));
    }
    
    if (growthPaths.hybrid) {
      steps.push(...generateHybridNextSteps(growthPaths.hybrid));
    }
    
    return steps;
  } catch (error) {
    console.error("Error recommending next steps:", error);
    return [];
  }
}

function assessMarketAlignment(engineeringData) {
  try {
    const alignment = {
      technicalDemand: assessTechnicalDemand(engineeringData.technicalSkills),
      managementDemand: assessManagementDemand(engineeringData.managementSkills),
      marketValue: calculateMarketValue(engineeringData),
      competitiveness: calculateCompetitiveness(engineeringData)
    };
    
    return alignment;
  } catch (error) {
    console.error("Error assessing market alignment:", error);
    return {};
  }
}

async function findCareerRelationships(candidateId, maxDepth) {
  try {
    const relationships = [];
    const candidate = await getCandidateData(candidateId);
    
    const companyRelationships = await findCompanyRelationships(candidate.company, maxDepth);
    const schoolRelationships = await findSchoolRelationships(candidate.education?.school, maxDepth);
    const skillRelationships = await findSkillRelationships(candidate.skills, maxDepth);
    
    relationships.push(...companyRelationships, ...schoolRelationships, ...skillRelationships);
    
    return relationships;
  } catch (error) {
    console.error("Error finding career relationships:", error);
    return [];
  }
}

async function buildRelationshipNodes(relationships) {
  try {
    const nodes = [];
    const processed = new Set();
    
    relationships.forEach(rel => {
      if (!processed.has(rel.targetId)) {
        nodes.push({
          id: rel.targetId,
          type: rel.type,
          data: rel.targetData,
          strength: rel.strength
        });
        processed.add(rel.targetId);
      }
    });
    
    return nodes;
  } catch (error) {
    console.error("Error building relationship nodes:", error);
    return [];
  }
}

async function buildRelationshipEdges(relationships) {
  try {
    const edges = relationships.map(rel => ({
      id: `${rel.sourceId}-${rel.targetId}`,
      source: rel.sourceId,
      target: rel.targetId,
      type: rel.relationshipType,
      strength: rel.strength,
      weight: calculateEdgeWeight(rel)
    }));
    
    return edges;
  } catch (error) {
    console.error("Error building relationship edges:", error);
    return [];
  }
}

function identifyRelationshipClusters(relationships) {
  try {
    const clusters = {};
    
    relationships.forEach(rel => {
      if (!clusters[rel.type]) {
        clusters[rel.type] = [];
      }
      clusters[rel.type].push(rel);
    });
    
    return clusters;
  } catch (error) {
    console.error("Error identifying relationship clusters:", error);
    return {};
  }
}

function calculateInfluenceMetrics(relationships) {
  try {
    const metrics = {
      totalConnections: relationships.length,
      strongConnections: relationships.filter(r => r.strength > 0.7).length,
      weakConnections: relationships.filter(r => r.strength < 0.3).length,
      networkDiversity: calculateNetworkDiversity(relationships),
      centrality: calculateCentrality(relationships)
    };
    
    return metrics;
  } catch (error) {
    console.error("Error calculating influence metrics:", error);
    return {};
  }
}

async function identifyWeakTies(candidateId, relationships) {
  try {
    const weakTies = relationships.filter(rel => rel.strength < 0.3);
    const potentialConnections = [];
    
    for (const tie of weakTies) {
      const secondDegreeConnections = await findSecondDegreeConnections(tie.targetId);
      potentialConnections.push(...secondDegreeConnections);
    }
    
    return potentialConnections;
  } catch (error) {
    console.error("Error identifying weak ties:", error);
    return [];
  }
}

async function predictTransitionsWithAI(candidateId, careerPath, marketData, timeHorizon) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const response = await axios.default.post(
      `${AI_BASE_URL}/career/predict-transitions`,
      {
        candidateId,
        careerPath,
        marketData,
        timeHorizon
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 15000
      }
    );

    return response.data.transitions || [];
  } catch (error) {
    console.warn("AI transition prediction failed, using rules:", error.message);
    return await predictTransitionsWithRules(candidateId, careerPath, marketData, timeHorizon);
  }
}

async function predictTransitionsWithRules(candidateId, careerPath, marketData, timeHorizon) {
  try {
    const transitions = [];
    const currentRole = careerPath[careerPath.length - 1];
    
    const potentialRoles = identifyPotentialRoles(currentRole);
    
    potentialRoles.forEach(role => {
      const probability = calculateTransitionProbability(currentRole, role, marketData);
      
      if (probability > 0.3) {
        transitions.push({
          from: currentRole.role,
          to: role,
          probability,
          timeframe: estimateTimeframe(currentRole, role),
          requirements: identifyTransitionRequirements(currentRole, role),
          marketDemand: getMarketDemand(role, marketData)
        });
      }
    });
    
    return transitions.sort((a, b) => b.probability - a.probability);
  } catch (error) {
    console.error("Error predicting transitions with rules:", error);
    return [];
  }
}

function predictCareerProgression(careerPath, patterns) {
  try {
    const predictions = {
      nextRole: predictNextRole(careerPath, patterns),
      timeline: predictTimeline(careerPath, patterns),
      salary: predictSalaryProgression(careerPath, patterns),
      skills: predictSkillEvolution(careerPath, patterns)
    };
    
    return predictions;
  } catch (error) {
    console.error("Error predicting career progression:", error);
    return {};
  }
}

function generateCareerInsights(patterns) {
  try {
    const insights = {
      strengths: identifyCareerStrengths(patterns),
      areasForImprovement: identifyImprovementAreas(patterns),
      opportunities: identifyCareerOpportunities(patterns),
      risks: identifyCareerRisks(patterns),
      recommendations: generateCareerRecommendations(patterns)
    };
    
    return insights;
  } catch (error) {
    console.error("Error generating career insights:", error);
    return {};
  }
}

function calculatePredictionConfidence(transitions) {
  try {
    if (transitions.length === 0) return 0;
    
    const avgProbability = transitions.reduce((sum, t) => sum + t.probability, 0) / transitions.length;
    const dataQuality = assessDataQuality(transitions);
    
    return (avgProbability + dataQuality) / 2;
  } catch (error) {
    console.error("Error calculating prediction confidence:", error);
    return 0.5;
  }
}

function generateTransitionRecommendations(transitions) {
  try {
    const recommendations = [];
    
    transitions.forEach(transition => {
      if (transition.probability > 0.7) {
        recommendations.push({
          type: 'high_probability',
          transition: transition.to,
          reasoning: `High probability transition to ${transition.to}`,
          actionItems: transition.requirements || []
        });
      }
    });
    
    return recommendations;
  } catch (error) {
    console.error("Error generating transition recommendations:", error);
    return [];
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

function inferLevel(role, duration) {
  try {
    const roleLower = role.toLowerCase();
    const durationMonths = duration || 0;
    
    if (roleLower.includes('intern') || roleLower.includes('trainee')) return 'intern';
    if (roleLower.includes('junior') || roleLower.includes('associate')) return 'junior';
    if (roleLower.includes('senior') || roleLower.includes('lead')) return 'senior';
    if (roleLower.includes('manager') || roleLower.includes('supervisor')) return 'manager';
    if (roleLower.includes('director') || roleLower.includes('head')) return 'director';
    if (roleLower.includes('vp') || roleLower.includes('vice')) return 'vp';
    if (roleLower.includes('chief') || roleLower.includes('c-level')) return 'executive';
    
    if (durationMonths < 12) return 'junior';
    if (durationMonths < 36) return 'mid';
    if (durationMonths < 72) return 'senior';
    return 'executive';
  } catch (error) {
    console.error("Error inferring level:", error);
    return 'unknown';
  }
}

function inferIndustry(company) {
  try {
    const industryMap = {
      'google': 'technology',
      'microsoft': 'technology',
      'amazon': 'technology',
      'facebook': 'technology',
      'apple': 'technology',
      'jpmorgan': 'finance',
      'goldman sachs': 'finance',
      'bank of america': 'finance',
      'mckinsey': 'consulting',
      'deloitte': 'consulting',
      'accenture': 'consulting',
      'johnson & johnson': 'healthcare',
      'pfizer': 'healthcare',
      'procter & gamble': 'consumer',
      'coca-cola': 'consumer'
    };
    
    const companyLower = company.toLowerCase();
    for (const [key, industry] of Object.entries(industryMap)) {
      if (companyLower.includes(key)) {
        return industry;
      }
    }
    
    return 'unknown';
  } catch (error) {
    console.error("Error inferring industry:", error);
    return 'unknown';
  }
}

function calculateAverageDuration(careerPath) {
  try {
    const durations = careerPath
      .filter(p => p.type !== 'education')
      .map(p => p.duration || 0)
      .filter(d => d > 0);
    
    if (durations.length === 0) return 0;
    return durations.reduce((sum, d) => sum + d, 0) / durations.length;
  } catch (error) {
    console.error("Error calculating average duration:", error);
    return 0;
  }
}

function calculateProgressionRate(careerPath) {
  try {
    const levels = careerPath.map(p => p.level).filter(Boolean);
    if (levels.length < 2) return 0;
    
    let promotions = 0;
    for (let i = 1; i < levels.length; i++) {
      if (isPromotion(levels[i - 1], levels[i])) {
        promotions++;
      }
    }
    
    return promotions / (levels.length - 1);
  } catch (error) {
    console.error("Error calculating progression rate:", error);
    return 0;
  }
}

function isPromotion(fromLevel, toLevel) {
  try {
    const levelOrder = ['intern', 'junior', 'mid', 'senior', 'manager', 'director', 'vp', 'executive'];
    const fromIndex = levelOrder.indexOf(fromLevel);
    const toIndex = levelOrder.indexOf(toLevel);
    
    return toIndex > fromIndex;
  } catch (error) {
    console.error("Error checking if promotion:", error);
    return false;
  }
}

function calculateCareerStability(careerPath) {
  try {
    const totalDuration = careerPath
      .filter(p => p.type !== 'education')
      .reduce((sum, p) => sum + (p.duration || 0), 0);
    
    const companyChanges = careerPath
      .filter(p => p.type !== 'education')
      .filter((p, i, arr) => i > 0 && arr[i - 1].company !== p.company).length;
    
    if (totalDuration === 0) return 0;
    return 1 - (companyChanges / (totalDuration / 12)); // stability decreases with more changes
  } catch (error) {
    console.error("Error calculating career stability:", error);
    return 0.5;
  }
}

function calculateCareerGrowth(careerPath) {
  try {
    const levels = careerPath.map(p => p.level).filter(Boolean);
    if (levels.length < 2) return 0;
    
    const startLevel = getLevelScore(levels[0]);
    const endLevel = getLevelScore(levels[levels.length - 1]);
    
    return (endLevel - startLevel) / levels.length;
  } catch (error) {
    console.error("Error calculating career growth:", error);
    return 0;
  }
}

function getLevelScore(level) {
  try {
    const scores = {
      'intern': 1,
      'junior': 2,
      'mid': 3,
      'senior': 4,
      'manager': 5,
      'director': 6,
      'vp': 7,
      'executive': 8
    };
    
    return scores[level] || 1;
  } catch (error) {
    console.error("Error getting level score:", error);
    return 1;
  }
}

function classifyTransition(from, to) {
  try {
    if (from.company === to.company) return 'internal';
    if (isPromotion(from.level, to.level)) return 'promotion';
    if (getLevelScore(to.level) > getLevelScore(from.level)) return 'advancement';
    return 'lateral';
  } catch (error) {
    console.error("Error classifying transition:", error);
    return 'unknown';
  }
}

function calculateGap(endDate, startDate) {
  try {
    if (!endDate || !startDate) return 0;
    
    const end = new Date(endDate);
    const start = new Date(startDate);
    return Math.floor((start - end) / (1000 * 60 * 60 * 24)); // days
  } catch (error) {
    console.error("Error calculating gap:", error);
    return 0;
  }
}

function identifyTransitionPatterns(transitions) {
  try {
    const patterns = {
      frequency: {},
      types: {},
      companies: {}
    };
    
    transitions.forEach(transition => {
      patterns.types[transition.transitionType] = (patterns.types[transition.transitionType] || 0) + 1;
      patterns.companies[transition.toCompany] = (patterns.companies[transition.toCompany] || 0) + 1;
    });
    
    return patterns;
  } catch (error) {
    console.error("Error identifying transition patterns:", error);
    return {};
  }
}

function calculateTransitionFrequency(transitions) {
  try {
    if (transitions.length === 0) return 0;
    
    const totalDuration = transitions.reduce((sum, t) => sum + (t.duration || 0), 0);
    return transitions.length / (totalDuration / 12); // transitions per year
  } catch (error) {
    console.error("Error calculating transition frequency:", error);
    return 0;
  }
}

function calculateSkillAcquisition(skillTimeline) {
  try {
    const years = Object.keys(skillTimeline).sort();
    const acquisition = {};
    
    years.forEach(year => {
      acquisition[year] = skillTimeline[year].size;
    });
    
    return acquisition;
  } catch (error) {
    console.error("Error calculating skill acquisition:", error);
    return {};
  }
}

function calculateSkillRetention(skillTimeline) {
  try {
    const years = Object.keys(skillTimeline).sort();
    const retention = {};
    
    for (let i = 1; i < years.length; i++) {
      const prevYear = new Set(skillTimeline[years[i - 1]]);
      const currYear = skillTimeline[years[i]];
      
      const retained = Array.from(currYear).filter(skill => prevYear.has(skill));
      retention[years[i]] = {
        retained: retained.length,
        total: currYear.size,
        rate: retained.length / currYear.size
      };
    }
    
    return retention;
  } catch (error) {
    console.error("Error calculating skill retention:", error);
    return {};
  }
}

function calculateSkillProgression(skillTimeline) {
  try {
    const years = Object.keys(skillTimeline).sort();
    const progression = {};
    
    years.forEach(year => {
      progression[year] = Array.from(skillTimeline[year]);
    });
    
    return progression;
  } catch (error) {
    console.error("Error calculating skill progression:", error);
    return {};
  }
}

function identifyEmergingSkills(skillTimeline) {
  try {
    const years = Object.keys(skillTimeline).sort();
    const recentSkills = new Set();
    
    if (years.length >= 2) {
      const recentYear = years[years.length - 1];
      const previousYear = years[years.length - 2];
      
      skillTimeline[recentYear].forEach(skill => {
        if (!skillTimeline[previousYear].has(skill)) {
          recentSkills.add(skill);
        }
      });
    }
    
    return Array.from(recentSkills);
  } catch (error) {
    console.error("Error identifying emerging skills:", error);
    return [];
  }
}

function classifyCompanyTransition(from, to) {
  try {
    if (from.industry === to.industry) return 'same_industry';
    if (isStartup(from.company) && isEnterprise(to.company)) return 'startup_to_enterprise';
    if (isEnterprise(from.company) && isStartup(to.company)) return 'enterprise_to_startup';
    return 'cross_industry';
  } catch (error) {
    console.error("Error classifying company transition:", error);
    return 'unknown';
  }
}

function isStartup(company) {
  try {
    const startupKeywords = ['startup', 'inc', 'llc', 'early stage'];
    const companyLower = company.toLowerCase();
    return startupKeywords.some(keyword => companyLower.includes(keyword));
  } catch (error) {
    console.error("Error checking if company is startup:", error);
    return false;
  }
}

function isEnterprise(company) {
  try {
    const enterpriseCompanies = ['google', 'microsoft', 'amazon', 'apple', 'facebook'];
    const companyLower = company.toLowerCase();
    return enterpriseCompanies.some(enterprise => companyLower.includes(enterprise));
  } catch (error) {
    console.error("Error checking if company is enterprise:", error);
    return false;
  }
}

function assessCareerImpact(from, to) {
  try {
    const fromScore = getCompanyScore(from.company);
    const toScore = getCompanyScore(to.company);
    
    if (toScore > fromScore * 1.2) return 'positive';
    if (toScore < fromScore * 0.8) return 'negative';
    return 'neutral';
  } catch (error) {
    console.error("Error assessing career impact:", error);
    return 'neutral';
  }
}

function getCompanyScore(company) {
  try {
    const scores = {
      'google': 100,
      'microsoft': 95,
      'amazon': 90,
      'apple': 95,
      'facebook': 85
    };
    
    const companyLower = company.toLowerCase();
    for (const [key, score] of Object.entries(scores)) {
      if (companyLower.includes(key)) {
        return score;
      }
    }
    
    return 50; // Default score
  } catch (error) {
    console.error("Error getting company score:", error);
    return 50;
  }
}

function identifyMovementPatterns(movements) {
  try {
    const patterns = {
      frequency: movements.length,
      types: {},
      industries: {},
      impact: {}
    };
    
    movements.forEach(movement => {
      patterns.types[movement.transitionType] = (patterns.types[movement.transitionType] || 0) + 1;
      patterns.industries[movement.toIndustry] = (patterns.industries[movement.toIndustry] || 0) + 1;
      patterns.impact[movement.careerImpact] = (patterns.impact[movement.careerImpact] || 0) + 1;
    });
    
    return patterns;
  } catch (error) {
    console.error("Error identifying movement patterns:", error);
    return {};
  }
}

function calculateCompanyLoyalty(workExperience) {
  try {
    if (workExperience.length === 0) return 0;
    
    const totalDuration = workExperience.reduce((sum, exp) => sum + (exp.duration || 0), 0);
    const avgDuration = totalDuration / workExperience.length;
    
    return Math.min(avgDuration / 36, 1); // Normalize to 3 years
  } catch (error) {
    console.error("Error calculating company loyalty:", error);
    return 0.5;
  }
}

function calculateCompanyDiversity(movements) {
  try {
    const uniqueCompanies = new Set(movements.map(m => m.toCompany));
    return uniqueCompanies.size;
  } catch (error) {
    console.error("Error calculating company diversity:", error);
    return 0;
  }
}

function classifyIndustryChange(fromIndustry, toIndustry) {
  try {
    if (fromIndustry === toIndustry) return 'same';
    if (isTechIndustry(fromIndustry) && isTechIndustry(toIndustry)) return 'tech_to_tech';
    if (isTechIndustry(fromIndustry) && !isTechIndustry(toIndustry)) return 'tech_to_non_tech';
    if (!isTechIndustry(fromIndustry) && isTechIndustry(toIndustry)) return 'non_tech_to_tech';
    return 'cross_industry';
  } catch (error) {
    console.error("Error classifying industry change:", error);
    return 'unknown';
  }
}

function isTechIndustry(industry) {
  try {
    const techIndustries = ['technology', 'software', 'internet', 'fintech', 'healthtech'];
    return techIndustries.includes(industry?.toLowerCase());
  } catch (error) {
    console.error("Error checking if tech industry:", error);
    return false;
  }
}

function calculateIndustrySpecialization(industries) {
  try {
    if (industries.length === 0) return 0;
    
    const industryCounts = {};
    industries.forEach(industry => {
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(industryCounts));
    return maxCount / industries.length;
  } catch (error) {
    console.error("Error calculating industry specialization:", error);
    return 0;
  }
}

function calculateIndustryDiversity(industries) {
  try {
    return new Set(industries).size;
  } catch (error) {
    console.error("Error calculating industry diversity:", error);
    return 0;
  }
}

function calculateTimeToPromotion(fromPosition, toPosition) {
  try {
    return fromPosition.duration || 0;
  } catch (error) {
    console.error("Error calculating time to promotion:", error);
    return 0;
  }
}

function classifyPromotion(fromLevel, toLevel) {
  try {
    const levelDiff = getLevelScore(toLevel) - getLevelScore(fromLevel);
    
    if (levelDiff >= 3) return 'major';
    if (levelDiff >= 2) return 'significant';
    if (levelDiff >= 1) return 'minor';
    return 'lateral';
  } catch (error) {
    console.error("Error classifying promotion:", error);
    return 'unknown';
  }
}

function calculateLevelTrajectory(levels) {
  try {
    if (levels.length < 2) return 'stable';
    
    const firstScore = getLevelScore(levels[0]);
    const lastScore = getLevelScore(levels[levels.length - 1]);
    
    if (lastScore > firstScore + 2) return 'rapid';
    if (lastScore > firstScore) return 'steady';
    if (lastScore < firstScore) return 'declining';
    return 'stable';
  } catch (error) {
    console.error("Error calculating level trajectory:", error);
    return 'stable';
  }
}

function calculatePromotionVelocity(progression) {
  try {
    if (progression.length === 0) return 0;
    
    const totalTime = progression.reduce((sum, p) => sum + (p.timeToPromotion || 0), 0);
    return totalTime / progression.length;
  } catch (error) {
    console.error("Error calculating promotion velocity:", error);
    return 0;
  }
}

function calculateTotalLeadershipExperience(leadershipRoles) {
  try {
    return leadershipRoles.reduce((sum, role) => sum + (role.duration || 0), 0);
  } catch (error) {
    console.error("Error calculating total leadership experience:", error);
    return 0;
  }
}

function extractTeamSizes(leadershipRoles) {
  try {
    return leadershipRoles.map(role => role.teamSize || 5); // Default to 5 if not specified
  } catch (error) {
    console.error("Error extracting team sizes:", error);
    return [];
  }
}

function extractLeadershipSkills(leadershipRoles) {
  try {
    const allSkills = new Set();
    
    leadershipRoles.forEach(role => {
      if (role.skills) {
        role.skills.forEach(skill => allSkills.add(skill));
      }
    });
    
    return Array.from(allSkills);
  } catch (error) {
    console.error("Error extracting leadership skills:", error);
    return [];
  }
}

function inferManagementStyles(leadershipRoles) {
  try {
    const styles = [];
    
    leadershipRoles.forEach(role => {
      if (role.role.toLowerCase().includes('technical')) {
        styles.push('technical');
      }
      if (role.role.toLowerCase().includes('people')) {
        styles.push('people');
      }
      if (role.role.toLowerCase().includes('strategic')) {
        styles.push('strategic');
      }
    });
    
    return [...new Set(styles)];
  } catch (error) {
    console.error("Error inferring management styles:", error);
    return [];
  }
}

function calculateLeadershipImpact(leadershipRoles) {
  try {
    return leadershipRoles.reduce((sum, role) => sum + (role.impact || 50), 0) / leadershipRoles.length;
  } catch (error) {
    console.error("Error calculating leadership impact:", error);
    return 50;
  }
}

function identifyLeadershipEntryPoint(leadershipRoles) {
  try {
    if (leadershipRoles.length === 0) return 'none';
    
    const firstRole = leadershipRoles[0];
    return firstRole.role;
  } catch (error) {
    console.error("Error identifying leadership entry point:", error);
    return 'none';
  }
}

function mapLeadershipProgression(leadershipRoles) {
  try {
    return leadershipRoles.map(role => ({
      role: role.role,
      level: inferLevel(role.role, role.duration),
      duration: role.duration,
      teamSize: role.teamSize
    }));
  } catch (error) {
    console.error("Error mapping leadership progression:", error);
    return [];
  }
}

function calculateLeadershipAcceleration(leadershipRoles) {
  try {
    if (leadershipRoles.length < 2) return 0;
    
    const firstDuration = leadershipRoles[0].duration || 0;
    const lastDuration = leadershipRoles[leadershipRoles.length - 1].duration || 0;
    
    return (lastDuration - firstDuration) / leadershipRoles.length;
  } catch (error) {
    console.error("Error calculating leadership acceleration:", error);
    return 0;
  }
}

function identifyLeadershipPlateau(leadershipRoles) {
  try {
    if (leadershipRoles.length < 3) return false;
    
    const recentRoles = leadershipRoles.slice(-3);
    const levels = recentRoles.map(r => getLevelScore(inferLevel(r.role, r.duration)));
    
    return levels.every(level => level === levels[0]);
  } catch (error) {
    console.error("Error identifying leadership plateau:", error);
    return false;
  }
}

function getCurrentLeadershipLevel(leadershipRoles) {
  try {
    if (leadershipRoles.length === 0) return 'none';
    
    const lastRole = leadershipRoles[leadershipRoles.length - 1];
    const level = inferLevel(lastRole.role, lastRole.duration);
    
    if (level.includes('manager')) return 'manager';
    if (level.includes('director')) return 'director';
    if (level.includes('vp')) return 'vp';
    if (level.includes('executive')) return 'executive';
    if (level.includes('lead')) return 'team_lead';
    
    return 'individual_contributor';
  } catch (error) {
    console.error("Error getting current leadership level:", error);
    return 'none';
  }
}

function identifyLeadershipGaps(leadershipData) {
  try {
    const gaps = [];
    
    if (leadershipData.leadershipSkills.length < 5) {
      gaps.push('insufficient_leadership_skills');
    }
    
    if (leadershipData.totalLeadershipExperience < 24) {
      gaps.push('insufficient_leadership_experience');
    }
    
    if (leadershipData.teamSizes.some(size => size > 20)) {
      gaps.push('large_team_management');
    }
    
    return gaps;
  } catch (error) {
    console.error("Error identifying leadership gaps:", error);
    return [];
  }
}

function recommendLeadershipTraining(leadershipData) {
  try {
    const training = [];
    
    if (leadershipData.managementStyles.includes('technical')) {
      training.push('people_management_training');
    }
    
    if (leadershipData.totalLeadershipExperience < 12) {
      training.push('leadership_fundamentals');
    }
    
    return training;
  } catch (error) {
    console.error("Error recommending leadership training:", error);
    return [];
  }
}

function identifyMentorshipOpportunities(leadershipData) {
  try {
    return [];
  } catch (error) {
    console.error("Error identifying mentorship opportunities:", error);
    return [];
  }
}

function estimateLeadershipTimeline(leadershipData) {
  try {
    const currentLevel = getCurrentLeadershipLevel(leadershipData.roles);
    
    const timelines = {
      'team_lead': '12-18 months',
      'manager': '18-24 months',
      'director': '24-36 months',
      'vp': '36-48 months',
      'executive': '48+ months'
    };
    
    return timelines[currentLevel] || 'unknown';
  } catch (error) {
    console.error("Error estimating leadership timeline:", error);
    return 'unknown';
  }
}

function identifyCareerSpecializations(careerPath) {
  try {
    const specializations = [];
    
    careerPath.forEach(position => {
      if (position.role && position.role.toLowerCase().includes('software')) {
        specializations.push('software_engineering');
      }
      if (position.role && position.role.toLowerCase().includes('data')) {
        specializations.push('data_science');
      }
    });
    
    return [...new Set(specializations)];
  } catch (error) {
    console.error("Error identifying career specializations:", error);
    return [];
  }
}

function calculateDomainExperience(careerPath) {
  try {
    const experience = {};
    
    careerPath.forEach(position => {
      if (position.industry && position.duration) {
        experience[position.industry] = (experience[position.industry] || 0) + position.duration;
      }
    });
    
    return experience;
  } catch (error) {
    console.error("Error calculating domain experience:", error);
    return {};
  }
}

function aggregateDomainSkills(careerPath) {
  try {
    const allSkills = new Set();
    
    careerPath.forEach(position => {
      if (position.skills) {
        position.skills.forEach(skill => allSkills.add(skill));
      }
    });
    
    return Array.from(allSkills);
  } catch (error) {
    console.error("Error aggregating domain skills:", error);
    return [];
  }
}

function extractDomainAchievements(careerPath) {
  try {
    return [];
  } catch (error) {
    console.error("Error extracting domain achievements:", error);
    return [];
  }
}

function calculateSpecializationConfidence(industryExperience, totalExperience) {
  try {
    if (totalExperience === 0) return 0;
    return Math.min(industryExperience / totalExperience, 1.0);
  } catch (error) {
    console.error("Error calculating specialization confidence:", error);
    return 0.5;
  }
}

function getRelatedSkills(industry, skills) {
  try {
    const industrySkills = {
      'technology': ['programming', 'software', 'development', 'coding'],
      'finance': ['banking', 'investment', 'trading', 'analysis'],
      'healthcare': ['medical', 'health', 'patient', 'clinical'],
      'consulting': ['strategy', 'management', 'advisory', 'analysis']
    };
    
    const relatedSkills = industrySkills[industry] || [];
    return skills.filter(skill => 
      relatedSkills.some(related => skill.toLowerCase().includes(related))
    );
  } catch (error) {
    console.error("Error getting related skills:", error);
    return [];
  }
}

function determineExpertiseLevel(experience) {
  try {
    if (experience < 2) return 'beginner';
    if (experience < 5) return 'intermediate';
    if (experience < 10) return 'advanced';
    return 'expert';
  } catch (error) {
    console.error("Error determining expertise level:", error);
    return 'beginner';
  }
}

function calculateMarketValue(domain, experience) {
  try {
    const baseValues = {
      'technology': 120000,
      'finance': 130000,
      'consulting': 110000,
      'healthcare': 100000
    };
    
    const baseValue = baseValues[domain] || 80000;
    const experienceMultiplier = 1 + (experience / 10);
    
    return baseValue * experienceMultiplier;
  } catch (error) {
    console.error("Error calculating market value:", error);
    return 80000;
  }
}

function calculateGrowthPotential(domain) {
  try {
    const growthRates = {
      'technology': 0.8,
      'fintech': 0.9,
      'healthcare': 0.6,
      'consulting': 0.5
    };
    
    return growthRates[domain] || 0.5;
  } catch (error) {
    console.error("Error calculating growth potential:", error);
    return 0.5;
  }
}

function identifyEmergingDomains(specializations) {
  try {
    return specializations.filter(spec => 
      spec.domain.toLowerCase().includes('ai') || 
      spec.domain.toLowerCase().includes('blockchain') ||
      spec.domain.toLowerCase().includes('fintech')
    );
  } catch (error) {
    console.error("Error identifying emerging domains:", error);
    return [];
  }
}

function identifyDecliningDomains(specializations) {
  try {
    return [];
  } catch (error) {
    console.error("Error identifying declining domains:", error);
    return [];
  }
}

function identifyStableDomains(specializations) {
  try {
    return specializations.filter(spec => 
      ['technology', 'finance', 'healthcare'].includes(spec.domain.toLowerCase())
    );
  } catch (error) {
    console.error("Error identifying stable domains:", error);
    return [];
  }
}

function calculateMarketDemand(specializations) {
  try {
    const demand = {};
    
    specializations.forEach(spec => {
      demand[spec.domain] = calculateGrowthPotential(spec.domain);
    });
    
    return demand;
  } catch (error) {
    console.error("Error calculating market demand:", error);
    return {};
  }
}

function extractTechnicalSkills(careerPath) {
  try {
    const technicalSkills = new Set();
    
    careerPath.forEach(position => {
      if (position.skills) {
        position.skills.forEach(skill => {
          if (isTechnicalSkill(skill)) {
            technicalSkills.add(skill);
          }
        });
      }
    });
    
    return Array.from(technicalSkills);
  } catch (error) {
    console.error("Error extracting technical skills:", error);
    return [];
  }
}

function extractManagementSkills(careerPath) {
  try {
    const managementSkills = new Set();
    
    careerPath.forEach(position => {
      if (position.skills) {
        position.skills.forEach(skill => {
          if (isManagementSkill(skill)) {
            managementSkills.add(skill);
          }
        });
      }
    });
    
    return Array.from(managementSkills);
  } catch (error) {
    console.error("Error extracting management skills:", error);
    return [];
  }
}

function isTechnicalSkill(skill) {
  try {
    const technicalKeywords = [
      'javascript', 'python', 'java', 'react', 'node', 'aws', 'docker',
      'kubernetes', 'sql', 'mongodb', 'git', 'ci/cd', 'microservices',
      'machine learning', 'ai', 'data science', 'algorithms'
    ];
    
    const skillLower = skill.toLowerCase();
    return technicalKeywords.some(keyword => skillLower.includes(keyword));
  } catch (error) {
    console.error("Error checking if technical skill:", error);
    return false;
  }
}

function isManagementSkill(skill) {
  try {
    const managementKeywords = [
      'management', 'leadership', 'team', 'project', 'agile', 'scrum',
      'planning', 'strategy', 'mentoring', 'coaching', 'communication'
    ];
    
    const skillLower = skill.toLowerCase();
    return managementKeywords.some(keyword => skillLower.includes(keyword));
  } catch (error) {
    console.error("Error checking if management skill:", error);
    return false;
  }
}

function identifyProjectTypes(careerPath) {
  try {
    const projectTypes = [];
    
    careerPath.forEach(position => {
      if (position.role) {
        const roleLower = position.role.toLowerCase();
        if (roleLower.includes('full stack')) projectTypes.push('full_stack');
        if (roleLower.includes('backend')) projectTypes.push('backend');
        if (roleLower.includes('frontend')) projectTypes.push('frontend');
        if (roleLower.includes('mobile')) projectTypes.push('mobile');
        if (roleLower.includes('data')) projectTypes.push('data');
      }
    });
    
    return [...new Set(projectTypes)];
  } catch (error) {
    console.error("Error identifying project types:", error);
    return [];
  }
}

function aggregateTechnologies(careerPath) {
  try {
    const technologies = new Set();
    
    careerPath.forEach(position => {
      if (position.skills) {
        position.skills.forEach(skill => {
          if (isTechnology(skill)) {
            technologies.add(skill);
          }
        });
      }
    });
    
    return Array.from(technologies);
  } catch (error) {
    console.error("Error aggregating technologies:", error);
    return [];
  }
}

function isTechnology(skill) {
  try {
    const techKeywords = [
      'react', 'angular', 'vue', 'node', 'express', 'django', 'flask',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins',
      'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch'
    ];
    
    const skillLower = skill.toLowerCase();
    return techKeywords.some(keyword => skillLower.includes(keyword));
  } catch (error) {
    console.error("Error checking if technology:", error);
    return false;
  }
}

function extractMethodologies(careerPath) {
  try {
    const methodologies = new Set();
    
    careerPath.forEach(position => {
      if (position.skills) {
        position.skills.forEach(skill => {
          if (isMethodology(skill)) {
            methodologies.add(skill);
          }
        });
      }
    });
    
    return Array.from(methodologies);
  } catch (error) {
    console.error("Error extracting methodologies:", error);
    return [];
  }
}

function isMethodology(skill) {
  try {
    const methodologyKeywords = [
      'agile', 'scrum', 'kanban', 'waterfall', 'devops', 'lean',
      'tdd', 'bdd', 'cicd', 'continuous integration'
    ];
    
    const skillLower = skill.toLowerCase();
    return methodologyKeywords.some(keyword => skillLower.includes(keyword));
  } catch (error) {
    console.error("Error checking if methodology:", error);
    return false;
  }
}

function analyzeTechnicalSkillProgression(technicalSkills) {
  try {
    return {
      totalSkills: technicalSkills.length,
      skillCategories: categorizeSkills(technicalSkills),
      progression: calculateSkillProgression(technicalSkills),
      expertise: calculateSkillExpertise(technicalSkills)
    };
  } catch (error) {
    console.error("Error analyzing technical skill progression:", error);
    return {};
  }
}

function categorizeSkills(skills) {
  try {
    const categories = {
      frontend: [],
      backend: [],
      database: [],
      cloud: [],
      devops: [],
      other: []
    };
    
    skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (['react', 'angular', 'vue', 'html', 'css'].some(f => skillLower.includes(f))) {
        categories.frontend.push(skill);
      } else if (['node', 'python', 'java', 'c#', 'go'].some(b => skillLower.includes(b))) {
        categories.backend.push(skill);
      } else if (['sql', 'mysql', 'postgresql', 'mongodb'].some(d => skillLower.includes(d))) {
        categories.database.push(skill);
      } else if (['aws', 'azure', 'gcp', 'cloud'].some(c => skillLower.includes(c))) {
        categories.cloud.push(skill);
      } else if (['docker', 'kubernetes', 'devops', 'ci/cd'].some(d => skillLower.includes(d))) {
        categories.devops.push(skill);
      } else {
        categories.other.push(skill);
      }
    });
    
    return categories;
  } catch (error) {
    console.error("Error categorizing skills:", error);
    return { frontend: [], backend: [], database: [], cloud: [], devops: [], other: [] };
  }
}

function calculateSkillProgression(skills) {
  try {
    return {
      acquisition_rate: skills.length / 10, // Placeholder
      retention_rate: 0.8, // Placeholder
      evolution: 'steady'
    };
  } catch (error) {
    console.error("Error calculating skill progression:", error);
    return {};
  }
}

function calculateSkillExpertise(skills) {
  try {
    return {
      expert_skills: skills.slice(0, 3),
      intermediate_skills: skills.slice(3, 7),
      beginner_skills: skills.slice(7)
    };
  } catch (error) {
    console.error("Error calculating skill expertise:", error);
    return { expert_skills: [], intermediate_skills: [], beginner_skills: [] };
  }
}

function analyzeTechnologyAdoption(technologies) {
  try {
    return {
      total_technologies: technologies.length,
      adoption_rate: technologies.length / 15, // Placeholder
      diversity: calculateTechDiversity(technologies),
      modern_tech: identifyModernTech(technologies)
    };
  } catch (error) {
    console.error("Error analyzing technology adoption:", error);
    return {};
  }
}

function calculateTechDiversity(technologies) {
  try {
    const categories = categorizeSkills(technologies);
    const nonEmptyCategories = Object.values(categories).filter(cat => cat.length > 0).length;
    return nonEmptyCategories / 6; // 6 total categories
  } catch (error) {
    console.error("Error calculating tech diversity:", error);
    return 0;
  }
}

function identifyModernTech(technologies) {
  try {
    const modernTech = ['react', 'kubernetes', 'docker', 'aws', 'azure', 'gcp'];
    return technologies.filter(tech => 
      modernTech.some(modern => tech.toLowerCase().includes(modern))
    );
  } catch (error) {
    console.error("Error identifying modern tech:", error);
    return [];
  }
}

function analyzeComplexityGrowth(projectTypes) {
  try {
    return {
      complexity_level: calculateComplexityLevel(projectTypes),
      growth_rate: projectTypes.length / 5, // Placeholder
      diversity: projectTypes.length
    };
  } catch (error) {
    console.error("Error analyzing complexity growth:", error);
    return {};
  }
}

function calculateComplexityLevel(projectTypes) {
  try {
    const complexityScores = {
      'full_stack': 4,
      'backend': 3,
      'frontend': 2,
      'mobile': 3,
      'data': 4
    };
    
    if (projectTypes.length === 0) return 1;
    
    const totalScore = projectTypes.reduce((sum, type) => 
      sum + (complexityScores[type] || 1), 0
    );
    
    return totalScore / projectTypes.length;
  } catch (error) {
    console.error("Error calculating complexity level:", error);
    return 1;
  }
}

function analyzeTechnicalSpecialization(technicalSkills) {
  try {
    return {
      specialization_level: calculateSpecializationLevel(technicalSkills),
      focus_areas: identifyFocusAreas(technicalSkills),
      depth: calculateTechnicalDepth(technicalSkills)
    };
  } catch (error) {
    console.error("Error analyzing technical specialization:", error);
    return {};
  }
}

function calculateSpecializationLevel(skills) {
  try {
    const categories = categorizeSkills(skills);
    const dominantCategory = Object.entries(categories)
      .reduce((max, [category, skillList]) => 
        skillList.length > max.count ? { category, count: skillList.length } : max,
        { category: '', count: 0 }
      );
    
    return dominantCategory.count / skills.length;
  } catch (error) {
    console.error("Error calculating specialization level:", error);
    return 0;
  }
}

function identifyFocusAreas(skills) {
  try {
    const categories = categorizeSkills(skills);
    return Object.entries(categories)
      .filter(([, skillList]) => skillList.length > 0)
      .map(([category, skillList]) => ({ category, skills: skillList }));
  } catch (error) {
    console.error("Error identifying focus areas:", error);
    return [];
  }
}

function calculateTechnicalDepth(skills) {
  try {
    return Math.min(skills.length / 10, 1.0);
  } catch (error) {
    console.error("Error calculating technical depth:", error);
    return 0;
  }
}

function analyzeManagementSkillDevelopment(managementSkills) {
  try {
    return {
      total_skills: managementSkills.length,
      skill_areas: categorizeManagementSkills(managementSkills),
      development_level: calculateManagementDevelopmentLevel(managementSkills),
      breadth: calculateManagementBreadth(managementSkills)
    };
  } catch (error) {
    console.error("Error analyzing management skill development:", error);
    return {};
  }
}

function categorizeManagementSkills(skills) {
  try {
    const categories = {
      leadership: [],
      communication: [],
      planning: [],
      technical: [],
      people: [],
      strategy: []
    };
    
    skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (['leadership', 'mentoring', 'coaching'].some(l => skillLower.includes(l))) {
        categories.leadership.push(skill);
      } else if (['communication', 'presentation', 'negotiation'].some(c => skillLower.includes(c))) {
        categories.communication.push(skill);
      } else if (['planning', 'scheduling', 'estimation'].some(p => skillLower.includes(p))) {
        categories.planning.push(skill);
      } else if (['technical', 'architecture', 'design'].some(t => skillLower.includes(t))) {
        categories.technical.push(skill);
      } else if (['team', 'collaboration', 'conflict'].some(p => skillLower.includes(p))) {
        categories.people.push(skill);
      } else if (['strategy', 'vision', 'roadmap'].some(s => skillLower.includes(s))) {
        categories.strategy.push(skill);
      }
    });
    
    return categories;
  } catch (error) {
    console.error("Error categorizing management skills:", error);
    return { leadership: [], communication: [], planning: [], technical: [], people: [], strategy: [] };
  }
}

function calculateManagementDevelopmentLevel(managementSkills) {
  try {
    return Math.min(managementSkills.length / 8, 1.0);
  } catch (error) {
    console.error("Error calculating management development level:", error);
    return 0;
  }
}

function calculateManagementBreadth(managementSkills) {
  try {
    const categories = categorizeManagementSkills(managementSkills);
    const nonEmptyCategories = Object.values(categories).filter(cat => cat.length > 0).length;
    return nonEmptyCategories / 6; // 6 total categories
  } catch (error) {
    console.error("Error calculating management breadth:", error);
    return 0;
  }
}

function analyzeProjectComplexityGrowth(projectTypes) {
  try {
    return {
      current_complexity: calculateComplexityLevel(projectTypes),
      growth_trajectory: 'increasing', // Placeholder
      handling_capacity: projectTypes.length
    };
  } catch (error) {
    console.error("Error analyzing project complexity growth:", error);
    return {};
  }
}

function analyzeLeadershipEvolution(managementSkills) {
  try {
    return {
      leadership_style: inferLeadershipStyle(managementSkills),
      evolution_stage: determineLeadershipStage(managementSkills),
      readiness: assessLeadershipReadiness(managementSkills)
    };
  } catch (error) {
    console.error("Error analyzing leadership evolution:", error);
    return {};
  }
}

function inferLeadershipStyle(managementSkills) {
  try {
    const categories = categorizeManagementSkills(managementSkills);
    
    if (categories.technical.length > categories.people.length) {
      return 'technical_leader';
    } else if (categories.people.length > categories.technical.length) {
      return 'people_leader';
    } else if (categories.strategy.length > 0) {
      return 'strategic_leader';
    }
    
    return 'balanced_leader';
  } catch (error) {
    console.error("Error inferring leadership style:", error);
    return 'unknown';
  }
}

function determineLeadershipStage(managementSkills) {
  try {
    const developmentLevel = calculateManagementDevelopmentLevel(managementSkills);
    
    if (developmentLevel < 0.3) return 'emerging';
    if (developmentLevel < 0.6) return 'developing';
    if (developmentLevel < 0.8) return 'maturing';
    return 'established';
  } catch (error) {
    console.error("Error determining leadership stage:", error);
    return 'emerging';
  }
}

function assessLeadershipReadiness(managementSkills) {
  try {
    const categories = categorizeManagementSkills(managementSkills);
    const readinessScore = (
      (categories.leadership.length * 0.3) +
      (categories.communication.length * 0.2) +
      (categories.planning.length * 0.2) +
      (categories.people.length * 0.3)
    ) / managementSkills.length;
    
    return Math.min(readinessScore, 1.0);
  } catch (error) {
    console.error("Error assessing leadership readiness:", error);
    return 0.5;
  }
}

function analyzeTeamSizeProgression(teamSizes) {
  try {
    return {
      current_size: teamSizes[teamSizes.length - 1] || 0,
      growth_rate: calculateTeamGrowthRate(teamSizes),
      max_size: Math.max(...teamSizes),
      progression_trend: analyzeTeamProgressionTrend(teamSizes)
    };
  } catch (error) {
    console.error("Error analyzing team size progression:", error);
    return {};
  }
}

function calculateTeamGrowthRate(teamSizes) {
  try {
    if (teamSizes.length < 2) return 0;
    
    const firstSize = teamSizes[0];
    const lastSize = teamSizes[teamSizes.length - 1];
    
    return (lastSize - firstSize) / firstSize;
  } catch (error) {
    console.error("Error calculating team growth rate:", error);
    return 0;
  }
}

function analyzeTeamProgressionTrend(teamSizes) {
  try {
    if (teamSizes.length < 3) return 'stable';
    
    const recent = teamSizes.slice(-3);
    const trend = recent[2] - recent[0];
    
    if (trend > 5) return 'growing';
    if (trend < -5) return 'shrinking';
    return 'stable';
  } catch (error) {
    console.error("Error analyzing team progression trend:", error);
    return 'stable';
  }
}

function analyzeHybridGrowth(engineeringData) {
  try {
    const technicalScore = calculateTechnicalScore(engineeringData);
    const managementScore = calculateManagementScore(engineeringData);
    
    return {
      balance_score: Math.abs(technicalScore - managementScore),
      hybrid_type: determineHybridType(technicalScore, managementScore),
      effectiveness: calculateHybridEffectiveness(engineeringData),
      transition_points: identifyTransitionPoints(engineeringData)
    };
  } catch (error) {
    console.error("Error analyzing hybrid growth:", error);
    return {};
  }
}

function calculateTechnicalScore(engineeringData) {
  try {
    return Math.min(engineeringData.technicalSkills.length / 15, 1.0);
  } catch (error) {
    console.error("Error calculating technical score:", error);
    return 0;
  }
}

function calculateManagementScore(engineeringData) {
  try {
    return Math.min(engineeringData.managementSkills.length / 10, 1.0);
  } catch (error) {
    console.error("Error calculating management score:", error);
    return 0;
  }
}

function determineHybridType(technicalScore, managementScore) {
  try {
    if (technicalScore > 0.7 && managementScore > 0.7) return 'balanced_hybrid';
    if (technicalScore > managementScore) return 'technical_lead_hybrid';
    if (managementScore > technicalScore) return 'management_lead_hybrid';
    return 'developing_hybrid';
  } catch (error) {
    console.error("Error determining hybrid type:", error);
    return 'unknown';
  }
}

function calculateHybridEffectiveness(engineeringData) {
  try {
    const technicalScore = calculateTechnicalScore(engineeringData);
    const managementScore = calculateManagementScore(engineeringData);
    
    return (technicalScore + managementScore) / 2;
  } catch (error) {
    console.error("Error calculating hybrid effectiveness:", error);
    return 0.5;
  }
}

function identifyTransitionPoints(engineeringData) {
  try {
    return [];
  } catch (error) {
    console.error("Error identifying transition points:", error);
    return [];
  }
}

function analyzeTechnicalManagementBalance(engineeringData) {
  try {
    const technicalScore = calculateTechnicalScore(engineeringData);
    const managementScore = calculateManagementScore(engineeringData);
    
    return {
      technical_score: technicalScore,
      management_score: managementScore,
      balance: Math.abs(technicalScore - managementScore),
      recommendation: generateBalanceRecommendation(technicalScore, managementScore)
    };
  } catch (error) {
    console.error("Error analyzing technical management balance:", error);
    return {};
  }
}

function generateBalanceRecommendation(technicalScore, managementScore) {
  try {
    if (technicalScore > 0.8 && managementScore < 0.4) {
      return 'Focus on developing management skills';
    } else if (managementScore > 0.8 && technicalScore < 0.4) {
      return 'Focus on maintaining technical skills';
    } else if (technicalScore > 0.6 && managementScore > 0.6) {
      return 'Well-balanced technical and management profile';
    } else {
      return 'Continue developing both technical and management skills';
    }
  } catch (error) {
    console.error("Error generating balance recommendation:", error);
    return 'Continue developing skills';
  }
}

function identifyTransitionPoints(engineeringData) {
  try {
    return [];
  } catch (error) {
    console.error("Error identifying transition points:", error);
    return [];
  }
}

function identifyHybridSkills(engineeringData) {
  try {
    const hybridSkills = [];
    
    engineeringData.technicalSkills.forEach(tech => {
      engineeringData.managementSkills.forEach(mgmt => {
        if (isHybridSkill(tech, mgmt)) {
          hybridSkills.push(`${tech}+${mgmt}`);
        }
      });
    });
    
    return hybridSkills;
  } catch (error) {
    console.error("Error identifying hybrid skills:", error);
    return [];
  }
}

function isHybridSkill(technical, management) {
  try {
    const hybridCombinations = [
      ['architecture', 'leadership'],
      ['design', 'planning'],
      ['development', 'mentoring']
    ];
    
    return hybridCombinations.some(([tech, mgmt]) => 
      technical.toLowerCase().includes(tech) && management.toLowerCase().includes(mgmt)
    );
  } catch (error) {
    console.error("Error checking if hybrid skill:", error);
    return false;
  }
}

function calculateHybridEffectiveness(engineeringData) {
  try {
    const technicalScore = calculateTechnicalScore(engineeringData);
    const managementScore = calculateManagementScore(engineeringData);
    const hybridSkills = identifyHybridSkills(engineeringData);
    
    return (technicalScore + managementScore + (hybridSkills.length / 5)) / 3;
  } catch (error) {
    console.error("Error calculating hybrid effectiveness:", error);
    return 0.5;
  }
}

function generateTechnicalNextSteps(technicalGrowth) {
  try {
    const steps = [];
    
    if (technicalGrowth.totalSkills < 10) {
      steps.push('Expand technical skill set');
    }
    
    if (technicalGrowth.skillCategories.backend.length === 0) {
      steps.push('Develop backend expertise');
    }
    
    return steps;
  } catch (error) {
    console.error("Error generating technical next steps:", error);
    return [];
  }
}

function generateManagementNextSteps(managementGrowth) {
  try {
    const steps = [];
    
    if (managementGrowth.total_skills < 5) {
      steps.push('Develop management skills');
    }
    
    if (managementGrowth.skill_categories.leadership.length === 0) {
      steps.push('Focus on leadership development');
    }
    
    return steps;
  } catch (error) {
    console.error("Error generating management next steps:", error);
    return [];
  }
}

function generateHybridNextSteps(hybridGrowth) {
  try {
    const steps = [];
    
    if (hybridGrowth.balance_score > 0.3) {
      steps.push('Work on balancing technical and management skills');
    }
    
    if (hybridGrowth.hybrid_type === 'developing_hybrid') {
      steps.push('Develop hybrid leadership capabilities');
    }
    
    return steps;
  } catch (error) {
    console.error("Error generating hybrid next steps:", error);
    return [];
  }
}

function assessTechnicalDemand(technicalSkills) {
  try {
    const demandScores = {
      'react': 0.9,
      'python': 0.85,
      'aws': 0.8,
      'kubernetes': 0.85,
      'machine learning': 0.9
    };
    
    let totalDemand = 0;
    let count = 0;
    
    technicalSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      for (const [tech, demand] of Object.entries(demandScores)) {
        if (skillLower.includes(tech)) {
          totalDemand += demand;
          count++;
          break;
        }
      }
    });
    
    return count > 0 ? totalDemand / count : 0.5;
  } catch (error) {
    console.error("Error assessing technical demand:", error);
    return 0.5;
  }
}

function assessManagementDemand(managementSkills) {
  try {
    const demandScores = {
      'leadership': 0.8,
      'project management': 0.75,
      'agile': 0.8,
      'strategy': 0.7,
      'communication': 0.7
    };
    
    let totalDemand = 0;
    let count = 0;
    
    managementSkills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      for (const [mgmt, demand] of Object.entries(demandScores)) {
        if (skillLower.includes(mgmt)) {
          totalDemand += demand;
          count++;
          break;
        }
      }
    });
    
    return count > 0 ? totalDemand / count : 0.5;
  } catch (error) {
    console.error("Error assessing management demand:", error);
    return 0.5;
  }
}

function calculateMarketValue(engineeringData) {
  try {
    const technicalScore = calculateTechnicalScore(engineeringData);
    const managementScore = calculateManagementScore(engineeringData);
    
    const baseSalary = 80000;
    const technicalPremium = technicalScore * 40000;
    const managementPremium = managementScore * 30000;
    
    return baseSalary + technicalPremium + managementPremium;
  } catch (error) {
    console.error("Error calculating market value:", error);
    return 80000;
  }
}

function calculateCompetitiveness(engineeringData) {
  try {
    const technicalScore = calculateTechnicalScore(engineeringData);
    const managementScore = calculateManagementScore(engineeringData);
    const technicalDemand = assessTechnicalDemand(engineeringData.technicalSkills);
    const managementDemand = assessManagementDemand(engineeringData.managementSkills);
    
    return (technicalScore * technicalDemand + managementScore * managementDemand) / 2;
  } catch (error) {
    console.error("Error calculating competitiveness:", error);
    return 0.5;
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

async function findCompanyRelationships(company, maxDepth) {
  try {
    return [];
  } catch (error) {
    console.error("Error finding company relationships:", error);
    return [];
  }
}

async function findSchoolRelationships(school, maxDepth) {
  try {
    return [];
  } catch (error) {
    console.error("Error finding school relationships:", error);
    return [];
  }
}

async function findSkillRelationships(skills, maxDepth) {
  try {
    return [];
  } catch (error) {
    console.error("Error finding skill relationships:", error);
    return [];
  }
}

function calculateEdgeWeight(relationship) {
  try {
    return relationship.strength || 0.5;
  } catch (error) {
    console.error("Error calculating edge weight:", error);
    return 0.5;
  }
}

function calculateNetworkDiversity(relationships) {
  try {
    const types = new Set(relationships.map(r => r.type));
    return types.size;
  } catch (error) {
    console.error("Error calculating network diversity:", error);
    return 0;
  }
}

function calculateCentrality(relationships) {
  try {
    return relationships.length;
  } catch (error) {
    console.error("Error calculating centrality:", error);
    return 0;
  }
}

async function findSecondDegreeConnections(targetId) {
  try {
    return [];
  } catch (error) {
    console.error("Error finding second degree connections:", error);
    return [];
  }
}

async function getMarketTrends() {
  try {
    return {};
  } catch (error) {
    console.error("Error getting market trends:", error);
    return {};
  }
}

function identifyPotentialRoles(currentRole) {
  try {
    const roleProgression = {
      'software engineer': ['senior software engineer', 'tech lead', 'engineering manager'],
      'senior software engineer': ['tech lead', 'engineering manager', 'principal engineer'],
      'tech lead': ['engineering manager', 'principal engineer'],
      'engineering manager': ['senior engineering manager', 'director of engineering'],
      'product manager': ['senior product manager', 'group product manager'],
      'data scientist': ['senior data scientist', 'data science lead']
    };
    
    const currentRoleLower = currentRole.role.toLowerCase();
    
    for (const [role, progressions] of Object.entries(roleProgression)) {
      if (currentRoleLower.includes(role)) {
        return progressions;
      }
    }
    
    return ['senior role', 'management role'];
  } catch (error) {
    console.error("Error identifying potential roles:", error);
    return [];
  }
}

function calculateTransitionProbability(fromRole, toRole, marketData) {
  try {
    let probability = 0.5;
    
    if (isPromotion(inferLevel(fromRole.role), inferLevel(toRole))) {
      probability += 0.3;
    }
    
    if (marketData[toRole]) {
      probability += marketData[toRole] * 0.2;
    }
    
    return Math.min(probability, 1.0);
  } catch (error) {
    console.error("Error calculating transition probability:", error);
    return 0.5;
  }
}

function estimateTimeframe(fromRole, toRole) {
  try {
    const fromLevel = inferLevel(fromRole.role);
    const toLevel = inferLevel(toRole);
    
    if (isPromotion(fromLevel, toLevel)) {
      return '12-24 months';
    }
    
    return '6-12 months';
  } catch (error) {
    console.error("Error estimating timeframe:", error);
    return '12 months';
  }
}

function identifyTransitionRequirements(fromRole, toRole) {
  try {
    const requirements = [];
    
    if (isPromotion(inferLevel(fromRole.role), inferLevel(toRole))) {
      requirements.push('Additional experience');
      requirements.push('Leadership skills');
    }
    
    if (toRole.toLowerCase().includes('manager')) {
      requirements.push('Management experience');
      requirements.push('People skills');
    }
    
    return requirements;
  } catch (error) {
    console.error("Error identifying transition requirements:", error);
    return [];
  }
}

function getMarketDemand(role, marketData) {
  try {
    return marketData[role] || 0.5;
  } catch (error) {
    console.error("Error getting market demand:", error);
    return 0.5;
  }
}

function predictNextRole(careerPath, patterns) {
  try {
    const currentRole = careerPath[careerPath.length - 1];
    const potentialRoles = identifyPotentialRoles(currentRole);
    
    return potentialRoles[0] || 'senior role';
  } catch (error) {
    console.error("Error predicting next role:", error);
    return 'senior role';
  }
}

function predictTimeline(careerPath, patterns) {
  try {
    const progressionRate = patterns.progression?.progressionRate || 0;
    
    if (progressionRate > 0.5) return '6-12 months';
    if (progressionRate > 0.3) return '12-18 months';
    return '18-24 months';
  } catch (error) {
    console.error("Error predicting timeline:", error);
    return '12 months';
  }
}

function predictSalaryProgression(careerPath, patterns) {
  try {
    const currentSalary = 80000; // Placeholder
    const growth = patterns.progression?.growth || 0;
    
    return {
      current: currentSalary,
      next_year: currentSalary * (1 + growth * 0.1),
      three_years: currentSalary * (1 + growth * 0.3)
    };
  } catch (error) {
    console.error("Error predicting salary progression:", error);
    return { current: 80000, next_year: 88000, three_years: 104000 };
  }
}

function predictSkillEvolution(careerPath, patterns) {
  try {
    return {
      emerging_skills: patterns.skillEvolution?.emergingSkills || [],
      declining_skills: [],
      stable_skills: careerPath[careerPath.length - 1]?.skills || []
    };
  } catch (error) {
    console.error("Error predicting skill evolution:", error);
    return { emerging_skills: [], declining_skills: [], stable_skills: [] };
  }
}

function identifyCareerStrengths(patterns) {
  try {
    const strengths = [];
    
    if (patterns.progression?.progressionRate > 0.5) {
      strengths.push('strong career progression');
    }
    
    if (patterns.progression?.stability > 0.7) {
      strengths.push('career stability');
    }
    
    if (patterns.skillEvolution?.totalSkills > 10) {
      strengths.push('diverse skill set');
    }
    
    return strengths;
  } catch (error) {
    console.error("Error identifying career strengths:", error);
    return [];
  }
}

function identifyImprovementAreas(patterns) {
  try {
    const areas = [];
    
    if (patterns.progression?.progressionRate < 0.3) {
      areas.push('career progression');
    }
    
    if (patterns.skillEvolution?.totalSkills < 5) {
      areas.push('skill development');
    }
    
    if (patterns.companyMovement?.loyalty < 0.5) {
      areas.push('job stability');
    }
    
    return areas;
  } catch (error) {
    console.error("Error identifying improvement areas:", error);
    return [];
  }
}

function identifyCareerOpportunities(patterns) {
  try {
    const opportunities = [];
    
    if (patterns.industryMovement?.specialization > 0.7) {
      opportunities.push('domain expert roles');
    }
    
    if (patterns.levelProgression?.trajectory === 'rapid') {
      opportunities.push('fast-track advancement');
    }
    
    return opportunities;
  } catch (error) {
    console.error("Error identifying career opportunities:", error);
    return [];
  }
}

function identifyCareerRisks(patterns) {
  try {
    const risks = [];
    
    if (patterns.progression?.stability < 0.3) {
      risks.push('career instability');
    }
    
    if (patterns.companyMovement?.frequency > 2) {
      risks.push('job hopping');
    }
    
    return risks;
  } catch (error) {
    console.error("Error identifying career risks:", error);
    return [];
  }
}

function generateCareerRecommendations(patterns) {
  try {
    const recommendations = [];
    
    const improvementAreas = identifyImprovementAreas(patterns);
    
    improvementAreas.forEach(area => {
      if (area === 'career progression') {
        recommendations.push('Seek leadership opportunities');
      }
      if (area === 'skill development') {
        recommendations.push('Invest in continuous learning');
      }
      if (area === 'job stability') {
        recommendations.push('Focus on long-term roles');
      }
    });
    
    return recommendations;
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    return [];
  }
}

function assessDataQuality(transitions) {
  try {
    if (transitions.length === 0) return 0;
    
    const avgProbability = transitions.reduce((sum, t) => sum + t.probability, 0) / transitions.length;
    const diversity = new Set(transitions.map(t => t.to)).size;
    
    return (avgProbability + (diversity / transitions.length)) / 2;
  } catch (error) {
    console.error("Error assessing data quality:", error);
    return 0.5;
  }
}
