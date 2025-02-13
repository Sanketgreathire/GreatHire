import express from "express";
import { companyStats, companyList } from "../../controllers/admin/companyStats.controller.js";

const router = express.Router();
// Define routes
router.get("/get-stats", companyStats);
router.get("/company-list", companyList);

export default router;
