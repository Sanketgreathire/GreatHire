import express from "express";
import {
  getCompanyById,
  registerCompany,
  updateCompany,
  companyByUserId,
  changeAdmin,
  getCurrentPlan,
  getCandidateData,
  decreaseCandidateCredits,
  getCompanyApplicants,
  reportJob,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, singleUpload, registerCompany);
router.route("/company-by-id").post(getCompanyById);
router.route("/company-by-userid").post(isAuthenticated, companyByUserId);
router.route("/change-admin").put(isAuthenticated, changeAdmin);

// Define the route to get candidates
router.get("/candidate-list", isAuthenticated, getCandidateData);
router.get("/applicants/:companyId", isAuthenticated, getCompanyApplicants);

router.route("/update/:id").put(isAuthenticated, updateCompany);
router.route("/current-plan/:id").get(isAuthenticated, getCurrentPlan);
router
  .route("/decrease-credit/:id")
  .get(isAuthenticated, decreaseCandidateCredits);

router.route("/report-job").post(isAuthenticated, reportJob);
export default router;
