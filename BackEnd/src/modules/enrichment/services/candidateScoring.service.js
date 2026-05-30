import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";
import { embedText } from "../../../../sourcing/ai/aiServiceClient.js";

export async function scoreCandidate(candidate, enrichmentData = {}) {
  try {
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    let scores;
    
    if (aiAvailable) {
      scores = await scoreWithAI(candidate, enrichmentData);
    } else {
      scores = await scoreWithRules(candidate, enrichmentData);
    }

    const overallScore = calculateOverallScore(scores);

    return {
      technicalScore: scores.technicalScore,
      experienceScore: scores.experienceScore,
      leadershipScore: scores.leadershipScore,
      semanticQualityScore: scores.semanticQualityScore,
      sourcingRecommendationScore: overallScore,
      componentScores: scores,
      scoringMetadata: {
        aiUsed: aiAvailable,
        scoredAt: new Date(),
        version: '1.0'
      }
    };
  } catch (error) {
    console.error("Error in scoreCandidate:", error);
    return getDefaultScores();
  }
}

async function scoreWithAI(candidate, enrichmentData) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const prompt = buildScoringPrompt(candidate, enrichmentData);

    const response = await axios.default.post(
      `${AI_BASE_URL}/score/candidate`,
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
          inferredSkills: enrichmentData.inferredSkills || [],
          careerIntelligence: enrichmentData.careerIntelligence
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

    return response.data.scores || getDefaultScores();
  } catch (error) {
    console.warn("AI scoring failed, using rules:", error.message);
    return await scoreWithRules(candidate, enrichmentData);
  }
}

function buildScoringPrompt(candidate, enrichmentData) {
  let prompt = `Score this candidate across multiple dimensions (0-100 scale):\n\n`;
  
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
    prompt += `- Code Quality: ${enrichmentData.githubAnalysis.insights.codeQuality}\n`;
    prompt += `- Innovation Score: ${enrichmentData.githubAnalysis.insights.innovationScore}\n`;
    prompt += `- Activity Level: ${enrichmentData.githubAnalysis.insights.activityLevel}\n`;
  }
  
  if (enrichmentData.careerIntelligence) {
    prompt += `\nCAREER INTELLIGENCE:\n`;
    prompt += `- Seniority Level: ${enrichmentData.careerIntelligence.seniorityLevel}\n`;
    prompt += `- Domain Expertise: ${(enrichmentData.careerIntelligence.domainExpertise || []).join(', ')}\n`;
    prompt += `- Startup Experience: ${enrichmentData.careerIntelligence.startupExperience?.level || 'unknown'}\n`;
    prompt += `- Leadership Level: ${enrichmentData.careerIntelligence.leadershipSignals?.level || 'unknown'}\n`;
  }
  
  prompt += `\nSCORING CRITERIA:\n`;
  prompt += `1. Technical Score (0-100): Programming skills, technologies, tools, technical depth\n`;
  prompt += `2. Experience Score (0-100): Years of experience, relevance, progression, diversity\n`;
  prompt += `3. Leadership Score (0-100): Management, mentoring, influence, initiative\n`;
  prompt += `4. Semantic Quality Score (0-100): Communication skills, profile completeness, professional presentation\n`;
  prompt += `5. Consider GitHub insights, career intelligence, and inferred skills\n`;
  prompt += `6. Provide reasoning for each score\n`;
  prompt += `7. Return JSON format with all scores and explanations\n`;
  
  return prompt;
}

async function scoreWithRules(candidate, enrichmentData) {
  const technicalScore = calculateTechnicalScore(candidate, enrichmentData);
  const experienceScore = calculateExperienceScore(candidate, enrichmentData);
  const leadershipScore = calculateLeadershipScore(candidate, enrichmentData);
  const semanticQualityScore = calculateSemanticQualityScore(candidate, enrichmentData);

  return {
    technicalScore,
    experienceScore,
    leadershipScore,
    semanticQualityScore
  };
}

function calculateTechnicalScore(candidate, enrichmentData) {
  let score = 0;
  const maxScore = 100;

  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];
  const allSkills = [...skills, ...inferredSkills];

  if (allSkills.length === 0) return 0;

  score += Math.min(allSkills.length * 3, 30);

  const modernTechSkills = allSkills.filter(skill => 
    ['react', 'vue', 'angular', 'node', 'python', 'typescript', 'go', 'rust', 'kubernetes', 'docker', 'aws', 'azure'].includes(skill.toLowerCase())
  );
  score += Math.min(modernTechSkills.length * 5, 25);

  const specializedSkills = allSkills.filter(skill => 
    ['machine learning', 'artificial intelligence', 'blockchain', 'cybersecurity', 'devops', 'cloud architecture'].includes(skill.toLowerCase())
  );
  score += Math.min(specializedSkills.length * 8, 20);

  if (enrichmentData.githubAnalysis && enrichmentData.githubAnalysis.insights) {
    const githubInsights = enrichmentData.githubAnalysis.insights;
    
    if (githubInsights.languages && githubInsights.languages.length > 0) {
      score += Math.min(githubInsights.languages.length * 2, 15);
    }

    if (githubInsights.projectComplexity === 'high') {
      score += 10;
    } else if (githubInsights.projectComplexity === 'medium') {
      score += 5;
    }

    if (githubInsights.codeQuality === 'excellent') {
      score += 8;
    } else if (githubInsights.codeQuality === 'good') {
      score += 5;
    }

    if (githubInsights.innovationScore > 50) {
      score += 7;
    }
  }

  return Math.min(score, maxScore);
}

function calculateExperienceScore(candidate, enrichmentData) {
  let score = 0;
  const maxScore = 100;

  const experience = candidate.totalExperience || 0;
  
  if (experience >= 15) {
    score += 40;
  } else if (experience >= 10) {
    score += 35;
  } else if (experience >= 8) {
    score += 30;
  } else if (experience >= 5) {
    score += 25;
  } else if (experience >= 3) {
    score += 20;
  } else if (experience >= 2) {
    score += 15;
  } else {
    score += 10;
  }

  const bio = (candidate.bio || '').toLowerCase();
  const headline = (candidate.headline || '').toLowerCase();
  const progressionIndicators = ['promoted', 'lead', 'senior', 'principal', 'architect', 'manager', 'director'];
  
  const progressionMatches = progressionIndicators.filter(indicator => 
    bio.includes(indicator) || headline.includes(indicator)
  );
  score += Math.min(progressionMatches.length * 5, 20);

  if (enrichmentData.careerIntelligence) {
    const careerIntel = enrichmentData.careerIntelligence;
    
    if (careerIntel.careerTrajectory) {
      if (careerIntel.careerTrajectory.growthRate === 'established') {
        score += 15;
      } else if (careerIntel.careerTrajectory.growthRate === 'growing') {
        score += 10;
      } else if (careerIntel.careerTrajectory.growthRate === 'developing') {
        score += 5;
      }
    }

    if (careerIntel.careerProgression) {
      if (careerIntel.careerProgression.progressionSpeed === 'fast') {
        score += 10;
      } else if (careerIntel.careerProgression.progressionSpeed === 'steady') {
        score += 7;
      } else if (careerIntel.careerProgression.progressionSpeed === 'moderate') {
        score += 5;
      }
    }
  }

  const currentCompany = candidate.currentCompany || '';
  const knownCompanies = ['google', 'microsoft', 'amazon', 'facebook', 'apple', 'netflix', 'uber', 'airbnb'];
  
  if (knownCompanies.some(company => currentCompany.toLowerCase().includes(company))) {
    score += 10;
  }

  return Math.min(score, maxScore);
}

function calculateLeadershipScore(candidate, enrichmentData) {
  let score = 0;
  const maxScore = 100;

  const bio = (candidate.bio || '').toLowerCase();
  const headline = (candidate.headline || '').toLowerCase();
  const skills = candidate.skills || [];
  const inferredSkills = enrichmentData.inferredSkills || [];

  const leadershipKeywords = [
    'lead', 'led', 'leadership', 'manager', 'management', 'team', 'mentor', 'mentoring',
    'supervisor', 'director', 'head', 'principal', 'architect', 'founder', 'co-founder',
    'coordinated', 'oversaw', 'guided', 'trained', 'coached', 'advised'
  ];

  const leadershipMatches = leadershipKeywords.filter(keyword => 
    bio.includes(keyword) || headline.includes(keyword)
  );
  score += Math.min(leadershipMatches.length * 8, 30);

  const leadershipSkills = [...skills, ...inferredSkills].filter(skill => 
    ['leadership', 'management', 'mentoring', 'team building', 'project management', 'strategy'].includes(skill.toLowerCase())
  );
  score += Math.min(leadershipSkills.length * 10, 25);

  if (enrichmentData.careerIntelligence && enrichmentData.careerIntelligence.leadershipSignals) {
    const leadershipSignals = enrichmentData.careerIntelligence.leadershipSignals;
    
    if (leadershipSignals.level === 'executive') {
      score += 35;
    } else if (leadershipSignals.level === 'senior-leader') {
      score += 30;
    } else if (leadershipSignals.level === 'team-lead') {
      score += 25;
    } else if (leadershipSignals.level === 'potential-leader') {
      score += 15;
    }

    score += Math.min(leadershipSignals.confidence * 20, 10);
  }

  if (enrichmentData.githubAnalysis && enrichmentData.githubAnalysis.insights) {
    const githubLeadership = enrichmentData.githubAnalysis.insights.leadershipIndicators || [];
    score += Math.min(githubLeadership.length * 5, 10);
  }

  const experience = candidate.totalExperience || 0;
  if (experience >= 10) {
    score += 15;
  } else if (experience >= 7) {
    score += 10;
  } else if (experience >= 5) {
    score += 5;
  }

  return Math.min(score, maxScore);
}

function calculateSemanticQualityScore(candidate, enrichmentData) {
  let score = 0;
  const maxScore = 100;

  const bio = candidate.bio || '';
  const headline = candidate.headline || '';
  const skills = candidate.skills || [];

  if (bio && bio.length > 0) {
    score += Math.min(bio.length / 10, 20);
  } else {
    score += 0;
  }

  if (headline && headline.length > 0) {
    score += Math.min(headline.length / 5, 15);
  } else {
    score += 0;
  }

  if (skills && skills.length > 0) {
    score += Math.min(skills.length * 3, 20);
  } else {
    score += 0;
  }

  const email = candidate.email;
  const phone = candidate.phone;
  const location = candidate.location;
  const currentCompany = candidate.currentCompany;

  let contactInfoScore = 0;
  if (email && email.includes('@')) contactInfoScore += 10;
  if (phone && phone.length > 5) contactInfoScore += 10;
  if (location && location.length > 2) contactInfoScore += 5;
  if (currentCompany && currentCompany.length > 2) contactInfoScore += 5;

  score += Math.min(contactInfoScore, 25);

  const profileText = `${bio} ${headline}`.toLowerCase();
  const professionalIndicators = [
    'professional', 'experienced', 'skilled', 'expert', 'specialist', 'engineer',
    'developer', 'architect', 'analyst', 'consultant', 'manager', 'director'
  ];

  const professionalMatches = professionalIndicators.filter(indicator => 
    profileText.includes(indicator)
  );
  score += Math.min(professionalMatches.length * 3, 10);

  const inferredSkills = enrichmentData.inferredSkills || [];
  if (inferredSkills.length > 0) {
    score += Math.min(inferredSkills.length * 2, 10);
  }

  return Math.min(score, maxScore);
}

function calculateOverallScore(scores) {
  const weights = {
    technical: 0.35,
    experience: 0.25,
    leadership: 0.20,
    semantic: 0.20
  };

  const overallScore = 
    (scores.technicalScore * weights.technical) +
    (scores.experienceScore * weights.experience) +
    (scores.leadershipScore * weights.leadership) +
    (scores.semanticQualityScore * weights.semantic);

  return Math.round(Math.min(overallScore, 100));
}

async function calculateSemanticSimilarityScore(candidate, enrichmentData) {
  try {
    const bio = candidate.bio || '';
    const headline = candidate.headline || '';
    const skills = (candidate.skills || []).join(' ');
    const inferredSkills = (enrichmentData.inferredSkills || []).join(' ');

    const fullText = `${bio} ${headline} ${skills} ${inferredSkills}`;
    
    if (fullText.length < 50) return 0;

    const embedding = await embedText(fullText);
    
    if (!embedding || embedding.length === 0) return 0;

    const semanticScore = Math.round(Math.abs(embedding.reduce((sum, val) => sum + Math.abs(val), 0)) / embedding.length * 100);
    
    return Math.min(semanticScore, 100);
  } catch (error) {
    console.warn("Semantic similarity calculation failed:", error.message);
    return 0;
  }
}

function getDefaultScores() {
  return {
    technicalScore: 0,
    experienceScore: 0,
    leadershipScore: 0,
    semanticQualityScore: 0
  };
}
