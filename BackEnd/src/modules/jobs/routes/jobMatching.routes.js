import express from "express";
import  isAuthenticated from "../../../../middlewares/isAuthenticated.js";
import {
  parseJDController,
  matchCandidatesController,
  getJobMatchesController,
  getJobMatchStatsController
} from "../controllers/jobMatching.controller.js";

const router = express.Router();

router.post("/parse-jd", isAuthenticated, parseJDController);

router.post("/:jobId/match-candidates", isAuthenticated, matchCandidatesController);

router.get("/:jobId/matches", isAuthenticated, getJobMatchesController);

router.get("/:jobId/matches/stats", isAuthenticated, getJobMatchStatsController);

export default router;
