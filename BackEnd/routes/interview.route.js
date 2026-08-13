import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { startInterview, previewInterview, fetchCallLogs } from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/preview/:applicationId", isAuthenticated, previewInterview);
router.post("/start/:applicationId", isAuthenticated, startInterview);
router.post("/call-logs/:applicationId", isAuthenticated, fetchCallLogs);

export default router;
