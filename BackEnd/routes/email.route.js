import express from "express";
import { sendBulkEmail, sendFirstJobReminder, analyzeCandidates } from "../controllers/email.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendBulkEmail);
router.post("/send-first-job-reminder", isAuthenticated, sendFirstJobReminder);
router.post("/send-bulk-email", isAuthenticated, sendBulkEmail);
router.post("/analyze-candidates", isAuthenticated, analyzeCandidates);

export default router;
