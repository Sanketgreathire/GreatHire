import { Queue, Worker } from 'bullmq';
import { connection } from '../../../config/redis.js';
import { discoveryOrchestratorService } from '../services/discoveryOrchestrator.service.js';
import { connectorSchedulerService } from '../services/connectorScheduler.service.js';
import { queueCoordinatorService } from '../services/queueCoordinator.service.js';
import { failureRecoveryService } from '../services/failureRecovery.service.js';
import { loadBalancingService } from '../services/loadBalancing.service.js';
import { OrchestrationMetadata } from '../../../models/orchestrationMetadata.model.js';

const ORCHESTRATOR_QUEUE_NAME = "orchestrator-processing";

let orchestratorQueue = null;
let orchestratorWorker = null;

export function getOrchestratorQueue() {
  if (!orchestratorQueue) {
    orchestratorQueue = new Queue(ORCHESTRATOR_QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    });
  }
  return orchestratorQueue;
}

export async function enqueueOrchestration(data, options = {}) {
  const queue = getOrchestratorQueue();
  
  return await queue.add(data.type || 'orchestrate-discovery', data, {
    priority: options.priority || 10,
    delay: options.delay || 0,
    attempts: options.attempts || 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    ...options
  });
}

export async function enqueueDiscoveryOrchestration(options = {}) {
  return await enqueueOrchestration({
    type: 'orchestrate-discovery',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 5 });
}

export async function enqueueConnectorOrchestration(connectorName, options = {}) {
  return await enqueueOrchestration({
    type: 'orchestrate-connector',
    connectorName,
    options,
    timestamp: new Date().toISOString()
  }, { priority: 8 });
}

export async function enqueuePipelineOrchestration(options = {}) {
  return await enqueueOrchestration({
    type: 'orchestrate-pipeline',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 6 });
}

export async function enqueueHealthCheckOrchestration(options = {}) {
  return await enqueueOrchestration({
    type: 'health-check',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 3 });
}

export async function enqueueLoadBalancingOrchestration(options = {}) {
  return await enqueueOrchestration({
    type: 'load-balancing',
    options,
    timestamp: new Date().toISOString()
  }, { priority: 4 });
}

export async function getOrchestratorQueueStats() {
  const queue = getOrchestratorQueue();
  
  const [waiting, active, completed, failed] = await Promise.all([
    queue.getWaiting(),
    queue.getActive(),
    queue.getCompleted(),
    queue.getFailed()
  ]);

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
    total: waiting.length + active.length + completed.length + failed.length
  };
}

export async function startOrchestratorWorker() {
  if (orchestratorWorker) {
    console.log('Orchestrator worker already running');
    return orchestratorWorker;
  }

  const { isRedisAvailable } = await import('../../../config/redis.js');
  if (!(await isRedisAvailable())) {
    console.warn('⚠️  Orchestrator worker: Redis unavailable or version too old, skipping startup');
    return null;
  }

  orchestratorWorker = new Worker(
    ORCHESTRATOR_QUEUE_NAME,
    async (job) => {
      const { type, data } = job;
      
      try {
        console.log(`Processing orchestration job: ${type}`, { jobId: job.id });
        
        let result;
        
        switch (type) {
          case 'orchestrate-discovery':
            result = await processDiscoveryOrchestration(data);
            break;
            
          case 'orchestrate-connector':
            result = await processConnectorOrchestration(data);
            break;
            
          case 'orchestrate-pipeline':
            result = await processPipelineOrchestration(data);
            break;
            
          case 'health-check':
            result = await processHealthCheck(data);
            break;
            
          case 'load-balancing':
            result = await processLoadBalancing(data);
            break;
            
          case 'scheduled-orchestration':
            result = await processScheduledOrchestration(data);
            break;
            
          default:
            throw new Error(`Unknown job type: ${type}`);
        }
        
        console.log(`Completed orchestration job: ${type}`, { jobId: job.id });
        return result;
        
      } catch (error) {
        console.error(`Failed orchestration job: ${type}`, { jobId: job.id, error: error.message });
        
        // Handle failure recovery
        await failureRecoveryService.handleFailedJob(
          ORCHESTRATOR_QUEUE_NAME,
          job.id,
          error,
          job.attemptsMade + 1
        );
        
        throw error;
      }
    },
    {
      connection,
      concurrency: 2, // Low concurrency for orchestrator jobs
      limiter: {
        max: 10, // Max 10 jobs per minute
        duration: 60000 // 1 minute
      }
    }
  );

  orchestratorWorker.on('completed', (job) => {
    console.log(`Orchestrator job completed: ${job.name}`, { jobId: job.id });
  });

  orchestratorWorker.on('failed', (job, err) => {
    console.error(`Orchestrator job failed: ${job.name}`, { jobId: job.id, error: err.message });
  });

  orchestratorWorker.on('error', (err) => {
    console.error('Orchestrator worker error:', err);
  });

  console.log('Orchestrator worker started');
  return orchestratorWorker;
}

export async function stopOrchestratorWorker() {
  if (orchestratorWorker) {
    await orchestratorWorker.close();
    orchestratorWorker = null;
    console.log('Orchestrator worker stopped');
  }
}

async function processDiscoveryOrchestration(data) {
  const { options = {} } = data;
  
  const result = await discoveryOrchestratorService.orchestrateDiscovery(options);
  
  await logOrchestrationEvent('discovery_orchestration_complete', {
    orchestrationId: result.orchestrationId,
    result,
    timestamp: new Date()
  });

  return result;
}

async function processConnectorOrchestration(data) {
  const { connectorName, options = {} } = data;
  
  const result = await discoveryOrchestratorService.runSpecificConnector(connectorName, options);
  
  await logOrchestrationEvent('connector_orchestration_complete', {
    connectorName,
    result,
    timestamp: new Date()
  });

  return result;
}

async function processPipelineOrchestration(data) {
  const { options = {} } = data;
  
  // This would coordinate pipeline stages
  const pipelineResult = {
    stages: {
      discovery: { success: true, processed: 0 },
      parsing: { success: true, processed: 0 },
      enrichment: { success: true, processed: 0 },
      embedding: { success: true, processed: 0 },
      indexing: { success: true, processed: 0 }
    },
    timestamp: new Date()
  };

  await logOrchestrationEvent('pipeline_orchestration_complete', {
    pipelineResult,
    timestamp: new Date()
  });

  return pipelineResult;
}

async function processHealthCheck(data) {
  const { options = {} } = data;
  
  const health = {
    orchestrator: await getOrchestratorHealth(),
    connectors: await discoveryOrchestratorService.getConnectorStatus(),
    scheduler: await connectorSchedulerService.getSchedulerHealth(),
    queues: await queueCoordinatorService.getQueueHealth(),
    loadBalancing: await loadBalancingService.getLoadBalancingHealth(),
    failureRecovery: await failureRecoveryService.getRecoveryHealth(),
    timestamp: new Date()
  };

  // Determine overall health
  const healthStatuses = [
    health.orchestrator.status,
    health.scheduler.status,
    health.queues.status,
    health.loadBalancing.status,
    health.failureRecovery.status
  ];

  if (healthStatuses.includes('critical')) {
    health.overallStatus = 'critical';
  } else if (healthStatuses.includes('unhealthy')) {
    health.overallStatus = 'unhealthy';
  } else if (healthStatuses.includes('degraded')) {
    health.overallStatus = 'degraded';
  } else {
    health.overallStatus = 'healthy';
  }

  await logOrchestrationEvent('health_check_complete', {
    health,
    timestamp: new Date()
  });

  return health;
}

async function processLoadBalancing(data) {
  const { options = {} } = data;
  const { queueName, strategy = 'adaptive' } = options;
  
  const balancingResult = await loadBalancingService.balanceQueueLoad(queueName, strategy);
  
  await logOrchestrationEvent('load_balancing_complete', {
    queueName,
    strategy,
    balancingResult,
    timestamp: new Date()
  });

  return balancingResult;
}

async function processScheduledOrchestration(data) {
  const { options = {} } = data;
  const { scheduleType, connectors } = options;
  
  let result;
  
  switch (scheduleType) {
    case 'discovery':
      result = await discoveryOrchestratorService.orchestrateDiscovery({
        connectors: connectors || ['github', 'resume', 'portfolio'],
        ...options
      });
      break;
      
    case 'health-check':
      result = await processHealthCheck(options);
      break;
      
    case 'load-balancing':
      result = await processLoadBalancing(options);
      break;
      
    default:
      throw new Error(`Unknown schedule type: ${scheduleType}`);
  }

  await logOrchestrationEvent('scheduled_orchestration_complete', {
    scheduleType,
    result,
    timestamp: new Date()
  });

  return result;
}

async function getOrchestratorHealth() {
  try {
    const queueStats = await getOrchestratorQueueStats();
    
    return {
      status: 'healthy',
      queue: queueStats,
      workerRunning: !!orchestratorWorker,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    };
  }
}

export async function scheduleOrchestration(options = {}) {
  const {
    cronExpression = '0 */2 * * *', // Every 2 hours
    scheduleType = 'discovery',
    connectors,
    priority = 5
  } = options;

  return await enqueueOrchestration({
    type: 'scheduled-orchestration',
    options: {
      cronExpression,
      scheduleType,
      connectors,
      ...options
    },
    timestamp: new Date().toISOString()
  }, { priority });
}

export async function getOrchestrationMetrics(timeRange = '24h') {
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

  // This would typically query your metrics database
  // For now, return placeholder data
  return {
    timeRange,
    orchestrations: {
      total: 0,
      successful: 0,
      failed: 0,
      avgDuration: 0
    },
    connectors: {
      github: { orchestrations: 0, success: 0, avgDuration: 0 },
      resume: { orchestrations: 0, success: 0, avgDuration: 0 },
      portfolio: { orchestrations: 0, success: 0, avgDuration: 0 }
    },
    pipeline: {
      discovery: { processed: 0, success: 0 },
      enrichment: { processed: 0, success: 0 },
      embedding: { processed: 0, success: 0 }
    }
  };
}

export async function getWorkerHealth() {
  try {
    const queueStats = await getOrchestratorQueueStats();
    
    return {
      status: 'healthy',
      queue: queueStats,
      workerRunning: !!orchestratorWorker,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    };
  }
}

export async function clearOrchestratorQueue() {
  const queue = getOrchestratorQueue();
  await queue.obliterate({ force: true });
}

export async function pauseOrchestratorQueue() {
  const queue = getOrchestratorQueue();
  await queue.pause();
}

export async function resumeOrchestratorQueue() {
  const queue = getOrchestratorQueue();
  await queue.resume();
}

// Auto-scaling hooks
export async function enableAutoScaling(queueName, config) {
  return await loadBalancingService.enableAutoScaling(queueName, config);
}

export async function disableAutoScaling(queueName) {
  return await loadBalancingService.disableAutoScaling(queueName);
}

// Distributed scaling preparation
export async function prepareDistributedScaling() {
  const scalingConfig = {
    connectorSharding: {
      enabled: true,
      shards: {
        github: 3,
        resume: 2,
        portfolio: 1
      }
    },
    queuePartitioning: {
      enabled: true,
      partitions: {
        'github-discovery': 3,
        'resume-discovery': 2,
        'portfolio-discovery': 1,
        'freshness-processing': 5
      }
    },
    workerAutoscaling: {
      enabled: true,
      minWorkers: 1,
      maxWorkers: 10,
      scaleUpThreshold: 0.8,
      scaleDownThreshold: 0.3
    }
  };

  await logOrchestrationEvent('distributed_scaling_prepared', {
    scalingConfig,
    timestamp: new Date()
  });

  return scalingConfig;
}

async function logOrchestrationEvent(eventType, data) {
  try {
    await OrchestrationMetadata.create({
      orchestrationId: `orch-${Date.now()}`,
      eventType,
      data,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging orchestration event:', error);
  }
}

export default {
  getOrchestratorQueue,
  enqueueOrchestration,
  enqueueDiscoveryOrchestration,
  enqueueConnectorOrchestration,
  enqueuePipelineOrchestration,
  enqueueHealthCheckOrchestration,
  enqueueLoadBalancingOrchestration,
  getOrchestratorQueueStats,
  startOrchestratorWorker,
  stopOrchestratorWorker,
  scheduleOrchestration,
  getOrchestrationMetrics,
  getWorkerHealth,
  clearOrchestratorQueue,
  pauseOrchestratorQueue,
  resumeOrchestratorQueue,
  enableAutoScaling,
  disableAutoScaling,
  prepareDistributedScaling
};
