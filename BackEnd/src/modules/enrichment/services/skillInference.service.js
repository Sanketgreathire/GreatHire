import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";
import { embedText } from "../../../../sourcing/ai/aiServiceClient.js";

export async function inferCandidateSkills(candidate, githubAnalysis = null) {
  try {
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    let inferredSkills = [];
    
    if (aiAvailable) {
      inferredSkills = await inferSkillsWithAI(candidate, githubAnalysis);
    } else {
      inferredSkills = await inferSkillsWithRules(candidate, githubAnalysis);
    }

    const uniqueSkills = [...new Set(inferredSkills)];
    const prioritizedSkills = prioritizeSkills(uniqueSkills, candidate);

    return prioritizedSkills;
  } catch (error) {
    console.error("Error in inferCandidateSkills:", error);
    return [];
  }
}

async function inferSkillsWithAI(candidate, githubAnalysis) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";

    const prompt = buildSkillInferencePrompt(candidate, githubAnalysis);

    const response = await axios.default.post(
      `${AI_BASE_URL}/infer/skills`,
      {
        prompt,
        candidate: {
          fullName: candidate.fullName,
          headline: candidate.headline,
          bio: candidate.bio,
          currentCompany: candidate.currentCompany,
          experience: candidate.totalExperience,
          existingSkills: candidate.skills || [],
          githubAnalysis: githubAnalysis
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

    return response.data.inferredSkills || [];
  } catch (error) {
    console.warn("AI skill inference failed, using rules:", error.message);
    return await inferSkillsWithRules(candidate, githubAnalysis);
  }
}

function buildSkillInferencePrompt(candidate, githubAnalysis) {
  let prompt = `Infer hidden and implied skills from this candidate profile:\n\n`;
  
  prompt += `CANDIDATE PROFILE:\n`;
  prompt += `- Name: ${candidate.fullName}\n`;
  prompt += `- Headline: ${candidate.headline || 'Not specified'}\n`;
  prompt += `- Bio: ${candidate.bio || 'Not specified'}\n`;
  prompt += `- Current Company: ${candidate.currentCompany || 'Not specified'}\n`;
  prompt += `- Experience: ${candidate.totalExperience || 0} years\n`;
  prompt += `- Existing Skills: ${(candidate.skills || []).join(', ')}\n`;
  
  if (githubAnalysis) {
    prompt += `\nGITHUB ANALYSIS:\n`;
    prompt += `- Languages: ${(githubAnalysis.insights?.languages || []).map(l => l.name).join(', ')}\n`;
    prompt += `- Technical Skills: ${(githubAnalysis.insights?.technicalSkills || []).join(', ')}\n`;
    prompt += `- Project Complexity: ${githubAnalysis.insights?.projectComplexity || 'unknown'}\n`;
    prompt += `- Expertise Areas: ${(githubAnalysis.insights?.expertiseAreas || []).join(', ')}\n`;
  }
  
  prompt += `\nSKILL INFERENCE REQUIREMENTS:\n`;
  prompt += `1. Identify technical skills not explicitly listed\n`;
  prompt += `2. Infer skills from job titles and company context\n`;
  prompt += `3. Extract skills from project descriptions and bio\n`;
  prompt += `4. Consider implied skills from experience level\n`;
  prompt += `5. Include soft skills relevant to technical roles\n`;
  prompt += `6. Prioritize modern, in-demand technologies\n`;
  prompt += `7. Consider industry-specific skills\n`;
  prompt += `8. Return skills in order of confidence\n`;
  
  return prompt;
}

async function inferSkillsWithRules(candidate, githubAnalysis) {
  const inferredSkills = new Set();

  const bioSkills = extractSkillsFromText(candidate.bio || '');
  bioSkills.forEach(skill => inferredSkills.add(skill));

  const headlineSkills = extractSkillsFromText(candidate.headline || '');
  headlineSkills.forEach(skill => inferredSkills.add(skill));

  const companySkills = inferSkillsFromCompany(candidate.currentCompany);
  companySkills.forEach(skill => inferredSkills.add(skill));

  if (githubAnalysis && githubAnalysis.insights) {
    const githubSkills = githubAnalysis.insights.technicalSkills || [];
    githubSkills.forEach(skill => inferredSkills.add(skill));

    const languageSkills = (githubAnalysis.insights.languages || []).map(lang => lang.name);
    languageSkills.forEach(skill => inferredSkills.add(skill));

    const expertiseSkills = githubAnalysis.insights.expertiseAreas || [];
    expertiseSkills.forEach(skill => inferredSkills.add(skill));
  }

  const experienceSkills = inferSkillsFromExperience(candidate.totalExperience);
  experienceSkills.forEach(skill => inferredSkills.add(skill));

  const semanticSkills = await inferSkillsFromSemantics(candidate);
  semanticSkills.forEach(skill => inferredSkills.add(skill));

  return Array.from(inferredSkills);
}

function extractSkillsFromText(text) {
  if (!text) return [];

  const skillPatterns = {
    programming: [
      /javascript|js|typescript|ts|react|vue|angular|node\.js|nodejs|express|next\.js/gi,
      /python|django|flask|fastapi|pandas|numpy|tensorflow|pytorch/gi,
      /java|spring|hibernate|maven|gradle/gi,
      /c\+\+|c#|\.net|asp\.net|core/gi,
      /go|golang|rust|swift|kotlin|dart/gi,
      /php|laravel|symfony|codeigniter/gi,
      /ruby|rails|sinatra/gi
    ],
    databases: [
      /mysql|postgresql|postgres|mongodb|redis|cassandra|elasticsearch/gi,
      /oracle|sql server|sqlite|dynamodb|firestore/gi,
      /nosql|newsql|graphdb|neo4j/gi
    ],
    cloud: [
      /aws|azure|gcp|google cloud|heroku|digitalocean/gi,
      /ec2|s3|lambda|ecs|eks|cloudfront|route53/gi,
      /azure functions|app service|blob storage|cosmos db/gi,
      /google functions|cloud run|gke|cloud storage/gi
    ],
    devops: [
      /docker|kubernetes|k8s|helm|terraform|ansible/gi,
      /jenkins|github actions|gitlab ci|circleci|travis/gi,
      /nginx|apache|load balancer|cdn|ci\/cd/gi
    ],
    frontend: [
      /html|css|sass|less|tailwind|bootstrap/gi,
      /webpack|vite|parcel|rollup|gulp|grunt/gi,
      /responsive|mobile|pwa|spa|ssr|ssg/gi
    ],
    backend: [
      /rest|graphql|soap|api|microservices|serverless/gi,
      /authentication|authorization|oauth|jwt|session/gi,
      /payment gateway|stripe|paypal|braintree/gi
    ],
    mobile: [
      /react native|flutter|swift|kotlin|ionic|cordova/gi,
      /ios|android|mobile app|native app/gi,
      /xcode|android studio|expo|phonegap/gi
    ],
    data: [
      /machine learning|ml|deep learning|dl|ai|artificial intelligence/gi,
      /data science|analytics|big data|data warehouse|etl/gi,
      /tableau|power bi|looker|matplotlib|seaborn/gi
    ],
    testing: [
      /unit test|integration test|e2e test|tdd|bdd/gi,
      /jest|mocha|jasmine|karma|cypress|selenium/gi,
      /junit|testng|pytest|rspec|minitest/gi
    ]
  };

  const extractedSkills = new Set();

  Object.values(skillPatterns).forEach(patterns => {
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const normalizedSkill = normalizeSkill(match);
          extractedSkills.add(normalizedSkill);
        });
      }
    });
  });

  return Array.from(extractedSkills);
}

function inferSkillsFromCompany(company) {
  if (!company) return [];

  const companySkillMap = {
    'google': ['cloud computing', 'machine learning', 'data engineering', 'distributed systems', 'large scale systems'],
    'microsoft': ['azure', '.net', 'office 365', 'enterprise software', 'cloud services'],
    'amazon': ['aws', 'cloud computing', 'distributed systems', 'microservices', 'devops'],
    'facebook': ['react', 'social platforms', 'scalable systems', 'mobile development', 'machine learning'],
    'apple': ['ios development', 'swift', 'objective-c', 'mobile apps', 'user experience'],
    'netflix': ['streaming', 'microservices', 'cloud architecture', 'devops', 'data engineering'],
    'uber': ['mobile apps', 'geolocation', 'real-time systems', 'data analytics', 'scalability'],
    'airbnb': ['web development', 'mobile development', 'booking systems', 'user experience', 'scalability'],
    'spotify': ['music streaming', 'data analytics', 'machine learning', 'mobile apps', 'backend systems'],
    'linkedin': ['professional networking', 'data analytics', 'machine learning', 'web development', 'scalability']
  };

  const companyLower = company.toLowerCase();
  const skills = [];

  Object.entries(companySkillMap).forEach(([key, value]) => {
    if (companyLower.includes(key)) {
      skills.push(...value);
    }
  });

  const industrySkills = inferIndustrySkills(company);
  skills.push(...industrySkills);

  return [...new Set(skills)];
}

function inferIndustrySkills(company) {
  if (!company) return [];

  const industryKeywords = {
    'fintech': ['financial services', 'payment processing', 'security', 'compliance', 'blockchain'],
    'healthcare': ['healthcare it', 'hipaa', 'medical records', 'telemedicine', 'health analytics'],
    'education': ['edtech', 'learning management', 'student information', 'online learning', 'educational content'],
    'ecommerce': ['e-commerce', 'payment processing', 'inventory management', 'customer experience', 'logistics'],
    'gaming': ['game development', 'unity', 'unreal engine', 'graphics programming', 'multiplayer systems'],
    'automotive': ['automotive software', 'embedded systems', 'iot', 'connected cars', 'autonomous driving'],
    'real estate': ['property management', 'real estate tech', 'listing management', 'market analysis', 'customer crm'],
    'travel': ['travel booking', 'hospitality', 'tourism', 'booking systems', 'customer experience'],
    'media': ['content management', 'media streaming', 'digital publishing', 'content delivery', 'user engagement'],
    'consulting': ['business consulting', 'system integration', 'enterprise solutions', 'project management', 'client management']
  };

  const companyLower = company.toLowerCase();
  const skills = [];

  Object.entries(industryKeywords).forEach(([key, value]) => {
    if (companyLower.includes(key)) {
      skills.push(...value);
    }
  });

  return skills;
}

function inferSkillsFromExperience(experience) {
  if (!experience) return [];

  const skills = [];

  if (experience >= 10) {
    skills.push('senior development', 'system architecture', 'team leadership', 'technical mentoring', 'project management');
  } else if (experience >= 5) {
    skills.push('mid-level development', 'independent work', 'code review', 'technical design', 'collaboration');
  } else if (experience >= 2) {
    skills.push('junior development', 'agile development', 'version control', 'testing', 'documentation');
  } else {
    skills.push('entry-level development', 'learning mindset', 'basic programming', 'problem solving', 'team collaboration');
  }

  return skills;
}

async function inferSkillsFromSemantics(candidate) {
  try {
    const text = `${candidate.bio || ''} ${candidate.headline || ''} ${candidate.currentCompany || ''}`;
    
    if (text.length < 50) return [];

    const embedding = await embedText(text);
    
    if (!embedding || embedding.length === 0) return [];

    const semanticSkills = mapEmbeddingToSkills(embedding);
    
    return semanticSkills;
  } catch (error) {
    console.warn("Semantic skill inference failed:", error.message);
    return [];
  }
}

function mapEmbeddingToSkills(embedding) {
  const skillEmbeddings = {
    'machine learning': [0.8, 0.2, 0.1, 0.9, 0.7],
    'web development': [0.6, 0.8, 0.3, 0.2, 0.4],
    'mobile development': [0.5, 0.3, 0.8, 0.2, 0.3],
    'data science': [0.9, 0.1, 0.2, 0.8, 0.6],
    'cloud computing': [0.3, 0.7, 0.4, 0.5, 0.8],
    'devops': [0.4, 0.6, 0.7, 0.3, 0.5],
    'ui/ux design': [0.2, 0.8, 0.5, 0.1, 0.3],
    'blockchain': [0.7, 0.2, 0.3, 0.6, 0.4],
    'cybersecurity': [0.6, 0.3, 0.4, 0.7, 0.5],
    'game development': [0.5, 0.4, 0.8, 0.2, 0.3]
  };

  const similarities = Object.entries(skillEmbeddings).map(([skill, skillEmbedding]) => {
    const similarity = calculateCosineSimilarity(embedding, skillEmbedding);
    return { skill, similarity };
  });

  const topSkills = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .filter(item => item.similarity > 0.5)
    .map(item => item.skill);

  return topSkills;
}

function calculateCosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) return 0;

  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}

function normalizeSkill(skill) {
  const skillMap = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'node': 'Node.js',
    'python': 'Python',
    'java': 'Java',
    'c++': 'C++',
    'c#': 'C#',
    'go': 'Go',
    'rust': 'Rust',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'aws': 'AWS',
    'azure': 'Azure',
    'gcp': 'Google Cloud',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'k8s': 'Kubernetes',
    'ml': 'Machine Learning',
    'ai': 'Artificial Intelligence',
    'dl': 'Deep Learning',
    'devops': 'DevOps',
    'ci/cd': 'CI/CD',
    'ui/ux': 'UI/UX Design',
    'blockchain': 'Blockchain'
  };

  const normalized = skillMap[skill.toLowerCase()];
  return normalized || skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
}

function prioritizeSkills(skills, candidate) {
  const priorityWeights = {
    'currentCompany': 3,
    'github': 2.5,
    'bio': 2,
    'headline': 1.5,
    'experience': 1,
    'semantic': 0.5
  };

  const skillScores = {};

  skills.forEach(skill => {
    skillScores[skill] = 0;
  });

  const bioSkills = extractSkillsFromText(candidate.bio || '');
  bioSkills.forEach(skill => {
    if (skillScores[skill] !== undefined) {
      skillScores[skill] += priorityWeights.bio;
    }
  });

  const headlineSkills = extractSkillsFromText(candidate.headline || '');
  headlineSkills.forEach(skill => {
    if (skillScores[skill] !== undefined) {
      skillScores[skill] += priorityWeights.headline;
    }
  });

  const companySkills = inferSkillsFromCompany(candidate.currentCompany);
  companySkills.forEach(skill => {
    if (skillScores[skill] !== undefined) {
      skillScores[skill] += priorityWeights.currentCompany;
    }
  });

  const experienceSkills = inferSkillsFromExperience(candidate.totalExperience);
  experienceSkills.forEach(skill => {
    if (skillScores[skill] !== undefined) {
      skillScores[skill] += priorityWeights.experience;
    }
  });

  const prioritizedSkills = Object.entries(skillScores)
    .sort(([, a], [, b]) => b - a)
    .map(([skill]) => skill);

  return prioritizedSkills;
}
