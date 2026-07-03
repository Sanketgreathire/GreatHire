import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { startInterview } from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/start/:applicationId", isAuthenticated, startInterview);

export default router;
