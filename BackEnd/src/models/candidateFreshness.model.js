import mongoose from "mongoose";

const candidateFreshnessSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SourcingCandidate',
    required: true,
    unique: true
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  freshnessScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  activityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  movementScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  openToWorkScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  engagementScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  relevanceDecayScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  freshnessLevel: {
    type: String,
    enum: ['very_fresh', 'fresh', 'moderate', 'stale', 'very_stale'],
    default: 'moderate'
  },
  movementSignals: [{
    type: {
      type: String,
      enum: ['promotion', 'company_change', 'startup_transition', 'experience_growth', 'highly_active', 'github_activity_change', 'portfolio_project_addition', 'technology_acquisition', 'github_role_change', 'job_hopper', 'career_progression', 'startup_experience']
    },
    evidence: String,
    date: Date,
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    score: {
      type: Number,
      min: -50,
      max: 50
    }
  }],
  activitySignals: [{
    type: {
      type: String,
      enum: ['high_activity', 'recent_commits', 'inactive', 'influential', 'quality_projects', 'tech_diversity', 'established', 'fresh_portfolio', 'stale_portfolio', 'project_rich', 'tech_diverse', 'fresh_resume', 'stale_resume', 'experienced', 'skill_rich']
    },
    message: String,
    score: Number
  }],
  openToWorkSignals: [{
    type: {
      type: String,
      enum: ['job_seeking_indicator', 'high_github_activity', 'complete_github_profile', 'recent_portfolio_updates', 'high_contact_visibility', 'recent_fork_activity', 'new_repository_creation', 'portfolio_project_addition', 'project_availability_indicator', 'objective_statement', 'availability_info', 'flexibility_indicators', 'fresh_resume']
    },
    message: String,
    score: Number
  }],
  lastActivityAnalysis: {
    type: Date,
    default: Date.now
  },
  lastMovementAnalysis: {
    type: Date,
    default: Date.now
  },
  lastOpenToWorkAnalysis: {
    type: Date,
    default: Date.now
  },
  lastFreshnessAnalysis: {
    type: Date,
    default: Date.now
  },
  lastDecayCalculation: {
    type: Date,
    default: Date.now
  },
  activityMetadata: {
    github: {
      activityScore: Number,
      lastActivity: Date,
      repositories: Number,
      followers: Number,
      languages: [String],
      signals: [mongoose.Schema.Types.Mixed]
    },
    portfolio: {
      activityScore: Number,
      lastUpdated: Date,
      projects: Number,
      technologies: Number,
      signals: [mongoose.Schema.Types.Mixed]
    },
    resume: {
      activityScore: Number,
      lastUpdated: Date,
      experience: Number,
      skills: Number,
      signals: [mongoose.Schema.Types.Mixed]
    }
  },
  processingMetadata: {
    githubProcessed: {
      type: Boolean,
      default: false
    },
    portfolioProcessed: {
      type: Boolean,
      default: false
    },
    resumeProcessed: {
      type: Boolean,
      default: false
    },
    lastProcessedAt: {
      type: Date,
      default: Date.now
    },
    processingErrors: [String],
    processingWarnings: [String]
  },
  autoRefresh: {
    enabled: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    lastRefresh: {
      type: Date,
      default: Date.now
    },
    nextRefresh: {
      type: Date,
      default: Date.now
    }
  },
  reprocessingStatus: {
    embedded: {
      type: Boolean,
      default: false
    },
    enriched: {
      type: Boolean,
      default: false
    },
    reindexed: {
      type: Boolean,
      default: false
    },
    lastReprocessed: {
      type: Date,
      default: Date.now
    }
  },
  qualityMetrics: {
    signalQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    dataCompleteness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    confidenceLevel: {
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
    }
  },
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  notes: String,
  flagged: {
    type: Boolean,
    default: false
  },
  flagReason: String
}, {
  timestamps: true,
  collection: 'candidate_freshness'
});

candidateFreshnessSchema.index({ freshnessScore: -1 });
candidateFreshnessSchema.index({ openToWorkScore: -1 });
candidateFreshnessSchema.index({ lastActivityAt: -1 });
candidateFreshnessSchema.index({ freshnessLevel: 1 });
candidateFreshnessSchema.index({ flagged: 1 });
candidateFreshnessSchema.index({ tags: 1 });
candidateFreshnessSchema.index({ 'autoRefresh.nextRefresh': 1 });

candidateFreshnessSchema.statics = {
  async findByCandidateId(candidateId) {
    return this.findOne({ candidateId }).populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');
  },

  async getFreshCandidates(minScore = 60, limit = 100) {
    return this.find({
      freshnessScore: { $gte: minScore },
      flagged: false
    })
    .sort({ freshnessScore: -1, lastActivityAt: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');
  },

  async getOpenToWorkCandidates(minScore = 50, limit = 100) {
    return this.find({
      openToWorkScore: { $gte: minScore },
      flagged: false
    })
    .sort({ openToWorkScore: -1, lastActivityAt: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');
  },

  async getStaleCandidates(daysThreshold = 90, limit = 100) {
    const cutoffDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
    
    return this.find({
      lastActivityAt: { $lt: cutoffDate },
      flagged: false
    })
    .sort({ lastActivityAt: 1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');
  },

  async getActiveCandidates(daysThreshold = 30, limit = 100) {
    const cutoffDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
    
    return this.find({
      lastActivityAt: { $gte: cutoffDate },
      flagged: false
    })
    .sort({ lastActivityAt: -1, freshnessScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');
  },

  async getByFreshnessLevel(level, limit = 50) {
    return this.find({
      freshnessLevel: level,
      flagged: false
    })
    .sort({ lastActivityAt: -1, freshnessScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');
  },

  async getMovementCandidates(movementType, limit = 50) {
    return this.find({
      'movementSignals.type': movementType,
      flagged: false
    })
    .sort({ lastMovementAnalysis: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');
  },

  async getHighEngagementCandidates(minScore = 70, limit = 50) {
    return this.find({
      engagementScore: { $gte: minScore },
      flagged: false
    })
    .sort({ engagementScore: -1, lastActivityAt: -1 })
    .limit(limit)
    .populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');
  },

  async getFreshnessDistribution() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: '$freshnessLevel',
          count: { $sum: 1 },
          avgFreshnessScore: { $avg: '$freshnessScore' },
          avgOpenToWorkScore: { $avg: '$openToWorkScore' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return stats;
  },

  async getOpenToWorkDistribution() {
    const stats = await this.aggregate([
      {
        $match: {
          openToWorkScore: { $exists: true }
        }
      },
      {
        $bucket: {
          groupBy: '$openToWorkScore',
          boundaries: [20, 40, 60, 80, 100],
          output: {
            count: { $sum: 1 },
            avgFreshness: { $avg: '$freshnessScore' }
          }
        }
      }
    ]);

    return stats;
  },

  async getActivityTrends(timeRange = '30d') {
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

    const trends = await this.aggregate([
      {
        $match: {
          lastActivityAnalysis: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$lastActivityAnalysis'
            }
          },
          avgFreshness: { $avg: '$freshnessScore' },
          avgOpenToWork: { $avg: '$openToWorkScore' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return {
      timeRange,
      period: { start: startDate, end: now },
      trends
    };
  },

  async getMovementTrends(timeRange = '90d') {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '180d':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    const trends = await this.aggregate([
      {
        $match: {
          lastMovementAnalysis: { $gte: startDate }
        }
      },
      { $unwind: '$movementSignals' },
      {
        $group: {
          _id: '$movementSignals.type',
          count: { $sum: 1 },
          avgScore: { $avg: '$movementSignals.score' },
          avgConfidence: { $avg: '$movementSignals.confidence' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return {
      timeRange,
      period: { start: startDate, end: now },
      trends
    };
  },

  async getQualityMetrics() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: null,
          avgSignalQuality: { $avg: '$qualityMetrics.signalQuality' },
          avgDataCompleteness: { $avg: '$qualityMetrics.dataCompleteness' },
          avgConfidenceLevel: { $avg: '$qualityMetrics.confidenceLevel' },
          avgConsistencyScore: { $avg: '$qualityMetrics.consistencyScore' },
          totalCandidates: { $sum: 1 }
        }
      }
    ]);

    return stats[0] || {
      avgSignalQuality: 0,
      avgDataCompleteness: 0,
      avgConfidenceLevel: 0,
      avgConsistencyScore: 0,
      totalCandidates: 0
    };
  },

  async updateFreshnessScore(candidateId, freshnessData) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        freshnessScore: freshnessData.overallScore,
        activityScore: freshnessData.activityScore,
        movementScore: freshnessData.movementScore,
        openToWorkScore: freshnessData.openToWorkScore,
        engagementScore: freshnessData.engagementScore,
        freshnessLevel: freshnessData.freshnessLevel,
        lastFreshnessAnalysis: new Date(),
        freshnessSignals: freshnessData.signals,
        activityMetadata: freshnessData.activityData,
        qualityMetrics: {
          signalQuality: freshnessData.signalQuality || 0,
          dataCompleteness: freshnessData.dataCompleteness || 0,
          confidenceLevel: freshnessData.confidenceLevel || 0,
          consistencyScore: freshnessData.consistencyScore || 0
        }
      },
      { upsert: true, new: true }
    );
  },

  async updateMovementSignals(candidateId, movementData) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        movementSignals: movementData.movements,
        lastMovementAnalysis: new Date(),
        movementSignals: movementData.signals
      },
      { upsert: true, new: true }
    );
  },

  async updateOpenToWorkSignals(candidateId, openToWorkData) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        openToWorkScore: openToWorkData.overallScore,
        lastOpenToWorkAnalysis: new Date(),
        openToWorkSignals: openToWorkData.signals,
        openToWorkConfidence: openToWorkData.confidence
      },
      { upsert: true, new: true }
    );
  },

  async applyRelevanceDecay(candidateId, decayData) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        relevanceDecayScore: decayData.decayedScore,
        lastDecayCalculation: new Date(),
        decayFactor: decayData.decayFactor
      },
      { upsert: true, new: true }
    );
  },

  async scheduleAutoRefresh(candidateId, refreshData) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        'autoRefresh.enabled': refreshData.enabled,
        'autoRefresh.frequency': refreshData.frequency,
        'autoRefresh.lastRefresh': new Date(),
        'autoRefresh.nextRefresh': refreshData.nextRefresh
      },
      { upsert: true, new: true }
    );
  },

  async updateReprocessingStatus(candidateId, status) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        reprocessingStatus: status,
        lastReprocessed: new Date()
      },
      { upsert: true, new: true }
    );
  },

  async flagCandidate(candidateId, reason, notes = '') {
    return this.findOneAndUpdate(
      { candidateId },
      {
        flagged: true,
        flagReason: reason,
        notes,
        flaggedAt: new Date()
      },
      { new: true }
    );
  },

  async unflagCandidate(candidateId) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        flagged: false,
        flagReason: null,
        notes: '',
        flaggedAt: null
      },
      { new: true }
    );
  },

  async searchFreshness(criteria) {
    const query = { flagged: false };
    
    if (criteria.minFreshnessScore) {
      query.freshnessScore = { $gte: criteria.minFreshnessScore };
    }
    
    if (criteria.maxFreshnessScore) {
      query.freshnessScore = query.freshnessScore || {};
      query.freshnessScore.$lte = criteria.maxFreshnessScore;
    }
    
    if (criteria.minOpenToWorkScore) {
      query.openToWorkScore = { $gte: criteria.minOpenToWorkScore };
    }
    
    if (criteria.freshnessLevel) {
      query.freshnessLevel = criteria.freshnessLevel;
    }
    
    if (criteria.movementType) {
      query['movementSignals.type'] = criteria.movementType;
    }

    const candidates = await this.find(query)
      .sort({ freshnessScore: -1, lastActivityAt: -1 })
      .limit(criteria.limit || 50)
      .populate('candidateId', 'name email githubUrl portfolioUrl resumeUrl');

    return candidates;
  },

  async getAggregatedStats(timeRange = '30d') {
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
          lastFreshnessAnalysis: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalCandidates: { $sum: 1 },
          avgFreshnessScore: { $avg: '$freshnessScore' },
          avgOpenToWorkScore: { $avg: '$openToWorkScore' },
          avgEngagementScore: { $avg: '$engagementScore' },
          veryFresh: {
            $sum: { $cond: [{ $gte: ['$freshnessScore', 80] }, 1, 0] }
          },
          fresh: {
            $sum: { $cond: [{ $gte: ['$freshnessScore', 60] }, 1, 0] }
          },
          moderate: {
            $sum: { $cond: [{ $gte: ['$freshnessScore', 40] }, 1, 0] }
          },
          stale: {
            $sum: { $cond: [{ $gte: ['$freshnessScore', 20] }, 1, 0] }
          },
          veryStale: {
            $sum: { $cond: [{ $lt: ['$freshnessScore', 20] }, 1, 0] }
          },
          highOpenToWork: {
            $sum: { $cond: [{ $gte: ['$openToWorkScore', 70] }, 1, 0] }
          },
          flagged: {
            $sum: { $cond: ['$flagged', 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      totalCandidates: 0,
      avgFreshnessScore: 0,
      avgOpenToWorkScore: 0,
      avgEngagementScore: 0,
      veryFresh: 0,
      fresh: 0,
      moderate: 0,
      stale: 0,
      veryStale: 0,
      highOpenToWork: 0,
      flagged: 0
    };
  }
};

candidateFreshnessSchema.methods = {
  getOverallQualityScore() {
    const metrics = this.qualityMetrics || {};
    return (metrics.signalQuality + metrics.dataCompleteness + metrics.confidenceLevel + metrics.consistencyScore) / 4;
  },

  isVeryFresh() {
    return this.freshnessLevel === 'very_fresh' || this.freshnessScore >= 80;
  },

  isStale() {
    return this.freshnessLevel === 'stale' || this.freshnessLevel === 'very_stale' || this.freshnessScore < 40;
  },

  isOpenToWork() {
    return this.openToWorkScore >= 50;
  },

  isHighlyEngaged() {
    return this.engagementScore >= 70;
  },

  getRecentMovements(days = 90) {
    if (!this.movementSignals) return [];
    
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.movementSignals.filter(movement => 
      new Date(movement.date) >= cutoffDate
    );
  },

  getRecentActivitySignals(days = 30) {
    if (!this.activitySignals) return [];
    
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.activitySignals.filter(signal => 
      this.lastActivityAnalysis && new Date(this.lastActivityAnalysis) >= cutoffDate
    );
  },

  getRecentOpenToWorkSignals(days = 30) {
    if (!this.openToWorkSignals) return [];
    
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.openToWorkSignals.filter(signal => 
      this.lastOpenToWorkAnalysis && new Date(this.lastOpenToWorkAnalysis) >= cutoffDate
    );
  },

  needsRefresh() {
    if (!this.autoRefresh.enabled) return false;
    
    return new Date() >= new Date(this.autoRefresh.nextRefresh);
  },

  calculateNextRefreshDate() {
    const frequency = this.autoRefresh.frequency;
    const now = new Date();
    
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  },

  async addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      return this.save();
    }
    return this;
  },

  async removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    return this.save();
  },

  async addProcessingError(error) {
    if (!this.processingMetadata.processingErrors) {
      this.processingMetadata.processingErrors = [];
    }
    this.processingMetadata.processingErrors.push(error);
    return this.save();
  },

  async addProcessingWarning(warning) {
    if (!this.processingMetadata.processingWarnings) {
      this.processingMetadata.processingWarnings = [];
    }
    this.processingMetadata.processingWarnings.push(warning);
    return this.save();
  }
};

export const CandidateFreshness = mongoose.model('CandidateFreshness', candidateFreshnessSchema);
export default CandidateFreshness;
