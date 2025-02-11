import express from "express";
const router = express.Router();
import { getStatisticForAdmin, getApplicationsDataByYear,getRecentActivity,getRecentJobPostings } from "../../controllers/admin/statistic.controller.js";

router.get("/get-stats",getStatisticForAdmin)
router.get("/applications", getApplicationsDataByYear);
router.get("/recent-activity", getRecentActivity);
router.get("/recent-job-postings", getRecentJobPostings);

export default router;
