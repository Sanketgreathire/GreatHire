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

  // Category (must be an array of strings, at least one required if present)
  body("profile.category")
    .optional()
    .isArray({ min: 1 })
    .withMessage("You have to select at least one category"),

  body("profile.category.*")
    .optional()
    .isString()
    .withMessage("Each category must be a string"),


  // Language (must be an array of strings, at least one required if present)
  body("profile.language")
    .optional()
    .isArray({ min: 1 })
    .withMessage("You have to select at least one language"),

  body("profile.language.*")
    .optional()
    .isString()
    .withMessage("Each language must be a string"),
    
  // Bio (If provided, max length: 500)
  body("bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  // City, State, Country (If provided, should be strings)
  body("city").optional().isString().withMessage("City must be a string"),
  body("state").optional().isString().withMessage("State must be a string"),
  body("country").optional().isString().withMessage("Country must be a string"),
  body("pincode").optional().isNumeric().withMessage("Pincode must be a number"),

  body("experiences")
    .optional()
    .custom((value) => {
      if (typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch {
          throw new Error("Experiences must be valid JSON");
        }
      }
      if (!Array.isArray(value)) {
        throw new Error("Experiences must be an array");
      }
      return true;
    }),

  body("experiences.*.companyName")
    .optional()
    .isString()
    .withMessage("Company Name must be a string"),
  body("experiences.*.jobProfile")
    .optional()
    .isString()
    .withMessage("Job Profile must be a string"),
  body("experiences.*.duration")
    .optional()
    .isString()
    .withMessage("Duration must be a string"),
  body("experiences.*.experienceDetails")
    .optional()
    .isString()
    .isLength({ max: 750 })
    .withMessage("Experience Details cannot exceed 750 characters"),
  body("experiences.*.currentlyWorking")
    .optional()
    .isBoolean()
    .withMessage("Currently working must be true/false"),
  body("experiences.*.currentCTC")
    .optional()
    .custom((value) => {
      if (value && !salaryPattern.test(value.trim())) {
        throw new Error(
          "Current CTC must be a number or in format like '12LPA', '12.5 LPA'"
        );
      }
      return true;
    }),
  body("experiences.*.noticePeriod")
    .optional()
    .isString()
    .withMessage("Notice Period must be a string"),

  // CTC
  body("currentCTC")
    .optional()
    .custom((value) => {
      if (value && !salaryPattern.test(value.trim())) {
        throw new Error(
          "Current CTC must be a number or in format like '12LPA', '12.5 LPA'"
        );
      }
      return true;
    }),
  body("expectedCTC")
    .optional()
    .custom((value) => {
      if (value && !salaryPattern.test(value.trim())) {
        throw new Error(
          "Expected CTC must be a number or in format like '12LPA', '12.5 LPA'"
        );
      }
      return true;
    }),
];
