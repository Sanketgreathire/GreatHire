import express from "express";
import {
  runConnector,
  getDiscoveryStatus,
  getDiscoveryStats,
  getConnectors,
  getConnectorStatus,
  pauseConnector,
  resumeConnector,
  cancelIngestion,
  retryFailedIngestion,
  // getIngestionHistory,
  getSourceStats,
  testConnector
} from "../controllers/discovery.controller.js";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";

const router = express.Router();

// Run a specific connector
router.post("/run/:connector", isAuthenticated, runConnector);

// Test a connector configuration
router.post("/test/:connector", isAuthenticated, testConnector);

// Get discovery system status
router.get("/status", isAuthenticated, getDiscoveryStatus);

// Get overall discovery statistics
router.get("/stats", isAuthenticated, getDiscoveryStats);

// Get available connectors
router.get("/connectors", isAuthenticated, getConnectors);

// Get specific connector status
router.get("/connector/:connector/status", isAuthenticated, getConnectorStatus);

// Pause a connector
router.post("/connector/:connector/pause", isAuthenticated, pauseConnector);

// Resume a connector
router.post("/connector/:connector/resume", isAuthenticated, resumeConnector);

// Cancel ingestion
router.post("/ingestion/:jobId/cancel", isAuthenticated, cancelIngestion);

// Retry failed ingestion
router.post("/ingestion/:jobId/retry", isAuthenticated, retryFailedIngestion);

// Get ingestion history
// router.get("/ingestion/history", isAuthenticated, getIngestionHistory);

// Get source statistics
router.get("/sources/stats", isAuthenticated, getSourceStats);

export default router;
