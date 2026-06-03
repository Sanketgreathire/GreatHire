import cron from 'node-cron';
import { discoveryOrchestratorService } from './discoveryOrchestrator.service.js';
import { OrchestrationMetadata } from '../../../models/orchestrationMetadata.model.js';

export class ConnectorSchedulerService {
  constructor() {
    this.schedules = new Map();
    this.cronJobs = new Map();
    this.defaultSchedules = {
      github: {
        cron: '0 */6 * * *', // Every 6 hours
        enabled: true,
        priority: 'normal',
        options: {
          batchSize: 50,
          queries: [
            'react developer location:remote',
            'full stack developer location:remote',
            'node.js developer location:remote',
            'python developer location:remote'
          ]
        }
      },
      resume: {
        cron: '0 */12 * * *', // Every 12 hours
        enabled: true,
        priority: 'normal',
        options: {
          batchSize: 100,
          queries: [
            'software developer resume filetype:pdf',
            'web developer resume filetype:doc',
            'full stack developer resume filetype:docx'
          ]
        }
      },
      portfolio: {
        cron: '0 */4 * * *', // Every 4 hours
        enabled: true,
        priority: 'normal',
        options: {
          batchSize: 25,
          domains: []
        }
      }
    };
  }

  async initializeScheduler() {
    try {
      // Load existing schedules from database
      await this.loadSchedulesFromDatabase();
      
      // Start default schedules
      await this.startDefaultSchedules();
      
      console.log('Connector scheduler initialized');
    } catch (error) {
      console.error('Error initializing connector scheduler:', error);
      throw error;
    }
  }

  async loadSchedulesFromDatabase() {
    try {
      const savedSchedules = await OrchestrationMetadata.find({
        eventType: 'schedule_config'
      }).lean();

      savedSchedules.forEach(schedule => {
        if (schedule.data.connector && schedule.data.config) {
          this.schedules.set(schedule.data.connector, schedule.data.config);
        }
      });
    } catch (error) {
      console.error('Error loading schedules from database:', error);
    }
  }

  async startDefaultSchedules() {
    Object.entries(this.defaultSchedules).forEach(([connector, config]) => {
      if (!this.schedules.has(connector)) {
        this.schedules.set(connector, config);
      }
      
      if (config.enabled) {
        this.scheduleConnector(connector, config);
      }
    });
  }

  scheduleConnector(connectorName, config) {
    try {
      // Stop existing job if it exists
      if (this.cronJobs.has(connectorName)) {
        this.cronJobs.get(connectorName).stop();
        this.cronJobs.delete(connectorName);
      }

      if (!config.enabled || !config.cron) {
        return false;
      }

      // Validate cron expression
      if (!cron.validate(config.cron)) {
        throw new Error(`Invalid cron expression: ${config.cron}`);
      }

      // Create new cron job
      const job = cron.schedule(config.cron, async () => {
        await this.executeScheduledJob(connectorName, config);
      }, {
        scheduled: true,
        timezone: 'UTC'
      });

      this.cronJobs.set(connectorName, job);
      
      this.logSchedulerEvent('schedule_created', {
        connector: connectorName,
        cron: config.cron,
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      console.error(`Error scheduling connector ${connectorName}:`, error);
      return false;
    }
  }

  async executeScheduledJob(connectorName, config) {
    const jobId = this.generateJobId(connectorName);
    
    try {
      this.logSchedulerEvent('job_start', {
        connector: connectorName,
        jobId,
        config,
        timestamp: new Date()
      });

      const result = await discoveryOrchestratorService.runSpecificConnector(connectorName, {
        ...config.options,
        scheduled: true,
        jobId
      });

      this.logSchedulerEvent('job_complete', {
        connector: connectorName,
        jobId,
        result,
        timestamp: new Date()
      });

      return result;
    } catch (error) {
      console.error(`Error executing scheduled job for ${connectorName}:`, error);
      
      this.logSchedulerEvent('job_error', {
        connector: connectorName,
        jobId,
        error: error.message,
        timestamp: new Date()
      });

      throw error;
    }
  }

  async addSchedule(connectorName, config) {
    try {
      // Validate config
      this.validateScheduleConfig(config);
      
      // Save to database
      await this.saveScheduleToDatabase(connectorName, config);
      
      // Update in-memory schedule
      this.schedules.set(connectorName, config);
      
      // Start the schedule
      const success = this.scheduleConnector(connectorName, config);
      
      if (success) {
        this.logSchedulerEvent('schedule_added', {
          connector: connectorName,
          config,
          timestamp: new Date()
        });
      }
      
      return success;
    } catch (error) {
      console.error(`Error adding schedule for ${connectorName}:`, error);
      throw error;
    }
  }

  async updateSchedule(connectorName, config) {
    try {
      // Validate config
      this.validateScheduleConfig(config);
      
      // Update in-memory schedule
      this.schedules.set(connectorName, config);
      
      // Save to database
      await this.saveScheduleToDatabase(connectorName, config);
      
      // Restart the schedule
      const success = this.scheduleConnector(connectorName, config);
      
      if (success) {
        this.logSchedulerEvent('schedule_updated', {
          connector: connectorName,
          config,
          timestamp: new Date()
        });
      }
      
      return success;
    } catch (error) {
      console.error(`Error updating schedule for ${connectorName}:`, error);
      throw error;
    }
  }

  async removeSchedule(connectorName) {
    try {
      // Stop cron job
      if (this.cronJobs.has(connectorName)) {
        this.cronJobs.get(connectorName).stop();
        this.cronJobs.delete(connectorName);
      }
      
      // Remove from memory
      this.schedules.delete(connectorName);
      
      // Remove from database
      await OrchestrationMetadata.deleteOne({
        eventType: 'schedule_config',
        'data.connector': connectorName
      });
      
      this.logSchedulerEvent('schedule_removed', {
        connector: connectorName,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      console.error(`Error removing schedule for ${connectorName}:`, error);
      return false;
    }
  }

  async enableSchedule(connectorName) {
    const config = this.schedules.get(connectorName);
    if (!config) {
      throw new Error(`No schedule found for connector: ${connectorName}`);
    }

    const updatedConfig = { ...config, enabled: true };
    return await this.updateSchedule(connectorName, updatedConfig);
  }

  async disableSchedule(connectorName) {
    const config = this.schedules.get(connectorName);
    if (!config) {
      throw new Error(`No schedule found for connector: ${connectorName}`);
    }

    const updatedConfig = { ...config, enabled: false };
    return await this.updateSchedule(connectorName, updatedConfig);
  }

  validateScheduleConfig(config) {
    if (!config) {
      throw new Error('Schedule config is required');
    }

    if (config.cron && !cron.validate(config.cron)) {
      throw new Error(`Invalid cron expression: ${config.cron}`);
    }

    if (config.priority && !['low', 'normal', 'high', 'urgent'].includes(config.priority)) {
      throw new Error('Invalid priority level');
    }

    return true;
  }

  async saveScheduleToDatabase(connectorName, config) {
    try {
      await OrchestrationMetadata.findOneAndUpdate(
        {
          eventType: 'schedule_config',
          'data.connector': connectorName
        },
        {
          eventType: 'schedule_config',
          data: {
            connector: connectorName,
            config
          },
          timestamp: new Date()
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error saving schedule to database:', error);
      throw error;
    }
  }

  getSchedule(connectorName) {
    return this.schedules.get(connectorName) || null;
  }

  getAllSchedules() {
    const schedules = {};
    
    this.schedules.forEach((config, connector) => {
      schedules[connector] = {
        ...config,
        isRunning: this.cronJobs.has(connector),
        nextRun: this.getNextRunTime(config.cron)
      };
    });

    return schedules;
  }

  getNextRunTime(cronExpression) {
    if (!cronExpression) return null;
    
    try {
      // This would calculate the next run time
      // For now, return placeholder
      return new Date(Date.now() + 3600000); // 1 hour from now
    } catch (error) {
      return null;
    }
  }

  async getScheduleHistory(connectorName, limit = 50) {
    try {
      const history = await OrchestrationMetadata.find({
        eventType: { $in: ['job_start', 'job_complete', 'job_error'] },
        'data.connector': connectorName
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

      return history;
    } catch (error) {
      console.error('Error getting schedule history:', error);
      return [];
    }
  }

  async getScheduleStats(timeRange = '24h') {
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

    try {
      const stats = await OrchestrationMetadata.aggregate([
        {
          $match: {
            eventType: { $in: ['job_start', 'job_complete', 'job_error'] },
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              connector: '$data.connector',
              eventType: '$eventType'
            },
            count: { $sum: 1 },
            lastOccurrence: { $max: '$timestamp' }
          }
        },
        { $sort: { '_id.connector': 1, '_id.eventType': 1 } }
      ]);

      const formattedStats = {};
      
      stats.forEach(stat => {
        const connector = stat._id.connector;
        const eventType = stat._id.eventType;
        
        if (!formattedStats[connector]) {
          formattedStats[connector] = {
            started: 0,
            completed: 0,
            failed: 0,
            successRate: 0,
            lastRun: null
          };
        }
        
        formattedStats[connector][eventType === 'job_start' ? 'started' : 
                                   eventType === 'job_complete' ? 'completed' : 'failed'] = stat.count;
        
        if (stat.lastOccurrence && (!formattedStats[connector].lastRun || 
            new Date(stat.lastOccurrence) > new Date(formattedStats[connector].lastRun))) {
          formattedStats[connector].lastRun = stat.lastOccurrence;
        }
      });

      // Calculate success rates
      Object.keys(formattedStats).forEach(connector => {
        const stats = formattedStats[connector];
        if (stats.started > 0) {
          stats.successRate = ((stats.completed / stats.started) * 100).toFixed(2);
        }
      });

      return {
        timeRange,
        period: { start: startDate, end: now },
        stats: formattedStats
      };
    } catch (error) {
      console.error('Error getting schedule stats:', error);
      return {
        timeRange,
        period: { start: startDate, end: now },
        stats: {}
      };
    }
  }

  async runScheduledJobNow(connectorName) {
    const config = this.schedules.get(connectorName);
    if (!config) {
      throw new Error(`No schedule found for connector: ${connectorName}`);
    }

    return await this.executeScheduledJob(connectorName, config);
  }

  async testSchedule(connectorName, config) {
    try {
      // Validate cron expression
      if (!cron.validate(config.cron)) {
        throw new Error(`Invalid cron expression: ${config.cron}`);
      }

      // Test run without actually executing
      const testResult = {
        connector: connectorName,
        cron: config.cron,
        nextRun: this.getNextRunTime(config.cron),
        valid: true,
        timestamp: new Date()
      };

      this.logSchedulerEvent('schedule_test', testResult);

      return testResult;
    } catch (error) {
      const testResult = {
        connector: connectorName,
        cron: config.cron,
        valid: false,
        error: error.message,
        timestamp: new Date()
      };

      this.logSchedulerEvent('schedule_test', testResult);

      return testResult;
    }
  }

  generateJobId(connectorName) {
    return `scheduled-${connectorName}-${Date.now()}`;
  }

  async logSchedulerEvent(eventType, data) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `scheduler-${Date.now()}`,
        eventType,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging scheduler event:', error);
    }
  }

  async getSchedulerHealth() {
    const schedules = this.getAllSchedules();
    const health = {
      status: 'healthy',
      totalSchedules: Object.keys(schedules).length,
      activeSchedules: 0,
      issues: []
    };

    Object.entries(schedules).forEach(([connector, schedule]) => {
      if (schedule.enabled) {
        health.activeSchedules++;
      }
      
      if (!schedule.isRunning && schedule.enabled) {
        health.issues.push(`Active schedule for ${connector} is not running`);
      }
    });

    if (health.issues.length > 0) {
      health.status = 'degraded';
    }

    return health;
  }

  async shutdownScheduler() {
    try {
      // Stop all cron jobs
      this.cronJobs.forEach((job, connector) => {
        job.stop();
        console.log(`Stopped schedule for ${connector}`);
      });

      this.cronJobs.clear();
      console.log('Connector scheduler shutdown complete');
    } catch (error) {
      console.error('Error shutting down scheduler:', error);
      throw error;
    }
  }
}

export const connectorSchedulerService = new ConnectorSchedulerService();
export default connectorSchedulerService;
