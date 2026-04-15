import { body } from "express-validator";

export const validateLogin = [

  // Email Validation
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),

  // Password (Minimum length: 8)
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
