import express from "express";
const router = express.Router();
import {
  getStatisticInRange,
  getApplicationsDataByYear,
  getRecentActivity,
  getRecentJobPostings,
  getReportedJobList,
} from "../../controllers/admin/statistic.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

router.get("/getState-in-range", isAuthenticated, getStatisticInRange);
router.get("/applications", isAuthenticated, getApplicationsDataByYear);
router.get("/recent-activity", isAuthenticated, getRecentActivity);
router.get("/recent-job-postings", isAuthenticated, getRecentJobPostings);
router.get("/reported-job-list", isAuthenticated, getReportedJobList);

export default router;
