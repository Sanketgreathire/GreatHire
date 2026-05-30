import cron from "node-cron";
import connectorRegistry from "./connectorRegistry.service.js";
import { updateConnectorStatusService, updateIngestionHistoryService } from "./discoveryStats.service.js";
import { getDiscoveryQueue } from "./discoveryQueue.service.js";

class IngestionScheduler {
  constructor() {
    this.scheduledJobs = new Map();
    this.cronJobs = new Map();
    this.isRunning = false;
  }

  async startScheduler() {
    if (this.isRunning) {
      console.log("Ingestion scheduler is already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting ingestion scheduler...");

    this.setupDefaultSchedules();
    console.log(`Scheduler started with ${this.cronJobs.size} scheduled jobs`);
  }

  setupDefaultSchedules() {
    this.scheduleConnector('github', '0 2 * * *', { limit: 100 });
    this.scheduleConnector('public-profile', '0 3 * * *', { limit: 50 });
    this.scheduleConnector('resume-url', '0 4 * * *', { limit: 25 });
  }

  scheduleConnector(connectorName, cronExpression, options = {}) {
    if (!cron.validate(cronExpression)) {
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }

    if (this.cronJobs.has(connectorName)) {
      this.cronJobs.get(connectorName).stop();
    }

    const job = cron.schedule(cronExpression, async () => {
      await this.runScheduledIngestion(connectorName, options);
    }, {
      scheduled: false,
      timezone: "UTC"
    });

    this.cronJobs.set(connectorName, job);
    this.scheduledJobs.set(connectorName, {
      cronExpression,
      options,
      lastRun: null,
      nextRun: this.getNextRunTime(cronExpression)
    });

    job.start();
    console.log(`Scheduled connector ${connectorName} with cron: ${cronExpression}`);
  }

  async runScheduledIngestion(connectorName, options) {
    try {
      console.log(`Starting scheduled ingestion for ${connectorName}`);
      
      const result = await connectorRegistry.runConnector(connectorName, options);
      
      await updateIngestionHistoryService({
        connectorName,
        status: 'completed',
        jobId: result.jobId,
        startedAt: new Date(),
        completedAt: new Date(),
        options,
        result
      });

      const scheduledJob = this.scheduledJobs.get(connectorName);
      if (scheduledJob) {
        scheduledJob.lastRun = new Date();
        scheduledJob.nextRun = this.getNextRunTime(scheduledJob.cronExpression);
      }

      console.log(`Completed scheduled ingestion for ${connectorName}`);
    } catch (error) {
      console.error(`Error in scheduled ingestion for ${connectorName}:`, error);
      
      await updateIngestionHistoryService({
        connectorName,
        status: 'failed',
        startedAt: new Date(),
        completedAt: new Date(),
        options,
        error: error.message
      });
    }
  }

  getNextRunTime(cronExpression) {
    try {
      const task = cron.schedule(cronExpression, () => {}, { scheduled: false });
      return task.nextDates().toISOString();
    } catch (error) {
      return null;
    }
  }

  async unscheduleConnector(connectorName) {
    const job = this.cronJobs.get(connectorName);
    if (job) {
      job.stop();
      this.cronJobs.delete(connectorName);
      this.scheduledJobs.delete(connectorName);
      console.log(`Unscheduled connector ${connectorName}`);
      return true;
    }
    return false;
  }

  async pauseScheduler() {
    this.cronJobs.forEach(job => job.stop());
    this.isRunning = false;
    console.log("Ingestion scheduler paused");
  }

  async resumeScheduler() {
    this.cronJobs.forEach(job => job.start());
    this.isRunning = true;
    console.log("Ingestion scheduler resumed");
  }

  async stopScheduler() {
    this.cronJobs.forEach(job => job.stop());
    this.cronJobs.clear();
    this.scheduledJobs.clear();
    this.isRunning = false;
    console.log("Ingestion scheduler stopped");
  }

  getScheduledJobs() {
    return Array.from(this.scheduledJobs.entries()).map(([connectorName, schedule]) => ({
      connectorName,
      cronExpression: schedule.cronExpression,
      options: schedule.options,
      lastRun: schedule.lastRun,
      nextRun: schedule.nextRun,
      isActive: this.cronJobs.has(connectorName)
    }));
  }

  async getQueueStatus() {
    const queue = getDiscoveryQueue();
    
    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      jobs: {
        waiting: waiting.map(job => ({
          id: job.id,
          name: job.name,
          data: job.data,
          opts: job.opts
        })),
        active: active.map(job => ({
          id: job.id,
          name: job.name,
          data: job.data,
          progress: job.progress
        })),
        failed: failed.map(job => ({
          id: job.id,
          name: job.name,
          data: job.data,
          failedReason: job.failedReason,
          attemptsMade: job.attemptsMade
        }))
      }
    };
  }

  async runManualIngestion(connectorName, options = {}) {
    try {
      console.log(`Starting manual ingestion for ${connectorName}`);
      
      const result = await connectorRegistry.runConnector(connectorName, options);
      
      await updateIngestionHistoryService({
        connectorName,
        status: 'completed',
        jobId: result.jobId,
        startedAt: new Date(),
        completedAt: new Date(),
        options,
        result,
        type: 'manual'
      });

      console.log(`Completed manual ingestion for ${connectorName}`);
      return result;
    } catch (error) {
      console.error(`Error in manual ingestion for ${connectorName}:`, error);
      
      await updateIngestionHistoryService({
        connectorName,
        status: 'failed',
        startedAt: new Date(),
        completedAt: new Date(),
        options,
        error: error.message,
        type: 'manual'
      });
      
      throw error;
    }
  }

  async getIngestionStats(timeRange = '24h') {
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

    const queue = getDiscoveryQueue();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();

    const completedInRange = completed.filter(job => 
      new Date(job.finishedOn) >= startDate
    );

    const failedInRange = failed.filter(job => 
      new Date(job.finishedOn) >= startDate
    );

    const connectorStats = {};
    for (const job of completedInRange) {
      const connectorName = job.data.connectorName;
      if (!connectorStats[connectorName]) {
        connectorStats[connectorName] = { completed: 0, failed: 0 };
      }
      connectorStats[connectorName].completed++;
    }

    for (const job of failedInRange) {
      const connectorName = job.data.connectorName;
      if (!connectorStats[connectorName]) {
        connectorStats[connectorName] = { completed: 0, failed: 0 };
      }
      connectorStats[connectorName].failed++;
    }

    return {
      timeRange,
      totalCompleted: completedInRange.length,
      totalFailed: failedInRange.length,
      successRate: completedInRange.length / (completedInRange.length + failedInRange.length) * 100,
      connectorStats,
      period: {
        start: startDate,
        end: now
      }
    };
  }

  async updateSchedule(connectorName, cronExpression, options = {}) {
    if (!this.cronJobs.has(connectorName)) {
      throw new Error(`Connector ${connectorName} is not scheduled`);
    }

    await this.unscheduleConnector(connectorName);
    this.scheduleConnector(connectorName, cronExpression, options);
    
    return this.getScheduledJobs().find(job => job.connectorName === connectorName);
  }

  async getSchedulerStatus() {
    return {
      isRunning: this.isRunning,
      scheduledJobs: this.scheduledJobs.size,
      queueStatus: await this.getQueueStatus(),
      scheduledJobsList: this.getScheduledJobs()
    };
  }
}

export const ingestionScheduler = new IngestionScheduler();
export default ingestionScheduler;
