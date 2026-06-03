import express from "express";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";
import {
  trackRecruiterFeedbackController,
  getRecruiterPreferencesController,
  getRecruiterInsightsController,
  updateRecruiterPreferencesController,
  getRecruiterLearningStatsController,
  triggerLearningModelController,
  getAdaptiveRankingController
} from "../controllers/learning.controller.js";

const router = express.Router();

router.post("/recruiter-feedback/track", isAuthenticated, trackRecruiterFeedbackController);

router.get("/recruiters/:id/preferences", isAuthenticated, getRecruiterPreferencesController);

router.get("/recruiters/:id/insights", isAuthenticated, getRecruiterInsightsController);

router.put("/recruiters/:id/preferences", isAuthenticated, updateRecruiterPreferencesController);

router.get("/recruiters/:id/learning-stats", isAuthenticated, getRecruiterLearningStatsController);

router.post("/learning/trigger-model", isAuthenticated, triggerLearningModelController);

router.get("/adaptive-ranking/:recruiterId", isAuthenticated, getAdaptiveRankingController);

export default router;
