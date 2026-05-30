import express from "express";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";
import {
  getCandidateGraphController,
  getCompanyGraphController,
  getSkillGraphController,
  getGraphInsightsController,
  getTalentNetworkController,
  getGraphStatsController,
  buildTalentGraphController,
  searchGraphController
} from "../controllers/talentGraph.controller.js";

const router = express.Router();

router.get("/candidate/:id", isAuthenticated, getCandidateGraphController);

router.get("/company/:company", isAuthenticated, getCompanyGraphController);

router.get("/skills/:skill", isAuthenticated, getSkillGraphController);

router.get("/insights", isAuthenticated, getGraphInsightsController);

router.get("/network/:recruiterId", isAuthenticated, getTalentNetworkController);

router.get("/stats", isAuthenticated, getGraphStatsController);

router.post("/build", isAuthenticated, buildTalentGraphController);

router.post("/search", isAuthenticated, searchGraphController);

export default router;
