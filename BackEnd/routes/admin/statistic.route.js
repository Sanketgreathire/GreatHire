import express from "express";
const router = express.Router();
import {
  getApplicationsDataByYear,
  getRecentActivity,
  getRecentJobPostings,
} from "../../controllers/admin/statistic.controller.js";

router.get("/applications", getApplicationsDataByYear);
router.get("/recent-activity", getRecentActivity);
router.get("/recent-job-postings", getRecentJobPostings);

export default router;
