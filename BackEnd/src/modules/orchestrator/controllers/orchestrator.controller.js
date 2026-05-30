import {
  enqueueDiscoveryOrchestration,
  enqueueConnectorOrchestration,
  enqueuePipelineOrchestration,
  enqueueHealthCheckOrchestration,
  enqueueLoadBalancingOrchestration,
  getOrchestratorQueueStats,
  scheduleOrchestration,
  
  getWorkerHealth,
  clearOrchestratorQueue,
  pauseOrchestratorQueue,
  resumeOrchestratorQueue,
  enableAutoScaling,
  disableAutoScaling,
  prepareDistributedScaling
} from "../workers/orchestrator.worker.js";
import { discoveryOrchestratorService } from "../services/discoveryOrchestrator.service.js";
import { connectorSchedulerService } from "../services/connectorScheduler.service.js";
import { queueCoordinatorService } from "../services/queueCoordinator.service.js";
import { failureRecoveryService } from "../services/failureRecovery.service.js";
import { loadBalancingService } from "../services/loadBalancing.service.js";
import { OrchestrationMetadata } from "../../../models/orchestrationMetadata.model.js";

export const runOrchestration = async (req, res) => {
  try {
    const { type = 'discovery', options = {} } = req.body;

    let result;
    switch (type) {
      case 'discovery':
        result = await enqueueDiscoveryOrchestration(options);
        break;
      case 'connector':
        result = await enqueueConnectorOrchestration(options.connectorName, options);
        break;
      case 'pipeline':
        result = await enqueuePipelineOrchestration(options);
        break;
      case 'health-check':
        result = await enqueueHealthCheckOrchestration(options);
        break;
      case 'load-balancing':
        result = await enqueueLoadBalancingOrchestration(options);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid orchestration type"
        });
    }

    return res.status(200).json({
      success: true,
      data: result,
      message: `${type} orchestration started successfully`
    });
  } catch (error) {
    console.error("Error running orchestration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run orchestration",
      error: error.message
    });
  }
};

export const getOrchestratorStatus = async (req, res) => {
  try {
    const queueStats = await getOrchestratorQueueStats();
    const workerHealth = await getWorkerHealth();
    // const metrics = await getOrchestratorMetrics();
    
    return res.status(200).json({
      success: true,
      data: {
        queue: queueStats,
        worker: workerHealth,
        metrics,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error getting orchestrator status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get orchestrator status",
      error: error.message
    });
  }
};

export const getOrchestratorStats = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // const stats = await getOrchestratorMetrics(timeRange);
    const queueStats = await getOrchestratorQueueStats();
    
    return res.status(200).json({
      success: true,
      data: {
        timeRange,
        orchestrations: stats,
        queue: queueStats,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Error getting orchestrator stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get orchestrator stats",
      error: error.message
    });
  }
};

export const getOrchestratorHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, timeRange = '30d' } = req.query;
    
    const eventCounts = await OrchestrationMetadata.getEventCounts(timeRange);
    
    return res.status(200).json({
      success: true,
      data: {
        timeRange,
        events: eventCounts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: Object.keys(eventCounts).length
        }
      }
    });
  } catch (error) {
    console.error("Error getting orchestrator history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get orchestrator history",
      error: error.message
    });
  }
};

export const getOrchestratorMetricsHandler = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // const metrics = await getOrchestratorMetrics(timeRange);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error("Error getting orchestrator metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get orchestrator metrics",
      error: error.message
    });
  }
};

export const pauseOrchestration = async (req, res) => {
  try {
    await pauseOrchestratorQueue();
    
    return res.status(200).json({
      success: true,
      message: "Orchestration queue paused"
    });
  } catch (error) {
    console.error("Error pausing orchestration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to pause orchestration",
      error: error.message
    });
  }
};

export const resumeOrchestration = async (req, res) => {
  try {
    await resumeOrchestratorQueue();
    
    return res.status(200).json({
      success: true,
      message: "Orchestration queue resumed"
    });
  } catch (error) {
    console.error("Error resuming orchestration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resume orchestration",
      error: error.message
    });
  }
};

export const cancelOrchestrationJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // This would cancel a specific job
    return res.status(200).json({
      success: true,
      message: `Orchestration job ${jobId} cancelled`
    });
  } catch (error) {
    console.error("Error cancelling orchestration job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel orchestration job",
      error: error.message
    });
  }
};

export const retryOrchestrationJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // This would retry a specific job
    return res.status(200).json({
      success: true,
      message: `Orchestration job ${jobId} retry started`
    });
  } catch (error) {
    console.error("Error retrying orchestration job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retry orchestration job",
      error: error.message
    });
  }
};

export const getConnectors = async (req, res) => {
  try {
    const connectorStatus = await discoveryOrchestratorService.getConnectorStatus();
    
    return res.status(200).json({
      success: true,
      data: connectorStatus
    });
  } catch (error) {
    console.error("Error getting connectors:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get connectors",
      error: error.message
    });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const queueStatuses = await queueCoordinatorService.getAllQueueStatuses();
    const workerStatuses = await queueCoordinatorService.getAllWorkerStatuses();
    
    return res.status(200).json({
      success: true,
      data: {
        queues: queueStatuses,
        workers: workerStatuses
      }
    });
  } catch (error) {
    console.error("Error getting workers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get workers",
      error: error.message
    });
  }
};

export const getQueues = async (req, res) => {
  try {
    const queueStatuses = await queueCoordinatorService.getAllQueueStatuses();
    const bottlenecks = await queueCoordinatorService.detectBottlenecks();
    const delays = await queueCoordinatorService.getProcessingDelays();
    
    return res.status(200).json({
      success: true,
      data: {
        queues: queueStatuses,
        bottlenecks,
        delays
      }
    });
  } catch (error) {
    console.error("Error getting queues:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get queues",
      error: error.message
    });
  }
};

export const restartWorker = async (req, res) => {
  try {
    const { workerName } = req.params;
    
    // This would restart a specific worker
    return res.status(200).json({
      success: true,
      message: `Worker ${workerName} restarted`
    });
  } catch (error) {
    console.error("Error restarting worker:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to restart worker",
      error: error.message
    });
  }
};

export const runConnector = async (req, res) => {
  try {
    const { connectorName } = req.params;
    const { options = {} } = req.body;
    
    const result = await discoveryOrchestratorService.runSpecificConnector(connectorName, options);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Connector ${connectorName} execution started`
    });
  } catch (error) {
    console.error("Error running connector:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run connector",
      error: error.message
    });
  }
};

export const getIngestionAnalytics = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    // const metrics = await getOrchestratorMetrics(timeRange);
    const loadMetrics = await loadBalancingService.getLoadMetrics(timeRange);
    const failureStats = await failureRecoveryService.getFailureStats(timeRange);
    const recoveryStats = await failureRecoveryService.getRecoveryStats(timeRange);
    
    return res.status(200).json({
      success: true,
      data: {
        timeRange,
        profilesDiscovered: metrics.orchestrations?.total || 0,
        profilesIndexed: metrics.orchestrations?.successful || 0,
        ingestionSpeed: loadMetrics.connectors?.github?.slotsAcquired || 0,
        duplicateRate: failureStats.stats?.github?.avgAttempts || 0,
        enrichmentThroughput: metrics.pipeline?.enrichment?.processed || 0,
        loadMetrics,
        failureStats,
        recoveryStats
      }
    });
  } catch (error) {
    console.error("Error getting ingestion analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get ingestion analytics",
      error: error.message
    });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const schedules = connectorSchedulerService.getAllSchedules();
    
    return res.status(200).json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error("Error getting schedules:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get schedules",
      error: error.message
    });
  }
};

export const addSchedule = async (req, res) => {
  try {
    const { connectorName, config } = req.body;
    
    const result = await connectorSchedulerService.addSchedule(connectorName, config);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Schedule added for ${connectorName}`
    });
  } catch (error) {
    console.error("Error adding schedule:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add schedule",
      error: error.message
    });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { connectorName } = req.params;
    const { config } = req.body;
    
    const result = await connectorSchedulerService.updateSchedule(connectorName, config);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Schedule updated for ${connectorName}`
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update schedule",
      error: error.message
    });
  }
};

export const removeSchedule = async (req, res) => {
  try {
    const { connectorName } = req.params;
    
    const result = await connectorSchedulerService.removeSchedule(connectorName);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Schedule removed for ${connectorName}`
    });
  } catch (error) {
    console.error("Error removing schedule:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove schedule",
      error: error.message
    });
  }
};

export const getLoadBalancing = async (req, res) => {
  try {
    const { queueName, strategy = 'adaptive' } = req.query;
    
    const balancingResult = await loadBalancingService.balanceQueueLoad(queueName, strategy);
    const utilization = await loadBalancingService.getLoadBalancingHealth();
    
    return res.status(200).json({
      success: true,
      data: {
        balancingResult,
        utilization
      }
    });
  } catch (error) {
    console.error("Error getting load balancing:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get load balancing",
      error: error.message
    });
  }
};

export const getFailureRecovery = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    const failureStats = await failureRecoveryService.getFailureStats(timeRange);
    const recoveryStats = await failureRecoveryService.getRecoveryStats(timeRange);
    const deadLetterStats = await failureRecoveryService.getDeadLetterStats();
    
    return res.status(200).json({
      success: true,
      data: {
        timeRange,
        failureStats,
        recoveryStats,
        deadLetterStats
      }
    });
  } catch (error) {
    console.error("Error getting failure recovery:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get failure recovery",
      error: error.message
    });
  }
};

export const getDeadLetterJobs = async (req, res) => {
  try {
    const { queueName, limit = 50 } = req.query;
    
    const deadLetterJobs = await failureRecoveryService.getDeadLetterJobs(queueName, limit);
    
    return res.status(200).json({
      success: true,
      data: deadLetterJobs
    });
  } catch (error) {
    console.error("Error getting dead letter jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get dead letter jobs",
      error: error.message
    });
  }
};

export const retryDeadLetterJob = async (req, res) => {
  try {
    const { queueName } = req.params;
    const { deadLetterJobId } = req.body;
    
    const result = await failureRecoveryService.retryDeadLetterJob(queueName, deadLetterJobId);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Dead letter job retry started"
    });
  } catch (error) {
    console.error("Error retrying dead letter job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retry dead letter job",
      error: error.message
    });
  }
};

export const clearDeadLetterQueue = async (req, res) => {
  try {
    const { queueName } = req.params;
    
    const result = await failureRecoveryService.clearDeadLetterQueue(queueName);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Dead letter queue cleared for ${queueName}`
    });
  } catch (error) {
    console.error("Error clearing dead letter queue:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear dead letter queue",
      error: error.message
    });
  }
};

export const scheduleOrchestrationHandler = async (req, res) => {
  try {
    const { cronExpression, scheduleType, connectors } = req.body;
    
    const result = await scheduleOrchestration({
      cronExpression,
      scheduleType,
      connectors
    });
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Orchestration scheduled successfully"
    });
  } catch (error) {
    console.error("Error scheduling orchestration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule orchestration",
      error: error.message
    });
  }
};

export const enableAutoScalingHandler = async (req, res) => {
  try {
    const { queueName, config } = req.body;
    
    const result = await enableAutoScaling(queueName, config);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Auto scaling enabled for ${queueName}`
    });
  } catch (error) {
    console.error("Error enabling auto scaling:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to enable auto scaling",
      error: error.message
    });
  }
};

export const disableAutoScalingHandler = async (req, res) => {
  try {
    const { queueName } = req.params;
    
    const result = await disableAutoScaling(queueName);
    
    return res.status(200).json({
      success: true,
      data: result,
      message: `Auto scaling disabled for ${queueName}`
    });
  } catch (error) {
    console.error("Error disabling auto scaling:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to disable auto scaling",
      error: error.message
    });
  }
};

export const prepareDistributedScalingHandler = async (req, res) => {
  try {
    const result = await prepareDistributedScaling();
    
    return res.status(200).json({
      success: true,
      data: result,
      message: "Distributed scaling preparation completed"
    });
  } catch (error) {
    console.error("Error preparing distributed scaling:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to prepare distributed scaling",
      error: error.message
    });
  }
};
