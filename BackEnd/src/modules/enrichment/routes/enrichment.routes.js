import express from "express";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";
import {
  enrichCandidateController,
  bulkEnrichCandidatesController,
  getCandidateIntelligenceController,
  getEnrichmentStatusController,
  getEnrichmentStatsController,
  triggerFullEnrichmentController
} from "../controllers/enrichment.controller.js";

const router = express.Router();

router.post("/candidates/:id/enrich", isAuthenticated, enrichCandidateController);

router.post("/candidates/bulk-enrich", isAuthenticated, bulkEnrichCandidatesController);

router.get("/candidates/:id/intelligence", isAuthenticated, getCandidateIntelligenceController);

router.get("/enrichment/status/:jobId", isAuthenticated, getEnrichmentStatusController);

router.get("/enrichment/stats", isAuthenticated, getEnrichmentStatsController);

router.post("/enrichment/full", isAuthenticated, triggerFullEnrichmentController);

export default router;
