import express from "express";
import {
  runTalentSignalProcessing,
  getCandidateTalentSignals,
  getTalentSignalStats,
  getTopCandidates,
  getCandidateSegments,
  getSignalAnalytics,
  getHighOpportunityCandidates,
  getHighPriorityCandidates,
  getStartupCandidates,
  getLeadershipCandidates,
  getOpenToWorkCandidates,
  refreshCandidateSignals,
  getStaleCandidatesHandler,
  refreshStaleCandidatesHandler,
  searchCandidatesBySignals,
  getSignalInsights,
  getRecommendations
} from "../controllers/talentSignals.controller.js";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";

const router = express.Router();

// Run talent signal processing
router.post("/run", isAuthenticated, runTalentSignalProcessing);

// Get candidate talent signals
router.get("/candidate/:id", isAuthenticated, getCandidateTalentSignals);

// Get talent signal statistics
router.get("/stats", isAuthenticated, getTalentSignalStats);

// Get top candidates by score
router.get("/top", isAuthenticated, getTopCandidates);

// Get candidate segments
router.get("/segments", isAuthenticated, getCandidateSegments);

// Get signal analytics
router.get("/analytics", isAuthenticated, getSignalAnalytics);

// Get high opportunity candidates
router.get("/high-opportunity", isAuthenticated, getHighOpportunityCandidates);

// Get high priority candidates
router.get("/high-priority", isAuthenticated, getHighPriorityCandidates);

// Get startup candidates
router.get("/startup", isAuthenticated, getStartupCandidates);

// Get leadership candidates
router.get("/leadership", isAuthenticated, getLeadershipCandidates);

// Get open to work candidates
router.get("/open-to-work", isAuthenticated, getOpenToWorkCandidates);

// Refresh candidate signals
router.post("/candidate/:id/refresh", isAuthenticated, refreshCandidateSignals);

// Get stale candidates
router.get("/stale", isAuthenticated, getStaleCandidatesHandler);

// Refresh stale candidates
router.post("/stale/refresh", isAuthenticated, refreshStaleCandidatesHandler);

// Search candidates by signals
router.get("/search", isAuthenticated, searchCandidatesBySignals);

// Get signal insights
router.get("/insights", isAuthenticated, getSignalInsights);

// Get recommendations
router.get("/recommendations", isAuthenticated, getRecommendations);

export default router;
