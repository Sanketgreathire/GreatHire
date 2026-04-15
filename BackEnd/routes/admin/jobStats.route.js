import express from "express";
import { getJobStats, getAllJobList } from "../../controllers/admin/jobStats.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();
// Define routes
router.get("/get-stats", isAuthenticated,  getJobStats);
router.get("/getAllJobs-stats", isAuthenticated, getAllJobList);

export default router;
