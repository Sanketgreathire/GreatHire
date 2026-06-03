import mongoose from "mongoose";

const ingestionHistorySchema = new mongoose.Schema({
  connectorName: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['queued', 'running', 'completed', 'failed', 'cancelled', 'retry'],
    default: 'queued',
    index: true
  },
  jobId: {
    type: String,
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  completedAt: Date,
  duration: Number, // in milliseconds
  options: {
    limit: Number,
    query: String,
    urls: [String],
    priority: String
  },
  result: {
    success: Boolean,
    results: [mongoose.Schema.Types.Mixed],
    stats: {
      totalFetched: Number,
      totalProcessed: Number,
      totalDeduplicated: Number,
      totalSaved: Number,
      totalErrors: Number
    },
    message: String
  },
  error: String,
  errorDetails: {
    stack: String,
    type: String,
    code: String
  },
  type: {
    type: String,
    enum: ['manual', 'scheduled', 'automatic'],
    default: 'manual'
  },
  triggeredBy: {
    type: String,
    default: 'system'
  },
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  nextRetryAt: Date,
  metadata: {
    userAgent: String,
    ip: String,
    source: String
  },
  performance: {
    fetchTime: Number,
    parseTime: Number,
    normalizeTime: Number,
    deduplicateTime: Number,
    saveTime: Number
  },
  batchId: String,
  parentJobId: String
}, {
  timestamps: true,
  collection: 'ingestion_history'
});

ingestionHistorySchema.index({ connectorName: 1, startedAt: -1 });
ingestionHistorySchema.index({ status: 1, startedAt: -1 });
ingestionHistorySchema.index({ type: 1, startedAt: -1 });
ingestionHistorySchema.index({ jobId: 1 });
ingestionHistorySchema.index({ 'result.success': 1, startedAt: -1 });

ingestionHistorySchema.statics = {
  async findByConnector(connectorName, options = {}) {
    const query = { connectorName };
    if (options.status) {
      query.status = options.status;
    }
    if (options.type) {
      query.type = options.type;
    }
    if (options.dateFrom) {
      query.startedAt = { $gte: options.dateFrom };
    }
    if (options.dateTo) {
      query.startedAt = { ...query.startedAt, $lte: options.dateTo };
    }
    
    return this.find(query)
      .sort({ startedAt: -1 })
      .limit(options.limit || 100);
  },

  async getRecentHistory(limit = 50) {
    return this.find()
      .sort({ startedAt: -1 })
      .limit(limit);
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
          startedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$connectorName',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          running: {
            $sum: { $cond: [{ $eq: ['$status', 'running'] }, 1, 0] }
          },
          avgDuration: { $avg: '$duration' },
          successRate: {
            $avg: { $cond: [{ $eq: ['$result.success', true] }, 1, 0] }
          }
        }
      }
    ]);

    return stats;
  },

  async getOverallStats(timeRange = '24h') {
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
          startedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          running: {
            $sum: { $cond: [{ $eq: ['$status', 'running'] }, 1, 0] }
          },
          queued: {
            $sum: { $cond: [{ $eq: ['$status', 'queued'] }, 1, 0] }
          },
          avgDuration: { $avg: '$duration' },
          totalProfiles: {
            $sum: '$result.stats.totalFetched'
          },
          totalSaved: {
            $sum: '$result.stats.totalSaved'
          },
          totalErrors: {
            $sum: '$result.stats.totalErrors'
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      completed: 0,
      failed: 0,
      running: 0,
      queued: 0,
      avgDuration: 0,
      totalProfiles: 0,
      totalSaved: 0,
      totalErrors: 0
    };
  },

  async getFailedJobs(options = {}) {
    const query = { status: 'failed' };
    
    if (options.connectorName) {
      query.connectorName = options.connectorName;
    }
    
    if (options.dateFrom) {
      query.startedAt = { $gte: options.dateFrom };
    }

    return this.find(query)
      .sort({ startedAt: -1 })
      .limit(options.limit || 50);
  },

  async getRunningJobs() {
    return this.find({ status: 'running' })
      .sort({ startedAt: -1 });
  },

  async getJobsNeedingRetry() {
    const now = new Date();
    return this.find({
      status: 'failed',
      retryCount: { $lt: 3 },
      $or: [
        { nextRetryAt: { $lte: now } },
        { nextRetryAt: { $exists: false } }
      ]
    })
    .sort({ startedAt: -1 });
  },

  async markAsCompleted(jobId, result, duration) {
    return this.findOneAndUpdate(
      { jobId },
      {
        status: 'completed',
        completedAt: new Date(),
        duration,
        result
      }
    );
  },

  async markAsFailed(jobId, error, errorDetails) {
    return this.findOneAndUpdate(
      { jobId },
      {
        status: 'failed',
        completedAt: new Date(),
        error,
        errorDetails,
        $inc: { retryCount: 1 }
      }
    );
  },

  async scheduleRetry(jobId, delayMinutes = 5) {
    const nextRetryAt = new Date(Date.now() + delayMinutes * 60 * 1000);
    return this.findOneAndUpdate(
      { jobId },
      {
        status: 'retry',
        nextRetryAt,
        $inc: { retryCount: 1 }
      }
    );
  }
};

ingestionHistorySchema.methods = {
  async updateStatus(status, additionalData = {}) {
    this.status = status;
    
    if (status === 'completed') {
      this.completedAt = new Date();
      this.duration = this.completedAt - this.startedAt;
    }
    
    Object.assign(this, additionalData);
    return this.save();
  },

  getDuration() {
    if (this.completedAt && this.startedAt) {
      return this.completedAt - this.startedAt;
    }
    return null;
  },

  isRetryable() {
    return this.status === 'failed' && this.retryCount < this.maxRetries;
  },

  canRetryNow() {
    return this.isRetryable() && (!this.nextRetryAt || this.nextRetryAt <= new Date());
  },

  getSuccessRate() {
    if (!this.result || !this.result.stats) return 0;
    const stats = this.result.stats;
    if (stats.totalFetched === 0) return 0;
    return ((stats.totalSaved / stats.totalFetched) * 100).toFixed(2);
  },

  getEfficiency() {
    if (!this.duration || !this.result || !this.result.stats) return 0;
    const stats = this.result.stats;
    return (stats.totalSaved / (this.duration / 1000)).toFixed(2); // profiles per second
  }
};

export const IngestionHistory = mongoose.model('IngestionHistory', ingestionHistorySchema);
export default IngestionHistory;
