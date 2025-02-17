import express from "express";
import { applicationStats } from "../../controllers/admin/applicationStats.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();
// Define routes
router.get("/get-stats", isAuthenticated, applicationStats);

export default router;
