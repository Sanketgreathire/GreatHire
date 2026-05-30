import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  parseJd,
  matchCandidates,
  getMatches,
  getRecommendations,
  submitFeedback,
  getParsedJd,
  getFeedbackAnalyticsEndpoint,
  getRecruiterInsightsEndpoint,
  getCandidateFeedbackHistoryEndpoint,
  submitFeedbackEnhanced,
  batchSubmitFeedback,
} from "./jdMatchingController.js";

const router = express.Router();
router.use(isAuthenticated);

// ── JD Parsing & Matching ─────────────────────────────────────────────────────
router.post("/parse-jd",                    parseJd);
router.post("/match-candidates/:jobId",     matchCandidates);
router.get("/:jobId/parsed-jd",             getParsedJd);

// ── Match Results & Recommendations ───────────────────────────────────────────
router.get("/:jobId/matches",               getMatches);
router.get("/:jobId/recommendations",       getRecommendations);

// ── Feedback Management ───────────────────────────────────────────────────────
router.patch("/feedback/:matchId",          submitFeedbackEnhanced);
router.post("/feedback/batch",              batchSubmitFeedback);
router.get("/:jobId/feedback-analytics",    getFeedbackAnalyticsEndpoint);
router.get("/:jobId/recruiter-insights",    getRecruiterInsightsEndpoint);
router.get("/candidate/:candidateId/history", getCandidateFeedbackHistoryEndpoint);

export default router;
