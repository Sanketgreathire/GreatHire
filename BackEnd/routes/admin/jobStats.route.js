import express from "express";
import { getJobStats, getAllJobList } from "../../controllers/admin/jobStats.controller.js";

const router = express.Router();
// Define routes
router.get("/get-stats", getJobStats);
router.get("/getAllJobs-stats", getAllJobList);

export default router;
