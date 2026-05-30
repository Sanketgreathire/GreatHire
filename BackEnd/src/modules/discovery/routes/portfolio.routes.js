import express from "express";
import {
  runPortfolioDiscovery,
  getPortfolioDiscoveryStatus,
  getPortfolioDiscoveryStats,
  getPortfolioDiscoveryHistory,
  getPortfolioDiscoveryMetricsHandler,
  pausePortfolioDiscovery,
  resumePortfolioDiscovery,
  cancelPortfolioDiscoveryHandler,
  retryPortfolioDiscovery,
  testPortfolioConnector,
  getPortfolioCandidates,
  getPortfolioCandidateByUrl,
  searchPortfolioCandidates,
  flagPortfolioCandidate,
  unflagPortfolioCandidate,
  getPortfolioTechnologyDistribution,
  getPortfolioSeniorityDistribution,
  getPortfolioSpecializationDistribution,
  syncPortfolioCandidate,
  bulkSyncPortfolioCandidates
} from "../controllers/portfolio.controller.js";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";

const router = express.Router();

// Run portfolio discovery
router.post("/run", isAuthenticated, runPortfolioDiscovery);

// Test portfolio connector
router.post("/test", isAuthenticated, testPortfolioConnector);

// Get portfolio discovery status
router.get("/status", isAuthenticated, getPortfolioDiscoveryStatus);

// Get portfolio discovery statistics
router.get("/stats", isAuthenticated, getPortfolioDiscoveryStats);

// Get portfolio discovery history
router.get("/history", isAuthenticated, getPortfolioDiscoveryHistory);

// Get portfolio discovery metrics
router.get("/metrics", isAuthenticated, getPortfolioDiscoveryMetricsHandler);

// Pause portfolio discovery
router.post("/pause", isAuthenticated, pausePortfolioDiscovery);

// Resume portfolio discovery
router.post("/resume", isAuthenticated, resumePortfolioDiscovery);

// Cancel portfolio discovery job
router.post("/cancel/:jobId", isAuthenticated, cancelPortfolioDiscoveryHandler);

// Retry portfolio discovery job
router.post("/retry/:jobId", isAuthenticated, retryPortfolioDiscovery);

// Get portfolio candidates
router.get("/candidates", isAuthenticated, getPortfolioCandidates);

// Get portfolio candidate by URL
router.get("/candidates/:url", isAuthenticated, getPortfolioCandidateByUrl);

// Search portfolio candidates
router.post("/candidates/search", isAuthenticated, searchPortfolioCandidates);

// Flag portfolio candidate
router.post("/candidates/:url/flag", isAuthenticated, flagPortfolioCandidate);

// Unflag portfolio candidate
router.post("/candidates/:url/unflag", isAuthenticated, unflagPortfolioCandidate);

// Get portfolio technology distribution
router.get("/analytics/technologies", isAuthenticated, getPortfolioTechnologyDistribution);

// Get portfolio seniority distribution
router.get("/analytics/seniority", isAuthenticated, getPortfolioSeniorityDistribution);

// Get portfolio specialization distribution
router.get("/analytics/specialization", isAuthenticated, getPortfolioSpecializationDistribution);

// Sync portfolio candidate
router.post("/candidates/:url/sync", isAuthenticated, syncPortfolioCandidate);

// Bulk sync portfolio candidates
router.post("/candidates/bulk-sync", isAuthenticated, bulkSyncPortfolioCandidates);

export default router;
