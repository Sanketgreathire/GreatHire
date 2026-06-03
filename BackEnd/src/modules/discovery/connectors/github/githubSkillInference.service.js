export class GitHubSkillInference {
  constructor() {
    this.techStackPatterns = {
      frontend: {
        frameworks: ['react', 'vue', 'angular', 'svelte', 'preact', 'solid', 'qwik', 'alpine'],
        libraries: ['redux', 'mobx', 'zustand', 'recoil', 'jotai', 'd3', 'three', 'chart.js', 'echarts'],
        tools: ['webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'babel', 'postcss', 'tailwind', 'styled-components', 'emotion'],
        languages: ['javascript', 'typescript', 'html', 'css', 'sass', 'less', 'stylus']
      },
      backend: {
        frameworks: ['express', 'koa', 'fastify', 'hapi', 'nest', 'django', 'flask', 'rails', 'spring', 'laravel', 'symfony'],
        databases: ['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra', 'neo4j', 'dynamodb'],
        apis: ['rest', 'graphql', 'grpc', 'soap', 'openapi', 'swagger'],
        languages: ['node', 'python', 'ruby', 'java', 'go', 'rust', 'php', 'c#', 'scala', 'elixir']
      },
      cloud: {
        providers: ['aws', 'azure', 'gcp', 'google cloud', 'alibaba cloud', 'digitalocean', 'heroku', 'vercel', 'netlify'],
        services: ['ec2', 's3', 'lambda', 'cloudfront', 'rds', 'dynamodb', 'sqs', 'sns', 'api gateway', 'cloud functions'],
        devops: ['docker', 'kubernetes', 'helm', 'istio', 'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci'],
        infrastructure: ['terraform', 'ansible', 'puppet', 'chef', 'cloudformation', 'pulumi']
      },
      devops: {
        cicd: ['jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci', 'bamboo', 'teamcity'],
        containerization: ['docker', 'kubernetes', 'helm', 'docker-compose', 'podman', 'containerd'],
        monitoring: ['prometheus', 'grafana', 'elasticsearch', 'kibana', 'datadog', 'new relic', 'sentry'],
        automation: ['ansible', 'puppet', 'chef', 'saltstack', 'terraform', 'pulumi', 'cloudformation']
      },
      ai_ml: {
        frameworks: ['tensorflow', 'pytorch', 'keras', 'scikit-learn', 'xgboost', 'lightgbm', 'huggingface', 'langchain'],
        libraries: ['pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'plotly', 'jupyter', 'opencv'],
        domains: ['machine learning', 'deep learning', 'nlp', 'computer vision', 'reinforcement learning', 'mlops'],
        tools: ['jupyter', 'colab', 'mlflow', 'kubeflow', 'airflow', 'dvc', 'weights & biases']
      },
      mobile: {
        frameworks: ['react native', 'flutter', 'swift', 'kotlin', 'xamarin', 'ionic', 'cordova', 'unity'],
        platforms: ['ios', 'android', 'cross-platform', 'hybrid', 'native'],
        tools: ['xcode', 'android studio', 'expo', 'fastlane', 'appcenter'],
        languages: ['swift', 'kotlin', 'dart', 'objective-c', 'java', 'c#']
      },
      testing: {
        frameworks: ['jest', 'mocha', 'jasmine', 'karma', 'cypress', 'playwright', 'selenium', 'rspec', 'pytest'],
        types: ['unit', 'integration', 'e2e', 'acceptance', 'performance', 'load', 'security'],
        tools: ['mock', 'stub', 'spy', 'fixture', 'coverage', 'reporting']
      },
      blockchain: {
        platforms: ['ethereum', 'bitcoin', 'polygon', 'solana', 'avalanche', 'binance smart chain'],
        languages: ['solidity', 'rust', 'go', 'javascript', 'python'],
        tools: ['web3', 'ethers.js', 'hardhat', 'truffle', 'metamask', 'infura'],
        concepts: ['smart contracts', 'dapps', 'defi', 'nft', 'dao', 'mining', 'staking']
      },
      security: {
        concepts: ['authentication', 'authorization', 'oauth', 'jwt', 'ssl', 'tls', 'encryption', 'hashing'],
        tools: ['owasp', 'burp suite', 'metasploit', 'nmap', 'wireshark', 'ssl labs'],
        practices: ['penetration testing', 'vulnerability assessment', 'code review', 'security audit']
      }
    };

    this.senioritySignals = {
      junior: ['junior', 'jr', 'entry', 'beginner', 'intern', 'trainee'],
      mid: ['mid', 'intermediate', 'experienced', 'associate', 'regular'],
      senior: ['senior', 'sr', 'lead', 'principal', 'staff', 'expert', 'architect'],
      management: ['manager', 'head', 'director', 'vp', 'cto', 'engineering manager']
    };

    this.specializationPatterns = {
      fullstack: ['full stack', 'fullstack', 'full-stack', 'mern', 'mean', 'lamp', 'jamstack'],
      frontend: ['frontend', 'front-end', 'ui', 'ux', 'web', 'browser', 'client-side'],
      backend: ['backend', 'back-end', 'server', 'api', 'microservices', 'distributed'],
      devops: ['devops', 'infrastructure', 'platform', 'sre', 'reliability'],
      data: ['data', 'analytics', 'big data', 'data science', 'bi', 'etl'],
      mobile: ['mobile', 'ios', 'android', 'app', 'native', 'cross-platform'],
      security: ['security', 'cybersecurity', 'infosec', 'penetration testing'],
      ai: ['ai', 'ml', 'machine learning', 'deep learning', 'artificial intelligence']
    };
  }

  async inferSkills(profile) {
    const inferredSkills = {
      technical: [],
      cloud: [],
      devops: [],
      ai_ml: [],
      specialization: [],
      seniority: 'unknown',
      experience: {
        years: this.estimateExperience(profile),
        level: this.calculateExperienceLevel(profile)
      },
      stack: {
        frontend: [],
        backend: [],
        databases: [],
        tools: []
      }
    };

    // Analyze repositories for technical skills
    if (profile.repositories) {
      this.analyzeRepositories(profile.repositories, inferredSkills);
    }

    // Analyze bio and description for additional skills
    if (profile.basic?.bio) {
      this.analyzeText(profile.basic.bio, inferredSkills);
    }

    // Infer specialization
    inferredSkills.specialization = this.inferSpecialization(inferredSkills);

    // Infer seniority
    inferredSkills.seniority = this.inferSeniority(profile, inferredSkills);

    // Consolidate all skills
    inferredSkills.all = [
      ...inferredSkills.technical,
      ...inferredSkills.cloud,
      ...inferredSkills.devops,
      ...inferredSkills.ai_ml,
      ...inferredSkills.stack.frontend,
      ...inferredSkills.stack.backend,
      ...inferredSkills.stack.databases,
      ...inferredSkills.stack.tools
    ].filter((skill, index, arr) => arr.indexOf(skill) === index); // Remove duplicates

    return inferredSkills;
  }

  analyzeRepositories(repositories, inferredSkills) {
    const repoText = repositories.map(repo => 
      `${repo.name} ${repo.description || ''} ${repo.topics?.join(' ') || ''}`.toLowerCase()
    ).join(' ');

    // Analyze each category
    Object.entries(this.techStackPatterns).forEach(([category, patterns]) => {
      Object.entries(patterns).forEach(([subcategory, keywords]) => {
        keywords.forEach(keyword => {
          if (repoText.includes(keyword.toLowerCase())) {
            if (category === 'frontend') {
              inferredSkills.stack.frontend.push(keyword);
            } else if (category === 'backend') {
              inferredSkills.stack.backend.push(keyword);
            } else if (category === 'cloud') {
              inferredSkills.cloud.push(keyword);
            } else if (category === 'devops') {
              inferredSkills.devops.push(keyword);
            } else if (category === 'ai_ml') {
              inferredSkills.ai_ml.push(keyword);
            } else {
              inferredSkills.technical.push(keyword);
            }
          }
        });
      });
    });

    // Extract database skills
    this.extractDatabaseSkills(repositories, inferredSkills);

    // Extract tool skills
    this.extractToolSkills(repositories, inferredSkills);
  }

  extractDatabaseSkills(repositories, inferredSkills) {
    const databaseKeywords = [
      'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'cassandra', 'neo4j',
      'dynamodb', 'firebase', 'supabase', 'planetscale', 'neon', 'turso', 'upstash'
    ];

    const repoText = repositories.map(repo => 
      `${repo.name} ${repo.description || ''}`.toLowerCase()
    ).join(' ');

    databaseKeywords.forEach(db => {
      if (repoText.includes(db)) {
        inferredSkills.stack.databases.push(db);
      }
    });
  }

  extractToolSkills(repositories, inferredSkills) {
    const toolKeywords = [
      'git', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'jenkins',
      'webpack', 'vite', 'babel', 'eslint', 'prettier', 'jest', 'mocha', 'cypress',
      'vscode', 'intellij', 'postman', 'swagger', 'terraform', 'ansible'
    ];

    const repoText = repositories.map(repo => 
      `${repo.name} ${repo.description || ''}`.toLowerCase()
    ).join(' ');

    toolKeywords.forEach(tool => {
      if (repoText.includes(tool)) {
        inferredSkills.stack.tools.push(tool);
      }
    });
  }

  analyzeText(text, inferredSkills) {
    const textLower = text.toLowerCase();

    // Analyze for technical skills in bio
    Object.entries(this.techStackPatterns).forEach(([category, patterns]) => {
      Object.entries(patterns).forEach(([subcategory, keywords]) => {
        keywords.forEach(keyword => {
          if (textLower.includes(keyword.toLowerCase())) {
            if (category === 'frontend') {
              if (!inferredSkills.stack.frontend.includes(keyword)) {
                inferredSkills.stack.frontend.push(keyword);
              }
            } else if (category === 'backend') {
              if (!inferredSkills.stack.backend.includes(keyword)) {
                inferredSkills.stack.backend.push(keyword);
              }
            } else if (category === 'cloud') {
              if (!inferredSkills.cloud.includes(keyword)) {
                inferredSkills.cloud.push(keyword);
              }
            } else if (category === 'devops') {
              if (!inferredSkills.devops.includes(keyword)) {
                inferredSkills.devops.push(keyword);
              }
            } else if (category === 'ai_ml') {
              if (!inferredSkills.ai_ml.includes(keyword)) {
                inferredSkills.ai_ml.push(keyword);
              }
            }
          }
        });
      });
    });
  }

  inferSpecialization(inferredSkills) {
    const specializations = [];

    Object.entries(this.specializationPatterns).forEach(([spec, patterns]) => {
      const allSkills = [
        ...inferredSkills.technical,
        ...inferredSkills.cloud,
        ...inferredSkills.devops,
        ...inferredSkills.ai_ml,
        ...inferredSkills.stack.frontend,
        ...inferredSkills.stack.backend
      ].join(' ').toLowerCase();

      const matches = patterns.filter(pattern => allSkills.includes(pattern.toLowerCase()));
      if (matches.length > 0) {
        specializations.push(spec);
      }
    });

    // Determine primary specialization
    if (specializations.includes('fullstack')) {
      return ['full-stack'];
    } else if (specializations.includes('frontend') && specializations.includes('backend')) {
      return ['full-stack'];
    } else if (specializations.length > 0) {
      return specializations;
    }

    return [];
  }

  inferSeniority(profile, inferredSkills) {
    let seniorityScore = 0;
    let seniority = 'junior';

    // Account age
    if (profile.basic?.createdAt) {
      const accountAge = this.calculateAccountAge(profile.basic.createdAt);
      if (accountAge >= 10) seniorityScore += 3;
      else if (accountAge >= 5) seniorityScore += 2;
      else if (accountAge >= 2) seniorityScore += 1;
    }

    // Followers
    if (profile.basic?.followers) {
      if (profile.basic.followers >= 1000) seniorityScore += 3;
      else if (profile.basic.followers >= 500) seniorityScore += 2;
      else if (profile.basic.followers >= 100) seniorityScore += 1;
    }

    // Repository count and quality
    if (profile.repositories) {
      const totalStars = profile.repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const activeRepos = profile.repositories.filter(repo => {
        const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
        return new Date(repo.pushed_at) > sixMonthsAgo;
      });

      if (totalStars >= 1000) seniorityScore += 3;
      else if (totalStars >= 100) seniorityScore += 2;
      else if (totalStars >= 10) seniorityScore += 1;

      if (activeRepos.length >= 20) seniorityScore += 2;
      else if (activeRepos.length >= 5) seniorityScore += 1;
    }

    // Skills depth
    const totalSkills = inferredSkills.all.length;
    if (totalSkills >= 20) seniorityScore += 2;
    else if (totalSkills >= 10) seniorityScore += 1;

    // Specialization
    if (inferredSkills.specialization.includes('full-stack')) seniorityScore += 1;
    if (inferredSkills.ai_ml.length >= 3) seniorityScore += 1;
    if (inferredSkills.cloud.length >= 3) seniorityScore += 1;
    if (inferredSkills.devops.length >= 3) seniorityScore += 1;

    // Bio indicators
    if (profile.basic?.bio) {
      const bio = profile.basic.bio.toLowerCase();
      
      Object.entries(this.senioritySignals).forEach(([level, signals]) => {
        signals.forEach(signal => {
          if (bio.includes(signal)) {
            if (level === 'senior') seniorityScore += 2;
            else if (level === 'mid') seniorityScore += 1;
            else if (level === 'management') seniorityScore += 3;
          }
        });
      });
    }

    // Determine seniority based on score
    if (seniorityScore >= 10) seniority = 'senior';
    else if (seniorityScore >= 6) seniority = 'mid';
    else if (seniorityScore >= 3) seniority = 'mid-junior';

    return seniority;
  }

  estimateExperience(profile) {
    let years = 0;

    // Account age as base
    if (profile.basic?.createdAt) {
      years = this.calculateAccountAge(profile.basic.createdAt);
    }

    // Adjust based on activity
    if (profile.repositories) {
      const activeRepos = profile.repositories.filter(repo => {
        const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
        return new Date(repo.pushed_at) > sixMonthsAgo;
      });

      if (activeRepos.length > 20) years += 2;
      else if (activeRepos.length > 10) years += 1;
      else if (activeRepos.length > 5) years += 0.5;
    }

    // Adjust based on followers
    if (profile.basic?.followers) {
      if (profile.basic.followers > 1000) years += 2;
      else if (profile.basic.followers > 500) years += 1;
      else if (profile.basic.followers > 100) years += 0.5;
    }

    return Math.round(years);
  }

  calculateExperienceLevel(profile) {
    const years = this.estimateExperience(profile);
    
    if (years >= 10) return 'senior';
    else if (years >= 5) return 'mid';
    else if (years >= 2) return 'mid-junior';
    else return 'junior';
  }

  calculateAccountAge(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  }

  inferTechStack(profile) {
    const stack = {
      frontend: [],
      backend: [],
      databases: [],
      cloud: [],
      devops: [],
      testing: [],
      tools: []
    };

    if (profile.repositories) {
      profile.repositories.forEach(repo => {
        const repoText = `${repo.name} ${repo.description || ''} ${repo.topics?.join(' ') || ''}`.toLowerCase();

        // Frontend
        this.techStackPatterns.frontend.frameworks.forEach(fw => {
          if (repoText.includes(fw.toLowerCase()) && !stack.frontend.includes(fw)) {
            stack.frontend.push(fw);
          }
        });

        // Backend
        this.techStackPatterns.backend.frameworks.forEach(fw => {
          if (repoText.includes(fw.toLowerCase()) && !stack.backend.includes(fw)) {
            stack.backend.push(fw);
          }
        });

        // Cloud
        this.techStackPatterns.cloud.providers.forEach(provider => {
          if (repoText.includes(provider.toLowerCase()) && !stack.cloud.includes(provider)) {
            stack.cloud.push(provider);
          }
        });

        // DevOps
        this.techStackPatterns.devops.cicd.forEach(tool => {
          if (repoText.includes(tool.toLowerCase()) && !stack.devops.includes(tool)) {
            stack.devops.push(tool);
          }
        });
      });
    }

    return stack;
  }

  getSkillConfidence(skill, profile) {
    let confidence = 0.5; // Base confidence

    // Higher confidence for explicitly mentioned skills
    if (profile.basic?.bio && profile.basic.bio.toLowerCase().includes(skill.toLowerCase())) {
      confidence += 0.3;
    }

    // Higher confidence for skills in repository names
    if (profile.repositories) {
      const nameMatches = profile.repositories.filter(repo => 
        repo.name.toLowerCase().includes(skill.toLowerCase())
      ).length;
      
      if (nameMatches > 0) {
        confidence += 0.2 * Math.min(nameMatches, 3);
      }
    }

    // Higher confidence for skills in topics
    if (profile.repositories) {
      const topicMatches = profile.repositories.filter(repo => 
        repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      
      if (topicMatches > 0) {
        confidence += 0.1 * Math.min(topicMatches, 5);
      }
    }

    return Math.min(confidence, 1.0);
  }

  generateSkillReport(profile) {
    const inferredSkills = this.inferSkills(profile);

    return {
      summary: {
        totalSkills: inferredSkills.all.length,
        primarySpecialization: inferredSkills.specialization[0] || 'generalist',
        seniority: inferredSkills.seniority,
        experience: inferredSkills.experience
      },
      technicalSkills: {
        count: inferredSkills.technical.length,
        skills: inferredSkills.technical.map(skill => ({
          skill,
          confidence: this.getSkillConfidence(skill, profile)
        }))
      },
      cloudSkills: {
        count: inferredSkills.cloud.length,
        skills: inferredSkills.cloud.map(skill => ({
          skill,
          confidence: this.getSkillConfidence(skill, profile)
        }))
      },
      devopsSkills: {
        count: inferredSkills.devops.length,
        skills: inferredSkills.devops.map(skill => ({
          skill,
          confidence: this.getSkillConfidence(skill, profile)
        }))
      },
      aiMlSkills: {
        count: inferredSkills.ai_ml.length,
        skills: inferredSkills.ai_ml.map(skill => ({
          skill,
          confidence: this.getSkillConfidence(skill, profile)
        }))
      },
      stack: inferredSkills.stack,
      recommendations: this.generateRecommendations(inferredSkills)
    };
  }

  generateRecommendations(inferredSkills) {
    const recommendations = [];

    // Recommend learning complementary skills
    if (inferredSkills.stack.frontend.length > 0 && inferredSkills.stack.backend.length === 0) {
      recommendations.push({
        type: 'skill_gap',
        message: 'Consider learning backend technologies to become a full-stack developer',
        suggestedSkills: ['node.js', 'express', 'mongodb', 'postgresql']
      });
    }

    if (inferredSkills.stack.backend.length > 0 && inferredSkills.stack.frontend.length === 0) {
      recommendations.push({
        type: 'skill_gap',
        message: 'Consider learning frontend technologies to become a full-stack developer',
        suggestedSkills: ['react', 'vue', 'typescript', 'css']
      });
    }

    // Recommend cloud skills for senior developers
    if (inferredSkills.seniority === 'senior' && inferredSkills.cloud.length === 0) {
      recommendations.push({
        type: 'career_growth',
        message: 'Consider learning cloud platforms for senior roles',
        suggestedSkills: ['aws', 'docker', 'kubernetes']
      });
    }

    // Recommend testing skills
    if (inferredSkills.stack.frontend.length > 0 || inferredSkills.stack.backend.length > 0) {
      recommendations.push({
        type: 'best_practice',
        message: 'Consider improving testing skills',
        suggestedSkills: ['jest', 'cypress', 'unit testing']
      });
    }

    return recommendations;
  }
}

export const githubSkillInference = new GitHubSkillInference();
export default githubSkillInference;
