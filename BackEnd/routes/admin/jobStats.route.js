import express from "express";
import { getJobStats } from "../../controllers/admin/jobStats.controller.js";

const router = express.Router();
// Define routes
router.get("/get-stats", getJobStats);

export default router;
