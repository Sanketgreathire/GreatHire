import { connection } from '../../../config/redis.js';
import { Queue, Worker } from 'bullmq';
import { OrchestrationMetadata } from '../../../models/orchestrationMetadata.model.js';

export class LoadBalancingService {
  constructor() {
    this.workerPools = new Map();
    this.connectorLimits = new Map();
    this.apiRateLimits = new Map();
    this.loadMetrics = new Map();
    this.balancingStrategies = new Map();
    
    this.initializeDefaultLimits();
    this.initializeBalancingStrategies();
  }

  initializeDefaultLimits() {
    // Default connector limits
    this.connectorLimits.set('github', {
      maxConcurrency: 3,
      maxRatePerMinute: 60,
      maxRatePerHour: 1000,
      cooldownMs: 1000,
      currentConcurrency: 0,
      currentRate: 0,
      lastRequestTime: null
    });

    this.connectorLimits.set('resume', {
      maxConcurrency: 2,
      maxRatePerMinute: 30,
      maxRatePerHour: 500,
      cooldownMs: 2000,
      currentConcurrency: 0,
      currentRate: 0,
      lastRequestTime: null
    });

    this.connectorLimits.set('portfolio', {
      maxConcurrency: 1,
      maxRatePerMinute: 20,
      maxRatePerHour: 300,
      cooldownMs: 3000,
      currentConcurrency: 0,
      currentRate: 0,
      lastRequestTime: null
    });

    // Default API rate limits
    this.apiRateLimits.set('github_api', {
      maxRequestsPerHour: 5000,
      maxRequestsPerMinute: 60,
      currentRequests: 0,
      resetTime: null,
      lastRequestTime: null
    });

    this.apiRateLimits.set('enrichment_api', {
      maxRequestsPerHour: 1000,
      maxRequestsPerMinute: 30,
      currentRequests: 0,
      resetTime: null,
      lastRequestTime: null
    });

    this.apiRateLimits.set('embedding_api', {
      maxRequestsPerHour: 2000,
      maxRequestsPerMinute: 50,
      currentRequests: 0,
      resetTime: null,
      lastRequestTime: null
    });
  }

  initializeBalancingStrategies() {
    this.balancingStrategies.set('round_robin', {
      name: 'Round Robin',
      description: 'Distribute load evenly across available workers'
    });

    this.balancingStrategies.set('least_connections', {
      name: 'Least Connections',
      description: 'Route to worker with fewest active connections'
    });

    this.balancingStrategies.set('weighted', {
      name: 'Weighted',
      description: 'Route based on worker capacity and performance'
    });

    this.balancingStrategies.set('adaptive', {
      name: 'Adaptive',
      description: 'Dynamically adjust based on current load and performance'
    });
  }

  async canProcessConnector(connectorName) {
    const limits = this.connectorLimits.get(connectorName);
    if (!limits) {
      return { canProcess: false, reason: 'Unknown connector' };
    }

    const now = Date.now();
    
    // Check concurrency limit
    if (limits.currentConcurrency >= limits.maxConcurrency) {
      return { canProcess: false, reason: 'Concurrency limit reached' };
    }

    // Check rate limit
    if (limits.lastRequestTime) {
      const timeSinceLastRequest = now - limits.lastRequestTime;
      if (timeSinceLastRequest < limits.cooldownMs) {
        return { 
          canProcess: false, 
          reason: 'Cooldown period active',
          waitTime: limits.cooldownMs - timeSinceLastRequest
        };
      }
    }

    // Check per-minute rate limit
    const currentMinute = Math.floor(now / 60000);
    if (limits.currentMinute !== currentMinute) {
      limits.currentRate = 0;
      limits.currentMinute = currentMinute;
    }

    if (limits.currentRate >= limits.maxRatePerMinute) {
      return { canProcess: false, reason: 'Per-minute rate limit exceeded' };
    }

    return { canProcess: true };
  }

  async acquireConnectorSlot(connectorName) {
    const limits = this.connectorLimits.get(connectorName);
    if (!limits) {
      throw new Error(`Unknown connector: ${connectorName}`);
    }

    const canProcess = await this.canProcessConnector(connectorName);
    if (!canProcess.canProcess) {
      throw new Error(`Cannot process ${connectorName}: ${canProcess.reason}`);
    }

    // Acquire slot
    limits.currentConcurrency++;
    limits.currentRate++;
    limits.lastRequestTime = Date.now();

    await this.logLoadBalancingEvent('slot_acquired', {
      connector: connectorName,
      concurrency: limits.currentConcurrency,
      rate: limits.currentRate,
      timestamp: new Date()
    });

    return {
      connector: connectorName,
      slotId: this.generateSlotId(connectorName),
      acquiredAt: new Date()
    };
  }

  async releaseConnectorSlot(connectorName, slotId) {
    const limits = this.connectorLimits.get(connectorName);
    if (!limits) {
      throw new Error(`Unknown connector: ${connectorName}`);
    }

    if (limits.currentConcurrency > 0) {
      limits.currentConcurrency--;
    }

    await this.logLoadBalancingEvent('slot_released', {
      connector: connectorName,
      slotId,
      concurrency: limits.currentConcurrency,
      timestamp: new Date()
    });

    return true;
  }

  async canMakeApiCall(apiName) {
    const limits = this.apiRateLimits.get(apiName);
    if (!limits) {
      return { canCall: false, reason: 'Unknown API' };
    }

    const now = Date.now();

    // Check if we need to reset the counter
    if (limits.resetTime && now >= limits.resetTime) {
      limits.currentRequests = 0;
      limits.resetTime = null;
    }

    // Check hourly limit
    if (limits.currentRequests >= limits.maxRequestsPerHour) {
      return { canCall: false, reason: 'Hourly rate limit exceeded' };
    }

    // Check per-minute limit
    if (limits.lastRequestTime) {
      const timeSinceLastRequest = now - limits.lastRequestTime;
      const minInterval = 60000 / limits.maxRequestsPerMinute;
      
      if (timeSinceLastRequest < minInterval) {
        return { 
          canCall: false, 
          reason: 'Per-minute rate limit exceeded',
          waitTime: minInterval - timeSinceLastRequest
        };
      }
    }

    return { canCall: true };
  }

  async makeApiCall(apiName, callFunction) {
    const limits = this.apiRateLimits.get(apiName);
    if (!limits) {
      throw new Error(`Unknown API: ${apiName}`);
    }

    const canCall = await this.canMakeApiCall(apiName);
    if (!canCall.canCall) {
      throw new Error(`Cannot call ${apiName}: ${canCall.reason}`);
    }

    // Set reset time if not set
    if (!limits.resetTime) {
      const now = Date.now();
      limits.resetTime = new Date(now + 3600000); // 1 hour from now
    }

    // Increment counter
    limits.currentRequests++;
    limits.lastRequestTime = Date.now();

    try {
      const result = await callFunction();
      
      await this.logLoadBalancingEvent('api_call_success', {
        api: apiName,
        currentRequests: limits.currentRequests,
        timestamp: new Date()
      });

      return result;
    } catch (error) {
      // Decrement counter on failure
      if (limits.currentRequests > 0) {
        limits.currentRequests--;
      }

      await this.logLoadBalancingEvent('api_call_error', {
        api: apiName,
        error: error.message,
        currentRequests: limits.currentRequests,
        timestamp: new Date()
      });

      throw error;
    }
  }

  async balanceQueueLoad(queueName, strategy = 'adaptive') {
    const queue = new Queue(queueName, { connection });
    const workers = await queue.getWorkers();
    
    if (workers.length === 0) {
      return { balanced: false, reason: 'No workers available' };
    }

    const waiting = await queue.getWaiting();
    const active = await queue.getActive();

    const loadInfo = {
      queueName,
      waitingJobs: waiting.length,
      activeJobs: active.length,
      availableWorkers: workers.length,
      strategy,
      timestamp: new Date()
    };

    // Apply balancing strategy
    const balancingResult = await this.applyBalancingStrategy(workers, loadInfo, strategy);

    await this.logLoadBalancingEvent('queue_balanced', {
      ...loadInfo,
      result: balancingResult
    });

    return {
      balanced: true,
      loadInfo,
      balancingResult
    };
  }

  async applyBalancingStrategy(workers, loadInfo, strategy) {
    switch (strategy) {
      case 'round_robin':
        return this.roundRobinBalance(workers, loadInfo);
      case 'least_connections':
        return this.leastConnectionsBalance(workers, loadInfo);
      case 'weighted':
        return this.weightedBalance(workers, loadInfo);
      case 'adaptive':
        return this.adaptiveBalance(workers, loadInfo);
      default:
        return this.adaptiveBalance(workers, loadInfo);
    }
  }

  roundRobinBalance(workers, loadInfo) {
    const totalJobs = loadInfo.waitingJobs + loadInfo.activeJobs;
    const jobsPerWorker = Math.ceil(totalJobs / workers.length);
    
    return {
      strategy: 'round_robin',
      distribution: workers.map(worker => ({
        workerId: worker.id,
        targetLoad: jobsPerWorker,
        currentLoad: this.getWorkerLoad(worker.id)
      })),
      efficiency: this.calculateEfficiency(workers, jobsPerWorker)
    };
  }

  leastConnectionsBalance(workers, loadInfo) {
    const sortedWorkers = workers.sort((a, b) => 
      this.getWorkerLoad(a.id) - this.getWorkerLoad(b.id)
    );
    
    const totalJobs = loadInfo.waitingJobs + loadInfo.activeJobs;
    let remainingJobs = totalJobs;
    const distribution = [];

    sortedWorkers.forEach((worker, index) => {
      const workerLoad = this.getWorkerLoad(worker.id);
      const availableCapacity = Math.max(0, 10 - workerLoad); // Assume max 10 jobs per worker
      const allocatedJobs = Math.min(availableCapacity, Math.ceil(remainingJobs / (workers.length - index)));
      
      distribution.push({
        workerId: worker.id,
        targetLoad: workerLoad + allocatedJobs,
        currentLoad: workerLoad,
        allocatedJobs
      });
      
      remainingJobs -= allocatedJobs;
    });

    return {
      strategy: 'least_connections',
      distribution,
      efficiency: this.calculateEfficiency(workers, distribution)
    };
  }

  weightedBalance(workers, loadInfo) {
    // Calculate worker weights based on performance metrics
    const weightedWorkers = workers.map(worker => ({
      worker,
      weight: this.calculateWorkerWeight(worker.id),
      currentLoad: this.getWorkerLoad(worker.id)
    }));

    const totalWeight = weightedWorkers.reduce((sum, w) => sum + w.weight, 0);
    const totalJobs = loadInfo.waitingJobs + loadInfo.activeJobs;

    const distribution = weightedWorkers.map(({ worker, weight, currentLoad }) => {
      const targetJobs = Math.round((weight / totalWeight) * totalJobs);
      return {
        workerId: worker.id,
        targetLoad: targetJobs,
        currentLoad,
        weight
      };
    });

    return {
      strategy: 'weighted',
      distribution,
      efficiency: this.calculateEfficiency(workers, distribution)
    };
  }

  async adaptiveBalance(workers, loadInfo) {
    // Analyze current load and adjust dynamically
    const currentLoad = loadInfo.waitingJobs + loadInfo.activeJobs;
    const workerCapacity = workers.length * 10; // Assume 10 jobs per worker capacity
    
    let strategy = 'least_connections';
    if (currentLoad > workerCapacity * 0.8) {
      strategy = 'weighted';
    } else if (currentLoad < workerCapacity * 0.3) {
      strategy = 'round_robin';
    }

    const balancingResult = await this.applyBalancingStrategy(workers, loadInfo, strategy);
    balancingResult.adaptiveStrategy = strategy;

    return balancingResult;
  }

  calculateWorkerWeight(workerId) {
    // This would calculate weight based on worker performance
    // For now, return a default weight
    return 1.0;
  }

  getWorkerLoad(workerId) {
    // This would get current load from worker metrics
    // For now, return a random load for demonstration
    return Math.floor(Math.random() * 5);
  }

  calculateEfficiency(workers, distribution) {
    if (!distribution) {
      return 0;
    }

    const totalLoad = distribution.reduce((sum, d) => sum + d.targetLoad, 0);
    const idealLoad = totalLoad / workers.length;
    
    const variance = distribution.reduce((sum, d) => {
      return sum + Math.pow(d.targetLoad - idealLoad, 2);
    }, 0);

    const maxVariance = Math.pow(idealLoad, 2) * workers.length;
    const efficiency = maxVariance > 0 ? (1 - variance / maxVariance) * 100 : 100;

    return Math.max(0, Math.min(100, efficiency));
  }

  async getLoadMetrics(timeRange = '1h') {
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
            eventType: { $in: ['slot_acquired', 'slot_released', 'api_call_success'] },
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
        }
      ]);

      const formattedMetrics = {
        connectors: {},
        apis: {},
        timeRange,
        period: { start: startDate, end: now }
      };

      metrics.forEach(metric => {
        const connector = metric._id.connector;
        const eventType = metric._id.eventType;

        if (connector) {
          if (!formattedMetrics.connectors[connector]) {
            formattedMetrics.connectors[connector] = {
              slotsAcquired: 0,
              slotsReleased: 0,
              lastActivity: null
            };
          }

          if (eventType === 'slot_acquired') {
            formattedMetrics.connectors[connector].slotsAcquired = metric.count;
          } else if (eventType === 'slot_released') {
            formattedMetrics.connectors[connector].slotsReleased = metric.count;
          }

          if (!formattedMetrics.connectors[connector].lastActivity || 
              new Date(metric.lastOccurrence) > new Date(formattedMetrics.connectors[connector].lastActivity)) {
            formattedMetrics.connectors[connector].lastActivity = metric.lastOccurrence;
          }
        }
      });

      // Add current limits
      this.connectorLimits.forEach((limits, connector) => {
        if (!formattedMetrics.connectors[connector]) {
          formattedMetrics.connectors[connector] = {};
        }
        
        formattedMetrics.connectors[connector].currentConcurrency = limits.currentConcurrency;
        formattedMetrics.connectors[connector].currentRate = limits.currentRate;
        formattedMetrics.connectors[connector].maxConcurrency = limits.maxConcurrency;
        formattedMetrics.connectors[connector].maxRatePerMinute = limits.maxRatePerMinute;
      });

      return formattedMetrics;
    } catch (error) {
      console.error('Error getting load metrics:', error);
      return {
        connectors: {},
        apis: {},
        timeRange,
        period: { start: startDate, end: now }
      };
    }
  }

  async getConnectorUtilization() {
    const utilization = {};

    this.connectorLimits.forEach((limits, connector) => {
      utilization[connector] = {
        concurrencyUtilization: limits.maxConcurrency > 0 ? 
          (limits.currentConcurrency / limits.maxConcurrency * 100).toFixed(2) : 0,
        rateUtilization: limits.maxRatePerMinute > 0 ? 
          (limits.currentRate / limits.maxRatePerMinute * 100).toFixed(2) : 0,
        currentConcurrency: limits.currentConcurrency,
        maxConcurrency: limits.maxConcurrency,
        currentRate: limits.currentRate,
        maxRatePerMinute: limits.maxRatePerMinute,
        lastRequestTime: limits.lastRequestTime
      };
    });

    return utilization;
  }

  async getApiUtilization() {
    const utilization = {};

    this.apiRateLimits.forEach((limits, api) => {
      const hourlyUtilization = limits.maxRequestsPerHour > 0 ? 
        (limits.currentRequests / limits.maxRequestsPerHour * 100).toFixed(2) : 0;

      utilization[api] = {
        hourlyUtilization,
        currentRequests: limits.currentRequests,
        maxRequestsPerHour: limits.maxRequestsPerHour,
        maxRequestsPerMinute: limits.maxRequestsPerMinute,
        resetTime: limits.resetTime,
        lastRequestTime: limits.lastRequestTime
      };
    });

    return utilization;
  }

  async updateConnectorLimits(connectorName, limits) {
    const currentLimits = this.connectorLimits.get(connectorName);
    if (!currentLimits) {
      throw new Error(`Unknown connector: ${connectorName}`);
    }

    this.connectorLimits.set(connectorName, { ...currentLimits, ...limits });

    await this.logLoadBalancingEvent('limits_updated', {
      connector: connectorName,
      newLimits: this.connectorLimits.get(connectorName),
      timestamp: new Date()
    });

    return this.connectorLimits.get(connectorName);
  }

  async updateApiLimits(apiName, limits) {
    const currentLimits = this.apiRateLimits.get(apiName);
    if (!currentLimits) {
      throw new Error(`Unknown API: ${apiName}`);
    }

    this.apiRateLimits.set(apiName, { ...currentLimits, ...limits });

    await this.logLoadBalancingEvent('api_limits_updated', {
      api: apiName,
      newLimits: this.apiRateLimits.get(apiName),
      timestamp: new Date()
    });

    return this.apiRateLimits.get(apiName);
  }

  async enableAutoScaling(queueName, config = {}) {
    const defaultConfig = {
      minWorkers: 1,
      maxWorkers: 10,
      scaleUpThreshold: 0.8,
      scaleDownThreshold: 0.3,
      scaleUpCooldown: 300000, // 5 minutes
      scaleDownCooldown: 600000, // 10 minutes
      ...config
    };

    this.workerPools.set(queueName, {
      autoScaling: true,
      config: defaultConfig,
      lastScaleAction: null,
      currentWorkers: 1
    });

    await this.logLoadBalancingEvent('auto_scaling_enabled', {
      queueName,
      config: defaultConfig,
      timestamp: new Date()
    });

    return true;
  }

  async disableAutoScaling(queueName) {
    const pool = this.workerPools.get(queueName);
    if (pool) {
      pool.autoScaling = false;
      
      await this.logLoadBalancingEvent('auto_scaling_disabled', {
        queueName,
        timestamp: new Date()
      });
    }

    return true;
  }

  generateSlotId(connectorName) {
    return `${connectorName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async logLoadBalancingEvent(eventType, data) {
    try {
      await OrchestrationMetadata.create({
        orchestrationId: `loadbalancing-${Date.now()}`,
        eventType,
        data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging load balancing event:', error);
    }
  }

  async getLoadBalancingHealth() {
    const connectorUtilization = await this.getConnectorUtilization();
    const apiUtilization = await this.getApiUtilization();
    
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      connectors: connectorUtilization,
      apis: apiUtilization,
      issues: []
    };

    // Check for issues
    Object.values(connectorUtilization).forEach(util => {
      if (parseFloat(util.concurrencyUtilization) > 90) {
        health.status = 'warning';
        health.issues.push('High connector concurrency utilization');
      }
      if (parseFloat(util.rateUtilization) > 90) {
        health.status = 'warning';
        health.issues.push('High connector rate utilization');
      }
    });

    Object.values(apiUtilization).forEach(util => {
      if (parseFloat(util.hourlyUtilization) > 90) {
        health.status = 'warning';
        health.issues.push('High API utilization');
      }
    });

    if (health.issues.length > 2) {
      health.status = 'degraded';
    }

    return health;
  }
}

export const loadBalancingService = new LoadBalancingService();
export default loadBalancingService;
