import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { TalentSignal } from "../../../models/talentSignal.model.js";

export class LeadershipPotentialService {
  constructor() {
    this.weights = {
      careerSignals: 0.3,
      skillSignals: 0.25,
      activitySignals: 0.2,
      communicationSignals: 0.15,
      impactSignals: 0.1
    };
    
    this.leadershipThresholds = {
      highPotential: 0.75,
      mediumPotential: 0.5,
      lowPotential: 0.25
    };
  }

  async predictLeadershipPotential(candidateId) {
    try {
      const candidate = await SourcingCandidate.findById(candidateId);
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      const existingSignal = await TalentSignal.findOne({ candidateId });

      // Analyze different signal categories
      const careerSignals = await this.analyzeCareerSignals(candidate);
      const skillSignals = await this.analyzeSkillSignals(candidate);
      const activitySignals = await this.analyzeActivitySignals(candidate);
      const communicationSignals = await this.analyzeCommunicationSignals(candidate);
      const impactSignals = await this.analyzeImpactSignals(candidate);

      // Calculate weighted scores
      const scores = {
        careerScore: this.calculateCareerScore(careerSignals),
        skillScore: this.calculateSkillScore(skillSignals),
        activityScore: this.calculateActivityScore(activitySignals),
        communicationScore: this.calculateCommunicationScore(communicationSignals),
        impactScore: this.calculateImpactScore(impactSignals)
      };

      // Calculate overall leadership potential
      const leadershipPotential = this.calculateLeadershipPotential(scores);
      
      // Determine potential level
      const potentialLevel = this.determinePotentialLevel(leadershipPotential);
      
      // Calculate confidence
      const confidence = this.calculateConfidence(scores, careerSignals);

      // Generate predictions
      const predictions = {
        leadershipTrajectory: this.predictLeadershipTrajectory(leadershipPotential, careerSignals),
        mentoringIndicators: this.predictMentoringIndicators(activitySignals, communicationSignals),
        engineeringOwnershipSignals: this.predictEngineeringOwnershipSignals(skillSignals, activitySignals),
        managementReadiness: this.predictManagementReadiness(careerSignals, skillSignals),
        leadershipStyle: this.predictLeadershipStyle(communicationSignals, activitySignals),
        teamSizeCapability: this.predictTeamSizeCapability(careerSignals, impactSignals),
        strategicThinking: this.predictStrategicThinking(careerSignals, impactSignals),
        peopleDevelopment: this.predictPeopleDevelopment(activitySignals, communicationSignals)
      };

      return {
        candidateId,
        leadershipScore: Math.round(leadershipPotential * 100) / 100,
        potentialLevel,
        confidence: Math.round(confidence * 100) / 100,
        scores,
        signals: {
          career: careerSignals,
          skill: skillSignals,
          activity: activitySignals,
          communication: communicationSignals,
          impact: impactSignals
        },
        predictions,
        metadata: {
          modelVersion: '1.0',
          timestamp: new Date(),
          dataQuality: this.assessDataQuality(candidate)
        }
      };

    } catch (error) {
      console.error('Error predicting leadership potential:', error);
      throw error;
    }
  }

  async analyzeCareerSignals(candidate) {
    const signals = {
      leadershipRoles: 0,
      teamManagement: 0,
      projectLeadership: 0,
      mentorshipExperience: 0,
      crossFunctionalWork: 0,
      strategicInvolvement: 0,
      growthResponsibility: 0
    };

    if (candidate.experience) {
      const experiences = candidate.experience || [];
      
      // Leadership roles
      const leadershipTitles = experiences.filter(exp => {
        const title = (exp.title || '').toLowerCase();
        const leadershipKeywords = ['lead', 'manager', 'director', 'head', 'chief', 'vp', 'principal'];
        return leadershipKeywords.some(keyword => title.includes(keyword));
      });
      signals.leadershipRoles = Math.min(leadershipTitles.length / experiences.length, 1);

      // Team management
      const managementRoles = experiences.filter(exp => {
        const title = (exp.title || '').toLowerCase();
        const managementKeywords = ['manager', 'director', 'head', 'lead'];
        return managementKeywords.some(keyword => title.includes(keyword));
      });
      signals.teamManagement = Math.min(managementRoles.length / experiences.length, 1);

      // Project leadership
      const projectLeaders = experiences.filter(exp => {
        const description = (exp.description || '').toLowerCase();
        const responsibilities = (exp.responsibilities || []).join(' ').toLowerCase();
        const text = description + ' ' + responsibilities;
        
        const projectKeywords = ['led', 'managed', 'coordinated', 'oversaw', 'directed'];
        return projectKeywords.some(keyword => text.includes(keyword));
      });
      signals.projectLeadership = Math.min(projectLeaders.length / experiences.length, 1);

      // Mentorship experience
      const mentorshipRoles = experiences.filter(exp => {
        const description = (exp.description || '').toLowerCase();
        const responsibilities = (exp.responsibilities || []).join(' ').toLowerCase();
        const text = description + ' ' + responsibilities;
        
        const mentorshipKeywords = ['mentor', 'coach', 'guide', 'train', 'develop', 'advise'];
        return mentorshipKeywords.some(keyword => text.includes(keyword));
      });
      signals.mentorshipExperience = Math.min(mentorshipRoles.length / experiences.length, 1);

      // Cross-functional work
      const crossFunctionalRoles = experiences.filter(exp => {
        const description = (exp.description || '').toLowerCase();
        const responsibilities = (exp.responsibilities || []).join(' ').toLowerCase();
        const text = description + ' ' + responsibilities;
        
        const crossFunctionalKeywords = ['cross-functional', 'multi-team', 'collaborate', 'coordinate', 'liaise'];
        return crossFunctionalKeywords.some(keyword => text.includes(keyword));
      });
      signals.crossFunctionalWork = Math.min(crossFunctionalRoles.length / experiences.length, 1);

      // Strategic involvement
      const strategicRoles = experiences.filter(exp => {
        const description = (exp.description || '').toLowerCase();
        const responsibilities = (exp.responsibilities || []).join(' ').toLowerCase();
        const text = description + ' ' + responsibilities;
        
        const strategicKeywords = ['strategy', 'strategic', 'vision', 'planning', 'roadmap'];
        return strategicKeywords.some(keyword => text.includes(keyword));
      });
      signals.strategicInvolvement = Math.min(strategicRoles.length / experiences.length, 1);

      // Growth responsibility
      const growthRoles = experiences.filter(exp => {
        const description = (exp.description || '').toLowerCase();
        const responsibilities = (exp.responsibilities || []).join(' ').toLowerCase();
        const text = description + ' ' + responsibilities;
        
        const growthKeywords = ['grow', 'scale', 'build', 'establish', 'develop team'];
        return growthKeywords.some(keyword => text.includes(keyword));
      });
      signals.growthResponsibility = Math.min(growthRoles.length / experiences.length, 1);
    }

    return signals;
  }

  async analyzeSkillSignals(candidate) {
    const signals = {
      technicalLeadership: 0,
      architectureSkills: 0,
      systemDesign: 0,
      strategicPlanning: 0,
      decisionMaking: 0,
      delegationSkills: 0,
      businessAcumen: 0
    };

    if (candidate.skills) {
      const skills = candidate.skills || [];
      const skillNames = skills.map(skill => skill.name).map(name => name.toLowerCase());

      // Technical leadership skills
      const techLeadershipSkills = ['architecture', 'system design', 'technical leadership', 'tech lead', 'staff engineer'];
      const techLeadershipCount = techLeadershipSkills.filter(skill => 
        skillNames.some(candidateSkill => candidateSkill.includes(skill))
      ).length;
      signals.technicalLeadership = Math.min(techLeadershipCount / techLeadershipSkills.length, 1);

      // Architecture skills
      const architectureSkills = ['architecture', 'system architecture', 'software architecture', 'cloud architecture'];
      const architectureCount = architectureSkills.filter(skill => 
        skillNames.some(candidateSkill => candidateSkill.includes(skill))
      ).length;
      signals.architectureSkills = Math.min(architectureCount / architectureSkills.length, 1);

      // System design
      const systemDesignSkills = ['system design', 'scalability', 'performance', 'distributed systems'];
      const systemDesignCount = systemDesignSkills.filter(skill => 
        skillNames.some(candidateSkill => candidateSkill.includes(skill))
      ).length;
      signals.systemDesign = Math.min(systemDesignCount / systemDesignSkills.length, 1);

      // Strategic planning
      const planningSkills = ['strategic planning', 'roadmap', 'planning', 'strategy'];
      const planningCount = planningSkills.filter(skill => 
        skillNames.some(candidateSkill => candidateSkill.includes(skill))
      ).length;
      signals.strategicPlanning = Math.min(planningCount / planningSkills.length, 1);

      // Decision making
      const decisionSkills = ['decision making', 'problem solving', 'critical thinking', 'analysis'];
      const decisionCount = decisionSkills.filter(skill => 
        skillNames.some(candidateSkill => candidateSkill.includes(skill))
      ).length;
      signals.decisionMaking = Math.min(decisionCount / decisionSkills.length, 1);

      // Delegation skills
      const delegationSkills = ['delegation', 'team management', 'people management', 'leadership'];
      const delegationCount = delegationSkills.filter(skill => 
        skillNames.some(candidateSkill => candidateSkill.includes(skill))
      ).length;
      signals.delegationSkills = Math.min(delegationCount / delegationSkills.length, 1);

      // Business acumen
      const businessSkills = ['business', 'product', 'strategy', 'finance', 'marketing'];
      const businessCount = businessSkills.filter(skill => 
        skillNames.some(candidateSkill => candidateSkill.includes(skill))
      ).length;
      signals.businessAcumen = Math.min(businessCount / businessSkills.length, 1);
    }

    return signals;
  }

  async analyzeActivitySignals(candidate) {
    const signals = {
      mentoringActivity: 0,
      knowledgeSharing: 0,
      communityLeadership: 0,
      teamBuilding: 0,
      processImprovement: 0,
      innovationActivity: 0,
      publicSpeaking: 0
    };

    // Mentoring activity
    if (candidate.githubData) {
      const githubData = candidate.githubData;
      
      if (githubData.mentorship) {
        signals.mentoringActivity = Math.min(githubData.mentorship.length / 5, 1);
      }

      // Code reviews as mentoring
      if (githubData.codeReviews) {
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const recentReviews = githubData.codeReviews.filter(review => 
          new Date(review.date) > ninetyDaysAgo
        ).length;
        signals.knowledgeSharing = Math.min(recentReviews / 20, 1);
      }
    }

    // Knowledge sharing
    if (candidate.linkedinData) {
      const linkedinData = candidate.linkedinData;
      
      if (linkedinData.articles) {
        signals.knowledgeSharing = Math.min(linkedinData.articles.length / 3, 1);
      }

      if (linkedinData.speakingEngagements) {
        signals.publicSpeaking = Math.min(linkedinData.speakingEngagements.length / 3, 1);
      }
    }

    // Community leadership
    if (candidate.communityInvolvement) {
      const leadershipRoles = candidate.communityInvolvement.filter(activity => 
        activity.role === 'leader' || activity.role === 'organizer' || activity.role === 'moderator'
      );
      signals.communityLeadership = Math.min(leadershipRoles.length / 3, 1);
    }

    // Team building (from experience descriptions)
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const descriptions = experiences.map(exp => exp.description || '').join(' ').toLowerCase();
      
      const teamBuildingKeywords = ['team building', 'team culture', 'collaboration', 'team development'];
      const teamBuildingCount = teamBuildingKeywords.filter(keyword => descriptions.includes(keyword)).length;
      signals.teamBuilding = Math.min(teamBuildingCount / teamBuildingKeywords.length, 1);
    }

    // Process improvement
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const descriptions = experiences.map(exp => exp.description || '').join(' ').toLowerCase();
      
      const processKeywords = ['process improvement', 'optimize', 'efficiency', 'streamline', 'improve'];
      const processCount = processKeywords.filter(keyword => descriptions.includes(keyword)).length;
      signals.processImprovement = Math.min(processCount / processKeywords.length, 1);
    }

    // Innovation activity
    if (candidate.portfolioData && candidate.portfolioData.projects) {
      const projects = candidate.portfolioData.projects;
      const innovativeProjects = projects.filter(project => 
        project.innovation || project.breakthrough || project.novel
      );
      signals.innovationActivity = Math.min(innovativeProjects.length / projects.length, 1);
    }

    return signals;
  }

  async analyzeCommunicationSignals(candidate) {
    const signals = {
      presentationSkills: 0,
      writingClarity: 0,
      stakeholderCommunication: 0,
      conflictResolution: 0,
      influenceSkills: 0,
      listeningSkills: 0,
      feedbackSkills: 0
    };

    // Analyze from summary and descriptions
    if (candidate.summary) {
      const summary = candidate.summary.toLowerCase();
      
      // Presentation skills
      const presentationKeywords = ['present', 'speak', 'communicate', 'articulate', 'explain'];
      const presentationCount = presentationKeywords.filter(keyword => summary.includes(keyword)).length;
      signals.presentationSkills = Math.min(presentationCount / presentationKeywords.length, 1);

      // Writing clarity
      const writingKeywords = ['write', 'document', 'communicate', 'clear', 'concise'];
      const writingCount = writingKeywords.filter(keyword => summary.includes(keyword)).length;
      signals.writingClarity = Math.min(writingCount / writingKeywords.length, 1);
    }

    // Analyze from experience descriptions
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const descriptions = experiences.map(exp => exp.description || '').join(' ').toLowerCase();
      const responsibilities = experiences.map(exp => (exp.responsibilities || []).join(' ')).toLowerCase();
      const text = descriptions + ' ' + responsibilities;
      
      // Stakeholder communication
      const stakeholderKeywords = ['stakeholder', 'client', 'customer', 'business', 'management'];
      const stakeholderCount = stakeholderKeywords.filter(keyword => text.includes(keyword)).length;
      signals.stakeholderCommunication = Math.min(stakeholderCount / stakeholderKeywords.length, 1);

      // Conflict resolution
      const conflictKeywords = ['conflict', 'resolve', 'mediate', 'negotiate', 'facilitate'];
      const conflictCount = conflictKeywords.filter(keyword => text.includes(keyword)).length;
      signals.conflictResolution = Math.min(conflictCount / conflictKeywords.length, 1);

      // Influence skills
      const influenceKeywords = ['influence', 'persuade', 'convince', 'advocate', 'champion'];
      const influenceCount = influenceKeywords.filter(keyword => text.includes(keyword)).length;
      signals.influenceSkills = Math.min(influenceCount / influenceKeywords.length, 1);

      // Feedback skills
      const feedbackKeywords = ['feedback', 'review', 'evaluate', 'assess', 'improve'];
      const feedbackCount = feedbackKeywords.filter(keyword => text.includes(keyword)).length;
      signals.feedbackSkills = Math.min(feedbackCount / feedbackKeywords.length, 1);
    }

    return signals;
  }

  async analyzeImpactSignals(candidate) {
    const signals = {
      businessImpact: 0,
      teamImpact: 0,
      productImpact: 0,
      processImpact: 0,
      culturalImpact: 0,
      innovationImpact: 0,
      scaleImpact: 0
    };

    // Business impact
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const descriptions = experiences.map(exp => exp.description || '').join(' ').toLowerCase();
      
      const businessKeywords = ['revenue', 'profit', 'cost', 'business', 'commercial', 'market'];
      const businessCount = businessKeywords.filter(keyword => descriptions.includes(keyword)).length;
      signals.businessImpact = Math.min(businessCount / businessKeywords.length, 1);
    }

    // Team impact
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const descriptions = experiences.map(exp => exp.description || '').join(' ').toLowerCase();
      
      const teamKeywords = ['team', 'grow', 'build', 'develop', 'mentor', 'lead'];
      const teamCount = teamKeywords.filter(keyword => descriptions.includes(keyword)).length;
      signals.teamImpact = Math.min(teamCount / teamKeywords.length, 1);
    }

    // Product impact
    if (candidate.portfolioData && candidate.portfolioData.projects) {
      const projects = candidate.portfolioData.projects;
      const impactfulProjects = projects.filter(project => 
        project.impact || project.users || project.revenue
      );
      signals.productImpact = Math.min(impactfulProjects.length / projects.length, 1);
    }

    // Process impact
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const descriptions = experiences.map(exp => exp.description || '').join(' ').toLowerCase();
      
      const processKeywords = ['process', 'workflow', 'efficiency', 'optimize', 'improve'];
      const processCount = processKeywords.filter(keyword => descriptions.includes(keyword)).length;
      signals.processImpact = Math.min(processCount / processKeywords.length, 1);
    }

    // Innovation impact
    if (candidate.githubData) {
      const githubData = candidate.githubData;
      
      if (githubData.innovations) {
        signals.innovationImpact = Math.min(githubData.innovations.length / 3, 1);
      }
    }

    // Scale impact
    if (candidate.experience) {
      const experiences = candidate.experience || [];
      const scaleExperiences = experiences.filter(exp => 
        exp.scale || exp.growth || exp.size
      );
      signals.scaleImpact = Math.min(scaleExperiences.length / experiences.length, 1);
    }

    return signals;
  }

  calculateCareerScore(signals) {
    return (
      signals.leadershipRoles * 0.2 +
      signals.teamManagement * 0.15 +
      signals.projectLeadership * 0.15 +
      signals.mentorshipExperience * 0.15 +
      signals.crossFunctionalWork * 0.1 +
      signals.strategicInvolvement * 0.15 +
      signals.growthResponsibility * 0.1
    );
  }

  calculateSkillScore(signals) {
    return (
      signals.technicalLeadership * 0.2 +
      signals.architectureSkills * 0.15 +
      signals.systemDesign * 0.15 +
      signals.strategicPlanning * 0.15 +
      signals.decisionMaking * 0.1 +
      signals.delegationSkills * 0.15 +
      signals.businessAcumen * 0.1
    );
  }

  calculateActivityScore(signals) {
    return (
      signals.mentoringActivity * 0.2 +
      signals.knowledgeSharing * 0.15 +
      signals.communityLeadership * 0.15 +
      signals.teamBuilding * 0.15 +
      signals.processImprovement * 0.15 +
      signals.innovationActivity * 0.1 +
      signals.publicSpeaking * 0.1
    );
  }

  calculateCommunicationScore(signals) {
    return (
      signals.presentationSkills * 0.15 +
      signals.writingClarity * 0.15 +
      signals.stakeholderCommunication * 0.2 +
      signals.conflictResolution * 0.15 +
      signals.influenceSkills * 0.15 +
      signals.listeningSkills * 0.1 +
      signals.feedbackSkills * 0.1
    );
  }

  calculateImpactScore(signals) {
    return (
      signals.businessImpact * 0.2 +
      signals.teamImpact * 0.15 +
      signals.productImpact * 0.15 +
      signals.processImpact * 0.15 +
      signals.culturalImpact * 0.1 +
      signals.innovationImpact * 0.15 +
      signals.scaleImpact * 0.1
    );
  }

  calculateLeadershipPotential(scores) {
    return (
      scores.careerScore * this.weights.careerSignals +
      scores.skillScore * this.weights.skillSignals +
      scores.activityScore * this.weights.activitySignals +
      scores.communicationScore * this.weights.communicationSignals +
      scores.impactScore * this.weights.impactSignals
    );
  }

  determinePotentialLevel(potential) {
    if (potential >= this.leadershipThresholds.highPotential) return 'high';
    if (potential >= this.leadershipThresholds.mediumPotential) return 'medium';
    return 'low';
  }

  calculateConfidence(scores, careerSignals) {
    // Higher confidence with more career leadership data
    let baseConfidence = 0.5;
    
    if (careerSignals.leadershipRoles > 0) {
      baseConfidence = 0.7;
    }
    
    if (careerSignals.teamManagement > 0) {
      baseConfidence += 0.1;
    }

    // Adjust based on score consistency
    const scoreVariance = this.calculateVariance([
      scores.careerScore,
      scores.skillScore,
      scores.activityScore,
      scores.communicationScore,
      scores.impactScore
    ]);
    
    const consistencyBonus = Math.max(0, 1 - scoreVariance);
    
    return Math.min(baseConfidence + consistencyBonus * 0.2, 1);
  }

  predictLeadershipTrajectory(leadershipPotential, careerSignals) {
    const trajectoryScore = (leadershipPotential + careerSignals.leadershipRoles) / 2;
    
    if (trajectoryScore > 0.8) return 'executive_track';
    if (trajectoryScore > 0.6) return 'senior_leadership';
    if (trajectoryScore > 0.4) return 'team_leadership';
    return 'individual_contributor';
  }

  predictMentoringIndicators(activitySignals, communicationSignals) {
    const mentoringScore = (activitySignals.mentoringActivity + activitySignals.knowledgeSharing) / 2;
    const communicationScore = communicationSignals.feedbackSkills;
    
    const indicators = (mentoringScore + communicationScore) / 2;
    
    if (indicators > 0.7) return 'strong_mentor';
    if (indicators > 0.4) return 'developing_mentor';
    return 'potential_mentor';
  }

  predictEngineeringOwnershipSignals(skillSignals, activitySignals) {
    const technicalScore = (skillSignals.technicalLeadership + skillSignals.architectureSkills) / 2;
    const activityScore = (activitySignals.processImprovement + activitySignals.innovationActivity) / 2;
    
    const ownership = (technicalScore + activityScore) / 2;
    
    if (ownership > 0.7) return 'high_ownership';
    if (ownership > 0.4) return 'moderate_ownership';
    return 'developing_ownership';
  }

  predictManagementReadiness(careerSignals, skillSignals) {
    const careerScore = (careerSignals.teamManagement + careerSignals.projectLeadership) / 2;
    const skillScore = (skillSignals.delegationSkills + skillSignals.strategicPlanning) / 2;
    
    const readiness = (careerScore + skillScore) / 2;
    
    if (readiness > 0.7) return 'management_ready';
    if (readiness > 0.4) return 'leadership_potential';
    return 'skill_building';
  }

  predictLeadershipStyle(communicationSignals, activitySignals) {
    const collaborativeScore = (communicationSignals.stakeholderCommunication + activitySignals.teamBuilding) / 2;
    const directiveScore = communicationSignals.influenceSkills;
    
    if (collaborativeScore > directiveScore) {
      return 'collaborative';
    } else if (directiveScore > 0.7) {
      return 'directive';
    } else {
      return 'adaptive';
    }
  }

  predictTeamSizeCapability(careerSignals, impactSignals) {
    const managementScore = careerSignals.teamManagement;
    const impactScore = (impactSignals.teamImpact + impactSignals.scaleImpact) / 2;
    
    const capability = (managementScore + impactScore) / 2;
    
    if (capability > 0.8) return 'large_team';
    if (capability > 0.5) return 'medium_team';
    return 'small_team';
  }

  predictStrategicThinking(careerSignals, impactSignals) {
    const strategicScore = careerSignals.strategicInvolvement;
    const businessScore = impactSignals.businessImpact;
    
    const thinking = (strategicScore + businessScore) / 2;
    
    if (thinking > 0.7) return 'strategic_thinker';
    if (thinking > 0.4) return 'tactical_thinker';
    return 'operational_thinker';
  }

  predictPeopleDevelopment(activitySignals, communicationSignals) {
    const mentoringScore = (activitySignals.mentoringActivity + activitySignals.knowledgeSharing) / 2;
    const communicationScore = (communicationSignals.feedbackSkills + communicationSignals.listeningSkills) / 2;
    
    const development = (mentoringScore + communicationScore) / 2;
    
    if (development > 0.7) return 'people_developer';
    if (development > 0.4) return 'team_builder';
    return 'individual_focus';
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
    if (candidate.githubData || candidate.linkedinData) {
      qualityScore += 1;
      totalChecks++;
    }

    // Check communication data
    if (candidate.summary) {
      qualityScore += 1;
      totalChecks++;
    }

    return totalChecks > 0 ? qualityScore / totalChecks : 0;
  }

  async batchPredictLeadershipPotential(candidateIds) {
    const predictions = [];
    
    for (const candidateId of candidateIds) {
      try {
        const prediction = await this.predictLeadershipPotential(candidateId);
        predictions.push(prediction);
      } catch (error) {
        console.error(`Error predicting for candidate ${candidateId}:`, error);
        predictions.push({
          candidateId,
          error: error.message,
          leadershipScore: 0,
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
          leadershipScore: prediction.leadershipScore,
          predictionMetadata: {
            leadership: {
              score: prediction.leadershipScore,
              confidence: prediction.confidence,
              level: prediction.potentialLevel,
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

export const leadershipPotentialService = new LeadershipPotentialService();
export default leadershipPotentialService;
