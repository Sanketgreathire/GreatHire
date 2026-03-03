import express from "express";
import {
  companyStats,
  companyList,
  deletedCompanyList,
  updateCompanyEmails
} from "../../controllers/admin/companyStats.controller.js";
import isAuthenticated from "../../middlewares/isAuthenticated.js";

const router = express.Router();
// Define routes
router.get("/get-stats", isAuthenticated, companyStats);
router.get("/company-list", isAuthenticated, companyList);
router.get("/deleted-company-list", isAuthenticated, deletedCompanyList);

router.put("/update-emails", isAuthenticated, updateCompanyEmails); // ✅ added

export default router;
