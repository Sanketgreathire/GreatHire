import mongoose from "mongoose";

const sourceMetadataSchema = new mongoose.Schema({
  sourceType: {
    type: String,
    required: true,
    enum: ['github', 'public-profile', 'resume-url', 'linkedin', 'manual', 'api'],
    index: true
  },
  sourceUrl: {
    type: String,
    required: true,
    index: true
  },
  fetchedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ingestionStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'retry'],
    default: 'pending',
    index: true
  },
  connectorName: {
    type: String,
    required: true,
    index: true
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 1.0,
    index: true
  },
  profileData: {
    name: String,
    email: String,
    skills: [String],
    location: String,
    title: String,
    company: String
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SourcingCandidate'
  },
  processingErrors: [{
    error: String,
    timestamp: Date,
    retryCount: Number
  }],
  retryCount: {
    type: Number,
    default: 0
  },
  lastRetryAt: Date,
  completedAt: Date,
  processingDuration: Number, // in milliseconds
  metadata: {
    rawDataSize: Number,
    normalizedDataSize: Number,
    duplicateFound: Boolean,
    duplicateType: String,
    duplicateCandidateId: mongoose.Schema.Types.ObjectId
  },
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  batchId: String,
  jobId: String,
  enriched: {
    type: Boolean,
    default: false
  },
  embedded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'source_metadata'
});

sourceMetadataSchema.index({ sourceType: 1, ingestionStatus: 1 });
sourceMetadataSchema.index({ connectorName: 1, fetchedAt: -1 });
sourceMetadataSchema.index({ candidateId: 1, sourceType: 1 });
sourceMetadataSchema.index({ confidenceScore: 1, fetchedAt: -1 });
sourceMetadataSchema.index({ 'profileData.email': 1 });
sourceMetadataSchema.index({ tags: 1 });

sourceMetadataSchema.statics = {
  async findBySourceType(sourceType, options = {}) {
    const query = { sourceType };
    if (options.status) {
      query.ingestionStatus = options.status;
    }
    if (options.dateFrom) {
      query.fetchedAt = { $gte: options.dateFrom };
    }
    if (options.dateTo) {
      query.fetchedAt = { ...query.fetchedAt, $lte: options.dateTo };
    }
    
    return this.find(query)
      .sort({ fetchedAt: -1 })
      .limit(options.limit || 100);
  },

  async findByConnector(connectorName, options = {}) {
    const query = { connectorName };
    if (options.status) {
      query.ingestionStatus = options.status;
    }
    
    return this.find(query)
      .sort({ fetchedAt: -1 })
      .limit(options.limit || 100);
  },

  async getStatsBySourceType(timeRange = '24h') {
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
          fetchedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$sourceType',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$ingestionStatus', 'completed'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$ingestionStatus', 'failed'] }, 1, 0] }
          },
          processing: {
            $sum: { $cond: [{ $eq: ['$ingestionStatus', 'processing'] }, 1, 0] }
          },
          avgConfidence: { $avg: '$confidenceScore' }
        }
      }
    ]);

    return stats;
  },

  async getStatsByConnector(timeRange = '24h') {
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
          fetchedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$connectorName',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$ingestionStatus', 'completed'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$ingestionStatus', 'failed'] }, 1, 0] }
          },
          processing: {
            $sum: { $cond: [{ $eq: ['$ingestionStatus', 'processing'] }, 1, 0] }
          },
          avgConfidence: { $avg: '$confidenceScore' },
          avgProcessingDuration: { $avg: '$processingDuration' }
        }
      }
    ]);

    return stats;
  },

  async getFailedSources(options = {}) {
    const query = { ingestionStatus: 'failed' };
    
    if (options.connectorName) {
      query.connectorName = options.connectorName;
    }
    
    if (options.dateFrom) {
      query.fetchedAt = { $gte: options.dateFrom };
    }

    return this.find(query)
      .sort({ fetchedAt: -1 })
      .limit(options.limit || 50);
  },

  async getHighConfidenceSources(threshold = 0.8, options = {}) {
    const query = { 
      confidenceScore: { $gte: threshold },
      ingestionStatus: 'completed'
    };
    
    if (options.sourceType) {
      query.sourceType = options.sourceType;
    }

    return this.find(query)
      .sort({ confidenceScore: -1, fetchedAt: -1 })
      .limit(options.limit || 100);
  },

  async getProcessingQueue() {
    return this.find({
      ingestionStatus: { $in: ['pending', 'processing'] }
    })
    .sort({ priority: -1, fetchedAt: -1 })
    .limit(100);
  },

  async markAsCompleted(sourceId, candidateId, duration) {
    return this.findByIdAndUpdate(sourceId, {
      ingestionStatus: 'completed',
      candidateId,
      completedAt: new Date(),
      processingDuration: duration
    });
  },

  async markAsFailed(sourceId, error) {
    return this.findByIdAndUpdate(sourceId, {
      ingestionStatus: 'failed',
      $push: {
        processingErrors: {
          error,
          timestamp: new Date(),
          retryCount: 1
        }
      },
      $inc: { retryCount: 1 },
      lastRetryAt: new Date()
    });
  },

  async retryFailedSources(maxRetries = 3) {
    return this.updateMany(
      {
        ingestionStatus: 'failed',
        retryCount: { $lt: maxRetries }
      },
      {
        ingestionStatus: 'pending',
        $inc: { retryCount: 1 },
        lastRetryAt: new Date()
      }
    );
  }
};

sourceMetadataSchema.methods = {
  async updateStatus(status, additionalData = {}) {
    this.ingestionStatus = status;
    
    if (status === 'completed') {
      this.completedAt = new Date();
    }
    
    Object.assign(this, additionalData);
    return this.save();
  },

  async addProcessingError(error) {
    this.processingErrors.push({
      error,
      timestamp: new Date(),
      retryCount: this.retryCount + 1
    });
    
    this.retryCount += 1;
    this.lastRetryAt = new Date();
    
    return this.save();
  },

  getProcessingDuration() {
    if (this.completedAt && this.fetchedAt) {
      return this.completedAt - this.fetchedAt;
    }
    return null;
  },

  isRetryable(maxRetries = 3) {
    return this.ingestionStatus === 'failed' && this.retryCount < maxRetries;
  },

  getPriorityScore() {
    const priorityScores = { low: 1, medium: 2, high: 3, urgent: 4 };
    return priorityScores[this.priority] || 2;
  }
};

export const SourceMetadata = mongoose.model('SourceMetadata', sourceMetadataSchema);
export default SourceMetadata;
