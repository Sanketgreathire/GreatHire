import express from "express";
import { getDashboardAnalytics } from "../../controllers/analytics/analytics.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/dashboard", isAuthenticated, getDashboardAnalytics);

export default router;
