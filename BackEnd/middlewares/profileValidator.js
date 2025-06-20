import { body } from "express-validator";
const salaryPattern = /^(\d+(\.\d+)?)(\s*LPA)?$/i;

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

    // Category (If provided, must be a boolean)
  body("category")
  .isBoolean()
  .withMessage("You have to select a category"),

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
  body("pincode").optional().isNumeric().withMessage("Pincode must be a number"),

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
    .custom(value => {
      if (typeof value !== 'string') value = String(value);
      return salaryPattern.test(value.trim());
    })
    .withMessage("Current CTC must be a number or in format like '12LPA', '12.5 LPA', etc."),
  body("expectedCTC")
    .optional()
    .custom(value => {
      if (typeof value !== 'string') value = String(value);
      return salaryPattern.test(value.trim());
    })
    .withMessage("Expected CTC must be a number or in format like '12LPA', '12.5 LPA', etc."),
];
