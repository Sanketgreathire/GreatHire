import mongoose from "mongoose";

const talentSignalSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SourcingCandidate',
    required: true
  },
  openToWorkScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  recruiterResponseScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  startupAffinityScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  leadershipScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  opportunityScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  sourcingPriorityScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  recruiterTargetingScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  talentMomentumScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  predictionMetadata: {
    openToWork: {
      score: Number,
      confidence: Number,
      level: String,
      predictions: {
        likelyJobSeeker: Boolean,
        passiveCandidateOpenness: Boolean,
        recruiterEngagementProbability: Number,
        candidateAvailabilityScore: Number,
        bestContactTime: String,
        preferredCommunication: String,
        jobSearchIntensity: String
      },
      signals: {
        activity: {
          githubActivity: Number,
          portfolioUpdates: Number,
          resumeChanges: Number,
          profileModifications: Number,
          recruiterInteractions: Number
        },
        career: {
          jobStability: Number,
          careerProgression: Number,
          recentPromotion: Number,
          companyChanges: Number,
          skillUpdates: Number
        },
        profile: {
          profileCompleteness: Number,
          summaryKeywords: Number,
          locationFlexibility: Number,
          salaryExpectation: Number,
          jobPreferences: Number
        },
        engagement: {
          linkedinActivity: Number,
          networkGrowth: Number,
          contentSharing: Number,
          groupParticipation: Number,
          profileViews: Number
        },
        freshness: {
          activityScore: Number,
          freshnessScore: Number,
          lastActivityDays: Number,
          engagementTrend: Number
        }
      },
      metadata: {
        modelVersion: String,
        timestamp: Date,
        dataQuality: Number
      }
    },
    recruiterResponse: {
      score: Number,
      confidence: Number,
      likelihood: String,
      predictions: {
        outreachResponseProbability: Number,
        recruiterEngagementLikelihood: String,
        candidateResponsivenessScore: Number,
        bestOutreachChannel: String,
        optimalOutreachTime: String,
        expectedResponseTime: Number,
        followUpStrategy: String,
        personalizationApproach: String
      },
      signals: {
        engagement: {
          responseRate: Number,
          averageResponseTime: Number,
          positiveResponseRatio: Number,
          recentEngagement: Number,
          outreachFrequency: Number
        },
        profile: {
          profileCompleteness: Number,
          professionalNetwork: Number,
          industryKeywords: Number,
          opennessIndicators: Number,
          contactPreference: Number
        },
        activity: {
          linkedinActivity: Number,
          githubActivity: Number,
          portfolioActivity: Number,
          contentEngagement: Number,
          networkGrowth: Number
        },
        career: {
          jobStability: Number,
          careerProgression: Number,
          industryRelevance: Number,
          seniorityLevel: Number,
          transitionReadiness: Number
        },
        timing: {
          bestDayOfWeek: Number,
          bestTimeOfDay: Number,
          seasonalPreference: Number,
          responsePattern: Number,
          currentAvailability: Number
        }
      },
      metadata: {
        modelVersion: String,
        timestamp: Date,
        outreachContext: Object,
        dataQuality: Number
      }
    },
    careerTransition: {
      probability: Number,
      confidence: Number,
      likelihood: String,
      predictions: {
        likelyJobSwitchTiming: String,
        careerGrowthAcceleration: String,
        promotionProbability: String,
        industryTransitionPatterns: String,
        roleTransitionReadiness: String,
        compensationExpectation: String,
        locationFlexibility: String
      },
      signals: {
        career: {
          jobStability: Number,
          careerProgression: Number,
          companySize: Number,
          industryChanges: Number,
          roleComplexity: Number,
          leadershipExperience: Number
        },
        activity: {
          learningActivity: Number,
          networkingActivity: Number,
          jobSearchActivity: Number,
          skillDevelopment: Number,
          personalBranding: Number
        },
        market: {
          industryDemand: Number,
          skillDemand: Number,
          locationDemand: Number,
          compensationAlignment: Number,
          marketTrend: Number
        },
        skill: {
          skillRelevance: Number,
          skillGrowth: Number,
          certificationActivity: Number,
          technologyAdoption: Number,
          skillDiversity: Number
        },
        timing: {
          seasonalTiming: Number,
          economicTiming: Number,
          personalTiming: Number,
          careerTiming: Number,
          marketTiming: Number
        }
      },
      metadata: {
        modelVersion: String,
        timestamp: Date,
        dataQuality: Number
      }
    },
    startupAffinity: {
      score: Number,
      confidence: Number,
      level: String,
      predictions: {
        startupInterest: Boolean,
        enterprisePreference: Boolean,
        productEngineeringAffinity: String,
        fastGrowthCompanyAlignment: String,
        riskTolerance: String,
        stagePreference: String,
        equityVsSalaryPreference: String,
        teamSizePreference: String
      },
      signals: {
        experience: {
          startupExperience: Number,
          earlyStageExperience: Number,
          companySizeVariety: Number,
          roleBreadth: Number,
          foundingExperience: Number,
          growthExperience: Number
        },
        skill: {
          fullStackSkills: Number,
          modernTechStack: Number,
          devOpsSkills: Number,
          productSkills: Number,
          rapidDevelopment: Number,
          adaptabilityScore: Number
        },
        activity: {
          sideProjects: Number,
          openSourceContribution: Number,
          rapidLearning: Number,
          experimentation: Number,
          communityInvolvement: Number,
          continuousDeployment: Number
        },
        personality: {
          autonomyPreference: Number,
          innovationDrive: Number,
          riskTaking: Number,
          learningOrientation: Number,
          collaborationStyle: Number,
          leadershipStyle: Number
        },
        risk: {
          financialRiskTolerance: Number,
          careerRiskTolerance: Number,
          stabilityPreference: Number,
          securityNeed: Number,
          growthTolerance: Number,
          uncertaintyComfort: Number
        }
      },
      metadata: {
        modelVersion: String,
        timestamp: Date,
        dataQuality: Number
      }
    },
    leadership: {
      score: Number,
      confidence: Number,
      level: String,
      predictions: {
        leadershipTrajectory: String,
        mentoringIndicators: String,
        engineeringOwnershipSignals: String,
        managementReadiness: String,
        leadershipStyle: String,
        teamSizeCapability: String,
        strategicThinking: String,
        peopleDevelopment: String
      },
      signals: {
        career: {
          leadershipRoles: Number,
          teamManagement: Number,
          projectLeadership: Number,
          mentorshipExperience: Number,
          crossFunctionalWork: Number,
          strategicInvolvement: Number,
          growthResponsibility: Number
        },
        skill: {
          technicalLeadership: Number,
          architectureSkills: Number,
          systemDesign: Number,
          strategicPlanning: Number,
          decisionMaking: Number,
          delegationSkills: Number,
          businessAcumen: Number
        },
        activity: {
          mentoringActivity: Number,
          knowledgeSharing: Number,
          communityLeadership: Number,
          teamBuilding: Number,
          processImprovement: Number,
          innovationActivity: Number,
          publicSpeaking: Number
        },
        communication: {
          presentationSkills: Number,
          writingClarity: Number,
          stakeholderCommunication: Number,
          conflictResolution: Number,
          influenceSkills: Number,
          listeningSkills: Number,
          feedbackSkills: Number
        },
        impact: {
          businessImpact: Number,
          teamImpact: Number,
          productImpact: Number,
          processImpact: Number,
          culturalImpact: Number,
          innovationImpact: Number,
          scaleImpact: Number
        }
      },
      metadata: {
        modelVersion: String,
        timestamp: Date,
        dataQuality: Number
      }
    },
    aggregated: {
      scores: {
        opportunityScore: Number,
        sourcingPriorityScore: Number,
        recruiterTargetingScore: Number,
        talentMomentumScore: Number
      },
      confidence: Number,
      insights: [{
        type: String,
        category: String,
        message: String,
        confidence: Number,
        actionable: Boolean
      }],
      recommendations: [{
        type: String,
        priority: String,
        action: String,
        message: String,
        timing: String,
        channel: String,
        roles: [String],
        stages: [String]
      }],
      individualPredictions: Object,
      metadata: {
        modelVersion: String,
        timestamp: Date,
        dataQuality: Number
      }
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingErrors: [{
    type: String,
    timestamp: Date
  }],
  qualityMetrics: {
    dataCompleteness: Number,
    signalStrength: Number,
    predictionReliability: Number,
    lastValidation: Date
  }
}, {
  timestamps: true,
  collection: 'talent_signals'
});

// Indexes for efficient querying
talentSignalSchema.index({ candidateId: 1 }, { unique: true });
talentSignalSchema.index({ openToWorkScore: -1 });
talentSignalSchema.index({ recruiterResponseScore: -1 });
talentSignalSchema.index({ startupAffinityScore: -1 });
talentSignalSchema.index({ leadershipScore: -1 });
talentSignalSchema.index({ opportunityScore: -1 });
talentSignalSchema.index({ sourcingPriorityScore: -1 });
talentSignalSchema.index({ recruiterTargetingScore: -1 });
talentSignalSchema.index({ talentMomentumScore: -1 });
talentSignalSchema.index({ lastUpdated: -1 });
talentSignalSchema.index({ processingStatus: 1 });
talentSignalSchema.index({ 'predictionMetadata.aggregated.confidence': -1 });

// Compound indexes for complex queries
talentSignalSchema.index({ openToWorkScore: -1, recruiterResponseScore: -1 });
talentSignalSchema.index({ leadershipScore: -1, startupAffinityScore: -1 });
talentSignalSchema.index({ opportunityScore: -1, sourcingPriorityScore: -1 });

talentSignalSchema.statics = {
  async findByCandidateId(candidateId) {
    return this.findOne({ candidateId });
  },

  async findHighOpportunityCandidates(limit = 50) {
    return this.find({ opportunityScore: { $gte: 0.75 } })
      .sort({ opportunityScore: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async findHighPriorityCandidates(limit = 50) {
    return this.find({ sourcingPriorityScore: { $gte: 0.75 } })
      .sort({ sourcingPriorityScore: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async findHighTargetingCandidates(limit = 50) {
    return this.find({ recruiterTargetingScore: { $gte: 0.75 } })
      .sort({ recruiterTargetingScore: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async findHighMomentumCandidates(limit = 50) {
    return this.find({ talentMomentumScore: { $gte: 0.75 } })
      .sort({ talentMomentumScore: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async findStartupCandidates(limit = 50) {
    return this.find({ 
      startupAffinityScore: { $gte: 0.7 },
      leadershipScore: { $gte: 0.6 }
    })
      .sort({ startupAffinityScore: -1, leadershipScore: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async findLeadershipCandidates(limit = 50) {
    return this.find({ leadershipScore: { $gte: 0.75 } })
      .sort({ leadershipScore: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async findOpenToWorkCandidates(limit = 50) {
    return this.find({ openToWorkScore: { $gte: 0.7 } })
      .sort({ openToWorkScore: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async findByScoreRange(scoreField, minScore, maxScore, limit = 50) {
    const query = {};
    query[scoreField] = { $gte: minScore, $lte: maxScore };
    
    return this.find(query)
      .sort({ [scoreField]: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async getScoreDistribution(scoreField) {
    const pipeline = [
      {
        $group: {
          _id: null,
          avg: { $avg: `$${scoreField}` },
          min: { $min: `$${scoreField}` },
          max: { $max: `$${scoreField}` },
          count: { $sum: 1 },
          high: { $sum: { $cond: [{ $gte: [`$${scoreField}`, 0.75] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $and: [{ $gte: [`$${scoreField}`, 0.5] }, { $lt: [`$${scoreField}`, 0.75] }] }, 1, 0] } },
          low: { $sum: { $cond: [{ $lt: [`$${scoreField}`, 0.5] }, 1, 0] } }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || { avg: 0, min: 0, max: 0, count: 0, high: 0, medium: 0, low: 0 };
  },

  async getTopCandidatesByMultipleScores(limit = 50) {
    return this.find({
      $or: [
        { opportunityScore: { $gte: 0.75 } },
        { sourcingPriorityScore: { $gte: 0.75 } },
        { recruiterTargetingScore: { $gte: 0.75 } },
        { talentMomentumScore: { $gte: 0.75 } }
      ]
    })
      .sort({ opportunityScore: -1, sourcingPriorityScore: -1, recruiterTargetingScore: -1, talentMomentumScore: -1 })
      .limit(limit)
      .populate('candidateId', 'name email location currentTitle');
  },

  async findStaleCandidates(daysThreshold = 30) {
    const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
    
    return this.find({
      lastUpdated: { $lt: thresholdDate }
    })
      .select('candidateId lastUpdated opportunityScore sourcingPriorityScore')
      .lean();
  },

  async getProcessingStats() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: '$processingStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  },

  async getQualityMetrics() {
    const pipeline = [
      {
        $group: {
          _id: null,
          avgDataCompleteness: { $avg: '$qualityMetrics.dataCompleteness' },
          avgSignalStrength: { $avg: '$qualityMetrics.signalStrength' },
          avgPredictionReliability: { $avg: '$qualityMetrics.predictionReliability' },
          totalCandidates: { $sum: 1 }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      avgDataCompleteness: 0,
      avgSignalStrength: 0,
      avgPredictionReliability: 0,
      totalCandidates: 0
    };
  },

  async updateQualityMetrics(candidateId, metrics) {
    return this.updateOne(
      { candidateId },
      {
        $set: {
          'qualityMetrics.dataCompleteness': metrics.dataCompleteness,
          'qualityMetrics.signalStrength': metrics.signalStrength,
          'qualityMetrics.predictionReliability': metrics.predictionReliability,
          'qualityMetrics.lastValidation': new Date()
        }
      }
    );
  },

  async markProcessing(candidateId, status, error = null) {
    const update = {
      $set: { processingStatus: status, lastUpdated: new Date() }
    };

    if (error) {
      update.$push = {
        processingErrors: {
          $each: [{ type: error, timestamp: new Date() }],
          $slice: -10 // Keep only last 10 errors
        }
      };
    }

    return this.updateOne({ candidateId }, update);
  },

  async bulkUpdateScores(updates) {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { candidateId: update.candidateId },
        update: {
          $set: {
            ...update.scores,
            lastUpdated: new Date()
          }
        }
      }
    }));

    return this.bulkWrite(bulkOps);
  }
};

talentSignalSchema.methods = {
  getTopScores() {
    const scores = {
      opportunity: this.opportunityScore,
      sourcingPriority: this.sourcingPriorityScore,
      recruiterTargeting: this.recruiterTargetingScore,
      talentMomentum: this.talentMomentumScore
    };

    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([name, score]) => ({ name, score }));
  },

  isHighOpportunity() {
    return this.opportunityScore >= 0.75;
  },

  isHighPriority() {
    return this.sourcingPriorityScore >= 0.75;
  },

  isHighTargeting() {
    return this.recruiterTargetingScore >= 0.75;
  },

  isHighMomentum() {
    return this.talentMomentumScore >= 0.75;
  },

  isPrimeCandidate() {
    return this.isHighOpportunity() && this.isHighTargeting();
  },

  isStartupCandidate() {
    return this.startupAffinityScore >= 0.7 && this.leadershipScore >= 0.6;
  },

  isLeadershipCandidate() {
    return this.leadershipScore >= 0.75;
  },

  isOpenToWork() {
    return this.openToWorkScore >= 0.7;
  },

  getInsightsByCategory(category) {
    if (!this.predictionMetadata.aggregated || !this.predictionMetadata.aggregated.insights) {
      return [];
    }

    return this.predictionMetadata.aggregated.insights.filter(insight => 
      insight.category === category
    );
  },

  getRecommendationsByType(type) {
    if (!this.predictionMetadata.aggregated || !this.predictionMetadata.aggregated.recommendations) {
      return [];
    }

    return this.predictionMetadata.aggregated.recommendations.filter(rec => 
      rec.type === type
    );
  },

  getActionableRecommendations() {
    if (!this.predictionMetadata.aggregated || !this.predictionMetadata.aggregated.recommendations) {
      return [];
    }

    return this.predictionMetadata.aggregated.recommendations.filter(rec => 
      rec.actionable !== false
    ).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
  },

  getOverallConfidence() {
    if (this.predictionMetadata.aggregated && this.predictionMetadata.aggregated.confidence) {
      return this.predictionMetadata.aggregated.confidence;
    }

    // Calculate average confidence from individual predictions
    const confidences = [];
    
    if (this.predictionMetadata.openToWork && this.predictionMetadata.openToWork.confidence) {
      confidences.push(this.predictionMetadata.openToWork.confidence);
    }
    
    if (this.predictionMetadata.recruiterResponse && this.predictionMetadata.recruiterResponse.confidence) {
      confidences.push(this.predictionMetadata.recruiterResponse.confidence);
    }
    
    if (this.predictionMetadata.careerTransition && this.predictionMetadata.careerTransition.confidence) {
      confidences.push(this.predictionMetadata.careerTransition.confidence);
    }
    
    if (this.predictionMetadata.startupAffinity && this.predictionMetadata.startupAffinity.confidence) {
      confidences.push(this.predictionMetadata.startupAffinity.confidence);
    }
    
    if (this.predictionMetadata.leadership && this.predictionMetadata.leadership.confidence) {
      confidences.push(this.predictionMetadata.leadership.confidence);
    }

    return confidences.length > 0 ? 
      confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length : 0;
  },

  getAge() {
    return Date.now() - new Date(this.lastUpdated).getTime();
  },

  isStale(daysThreshold = 30) {
    return this.getAge() > (daysThreshold * 24 * 60 * 60 * 1000);
  },

  async refresh() {
    // This would trigger a refresh of the talent signals
    // Implementation would depend on your worker system
    console.log(`Refreshing talent signals for candidate ${this.candidateId}`);
  }
};

export const TalentSignal = mongoose.model('TalentSignal', talentSignalSchema);
export default TalentSignal;
