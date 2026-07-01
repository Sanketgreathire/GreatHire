import mongoose from "mongoose";

const resumeCandidateMetadataSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SourcingCandidate',
    required: true
  },
  documentUrl: {
    type: String,
    required: true,
    unique: true
  },
  documentType: {
    type: String,
    enum: ['pdf', 'doc', 'docx', 'txt'],
    required: true
  },
  parsedSections: {
    type: Map,
    of: String,
    default: {}
  },
  parsingConfidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    index: true
  },
  ingestionMetadata: {
    downloadTime: {
      type: Date,
      default: Date.now
    },
    processingTime: {
      type: Date,
      default: Date.now
    },
    documentSize: {
      type: Number,
      default: 0
    },
    fileName: {
      type: String,
      default: ''
    },
    extractionTime: {
      type: Number,
      default: 0
    },
    parsingTime: {
      type: Number,
      default: 0
    },
    normalizationTime: {
      type: Number,
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
  qualityMetrics: {
    profileCompleteness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    dataQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    structureQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    contentQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  processingMetrics: {
    downloadSuccess: {
      type: Boolean,
      default: false
    },
    extractionSuccess: {
      type: Boolean,
      default: false
    },
    parsingSuccess: {
      type: Boolean,
      default: false
    },
    normalizationSuccess: {
      type: Boolean,
      default: false
    },
    errors: [String],
    warnings: [String]
  }
}, {
  timestamps: true,
  collection: 'resume_candidate_metadata'
});

resumeCandidateMetadataSchema.index({ candidateId: 1, documentUrl: 1 });
resumeCandidateMetadataSchema.index({ documentType: 1 });
resumeCandidateMetadataSchema.index({ parsingConfidence: -1 });
resumeCandidateMetadataSchema.index({ lastSyncedAt: -1 });
resumeCandidateMetadataSchema.index({ syncStatus: 1 });
resumeCandidateMetadataSchema.index({ flagged: 1 });
resumeCandidateMetadataSchema.index({ tags: 1 });
resumeCandidateMetadataSchema.index({ 'ingestionMetadata.downloadTime': -1 });

resumeCandidateMetadataSchema.statics = {
  async findByCandidateId(candidateId) {
    return this.findOne({ candidateId }).populate('candidateId', 'name email resumeUrl location skills');
  },

  async findByDocumentUrl(url) {
    return this.findOne({ documentUrl: url }).populate('candidateId', 'name email resumeUrl location skills');
  },

  async getHighConfidenceResumes(minConfidence = 70, limit = 100) {
    return this.find({
      parsingConfidence: { $gte: minConfidence },
      flagged: false
    })
    .sort({ parsingConfidence: -1 })
    .limit(limit)
    .populate('candidateId', 'name email resumeUrl location skills');
  },

  async getRecentlyProcessed(days = 7, limit = 100) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return this.find({
      'ingestionMetadata.processingTime': { $gte: cutoffDate },
      flagged: false
    })
    .sort({ 'ingestionMetadata.processingTime': -1 })
    .limit(limit)
    .populate('candidateId', 'name email resumeUrl location skills');
  },

  async getByDocumentType(documentType, limit = 50) {
    return this.find({
      documentType,
      flagged: false
    })
    .sort({ parsingConfidence: -1 })
    .limit(limit)
    .populate('candidateId', 'name email resumeUrl location skills');
  },

  async getByParsingConfidence(minConfidence, maxConfidence, limit = 50) {
    return this.find({
      parsingConfidence: { $gte: minConfidence, $lte: maxConfidence },
      flagged: false
    })
    .sort({ parsingConfidence: -1 })
    .limit(limit)
    .populate('candidateId', 'name email resumeUrl location skills');
  },

  async getFlaggedResumes(reason = null, limit = 50) {
    const query = { flagged: true };
    if (reason) {
      query.flagReason = reason;
    }
    
    return this.find(query)
    .sort({ flagged: -1, createdAt: -1 })
    .limit(limit)
    .populate('candidateId', 'name email resumeUrl');
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

  async getDocumentTypeDistribution() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: '$documentType',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$parsingConfidence' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return stats;
  },

  async getParsingConfidenceDistribution() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ['$parsingConfidence', 30] }, then: 'Low (0-30)' },
                { case: { $lte: ['$parsingConfidence', 60] }, then: 'Medium (31-60)' },
                { case: { $lte: ['$parsingConfidence', 80] }, then: 'High (61-80)' },
                { case: { $lte: ['$parsingConfidence', 100] }, then: 'Very High (81-100)' }
              ],
              default: 'Unknown'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    return stats;
  },

  async getQualityMetricsDistribution() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: null,
          avgProfileCompleteness: { $avg: '$qualityMetrics.profileCompleteness' },
          avgDataQuality: { $avg: '$qualityMetrics.dataQuality' },
          avgStructureQuality: { $avg: '$qualityMetrics.structureQuality' },
          avgContentQuality: { $avg: '$qualityMetrics.contentQuality' },
          totalResumes: { $sum: 1 }
        }
      }
    ]);

    return stats[0] || {
      avgProfileCompleteness: 0,
      avgDataQuality: 0,
      avgStructureQuality: 0,
      avgContentQuality: 0,
      totalResumes: 0
    };
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

  async calculateQualityMetrics(resumeData) {
    const metrics = {
      profileCompleteness: 0,
      dataQuality: 0,
      structureQuality: 0,
      contentQuality: 0
    };

    // Profile completeness
    let completenessScore = 0;
    if (resumeData.fullName) completenessScore += 20;
    if (resumeData.email) completenessScore += 15;
    if (resumeData.phone) completenessScore += 10;
    if (resumeData.location) completenessScore += 10;
    if (resumeData.designation) completenessScore += 15;
    if (resumeData.summary) completenessScore += 10;
    if (resumeData.experience && resumeData.experience.length > 0) completenessScore += 10;
    if (resumeData.education && resumeData.education.length > 0) completenessScore += 5;
    if (resumeData.skills && resumeData.skills.length > 0) completenessScore += 5;
    
    metrics.profileCompleteness = Math.min(completenessScore, 100);

    // Data quality
    let dataQualityScore = 0;
    if (resumeData.email && this.isValidEmail(resumeData.email)) dataQualityScore += 25;
    if (resumeData.phone && this.isValidPhone(resumeData.phone)) dataQualityScore += 20;
    if (resumeData.fullName && resumeData.fullName.split(' ').length >= 2) dataQualityScore += 15;
    if (resumeData.location && this.isValidLocation(resumeData.location)) dataQualityScore += 20;
    if (resumeData.experience && resumeData.experience.some(exp => exp.title && exp.company)) dataQualityScore += 20;
    
    metrics.dataQuality = Math.min(dataQualityScore, 100);

    // Structure quality
    let structureQualityScore = 0;
    const sections = Object.keys(resumeData.parsedSections || {});
    if (sections.includes('experience')) structureQualityScore += 25;
    if (sections.includes('education')) structureQualityScore += 25;
    if (sections.includes('skills')) structureQualityScore += 20;
    if (sections.includes('summary')) structureQualityScore += 15;
    if (sections.includes('contact')) structureQualityScore += 15;
    
    metrics.structureQuality = Math.min(structureQualityScore, 100);

    // Content quality
    let contentQualityScore = 0;
    if (resumeData.summary && resumeData.summary.length > 100) contentQualityScore += 25;
    if (resumeData.experience && resumeData.experience.length >= 2) contentQualityScore += 25;
    if (resumeData.experience && resumeData.experience.some(exp => exp.description && exp.description.length > 50)) contentQualityScore += 20;
    if (resumeData.skills && resumeData.skills.length >= 5) contentQualityScore += 15;
    if (resumeData.education && resumeData.education.some(edu => edu.degree && edu.institution)) contentQualityScore += 15;
    
    metrics.contentQuality = Math.min(contentQualityScore, 100);

    return metrics;
  },

  async flagResume(candidateId, reason, notes = '') {
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

  async unflagResume(candidateId) {
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

  async searchResumes(criteria) {
    const query = { flagged: false };
    
    if (criteria.documentType) {
      query.documentType = criteria.documentType;
    }
    
    if (criteria.minConfidence) {
      query.parsingConfidence = { $gte: criteria.minConfidence };
    }
    
    if (criteria.maxConfidence) {
      query.parsingConfidence = query.parsingConfidence || {};
      query.parsingConfidence.$lte = criteria.maxConfidence;
    }
    
    if (criteria.location) {
      query['candidateId.location'] = { $regex: criteria.location, $options: 'i' };
    }

    const resumes = await this.find(query)
      .sort({ parsingConfidence: -1 })
      .limit(criteria.limit || 50)
      .populate('candidateId', 'name email resumeUrl location skills');

    return resumes;
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
          totalResumes: { $sum: 1 },
          avgParsingConfidence: { $avg: '$parsingConfidence' },
          highConfidenceResumes: {
            $sum: { $cond: [{ $gte: ['$parsingConfidence', 70] }, 1, 0] }
          },
          flaggedResumes: {
            $sum: { $cond: ['$flagged', 1, 0] }
          },
          avgDocumentSize: { $avg: '$ingestionMetadata.documentSize' },
          avgProcessingTime: {
            $avg: {
              $subtract: ['$ingestionMetadata.processingTime', '$ingestionMetadata.downloadTime']
            }
          }
        }
      }
    ]);

    return stats[0] || {
      totalResumes: 0,
      avgParsingConfidence: 0,
      highConfidenceResumes: 0,
      flaggedResumes: 0,
      avgDocumentSize: 0,
      avgProcessingTime: 0
    };
  },

  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },

  isValidPhone(phone) {
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
  },

  isValidLocation(location) {
    return location && location.length > 3 && location.split(',').length >= 2;
  }
};

resumeCandidateMetadataSchema.methods = {
  async updateParsedSections(newSections) {
    this.parsedSections = new Map(Object.entries(newSections));
    return this.save();
  },

  async updateParsingConfidence(newConfidence) {
    this.parsingConfidence = newConfidence;
    return this.save();
  },

  async updateIngestionMetadata(newMetadata) {
    this.ingestionMetadata = { ...this.ingestionMetadata, ...newMetadata };
    return this.save();
  },

  async updateQualityMetrics(newMetrics) {
    this.qualityMetrics = { ...this.qualityMetrics, ...newMetrics };
    return this.save();
  },

  async updateProcessingMetrics(newMetrics) {
    this.processingMetrics = { ...this.processingMetrics, ...newMetrics };
    return this.save();
  },

  getOverallQualityScore() {
    const metrics = this.qualityMetrics || {};
    return (metrics.profileCompleteness + metrics.dataQuality + metrics.structureQuality + metrics.contentQuality) / 4;
  },

  isHighQuality() {
    return this.parsingConfidence >= 70 && this.getOverallQualityScore() >= 70;
  },

  isRecentlyProcessed(days = 7) {
    if (!this.ingestionMetadata?.processingTime) return false;
    
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return new Date(this.ingestionMetadata.processingTime) > cutoffDate;
  },

  getProcessingDuration() {
    if (!this.ingestionMetadata?.downloadTime || !this.ingestionMetadata?.processingTime) {
      return null;
    }
    
    return new Date(this.ingestionMetadata.processingTime) - new Date(this.ingestionMetadata.downloadTime);
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

  async addError(error) {
    if (!this.processingMetrics.errors) {
      this.processingMetrics.errors = [];
    }
    this.processingMetrics.errors.push(error);
    return this.save();
  },

  async addWarning(warning) {
    if (!this.processingMetrics.warnings) {
      this.processingMetrics.warnings = [];
    }
    this.processingMetrics.warnings.push(warning);
    return this.save();
  }
};

export const ResumeCandidateMetadata = mongoose.model('ResumeCandidateMetadata', resumeCandidateMetadataSchema);
export default ResumeCandidateMetadata;
