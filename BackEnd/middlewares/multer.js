/** Multer is a Node.js package that makes it easier to upload files. It can handle file size limits, define file filters, and organize uploaded files. Multer is an NPM package that integrates with the middleware stack of Node applications.  */
import multer from "multer";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// restrict image type to be allowed
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_PDF_TYPE = "application/pdf";
const ALLOWED_WORD_TYPES = [
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const ALLOWED_RESUME_TYPES = [ALLOWED_PDF_TYPE, ...ALLOWED_WORD_TYPES];


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
    // Allow PDF, DOC, DOCX for resume
    if (ALLOWED_RESUME_TYPES.includes(file.mimetype)) {
      console.log("Accepted resume file.");
      cb(null, true);
    } else {
      console.log("Rejected file. MIME type:", file.mimetype);
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
