import { checkAiHealth } from "../../../../sourcing/ai/aiServiceClient.js";

const SKILL_EXPANSION_MAP = {
  'backend engineer': ['node.js', 'java', 'python', 'spring boot', 'express', 'django', 'flask', 'apis', 'rest', 'graphql', 'microservices', 'redis', 'kafka', 'postgresql', 'mongodb', 'mysql'],
  'frontend engineer': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'webpack', 'next.js', 'nuxt', 'tailwind', 'bootstrap', 'jquery', 'ui', 'ux', 'responsive design'],
  'full stack engineer': ['react', 'node.js', 'javascript', 'typescript', 'python', 'java', 'mongodb', 'postgresql', 'rest apis', 'graphql', 'docker', 'aws', 'microservices', 'frontend', 'backend'],
  'devops engineer': ['docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions', 'aws', 'azure', 'gcp', 'terraform', 'ansible', 'ci/cd', 'monitoring', 'prometheus', 'grafana', 'elasticsearch', 'logstash'],
  'data scientist': ['python', 'r', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'jupyter', 'statistics', 'data analysis', 'sql', 'tableau', 'power bi'],
  'machine learning engineer': ['python', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'mlops', 'kubernetes', 'docker', 'aws', 'azure', 'gcp', 'data pipelines', 'airflow', 'kubeflow', 'model deployment'],
  'mobile engineer': ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin', 'cordova', 'ionic', 'mobile development', 'app development', 'firebase', 'push notifications'],
  'security engineer': ['cybersecurity', 'penetration testing', 'vulnerability assessment', 'owasp', 'security auditing', 'firewall', 'intrusion detection', 'siem', 'encryption', 'authentication', 'authorization'],
  'cloud engineer': ['aws', 'azure', 'gcp', 'terraform', 'cloudformation', 'arm templates', 'deployment manager', 'kubernetes', 'docker', 'serverless', 'lambda', 'functions', 'microservices'],
  'qa engineer': ['testing', 'automation', 'selenium', 'cypress', 'jest', 'mocha', 'test-driven development', 'quality assurance', 'performance testing', 'load testing', 'security testing'],
  'product manager': ['product management', 'agile', 'scrum', 'user stories', 'roadmapping', 'analytics', 'metrics', 'stakeholder management', 'market research', 'competitive analysis'],
  'ui/ux designer': ['figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'user research', 'wireframing', 'prototyping', 'design systems', 'usability testing'],
  'blockchain developer': ['blockchain', 'web3', 'ethereum', 'solidity', 'smart contracts', 'defi', 'nft', 'cryptocurrency', 'dapps', 'truffle', 'hardhat', 'metamask'],
  'game developer': ['unity', 'unreal engine', 'c#', 'c++', 'game development', '3d modeling', 'animation', 'physics', 'multiplayer', 'mobile games', 'pc games'],
  'embedded systems engineer': ['c', 'c++', 'embedded systems', 'iot', 'arduino', 'raspberry pi', 'firmware', 'hardware', 'microcontrollers', 'real-time systems'],
  'network engineer': ['networking', 'tcp/ip', 'routing', 'switching', 'firewall', 'vpn', 'load balancer', 'cisco', 'juniper', 'wireshark', 'network security'],
  'database administrator': ['sql', 'nosql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'database administration', 'backup', 'replication', 'performance tuning', 'query optimization'],
  'business analyst': ['business analysis', 'requirements gathering', 'process modeling', 'data analysis', 'sql', 'excel', 'power bi', 'tableau', 'stakeholder management'],
  'technical writer': ['technical writing', 'documentation', 'api documentation', 'user guides', 'markdown', 'git', 'version control', 'content management', 'knowledge base'],
  'solutions architect': ['architecture', 'system design', 'cloud architecture', 'microservices', 'scalability', 'high availability', 'disaster recovery', 'security', 'integration'],
  'site reliability engineer': ['sre', 'reliability', 'monitoring', 'alerting', 'incident management', 'postmortem', 'sla', 'slos', 'kubernetes', 'docker', 'aws', 'azure', 'gcp']
};

const TECHNOLOGY_STACK_MAP = {
  'javascript': ['react', 'vue', 'angular', 'node.js', 'express', 'next.js', 'nuxt', 'typescript', 'webpack', 'babel', 'jest', 'cypress'],
  'python': ['django', 'flask', 'fastapi', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'jupyter', 'airflow', 'celery'],
  'java': ['spring boot', 'spring framework', 'maven', 'gradle', 'hibernate', 'junit', 'mockito', 'microservices', 'rest apis'],
  'react': ['next.js', 'redux', 'mobx', 'react router', 'jest', 'enzyme', 'react testing library', 'material-ui', 'ant design'],
  'node.js': ['express', 'koa', 'nest.js', 'fastify', 'socket.io', 'sequelize', 'mongoose', 'prisma', 'jwt', 'oauth'],
  'aws': ['ec2', 's3', 'lambda', 'rds', 'dynamodb', 'cloudfront', 'api gateway', 'cloudformation', 'terraform', 'serverless'],
  'docker': ['kubernetes', 'docker compose', 'containerization', 'microservices', 'devops', 'ci/cd', 'jenkins', 'gitlab ci'],
  'machine learning': ['tensorflow', 'pytorch', 'scikit-learn', 'keras', 'deep learning', 'neural networks', 'mlops', 'model deployment'],
  'microservices': ['rest apis', 'graphql', 'kubernetes', 'docker', 'service mesh', 'api gateway', 'load balancing', 'distributed systems']
};

const INDUSTRY_EXPANSION_MAP = {
  'fintech': ['banking', 'finance', 'payments', 'trading', 'blockchain', 'cryptocurrency', 'insurtech', 'regtech'],
  'healthcare': ['medical', 'pharmaceutical', 'biotechnology', 'health tech', 'telemedicine', 'electronic health records'],
  'ecommerce': ['retail', 'shopping', 'marketplace', 'payment processing', 'inventory management', 'logistics'],
  'edtech': ['education', 'e-learning', 'online learning', 'training', 'academic', 'curriculum development'],
  'gaming': ['entertainment', 'gaming', 'game development', 'esports', 'virtual reality', 'augmented reality'],
  'automotive': ['transportation', 'automotive', 'electric vehicles', 'autonomous driving', 'fleet management'],
  'real estate': ['property', 'housing', 'construction', 'facility management', 'property management']
};

export async function expandQuery(intent, recruiterMemory = {}) {
  const expandedQuery = {
    ...intent,
    expandedSkills: [],
    relatedSkills: [],
    semanticQuery: '',
    filters: {
      ...intent.filters
    },
    topK: intent.topK || 20,
    scoreThreshold: intent.scoreThreshold || 0.3
  };

  if (intent.skills && intent.skills.length > 0) {
    expandedQuery.expandedSkills = await expandSkills(intent.skills, recruiterMemory);
    expandedQuery.relatedSkills = getRelatedSkills(intent.skills);
  }

  if (intent.designation) {
    const designationSkills = SKILL_EXPANSION_MAP[intent.designation.toLowerCase()] || [];
    expandedQuery.expandedSkills = [...new Set([...expandedQuery.expandedSkills, ...designationSkills])];
  }

  if (intent.industry) {
    const industryTerms = INDUSTRY_EXPANSION_MAP[intent.industry.toLowerCase()] || [];
    expandedQuery.relatedSkills = [...new Set([...expandedQuery.relatedSkills, ...industryTerms])];
  }

  expandedQuery.semanticQuery = buildSemanticQuery(expandedQuery);
  expandedQuery.filters.skills = [...new Set([...expandedQuery.filters.skills || [], ...expandedQuery.expandedSkills])];

  return expandedQuery;
}

async function expandSkills(skills, recruiterMemory) {
  const expanded = new Set(skills);
  
  for (const skill of skills) {
    const techStack = TECHNOLOGY_STACK_MAP[skill.toLowerCase()];
    if (techStack) {
      techStack.forEach(tech => expanded.add(tech));
    }
  }

  if (recruiterMemory.preferences?.skills) {
    recruiterMemory.preferences.skills.forEach(prefSkill => {
      if (skills.some(skill => skill.toLowerCase().includes(prefSkill.toLowerCase()) || 
                                prefSkill.toLowerCase().includes(skill.toLowerCase()))) {
        const prefTechStack = TECHNOLOGY_STACK_MAP[prefSkill.toLowerCase()];
        if (prefTechStack) {
          prefTechStack.forEach(tech => expanded.add(tech));
        }
      }
    });
  }

  const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
  if (aiAvailable) {
    try {
      const aiExpanded = await expandWithAI(skills, recruiterMemory);
      aiExpanded.forEach(skill => expanded.add(skill));
    } catch (error) {
      console.warn('AI skill expansion failed:', error.message);
    }
  }

  return Array.from(expanded);
}

function getRelatedSkills(skills) {
  const related = new Set();
  
  skills.forEach(skill => {
    const normalizedSkill = skill.toLowerCase();
    
    Object.entries(SKILL_EXPANSION_MAP).forEach(([designation, designationSkills]) => {
      if (designationSkills.some(dSkill => 
          dSkill.toLowerCase().includes(normalizedSkill) || 
          normalizedSkill.includes(dSkill.toLowerCase()))) {
        designationSkills.forEach(dSkill => related.add(dSkill));
      }
    });
  });

  return Array.from(related).filter(skill => 
    !skills.some(originalSkill => 
      originalSkill.toLowerCase() === skill.toLowerCase())
  );
}

function buildSemanticQuery(expandedQuery) {
  const parts = [];
  
  if (expandedQuery.designation) {
    parts.push(expandedQuery.designation);
  }
  
  if (expandedQuery.expandedSkills && expandedQuery.expandedSkills.length > 0) {
    parts.push(expandedQuery.expandedSkills.join(' '));
  }
  
  if (expandedQuery.experience) {
    parts.push(expandedQuery.experience);
  }
  
  if (expandedQuery.location) {
    parts.push(expandedQuery.location);
  }
  
  if (expandedQuery.industry) {
    parts.push(expandedQuery.industry);
  }
  
  if (expandedQuery.seniority) {
    parts.push(expandedQuery.seniority);
  }
  
  return parts.join(' ');
}

async function expandWithAI(skills, recruiterMemory) {
  try {
    const axios = await import('axios');
    const AI_BASE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const AI_API_KEY = process.env.AI_SERVICE_API_KEY || "greathire-ai-secret-key-change-in-prod";
    
    const response = await axios.default.post(
      `${AI_BASE_URL}/expand/skills`,
      { 
        skills,
        context: {
          previousSearches: recruiterMemory.searchHistory?.slice(-5) || [],
          preferredSkills: recruiterMemory.preferences?.skills || [],
          preferredIndustries: recruiterMemory.preferences?.industries || []
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_API_KEY
        },
        timeout: 10000
      }
    );
    
    return response.data.expandedSkills || [];
  } catch (error) {
    console.warn('AI skill expansion service error:', error.message);
    return [];
  }
}
