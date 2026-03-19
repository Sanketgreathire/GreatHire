import express from "express";
import { sendBulkEmail, sendFirstJobReminder } from "../controllers/email.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendBulkEmail);
router.post("/send-first-job-reminder", isAuthenticated, sendFirstJobReminder);

export default router;
