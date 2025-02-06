import express from "express";
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
} from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/post-job").post(isAuthenticated, postJob);

router.route("/bookmark-job/:jobId").get(isAuthenticated, bookmarkJob);
router.route("/toggle-active").put(isAuthenticated, toggleActive);

router.route("/get").get(getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/jobs/:id").get(isAuthenticated, getJobByRecruiterId);
router.route("/jobs-list/:id").get(isAuthenticated, getJobByCompanyId);

router.route("/delete/:id").delete(isAuthenticated, deleteJobById);
router.route("/update/:jobId").put(isAuthenticated, updateJob);
router.route("/job-statistics/:id").get(isAuthenticated, getJobsStatistics);

export default router;
