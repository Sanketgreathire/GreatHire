import express from "express";
const router = express.Router();
import {
  getStatisticInRange,
  getApplicationsDataByYear,
  getRecentActivity,
  getRecentJobPostings,
} from "../../controllers/admin/statistic.controller.js";

router.get("/getState-in-range", getStatisticInRange);
router.get("/applications", getApplicationsDataByYear);
router.get("/recent-activity", getRecentActivity);
router.get("/recent-job-postings", getRecentJobPostings);

export default router;
