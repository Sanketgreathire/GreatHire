import mongoose from "mongoose";

const connectorStatusSchema = new mongoose.Schema({
  connectorName: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true,
    enum: ['idle', 'running', 'paused', 'error', 'maintenance'],
    default: 'idle'
  },
  lastRun: Date,
  nextRun: Date,
  stats: {
    totalFetched: { type: Number, default: 0 },
    totalProcessed: { type: Number, default: 0 },
    totalDeduplicated: { type: Number, default: 0 },
    totalSaved: { type: Number, default: 0 },
    totalErrors: { type: Number, default: 0 },
    avgProcessingTime: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
  },
  config: {
    enabled: { type: Boolean, default: true },
    priority: { type: Number, default: 5 },
    maxRetries: { type: Number, default: 3 },
    timeout: { type: Number, default: 300000 }, // 5 minutes
    batchSize: { type: Number, default: 50 },
    rateLimit: {
      requestsPerHour: { type: Number, default: 1000 },
      currentUsage: { type: Number, default: 0 },
      resetAt: Date
    },
    customSettings: mongoose.Schema.Types.Mixed
  },
  health: {
    isHealthy: { type: Boolean, default: true },
    lastHealthCheck: Date,
    consecutiveFailures: { type: Number, default: 0 },
    lastError: String,
    uptime: { type: Number, default: 0 }, // in milliseconds
    errorRate: { type: Number, default: 0 }
  },
  schedule: {
    cronExpression: String,
    timezone: { type: String, default: 'UTC' },
    lastScheduledRun: Date,
    nextScheduledRun: Date,
    isScheduled: { type: Boolean, default: false }
  },
  performance: {
    avgFetchTime: { type: Number, default: 0 },
    avgParseTime: { type: Number, default: 0 },
    avgNormalizeTime: { type: Number, default: 0 },
    avgDeduplicateTime: { type: Number, default: 0 },
    avgSaveTime: { type: Number, default: 0 },
    totalProcessingTime: { type: Number, default: 0 }
  },
  metadata: {
    version: String,
    description: String,
    author: String,
    tags: [String],
    documentation: String
  }
}, {
  timestamps: true,
  collection: 'connector_status'
});

connectorStatusSchema.index({ connectorName: 1, status: 1 });
connectorStatusSchema.index({ status: 1, lastRun: -1 });
connectorStatusSchema.index({ 'health.isHealthy': 1 });
connectorStatusSchema.index({ 'schedule.nextScheduledRun': 1 });

connectorStatusSchema.statics = {
  async findByStatus(status) {
    return this.find({ status }).sort({ lastRun: -1 });
  },

  async getActiveConnectors() {
    return this.find({ 
      status: { $in: ['idle', 'running'] },
      'config.enabled': true
    }).sort({ lastRun: -1 });
  },

  async getUnhealthyConnectors() {
    return this.find({ 
      'health.isHealthy': false,
      'config.enabled': true
    }).sort({ lastRun: -1 });
  },

  async getScheduledConnectors() {
    return this.find({ 
      'schedule.isScheduled': true,
      'config.enabled': true
    }).sort({ 'schedule.nextScheduledRun': 1 });
  },

  async updateStats(connectorName, newStats) {
    return this.findOneAndUpdate(
      { connectorName },
      { 
        $set: { 
          'stats.totalFetched': newStats.totalFetched,
          'stats.totalProcessed': newStats.totalProcessed,
          'stats.totalDeduplicated': newStats.totalDeduplicated,
          'stats.totalSaved': newStats.totalSaved,
          'stats.totalErrors': newStats.totalErrors,
          'stats.avgProcessingTime': newStats.avgProcessingTime,
          'stats.successRate': newStats.successRate
        }
      },
      { upsert: true, new: true }
    );
  },

  async updateHealth(connectorName, healthData) {
    return this.findOneAndUpdate(
      { connectorName },
      { 
        $set: { 
          'health.isHealthy': healthData.isHealthy,
          'health.lastHealthCheck': new Date(),
          'health.consecutiveFailures': healthData.consecutiveFailures || 0,
          'health.lastError': healthData.error,
          'health.uptime': healthData.uptime || 0,
          'health.errorRate': healthData.errorRate || 0
        }
      },
      { upsert: true, new: true }
    );
  },

  async getOverallStats() {
    const stats = await this.aggregate([
      {
        $group: {
          _id: null,
          totalConnectors: { $sum: 1 },
          activeConnectors: {
            $sum: { $cond: [{ $in: ['$status', ['idle', 'running']] }, 1, 0] }
          },
          healthyConnectors: {
            $sum: { $cond: ['$health.isHealthy', 1, 0] }
          },
          enabledConnectors: {
            $sum: { $cond: ['$config.enabled', 1, 0] }
          },
          scheduledConnectors: {
            $sum: { $cond: ['$schedule.isScheduled', 1, 0] }
          },
          totalProfilesFetched: { $sum: '$stats.totalFetched' },
          totalProfilesSaved: { $sum: '$stats.totalSaved' },
          avgSuccessRate: { $avg: '$stats.successRate' },
          avgErrorRate: { $avg: '$health.errorRate' }
        }
      }
    ]);

    return stats[0] || {
      totalConnectors: 0,
      activeConnectors: 0,
      healthyConnectors: 0,
      enabledConnectors: 0,
      scheduledConnectors: 0,
      totalProfilesFetched: 0,
      totalProfilesSaved: 0,
      avgSuccessRate: 0,
      avgErrorRate: 0
    };
  },

  async resetStats(connectorName) {
    return this.findOneAndUpdate(
      { connectorName },
      {
        $set: {
          'stats.totalFetched': 0,
          'stats.totalProcessed': 0,
          'stats.totalDeduplicated': 0,
          'stats.totalSaved': 0,
          'stats.totalErrors': 0,
          'stats.avgProcessingTime': 0,
          'stats.successRate': 0
        }
      }
    );
  },

  async enableConnector(connectorName) {
    return this.findOneAndUpdate(
      { connectorName },
      { 'config.enabled': true },
      { upsert: true, new: true }
    );
  },

  async disableConnector(connectorName) {
    return this.findOneAndUpdate(
      { connectorName },
      { 'config.enabled': false },
      { upsert: true, new: true }
    );
  }
};

connectorStatusSchema.methods = {
  async updateStatus(status, additionalData = {}) {
    this.status = status;
    
    if (status === 'running') {
      this.lastRun = new Date();
    }
    
    Object.assign(this, additionalData);
    return this.save();
  },

  async updateConfig(configUpdates) {
    Object.keys(configUpdates).forEach(key => {
      if (key.includes('.')) {
        const keys = key.split('.');
        let current = this.config;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = configUpdates[key];
      } else {
        this.config[key] = configUpdates[key];
      }
    });
    
    return this.save();
  },

  async recordRun(runStats) {
    this.lastRun = new Date();
    
    if (runStats) {
      Object.keys(runStats).forEach(key => {
        if (this.stats[key] !== undefined) {
          this.stats[key] = runStats[key];
        }
      });
    }
    
    return this.save();
  },

  async recordError(error) {
    this.health.lastError = error;
    this.health.consecutiveFailures += 1;
    this.health.errorRate = this.calculateErrorRate();
    
    if (this.health.consecutiveFailures >= 3) {
      this.health.isHealthy = false;
      this.status = 'error';
    }
    
    return this.save();
  },

  async recordSuccess() {
    this.health.consecutiveFailures = 0;
    this.health.isHealthy = true;
    this.health.errorRate = this.calculateErrorRate();
    
    if (this.status === 'error') {
      this.status = 'idle';
    }
    
    return this.save();
  },

  calculateErrorRate() {
    if (this.stats.totalFetched === 0) return 0;
    return (this.stats.totalErrors / this.stats.totalFetched) * 100;
  },

  isHealthy() {
    return this.health.isHealthy && this.config.enabled;
  },

  canRun() {
    return this.config.enabled && 
           this.status !== 'maintenance' && 
           this.health.isHealthy;
  },

  getNextRunTime() {
    if (this.schedule.isScheduled && this.schedule.cronExpression) {
      return this.schedule.nextScheduledRun;
    }
    return null;
  },

  getPerformanceMetrics() {
    return {
      avgFetchTime: this.performance.avgFetchTime,
      avgParseTime: this.performance.avgParseTime,
      avgNormalizeTime: this.performance.avgNormalizeTime,
      avgDeduplicateTime: this.performance.avgDeduplicateTime,
      avgSaveTime: this.performance.avgSaveTime,
      totalProcessingTime: this.performance.totalProcessingTime,
      efficiency: this.calculateEfficiency()
    };
  },

  calculateEfficiency() {
    if (this.performance.totalProcessingTime === 0 || this.stats.totalSaved === 0) return 0;
    return (this.stats.totalSaved / (this.performance.totalProcessingTime / 1000)).toFixed(2); // profiles per second
  }
};

export const ConnectorStatus = mongoose.model('ConnectorStatus', connectorStatusSchema);
export default ConnectorStatus;
