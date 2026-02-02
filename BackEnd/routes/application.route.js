import express from "express";


import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  getApplicationDetails,
} from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { validateJobApplication } from "../middlewares/jobValidator.js";
// import { applyJobController } from "../controllers/application.controller.js";

const router = express.Router();
// Apply job route
// router.post("/:jobId/apply", isAuthenticated, applyJob);
router.post("/:jobId/apply", isAuthenticated, singleUpload, validateJobApplication, applyJob);


// router.route("/apply").post
(
  isAuthenticated,
  (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message }); // Handle multer errors
      }
      next();
    });
  },
  validateJobApplication,
  applyJob
);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
// New route for getting individual application details
router.route("/details/:jobId/:candidateId").get(isAuthenticated, getApplicationDetails);


export default router;
