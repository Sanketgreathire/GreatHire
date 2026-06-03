import mongoose from "mongoose";

const recruiterMemorySchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  
  preferences: {
    skills: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    industries: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    locations: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    designations: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    experienceLevels: [{
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead"],
      lowercase: true
    }],
    workTypes: [{
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      lowercase: true
    }],
    companyTypes: [{
      type: String,
      enum: ["startup", "enterprise", "smb", "agency", "consulting"],
      lowercase: true
    }]
  },

  searchHistory: [{
    query: {
      type: String,
      trim: true,
      required: true
    },
    intent: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    resultCount: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      default: 0
    },
    session: {
      type: String,
      trim: true
    }
  }],

  interactionStats: {
    totalSearches: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    totalShortlists: {
      type: Number,
      default: 0
    },
    totalContacts: {
      type: Number,
      default: 0
    },
    totalRejections: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },

  skillWeights: {
    type: Map,
    of: Number,
    default: new Map()
  },

  locationWeights: {
    type: Map,
    of: Number,
    default: new Map()
  },

  designationWeights: {
    type: Map,
    of: Number,
    default: new Map()
  },

  experienceWeights: {
    type: Map,
    of: Number,
    default: new Map()
  },

  companyWeights: {
    type: Map,
    of: Number,
    default: new Map()
  },

  adaptiveSignals: {
    searchPatterns: [{
      pattern: String,
      frequency: Number,
      successRate: Number,
      lastUsed: Date
    }],
    preferredCandidateProfiles: [{
      skills: [String],
      experience: String,
      location: String,
      designation: String,
      score: Number
    }],
    rejectionPatterns: [{
      reason: String,
      frequency: Number,
      context: String
    }],
    successPatterns: [{
      factors: [String],
      frequency: Number,
      outcome: String
    }]
  },

  settings: {
    enableAdaptiveRanking: {
      type: Boolean,
      default: true
    },
    enablePersonalization: {
      type: Boolean,
      default: true
    },
    maxSearchHistory: {
      type: Number,
      default: 100
    },
    sessionTimeout: {
      type: Number,
      default: 1800000
    },
    notificationPreferences: {
      newMatches: {
        type: Boolean,
        default: true
      },
      candidateUpdates: {
        type: Boolean,
        default: true
      },
      insights: {
        type: Boolean,
        default: true
      }
    }
  },

  insights: {
    topSkills: [{
      skill: String,
      frequency: Number,
      successRate: Number
    }],
    topLocations: [{
      location: String,
      frequency: Number,
      successRate: Number
    }],
    topDesignations: [{
      designation: String,
      frequency: Number,
      successRate: Number
    }],
    searchTrends: [{
      period: String,
      searches: Number,
      topQueries: [String]
    }],
    performanceMetrics: {
      averageMatchQuality: {
        type: Number,
        default: 0
      },
      conversionRate: {
        type: Number,
        default: 0
      },
      timeToHire: {
        type: Number,
        default: 0
      }
    }
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: "recruitermemories"
});

recruiterMemorySchema.index({ recruiterId: 1 });
recruiterMemorySchema.index({ "searchHistory.timestamp": -1 });
recruiterMemorySchema.index({ "interactionStats.lastActivity": -1 });
recruiterMemorySchema.index({ "insights.topSkills.skill": 1 });
recruiterMemorySchema.index({ "insights.topLocations.location": 1 });

recruiterMemorySchema.pre("save", function(next) {
  this.lastUpdated = new Date();
  next();
});

recruiterMemorySchema.methods.addSearchToHistory = function(query, intent, filters, resultCount, duration, session) {
  this.searchHistory.push({
    query,
    intent,
    filters,
    resultCount,
    duration,
    session,
    timestamp: new Date()
  });

  this.interactionStats.totalSearches += 1;
  this.interactionStats.lastActivity = new Date();

  if (this.searchHistory.length > this.settings.maxSearchHistory) {
    this.searchHistory = this.searchHistory.slice(-this.settings.maxSearchHistory);
  }

  return this.save();
};

recruiterMemorySchema.methods.updateSkillWeight = function(skill, weight) {
  const currentWeight = this.skillWeights.get(skill) || 0;
  this.skillWeights.set(skill, Math.max(0, currentWeight + weight));
  return this.save();
};

recruiterMemorySchema.methods.updateLocationWeight = function(location, weight) {
  const currentWeight = this.locationWeights.get(location) || 0;
  this.locationWeights.set(location, Math.max(0, currentWeight + weight));
  return this.save();
};

recruiterMemorySchema.methods.updateDesignationWeight = function(designation, weight) {
  const currentWeight = this.designationWeights.get(designation) || 0;
  this.designationWeights.set(designation, Math.max(0, currentWeight + weight));
  return this.save();
};

recruiterMemorySchema.methods.recordInteraction = function(type, candidateData = {}) {
  this.interactionStats.lastActivity = new Date();
  
  switch (type) {
    case 'viewed':
      this.interactionStats.totalViews += 1;
      break;
    case 'shortlisted':
      this.interactionStats.totalShortlists += 1;
      break;
    case 'contacted':
      this.interactionStats.totalContacts += 1;
      break;
    case 'rejected':
      this.interactionStats.totalRejections += 1;
      break;
  }

  if (candidateData.skills) {
    candidateData.skills.forEach(skill => {
      this.updateSkillWeight(skill.toLowerCase(), type === 'rejected' ? -0.5 : 0.2);
    });
  }

  if (candidateData.location) {
    this.updateLocationWeight(candidateData.location.toLowerCase(), type === 'rejected' ? -0.3 : 0.1);
  }

  if (candidateData.designation) {
    this.updateDesignationWeight(candidateData.designation.toLowerCase(), type === 'rejected' ? -0.4 : 0.15);
  }

  return this.save();
};

recruiterMemorySchema.methods.getSkillWeight = function(skill) {
  return this.skillWeights.get(skill.toLowerCase()) || 0;
};

recruiterMemorySchema.methods.getLocationWeight = function(location) {
  return this.locationWeights.get(location.toLowerCase()) || 0;
};

recruiterMemorySchema.methods.getDesignationWeight = function(designation) {
  return this.designationWeights.get(designation.toLowerCase()) || 0;
};

recruiterMemorySchema.methods.getRecentSearches = function(limit = 10) {
  return this.searchHistory
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

recruiterMemorySchema.methods.getTopSkills = function(limit = 10) {
  return this.insights.topSkills
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
};

recruiterMemorySchema.methods.getSearchStats = function() {
  const recentSearches = this.searchHistory.filter(
    search => new Date() - new Date(search.timestamp) <= 7 * 24 * 60 * 60 * 1000
  );

  return {
    totalSearches: this.interactionStats.totalSearches,
    recentSearches: recentSearches.length,
    averageResults: recentSearches.length > 0 
      ? recentSearches.reduce((sum, search) => sum + search.resultCount, 0) / recentSearches.length 
      : 0,
    successRate: this.interactionStats.totalShortlists / Math.max(1, this.interactionStats.totalViews)
  };
};

recruiterMemorySchema.statics.getRecruiterMemory = async function(recruiterId) {
  let memory = await this.findOne({ recruiterId });
  
  if (!memory) {
    memory = await this.create({
      recruiterId,
      preferences: {
        skills: [],
        industries: [],
        locations: [],
        designations: [],
        experienceLevels: [],
        workTypes: [],
        companyTypes: []
      },
      searchHistory: [],
      interactionStats: {
        totalSearches: 0,
        totalViews: 0,
        totalShortlists: 0,
        totalContacts: 0,
        totalRejections: 0,
        averageSessionDuration: 0,
        lastActivity: new Date()
      },
      skillWeights: new Map(),
      locationWeights: new Map(),
      designationWeights: new Map(),
      experienceWeights: new Map(),
      companyWeights: new Map(),
      adaptiveSignals: {
        searchPatterns: [],
        preferredCandidateProfiles: [],
        rejectionPatterns: [],
        successPatterns: []
      },
      settings: {
        enableAdaptiveRanking: true,
        enablePersonalization: true,
        maxSearchHistory: 100,
        sessionTimeout: 1800000,
        notificationPreferences: {
          newMatches: true,
          candidateUpdates: true,
          insights: true
        }
      },
      insights: {
        topSkills: [],
        topLocations: [],
        topDesignations: [],
        searchTrends: [],
        performanceMetrics: {
          averageMatchQuality: 0,
          conversionRate: 0,
          timeToHire: 0
        }
      }
    });
  }

  return memory;
};

recruiterMemorySchema.statics.updateRecruiterMemory = async function(recruiterId, updates) {
  const memory = await this.getRecruiterMemory(recruiterId);
  
  if (updates.preferences) {
    Object.keys(updates.preferences).forEach(key => {
      if (Array.isArray(updates.preferences[key])) {
        memory.preferences[key] = [...new Set([...memory.preferences[key], ...updates.preferences[key]])];
      } else {
        memory.preferences[key] = updates.preferences[key];
      }
    });
  }

  if (updates.settings) {
    Object.assign(memory.settings, updates.settings);
  }

  if (updates.lastSearch) {
    memory.addSearchToHistory(
      updates.lastSearch.query,
      updates.lastSearch.intent,
      updates.lastSearch.filters,
      updates.lastSearch.resultCount,
      updates.lastSearch.duration || 0,
      updates.lastSearch.session
    );
  }

  return memory.save();
};

const RecruiterMemory = mongoose.model("RecruiterMemory", recruiterMemorySchema);

export default RecruiterMemory;

export const getRecruiterMemory = RecruiterMemory.getRecruiterMemory;
export const updateRecruiterMemory = RecruiterMemory.updateRecruiterMemory;
