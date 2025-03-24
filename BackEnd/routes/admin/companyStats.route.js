import express from "express";
import {
  companyStats,
  companyList,
  deletedCompanyList
} from "../../controllers/admin/companyStats.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();
// Define routes
router.get("/get-stats", isAuthenticated, companyStats);
router.get("/company-list", isAuthenticated, companyList);
router.get("/deleted-company-list", isAuthenticated, deletedCompanyList);

export default router;
