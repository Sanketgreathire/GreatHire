import express from "express";
import isAuthenticated from "../../../../middlewares/isAuthenticated.js";
import {
  generateOutreachController,
  sendOutreachController,
  getOutreachHistoryController,
  getOutreachStatsController,
  bulkGenerateOutreachController,
  getOutreachTemplatesController,
  saveOutreachTemplateController
} from "../controllers/outreach.controller.js";

const router = express.Router();

router.post("/generate", isAuthenticated, generateOutreachController);

router.post("/send", isAuthenticated, sendOutreachController);

router.get("/history", isAuthenticated, getOutreachHistoryController);

router.get("/stats", isAuthenticated, getOutreachStatsController);

router.post("/bulk-generate", isAuthenticated, bulkGenerateOutreachController);

router.get("/templates", isAuthenticated, getOutreachTemplatesController);

router.post("/templates", isAuthenticated, saveOutreachTemplateController);

export default router;
