import mongoose from "mongoose";

const candidateIntelligenceSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SourcingCandidate",
    required: true,
    unique: true
  },
  inferredSkills: [{
    skill: {
      type: String,
      required: true,
      trim: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    source: {
      type: String,
      enum: ["text", "github", "semantic", "company", "experience", "ai"],
      default: "text"
    },
    inferredAt: {
      type: Date,
      default: Date.now
    }
  }],
  domainExpertise: [{
    domain: {
      type: String,
      required: true,
      trim: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    relatedSkills: [{
      type: String,
      trim: true
    }],
    experienceYears: {
      type: Number,
      default: 0
    }
  }],
  seniorityLevel: {
    type: String,
    enum: ["entry", "junior", "mid", "senior", "lead", "principal", "architect", "executive", "unknown"],
    default: "unknown"
  },
  seniorityConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  githubInsights: {
    username: String,
    profile: {
      login: String,
      name: String,
      bio: String,
      location: String,
      company: String,
      email: String,
      publicRepos: Number,
      followers: Number,
      following: Number,
      createdAt: Date
    },
    repositories: [{
      name: String,
      fullName: String,
      description: String,
      language: String,
      size: Number,
      stargazersCount: Number,
      forksCount: Number,
      openIssuesCount: Number,
      createdAt: Date,
      updatedAt: Date,
      isPrivate: Boolean,
      isFork: Boolean,
      topics: [String],
      license: String
    }],
    contributions: {
      contributionTypes: {
        type: Map,
        of: Number
      },
      recentActivity: [{
        type: String,
        repo: String,
        createdAt: Date
      }],
      totalEvents: Number,
      lastActivity: Date
    },
    insights: {
      technicalSkills: [String],
      languages: [{
        name: String,
        count: Number,
        percentage: String
      }],
      projectComplexity: {
        type: String,
        enum: ["low", "medium", "high", "unknown"],
        default: "unknown"
      },
      contributionPattern: {
        type: String,
        enum: ["active-developer", "project-creator", "collaborative-contributor", "solo-developer", "mixed-activity", "unknown"],
        default: "unknown"
      },
      activityLevel: {
        type: String,
        enum: ["very-active", "active", "moderate", "inactive", "unknown"],
        default: "unknown"
      },
      codeQuality: {
        type: String,
        enum: ["excellent", "good", "fair", "poor", "unknown"],
        default: "unknown"
      },
      innovationScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      consistencyScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      collaborationLevel: {
        type: String,
        enum: ["high", "medium", "low", "minimal", "unknown"],
        default: "unknown"
      },
      leadershipIndicators: [String],
      expertiseAreas: [String]
    },
    analyzedAt: Date
  },
  careerIntelligence: {
    seniorityLevel: {
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead", "principal", "architect", "executive", "unknown"],
      default: "unknown"
    },
    domainExpertise: [String],
    startupExperience: {
      level: {
        type: String,
        enum: ["none", "low", "medium", "high"],
        default: "none"
      },
      score: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      },
      indicators: [{
        category: String,
        indicator: String
      }],
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      }
    },
    leadershipSignals: {
      level: {
        type: String,
        enum: ["individual-contributor", "potential-leader", "team-lead", "senior-leader", "executive", "unknown"],
        default: "unknown"
      },
      score: {
        type: Number,
        min: 0,
        max: 20,
        default: 0
      },
      signals: [{
        category: String,
        signal: String,
        strength: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "low"
        }
      }],
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      }
    },
    careerTrajectory: {
      growthRate: {
        type: String,
        enum: ["entry", "developing", "growing", "established", "unknown"],
        default: "unknown"
      },
      skillProgression: {
        type: String,
        enum: ["foundational", "intermediate", "advanced", "unknown"],
        default: "unknown"
      },
      careerStability: {
        type: String,
        enum: ["early", "building", "moderate", "stable", "unknown"],
        default: "unknown"
      },
      mobilityPattern: {
        type: String,
        enum: ["stable", "moderate", "dynamic", "unknown"],
        default: "unknown"
      },
      futurePotential: {
        type: String,
        enum: ["moderate", "medium", "high", "unknown"],
        default: "unknown"
      }
    },
    compensationRange: {
      estimatedMin: Number,
      estimatedMax: Number,
      estimatedMid: Number,
      currency: {
        type: String,
        default: "USD"
      },
      factors: {
        experience: Number,
        seniority: String,
        skillsCount: Number,
        highValueSkillsCount: Number,
        startupLevel: String
      }
    },
    careerProgression: {
      currentStage: String,
      nextMilestone: String,
      timeToNextLevel: String,
      progressionSpeed: String,
      careerPath: String
    },
    industryFit: {
      primaryIndustry: String,
      secondaryIndustries: [String],
      fitScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      transferableSkills: [String],
      industryTrends: String
    }
  },
  candidateScores: {
    technicalScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    experienceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    leadershipScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    semanticQualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    sourcingRecommendationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    componentScores: {
      technicalScore: Number,
      experienceScore: Number,
      leadershipScore: Number,
      semanticQualityScore: Number
    },
    scoringMetadata: {
      aiUsed: {
        type: Boolean,
        default: false
      },
      scoredAt: {
        type: Date,
        default: Date.now
      },
      version: {
        type: String,
        default: "1.0"
      }
    }
  },
  enrichmentMetadata: {
    lastEnriched: {
      type: Date,
      default: Date.now
    },
    enrichedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    enrichmentVersion: {
      type: String,
      default: "1.0"
    },
    githubAnalyzed: {
      type: Boolean,
      default: false
    },
    skillsInferred: {
      type: Boolean,
      default: false
    },
    careerAnalyzed: {
      type: Boolean,
      default: false
    },
    scoringCompleted: {
      type: Boolean,
      default: false
    },
    processingTime: {
      type: Number,
      default: 0
    },
    aiUsed: {
      type: Boolean,
      default: false
    }
  },
  enrichmentHistory: [{
    enrichedAt: {
      type: Date,
      default: Date.now
    },
    enrichedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    version: String,
    components: {
      githubAnalysis: Boolean,
      skillInference: Boolean,
      careerIntelligence: Boolean,
      scoring: Boolean
    },
    changes: {
      newSkills: [String],
      updatedScores: {
        technicalScore: Number,
        experienceScore: Number,
        leadershipScore: Number,
        semanticQualityScore: Number,
        sourcingRecommendationScore: Number
      }
    },
    processingTime: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: Date
}, {
  timestamps: true,
  collection: "candidateintelligences"
});

candidateIntelligenceSchema.index({ candidateId: 1 }, { unique: true });
candidateIntelligenceSchema.index({ "enrichmentMetadata.lastEnriched": -1 });
candidateIntelligenceSchema.index({ "candidateScores.sourcingRecommendationScore": -1 });
candidateIntelligenceSchema.index({ "careerIntelligence.seniorityLevel": 1 });
candidateIntelligenceSchema.index({ "githubInsights.insights.projectComplexity": 1 });
candidateIntelligenceSchema.index({ "githubInsights.insights.activityLevel": 1 });
candidateIntelligenceSchema.index({ "careerIntelligence.industryFit.primaryIndustry": 1 });
candidateIntelligenceSchema.index({ "inferredSkills.skill": 1 });
candidateIntelligenceSchema.index({ "domainExpertise.domain": 1 });

candidateIntelligenceSchema.pre("save", function(next) {
  if (this.isModified("candidateScores")) {
    this.enrichmentMetadata.scoringCompleted = true;
  }
  
  if (this.isModified("githubInsights")) {
    this.enrichmentMetadata.githubAnalyzed = true;
  }
  
  if (this.isModified("inferredSkills") && this.inferredSkills.length > 0) {
    this.enrichmentMetadata.skillsInferred = true;
  }
  
  if (this.isModified("careerIntelligence")) {
    this.enrichmentMetadata.careerAnalyzed = true;
  }
  
  this.enrichmentMetadata.lastEnriched = new Date();
  
  next();
});

candidateIntelligenceSchema.methods.updateEnrichmentHistory = function(enrichedBy, changes = {}) {
  const historyEntry = {
    enrichedAt: new Date(),
    enrichedBy,
    version: this.enrichmentMetadata.enrichmentVersion,
    components: {
      githubAnalysis: this.enrichmentMetadata.githubAnalyzed,
      skillInference: this.enrichmentMetadata.skillsInferred,
      careerIntelligence: this.enrichmentMetadata.careerAnalyzed,
      scoring: this.enrichmentMetadata.scoringCompleted
    },
    changes,
    processingTime: this.enrichmentMetadata.processingTime
  };
  
  this.enrichmentHistory.push(historyEntry);
  
  if (this.enrichmentHistory.length > 50) {
    this.enrichmentHistory = this.enrichmentHistory.slice(-30);
  }
  
  return this.save();
};

candidateIntelligenceSchema.methods.getTopSkills = function(limit = 10) {
  return this.inferredSkills
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit)
    .map(skill => skill.skill);
};

candidateIntelligenceSchema.methods.getTopDomains = function(limit = 5) {
  return this.domainExpertise
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit)
    .map(domain => domain.domain);
};

candidateIntelligenceSchema.methods.getOverallScore = function() {
  return this.candidateScores?.sourcingRecommendationScore || 0;
};

candidateIntelligenceSchema.methods.isHighlyRecommended = function() {
  return this.getOverallScore() >= 80;
};

candidateIntelligenceSchema.methods.isRecommended = function() {
  return this.getOverallScore() >= 60;
};

candidateIntelligenceSchema.methods.getEnrichmentCompleteness = function() {
  const components = [
    this.enrichmentMetadata.githubAnalyzed,
    this.enrichmentMetadata.skillsInferred,
    this.enrichmentMetadata.careerAnalyzed,
    this.enrichmentMetadata.scoringCompleted
  ];
  
  return (components.filter(Boolean).length / components.length) * 100;
};

candidateIntelligenceSchema.methods.archive = function() {
  this.isActive = false;
  this.archivedAt = new Date();
  return this.save();
};

candidateIntelligenceSchema.statics.getTopCandidates = async function(limit = 20, filters = {}) {
  const query = { isActive: true };
  
  if (filters.minScore) {
    query["candidateScores.sourcingRecommendationScore"] = { $gte: filters.minScore };
  }
  
  if (filters.seniorityLevel) {
    query["careerIntelligence.seniorityLevel"] = filters.seniorityLevel;
  }
  
  if (filters.domain) {
    query["domainExpertise.domain"] = filters.domain;
  }
  
  if (filters.githubActivity) {
    query["githubInsights.insights.activityLevel"] = filters.githubActivity;
  }

  return this.find(query)
    .populate('candidateId', 'fullName email currentCompany location skills')
    .populate('enrichmentMetadata.enrichedBy', 'fullName email')
    .sort({ "candidateScores.sourcingRecommendationScore": -1 })
    .limit(limit)
    .lean();
};

candidateIntelligenceSchema.statics.getEnrichmentStats = async function(timeRange = '30d') {
  const now = new Date();
  let startDate;
  
  switch (timeRange) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const stats = await this.aggregate([
    {
      $match: {
        "enrichmentMetadata.lastEnriched": { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalEnriched: { $sum: 1 },
        avgTechnicalScore: { $avg: "$candidateScores.technicalScore" },
        avgExperienceScore: { $avg: "$candidateScores.experienceScore" },
        avgLeadershipScore: { $avg: "$candidateScores.leadershipScore" },
        avgSemanticQualityScore: { $avg: "$candidateScores.semanticQualityScore" },
        avgRecommendationScore: { $avg: "$candidateScores.sourcingRecommendationScore" },
        githubAnalyzed: { $sum: { $cond: ["$enrichmentMetadata.githubAnalyzed", 1, 0] } },
        skillsInferred: { $sum: { $cond: ["$enrichmentMetadata.skillsInferred", 1, 0] } },
        careerAnalyzed: { $sum: { $cond: ["$enrichmentMetadata.careerAnalyzed", 1, 0] } },
        scoringCompleted: { $sum: { $cond: ["$enrichmentMetadata.scoringCompleted", 1, 0] } },
        avgProcessingTime: { $avg: "$enrichmentMetadata.processingTime" },
        aiUsed: { $sum: { $cond: ["$enrichmentMetadata.aiUsed", 1, 0] } }
      }
    }
  ]);

  return stats[0] || {
    totalEnriched: 0,
    avgTechnicalScore: 0,
    avgExperienceScore: 0,
    avgLeadershipScore: 0,
    avgSemanticQualityScore: 0,
    avgRecommendationScore: 0,
    githubAnalyzed: 0,
    skillsInferred: 0,
    careerAnalyzed: 0,
    scoringCompleted: 0,
    avgProcessingTime: 0,
    aiUsed: 0
  };
};

const CandidateIntelligence = mongoose.model("CandidateIntelligence", candidateIntelligenceSchema);

export default CandidateIntelligence;
