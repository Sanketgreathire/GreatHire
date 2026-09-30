import { body } from "express-validator";

export const validateLogin = [

  // Email Validation
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false,
    }),

  // Password should be present, but older accounts may have shorter values
  body("password")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];
