import express from "express";
import {getJobStats, getAllJobList, updateJobByAdmin} from "../../controllers/admin/jobStats.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import isAdmin from "../../middlewares/isAdmin.js";

const router = express.Router();
// Define routes
router.get("/get-stats", isAuthenticated,  getJobStats);
router.get("/getAllJobs-stats", isAuthenticated, getAllJobList);
router.put("/update-job/:jobId", isAuthenticated, isAdmin, updateJobByAdmin);

export default router;
