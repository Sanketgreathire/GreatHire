import express from "express";
import {
  runResumeDiscovery,
  getResumeDiscoveryStatus,
  getResumeDiscoveryStats,
  getResumeDiscoveryHistory,
  getResumeDiscoveryMetricsHandler,
  pauseResumeDiscovery,
  resumeResumeDiscovery,
  cancelResumeDiscoveryHandler,
  retryResumeDiscovery,
  testResumeConnector,
  getResumeCandidates,
  getResumeCandidateByUrl,
  searchResumeCandidates,
  flagResumeCandidate,
  unflagResumeCandidate,
  getResumeDocumentTypeDistribution,
  getResumeParsingConfidenceDistribution,
  getResumeQualityMetrics,
  syncResumeCandidate,
  bulkSyncResumeCandidates
} from "../controllers/resume.controller.js";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";

const router = express.Router();

// Run resume discovery
router.post("/run", isAuthenticated, runResumeDiscovery);

// Test resume connector
router.post("/test", isAuthenticated, testResumeConnector);

// Get resume discovery status
router.get("/status", isAuthenticated, getResumeDiscoveryStatus);

// Get resume discovery statistics
router.get("/stats", isAuthenticated, getResumeDiscoveryStats);

// Get resume discovery history
router.get("/history", isAuthenticated, getResumeDiscoveryHistory);

// Get resume discovery metrics
router.get("/metrics", isAuthenticated, getResumeDiscoveryMetricsHandler);

// Pause resume discovery
router.post("/pause", isAuthenticated, pauseResumeDiscovery);

// Resume resume discovery
router.post("/resume", isAuthenticated, resumeResumeDiscovery);

// Cancel resume discovery job
router.post("/cancel/:jobId", isAuthenticated, cancelResumeDiscoveryHandler);

// Retry resume discovery job
router.post("/retry/:jobId", isAuthenticated, retryResumeDiscovery);

// Get resume candidates
router.get("/candidates", isAuthenticated, getResumeCandidates);

// Get resume candidate by URL
router.get("/candidates/:url", isAuthenticated, getResumeCandidateByUrl);

// Search resume candidates
router.post("/candidates/search", isAuthenticated, searchResumeCandidates);

// Flag resume candidate
router.post("/candidates/:url/flag", isAuthenticated, flagResumeCandidate);

// Unflag resume candidate
router.post("/candidates/:url/unflag", isAuthenticated, unflagResumeCandidate);

// Get resume document type distribution
router.get("/analytics/document-types", isAuthenticated, getResumeDocumentTypeDistribution);

// Get resume parsing confidence distribution
router.get("/analytics/parsing-confidence", isAuthenticated, getResumeParsingConfidenceDistribution);

// Get resume quality metrics
router.get("/analytics/quality-metrics", isAuthenticated, getResumeQualityMetrics);

// Sync resume candidate
router.post("/candidates/:url/sync", isAuthenticated, syncResumeCandidate);

// Bulk sync resume candidates
router.post("/candidates/bulk-sync", isAuthenticated, bulkSyncResumeCandidates);

export default router;
