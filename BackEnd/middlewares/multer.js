import multer from "multer";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_PDF_TYPE = "application/pdf";

// Configure storage in memory (for processing before upload)
const storage = multer.memoryStorage();

// Define file filters for specific fields
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePhoto" || file.fieldname === "businessFile") {
    // Allow only JPG, JPEG, PNG for profilePhoto & businessFile
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type for ${file.fieldname}! Only .jpg, .jpeg, and .png are allowed.`
        ),
        false
      );
    }
  } else if (file.fieldname === "resume") {
    // Allow only PDF for resume
    if (file.mimetype === ALLOWED_PDF_TYPE) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type for resume! Only .pdf is allowed."),
        false
      );
    }
  } else {
    cb(new Error("Invalid field name!"), false);
  }
};

// Multer configuration with size limit
export const singleUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE }, // File size limit (10MB)
  fileFilter,
}).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "businessFile", maxCount: 1 },
]);
