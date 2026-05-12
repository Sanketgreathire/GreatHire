import { body } from "express-validator";

export const validateUser = [
  // Full Name (Minimum length: 3)
  body("fullname")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  // Email Validation
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),

  // Phone Number Validation — international E.164 format (+919876543210)
  body("phoneNumber")
    .matches(/^\+\d{6,15}$/)
    .withMessage("Invalid phone number. Please include country code (e.g. +919876543210)"),

  // Password (Minimum length: 8)
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
