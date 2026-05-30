import mongoose from "mongoose";

const eventMetadataSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  eventStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'retrying'],
    default: 'pending'
  },
  eventPayload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  metadata: {
    source: {
      type: String,
      required: true
    },
    version: {
      type: String,
      default: '1.0'
    },
    correlationId: {
      type: String
    },
    causationId: {
      type: String
    },
    messageId: {
      type: String
    },
    userId: {
      type: String
    },
    sessionId: {
      type: String
    },
    tenantId: {
      type: String
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    retryCount: {
      type: Number,
      default: 0,
      min: 0
    },
    maxRetries: {
      type: Number,
      default: 3,
      min: 0
    },
    timestamp: {
      type: Date,
      required: true
    },
    producedAt: {
      type: Date
    },
    consumedAt: {
      type: Date
    },
    processedAt: {
      type: Date
    },
    processingLatency: {
      type: Number,
      min: 0
    },
    consumerId: {
      type: String
    },
    topic: {
      type: String
    },
    partition: {
      type: Number
    },
    offset: {
      type: Number
    },
    headers: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    batchId: {
      type: String
    },
    batchSize: {
      type: Number,
      min: 1
    }
  },
  processingInfo: {
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    duration: {
      type: Number,
      min: 0
    },
    workerId: {
      type: String
    },
    consumerGroup: {
      type: String
    },
    processingAttempts: {
      type: Number,
      default: 0,
      min: 0
    },
    lastError: {
      type: String
    },
    lastErrorTimestamp: {
      type: Date
    },
    errorStack: {
      type: String
    }
  },
  retryInfo: {
    retryHistory: [{
      retryNumber: {
        type: Number,
        required: true
      },
      retryAt: {
        type: Date,
        required: true
      },
      retryReason: {
        type: String,
        required: true
      },
      retryDelay: {
        type: Number,
        min: 0
      },
      success: {
        type: Boolean,
        default: false
      }
    }],
    totalRetries: {
      type: Number,
      default: 0
    },
    nextRetryAt: {
      type: Date
    },
    maxRetryDelay: {
      type: Number,
      default: 300000 // 5 minutes
    }
  },
  deadLetterInfo: {
    movedToDeadLetter: {
      type: Boolean,
      default: false
    },
    deadLetterAt: {
      type: Date
    },
    deadLetterReason: {
      type: String
    },
    originalEventId: {
      type: String
    }
  },
  performanceMetrics: {
    queueWaitTime: {
      type: Number,
      min: 0
    },
    processingTime: {
      type: Number,
      min: 0
    },
    networkLatency: {
      type: Number,
      min: 0
    },
    serializationTime: {
      type: Number,
      min: 0
    },
    deserializationTime: {
      type: Number,
      min: 0
    },
    memoryUsage: {
      type: Number,
      min: 0
    },
    cpuUsage: {
      type: Number,
      min: 0
    }
  },
  businessMetrics: {
    candidateId: {
      type: String
    },
    pipelineStage: {
      type: String
    },
    dataQuality: {
      completeness: {
        type: Number,
        min: 0,
        max: 1
      },
      accuracy: {
        type: Number,
        min: 0,
        max: 1
      },
      freshness: {
        type: Number,
        min: 0,
        max: 1
      }
    },
    impactScore: {
      type: Number,
      min: 0,
      max: 100
    },
    businessValue: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }
  },
  systemInfo: {
    hostname: {
      type: String
    },
    pid: {
      type: Number
    },
    version: {
      type: String
    },
    environment: {
      type: String,
      enum: ['development', 'staging', 'production']
    },
    region: {
      type: String
    },
    availabilityZone: {
      type: String
    }
  },
  tags: [{
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'event_metadata'
});

// Indexes for efficient querying
eventMetadataSchema.index({ eventId: 1 }, { unique: true });
eventMetadataSchema.index({ eventType: 1, eventStatus: 1 });
eventMetadataSchema.index({ 'metadata.source': 1, eventStatus: 1 });
eventMetadataSchema.index({ 'metadata.correlationId': 1 });
eventMetadataSchema.index({ 'metadata.timestamp': -1 });
eventMetadataSchema.index({ 'processingInfo.startTime': -1 });
eventMetadataSchema.index({ 'processingInfo.endTime': -1 });
eventMetadataSchema.index({ 'businessMetrics.candidateId': 1 });
eventMetadataSchema.index({ 'businessMetrics.pipelineStage': 1 });
eventMetadataSchema.index({ 'performanceMetrics.processingTime': -1 });
eventMetadataSchema.index({ 'retryInfo.nextRetryAt': 1 });
eventMetadataSchema.index({ 'deadLetterInfo.deadLetterAt': -1 });

// Compound indexes for complex queries
eventMetadataSchema.index({ 
  eventType: 1, 
  eventStatus: 1, 
  'metadata.timestamp': -1 
});

eventMetadataSchema.index({ 
  'metadata.source': 1, 
  'businessMetrics.candidateId': 1, 
  'businessMetrics.pipelineStage': 1 
});

eventMetadataSchema.index({ 
  eventStatus: 1, 
  'retryInfo.nextRetryAt': 1 
});

// TTL index for automatic cleanup (90 days)
eventMetadataSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 90 * 24 * 60 * 60 
});

eventMetadataSchema.statics = {
  async findByEventId(eventId) {
    return this.findOne({ eventId });
  },

  async findByEventType(eventType, limit = 100) {
    return this.find({ eventType })
      .sort({ 'metadata.timestamp': -1 })
      .limit(limit);
  },

  async findByCorrelationId(correlationId, limit = 100) {
    return this.find({ 'metadata.correlationId': correlationId })
      .sort({ 'metadata.timestamp': 1 })
      .limit(limit);
  },

  async findByStatus(eventStatus, limit = 100) {
    return this.find({ eventStatus })
      .sort({ 'metadata.timestamp': -1 })
      .limit(limit);
  },

  async findBySource(source, limit = 100) {
    return this.find({ 'metadata.source': source })
      .sort({ 'metadata.timestamp': -1 })
      .limit(limit);
  },

  async findByCandidateId(candidateId, limit = 100) {
    return this.find({ 'businessMetrics.candidateId': candidateId })
      .sort({ 'metadata.timestamp': -1 })
      .limit(limit);
  },

  async findByPipelineStage(pipelineStage, limit = 100) {
    return this.find({ 'businessMetrics.pipelineStage': pipelineStage })
      .sort({ 'metadata.timestamp': -1 })
      .limit(limit);
  },

  async findByTimeRange(startDate, endDate, limit = 100) {
    return this.find({
      'metadata.timestamp': {
        $gte: startDate,
        $lte: endDate
      }
    })
      .sort({ 'metadata.timestamp': -1 })
      .limit(limit);
  },

  async findFailedEvents(limit = 100) {
    return this.find({ eventStatus: 'failed' })
      .sort({ 'metadata.timestamp': -1 })
      .limit(limit);
  },

  async findRetryableEvents(limit = 100) {
    return this.find({
      eventStatus: 'failed',
      'retryInfo.totalRetries': { $lt: 3 }
    })
      .sort({ 'metadata.timestamp': -1 })
      .limit(limit);
  },

  async findDeadLetterEvents(limit = 100) {
    return this.find({ 'deadLetterInfo.movedToDeadLetter': true })
      .sort({ 'deadLetterInfo.deadLetterAt': -1 })
      .limit(limit);
  },

  async findStalledEvents(hoursThreshold = 24, limit = 100) {
    const thresholdDate = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);
    
    return this.find({
      eventStatus: 'processing',
      'processingInfo.startTime': { $lt: thresholdDate }
    })
      .sort({ 'processingInfo.startTime': -1 })
      .limit(limit);
  },

  async getEventStatistics(timeRange = '24h') {
    let startDate;
    const now = new Date();
    
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

    const pipeline = [
      {
        $match: {
          'metadata.timestamp': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          completedEvents: { $sum: { $cond: [{ $eq: ['$eventStatus', 'completed'] }, 1, 0] } },
          failedEvents: { $sum: { $cond: [{ $eq: ['$eventStatus', 'failed'] }, 1, 0] } },
          retryingEvents: { $sum: { $cond: [{ $eq: ['$eventStatus', 'retrying'] }, 1, 0] } },
          deadLetterEvents: { $sum: { $cond: [{ $eq: ['$deadLetterInfo.movedToDeadLetter', true] }, 1, 0] } },
          averageProcessingTime: { $avg: '$performanceMetrics.processingTime' },
          maxProcessingTime: { $max: '$performanceMetrics.processingTime' },
          minProcessingTime: { $min: '$performanceMetrics.processingTime' },
          averageLatency: { $avg: '$processingLatency' },
          eventTypes: { $addToSet: '$eventType' },
          sources: { $addToSet: '$metadata.source' }
        }
      },
      {
        $project: {
          _id: 0,
          totalEvents: 1,
          completedEvents: 1,
          failedEvents: 1,
          retryingEvents: 1,
          deadLetterEvents: 1,
          averageProcessingTime: { $round: ['$averageProcessingTime', 2] },
          maxProcessingTime: { $round: ['$maxProcessingTime', 2] },
          minProcessingTime: { $round: ['$minProcessingTime', 2] },
          averageLatency: { $round: ['$averageLatency', 2] },
          eventTypes: 1,
          sources: 1,
          successRate: { $round: [{ $divide: ['$completedEvents', '$totalEvents'] }, 2] },
          failureRate: { $round: [{ $divide: ['$failedEvents', '$totalEvents'] }, 2] }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      totalEvents: 0,
      completedEvents: 0,
      failedEvents: 0,
      retryingEvents: 0,
      deadLetterEvents: 0,
      averageProcessingTime: 0,
      maxProcessingTime: 0,
      minProcessingTime: 0,
      averageLatency: 0,
      eventTypes: [],
      sources: [],
      successRate: 0,
      failureRate: 0
    };
  },

  async getEventCountsByType(timeRange = '24h') {
    const stats = await this.getEventStatistics(timeRange);
    
    return {
      timeRange,
      eventTypes: stats.eventTypes,
      totalEvents: stats.totalEvents,
      timestamp: new Date()
    };
  },

  async getProcessingMetrics(timeRange = '24h') {
    const stats = await this.getEventStatistics(timeRange);
    
    return {
      timeRange,
      processingMetrics: {
        averageProcessingTime: stats.averageProcessingTime,
        maxProcessingTime: stats.maxProcessingTime,
        minProcessingTime: stats.minProcessingTime,
        averageLatency: stats.averageLatency
      },
      timestamp: new Date()
    };
  },

  async getFailureAnalysis(timeRange = '24h') {
    const stats = await this.getEventStatistics(timeRange);
    
    return {
      timeRange,
      failureAnalysis: {
        totalFailed: stats.failedEvents,
        failureRate: stats.failureRate,
        deadLetterEvents: stats.deadLetterEvents,
        retryingEvents: stats.retryingEvents
      },
      timestamp: new Date()
    };
  },

  async updateEventStatus(eventId, status, updateData = {}) {
    const update = {
      eventStatus: status,
      updatedAt: new Date()
    };

    if (status === 'processing') {
      update['processingInfo.startTime'] = new Date();
    } else if (status === 'completed') {
      update['processingInfo.endTime'] = new Date();
      if (updateData.duration) {
        update['processingInfo.duration'] = updateData.duration;
      }
    } else if (status === 'failed') {
      update['processingInfo.lastError'] = updateData.error || 'Unknown error';
      update['processingInfo.lastErrorTimestamp'] = new Date();
      if (updateData.errorStack) {
        update['processingInfo.errorStack'] = updateData.errorStack;
      }
    }

    return this.updateOne({ eventId }, update);
  },

  async addRetryAttempt(eventId, retryReason, retryDelay = 0) {
    const retryAttempt = {
      retryNumber: 1,
      retryAt: new Date(),
      retryReason,
      retryDelay,
      success: false
    };

    const update = {
      $push: {
        'retryInfo.retryHistory': retryAttempt
      },
      $inc: {
        'retryInfo.totalRetries': 1,
        'metadata.retryCount': 1
      },
      'retryInfo.nextRetryAt': new Date(Date.now() + retryDelay),
      'eventStatus': 'retrying',
      updatedAt: new Date()
    };

    return this.updateOne({ eventId }, update);
  },

  async moveToDeadLetter(eventId, reason) {
    const update = {
      'deadLetterInfo.movedToDeadLetter': true,
      'deadLetterInfo.deadLetterAt': new Date(),
      'deadLetterInfo.deadLetterReason': reason,
      'eventStatus': 'failed',
      updatedAt: new Date()
    };

    return this.updateOne({ eventId }, update);
  },

  async addTag(eventId, key, value) {
    const update = {
      $push: {
        tags: {
          key,
          value,
          timestamp: new Date()
        }
      },
      updatedAt: new Date()
    };

    return this.updateOne({ eventId }, update);
  },

  async cleanupOldEvents(daysThreshold = 90) {
    const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
    
    const result = await this.deleteMany({
      createdAt: { $lt: thresholdDate }
    });

    console.log(`Cleaned up ${result.deletedCount} old events`);
    return result;
  },

  async getEventFlow(correlationId) {
    const events = await this.findByCorrelationId(correlationId);
    
    return events.map(event => ({
      eventId: event.eventId,
      eventType: event.eventType,
      eventStatus: event.eventStatus,
      timestamp: event.metadata.timestamp,
      processingTime: event.performanceMetrics.processingTime,
      source: event.metadata.source,
      candidateId: event.businessMetrics.candidateId,
      pipelineStage: event.businessMetrics.pipelineStage
    }));
  },

  async getPerformanceMetrics(timeRange = '24h') {
    const pipeline = [
      {
        $match: {
          'metadata.timestamp': {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            eventType: '$eventType',
            source: '$metadata.source'
          },
          avgProcessingTime: { $avg: '$performanceMetrics.processingTime' },
          maxProcessingTime: { $max: '$performanceMetrics.processingTime' },
          minProcessingTime: { $min: '$performanceMetrics.processingTime' },
          avgLatency: { $avg: '$processingLatency' },
          eventCount: { $sum: 1 },
          completedCount: { $sum: { $cond: [{ $eq: ['$eventStatus', 'completed'] }, 1, 0] } },
          failedCount: { $sum: { $cond: [{ $eq: ['$eventStatus', 'failed'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          eventType: '$_id.eventType',
          source: '$_id.source',
          avgProcessingTime: { $round: ['$avgProcessingTime', 2] },
          maxProcessingTime: { $round: ['$maxProcessingTime', 2] },
          minProcessingTime: { $round: ['$minProcessingTime', 2] },
          avgLatency: { $round: ['$avgLatency', 2] },
          eventCount: 1,
          completedCount: 1,
          failedCount: 1,
          successRate: { $round: [{ $divide: ['$completedCount', '$eventCount'] }, 2] },
          failureRate: { $round: [{ $divide: ['$failedCount', '$eventCount'] }, 2] }
        }
      }
    ];

    return this.aggregate(pipeline);
  }
};

eventMetadataSchema.methods = {
  getProcessingDuration() {
    if (this.processingInfo.startTime && this.processingInfo.endTime) {
      return this.processingInfo.endTime - this.processingInfo.startTime;
    }
    return null;
  },

  isCompleted() {
    return this.eventStatus === 'completed';
  },

  isFailed() {
    return this.eventStatus === 'failed';
  },

  isProcessing() {
    return this.eventStatus === 'processing';
  },

  isRetryable() {
    return this.isFailed() && this.retryInfo.totalRetries < this.metadata.maxRetries;
  },

  isInDeadLetter() {
    return this.deadLetterInfo.movedToDeadLetter;
  },

  getAge() {
    return Date.now() - new Date(this.metadata.timestamp).getTime();
  },

  getTags() {
    return this.tags || [];
  },

  addTag(key, value) {
    this.tags.push({
      key,
      value,
      timestamp: new Date()
    });
    this.markModified('tags');
  },

  updateStatus(status, additionalData = {}) {
    this.eventStatus = status;
    this.updatedAt = new Date();
    
    if (status === 'processing') {
      this.processingInfo.startTime = new Date();
    } else if (status === 'completed') {
      this.processingInfo.endTime = new Date();
      if (additionalData.duration) {
        this.processingInfo.duration = additionalData.duration;
      }
    } else if (status === 'failed') {
      this.processingInfo.lastError = additionalData.error || 'Unknown error';
      this.processingInfo.lastErrorTimestamp = new Date();
      if (additionalData.errorStack) {
        this.processingInfo.errorStack = additionalData.errorStack;
      }
    }
    
    this.markModified('eventStatus');
    this.markModified('processingInfo');
  },

  recordRetry(retryReason, retryDelay = 0) {
    const retryAttempt = {
      retryNumber: this.retryInfo.totalRetries + 1,
      retryAt: new Date(),
      retryReason,
      retryDelay,
      success: false
    };

    this.retryInfo.retryHistory.push(retryAttempt);
    this.retryInfo.totalRetries += 1;
    this.retryInfo.nextRetryAt = new Date(Date.now() + retryDelay);
    this.metadata.retryCount = this.retryInfo.totalRetries;
    this.eventStatus = 'retrying';
    this.updatedAt = new Date();
    
    this.markModified('retryInfo');
    this.markModified('metadata');
    this.markModified('eventStatus');
  },

  moveToDeadLetter(reason) {
    this.deadLetterInfo.movedToDeadLetter = true;
    this.deadLetterInfo.deadLetterAt = new Date();
    this.deadLetterInfo.deadLetterReason = reason;
    this.eventStatus = 'failed';
    this.updatedAt = new Date();
    
    this.markModified('deadLetterInfo');
    this.markModified('eventStatus');
  }
};

export const EventMetadata = mongoose.model('EventMetadata', eventMetadataSchema);
export default EventMetadata;
