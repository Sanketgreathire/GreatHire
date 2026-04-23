import express from "express";
import { submitEnquiry, getAllEnquiries, updateStatus, deleteEnquiry, sendCounsellorOtp, verifyCounsellorOtp, createCourseOrder, verifyCoursePayment } from "../controllers/course.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/counsellor/send-otp", sendCounsellorOtp);
router.post("/counsellor/verify-otp", verifyCounsellorOtp);
router.post("/enquiry", submitEnquiry);
router.post("/payment/create-order", createCourseOrder);
router.post("/payment/verify", verifyCoursePayment);
router.get("/admin/all", isAuthenticated, isAdmin, getAllEnquiries);
router.patch("/admin/:id/status", isAuthenticated, isAdmin, updateStatus);
router.delete("/admin/:id", isAuthenticated, isAdmin, deleteEnquiry);

export default router;
