import express from "express";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";
import {
  chatController,
  getRecruiterMemoryController,
  updateRecruiterMemoryController,
  trackInteractionController,
  getRecommendationsController,
  getSearchHistoryController
} from "../controllers/copilot.controller.js";

const router = express.Router();

router.post("/chat", isAuthenticated, chatController);

router.get("/memory", isAuthenticated, getRecruiterMemoryController);

router.put("/memory", isAuthenticated, updateRecruiterMemoryController);

router.post("/track", isAuthenticated, trackInteractionController);

router.get("/recommendations", isAuthenticated, getRecommendationsController);

router.get("/history", isAuthenticated, getSearchHistoryController);

export default router;
