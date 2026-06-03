import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

export async function analyzeCareerIntelligence(candidate, enrichmentData = {}) {
  try {
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    let intelligence;
    
    if (aiAvailable) {
      intelligence = await analyzeWithAI(candidate, enrichmentData);
    } else {
      intelligence = await analyzeWithRules(candidate, enrichmentData);
    }

    return intelligence;
  } catch (error) {
    console.error("Error in analyzeCareerIntelligence:", error);
    return getDefaultCareerIntelligence();
  }
}

async function analyzeWithAI(candidate, enrichmentData) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const prompt = buildCareerIntelligencePrompt(candidate, enrichmentData);

    const response = await axios.default.post(
      `${AI_BASE_URL}/analyze/career`,
      {
        prompt,
        candidate: {
          fullName: candidate.fullName,
          headline: candidate.headline,
          bio: candidate.bio,
          currentCompany: candidate.currentCompany,
          experience: candidate.totalExperience,
          skills: candidate.skills || [],
          githubAnalysis: enrichmentData.githubAnalysis,
          inferredSkills: enrichmentData.inferredSkills || []
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 15000
      }
    );

    return response.data;
  } catch (error) {
    console.warn("AI career intelligence analysis failed, using rules:", error.message);
    return await analyzeWithRules(candidate, enrichmentData);
  }
}

function buildCareerIntelligencePrompt(candidate, enrichmentData) {
  let prompt = `Analyze career trajectory and professional intelligence for this candidate:\n\n`;
  
  prompt += `CANDIDATE PROFILE:\n`;
  prompt += `- Name: ${candidate.fullName}\n`;
  prompt += `- Headline: ${candidate.headline || 'Not specified'}\n`;
  prompt += `- Bio: ${candidate.bio || 'Not specified'}\n`;
  prompt += `- Current Company: ${candidate.currentCompany || 'Not specified'}\n`;
  prompt += `- Experience: ${candidate.totalExperience || 0} years\n`;
  prompt += `- Skills: ${(candidate.skills || []).join(', ')}\n`;
  
  if (enrichmentData.inferredSkills && enrichmentData.inferredSkills.length > 0) {
    prompt += `- Inferred Skills: ${enrichmentData.inferredSkills.join(', ')}\n`;
  }
  
  if (enrichmentData.githubAnalysis && enrichmentData.githubAnalysis.insights) {
    prompt += `\nGITHUB INSIGHTS:\n`;
    prompt += `- Languages: ${(enrichmentData.githubAnalysis.insights.languages || []).map(l => l.name).join(', ')}\n`;
    prompt += `- Project Complexity: ${enrichmentData.githubAnalysis.insights.projectComplexity}\n`;
    prompt += `- Contribution Pattern: ${enrichmentData.githubAnalysis.insights.contributionPattern}\n`;
    prompt += `- Activity Level: ${enrichmentData.githubAnalysis.insights.activityLevel}\n`;
    prompt += `- Leadership Indicators: ${(enrichmentData.githubAnalysis.insights.leadershipIndicators || []).join(', ')}\n`;
  }
  
  prompt += `\nCAREER INTELLIGENCE REQUIREMENTS:\n`;
  prompt += `1. Determine seniority level (entry, junior, mid-level, senior, lead, principal, architect, executive)\n`;
  prompt += `2. Identify domain expertise areas\n`;
  prompt += `3. Assess startup experience\n`;
  prompt += `4. Detect leadership signals\n`;
  prompt += `5. Analyze career growth trajectory\n`;
  prompt += `6. Estimate compensation range\n`;
  prompt += `7. Identify career progression patterns\n`;
  prompt += `8. Assess industry fit\n`;
  
  return prompt;
}

async function analyzeWithRules(candidate, enrichmentData) {
  const intelligence = {
    seniorityLevel: inferSeniorityLevel(candidate, enrichmentData),
    domainExpertise: inferDomainExpertise(candidate, enrichmentData),
    startupExperience: assessStartupExperience(candidate, enrichmentData),
    leadershipSignals: detectLeadershipSignals(candidate, enrichmentData),
    careerTrajectory: analyzeCareerTrajectory(candidate, enrichmentData),
    compensationRange: estimateCompensationRange(candidate, enrichmentData),
    careerProgression: assessCareerProgression(candidate, enrichmentData),
    industryFit: assessIndustryFit(candidate, enrichmentData)
  };

  return intelligence;
}

function inferSeniorityLevel(candidate, enrichmentData) {
  const experience = candidate.totalExperience || 0;
  const headline = (candidate.headline || '').toLowerCase();
  const bio = (candidate.bio || '').toLowerCase();
  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];

  const seniorityKeywords = {
    entry: ['entry level', 'junior', 'intern', 'trainee', 'graduate', 'fresher'],
    junior: ['junior', 'associate', 'assistant', 'beginner', '1-2 years'],
    mid: ['mid level', 'middle', 'intermediate', '3-5 years', 'experienced'],
    senior: ['senior', 'sr', 'lead', 'principal', '5-8 years', 'experienced senior'],
    lead: ['lead', 'team lead', 'tech lead', '8-12 years', 'senior lead'],
    principal: ['principal', 'staff', 'distinguished', '10-15 years', 'expert'],
    architect: ['architect', 'solution architect', 'technical architect', '12+ years'],
    executive: ['cto', 'vp', 'director', 'head', 'manager', '15+ years']
  };

  let seniorityScore = 0;
  let detectedLevels = [];

  Object.entries(seniorityKeywords).forEach(([level, keywords]) => {
    const text = `${headline} ${bio}`;
    const matches = keywords.filter(keyword => text.includes(keyword));
    
    if (matches.length > 0) {
      detectedLevels.push({ level, score: matches.length * 2 });
    }
  });

  if (experience >= 15) {
    seniorityScore += 8;
    detectedLevels.push({ level: 'executive', score: 8 });
  } else if (experience >= 12) {
    seniorityScore += 7;
    detectedLevels.push({ level: 'architect', score: 7 });
  } else if (experience >= 10) {
    seniorityScore += 6;
    detectedLevels.push({ level: 'principal', score: 6 });
  } else if (experience >= 8) {
    seniorityScore += 5;
    detectedLevels.push({ level: 'lead', score: 5 });
  } else if (experience >= 5) {
    seniorityScore += 4;
    detectedLevels.push({ level: 'senior', score: 4 });
  } else if (experience >= 3) {
    seniorityScore += 3;
    detectedLevels.push({ level: 'mid', score: 3 });
  } else if (experience >= 2) {
    seniorityScore += 2;
    detectedLevels.push({ level: 'junior', score: 2 });
  } else {
    seniorityScore += 1;
    detectedLevels.push({ level: 'entry', score: 1 });
  }

  const allSkills = [...skills, ...inferredSkills];
  const leadershipSkills = allSkills.filter(skill => 
    ['leadership', 'management', 'mentoring', 'team lead', 'architecture', 'strategy'].includes(skill.toLowerCase())
  );
  
  if (leadershipSkills.length > 0) {
    seniorityScore += 2;
  }

  const topLevel = detectedLevels
    .sort((a, b) => b.score - a.score)
    .map(item => item.level)[0];

  return topLevel || 'mid';
}

function inferDomainExpertise(candidate, enrichmentData) {
  const domains = new Set();
  
  const bio = (candidate.bio || '').toLowerCase();
  const headline = (candidate.headline || '').toLowerCase();
  const company = (candidate.currentCompany || '').toLowerCase();
  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];

  const domainKeywords = {
    'web-development': ['web', 'frontend', 'backend', 'full-stack', 'html', 'css', 'javascript', 'react', 'vue', 'angular'],
    'mobile-development': ['mobile', 'ios', 'android', 'react-native', 'flutter', 'swift', 'kotlin'],
    'data-science': ['data science', 'analytics', 'machine learning', 'ai', 'tensorflow', 'pytorch', 'pandas', 'numpy'],
    'cloud-computing': ['cloud', 'aws', 'azure', 'gcp', 'serverless', 'microservices', 'devops'],
    'cybersecurity': ['security', 'cybersecurity', 'penetration testing', 'ethical hacking', 'network security'],
    'blockchain': ['blockchain', 'cryptocurrency', 'smart contracts', 'web3', 'defi', 'nft'],
    'gaming': ['gaming', 'game development', 'unity', 'unreal engine', 'graphics', 'animation'],
    'fintech': ['fintech', 'financial', 'banking', 'payment', 'trading', 'blockchain'],
    'healthcare': ['healthcare', 'medical', 'health tech', 'hipaa', 'emr', 'telemedicine'],
    'ecommerce': ['ecommerce', 'e-commerce', 'retail', 'shopping', 'cart', 'payment'],
    'education': ['education', 'edtech', 'learning', 'training', 'curriculum', 'lms'],
    'iot': ['iot', 'internet of things', 'embedded', 'arduino', 'raspberry pi', 'sensors'],
    'automotive': ['automotive', 'cars', 'vehicles', 'autonomous', 'connected cars', 'infotainment'],
    'media': ['media', 'streaming', 'video', 'audio', 'content', 'broadcasting'],
    'consulting': ['consulting', 'advisory', 'strategy', 'transformation', 'optimization']
  };

  const allText = `${bio} ${headline} ${company}`;
  const allSkills = [...skills, ...inferredSkills];

  Object.entries(domainKeywords).forEach(([domain, keywords]) => {
    const textMatches = keywords.filter(keyword => allText.includes(keyword));
    const skillMatches = allSkills.filter(skill => 
      keywords.some(keyword => skill.toLowerCase().includes(keyword))
    );
    
    if (textMatches.length > 0 || skillMatches.length > 0) {
      domains.add(domain);
    }
  });

  if (enrichmentData.githubAnalysis && enrichmentData.githubAnalysis.insights) {
    const githubDomains = enrichmentData.githubAnalysis.insights.expertiseAreas || [];
    githubDomains.forEach(domain => domains.add(domain));
  }

  return Array.from(domains);
}

function assessStartupExperience(candidate, enrichmentData) {
  const company = candidate.currentCompany || '';
  const bio = (candidate.bio || '').toLowerCase();
  const headline = (candidate.headline || '').toLowerCase();
  const experience = candidate.totalExperience || 0;

  const startupIndicators = {
    companySize: ['startup', 'early stage', 'seed', 'series a', 'series b', 'venture', 'bootstrap'],
    roleType: ['founder', 'co-founder', 'early employee', 'first hire', 'team member'],
    skills: ['entrepreneurship', 'startup', 'building from scratch', 'mvp', 'product development'],
    environment: ['fast-paced', 'agile', 'lean', 'iterative', 'rapid growth']
  };

  let startupScore = 0;
  const detectedIndicators = [];

  const allText = `${company} ${bio} ${headline}`;

  Object.entries(startupIndicators).forEach(([category, indicators]) => {
    const matches = indicators.filter(indicator => allText.includes(indicator));
    if (matches.length > 0) {
      startupScore += matches.length;
      detectedIndicators.push(...matches.map(match => ({ category, indicator: match })));
    }
  });

  if (enrichmentData.githubAnalysis && enrichmentData.githubAnalysis.insights) {
    const githubInsights = enrichmentData.githubAnalysis.insights;
    
    if (githubInsights.projectComplexity === 'high') {
      startupScore += 2;
      detectedIndicators.push({ category: 'github', indicator: 'complex-projects' });
    }
    
    if (githubInsights.innovationScore > 50) {
      startupScore += 2;
      detectedIndicators.push({ category: 'github', indicator: 'innovative' });
    }
    
    if (githubInsights.leadershipIndicators.includes('open-source-leadership')) {
      startupScore += 1;
      detectedIndicators.push({ category: 'github', indicator: 'open-source-leader' });
    }
  }

  const startupLevel = startupScore >= 5 ? 'high' : 
                      startupScore >= 3 ? 'medium' : 
                      startupScore >= 1 ? 'low' : 'none';

  return {
    level: startupLevel,
    score: startupScore,
    indicators: detectedIndicators,
    confidence: Math.min(startupScore / 8, 1)
  };
}

function detectLeadershipSignals(candidate, enrichmentData) {
  const bio = (candidate.bio || '').toLowerCase();
  const headline = (candidate.headline || '').toLowerCase();
  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];
  const experience = candidate.totalExperience || 0;

  const leadershipSignals = {
    titles: ['lead', 'manager', 'director', 'head', 'vp', 'cto', 'ceo', 'founder', 'principal', 'architect'],
    skills: ['leadership', 'management', 'mentoring', 'team building', 'strategy', 'planning', 'coordination'],
    actions: ['led', 'managed', 'built', 'created', 'founded', 'launched', 'scaled', 'grew'],
    responsibilities: ['responsible for', 'oversaw', 'coordinated', 'directed', 'supervised', 'guided']
  };

  let leadershipScore = 0;
  const detectedSignals = [];

  const allText = `${bio} ${headline}`;
  const allSkills = [...skills, ...inferredSkills];

  Object.entries(leadershipSignals).forEach(([category, indicators]) => {
    if (category === 'titles') {
      const titleMatches = indicators.filter(indicator => allText.includes(indicator));
      if (titleMatches.length > 0) {
        leadershipScore += titleMatches.length * 3;
        detectedSignals.push(...titleMatches.map(title => ({ category, signal: title, strength: 'high' })));
      }
    } else if (category === 'skills') {
      const skillMatches = allSkills.filter(skill => 
        indicators.some(indicator => skill.toLowerCase().includes(indicator))
      );
      if (skillMatches.length > 0) {
        leadershipScore += skillMatches.length * 2;
        detectedSignals.push(...skillMatches.map(skill => ({ category, signal: skill, strength: 'medium' })));
      }
    } else {
      const actionMatches = indicators.filter(indicator => allText.includes(indicator));
      if (actionMatches.length > 0) {
        leadershipScore += actionMatches.length;
        detectedSignals.push(...actionMatches.map(action => ({ category, signal: action, strength: 'low' })));
      }
    }
  });

  if (experience >= 8) {
    leadershipScore += 2;
    detectedSignals.push({ category: 'experience', signal: '8+ years', strength: 'medium' });
  }

  if (enrichmentData.githubAnalysis && enrichmentData.githubAnalysis.insights) {
    const githubLeadership = enrichmentData.githubAnalysis.insights.leadershipIndicators || [];
    githubLeadership.forEach(indicator => {
      leadershipScore += 1;
      detectedSignals.push({ category: 'github', signal: indicator, strength: 'medium' });
    });
  }

  const leadershipLevel = leadershipScore >= 8 ? 'executive' : 
                        leadershipScore >= 5 ? 'senior-leader' : 
                        leadershipScore >= 3 ? 'team-lead' : 
                        leadershipScore >= 1 ? 'potential-leader' : 'individual-contributor';

  return {
    level: leadershipLevel,
    score: leadershipScore,
    signals: detectedSignals,
    confidence: Math.min(leadershipScore / 12, 1)
  };
}

function analyzeCareerTrajectory(candidate, enrichmentData) {
  const experience = candidate.totalExperience || 0;
  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];
  const company = candidate.currentCompany || '';

  const trajectory = {
    growthRate: 'unknown',
    skillProgression: 'unknown',
    careerStability: 'unknown',
    mobilityPattern: 'unknown',
    futurePotential: 'unknown'
  };

  if (experience >= 10) {
    trajectory.growthRate = 'established';
    trajectory.careerStability = 'stable';
  } else if (experience >= 5) {
    trajectory.growthRate = 'growing';
    trajectory.careerStability = 'moderate';
  } else if (experience >= 2) {
    trajectory.growthRate = 'developing';
    trajectory.careerStability = 'building';
  } else {
    trajectory.growthRate = 'entry';
    trajectory.careerStability = 'early';
  }

  const allSkills = [...skills, ...inferredSkills];
  const advancedSkills = allSkills.filter(skill => 
    ['architecture', 'design patterns', 'scalability', 'microservices', 'cloud architecture', 'devops'].includes(skill.toLowerCase())
  );
  
  if (advancedSkills.length >= 3) {
    trajectory.skillProgression = 'advanced';
  } else if (advancedSkills.length >= 1) {
    trajectory.skillProgression = 'intermediate';
  } else {
    trajectory.skillProgression = 'foundational';
  }

  const bio = (candidate.bio || '').toLowerCase();
  const mobilityKeywords = ['moved', 'transitioned', 'switched', 'relocated', 'promoted'];
  const mobilityMatches = mobilityKeywords.filter(keyword => bio.includes(keyword));
  
  if (mobilityMatches.length >= 2) {
    trajectory.mobilityPattern = 'dynamic';
  } else if (mobilityMatches.length >= 1) {
    trajectory.mobilityPattern = 'moderate';
  } else {
    trajectory.mobilityPattern = 'stable';
  }

  const potentialScore = (allSkills.length * 0.3) + (advancedSkills.length * 0.5) + (experience * 0.2);
  
  if (potentialScore >= 8) {
    trajectory.futurePotential = 'high';
  } else if (potentialScore >= 5) {
    trajectory.futurePotential = 'medium';
  } else {
    trajectory.futurePotential = 'moderate';
  }

  return trajectory;
}

function estimateCompensationRange(candidate, enrichmentData) {
  const experience = candidate.totalExperience || 0;
  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];
  const seniority = inferSeniorityLevel(candidate, enrichmentData);
  const startupExp = assessStartupExperience(candidate, enrichmentData);

  const allSkills = [...skills, ...inferredSkills];
  
  const highValueSkills = allSkills.filter(skill => 
    ['machine learning', 'artificial intelligence', 'blockchain', 'cloud architecture', 'devops', 'cybersecurity'].includes(skill.toLowerCase())
  );

  const baseSalary = getBaseSalaryByExperience(experience);
  const seniorityMultiplier = getSeniorityMultiplier(seniority);
  const skillsMultiplier = getSkillsMultiplier(allSkills, highValueSkills);
  const startupMultiplier = startupExp.level === 'high' ? 1.2 : startupExp.level === 'medium' ? 1.1 : 1.0;

  const estimatedSalary = baseSalary * seniorityMultiplier * skillsMultiplier * startupMultiplier;

  return {
    estimatedMin: Math.round(estimatedSalary * 0.8),
    estimatedMax: Math.round(estimatedSalary * 1.3),
    estimatedMid: Math.round(estimatedSalary),
    currency: 'USD',
    factors: {
      experience,
      seniority,
      skillsCount: allSkills.length,
      highValueSkillsCount: highValueSkills.length,
      startupLevel: startupExp.level
    }
  };
}

function getBaseSalaryByExperience(experience) {
  if (experience >= 15) return 180000;
  if (experience >= 12) return 160000;
  if (experience >= 10) return 140000;
  if (experience >= 8) return 120000;
  if (experience >= 5) return 100000;
  if (experience >= 3) return 80000;
  if (experience >= 2) return 65000;
  return 50000;
}

function getSeniorityMultiplier(seniority) {
  const multipliers = {
    'entry': 0.8,
    'junior': 1.0,
    'mid': 1.2,
    'senior': 1.5,
    'lead': 1.8,
    'principal': 2.0,
    'architect': 2.2,
    'executive': 2.5
  };
  
  return multipliers[seniority] || 1.0;
}

function getSkillsMultiplier(skills, highValueSkills) {
  const baseMultiplier = 1.0;
  const skillsBonus = Math.min(skills.length * 0.02, 0.3);
  const highValueBonus = Math.min(highValueSkills.length * 0.15, 0.5);
  
  return baseMultiplier + skillsBonus + highValueBonus;
}

function assessCareerProgression(candidate, enrichmentData) {
  const experience = candidate.totalExperience || 0;
  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];
  const leadership = detectLeadershipSignals(candidate, enrichmentData);

  const progression = {
    currentStage: 'unknown',
    nextMilestone: 'unknown',
    timeToNextLevel: 'unknown',
    progressionSpeed: 'unknown',
    careerPath: 'unknown'
  };

  if (experience < 2) {
    progression.currentStage = 'early-career';
    progression.nextMilestone = 'junior-developer';
    progression.timeToNextLevel = '1-2 years';
    progression.progressionSpeed = 'fast';
  } else if (experience < 5) {
    progression.currentStage = 'junior-developer';
    progression.nextMilestone = 'mid-level-developer';
    progression.timeToNextLevel = '2-3 years';
    progression.progressionSpeed = 'moderate';
  } else if (experience < 8) {
    progression.currentStage = 'mid-level-developer';
    progression.nextMilestone = 'senior-developer';
    progression.timeToNextLevel = '2-4 years';
    progression.progressionSpeed = 'steady';
  } else if (experience < 12) {
    progression.currentStage = 'senior-developer';
    progression.nextMilestone = leadership.level === 'team-lead' ? 'tech-lead' : 'senior-specialist';
    progression.timeToNextLevel = '3-5 years';
    progression.progressionSpeed = 'moderate';
  } else {
    progression.currentStage = leadership.level === 'executive' ? 'executive' : 'senior-specialist';
    progression.nextMilestone = leadership.level === 'executive' ? 'c-level' : 'principal-architect';
    progression.timeToNextLevel = '4-6 years';
    progression.progressionSpeed = 'strategic';
  }

  const allSkills = [...skills, ...inferredSkills];
  const technicalDepth = allSkills.length;
  const leadershipStrength = leadership.score;

  if (technicalDepth >= 10 && leadershipStrength >= 5) {
    progression.careerPath = 'technical-leadership';
  } else if (technicalDepth >= 10) {
    progression.careerPath = 'technical-specialist';
  } else if (leadershipStrength >= 5) {
    progression.careerPath = 'management-track';
  } else {
    progression.careerPath = 'generalist-track';
  }

  return progression;
}

function assessIndustryFit(candidate, enrichmentData) {
  const bio = (candidate.bio || '').toLowerCase();
  const headline = (candidate.headline || '').toLowerCase();
  const company = (candidate.currentCompany || '').toLowerCase();
  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];

  const industryFit = {
    primaryIndustry: 'unknown',
    secondaryIndustries: [],
    fitScore: 0,
    transferableSkills: [],
    industryTrends: 'unknown'
  };

  const industryKeywords = {
    'technology': ['software', 'technology', 'tech', 'it', 'digital', 'web', 'mobile', 'cloud', 'data'],
    'finance': ['finance', 'banking', 'fintech', 'financial', 'payments', 'trading', 'investment'],
    'healthcare': ['healthcare', 'medical', 'health', 'pharmaceutical', 'biotech', 'medical devices'],
    'retail': ['retail', 'ecommerce', 'shopping', 'consumer', 'b2c', 'e-commerce'],
    'manufacturing': ['manufacturing', 'industrial', 'factory', 'production', 'supply chain'],
    'consulting': ['consulting', 'advisory', 'consultant', 'strategy', 'transformation'],
    'education': ['education', 'learning', 'training', 'academic', 'university', 'research'],
    'media': ['media', 'entertainment', 'publishing', 'broadcasting', 'content', 'streaming'],
    'automotive': ['automotive', 'cars', 'vehicles', 'transportation', 'mobility'],
    'government': ['government', 'public sector', 'federal', 'state', 'municipal', 'defense']
  };

  const allText = `${bio} ${headline} ${company}`;
  const allSkills = [...skills, ...inferredSkills];

  const industryScores = {};
  
  Object.entries(industryKeywords).forEach(([industry, keywords]) => {
    const textMatches = keywords.filter(keyword => allText.includes(keyword));
    const skillMatches = allSkills.filter(skill => 
      keywords.some(keyword => skill.toLowerCase().includes(keyword))
    );
    
    industryScores[industry] = textMatches.length + (skillMatches.length * 0.5);
  });

  const sortedIndustries = Object.entries(industryScores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0);

  if (sortedIndustries.length > 0) {
    industryFit.primaryIndustry = sortedIndustries[0][0];
    industryFit.secondaryIndustries = sortedIndustries.slice(1, 3).map(([industry]) => industry);
    industryFit.fitScore = Math.min(sortedIndustries[0][1] / 5, 1);
  }

  industryFit.transferableSkills = identifyTransferableSkills(allSkills, industryFit.primaryIndustry);
  industryFit.industryTrends = assessIndustryTrends(industryFit.primaryIndustry, allSkills);

  return industryFit;
}

function identifyTransferableSkills(skills, primaryIndustry) {
  const transferableSkills = ['communication', 'leadership', 'project management', 'problem solving', 'analytical thinking'];
  
  return skills.filter(skill => 
    transferableSkills.some(transferable => 
      skill.toLowerCase().includes(transferable)
    )
  );
}

function assessIndustryTrends(industry, skills) {
  const industryTrends = {
    'technology': 'ai-ml-cloud-devops',
    'finance': 'fintech-blockchain-digital',
    'healthcare': 'telemedicine-ai-digital-health',
    'retail': 'ecommerce-digital-payments',
    'manufacturing': 'iot-automation-industry40',
    'consulting': 'digital-transformation-cloud',
    'education': 'online-learning-edtech',
    'media': 'streaming-digital-content',
    'automotive': 'electric-autonomous-connected'
  };

  return industryTrends[industry] || 'unknown';
}

function getDefaultCareerIntelligence() {
  return {
    seniorityLevel: 'unknown',
    domainExpertise: [],
    startupExperience: { level: 'none', score: 0, indicators: [], confidence: 0 },
    leadershipSignals: { level: 'individual-contributor', score: 0, signals: [], confidence: 0 },
    careerTrajectory: {
      growthRate: 'unknown',
      skillProgression: 'unknown',
      careerStability: 'unknown',
      mobilityPattern: 'unknown',
      futurePotential: 'unknown'
    },
    compensationRange: {
      estimatedMin: 0,
      estimatedMax: 0,
      estimatedMid: 0,
      currency: 'USD',
      factors: {}
    },
    careerProgression: {
      currentStage: 'unknown',
      nextMilestone: 'unknown',
      timeToNextLevel: 'unknown',
      progressionSpeed: 'unknown',
      careerPath: 'unknown'
    },
    industryFit: {
      primaryIndustry: 'unknown',
      secondaryIndustries: [],
      fitScore: 0,
      transferableSkills: [],
      industryTrends: 'unknown'
    }
  };
}
