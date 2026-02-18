import express from "express";
const router = express.Router();
import {
  getStatisticInRange,
  getApplicationsDataByYear,
  getRecentActivity,
  getRecentJobPostings,
  getReportedJobList,
  getRecentPurchases,
  exportCorporateCSV,
} from "../../controllers/admin/statistic.controller.js";
import { checkJobSubscriptions } from "../../controllers/admin/check-subscriptions.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

router.get("/export-corporate-csv", exportCorporateCSV);
router.get("/getState-in-range", isAuthenticated, getStatisticInRange);
router.get("/applications", isAuthenticated, getApplicationsDataByYear);
router.get("/recent-activity", isAuthenticated, getRecentActivity);
router.get("/recent-job-postings", isAuthenticated, getRecentJobPostings);
router.get("/reported-job-list", isAuthenticated, getReportedJobList);
router.get("/recent-purchases", isAuthenticated, getRecentPurchases);
router.get("/check-subscriptions", isAuthenticated, checkJobSubscriptions);

export default router;
