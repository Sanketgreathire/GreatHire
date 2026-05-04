import express from "express";
import { sendEmailOtp, verifyEmailOtp } from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/send-email", sendEmailOtp);
router.post("/verify-email", verifyEmailOtp);

export default router;
