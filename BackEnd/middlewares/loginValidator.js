import { body } from "express-validator";

export const validateLogin = [

  // Email Validation
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),

  // Password should be present, but older accounts may have shorter values
  body("password")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];
