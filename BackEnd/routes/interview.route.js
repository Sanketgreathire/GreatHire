import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { startInterview, previewInterview } from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/preview/:applicationId", isAuthenticated, previewInterview);
router.post("/start/:applicationId", isAuthenticated, startInterview);

export default router;
