import mongoose from "mongoose";

const recruiterLearningSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  interactionHistory: [{
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SourcingCandidate",
      required: true
    },
    action: {
      type: String,
      enum: ["viewed", "shortlisted", "rejected", "contacted", "hired", "interviewed", "not_interested"],
      required: true
    },
    context: {
      source: {
        type: String,
        enum: ["search", "recommendation", "outreach", "extension", "copilot", "manual"],
        default: "manual"
      },
      method: {
        type: String,
        enum: ["email", "linkedin", "phone", "in_person", "other"],
        default: "manual"
      },
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      },
      searchQuery: String,
      filters: {
        skills: [String],
        location: String,
        experience: String,
        industry: String
      },
      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now
    },
    duration: {
      type: Number,
      default: 0
    },
    outcome: {
      type: String,
      enum: ["success", "failure", "pending", "cancelled"],
      default: "pending"
    }
  }],
  learnedPreferences: {
    preferredSkills: [{
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
      frequency: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }],
    preferredIndustries: [{
      industry: {
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
      frequency: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }],
    preferredExperienceLevels: [{
      level: {
        type: String,
        enum: ["entry", "junior", "mid", "senior"],
        required: true
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      },
      frequency: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }],
    preferredCompanyTypes: [{
      type: {
        type: String,
        enum: ["startup", "enterprise", "academic", "government", "nonprofit"],
        required: true
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      },
      frequency: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }],
    preferredLocations: [{
      location: {
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
      frequency: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }],
    skillWeights: {
      type: Map,
      of: {
        weight: {
          type: Number,
          default: 0
        },
        confidence: {
          type: Number,
          default: 0.5
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      default: new Map()
    },
    locationWeights: {
      type: Map,
      of: {
        weight: {
          type: Number,
          default: 0
        },
        confidence: {
          type: Number,
          default: 0.5
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      default: new Map()
    },
    experienceWeights: {
      type: Map,
      of: {
        weight: {
          type: Number,
          default: 0
        },
        confidence: {
          type: Number,
          default: 0.5
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      default: new Map()
    },
    companyWeights: {
      type: Map,
      of: {
        weight: {
          type: Number,
          default: 0
        },
        confidence: {
          type: Number,
          default: 0.5
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      default: new Map()
    },
    lastPreferenceUpdate: {
      type: Date,
      default: Date.now
    }
  },
  rankingSignals: {
    semanticPatterns: [{
      pattern: String,
      weight: Number,
      confidence: Number,
      successRate: Number,
      lastUsed: Date
    }],
    behavioralPatterns: [{
      pattern: String,
      weight: Number,
      confidence: Number,
      successRate: Number,
      lastUsed: Date
    }],
    contextualWeights: {
      type: Map,
      of: {
        weight: {
          type: Number,
          default: 0
        },
        confidence: {
          type: Number,
          default: 0.5
        }
      },
      default: new Map()
    },
    historicalWeights: {
      type: Map,
      of: {
        weight: {
          type: Number,
          default: 0
        },
        confidence: {
          type: Number,
          default: 0.5
        }
      },
      default: new Map()
    },
    lastRankingUpdate: {
      type: Date,
      default: Date.now
    }
  },
  behavioralPatterns: {
    sourcingChannels: [{
      channel: String,
      effectiveness: Number,
      frequency: Number,
      lastUsed: Date
    }],
    interactionSpeed: {
      averageResponseTime: {
        type: Number,
        default: 0
      },
      averageDecisionTime: {
        type: Number,
        default: 0
      },
      viewedToShortlisted: {
        type: Number,
        default: 0
      },
      shortlistedToContacted: {
        type: Number,
        default: 0
      }
    },
    timePatterns: {
      mostActiveHour: {
        type: Number,
        default: 9
      },
      mostActiveDay: {
        type: String,
        default: "Monday"
      },
      peakActivityPeriod: {
        type: String,
        enum: ["morning", "afternoon", "evening", "night"],
        default: "morning"
      },
      consistency: {
        type: Number,
        default: 0
      }
    },
    decisionPatterns: {
      riskTolerance: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
      },
      thoroughness: {
        type: String,
        enum: ["quick", "moderate", "thorough"],
        default: "moderate"
      },
      conversionFactors: [String]
    },
    lastBehaviorUpdate: {
      type: Date,
      default: Date.now
    }
  },
  hiringPatterns: {
    successfulSkills: [{
      skill: String,
      successRate: Number,
      frequency: Number,
      averageTimeToHire: Number
    }],
    successfulIndustries: [{
      industry: String,
      successRate: Number,
      frequency: Number,
      averageTimeToHire: Number
    }],
    successfulExperienceLevels: [{
      level: String,
      successRate: Number,
      frequency: Number,
      averageTimeToHire: Number
    }],
    rejectionPatterns: [{
      reason: String,
      frequency: Number,
      commonFactors: [String]
    }],
    velocityMetrics: {
      hiresPerMonth: {
        type: Number,
        default: 0
      },
      averageTimeToHire: {
        type: Number,
        default: 0
      },
      hiringTrend: {
        type: String,
        enum: ["increasing", "stable", "decreasing"],
        default: "stable"
      }
    },
    lastHiringUpdate: {
      type: Date,
      default: Date.now
    }
  },
  customWeights: {
    preferenceScore: {
      type: Number,
      default: 0.25,
      min: 0,
      max: 1
    },
    behaviorScore: {
      type: Number,
      default: 0.25,
      min: 0,
      max: 1
    },
    semanticScore: {
      type: Number,
      default: 0.25,
      min: 0,
      max: 1
    },
    historicalScore: {
      type: Number,
      default: 0.15,
      min: 0,
      max: 1
    },
    contextScore: {
      type: Number,
      default: 0.10,
      min: 0,
      max: 1
    }
  },
  modelMetadata: {
    version: {
      type: String,
      default: "1.0"
    },
    lastLearningUpdate: {
      type: Date,
      default: Date.now
    },
    lastPreferenceUpdate: {
      type: Date,
      default: Date.now
    },
    lastBehaviorUpdate: {
      type: Date,
      default: Date.now
    },
    lastRankingUpdate: {
      type: Date,
      default: Date.now
    },
    lastHiringUpdate: {
      type: Date,
      default: Date.now
    },
    trainingIterations: {
      type: Number,
      default: 0
    },
    modelAccuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    confidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: Date
}, {
  timestamps: true,
  collection: "recruiterlearnings"
});

recruiterLearningSchema.index({ recruiterId: 1 }, { unique: true });
recruiterLearningSchema.index({ "interactionHistory.timestamp": -1 });
recruiterLearningSchema.index({ "interactionHistory.candidateId": 1 });
recruiterLearningSchema.index({ "interactionHistory.action": 1 });
recruiterLearningSchema.index({ "modelMetadata.lastLearningUpdate": -1 });
recruiterLearningSchema.index({ "modelMetadata.confidence": -1 });

recruiterLearningSchema.pre("save", function(next) {
  if (this.isModified("interactionHistory")) {
    this.modelMetadata.lastLearningUpdate = new Date();
  }
  
  if (this.isModified("learnedPreferences")) {
    this.modelMetadata.lastPreferenceUpdate = new Date();
  }
  
  if (this.isModified("behavioralPatterns")) {
    this.modelMetadata.lastBehaviorUpdate = new Date();
  }
  
  if (this.isModified("rankingSignals")) {
    this.modelMetadata.lastRankingUpdate = new Date();
  }
  
  if (this.isModified("hiringPatterns")) {
    this.modelMetadata.lastHiringUpdate = new Date();
  }
  
  next();
});

recruiterLearningSchema.methods.addInteraction = function(interactionData) {
  this.interactionHistory.push(interactionData);
  return this.save();
};

recruiterLearningSchema.methods.updatePreferences = function(preferences) {
  this.learnedPreferences = { ...this.learnedPreferences, ...preferences };
  this.modelMetadata.lastPreferenceUpdate = new Date();
  return this.save();
};

recruiterLearningSchema.methods.updateRankingSignals = function(signals) {
  this.rankingSignals = { ...this.rankingSignals, ...signals };
  this.modelMetadata.lastRankingUpdate = new Date();
  return this.save();
};

recruiterLearningSchema.methods.updateBehavioralPatterns = function(patterns) {
  this.behavioralPatterns = { ...this.behavioralPatterns, ...patterns };
  this.modelMetadata.lastBehaviorUpdate = new Date();
  return this.save();
};

recruiterLearningSchema.methods.getRecentInteractions = function(limit = 50) {
  return this.interactionHistory
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

recruiterLearningSchema.methods.getInteractionsByCandidate = function(candidateId) {
  return this.interactionHistory.filter(interaction => 
    interaction.candidateId.toString() === candidateId.toString()
  );
};

recruiterLearningSchema.methods.getInteractionsByAction = function(action) {
  return this.interactionHistory.filter(interaction => interaction.action === action);
};

recruiterLearningSchema.methods.getInteractionsByDateRange = function(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return this.interactionHistory.filter(interaction => {
    const interactionDate = new Date(interaction.timestamp);
    return interactionDate >= start && interactionDate <= end;
  });
};

recruiterLearningSchema.methods.calculateLearningProgress = function() {
  const totalInteractions = this.interactionHistory.length;
  const uniqueCandidates = new Set(this.interactionHistory.map(i => i.candidateId.toString())).size;
  const uniqueActions = new Set(this.interactionHistory.map(i => i.action)).size;
  const hasPreferences = this.learnedPreferences && Object.keys(this.learnedPreferences).length > 0;
  const hasRankingSignals = this.rankingSignals && Object.keys(this.rankingSignals).length > 0;

  let progress = 0;
  
  if (totalInteractions >= 10) progress += 20;
  else if (totalInteractions >= 5) progress += 10;
  
  if (uniqueCandidates >= 20) progress += 20;
  else if (uniqueCandidates >= 10) progress += 15;
  else if (uniqueCandidates >= 5) progress += 10;
  
  if (uniqueActions >= 4) progress += 20;
  else if (uniqueActions >= 3) progress += 15;
  else if (uniqueActions >= 2) progress += 10;
  
  if (hasPreferences) progress += 20;
  if (hasRankingSignals) progress += 20;

  return Math.min(progress, 100);
};

recruiterLearningSchema.methods.determineLearningStage = function() {
  const progress = this.calculateLearningProgress();
  const totalInteractions = this.interactionHistory.length;

  if (totalInteractions === 0) return 'not_started';
  if (totalInteractions < 10) return 'initial';
  if (progress < 40) return 'learning';
  if (progress < 70) return 'developing';
  if (progress < 90) return 'mature';
  return 'expert';
};

recruiterLearningSchema.methods.archive = function() {
  this.isActive = false;
  this.archivedAt = new Date();
  return this.save();
};

recruiterLearningSchema.statics.getTopPerformers = async function(limit = 20, timeRange = '30d') {
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

  const topPerformers = await this.aggregate([
    {
      $match: {
        isActive: true,
        "modelMetadata.lastLearningUpdate": { $gte: startDate }
      }
    },
    {
      $addFields: {
        interactionCount: { $size: "$interactionHistory" },
        hiredCount: {
          $size: {
            $filter: {
              input: "$interactionHistory",
              cond: { $eq: ["$$this.action", "hired"] }
            }
          }
        },
        confidence: "$modelMetadata.confidence"
      }
    },
    {
      $sort: {
        hiredCount: -1,
        confidence: -1,
        interactionCount: -1
      }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: "users",
        localField: "recruiterId",
        foreignField: "_id",
        as: "recruiter"
      }
    },
    {
      $project: {
        recruiterId: 1,
        interactionCount: 1,
        hiredCount: 1,
        confidence: 1,
        learningStage: { $literal: "expert" },
        recruiter: { $arrayElemAt: ["$recruiter", 0] }
      }
    }
  ]);

  return topPerformers;
};

recruiterLearningSchema.statics.getLearningStats = async function(timeRange = '30d') {
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
        isActive: true,
        "modelMetadata.lastLearningUpdate": { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRecruiters: { $sum: 1 },
        totalInteractions: { $sum: { $size: "$interactionHistory" } },
        avgConfidence: { $avg: "$modelMetadata.confidence" },
        totalHired: {
          $sum: {
            $size: {
              $filter: {
                input: "$interactionHistory",
                cond: { $eq: ["$$this.action", "hired"] }
              }
            }
          }
        },
        avgModelAccuracy: { $avg: "$modelMetadata.modelAccuracy" }
      }
    }
  ]);

  return stats[0] || {
    totalRecruiters: 0,
    totalInteractions: 0,
    avgConfidence: 0,
    totalHired: 0,
    avgModelAccuracy: 0
  };
};

const RecruiterLearning = mongoose.model("RecruiterLearning", recruiterLearningSchema);

export default RecruiterLearning;
