import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { csvUpload } from "../middlewares/csvUpload.js";
import {
  importCsv,
  importGithub,
  importLinkedin,
  importLinkedinBulk,
  importManual,
  importJson,
  getJobStatus,
  listJobs,
  getIngestionStats,
} from "../sourcing/ingestionController.js";

const router = express.Router();
router.use(isAuthenticated);

// ── CSV import ────────────────────────────────────────────────────────────────
router.post("/import-csv", (req, res, next) => {
  csvUpload(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, importCsv);

// ── GitHub import ─────────────────────────────────────────────────────────────
router.post("/import-github", importGithub);

// ── LinkedIn import ───────────────────────────────────────────────────────────
router.post("/import-linkedin",      importLinkedin);
router.post("/import-linkedin-bulk", importLinkedinBulk);

// ── Manual / JSON import (any portal) ────────────────────────────────────────
router.post("/import-manual", importManual);
router.post("/import-json",   importJson);   // Naukri, Indeed, Monster, etc.

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get("/stats", getIngestionStats);

// ── Job status ────────────────────────────────────────────────────────────────
router.get("/jobs",       listJobs);
router.get("/job/:jobId", getJobStatus);

export default router;
