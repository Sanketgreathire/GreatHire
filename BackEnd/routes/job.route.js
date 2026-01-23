// import express from "express";
// import {
//   postJob,
//   getAllJobs,
//   getJobById,
//   deleteJobById,
//   updateJob,
//   bookmarkJob,
//   getJobByRecruiterId,
//   toggleActive,
//   getJobByCompanyId,
//   getJobsStatistics,
//   getExternalJobsFromFindwork,  // Importing the new function
// } from "../controllers/job.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { singleUpload } from "../middlewares/multer.js";

// const router = express.Router();

// router.route("/post-job").post(isAuthenticated, postJob);
// router.route("/bookmark-job/:jobId").get(isAuthenticated, bookmarkJob);
// router.route("/toggle-active").put(isAuthenticated, toggleActive);
// router.route("/get").get(getAllJobs);
// router.route("/jobs").get(getAllJobs);
// router.route("/get/:id").get(getJobById); // 🟢 Now it's public
// router.route("/jobs/:id").get(isAuthenticated, getJobByRecruiterId);
// router.route("/jobs-list/:id").get(isAuthenticated, getJobByCompanyId);
// router.route("/delete/:id").delete(isAuthenticated, deleteJobById);
// router.route("/update/:jobId").put(isAuthenticated, updateJob);
// router.route("/job-statistics/:id").get(isAuthenticated, getJobsStatistics);

// // Add the new route to fetch external jobs
// router.route("/external/findwork").get(getExternalJobsFromFindwork);

// export default router;


















import express from "express";
// import { Application }from "../models/application.model.js"; //thisssssssss
// import { getJobById } from "../controllers/job.controller.js";
import {
  postJob,
  getAllJobs,
  getJobById,
  deleteJobById,
  updateJob,
  bookmarkJob,
  getJobByRecruiterId,
  toggleActive,
  getJobByCompanyId,
  getJobsStatistics,
  getExternalJobsFromFindwork,  // Importing the new function
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { applyJob } from "../controllers/job.controller.js"; //this

const router = express.Router();

router.route("/post-job").post(isAuthenticated, postJob);
router.route("/bookmark-job/:jobId").get(isAuthenticated, bookmarkJob);
router.route("/toggle-active").put(isAuthenticated, toggleActive);
router.route("/get").get(getAllJobs);
router.route("/jobs").get(getAllJobs);
router.route("/get/:id").get(getJobById); // 🟢 Now it's public
router.get("/get/:id", getJobById);
router.get("/:id", getJobById);

router.route("/jobs/:id").get(isAuthenticated, getJobByRecruiterId);
router.route("/jobs-list/:id").get(isAuthenticated, getJobByCompanyId);
router.route("/delete/:id").delete(isAuthenticated, deleteJobById);
router.route("/update/:jobId").put(isAuthenticated, updateJob);
router.route("/job-statistics/:id").get(isAuthenticated, getJobsStatistics);
router.route("/apply-job/:jobId").post(isAuthenticated, applyJob); //this


// Add the new route to fetch external jobs
router.route("/external/findwork").get(getExternalJobsFromFindwork);

export default router;