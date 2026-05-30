import express from "express";
import {
  runFreshnessProcessing,
  getFreshnessStatus,
  getFreshnessStats,
  getFreshnessHistory,
  getFreshnessMetricsHandler,
  pauseFreshnessProcessing,
  resumeFreshnessProcessing,
  cancelFreshnessJob,
  retryFreshnessJob,
  getFreshCandidates,
  getOpenToWorkCandidates,
  getStaleCandidates,
  getMovementCandidates,
  getFreshnessDistribution,
  getOpenToWorkDistribution,
  getMovementTrends,
  getQualityMetrics,
  searchFreshness,
  flagFreshness,
  unflagFreshness,
  scheduleFreshnessProcessingHandler,
  scheduleStaleRefreshHandler
} from "../controllers/freshness.controller.js";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";

const router = express.Router();

// Run freshness processing
router.post("/run", isAuthenticated, runFreshnessProcessing);

// Get freshness status
router.get("/status", isAuthenticated, getFreshnessStatus);

// Get freshness statistics
router.get("/stats", isAuthenticated, getFreshnessStats);

// Get freshness history
router.get("/history", isAuthenticated, getFreshnessHistory);

// Get freshness metrics
router.get("/metrics", isAuthenticated, getFreshnessMetricsHandler);

// Pause freshness processing
router.post("/pause", isAuthenticated, pauseFreshnessProcessing);

// Resume freshness processing
router.post("/resume", isAuthenticated, resumeFreshnessProcessing);

// Cancel freshness job
router.post("/cancel/:jobId", isAuthenticated, cancelFreshnessJob);

// Retry freshness job
router.post("/retry/:jobId", isAuthenticated, retryFreshnessJob);

// Get fresh candidates
router.get("/candidates/fresh", isAuthenticated, getFreshCandidates);

// Get open to work candidates
router.get("/candidates/open-to-work", isAuthenticated, getOpenToWorkCandidates);

// Get stale candidates
router.get("/candidates/stale", isAuthenticated, getStaleCandidates);

// Get movement candidates
router.get("/candidates/movements/:movementType", isAuthenticated, getMovementCandidates);

// Get freshness distribution
router.get("/analytics/distribution", isAuthenticated, getFreshnessDistribution);

// Get open to work distribution
router.get("/analytics/open-to-work", isAuthenticated, getOpenToWorkDistribution);

// Get movement trends
router.get("/analytics/movement-trends", isAuthenticated, getMovementTrends);

// Get quality metrics
router.get("/analytics/quality", isAuthenticated, getQualityMetrics);

// Search freshness
router.post("/search", isAuthenticated, searchFreshness);

// Flag freshness
router.post("/candidates/:candidateId/flag", isAuthenticated, flagFreshness);

// Unflag freshness
router.post("/candidates/:candidateId/unflag", isAuthenticated, unflagFreshness);

// Schedule freshness processing
router.post("/schedule", isAuthenticated, scheduleFreshnessProcessingHandler);

// Schedule stale refresh
router.post("/schedule/stale-refresh", isAuthenticated, scheduleStaleRefreshHandler);

export default router;
