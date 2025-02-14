import express from "express";
import { applicationStats } from "../../controllers/admin/applicationStats.controller.js";

const router = express.Router();
// Define routes
router.get("/get-stats", applicationStats);

export default router;