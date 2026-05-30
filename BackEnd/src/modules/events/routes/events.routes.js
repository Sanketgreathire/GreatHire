import express from "express";
import {
  getEventStatus,
  getTopics,
  getThroughput,
  getFailures,
  getConsumerLag,
  getDeadLetterQueue,
  retryDeadLetterEvent,
  clearDeadLetterQueue,
  getEventFlow,
  createTopic,
  deleteTopic,
  publishTestEvent,
  getEventHandlerStatus,
  restartEventHandler
} from "../controllers/events.controller.js";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";

const router = express.Router();

// Get event system status
router.get("/status", isAuthenticated, getEventStatus);

// Get Kafka topics
router.get("/topics", isAuthenticated, getTopics);

// Get throughput metrics
router.get("/throughput", isAuthenticated, getThroughput);

// Get failure analysis
router.get("/failures", isAuthenticated, getFailures);

// Get consumer lag
router.get("/consumer-lag", isAuthenticated, getConsumerLag);

// Get dead letter queue
router.get("/dead-letter", isAuthenticated, getDeadLetterQueue);

// Retry dead letter event
router.post("/dead-letter/retry", isAuthenticated, retryDeadLetterEvent);

// Clear dead letter queue
router.delete("/dead-letter", isAuthenticated, clearDeadLetterQueue);

// Get event flow by correlation ID
router.get("/flow", isAuthenticated, getEventFlow);

// Create new topic
router.post("/topics", isAuthenticated, createTopic);

// Delete topic
router.delete("/topics/:topic", isAuthenticated, deleteTopic);

// Publish test event
router.post("/test", isAuthenticated, publishTestEvent);

// Get event handler status
router.get("/handlers/status", isAuthenticated, getEventHandlerStatus);

// Restart event handler
router.post("/handlers/:handlerName/restart", isAuthenticated, restartEventHandler);

export default router;
