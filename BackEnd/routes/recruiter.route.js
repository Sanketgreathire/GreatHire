import express from "express";
import {
  register,
  googleLogin,
  getAllRecruiters,
  getRecruiterById,
  addRecruiterToCompany,
  updateProfile,
  deleteAccount,
  toggleActive,
  toggleBlock,
} from "../controllers/recruiter.contoller.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { validateUser } from "../middlewares/userValidator.js";

const router = express.Router();
router.route("/register").post(validateUser, register);
router.route("/googleLogin").post(googleLogin);
router
  .route("/profile/update")
  .put(isAuthenticated, singleUpload, updateProfile);

router.route("/recruiters").post(isAuthenticated, getAllRecruiters);
router.route("/recruiter-by-id/:id").get(getRecruiterById);
router
  .route("/add-recruiter")
  .post(isAuthenticated, validateUser, addRecruiterToCompany);

router.route("/delete").delete(isAuthenticated, deleteAccount);
router.route("/toggle-active").put(isAuthenticated, toggleActive);
router.route("/toggle-block").put(isAuthenticated, toggleBlock);

export default router;
