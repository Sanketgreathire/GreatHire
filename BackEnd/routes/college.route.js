import express from "express";
import {
  registerCollege,
  loginCollege,
  logoutCollege,
  getCollegeMe,
  getStudentsByCollege,
  debugCollegeStudents,
} from "../controllers/college.controller.js";
import isCollegeAuthenticated from "../middlewares/isCollegeAuthenticated.js";

const router = express.Router();

router.post("/register", registerCollege);
router.post("/login", loginCollege);
router.get("/logout", logoutCollege);
router.get("/me", isCollegeAuthenticated, getCollegeMe);
router.get("/students/:collegeName", getStudentsByCollege);
router.get("/debug/:collegeName", debugCollegeStudents); // TEMP: remove after fix confirmed

export default router;
