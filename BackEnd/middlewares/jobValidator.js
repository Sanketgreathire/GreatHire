import { body } from "express-validator";

export const validateJobApplication = [
  body("fullname")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  body("email").trim().isEmail().withMessage("Invalid email format"),

  body("number")
    .matches(/^[6789]\d{9}$|^\d{10}$/)
    .withMessage(
      "Invalid phone number format (must be 10 digits, no country code)"
    ),

  body("city").optional().isString().withMessage("City must be a string"),

  body("state").optional().isString().withMessage("State must be a string"),

  body("country").optional().isString().withMessage("Country must be a string"),

  body("coverLetter")
    .optional()
    .isString()
    .isLength({ max: 750 })
    .withMessage("Cover letter must be under 750 characters"),

  body("experience")
    .optional()
    .isString()
    .isLength({ max: 750 })
    .withMessage("Experience details must be under 750 characters"),

  body("jobTitle").optional().isString().withMessage("Job title is string"),

  body("company").optional().isString().withMessage("Company name is string"),

  body("jobId")
    .notEmpty()
    .withMessage("Job ID is required")
    .isMongoId()
    .withMessage("Invalid Job ID"),
];
