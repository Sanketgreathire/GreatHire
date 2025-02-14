import express from "express";
import {
  verifyToken,
  sendVerificationStatus,
  requestOTPForEmail,
  requestOTPForNumber,
  verifyOTP,
  verifyPaymentForService,
  verifyPaymentForJobPlans,
  verifyPaymentForCandidatePlans,
  updateEmailVerification,
  updateNumberVerification,
  sendEmailToApplicant,
} from "../controllers/verification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { body } from "express-validator";

const router = express.Router();
router.post("/verify-token", verifyToken);
router.put(
  "/send-verification-status",
  isAuthenticated,
  sendVerificationStatus
);
router.post(
  "/request-otp-email",
  [
    body("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
  ],
  isAuthenticated,
  requestOTPForEmail
);
router.post(
  "/request-otp-mob",
  [
    body("number")
      .exists()
      .withMessage("Phone number is required")
      .matches(/^[6789]\d{9}$|^\d{10}$/)
      .withMessage("Invalid phone number. It should be exactly 10 digits."),
  ],
  isAuthenticated,
  requestOTPForNumber
);
router.post("/verify-otp", isAuthenticated, verifyOTP);
router.post("/verify-payment-for-service", verifyPaymentForService);
router.post(
  "/verify-payment-for-jobplan",
  isAuthenticated,
  verifyPaymentForJobPlans
);
router.post(
  "/verify-payment-for-candidateplan",
  isAuthenticated,
  verifyPaymentForCandidatePlans
);

router.post(
  "/update-email-verification",
  [
    body("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
  ],
  isAuthenticated,
  updateEmailVerification
);
router.post(
  "/update-number-verification",
  [
    body("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
  ],
  isAuthenticated,
  updateNumberVerification
);
router.post(
  "/send-email-applicants/:id",
  isAuthenticated,
  sendEmailToApplicant
);

export default router;
