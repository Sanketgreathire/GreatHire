import { body } from "express-validator";
const salaryPattern = /^(\d+(\.\d+)?)(\s*LPA)?$/i;

export const validateProfileUpdate = [
  body("fullname")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("phoneNumber")
    .optional()
    .matches(/^[6789]\d{9}$|^\d{10}$/)
    .withMessage("Invalid mobile number. It should be 10 digits"),

  body("bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("city").optional().isString().withMessage("City must be a string"),
  body("state").optional().isString().withMessage("State must be a string"),
  body("country").optional().isString().withMessage("Country must be a string"),
  // pincode comes as string from FormData — skip numeric check here
  body("pincode").optional(),

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

  body("experiences.*.companyName").optional().isString(),
  body("experiences.*.jobProfile").optional().isString(),
  body("experiences.*.duration").optional().isString(),
  body("experiences.*.experienceDetails")
    .optional()
    .isString()
    .isLength({ max: 750 })
    .withMessage("Experience Details cannot exceed 750 characters"),
  body("experiences.*.currentlyWorking").optional().isBoolean(),
  body("experiences.*.currentCTC")
    .optional()
    .custom((value) => {
      if (value && !salaryPattern.test(value.trim())) {
        throw new Error("Current CTC must be a number or in format like '12LPA', '12.5 LPA'");
      }
      return true;
    }),
  body("experiences.*.noticePeriod").optional().isString(),
];
