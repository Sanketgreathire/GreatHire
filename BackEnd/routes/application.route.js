import express from "express";

import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  getApplicationDetails,
  deleteApplication,
  getAllApplications,
  triggerAutoReject,
  bulkApplyJobs,

  // AI Screening & Scoring
  scoreApplicationManually,
  overrideApplication,
} from "../controllers/application.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";
import { singleUpload } from "../middlewares/multer.js";
import { validateJobApplication } from "../middlewares/jobValidator.js";

const router = express.Router();

// Apply for a job
router.post(
  "/:jobId/apply",
  isAuthenticated,
  singleUpload,
  validateJobApplication,
  applyJob
);

// Get applied jobs
router.route("/get").get(isAuthenticated, getAppliedJobs);

// Bulk apply
router.route("/bulk-apply").post(isAuthenticated, bulkApplyJobs);

// Get application details
router
  .route("/details/:jobId/:candidateId")
  .get(isAuthenticated, getApplicationDetails);

// Update application status
router
  .route("/status/:id/update")
  .post(isAuthenticated, updateStatus);

// ---------------------------------------------------------
// AI SCREENING & SCORING
// ---------------------------------------------------------

// Manual trigger: calculate AI score and automatically
// move to Shortlisted (>=75) or Rejected (<75)
router
  .route("/:id/score")
  .post(isAuthenticated, scoreApplicationManually);

// Recruiter override: manually Shortlist or Reject
router
  .route("/:id/override-score")
  .post(isAuthenticated, overrideApplication);

// ---------------------------------------------------------

// Delete application
router
  .route("/delete/:id")
  .delete(isAuthenticated, deleteApplication);

// Get applicants for a job
router
  .route("/:id/applicants")
  .get(isAuthenticated, getApplicants);

// Admin routes
router
  .route("/admin/applications")
  .get(isAuthenticated, isAdmin, getAllApplications);

router
  .route("/admin/application/:id")
  .delete(isAuthenticated, isAdmin, deleteApplication);

// Manual trigger for auto-reject (testing/admin)
router
  .route("/auto-reject/trigger")
  .post(isAuthenticated, triggerAutoReject);

export default router;

