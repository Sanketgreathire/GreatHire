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
  deductCandidateCredit,
  getCompanyApplicants,
  reportJob,
  getCandidateInformation,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(
  isAuthenticated,
  (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message }); // Handle multer errors
      }
      next();
    });
  },
  registerCompany
);
router.route("/company-by-id").post(getCompanyById);
router.route("/company-by-userid").post(isAuthenticated, companyByUserId);
router.route("/change-admin").put(isAuthenticated, changeAdmin);

// Define the route to get candidates
router.get("/candidate-information/:id", getCandidateInformation);
router.get("/candidate-list", isAuthenticated, getCandidateData);
router.get("/applicants/:companyId", isAuthenticated, getCompanyApplicants);

router.route("/update/:id").put(isAuthenticated, updateCompany);
router.route("/current-plan/:id").get(isAuthenticated, getCurrentPlan);
router
  .route("/decrease-credit/:id")
  .get(isAuthenticated, decreaseCandidateCredits);
router
  .route("/deduct-candidate-credit")
  .post(isAuthenticated, deductCandidateCredit);

router.route("/report-job").post(isAuthenticated, reportJob);

// Test route to manually expire plans
router.route("/test-expire-plans").get(async (req, res) => {
  try {
    const { JobSubscription } = await import("../models/jobSubscription.model.js");
    const subs = await JobSubscription.find({ status: "Active" });
    
    let expiredCount = 0;
    for (const sub of subs) {
      console.log(`Checking sub ${sub._id}, expiry: ${sub.expiryDate}`);
      if (await sub.checkValidity()) {
        expiredCount++;
        console.log(`Expired: ${sub._id}`);
      }
    }
    
    res.json({ success: true, checked: subs.length, expired: expiredCount });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

export default router;
