import { body } from "express-validator";

export const validateProfileUpdate = [
  // Full Name (If provided, min length: 3)
  body("fullname")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  // Email Validation (If provided)
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  // Mobile Number Validation (India: 10 digits, US: 10 digits)
  body("phoneNumber")
    .optional()
    .matches(/^[6789]\d{9}$|^\d{10}$/)
    .withMessage("Invalid mobile number. It should be 10 digits"),

  // Bio (If provided, max length: 500)
  body("bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  // Bio (If provided, max length: 500)
  body("experienceDetails")
    .optional()
    .isString()
    .isLength({ max: 750 })
    .withMessage("Experience Details cannot exceed 750 characters"),

  // Experience (If provided, must be a number)
  body("experience")
    .optional()
    .isString()
    .withMessage("Experience must be a number"),

  // City, State, Country (If provided, should be strings)
  body("city").optional().isString().withMessage("City must be a string"),
  body("state").optional().isString().withMessage("State must be a string"),
  body("country").optional().isString().withMessage("Country must be a string"),

  // Job Profile (If provided, should be a string)
  body("companyName")
    .optional()
    .isString()
    .withMessage("Company Name must be a string"),

  // Job Profile (If provided, should be a string)
  body("jobProfile")
    .optional()
    .isString()
    .withMessage("Job Profile must be a string"),

  // Current & Expected CTC (If provided, must be numbers)
  body("currentCTC")
    .optional()
    .isNumeric()
    .withMessage("Current CTC must be a number"),
  body("expectedCTC")
    .optional()
    .isNumeric()
    .withMessage("Expected CTC must be a number"),
];
