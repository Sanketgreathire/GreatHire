import { body } from "express-validator";

export const validateUser = [
  // Full Name (Minimum length: 3)
  body("fullname")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  // Email Validation
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),

  // Phone Number Validation — accept common formats including local mobile numbers
  // and international numbers with or without the leading +.
  body("phoneNumber")
    .trim()
    .custom((value) => {
      const normalized = String(value || "").replace(/[\s().-]/g, "");
      return /^\+?\d{10,15}$/.test(normalized);
    })
    .withMessage("Invalid phone number. Please enter a valid mobile number (e.g. 9876543210 or +919876543210)"),

  // Password (Minimum length: 8)
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
