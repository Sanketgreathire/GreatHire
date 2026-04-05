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
} from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";
import { singleUpload } from "../middlewares/multer.js";
import { validateJobApplication } from "../middlewares/jobValidator.js";
// import { applyJobController } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/:jobId/apply", isAuthenticated, singleUpload, validateJobApplication, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/bulk-apply").post(isAuthenticated, bulkApplyJobs);
router.route("/details/:jobId/:candidateId").get(isAuthenticated, getApplicationDetails);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/delete/:id").delete(isAuthenticated, deleteApplication);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

// Admin routes
router.route("/admin/applications").get(isAuthenticated, isAdmin, getAllApplications);
router.route("/admin/application/:id").delete(isAuthenticated, isAdmin, deleteApplication);
// Manual trigger for auto-reject (for testing/admin)
router.route("/auto-reject/trigger").post(isAuthenticated, triggerAutoReject);


export default router;
