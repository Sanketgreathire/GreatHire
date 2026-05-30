import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const CSV_UPLOAD_DIR = path.join(__dirname, "../../public/csv-imports");
if (!fs.existsSync(CSV_UPLOAD_DIR)) fs.mkdirSync(CSV_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, CSV_UPLOAD_DIR),
  filename:    (_req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_").slice(0, 40);
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["text/csv", "application/csv", "application/vnd.ms-excel", "text/plain"];
  const ext     = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(file.mimetype) || ext === ".csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed."), false);
  }
};

export const csvUpload = multer({
  storage,
  limits:     { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
}).single("file");
