import { connection } from '../../../config/redis.js';
import { Queue, Worker } from 'bullmq';
import { OrchestrationMetadata } from '../../../models/orchestrationMetadata.model.js';

// BullMQ does not allow colons in queue names — sanitize any legacy names
function sanitizeQueueName(name) {
  return (name || 'unknown').replace(/:/g, '-');
}

export class QueueCoordinatorService {
  constructor() {
    this.monitoredQueues = new Map();
    this.queueMetrics = new Map();
    this.healthChecks = new Map();
    this.alertThresholds = {
      maxWaitingJobs: 1000,
      maxFailedJobs: 100,
      maxProcessingDelay: 300000, // 5 minutes
      maxWorkerDelay: 60000 // 1 minute
    };
    
    this.initializeQueueMonitoring();
  }

  initializeQueueMonitoring() {
    // Define queues to monitor
    this.queues = {
      'github-discovery': {
        name: 'GitHub Discovery',
        priority: 1,
        expectedConcurrency: 3
      },
      'resume-discovery': {
        name: 'Resume Discovery',
        priority: 2,
        expectedConcurrency: 2
      },
      'portfolio-discovery': {
        name: 'Portfolio Discovery',
        priority: 3,
        expectedConcurrency: 1
      },
      'freshness-processing': {
        name: 'Freshness Processing',
        priority: 4,
        expectedConcurrency: 5
      },
      'enrichment-processing': {
        name: 'Enrichment Processing',
        priority: 5,
        expectedConcurrency: 3
      },
      'embedding-processing': {
        name: 'Embedding Processing',
        priority: 6,
        expectedConcurrency: 8
      }
    };

    // Start health monitoring
    this.startHealthMonitoring();
  }

  async getQueueStatus(queueName) {
    try {
      const queue = new Queue(sanitizeQueueName(queueName), { connection });
      
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed(),
        queue.getDelayed()
      ]);

      const status = {
        queueName,
        timestamp: new Date(),
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
        total: waiting.length + active.length + completed.length + failed.length + delayed.length,
        health: 'healthy'
      };

      // Check for health issues
      if (status.waiting > this.alertThresholds.maxWaitingJobs) {
        status.health = 'warning';
        status.issues = ['High number of waiting jobs'];
      }

      if (status.failed > this.alertThresholds.maxFailedJobs) {
        status.health = 'critical';
        status.issues = status.issues || [];
        status.issues.push('High number of failed jobs');
      }

      // Calculate processing delay
      if (waiting.length > 0) {
        const oldestJob = waiting[0];
        const delay = Date.now() - new Date(oldestJob.timestamp).getTime();
        if (delay > this.alertThresholds.maxProcessingDelay) {
          status.health = 'warning';
          status.issues = status.issues || [];
          status.issues.push('High processing delay');
          status.processingDelay = delay;
        }
      }

      this.queueMetrics.set(queueName, status);
      await this.logQueueEvent(queueName, 'status_check', status);

      return status;
    } catch (error) {
      console.error(`Error getting queue status for ${queueName}:`, error);
      return {
        queueName,
        health: 'error',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async getAllQueueStatuses() {
    const statuses = {};
    
    for (const queueName of Object.keys(this.queues)) {
      try {
        statuses[queueName] = await this.getQueueStatus(queueName);
      } catch (error) {
        statuses[queueName] = {
          queueName,
          health: 'error',
          error: error.message,
          timestamp: new Date()
        };
      }
    }

    return statuses;
  }

  async getWorkerStatus(queueName) {
    try {
      const queue = new Queue(sanitizeQueueName(queueName), { connection });
      const workers = await queue.getWorkers();
      
      const status = {
        queueName,
        timestamp: new Date(),
        workerCount: workers.length,
        workers: [],
        health: 'healthy'
      };

      for (const worker of workers) {
        const workerInfo = {
          id: worker.id,
          addr: worker.addr,
          state: worker.state,
          started: worker.started,
          isRunning: worker.state === 'active'
        };

        status.workers.push(workerInfo);
      }

      const expectedConcurrency = this.queues[queueName]?.expectedConcurrency || 1;
      if (status.workerCount < expectedConcurrency) {
        status.health = 'warning';
        status.issues = [`Expected ${expectedConcurrency} workers, got ${status.workerCount}`];
      }

      return status;
    } catch (error) {
      console.error(`Error getting worker status for ${queueName}:`, error);
      return {
        queueName,
        health: 'error',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async getAllWorkerStatuses() {
    const statuses = {};
    
    for (const queueName of Object.keys(this.queues)) {
      try {
        statuses[queueName] = await this.getWorkerStatus(queueName);
      } catch (error) {
        statuses[queueName] = {
          queueName,
          health: 'error',
          error: error.message,
          timestamp: new Date()
        };
      }
    }

    return statuses;
  }

  async getQueueMetrics(timeRange = '1h') {
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

    try {
      const metrics = await OrchestrationMetadata.aggregate([
        {
          $match: {
            eventType: 'queue_metrics',
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$data.queueName',
            avgWaiting: { $avg: '$data.waiting' },
            avgActive: { $avg: '$data.active' },
            avgCompleted: { $avg: '$data.completed' },
            avgFailed: { $avg: '$data.failed' },
            maxWaiting: { $max: '$data.waiting' },
            maxFailed: { $max: '$data.failed' },
            totalProcessed: { $sum: '$data.completed' },
            samples: { $sum: 1 }
          }
        }
      ]);

      const formattedMetrics = {};
      metrics.forEach(metric => {
        formattedMetrics[metric._id] = {
          avgWaiting: Math.round(metric.avgWaiting),
          avgActive: Math.round(metric.avgActive),
          avgCompleted: Math.round(metric.avgCompleted),
          avgFailed: Math.round(metric.avgFailed),
          maxWaiting: metric.maxWaiting,
          maxFailed: metric.maxFailed,
          totalProcessed: metric.totalProcessed,
          samples: metric.samples
        };
      });

      return {
        timeRange,
        period: { start: startDate, end: now },
        metrics: formattedMetrics
      };
    } catch (error) {
      console.error('Error getting queue metrics:', error);
      return {
        timeRange,
        period: { start: startDate, end: now },
        metrics: {}
      };
    }
  }

  async detectBottlenecks() {
    const bottlenecks = [];
    const queueStatuses = await this.getAllQueueStatuses();

    Object.entries(queueStatuses).forEach(([queueName, status]) => {
      if (status.health !== 'healthy') {
        bottlenecks.push({
          queueName,
          type: status.health,
          issues: status.issues || [],
          waiting: status.waiting,
          failed: status.failed,
          processingDelay: status.processingDelay
        });
      }
    });

    return bottlenecks;
  }

  async getProcessingDelays() {
    const delays = {};
    const queueStatuses = await this.getAllQueueStatuses();

    Object.entries(queueStatuses).forEach(([queueName, status]) => {
      if (status.processingDelay) {
        delays[queueName] = {
          delay: status.processingDelay,
          delayMinutes: Math.round(status.processingDelay / 60000),
          oldestJobAge: status.processingDelay
        };
      }
    });

    return delays;
  }

  async getThroughputAnalysis(timeRange = '1h') {
    const metrics = await this.getQueueMetrics(timeRange);
    const analysis = {};

    Object.entries(metrics.metrics).forEach(([queueName, metric]) => {
      const throughput = metric.samples > 0 ? metric.totalProcessed / (timeRange === '1h' ? 1 : 
                                                               timeRange === '6h' ? 6 : 
                                                               timeRange === '24h' ? 24 : 1) : 0;

      analysis[queueName] = {
        throughput: Math.round(throughput),
        jobsPerHour: Math.round(throughput),
        successRate: metric.avgCompleted > 0 ? 
          ((metric.avgCompleted / (metric.avgCompleted + metric.avgFailed)) * 100).toFixed(2) : 0,
        errorRate: metric.avgCompleted > 0 ? 
          ((metric.avgFailed / (metric.avgCompleted + metric.avgFailed)) * 100).toFixed(2) : 0,
        efficiency: metric.avgActive > 0 ? 
          (metric.avgCompleted / metric.avgActive).toFixed(2) : 0
      };
    });

    return analysis;
  }

  async restartQueue(queueName) {
    try {
      const queue = new Queue(sanitizeQueueName(queueName), { connection });
      
      // Pause the queue
      await queue.pause();
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Resume the queue
      await queue.resume();
      
      await this.logQueueEvent(queueName, 'queue_restarted', {
        timestamp: new Date()
      });

      return {
        success: true,
        queueName,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error restarting queue ${queueName}:`, error);
      return {
        success: false,
        queueName,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async clearQueue(queueName, jobType = 'failed') {
    try {
      const queue = new Queue(sanitizeQueueName(queueName), { connection });
      
      let clearedCount = 0;
      
      switch (jobType) {
        case 'failed':
          const failedJobs = await queue.getFailed();
          for (const job of failedJobs) {
            await job.remove();
            clearedCount++;
          }
          break;
        case 'completed':
          const completedJobs = await queue.getCompleted();
          for (const job of completedJobs) {
            await job.remove();
            clearedCount++;
          }
          break;
        case 'waiting':
          const waitingJobs = await queue.getWaiting();
          for (const job of waitingJobs) {
            await job.remove();
            clearedCount++;
          }
          break;
        default:
          throw new Error(`Invalid job type: ${jobType}`);
      }

      await this.logQueueEvent(queueName, 'queue_cleared', {
        jobType,
        clearedCount,
        timestamp: new Date()
      });

      return {
        success: true,
        queueName,
        jobType,
        clearedCount,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error clearing queue ${queueName}:`, error);
      return {
        success: false,
        queueName,
        jobType,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async pauseQueue(queueName) {
    try {
      const queue = new Queue(sanitizeQueueName(queueName), { connection });
      await queue.pause();
      
      await this.logQueueEvent(queueName, 'queue_paused', {
        timestamp: new Date()
      });

      return {
        success: true,
        queueName,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error pausing queue ${queueName}:`, error);
      return {
        success: false,
        queueName,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async resumeQueue(queueName) {
    try {
      const queue = new Queue(sanitizeQueueName(queueName), { connection });
      await queue.resume();
      
      await this.logQueueEvent(queueName, 'queue_resumed', {
        timestamp: new Date()
      });

      return {
        success: true,
        queueName,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error resuming queue ${queueName}:`, error);
      return {
        success: false,
        queueName,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async getQueueHealth() {
    const queueStatuses = await this.getAllQueueStatuses();
    const workerStatuses = await this.getAllWorkerStatuses();
    const bottlenecks = await this.detectBottlenecks();
    const delays = await this.getProcessingDelays();

    const health = {
      status: 'healthy',
      timestamp: new Date(),
      queues: queueStatuses,
      workers: workerStatuses,
      bottlenecks,
      delays,
      issues: []
    };

    // Determine overall health
    Object.values(queueStatuses).forEach(status => {
      if (status.health === 'critical') {
        health.status = 'critical';
        health.issues.push(`Queue ${status.queueName} is critical`);
      } else if (status.health === 'warning' && health.status === 'healthy') {
        health.status = 'degraded';
        health.issues.push(`Queue ${status.queueName} has warnings`);
      } else if (status.health === 'error' && health.status !== 'critical') {
        health.status = 'unhealthy';
        health.issues.push(`Queue ${status.queueName} has errors`);
      }
    });

    return health;
  }

  startHealthMonitoring() {
    // Monitor queue health every 30 seconds
    setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('Error in health monitoring:', error);
      }
    }, 30000);
  }

  async performHealthCheck() {
    const health = await this.getQueueHealth();
    
    // Log health check
    await this.logQueueEvent('system', 'health_check', health);
    
    // Trigger alerts if needed
    if (health.status === 'critical') {
      await this.triggerHealthAlert('critical', health.issues);
    } else if (health.status === 'unhealthy') {
      await this.triggerHealthAlert('unhealthy', health.issues);
    }
  }

  async triggerHealthAlert(severity, issues) {
    try {
      await this.logQueueEvent('system', 'health_alert', {
        severity,
        issues,
        timestamp: new Date()
      });

      console.warn(`Queue health alert - ${severity}:`, issues);
    } catch (error) {
      console.error('Error triggering health alert:', error);
    }
  }

  async logQueueEvent(queueName, eventType, data) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `queue-${Date.now()}`,
        eventType,
        data: {
          queueName,
          ...data
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging queue event:', error);
    }
  }

  async getQueueHistory(queueName, limit = 100) {
    try {
      const history = await OrchestrationMetadata.find({
        eventType: { $in: ['queue_restarted', 'queue_cleared', 'queue_paused', 'queue_resumed'] },
        'data.queueName': queueName
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

      return history;
    } catch (error) {
      console.error('Error getting queue history:', error);
      return [];
    }
  }

  async getAlertHistory(limit = 50) {
    try {
      const alerts = await OrchestrationMetadata.find({
        eventType: 'health_alert'
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

      return alerts;
    } catch (error) {
      console.error('Error getting alert history:', error);
      return [];
    }
  }

  async updateAlertThresholds(thresholds) {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
    
    await this.logQueueEvent('system', 'thresholds_updated', {
      thresholds: this.alertThresholds,
      timestamp: new Date()
    });

    return this.alertThresholds;
  }

  getAlertThresholds() {
    return this.alertThresholds;
  }
}

export const queueCoordinatorService = new QueueCoordinatorService();
export default queueCoordinatorService;
