import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import requireSourcingAccess from "../../middlewares/requireSourcingAccess.js";
import { resumeUpload } from "../../middlewares/resumeUpload.js";


// Existing sourcing controllers
import {
  uploadResume,
  searchCandidates,
  getSavedSourcedCandidates,
  getCandidateById,
  deleteCandidate,
  sourceByJobDescription,
} from "../../controllers/sourcing/sourcing.controller.js";
import { recruitkarSearch, recruitkarContact, recruitkarPreview } from "../../controllers/sourcing/recruitkar.controller.js";

// Semantic AI controllers
import {
  semanticSearchHandler,
  aiHealthHandler,
  reindexCandidate,
  reindexPending,
} from "../../sourcing/ai/semanticSearchController.js";

const router = express.Router();
router.use(isAuthenticated);

// ── Resume Upload ─────────────────────────────────────────────────────────────
router.post("/upload-resume", (req, res, next) => {
  resumeUpload(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, uploadResume);

// ── Chrome Extension Manual Upload ────────────────────────────────────────────
router.post("/upload-manual", async (req, res) => {
  try {
    const recruiterId = req.id;
    const { SourcingCandidate } = await import("../../models/sourcing/sourcingCandidate.model.js");
    const { normalizeSkills } = await import("../../sourcing/services/normalizationService.js");
    const { buildDedupHash, findDuplicate } = await import("../../sourcing/services/deduplicationService.js");

    const {
      fullName,
      emails = [],
      phones = [],
      designation = '',
      currentCompany = '',
      location = '',
      skills = [],
      totalExperience = 0,
      summary = '',
      linkedinUrl = '',
      githubUrl = '',
      platform = 'chrome_extension'
    } = req.body;

    if (!fullName || fullName === 'Unknown') {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }

    // Check for duplicates
    const { isDuplicate } = await findDuplicate({
      emails,
      phones,
      githubUrl,
      linkedinUrl,
    }, recruiterId);

    if (isDuplicate) {
      return res.status(200).json({ success: true, message: 'Candidate already exists', duplicate: true });
    }

    const normalizedSkills = normalizeSkills(skills);

    const candidate = await SourcingCandidate.create({
      fullName,
      emails,
      phones,
      githubUrl,
      linkedinUrl,
      location,
      currentCompany,
      designation,
      totalExperience,
      skills,
      normalizedSkills,
      summary,
      sourceType: 'CHROME_EXTENSION',
      sourceUrl: linkedinUrl || githubUrl || '',
      createdBy: recruiterId,
      createdByModel: 'Recruiter',
      ingestionStatus: 'COMPLETED',
      embeddingStatus: 'PENDING',
      dedupHash: buildDedupHash({ emails, phones, githubUrl, linkedinUrl }),
    });

    return res.status(201).json({
      success: true,
      message: 'Candidate saved successfully',
      candidate: {
        _id: candidate._id,
        fullName: candidate.fullName,
        designation: candidate.designation,
      },
    });
  } catch (error) {
    console.error('Manual upload error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save candidate', error: error.message });
  }
});

// ── Semantic / Hybrid Search ──────────────────────────────────────────────────
router.get("/semantic-search",  semanticSearchHandler);
router.post("/semantic-search", semanticSearchHandler);

// ── AI Health + Re-indexing ───────────────────────────────────────────────────
router.get("/ai-health",              aiHealthHandler);
router.post("/reindex/:id",           reindexCandidate);
router.post("/reindex-pending",       reindexPending);

// ── Keyword Search ────────────────────────────────────────────────────────────
router.get("/search", searchCandidates);
router.get("/saved-sourced", requireSourcingAccess, getSavedSourcedCandidates);

// ── JD-Based Sourcing (Free — GitHub) ─────────────────────────────────────────
router.post("/source-by-jd", requireSourcingAccess, sourceByJobDescription);

// ── Recruitkar AI Sourcing (Paid) ──────────────────────────────────────────────
router.post("/recruitkar-search", requireSourcingAccess, recruitkarSearch);
router.post("/recruitkar-contact", requireSourcingAccess, recruitkarContact);
router.post("/recruitkar-preview", requireSourcingAccess, recruitkarPreview);

// ── Single Candidate ──────────────────────────────────────────────────────────
router.get("/:id",    getCandidateById);
router.delete("/:id", deleteCandidate);

export default router;
