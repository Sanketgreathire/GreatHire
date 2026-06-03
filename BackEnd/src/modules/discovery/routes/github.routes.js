import express from "express";
import {
  runGitHubDiscovery,
  getGitHubDiscoveryStatus,
  getGitHubDiscoveryStats,
  getGitHubDiscoveryHistory,
  getGitHubDiscoveryMetricsHandler,
  pauseGitHubDiscovery,
  resumeGitHubDiscovery,
  cancelGitHubDiscoveryHandler,
  retryGitHubDiscovery,
  testGitHubConnector,
  getGitHubCandidates,
  getGitHubCandidateByUser,
  searchGitHubCandidates,
  flagGitHubCandidate,
  unflagGitHubCandidate,
  getGitHubSkillDistribution,
  getGitHubSeniorityDistribution,
  getGitHubSpecializationDistribution,
  syncGitHubCandidate,
  bulkSyncGitHubCandidates
} from "../controllers/github.controller.js";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";

const router = express.Router();

// Run GitHub discovery
router.post("/run", isAuthenticated, runGitHubDiscovery);

// Test GitHub connector
router.post("/test", isAuthenticated, testGitHubConnector);

// Get GitHub discovery status
router.get("/status", isAuthenticated, getGitHubDiscoveryStatus);

// Get GitHub discovery statistics
router.get("/stats", isAuthenticated, getGitHubDiscoveryStats);

// Get GitHub discovery history
router.get("/history", isAuthenticated, getGitHubDiscoveryHistory);

// Get GitHub discovery metrics
router.get("/metrics", isAuthenticated, getGitHubDiscoveryMetricsHandler);

// Pause GitHub discovery
router.post("/pause", isAuthenticated, pauseGitHubDiscovery);

// Resume GitHub discovery
router.post("/resume", isAuthenticated, resumeGitHubDiscovery);

// Cancel GitHub discovery job
router.post("/cancel/:jobId", isAuthenticated, cancelGitHubDiscoveryHandler);

// Retry GitHub discovery job
router.post("/retry/:jobId", isAuthenticated, retryGitHubDiscovery);

// Get GitHub candidates
router.get("/candidates", isAuthenticated, getGitHubCandidates);

// Get GitHub candidate by username
router.get("/candidates/:username", isAuthenticated, getGitHubCandidateByUser);

// Search GitHub candidates
router.post("/candidates/search", isAuthenticated, searchGitHubCandidates);

// Flag GitHub candidate
router.post("/candidates/:username/flag", isAuthenticated, flagGitHubCandidate);

// Unflag GitHub candidate
router.post("/candidates/:username/unflag", isAuthenticated, unflagGitHubCandidate);

// Get GitHub skill distribution
router.get("/analytics/skills", isAuthenticated, getGitHubSkillDistribution);

// Get GitHub seniority distribution
router.get("/analytics/seniority", isAuthenticated, getGitHubSeniorityDistribution);

// Get GitHub specialization distribution
router.get("/analytics/specialization", isAuthenticated, getGitHubSpecializationDistribution);

// Sync GitHub candidate
router.post("/candidates/:username/sync", isAuthenticated, syncGitHubCandidate);

// Bulk sync GitHub candidates
router.post("/candidates/bulk-sync", isAuthenticated, bulkSyncGitHubCandidates);

export default router;
