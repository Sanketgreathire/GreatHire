import { connection } from '../../../config/redis.js';
import { Queue } from 'bullmq';
import { OrchestrationMetadata } from '../../../models/orchestrationMetadata.model.js';

export class FailureRecoveryService {
  constructor() {
    this.deadLetterQueues = new Map();
    this.retryStrategies = new Map();
    this.recoveryAttempts = new Map();
    this.maxRetryAttempts = 3;
    this.backoffMultipliers = {
      exponential: 2,
      linear: 1.5,
      fixed: 1
    };
    
    this.initializeRetryStrategies();
  }

  initializeRetryStrategies() {
    // Define retry strategies for different failure types
    this.retryStrategies.set('network_error', {
      maxAttempts: 5,
      backoffType: 'exponential',
      baseDelay: 1000, // 1 second
      maxDelay: 300000 // 5 minutes
    });

    this.retryStrategies.set('rate_limit', {
      maxAttempts: 3,
      backoffType: 'exponential',
      baseDelay: 60000, // 1 minute
      maxDelay: 1800000 // 30 minutes
    });

    this.retryStrategies.set('parsing_error', {
      maxAttempts: 2,
      backoffType: 'linear',
      baseDelay: 5000, // 5 seconds
      maxDelay: 60000 // 1 minute
    });

    this.retryStrategies.set('enrichment_error', {
      maxAttempts: 3,
      backoffType: 'exponential',
      baseDelay: 30000, // 30 seconds
      maxDelay: 900000 // 15 minutes
    });

    this.retryStrategies.set('embedding_error', {
      maxAttempts: 4,
      backoffType: 'exponential',
      baseDelay: 10000, // 10 seconds
      maxDelay: 300000 // 5 minutes
    });

    this.retryStrategies.set('indexing_error', {
      maxAttempts: 3,
      backoffType: 'linear',
      baseDelay: 15000, // 15 seconds
      maxDelay: 120000 // 2 minutes
    });
  }

  async handleFailedJob(queueName, jobId, error, attemptsMade) {
    try {
      const failureType = this.classifyFailure(error);
      const retryStrategy = this.retryStrategies.get(failureType) || this.getDefaultRetryStrategy();
      
      // Log the failure
      await this.logFailureEvent(queueName, jobId, error, failureType, attemptsMade);
      
      // Check if we should retry
      if (attemptsMade < retryStrategy.maxAttempts) {
        const delay = this.calculateRetryDelay(attemptsMade, retryStrategy);
        
        await this.scheduleRetry(queueName, jobId, delay, failureType);
        
        return {
          action: 'retry',
          delay,
          nextAttempt: attemptsMade + 1,
          failureType
        };
      } else {
        // Move to dead letter queue
        await this.moveToDeadLetterQueue(queueName, jobId, error, failureType, attemptsMade);
        
        return {
          action: 'dead_letter',
          failureType,
          attemptsMade
        };
      }
    } catch (err) {
      console.error('Error handling failed job:', err);
      throw err;
    }
  }

  classifyFailure(error) {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorStack = error.stack?.toLowerCase() || '';
    const fullError = `${errorMessage} ${errorStack}`;

    // Network-related errors
    if (fullError.includes('network') || fullError.includes('timeout') || 
        fullError.includes('connection') || fullError.includes('econnreset')) {
      return 'network_error';
    }

    // Rate limiting errors
    if (fullError.includes('rate limit') || fullError.includes('too many requests') ||
        fullError.includes('429') || fullError.includes('quota exceeded')) {
      return 'rate_limit';
    }

    // Parsing errors
    if (fullError.includes('parse') || fullError.includes('invalid') ||
        fullError.includes('malformed') || fullError.includes('syntax')) {
      return 'parsing_error';
    }

    // Enrichment errors
    if (fullError.includes('enrichment') || fullError.includes('enrich') ||
        fullError.includes('external') || fullError.includes('api')) {
      return 'enrichment_error';
    }

    // Embedding errors
    if (fullError.includes('embedding') || fullError.includes('vector') ||
        fullError.includes('model') || fullError.includes('ai')) {
      return 'embedding_error';
    }

    // Indexing errors
    if (fullError.includes('index') || fullError.includes('elasticsearch') ||
        fullError.includes('search') || fullError.includes('database')) {
      return 'indexing_error';
    }

    // Default classification
    return 'unknown_error';
  }

  getDefaultRetryStrategy() {
    return {
      maxAttempts: 3,
      backoffType: 'exponential',
      baseDelay: 5000,
      maxDelay: 60000
    };
  }

  calculateRetryDelay(attempt, strategy) {
    let delay = strategy.baseDelay;
    const multiplier = this.backoffMultipliers[strategy.backoffType] || 1;
    
    switch (strategy.backoffType) {
      case 'exponential':
        delay = strategy.baseDelay * Math.pow(multiplier, attempt - 1);
        break;
      case 'linear':
        delay = strategy.baseDelay + (attempt - 1) * strategy.baseDelay * (multiplier - 1);
        break;
      case 'fixed':
        delay = strategy.baseDelay;
        break;
    }

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    delay += jitter;

    return Math.min(delay, strategy.maxDelay);
  }

  async scheduleRetry(queueName, jobId, delay, failureType) {
    try {
      const queue = new Queue(queueName, { connection });
      const job = await queue.getJob(jobId);
      
      if (job) {
        await job.retry(delay);
        
        await this.logRetryEvent(queueName, jobId, delay, failureType);
      }
    } catch (error) {
      console.error(`Error scheduling retry for job ${jobId}:`, error);
      throw error;
    }
  }

  async moveToDeadLetterQueue(queueName, jobId, error, failureType, attemptsMade) {
    try {
      const deadLetterQueueName = `${queueName}:dead-letter`;
      const sourceQueue = new Queue(queueName, { connection });
      const deadLetterQueue = new Queue(deadLetterQueueName, { connection });
      
      const job = await sourceQueue.getJob(jobId);
      
      if (job) {
        const deadLetterData = {
          originalJobId: jobId,
          originalQueue: queueName,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name
          },
          failureType,
          attemptsMade,
          failedAt: new Date(),
          originalData: job.data
        };

        // Add to dead letter queue
        await deadLetterQueue.add('dead-letter', deadLetterData, {
          attempts: 0,
          removeOnComplete: 100,
          removeOnFail: 50
        });

        // Remove from original queue
        await job.remove();
        
        await this.logDeadLetterEvent(queueName, jobId, deadLetterData);
        
        this.deadLetterQueues.set(queueName, (this.deadLetterQueues.get(queueName) || 0) + 1);
      }
    } catch (err) {
      console.error(`Error moving job to dead letter queue:`, err);
      throw err;
    }
  }

  async retryDeadLetterJob(queueName, deadLetterJobId) {
    try {
      const deadLetterQueueName = `${queueName}:dead-letter`;
      const deadLetterQueue = new Queue(deadLetterQueueName, { connection });
      const sourceQueue = new Queue(queueName, { connection });
      
      const deadLetterJob = await deadLetterQueue.getJob(deadLetterJobId);
      
      if (!deadLetterJob) {
        throw new Error(`Dead letter job not found: ${deadLetterJobId}`);
      }

      const originalData = deadLetterJob.data.originalData;
      
      // Add back to original queue
      await sourceQueue.add(originalData.type || 'default', originalData, {
        attempts: 0,
        priority: 10 // Higher priority for retries
      });

      // Remove from dead letter queue
      await deadLetterJob.remove();
      
      // Update counter
      const currentCount = this.deadLetterQueues.get(queueName) || 0;
      this.deadLetterQueues.set(queueName, Math.max(0, currentCount - 1));
      
      await this.logDeadLetterRetryEvent(queueName, deadLetterJobId, originalData);
      
      return {
        success: true,
        originalJobId: deadLetterJob.data.originalJobId,
        retriedAt: new Date()
      };
    } catch (error) {
      console.error(`Error retrying dead letter job:`, error);
      throw error;
    }
  }

  async getDeadLetterJobs(queueName, limit = 50) {
    try {
      const deadLetterQueueName = `${queueName}:dead-letter`;
      const deadLetterQueue = new Queue(deadLetterQueueName, { connection });
      
      const jobs = await deadLetterQueue.getWaiting(0, limit - 1);
      
      return jobs.map(job => ({
        id: job.id,
        originalJobId: job.data.originalJobId,
        originalQueue: job.data.originalQueue,
        failureType: job.data.failureType,
        attemptsMade: job.data.attemptsMade,
        failedAt: job.data.failedAt,
        error: job.data.error,
        timestamp: job.timestamp
      }));
    } catch (error) {
      console.error(`Error getting dead letter jobs for ${queueName}:`, error);
      return [];
    }
  }

  async clearDeadLetterQueue(queueName) {
    try {
      const deadLetterQueueName = `${queueName}:dead-letter`;
      const deadLetterQueue = new Queue(deadLetterQueueName, { connection });
      
      await deadLetterQueue.obliterate({ force: true });
      
      this.deadLetterQueues.set(queueName, 0);
      
      await this.logDeadLetterClearEvent(queueName);
      
      return {
        success: true,
        queueName,
        clearedAt: new Date()
      };
    } catch (error) {
      console.error(`Error clearing dead letter queue for ${queueName}:`, error);
      throw error;
    }
  }

  async getFailureStats(timeRange = '24h') {
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

    try {
      const stats = await OrchestrationMetadata.aggregate([
        {
          $match: {
            eventType: 'job_failure',
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              queueName: '$data.queueName',
              failureType: '$data.failureType'
            },
            count: { $sum: 1 },
            avgAttempts: { $avg: '$data.attemptsMade' },
            lastOccurrence: { $max: '$timestamp' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const formattedStats = {};
      
      stats.forEach(stat => {
        const queueName = stat._id.queueName;
        const failureType = stat._id.failureType;
        
        if (!formattedStats[queueName]) {
          formattedStats[queueName] = {
            totalFailures: 0,
            failureTypes: {},
            avgAttempts: 0,
            lastFailure: null
          };
        }
        
        formattedStats[queueName].totalFailures += stat.count;
        formattedStats[queueName].failureTypes[failureType] = {
          count: stat.count,
          avgAttempts: Math.round(stat.avgAttempts),
          lastOccurrence: stat.lastOccurrence
        };
        
        if (!formattedStats[queueName].lastFailure || 
            new Date(stat.lastOccurrence) > new Date(formattedStats[queueName].lastFailure)) {
          formattedStats[queueName].lastFailure = stat.lastOccurrence;
        }
      });

      // Calculate overall averages
      Object.keys(formattedStats).forEach(queueName => {
        const queueStats = formattedStats[queueName];
        const typeCount = Object.keys(queueStats.failureTypes).length;
        
        if (typeCount > 0) {
          const totalAttempts = Object.values(queueStats.failureTypes)
            .reduce((sum, type) => sum + type.avgAttempts * type.count, 0);
          const totalFailures = Object.values(queueStats.failureTypes)
            .reduce((sum, type) => sum + type.count, 0);
          
          queueStats.avgAttempts = Math.round(totalAttempts / totalFailures);
        }
      });

      return {
        timeRange,
        period: { start: startDate, end: now },
        stats: formattedStats
      };
    } catch (error) {
      console.error('Error getting failure stats:', error);
      return {
        timeRange,
        period: { start: startDate, end: now },
        stats: {}
      };
    }
  }

  async getRecoveryStats(timeRange = '24h') {
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

    try {
      const stats = await OrchestrationMetadata.aggregate([
        {
          $match: {
            eventType: { $in: ['job_retry', 'dead_letter_retry'] },
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              queueName: '$data.queueName',
              eventType: '$eventType'
            },
            count: { $sum: 1 },
            avgDelay: { $avg: '$data.delay' },
            lastOccurrence: { $max: '$timestamp' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const formattedStats = {};
      
      stats.forEach(stat => {
        const queueName = stat._id.queueName;
        const eventType = stat._id.eventType;
        
        if (!formattedStats[queueName]) {
          formattedStats[queueName] = {
            retries: 0,
            deadLetterRetries: 0,
            avgRetryDelay: 0,
            lastRetry: null
          };
        }
        
        if (eventType === 'job_retry') {
          formattedStats[queueName].retries = stat.count;
        } else if (eventType === 'dead_letter_retry') {
          formattedStats[queueName].deadLetterRetries = stat.count;
        }
        
        if (!formattedStats[queueName].lastRetry || 
            new Date(stat.lastOccurrence) > new Date(formattedStats[queueName].lastRetry)) {
          formattedStats[queueName].lastRetry = stat.lastOccurrence;
          formattedStats[queueName].avgRetryDelay = Math.round(stat.avgDelay);
        }
      });

      return {
        timeRange,
        period: { start: startDate, end: now },
        stats: formattedStats
      };
    } catch (error) {
      console.error('Error getting recovery stats:', error);
      return {
        timeRange,
        period: { start: startDate, end: now },
        stats: {}
      };
    }
  }

  async getDeadLetterStats() {
    const stats = {};
    
    this.deadLetterQueues.forEach((count, queueName) => {
      stats[queueName] = count;
    });

    return stats;
  }

  async updateRetryStrategy(failureType, strategy) {
    this.retryStrategies.set(failureType, strategy);
    
    await this.logRecoveryEvent('strategy_updated', {
      failureType,
      strategy,
      timestamp: new Date()
    });

    return this.retryStrategies.get(failureType);
  }

  getRetryStrategies() {
    const strategies = {};
    
    this.retryStrategies.forEach((strategy, failureType) => {
      strategies[failureType] = strategy;
    });

    return strategies;
  }

  async logFailureEvent(queueName, jobId, error, failureType, attemptsMade) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `failure-${Date.now()}`,
        eventType: 'job_failure',
        data: {
          queueName,
          jobId,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name
          },
          failureType,
          attemptsMade
        },
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error logging failure event:', err);
    }
  }

  async logRetryEvent(queueName, jobId, delay, failureType) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `retry-${Date.now()}`,
        eventType: 'job_retry',
        data: {
          queueName,
          jobId,
          delay,
          failureType
        },
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error logging retry event:', err);
    }
  }

  async logDeadLetterEvent(queueName, jobId, deadLetterData) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `dead-letter-${Date.now()}`,
        eventType: 'dead_letter',
        data: {
          queueName,
          jobId,
          deadLetterData
        },
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error logging dead letter event:', err);
    }
  }

  async logDeadLetterRetryEvent(queueName, deadLetterJobId, originalData) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `dl-retry-${Date.now()}`,
        eventType: 'dead_letter_retry',
        data: {
          queueName,
          deadLetterJobId,
          originalJobId: originalData.originalJobId
        },
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error logging dead letter retry event:', err);
    }
  }

  async logDeadLetterClearEvent(queueName) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `dl-clear-${Date.now()}`,
        eventType: 'dead_letter_clear',
        data: {
          queueName
        },
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error logging dead letter clear event:', err);
    }
  }

  async logRecoveryEvent(eventType, data) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `recovery-${Date.now()}`,
        eventType,
        data,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error logging recovery event:', err);
    }
  }

  async getRecoveryHealth() {
    const failureStats = await this.getFailureStats('1h');
    const recoveryStats = await this.getRecoveryStats('1h');
    const deadLetterStats = await this.getDeadLetterStats();
    
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      totalFailures: Object.values(failureStats.stats).reduce((sum, queue) => sum + queue.totalFailures, 0),
      totalRetries: Object.values(recoveryStats.stats).reduce((sum, queue) => sum + queue.retries, 0),
      totalDeadLetterJobs: Object.values(deadLetterStats).reduce((sum, count) => sum + count, 0),
      issues: []
    };

    // Determine health status
    if (health.totalFailures > 100) {
      health.status = 'warning';
      health.issues.push('High failure rate detected');
    }

    if (health.totalDeadLetterJobs > 50) {
      health.status = 'degraded';
      health.issues.push('Many jobs in dead letter queue');
    }

    if (health.totalFailures > 500) {
      health.status = 'critical';
      health.issues.push('Critical failure rate');
    }

    return health;
  }
}

export const failureRecoveryService = new FailureRecoveryService();
export default failureRecoveryService;
