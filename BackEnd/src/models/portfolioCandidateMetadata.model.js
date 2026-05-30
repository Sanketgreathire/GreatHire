import mongoose from "mongoose";

const portfolioCandidateMetadataSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SourcingCandidate',
    required: true
  },
  portfolioUrl: {
    type: String,
    required: true
  },
  detectedTechnologies: {
    frontend: [String],
    backend: [String],
    databases: [String],
    cloud: [String],
    devops: [String],
    ai_ml: [String],
    mobile: [String],
    testing: [String],
    security: [String],
    blockchain: [String],
    all: [String],
    confidence: {
      type: Map,
      of: Number
    }
  },
  projectInsights: [{
    projectName: String,
    complexity: {
      score: Number,
      level: String,
      indicators: {
        high: Number,
        medium: Number,
        low: Number
      }
    },
    technicalDepth: {
      score: Number,
      level: String,
      indicators: {
        advanced: Number,
        intermediate: Number,
        basic: Number
      },
      technologyCategories: [String]
    },
    domainExpertise: {
      primary: String,
      secondary: [String],
      all: Map,
      confidence: Number
    },
    engineeringSpecialization: {
      primary: String,
      secondary: [String],
      all: Map,
      confidence: Number
    },
    projectQuality: {
      score: Number,
      factors: {
        completeness: Number,
        documentation: Number,
        presentation: Number,
        technical: Number
      },
      grade: String
    },
    innovationScore: {
      score: Number,
      indicators: {
        novelTechnology: Number,
        uniqueApproach: Number,
        problemSolving: Number,
        creativity: Number
      },
      level: String
    },
    teamSize: {
      estimated: Number,
      confidence: Number
    },
    duration: {
      estimated: Number,
      unit: String,
      confidence: Number
    },
    impact: {
      score: Number,
      factors: {
        users: Number,
        business: Number,
        technical: Number,
        social: Number
      },
      level: String
    },
    scalability: {
      score: Number,
      factors: {
        architecture: Number,
        technology: Number,
        infrastructure: Number,
        design: Number
      },
      level: String
    },
    maintainability: {
      score: Number,
      factors: {
        code: Number,
        documentation: Number,
        structure: Number,
        testing: Number
      },
      level: String
    }
  }],
  portfolioScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  engineeringSignals: {
    fullStack: Boolean,
    seniority: {
      type: String,
      enum: ['junior', 'mid-junior', 'mid', 'senior', 'lead', 'principal'],
      default: 'junior'
    },
    specialization: [String],
    technicalLeadership: Boolean,
    innovationScore: Number,
    collaborationSkills: Number
  },
  portfolioStats: {
    totalProjects: Number,
    activeProjects: Number,
    totalTechnologies: Number,
    technologyCategories: [String],
    avgProjectScore: Number,
    avgInnovationScore: Number
  },
  qualityMetrics: {
    profileCompleteness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    portfolioQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    technicalDepth: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    innovationLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    engineeringMaturity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  rawProfile: mongoose.Schema.Types.Mixed,
  lastSyncedAt: {
    type: Date,
    default: Date.now
  },
  syncStatus: {
    type: String,
    enum: ['pending', 'syncing', 'completed', 'failed'],
    default: 'completed'
  },
  enrichmentStatus: {
    embedded: {
      type: Boolean,
      default: false
    },
    enriched: {
      type: Boolean,
      default: false
    },
    graphProcessed: {
      type: Boolean,
      default: false
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
  flagReason: String,
  crawlMetadata: {
    crawlDuration: Number,
    pagesCrawled: Number,
    imagesFound: Number,
    linksFound: Number,
    errors: [String],
    lastCrawlAt: Date
  }
}, {
  timestamps: true,
  collection: 'portfolio_candidate_metadata'
});

portfolioCandidateMetadataSchema.index({ candidateId: 1, portfolioUrl: 1 });
portfolioCandidateMetadataSchema.index({ portfolioUrl: 1 }, { unique: true });
portfolioCandidateMetadataSchema.index({ portfolioScore: -1 });
portfolioCandidateMetadataSchema.index({ 'engineeringSignals.seniority': 1 });
portfolioCandidateMetadataSchema.index({ 'engineeringSignals.specialization': 1 });
portfolioCandidateMetadataSchema.index({ lastSyncedAt: -1 });
portfolioCandidateMetadataSchema.index({ syncStatus: 1 });
portfolioCandidateMetadataSchema.index({ flagged: 1 });
portfolioCandidateMetadataSchema.index({ tags: 1 });

portfolioCandidateMetadataSchema.statics = {
  async findByCandidateId(candidateId) {
    return this.findOne({ candidateId }).populate('candidateId', 'name email portfolioUrl location skills');
  },

  async findByPortfolioUrl(url) {
    return this.findOne({ portfolioUrl: url }).populate('candidateId', 'name email portfolioUrl location skills');
  },

  async getHighScoringPortfolios(minScore = 50, limit = 100) {
    return this.find({
      portfolioScore: { $gte: minScore },
      flagged: false
    })
    .sort({ portfolioScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email portfolioUrl location skills');
  },

  async getActivePortfolios(months = 6, limit = 100) {
    const cutoffDate = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000);
    
    return this.find({
      'crawlMetadata.lastCrawlAt': { $gte: cutoffDate },
      flagged: false
    })
    .sort({ 'crawlMetadata.lastCrawlAt': -1 })
    .limit(limit)
    .populate('candidateId', 'name email portfolioUrl location skills');
  },

  async getBySpecialization(specialization, limit = 50) {
    return this.find({
      'engineeringSignals.specialization': specialization,
      flagged: false
    })
    .sort({ portfolioScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email portfolioUrl location skills');
  },

  async getBySeniority(seniority, limit = 50) {
    return this.find({
      'engineeringSignals.seniority': seniority,
      flagged: false
    })
    .sort({ portfolioScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email portfolioUrl location skills');
  },

  async getByTechnologies(technologies, limit = 50) {
    return this.find({
      'detectedTechnologies.all': { $in: technologies },
      flagged: false
    })
    .sort({ portfolioScore: -1 })
    .limit(limit)
    .populate('candidateId', 'name email portfolioUrl location skills');
  },

  async getFlaggedPortfolios(reason = null, limit = 50) {
    const query = { flagged: true };
    if (reason) {
      query.flagReason = reason;
    }
    
    return this.find(query)
    .sort({ flagged: -1, createdAt: -1 })
    .limit(limit)
    .populate('candidateId', 'name email portfolioUrl');
  },

  async getSyncStatusStats() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: '$syncStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  },

  async getTechnologyDistribution() {
    const stats = await this.aggregate([
      { $unwind: '$detectedTechnologies.all' },
      {
        $group: {
          _id: '$detectedTechnologies.all',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    return stats;
  },

  async getSeniorityDistribution() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: '$engineeringSignals.seniority',
          count: { $sum: 1 },
          avgPortfolioScore: { $avg: '$portfolioScore' },
          avgInnovationScore: { $avg: '$engineeringSignals.innovationScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  },

  async getSpecializationDistribution() {
    const stats = await this.aggregate([
      { $unwind: '$engineeringSignals.specialization' },
      {
        $group: {
          _id: '$engineeringSignals.specialization',
          count: { $sum: 1 },
          avgPortfolioScore: { $avg: '$portfolioScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  },

  async getPortfolioQualityDistribution() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: '$qualityMetrics.portfolioQuality',
          count: { $sum: 1 },
          avgTechnicalDepth: { $avg: '$qualityMetrics.technicalDepth' },
          avgInnovationLevel: { $avg: '$qualityMetrics.innovationLevel' }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    return stats;
  },

  async updateSyncStatus(candidateId, status, additionalData = {}) {
    return this.findOneAndUpdate(
      { candidateId },
      {
        syncStatus: status,
        lastSyncedAt: new Date(),
        ...additionalData
      },
      { upsert: true, new: true }
    );
  },

  async updateEnrichmentStatus(candidateId, enrichmentType, status = true) {
    const update = {};
    update[`enrichmentStatus.${enrichmentType}`] = status;
    
    return this.findOneAndUpdate(
      { candidateId },
      update,
      { new: true }
    );
  },

  async calculateQualityMetrics(portfolioData) {
    const metrics = {
      profileCompleteness: 0,
      portfolioQuality: 0,
      technicalDepth: 0,
      innovationLevel: 0,
      engineeringMaturity: 0
    };

    // Profile completeness
    let completenessScore = 0;
    if (portfolioData.name) completenessScore += 15;
    if (portfolioData.title) completenessScore += 10;
    if (portfolioData.bio && portfolioData.bio.length > 50) completenessScore += 15;
    if (portfolioData.contact?.email) completenessScore += 15;
    if (portfolioData.contact?.linkedin) completenessScore += 10;
    if (portfolioData.contact?.github) completenessScore += 10;
    if (portfolioData.projects && portfolioData.projects.length > 0) completenessScore += 15;
    if (portfolioData.experience && portfolioData.experience.length > 0) completenessScore += 10;
    
    metrics.profileCompleteness = Math.min(completenessScore, 100);

    // Portfolio quality
    let qualityScore = 0;
    if (portfolioData.projects && portfolioData.projects.length > 3) qualityScore += 25;
    if (portfolioData.projects && portfolioData.projects.some(p => p.url)) qualityScore += 25;
    if (portfolioData.projects && portfolioData.projects.some(p => p.images && p.images.length > 0)) qualityScore += 25;
    if (portfolioData.projects && portfolioData.projects.some(p => p.description && p.description.length > 100)) qualityScore += 25;
    
    metrics.portfolioQuality = Math.min(qualityScore, 100);

    // Technical depth
    const techCount = portfolioData.detectedTechnologies?.all?.length || 0;
    const techCategories = portfolioData.detectedTechnologies ? Object.keys(portfolioData.detectedTechnologies).filter(key => 
      key !== 'all' && key !== 'confidence' && portfolioData.detectedTechnologies[key].length > 0
    ).length : 0;
    
    metrics.technicalDepth = Math.min((techCount * 2) + (techCategories * 10), 100);

    // Innovation level
    const avgInnovation = portfolioData.projects?.reduce((sum, p) => sum + (p.analysis?.innovationScore || 0), 0) / (portfolioData.projects?.length || 1) || 0;
    metrics.innovationLevel = Math.min(avgInnovation * 10, 100);

    // Engineering maturity
    let maturityScore = 0;
    if (portfolioData.engineeringSignals?.fullStack) maturityScore += 25;
    if (portfolioData.engineeringSignals?.technicalLeadership) maturityScore += 25;
    if (portfolioData.engineeringSignals?.seniority === 'senior' || portfolioData.engineeringSignals?.seniority === 'lead') maturityScore += 25;
    if (portfolioData.engineeringSignals?.collaborationSkills > 2) maturityScore += 25;
    
    metrics.engineeringMaturity = Math.min(maturityScore, 100);

    return metrics;
  },

  async flagPortfolio(candidateId, reason, notes = '') {
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

  async unflagPortfolio(candidateId) {
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

  async searchPortfolios(criteria) {
    const query = { flagged: false };
    
    if (criteria.technologies && criteria.technologies.length > 0) {
      query['detectedTechnologies.all'] = { $in: criteria.technologies };
    }
    
    if (criteria.specialization) {
      query['engineeringSignals.specialization'] = criteria.specialization;
    }
    
    if (criteria.seniority) {
      query['engineeringSignals.seniority'] = criteria.seniority;
    }
    
    if (criteria.minPortfolioScore) {
      query.portfolioScore = { $gte: criteria.minPortfolioScore };
    }
    
    if (criteria.location) {
      query['candidateId.location'] = { $regex: criteria.location, $options: 'i' };
    }

    const portfolios = await this.find(query)
      .sort({ portfolioScore: -1 })
      .limit(criteria.limit || 50)
      .populate('candidateId', 'name email portfolioUrl location skills');

    return portfolios;
  },

  async getAggregatedStats(timeRange = '24h') {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const stats = await this.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalPortfolios: { $sum: 1 },
          avgPortfolioScore: { $avg: '$portfolioScore' },
          avgInnovationScore: { $avg: '$engineeringSignals.innovationScore' },
          highQualityPortfolios: {
            $sum: { $cond: [{ $gte: ['$portfolioScore', 70] }, 1, 0] }
          },
          flaggedPortfolios: {
            $sum: { $cond: ['$flagged', 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      totalPortfolios: 0,
      avgPortfolioScore: 0,
      avgInnovationScore: 0,
      highQualityPortfolios: 0,
      flaggedPortfolios: 0
    };
  }
};

portfolioCandidateMetadataSchema.methods = {
  async updateProjectInsights(newProjectInsights) {
    this.projectInsights = newProjectInsights;
    this.portfolioStats.totalProjects = newProjectInsights.length;
    this.portfolioStats.avgProjectScore = newProjectInsights.reduce((sum, p) => sum + (p.projectQuality?.score || 0), 0) / newProjectInsights.length;
    this.portfolioStats.avgInnovationScore = newProjectInsights.reduce((sum, p) => sum + (p.innovationScore?.score || 0), 0) / newProjectInsights.length;
    
    return this.save();
  },

  async updateDetectedTechnologies(newTechnologies) {
    this.detectedTechnologies = newTechnologies;
    this.portfolioStats.totalTechnologies = newTechnologies.all?.length || 0;
    this.portfolioStats.technologyCategories = Object.keys(newTechnologies).filter(key => 
      key !== 'all' && key !== 'confidence' && newTechnologies[key].length > 0
    );
    
    return this.save();
  },

  async updatePortfolioScore(newScore) {
    this.portfolioScore = newScore;
    return this.save();
  },

  async updateEngineeringSignals(newSignals) {
    this.engineeringSignals = newSignals;
    return this.save();
  },

  getPrimarySpecialization() {
    return this.engineeringSignals?.specialization?.[0] || null;
  },

  getTopTechnologies(limit = 10) {
    if (!this.detectedTechnologies?.all) {
      return [];
    }
    
    return this.detectedTechnologies.all.slice(0, limit);
  },

  isFullStackDeveloper() {
    return this.engineeringSignals?.fullStack || false;
  },

  isSeniorDeveloper() {
    return this.engineeringSignals?.seniority === 'senior' || 
           this.engineeringSignals?.seniority === 'lead' || 
           this.engineeringSignals?.seniority === 'principal';
  },

  isActivePortfolio(months = 6) {
    if (!this.crawlMetadata?.lastCrawlAt) return false;
    
    const cutoffDate = new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000);
    return new Date(this.crawlMetadata.lastCrawlAt) > cutoffDate;
  },

  getOverallQualityScore() {
    const metrics = this.qualityMetrics || {};
    return (metrics.profileCompleteness + metrics.portfolioQuality + metrics.technicalDepth + metrics.innovationLevel + metrics.engineeringMaturity) / 5;
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
  }
};

export const PortfolioCandidateMetadata = mongoose.model('PortfolioCandidateMetadata', portfolioCandidateMetadataSchema);
export default PortfolioCandidateMetadata;
