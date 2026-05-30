export class ProjectAnalysisService {
  constructor() {
    this.complexityIndicators = {
      high: ['microservices', 'architecture', 'scalability', 'distributed', 'kubernetes', 'docker', 'ci/cd', 'testing', 'monitoring'],
      medium: ['api', 'database', 'authentication', 'authorization', 'deployment', 'performance'],
      low: ['landing', 'portfolio', 'blog', 'static', 'simple', 'basic']
    };
    
    this.technicalDepthIndicators = {
      advanced: ['machine learning', 'artificial intelligence', 'blockchain', 'distributed systems', 'real-time', 'streaming'],
      intermediate: ['react', 'node.js', 'python', 'aws', 'docker', 'kubernetes', 'microservices'],
      basic: ['html', 'css', 'javascript', 'bootstrap', 'jquery', 'wordpress']
    };
    
    this.domainExpertiseKeywords = {
      fintech: ['payment', 'banking', 'finance', 'trading', 'cryptocurrency', 'blockchain', 'fintech'],
      healthcare: ['medical', 'healthcare', 'hospital', 'patient', 'doctor', 'medicine', 'health'],
      education: ['learning', 'education', 'student', 'teacher', 'course', 'school', 'university'],
      ecommerce: ['shopping', 'cart', 'payment', 'product', 'inventory', 'ecommerce', 'store'],
      social: ['social', 'network', 'community', 'chat', 'messaging', 'friends', 'connect'],
      gaming: ['game', 'gaming', 'player', 'score', 'level', 'multiplayer', 'unity'],
      iot: ['iot', 'internet of things', 'smart', 'sensor', 'device', 'connected', 'embedded'],
      analytics: ['analytics', 'dashboard', 'reporting', 'data', 'visualization', 'metrics', 'insights']
    };
    
    this.engineeringSpecializationKeywords = {
      frontend: ['react', 'vue', 'angular', 'css', 'sass', 'webpack', 'responsive', 'ui', 'ux'],
      backend: ['api', 'server', 'database', 'microservices', 'authentication', 'authorization', 'backend'],
      fullstack: ['full-stack', 'fullstack', 'mern', 'mean', 'lamp', 'jamstack'],
      devops: ['devops', 'deployment', 'ci/cd', 'docker', 'kubernetes', 'infrastructure'],
      mobile: ['mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin'],
      data: ['data', 'analytics', 'machine learning', 'ai', 'big data', 'visualization'],
      security: ['security', 'authentication', 'authorization', 'encryption', 'vulnerability', 'penetration'],
      cloud: ['aws', 'azure', 'gcp', 'cloud', 'serverless', 'lambda', 'functions']
    };
  }

  async analyzeProject(project, baseUrl = '') {
    try {
      const analysis = {
        complexity: this.calculateComplexity(project),
        technicalDepth: this.assessTechnicalDepth(project),
        domainExpertise: this.identifyDomainExpertise(project),
        engineeringSpecialization: this.identifyEngineeringSpecialization(project),
        projectQuality: this.assessProjectQuality(project),
        innovationScore: this.calculateInnovationScore(project),
        teamSize: this.estimateTeamSize(project),
        duration: this.estimateProjectDuration(project),
        impact: this.assessProjectImpact(project),
        scalability: this.assessScalability(project),
        maintainability: this.assessMaintainability(project)
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing project:', error);
      return null;
    }
  }

  calculateComplexity(project) {
    let complexityScore = 0;
    const indicators = {
      high: 0,
      medium: 0,
      low: 0
    };

    const text = `${project.name} ${project.description || ''} ${(project.technologies || []).join(' ')}`.toLowerCase();

    // Count complexity indicators
    Object.entries(this.complexityIndicators).forEach(([level, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          indicators[level]++;
          complexityScore += level === 'high' ? 3 : level === 'medium' ? 2 : 1;
        }
      });
    });

    // Additional complexity factors
    if (project.technologies && project.technologies.length > 5) {
      complexityScore += 2;
    }

    if (project.description && project.description.length > 200) {
      complexityScore += 1;
    }

    if (project.links && project.links.length > 3) {
      complexityScore += 1;
    }

    // Normalize to 0-10 scale
    const normalizedScore = Math.min(complexityScore / 3, 10);

    return {
      score: Math.round(normalizedScore * 10) / 10,
      level: this.getComplexityLevel(normalizedScore),
      indicators
    };
  }

  assessTechnicalDepth(project) {
    let depthScore = 0;
    const indicators = {
      advanced: 0,
      intermediate: 0,
      basic: 0
    };

    const text = `${project.name} ${project.description || ''} ${(project.technologies || []).join(' ')}`.toLowerCase();

    // Count technical depth indicators
    Object.entries(this.technicalDepthIndicators).forEach(([level, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          indicators[level]++;
          depthScore += level === 'advanced' ? 3 : level === 'intermediate' ? 2 : 1;
        }
      });
    });

    // Technology diversity bonus
    if (project.technologies) {
      const uniqueCategories = this.categorizeTechnologies(project.technologies);
      depthScore += uniqueCategories.length;
    }

    // Normalize to 0-10 scale
    const normalizedScore = Math.min(depthScore / 2, 10);

    return {
      score: Math.round(normalizedScore * 10) / 10,
      level: this.getDepthLevel(normalizedScore),
      indicators,
      technologyCategories: project.technologies ? this.categorizeTechnologies(project.technologies) : []
    };
  }

  identifyDomainExpertise(project) {
    const text = `${project.name} ${project.description || ''}`.toLowerCase();
    const expertiseScores = {};

    Object.entries(this.domainExpertiseKeywords).forEach(([domain, keywords]) => {
      let score = 0;
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      if (score > 0) {
        expertiseScores[domain] = score;
      }
    });

    // Sort by score and return top domains
    const sortedDomains = Object.entries(expertiseScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      primary: sortedDomains[0] ? sortedDomains[0][0] : null,
      secondary: sortedDomains.slice(1).map(([domain]) => domain),
      all: expertiseScores,
      confidence: sortedDomains[0] ? Math.min(sortedDomains[0][1] / 3, 1) : 0
    };
  }

  identifyEngineeringSpecialization(project) {
    const text = `${project.name} ${project.description || ''} ${(project.technologies || []).join(' ')}`.toLowerCase();
    const specializationScores = {};

    Object.entries(this.engineeringSpecializationKeywords).forEach(([specialization, keywords]) => {
      let score = 0;
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      if (score > 0) {
        specializationScores[specialization] = score;
      }
    });

    // Sort by score and return top specializations
    const sortedSpecializations = Object.entries(specializationScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      primary: sortedSpecializations[0] ? sortedSpecializations[0][0] : null,
      secondary: sortedSpecializations.slice(1).map(([spec]) => spec),
      all: specializationScores,
      confidence: sortedSpecializations[0] ? Math.min(sortedSpecializations[0][1] / 3, 1) : 0
    };
  }

  assessProjectQuality(project) {
    let qualityScore = 0;
    const factors = {
      completeness: 0,
      documentation: 0,
      presentation: 0,
      technical: 0
    };

    // Completeness factors
    if (project.name && project.name.length > 3) factors.completeness += 2;
    if (project.description && project.description.length > 50) factors.completeness += 2;
    if (project.technologies && project.technologies.length > 0) factors.completeness += 2;
    if (project.url) factors.completeness += 2;
    if (project.links && project.links.length > 0) factors.completeness += 2;

    // Documentation factors
    if (project.description && project.description.length > 200) factors.documentation += 3;
    if (project.images && project.images.length > 0) factors.documentation += 2;
    if (project.links && project.links.some(link => link.url.includes('github'))) factors.documentation += 3;

    // Presentation factors
    if (project.images && project.images.length > 2) factors.presentation += 2;
    if (project.url && project.url.includes('http')) factors.presentation += 2;
    if (project.name && !project.name.includes('test')) factors.presentation += 1;

    // Technical factors
    if (project.technologies && project.technologies.length > 3) factors.technical += 2;
    if (project.technologies && project.technologies.some(tech => this.isModernTech(tech))) factors.technical += 2;
    if (project.links && project.links.some(link => link.url.includes('github'))) factors.technical += 1;

    qualityScore = Object.values(factors).reduce((sum, score) => sum + score, 0);

    return {
      score: Math.min(qualityScore / 2, 10),
      factors,
      grade: this.getQualityGrade(Math.min(qualityScore / 2, 10))
    };
  }

  calculateInnovationScore(project) {
    let innovationScore = 0;
    const innovationIndicators = {
      novelTechnology: 0,
      uniqueApproach: 0,
      problemSolving: 0,
      creativity: 0
    };

    const text = `${project.name} ${project.description || ''}`.toLowerCase();

    // Novel technology indicators
    const novelTechKeywords = ['blockchain', 'ai', 'machine learning', 'ar', 'vr', 'iot', 'quantum', 'web3'];
    novelTechKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        innovationIndicators.novelTechnology++;
        innovationScore += 2;
      }
    });

    // Unique approach indicators
    const uniqueKeywords = ['first', 'innovative', 'breakthrough', 'revolutionary', 'pioneering', 'cutting-edge'];
    uniqueKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        innovationIndicators.uniqueApproach++;
        innovationScore += 1.5;
      }
    });

    // Problem-solving indicators
    const problemKeywords = ['solve', 'solution', 'problem', 'challenge', 'improve', 'optimize'];
    problemKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        innovationIndicators.problemSolving++;
        innovationScore += 1;
      }
    });

    // Creativity indicators
    const creativeKeywords = ['creative', 'design', 'art', 'beautiful', 'elegant', 'intuitive'];
    creativeKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        innovationIndicators.creativity++;
        innovationScore += 0.5;
      }
    });

    return {
      score: Math.min(innovationScore, 10),
      indicators: innovationIndicators,
      level: this.getInnovationLevel(Math.min(innovationScore, 10))
    };
  }

  estimateTeamSize(project) {
    let teamSize = 1; // Default to solo developer
    const text = `${project.name} ${project.description || ''}`.toLowerCase();

    // Team size indicators
    if (text.includes('team') || text.includes('collaborat')) teamSize += 2;
    if (text.includes('group') || text.includes('multiple')) teamSize += 1;
    if (text.includes('company') || text.includes('organization')) teamSize += 2;
    if (text.includes('solo') || text.includes('individual')) teamSize = 1;

    // Technology complexity can indicate larger teams
    const techCount = project.technologies ? project.technologies.length : 0;
    if (techCount > 10) teamSize += 2;
    else if (techCount > 5) teamSize += 1;

    return {
      estimated: Math.min(teamSize, 10),
      confidence: this.getTeamSizeConfidence(text, techCount)
    };
  }

  estimateProjectDuration(project) {
    let durationMonths = 1; // Default to 1 month
    const text = `${project.name} ${project.description || ''}`.toLowerCase();

    // Duration indicators
    if (text.includes('year') || text.includes('annual')) durationMonths = 12;
    else if (text.includes('month') || text.includes('monthly')) durationMonths = 1;
    else if (text.includes('week') || text.includes('weekly')) durationMonths = 0.25;
    else if (text.includes('day') || text.includes('daily')) durationMonths = 0.03;

    // Complexity-based estimation
    const complexity = this.calculateComplexity(project);
    if (complexity.score > 7) durationMonths *= 3;
    else if (complexity.score > 5) durationMonths *= 2;
    else if (complexity.score > 3) durationMonths *= 1.5;

    // Technology diversity impact
    const techCount = project.technologies ? project.technologies.length : 0;
    if (techCount > 10) durationMonths *= 1.5;
    else if (techCount > 5) durationMonths *= 1.2;

    return {
      estimated: Math.round(durationMonths * 10) / 10,
      unit: 'months',
      confidence: this.getDurationConfidence(text, complexity.score, techCount)
    };
  }

  assessProjectImpact(project) {
    let impactScore = 0;
    const impactFactors = {
      users: 0,
      business: 0,
      technical: 0,
      social: 0
    };

    const text = `${project.name} ${project.description || ''}`.toLowerCase();

    // User impact indicators
    const userKeywords = ['users', 'customers', 'clients', 'audience', 'visitors', 'thousands', 'millions'];
    userKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        impactFactors.users++;
        impactScore += 2;
      }
    });

    // Business impact indicators
    const businessKeywords = ['revenue', 'profit', 'sales', 'growth', 'efficiency', 'productivity', 'cost'];
    businessKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        impactFactors.business++;
        impactScore += 2;
      }
    });

    // Technical impact indicators
    const technicalKeywords = ['scalable', 'performance', 'optimization', 'architecture', 'infrastructure'];
    technicalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        impactFactors.technical++;
        impactScore += 1.5;
      }
    });

    // Social impact indicators
    const socialKeywords = ['community', 'social', 'impact', 'change', 'improve', 'help', 'support'];
    socialKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        impactFactors.social++;
        impactScore += 1;
      }
    });

    return {
      score: Math.min(impactScore, 10),
      factors: impactFactors,
      level: this.getImpactLevel(Math.min(impactScore, 10))
    };
  }

  assessScalability(project) {
    let scalabilityScore = 0;
    const scalabilityFactors = {
      architecture: 0,
      technology: 0,
      infrastructure: 0,
      design: 0
    };

    const text = `${project.name} ${project.description || ''} ${(project.technologies || []).join(' ')}`.toLowerCase();

    // Architecture indicators
    const archKeywords = ['microservices', 'distributed', 'scalable', 'modular', 'component-based'];
    archKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scalabilityFactors.architecture++;
        scalabilityScore += 2.5;
      }
    });

    // Technology indicators
    const techKeywords = ['kubernetes', 'docker', 'aws', 'azure', 'gcp', 'serverless', 'lambda'];
    techKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scalabilityFactors.technology++;
        scalabilityScore += 2;
      }
    });

    // Infrastructure indicators
    const infraKeywords = ['cloud', 'cdn', 'load balancer', 'auto-scaling', 'cluster'];
    infraKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scalabilityFactors.infrastructure++;
        scalabilityScore += 1.5;
      }
    });

    // Design indicators
    const designKeywords = ['responsive', 'mobile-friendly', 'cross-platform', 'multi-device'];
    designKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scalabilityFactors.design++;
        scalabilityScore += 1;
      }
    });

    return {
      score: Math.min(scalabilityScore, 10),
      factors: scalabilityFactors,
      level: this.getScalabilityLevel(Math.min(scalabilityScore, 10))
    };
  }

  assessMaintainability(project) {
    let maintainabilityScore = 0;
    const maintainabilityFactors = {
      code: 0,
      documentation: 0,
      structure: 0,
      testing: 0
    };

    const text = `${project.name} ${project.description || ''} ${(project.technologies || []).join(' ')}`.toLowerCase();

    // Code quality indicators
    const codeKeywords = ['clean code', 'refactored', 'optimized', 'efficient', 'well-structured'];
    codeKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        maintainabilityFactors.code++;
        maintainabilityScore += 2;
      }
    });

    // Documentation indicators
    const docKeywords = ['documentation', 'readme', 'guide', 'tutorial', 'explained'];
    docKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        maintainabilityFactors.documentation++;
        maintainabilityScore += 2.5;
      }
    });

    // Structure indicators
    const structKeywords = ['modular', 'organized', 'structured', 'architecture', 'design pattern'];
    structKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        maintainabilityFactors.structure++;
        maintainabilityScore += 1.5;
      }
    });

    // Testing indicators
    const testKeywords = ['testing', 'unit test', 'integration test', 'test coverage', 'quality'];
    testKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        maintainabilityFactors.testing++;
        maintainabilityScore += 2;
      }
    });

    return {
      score: Math.min(maintainabilityScore, 10),
      factors: maintainabilityFactors,
      level: this.getMaintainabilityLevel(Math.min(maintainabilityScore, 10))
    };
  }

  // Helper methods
  getComplexityLevel(score) {
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  getDepthLevel(score) {
    if (score >= 7) return 'advanced';
    if (score >= 4) return 'intermediate';
    return 'basic';
  }

  getQualityGrade(score) {
    if (score >= 9) return 'A';
    if (score >= 8) return 'B';
    if (score >= 6) return 'C';
    if (score >= 4) return 'D';
    return 'F';
  }

  getInnovationLevel(score) {
    if (score >= 8) return 'highly innovative';
    if (score >= 5) return 'moderately innovative';
    return 'standard';
  }

  getTeamSizeConfidence(text, techCount) {
    let confidence = 0.5; // Base confidence
    
    if (text.includes('team') || text.includes('collaborat')) confidence += 0.3;
    if (techCount > 5) confidence += 0.1;
    if (text.includes('solo') || text.includes('individual')) confidence += 0.2;
    
    return Math.min(confidence, 1);
  }

  getDurationConfidence(text, complexity, techCount) {
    let confidence = 0.5; // Base confidence
    
    if (text.includes('month') || text.includes('year')) confidence += 0.3;
    if (complexity > 5) confidence += 0.1;
    if (techCount > 3) confidence += 0.1;
    
    return Math.min(confidence, 1);
  }

  getImpactLevel(score) {
    if (score >= 8) return 'high impact';
    if (score >= 5) return 'medium impact';
    return 'low impact';
  }

  getScalabilityLevel(score) {
    if (score >= 8) return 'highly scalable';
    if (score >= 5) return 'moderately scalable';
    return 'limited scalability';
  }

  getMaintainabilityLevel(score) {
    if (score >= 8) return 'highly maintainable';
    if (score >= 5) return 'moderately maintainable';
    return 'difficult to maintain';
  }

  categorizeTechnologies(technologies) {
    const categories = new Set();
    
    technologies.forEach(tech => {
      const techLower = tech.toLowerCase();
      
      if (['react', 'vue', 'angular', 'svelte', 'html', 'css', 'javascript', 'typescript'].some(t => techLower.includes(t))) {
        categories.add('frontend');
      }
      if (['node', 'express', 'python', 'django', 'java', 'spring', 'ruby', 'rails'].some(t => techLower.includes(t))) {
        categories.add('backend');
      }
      if (['mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch'].some(t => techLower.includes(t))) {
        categories.add('database');
      }
      if (['aws', 'azure', 'gcp', 'docker', 'kubernetes'].some(t => techLower.includes(t))) {
        categories.add('cloud');
      }
      if (['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'].some(t => techLower.includes(t))) {
        categories.add('mobile');
      }
    });
    
    return Array.from(categories);
  }

  isModernTech(technology) {
    const modernTechs = [
      'react', 'vue', 'angular', 'typescript', 'node.js', 'python', 'docker',
      'kubernetes', 'aws', 'azure', 'gcp', 'graphql', 'microservices',
      'serverless', 'blockchain', 'ai', 'machine learning', 'kotlin', 'swift'
    ];
    
    return modernTechs.some(modern => technology.toLowerCase().includes(modern));
  }
}

export const projectAnalysis = new ProjectAnalysisService();
export default projectAnalysis;
