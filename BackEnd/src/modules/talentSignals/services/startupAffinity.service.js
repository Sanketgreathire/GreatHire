import { SourcingCandidate } from "../../../../models/sourcing/SourcingCandidate.model.js";
import { TalentSignal } from "../../../models/talentSignal.model.js";

export class StartupAffinityService {
  constructor() {
    this.weights = {
      experienceSignals: 0.3,
      skillSignals: 0.25,
      activitySignals: 0.2,
      personalitySignals: 0.15,
      riskSignals: 0.1
    };
    
    this.affinityThresholds = {
      highAffinity: 0.75,
      mediumAffinity: 0.5,
      lowAffinity: 0.25
    };
  }

  async predictStartupAffinity(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const existingSignal = await TalentSignal.findOne({ candidateId });

      // Analyze different signal categories
      const experienceSignals = await this.analyzeExperienceSignals(candidate);
      const skillSignals = await this.analyzeSkillSignals(candidate);
      const activitySignals = await this.analyzeActivitySignals(candidate);
      const personalitySignals = await this.analyzePersonalitySignals(candidate);
      const riskSignals = await this.analyzeRiskSignals(candidate);

      // Calculate weighted scores
      const scores = {
        experienceScore: this.calculateExperienceScore(experienceSignals),
        skillScore: this.calculateSkillScore(skillSignals),
        activityScore: this.calculateActivityScore(activitySignals),
        personalityScore: this.calculatePersonalityScore(personalitySignals),
        riskScore: this.calculateRiskScore(riskSignals)
      };

      // Calculate overall startup affinity
      const startupAffinity = this.calculateStartupAffinity(scores);
      
      // Determine affinity level
      const affinityLevel = this.determineAffinityLevel(startupAffinity);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(scores, experienceSignals);

      // Generate predictions
      const predictions = {
        startupInterest: startupAffinity > this.affinityThresholds.mediumAffinity,
        enterprisePreference: startupAffinity < this.affinityThresholds.mediumAffinity,
        productEngineeringAffinity: this.predictProductEngineeringAffinity(skillSignals, experienceSignals),
        fastGrowthCompanyAlignment: this.predictFastGrowthAlignment(experienceSignals, personalitySignals),
        riskTolerance: this.predictRiskTolerance(riskSignals, experienceSignals),
        stagePreference: this.predictStagePreference(experienceSignals, skillSignals),
        equityVsSalaryPreference: this.predictEquityVsSalaryPreference(riskSignals, experienceSignals),
        teamSizePreference: this.predictTeamSizePreference(personalitySignals, experienceSignals)
      };

      return {
        candidateId,
        startupAffinityScore: Math.round(startupAffinity * 100) / 100,
        affinityLevel,
        confidence: Math.round(confidence * 100) / 100,
        scores,
        signals: {
          experience: experienceSignals,
          skill: skillSignals,
          activity: activitySignals,
          personality: personalitySignals,
          risk: riskSignals
        },
        predictions,
        metadata: {
          modelVersion: '1.0',
          timestamp: new Date(),
          dataQuality: this.assessDataQuality(candidate)
        }
      };

    } catch (error) {
      console.error('Error predicting startup affinity:', error);
      throw error;
    }
  }

  async analyzeExperienceSignals(candidate) {
    const signals = {
      startupExperience: 0,
      earlyStageExperience: 0,
      companySizeVariety: 0,
      roleBreadth: 0,
      foundingExperience: 0,
      growthExperience: 0
    };

    if (candidate.experience) {
      const experiences = candidate.experience || [];
      
      // Startup experience
      const startupJobs = experiences.filter(exp => {
        const companySize = (exp.companySize || '').toLowerCase();
        return companySize.includes('startup') || companySize.includes('small');
      });
      signals.startupExperience = Math.min(startupJobs.length / 3, 1);

      // Early stage experience
      const earlyStageJobs = experiences.filter(exp => {
        const stage = (exp.companyStage || '').toLowerCase();
        return stage.includes('seed') || stage.includes('early') || stage.includes('pre-series');
      });
      signals.earlyStageExperience = Math.min(earlyStageJobs.length / 2, 1);

      // Company size variety
      const companySizes = experiences.map(exp => exp.companySize).filter(Boolean);
      const uniqueSizes = [...new Set(companySizes)];
      signals.companySizeVariety = Math.min(uniqueSizes.length / 4, 1);

      // Role breadth (multiple responsibilities)
      const broadRoles = experiences.filter(exp => {
        const description = (exp.description || '').toLowerCase();
        const responsibilities = (exp.responsibilities || []).join(' ').toLowerCase();
        const text = description + ' ' + responsibilities;
        
        const breadthKeywords = ['multiple', 'various', 'cross-functional', 'full-stack', 'end-to-end'];
        return breadthKeywords.some(keyword => text.includes(keyword));
      });
      signals.roleBreadth = Math.min(broadRoles.length / experiences.length, 1);

      // Founding experience
      const foundingRoles = experiences.filter(exp => {
        const title = (exp.title || '').toLowerCase();
        return title.includes('founder') || title.includes('co-founder');
      });
      signals.foundingExperience = Math.min(foundingRoles.length / experiences.length, 1);

      // Growth experience (companies that grew significantly)
      const growthJobs = experiences.filter(exp => {
        const growth = exp.companyGrowth || 0;
        return growth > 50; // 50%+ growth
      });
      signals.growthExperience = Math.min(growthJobs.length / experiences.length, 1);
    }

    return signals;
  }

  async analyzeSkillSignals(candidate) {
    const signals = {
      fullStackSkills: 0,
      modernTechStack: 0,
      devOpsSkills: 0,
      productSkills: 0,
      rapidDevelopment: 0,
      adaptabilityScore: 0
    };

    if (candidate.skills) {
      const skills = candidate.skills || [];
      const skillNames = skills.map(skill => skill.name).map(name => name.toLowerCase());

      // Full stack skills
      const frontendTech = ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'];
      const backendTech = ['node', 'python', 'java', 'ruby', 'go', 'rust', 'php'];
      
      const frontendCount = frontendTech.filter(tech => 
        skillNames.some(skill => skill.includes(tech))
      ).length;
      const backendCount = backendTech.filter(tech => 
        skillNames.some(skill => skill.includes(tech))
      ).length;
      
      signals.fullStackSkills = Math.min((frontendCount + backendCount) / 10, 1);

      // Modern tech stack
      const modernTech = ['react', 'vue', 'node', 'python', 'go', 'rust', 'docker', 'kubernetes', 'aws', 'gcp'];
      const modernCount = modernTech.filter(tech => 
        skillNames.some(skill => skill.includes(tech))
      ).length;
      signals.modernTechStack = Math.min(modernCount / modernTech.length, 1);

      // DevOps skills
      const devOpsTech = ['docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform', 'ansible', 'aws', 'gcp', 'azure'];
      const devOpsCount = devOpsTech.filter(tech => 
        skillNames.some(skill => skill.includes(tech))
      ).length;
      signals.devOpsSkills = Math.min(devOpsCount / devOpsTech.length, 1);

      // Product skills
      const productKeywords = ['product', 'design', 'ux', 'analytics', 'metrics', 'user research'];
      const productCount = productKeywords.filter(keyword => 
        skillNames.some(skill => skill.includes(keyword))
      ).length;
      signals.productSkills = Math.min(productCount / productKeywords.length, 1);

      // Rapid development skills
      const rapidTech = ['agile', 'scrum', 'lean', 'mvp', 'prototype', 'rapid'];
      const rapidCount = rapidTech.filter(tech => 
        skillNames.some(skill => skill.includes(tech))
      ).length;
      signals.rapidDevelopment = Math.min(rapidCount / rapidTech.length, 1);

      // Adaptability score (based on skill diversity)
      const skillCategories = ['frontend', 'backend', 'database', 'devops', 'mobile', 'ai/ml'];
      const candidateCategories = skills.map(skill => skill.category).filter(Boolean);
      const uniqueCategories = [...new Set(candidateCategories)];
      signals.adaptabilityScore = Math.min(uniqueCategories.length / skillCategories.length, 1);
    }

    return signals;
  }

  async analyzeActivitySignals(candidate) {
    const signals = {
      sideProjects: 0,
      openSourceContribution: 0,
      rapidLearning: 0,
      experimentation: 0,
      communityInvolvement: 0,
      continuousDeployment: 0
    };

    // Side projects
    if (candidate.portfolioData && candidate.portfolioData.projects) {
      const projects = candidate.portfolioData.projects;
      const personalProjects = projects.filter(project => 
        project.type === 'personal' || project.type === 'side-project'
      );
      signals.sideProjects = Math.min(personalProjects.length / 5, 1);
    }

    // Open source contribution
    if (candidate.githubData) {
      const githubData = candidate.githubData;
      
      if (githubData.contributions) {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const recentContributions = githubData.contributions.filter(contribution => 
          new Date(contribution.date) > ninetyDaysAgo
        ).length;
        signals.openSourceContribution = Math.min(recentContributions / 50, 1);
      }

      if (githubData.repositories) {
        const ownedRepos = githubData.repositories.filter(repo => repo.isOwner);
        signals.sideProjects = Math.max(signals.sideProjects, Math.min(ownedRepos.length / 3, 1));
      }
    }

    // Rapid learning
    if (candidate.skills) {
      const skills = candidate.skills || [];
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const recentSkills = skills.filter(skill => 
        skill.acquiredDate && new Date(skill.acquiredDate) > ninetyDaysAgo
      );
      signals.rapidLearning = Math.min(recentSkills.length / 3, 1);
    }

    // Experimentation
    if (candidate.githubData && candidate.githubData.technologies) {
      const technologies = candidate.githubData.technologies;
      const experimentalTech = technologies.filter(tech => 
        tech.experimental || tech.emerging
      );
      signals.experimentation = Math.min(experimentalTech.length / 5, 1);
    }

    // Community involvement
    if (candidate.linkedinData) {
      const linkedinData = candidate.linkedinData;
      
      if (linkedinData.communityInvolvement) {
        signals.communityInvolvement = Math.min(linkedinData.communityInvolvement.length / 3, 1);
      }
    }

    return signals;
  }

  async analyzePersonalitySignals(candidate) {
    const signals = {
      autonomyPreference: 0,
      innovationDrive: 0,
      riskTaking: 0,
      learningOrientation: 0,
      collaborationStyle: 0,
      leadershipStyle: 0
    };

    // Analyze from profile and summary
    if (candidate.summary) {
      const summary = candidate.summary.toLowerCase();
      
      // Autonomy preference
      const autonomyKeywords = ['autonomous', 'independent', 'self-starter', 'proactive', 'initiative'];
      const autonomyCount = autonomyKeywords.filter(keyword => summary.includes(keyword)).length;
      signals.autonomyPreference = Math.min(autonomyCount / autonomyKeywords.length, 1);

      // Innovation drive
      const innovationKeywords = ['innovate', 'creative', 'breakthrough', 'disrupt', 'pioneer'];
      const innovationCount = innovationKeywords.filter(keyword => summary.includes(keyword)).length;
      signals.innovationDrive = Math.min(innovationCount / innovationKeywords.length, 1);

      // Risk taking
      const riskKeywords = ['risk', 'challenge', 'adventure', 'bold', 'courageous'];
      const riskCount = riskKeywords.filter(keyword => summary.includes(keyword)).length;
      signals.riskTaking = Math.min(riskCount / riskKeywords.length, 1);

      // Learning orientation
      const learningKeywords = ['learn', 'curious', 'explore', 'discover', 'grow'];
      const learningCount = learningKeywords.filter(keyword => summary.includes(keyword)).length;
      signals.learningOrientation = Math.min(learningCount / learningKeywords.length, 1);
    }

    // Analyze from experience descriptions
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const descriptions = experiences.map(exp => exp.description || '').join(' ').toLowerCase();
      
      // Collaboration style
      const collaborativeKeywords = ['team', 'collaborate', 'partner', 'together', 'collective'];
      const collaborativeCount = collaborativeKeywords.filter(keyword => descriptions.includes(keyword)).length;
      signals.collaborationStyle = Math.min(collaborativeCount / collaborativeKeywords.length, 1);

      // Leadership style
      const leadershipKeywords = ['lead', 'mentor', 'guide', 'inspire', 'motivate'];
      const leadershipCount = leadershipKeywords.filter(keyword => descriptions.includes(keyword)).length;
      signals.leadershipStyle = Math.min(leadershipCount / leadershipKeywords.length, 1);
    }

    return signals;
  }

  async analyzeRiskSignals(candidate) {
    const signals = {
      financialRiskTolerance: 0,
      careerRiskTolerance: 0,
      stabilityPreference: 0,
      securityNeed: 0,
      growthTolerance: 0,
      uncertaintyComfort: 0
    };

    // Job stability patterns
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const jobDurations = [];
      
      experiences.forEach(exp => {
        if (exp.startDate && exp.endDate) {
          const duration = (new Date(exp.endDate) - new Date(exp.startDate)) / (365 * 24 * 60 * 60 * 1000);
          jobDurations.push(duration);
        }
      });

      if (jobDurations.length > 0) {
        const avgDuration = jobDurations.reduce((sum, duration) => sum + duration, 0) / jobDurations.length;
        
        // Shorter average duration indicates higher risk tolerance
        signals.careerRiskTolerance = avgDuration < 2 ? 0.8 : avgDuration < 4 ? 0.5 : 0.2;
        signals.stabilityPreference = 1 - signals.careerRiskTolerance;
      }

      // Company size preferences
      const companySizes = experiences.map(exp => exp.companySize).filter(Boolean);
      const startupCount = companySizes.filter(size => 
        size.toLowerCase().includes('startup') || size.toLowerCase().includes('small')
      ).length;
      
      signals.growthTolerance = Math.min(startupCount / experiences.length, 1);
    }

    // Compensation preferences
    if (candidate.salaryExpectation || candidate.compensationPreferences) {
      const preferences = candidate.compensationPreferences || {};
      
      if (preferences.equity === 'high' || preferences.equity === 'very-high') {
        signals.financialRiskTolerance = 0.8;
      } else if (preferences.equity === 'medium') {
        signals.financialRiskTolerance = 0.5;
      } else {
        signals.financialRiskTolerance = 0.2;
      }
      
      signals.securityNeed = 1 - signals.financialRiskTolerance;
    }

    // Uncertainty comfort (from summary and preferences)
    if (candidate.summary) {
      const summary = candidate.summary.toLowerCase();
      const uncertaintyKeywords = ['uncertain', 'ambiguous', 'flexible', 'adaptable', 'dynamic'];
      const uncertaintyCount = uncertaintyKeywords.filter(keyword => summary.includes(keyword)).length;
      signals.uncertaintyComfort = Math.min(uncertaintyCount / uncertaintyKeywords.length, 1);
    }

    return signals;
  }

  calculateExperienceScore(signals) {
    return (
      signals.startupExperience * 0.25 +
      signals.earlyStageExperience * 0.2 +
      signals.companySizeVariety * 0.15 +
      signals.roleBreadth * 0.15 +
      signals.foundingExperience * 0.15 +
      signals.growthExperience * 0.1
    );
  }

  calculateSkillScore(signals) {
    return (
      signals.fullStackSkills * 0.2 +
      signals.modernTechStack * 0.2 +
      signals.devOpsSkills * 0.15 +
      signals.productSkills * 0.15 +
      signals.rapidDevelopment * 0.15 +
      signals.adaptabilityScore * 0.15
    );
  }

  calculateActivityScore(signals) {
    return (
      signals.sideProjects * 0.2 +
      signals.openSourceContribution * 0.2 +
      signals.rapidLearning * 0.2 +
      signals.experimentation * 0.15 +
      signals.communityInvolvement * 0.15 +
      signals.continuousDeployment * 0.1
    );
  }

  calculatePersonalityScore(signals) {
    return (
      signals.autonomyPreference * 0.2 +
      signals.innovationDrive * 0.2 +
      signals.riskTaking * 0.15 +
      signals.learningOrientation * 0.2 +
      signals.collaborationStyle * 0.15 +
      signals.leadershipStyle * 0.1
    );
  }

  calculateRiskScore(signals) {
    return (
      signals.financialRiskTolerance * 0.25 +
      signals.careerRiskTolerance * 0.25 +
      (1 - signals.stabilityPreference) * 0.2 +
      (1 - signals.securityNeed) * 0.15 +
      signals.growthTolerance * 0.1 +
      signals.uncertaintyComfort * 0.05
    );
  }

  calculateStartupAffinity(scores) {
    return (
      scores.experienceScore * this.weights.experienceSignals +
      scores.skillScore * this.weights.skillSignals +
      scores.activityScore * this.weights.activitySignals +
      scores.personalityScore * this.weights.personalitySignals +
      scores.riskScore * this.weights.riskSignals
    );
  }

  determineAffinityLevel(affinity) {
    if (affinity >= this.affinityThresholds.highAffinity) return 'high';
    if (affinity >= this.affinityThresholds.mediumAffinity) return 'medium';
    return 'low';
  }

  calculateConfidence(scores, experienceSignals) {
    // Higher confidence with more experience data
    let baseConfidence = 0.5;
    
    if (experienceSignals.startupExperience > 0) {
      baseConfidence = 0.7;
    }
    
    if (experienceSignals.companySizeVariety > 0) {
      baseConfidence += 0.1;
    }

    // Adjust based on score consistency
    const scoreVariance = this.calculateVariance([
      scores.experienceScore,
      scores.skillScore,
      scores.activityScore,
      scores.personalityScore,
      scores.riskScore
    ]);
    
    const consistencyBonus = Math.max(0, 1 - scoreVariance);
    
    return Math.min(baseConfidence + consistencyBonus * 0.2, 1);
  }

  predictProductEngineeringAffinity(skillSignals, experienceSignals) {
    const productScore = (skillSignals.productSkills + skillSignals.fullStackSkills) / 2;
    const experienceScore = (experienceSignals.roleBreadth + experienceSignals.growthExperience) / 2;
    
    const affinity = (productScore + experienceScore) / 2;
    
    if (affinity > 0.7) return 'high';
    if (affinity > 0.4) return 'medium';
    return 'low';
  }

  predictFastGrowthAlignment(experienceSignals, personalitySignals) {
    const growthScore = (experienceSignals.growthExperience + experienceSignals.earlyStageExperience) / 2;
    const personalityScore = (personalitySignals.autonomyPreference + personalitySignals.innovationDrive) / 2;
    
    const alignment = (growthScore + personalityScore) / 2;
    
    if (alignment > 0.7) return 'high';
    if (alignment > 0.4) return 'medium';
    return 'low';
  }

  predictRiskTolerance(riskSignals, experienceSignals) {
    const riskScore = (riskSignals.financialRiskTolerance + riskSignals.careerRiskTolerance) / 2;
    const experienceScore = experienceSignals.startupExperience;
    
    const tolerance = (riskScore + experienceScore) / 2;
    
    if (tolerance > 0.7) return 'high';
    if (tolerance > 0.4) return 'medium';
    return 'low';
  }

  predictStagePreference(experienceSignals, skillSignals) {
    const earlyStageScore = experienceSignals.earlyStageExperience;
    const skillScore = skillSignals.adaptabilityScore;
    
    const preference = (earlyStageScore + skillScore) / 2;
    
    if (preference > 0.7) return 'early_stage';
    if (preference > 0.4) return 'growth_stage';
    return 'late_stage';
  }

  predictEquityVsSalaryPreference(riskSignals, experienceSignals) {
    const riskScore = riskSignals.financialRiskTolerance;
    const experienceScore = experienceSignals.startupExperience;
    
    const preference = (riskScore + experienceScore) / 2;
    
    if (preference > 0.7) return 'equity_focused';
    if (preference > 0.4) return 'balanced';
    return 'salary_focused';
  }

  predictTeamSizePreference(personalitySignals, experienceSignals) {
    const autonomyScore = personalitySignals.autonomyPreference;
    const breadthScore = experienceSignals.roleBreadth;
    
    const preference = (autonomyScore + breadthScore) / 2;
    
    if (preference > 0.7) return 'small_team';
    if (preference > 0.4) return 'medium_team';
    return 'large_team';
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
    
    return Math.sqrt(avgSquaredDiff);
  }

  assessDataQuality(candidate) {
    let qualityScore = 0;
    let totalChecks = 0;

    // Check experience data
    if (candidate.experience && candidate.experience.length > 0) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check skills data
    if (candidate.skills && candidate.skills.length > 0) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check activity data
    if (candidate.githubData || candidate.portfolioData) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check personality data
    if (candidate.summary) {
      qualityScore += 1;
      totalChecks++;
    }

    return totalChecks > 0 ? qualityScore / totalChecks : 0;
  }

  async batchPredictStartupAffinity(candidateIds) {
    const predictions = [];
    
    for (const candidateId of candidateIds) {
      try {
        const prediction = await this.predictStartupAffinity(candidateId);
        predictions.push(prediction);
      } catch (error) {
        console.error(`Error predicting for candidate ${candidateId}:`, error);
        predictions.push({
          candidateId,
          error: error.message,
          startupAffinityScore: 0,
          confidence: 0
        });
      }
    }
    
    return predictions;
  }

  async updateTalentSignal(candidateId, prediction) {
    try {
      await TalentSignal.findOneAndUpdate(
        { candidateId },
        {
          candidateId,
          startupAffinityScore: prediction.startupAffinityScore,
          predictionMetadata: {
            startupAffinity: {
              score: prediction.startupAffinityScore,
              confidence: prediction.confidence,
              level: prediction.affinityLevel,
              predictions: prediction.predictions,
              signals: prediction.signals,
              metadata: prediction.metadata
            }
          },
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('Error updating talent signal:', error);
      throw error;
    }
  }
}

export const startupAffinityService = new StartupAffinityService();
export default startupAffinityService;
