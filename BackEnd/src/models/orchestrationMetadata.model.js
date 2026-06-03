import mongoose from "mongoose";

const orchestrationMetadataSchema = new mongoose.Schema({
  orchestrationId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'start', 'complete', 'connector_complete', 'connector_error', 'pipeline_complete',
      'schedule_created', 'schedule_updated', 'schedule_removed', 'schedule_added',
      'schedule_config', 'job_start', 'job_complete', 'job_error', 'job_retry',
      'dead_letter', 'dead_letter_retry', 'dead_letter_clear', 'queue_metrics',
      'health_check', 'health_alert', 'status_check', 'connector_config_update',
      'stage_enable', 'stage_disable', 'connector_restart', 'system', 'slot_acquired',
      'slot_released', 'api_call_success', 'api_call_error', 'queue_restarted',
      'queue_cleared', 'queue_paused', 'queue_resumed', 'thresholds_updated',
      'strategy_updated', 'failure', 'success', 'retry', 'dead_letter_processed',
      'load_balancing', 'auto_scaling_enabled', 'auto_scaling_disabled',
      'distributed_scaling_prepared', 'orchestrate-discovery', 'orchestrate-connector',
      'orchestrate-pipeline', 'health-check', 'load-balancing', 'scheduled-orchestration',
      'discovery_orchestration_complete', 'connector_orchestration_complete',
      'pipeline_orchestration_complete', 'health_check_complete', 'load_balancing_complete',
      'scheduled_orchestration_complete', 'limits_updated', 'api_limits_updated'
    ],
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  connector: {
    type: String,
    index: true
  },
  queueName: {
    type: String,
    index: true
  },
  jobId: {
    type: String
  },
  workerId: {
    type: String,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  duration: {
    type: Number,
    default: 0
  },
  error: {
    message: String,
    stack: String,
    name: String
  },
  metadata: {
    source: String,
    version: String,
    environment: String,
    nodeId: String,
    processId: String
  }
}, {
  timestamps: true,
  collection: 'orchestration_metadata'
});

orchestrationMetadataSchema.index({ orchestrationId: 1, timestamp: 1 });
orchestrationMetadataSchema.index({ eventType: 1, timestamp: -1 });
orchestrationMetadataSchema.index({ connector: 1, timestamp: -1 });
orchestrationMetadataSchema.index({ queueName: 1, timestamp: -1 });
orchestrationMetadataSchema.index({ jobId: 1, timestamp: -1 });
orchestrationMetadataSchema.index({ workerId: 1, timestamp: -1 });
orchestrationMetadataSchema.index({ status: 1, timestamp: -1 });
orchestrationMetadataSchema.index({ priority: 1, timestamp: -1 });

orchestrationMetadataSchema.statics = {
  async findByOrchestrationId(orchestrationId) {
    return this.find({ orchestrationId }).sort({ timestamp: 1 });
  },

  async findByEventType(eventType, limit = 100) {
    return this.find({ eventType })
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  async findByConnector(connector, limit = 50) {
    return this.find({ connector })
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  async findByQueueName(queueName, limit = 50) {
    return this.find({ queueName })
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  async findByJobId(jobId) {
    return this.find({ jobId }).sort({ timestamp: 1 });
  },

  async findByWorkerId(workerId, limit = 50) {
    return this.find({ workerId })
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  async findByStatus(status, limit = 100) {
    return this.find({ status })
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  async findByTimeRange(startDate, endDate, eventType = null) {
    const query = {
      timestamp: { $gte: startDate, $lte: endDate }
    };

    if (eventType) {
      query.eventType = eventType;
    }

    return this.find(query).sort({ timestamp: 1 });
  },

  async getEventCounts(timeRange = '24h') {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
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

    const counts = await this.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          lastOccurrence: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return counts.reduce((acc, count) => {
      acc[count._id] = {
        count: count.count,
        lastOccurrence: count.lastOccurrence
      };
      return acc;
    }, {});
  },

  async getConnectorStats(timeRange = '24h') {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
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
          timestamp: { $gte: startDate },
          connector: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$connector',
          totalEvents: { $sum: 1 },
          successes: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'connector_complete'] }, 1, 0]
            }
          },
          failures: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'connector_error'] }, 1, 0]
            }
          },
          retries: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'job_retry'] }, 1, 0]
            }
          },
          lastEvent: { $max: '$timestamp' }
        }
      },
      { $sort: { totalEvents: -1 } }
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = {
        totalEvents: stat.totalEvents,
        successes: stat.successes,
        failures: stat.failures,
        retries: stat.retries,
        successRate: stat.totalEvents > 0 ? (stat.successes / stat.totalEvents * 100).toFixed(2) : 0,
        lastEvent: stat.lastEvent
      };
      return acc;
    }, {});
  },

  async getQueueStats(timeRange = '24h') {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
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
          timestamp: { $gte: startDate },
          queueName: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$queueName',
          totalEvents: { $sum: 1 },
          restarts: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'queue_restarted'] }, 1, 0]
            }
          },
          clears: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'queue_cleared'] }, 1, 0]
            }
          },
          pauses: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'queue_paused'] }, 1, 0]
            }
          },
          resumes: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'queue_resumed'] }, 1, 0]
            }
          },
          lastEvent: { $max: '$timestamp' }
        }
      },
      { $sort: { totalEvents: -1 } }
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = {
        totalEvents: stat.totalEvents,
        restarts: stat.restarts,
        clears: stat.clears,
        pauses: stat.pauses,
        resumes: stat.resumes,
        lastEvent: stat.lastEvent
      };
      return acc;
    }, {});
  },

  async getOrchestrationSummary(orchestrationId) {
    const events = await this.findByOrchestrationId(orchestrationId);
    
    if (events.length === 0) {
      return null;
    }

    const startEvent = events.find(e => e.eventType === 'start');
    const completeEvent = events.find(e => e.eventType === 'complete');
    const errorEvents = events.filter(e => e.eventType.includes('error'));
    const retryEvents = events.filter(e => e.eventType.includes('retry'));

    return {
      orchestrationId,
      startTime: startEvent?.timestamp,
      endTime: completeEvent?.timestamp,
      duration: completeEvent && startEvent ? 
        new Date(completeEvent.timestamp) - new Date(startEvent.timestamp) : 0,
      status: completeEvent ? 'completed' : errorEvents.length > 0 ? 'failed' : 'running',
      totalEvents: events.length,
      errors: errorEvents.length,
      retries: retryEvents.length,
      events: events.map(e => ({
        eventType: e.eventType,
        timestamp: e.timestamp,
        data: e.data
      }))
    };
  },

  async getSystemHealth(timeRange = '1h') {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '15m':
        startDate = new Date(now.getTime() - 15 * 60 * 1000);
        break;
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
    }

    const health = await this.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          errorEvents: {
            $sum: {
              $cond: [{ $regexMatch: [{ $eq: ['$eventType', 'error'] }, 1, 0] }]
            }
          },
          healthAlerts: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'health_alert'] }, 1, 0]
            }
          },
          deadLetters: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'dead_letter'] }, 1, 0]
            }
          },
          lastEvent: { $max: '$timestamp' }
        }
      }
    ]);

    const result = health[0] || {
      totalEvents: 0,
      errorEvents: 0,
      healthAlerts: 0,
      deadLetters: 0,
      lastEvent: null
    };

    const errorRate = result.totalEvents > 0 ? (result.errorEvents / result.totalEvents * 100) : 0;
    
    let status = 'healthy';
    if (errorRate > 20 || result.healthAlerts > 5) {
      status = 'critical';
    } else if (errorRate > 10 || result.healthAlerts > 2) {
      status = 'unhealthy';
    } else if (errorRate > 5 || result.healthAlerts > 0) {
      status = 'degraded';
    }

    return {
      status,
      timeRange,
      period: { start: startDate, end: now },
      metrics: result,
      errorRate: errorRate.toFixed(2)
    };
  },

  async cleanupOldEvents(daysToKeep = 30) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await this.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    return {
      deletedCount: result.deletedCount,
      cutoffDate
    };
  },

  async getEventTimeline(orchestrationId) {
    const events = await this.findByOrchestrationId(orchestrationId);
    
    return events.map(event => ({
      eventType: event.eventType,
      timestamp: event.timestamp,
      data: event.data,
      duration: event.duration,
      status: event.status
    }));
  },

  async getPerformanceMetrics(timeRange = '24h') {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const metrics = await this.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          duration: { $exists: true, $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          minDuration: { $min: '$duration' },
          maxDuration: { $max: '$duration' },
          totalDuration: { $sum: '$duration' }
        }
      },
      { $sort: { totalDuration: -1 } }
    ]);

    return metrics.reduce((acc, metric) => {
      acc[metric._id] = {
        count: metric.count,
        avgDuration: Math.round(metric.avgDuration),
        minDuration: metric.minDuration,
        maxDuration: metric.maxDuration,
        totalDuration: metric.totalDuration
      };
      return acc;
    }, {});
  }
};

orchestrationMetadataSchema.methods = {
  getEventData() {
    return this.data || {};
  },

  hasError() {
    return this.error && this.error.message;
  },

  getDuration() {
    return this.duration || 0;
  },

  isCompleted() {
    return this.status === 'completed';
  },

  isFailed() {
    return this.status === 'failed';
  },

  isRunning() {
    return this.status === 'running';
  },

  getAge() {
    return Date.now() - new Date(this.timestamp).getTime();
  },

  async addMetadata(key, value) {
    if (!this.metadata) {
      this.metadata = {};
    }
    this.metadata[key] = value;
    return this.save();
  },

  async updateStatus(newStatus) {
    this.status = newStatus;
    return this.save();
  },

  async addError(error) {
    this.error = {
      message: error.message,
      stack: error.stack,
      name: error.name
    };
    this.status = 'failed';
    return this.save();
  }
};

export const OrchestrationMetadata = mongoose.model('OrchestrationMetadata', orchestrationMetadataSchema);
export default OrchestrationMetadata;
