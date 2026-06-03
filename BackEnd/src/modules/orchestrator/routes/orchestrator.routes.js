import express from "express";
import {
  runOrchestration,
  getOrchestratorStatus,
  getOrchestratorStats,
  getOrchestratorHistory,
  getOrchestratorMetricsHandler,
  pauseOrchestration,
  resumeOrchestration,
  cancelOrchestrationJob,
  retryOrchestrationJob,
  getConnectors,
  getWorkers,
  getQueues,
  restartWorker,
  runConnector,
  getIngestionAnalytics,
  getSchedules,
  addSchedule,
  updateSchedule,
  removeSchedule,
  getLoadBalancing,
  getFailureRecovery,
  getDeadLetterJobs,
  retryDeadLetterJob,
  clearDeadLetterQueue,
  scheduleOrchestrationHandler,
  enableAutoScalingHandler,
  disableAutoScalingHandler,
  prepareDistributedScalingHandler
} from "../controllers/orchestrator.controller.js";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";

const router = express.Router();

// Run orchestration
router.post("/run", isAuthenticated, runOrchestration);

// Get orchestrator status
router.get("/status", isAuthenticated, getOrchestratorStatus);

// Get orchestrator statistics
router.get("/stats", isAuthenticated, getOrchestratorStats);

// Get orchestrator history
router.get("/history", isAuthenticated, getOrchestratorHistory);

// Get orchestrator metrics
router.get("/metrics", isAuthenticated, getOrchestratorMetricsHandler);

// Pause orchestration
router.post("/pause", isAuthenticated, pauseOrchestration);

// Resume orchestration
router.post("/resume", isAuthenticated, resumeOrchestration);

// Cancel orchestration job
router.post("/cancel/:jobId", isAuthenticated, cancelOrchestrationJob);

// Retry orchestration job
router.post("/retry/:jobId", isAuthenticated, retryOrchestrationJob);

// Get connectors
router.get("/connectors", isAuthenticated, getConnectors);

// Get workers
router.get("/workers", isAuthenticated, getWorkers);

// Get queues
router.get("/queues", isAuthenticated, getQueues);

// Restart worker
router.post("/workers/:workerName/restart", isAuthenticated, restartWorker);

// Run connector
router.post("/connectors/:connectorName/run", isAuthenticated, runConnector);

// Get ingestion analytics
router.get("/analytics/ingestion", isAuthenticated, getIngestionAnalytics);

// Get schedules
router.get("/schedules", isAuthenticated, getSchedules);

// Add schedule
router.post("/schedules", isAuthenticated, addSchedule);

// Update schedule
router.put("/schedules/:connectorName", isAuthenticated, updateSchedule);

// Remove schedule
router.delete("/schedules/:connectorName", isAuthenticated, removeSchedule);

// Get load balancing
router.get("/load-balancing", isAuthenticated, getLoadBalancing);

// Get failure recovery
router.get("/failure-recovery", isAuthenticated, getFailureRecovery);

// Get dead letter jobs
router.get("/dead-letter/:queueName", isAuthenticated, getDeadLetterJobs);

// Retry dead letter job
router.post("/dead-letter/:queueName/retry", isAuthenticated, retryDeadLetterJob);

// Clear dead letter queue
router.delete("/dead-letter/:queueName", isAuthenticated, clearDeadLetterQueue);

// Schedule orchestration
router.post("/schedule", isAuthenticated, scheduleOrchestrationHandler);

// Enable auto scaling
router.post("/auto-scaling/enable", isAuthenticated, enableAutoScalingHandler);

// Disable auto scaling
router.post("/auto-scaling/:queueName/disable", isAuthenticated, disableAutoScalingHandler);

// Prepare distributed scaling
router.post("/distributed-scaling/prepare", isAuthenticated, prepareDistributedScalingHandler);

export default router;
