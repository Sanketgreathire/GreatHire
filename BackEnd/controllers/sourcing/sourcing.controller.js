import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { SourcingCandidate } from "../../models/sourcing/sourcingCandidate.model.js";
import { extractResumeText, parseResumeFields } from "./resumeParser.service.js";
import { JdSourcingService } from "../../sourcing/services/jdSourcingService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── POST /api/v1/sourcing/upload-resume ─────────────────────────────────────
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file uploaded." });
    }

    const recruiterId = req.id;
    const filePath    = req.file.path;
    const fileName    = req.file.originalname;
    const resumeUrl   = `/resumes/${req.file.filename}`;

    const parsedText = await extractResumeText(filePath);
    const parsed     = parseResumeFields(parsedText);

    const fullName =
      req.body.fullName?.trim() ||
      parsedText.split(/\r?\n/).find((l) => l.trim().length > 2 && l.trim().length < 60)?.trim() ||
      "Unknown";

    const candidate = await SourcingCandidate.create({
      fullName,
      emails:             parsed.emails,
      phones:             parsed.phones,
      skills:             parsed.skills,
      totalExperience:    parsed.totalExperience,
      currentCompany:     parsed.currentCompany,
      designation:        parsed.designation,
      location:           parsed.location,
      education:          parsed.education,
      resumeUrl,
      resumeOriginalName: fileName,
      parsedText,
      sourceType:         "RESUME_UPLOAD",
      createdBy:          recruiterId,
      embeddingStatus:    "PENDING",
    });

    return res.status(201).json({
      success:   true,
      message:   "Resume uploaded and parsed successfully.",
      candidate: {
        _id:             candidate._id,
        fullName:        candidate.fullName,
        emails:          candidate.emails,
        phones:          candidate.phones,
        skills:          candidate.skills,
        totalExperience: candidate.totalExperience,
        currentCompany:  candidate.currentCompany,
        designation:     candidate.designation,
        location:        candidate.location,
        education:       candidate.education,
        resumeUrl:       candidate.resumeUrl,
        sourceType:      candidate.sourceType,
        createdAt:       candidate.createdAt,
      },
    });
  } catch (error) {
    console.error("uploadResume error:", error);
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ success: false, message: "Failed to process resume.", error: error.message });
  }
};

// ─── GET /api/v1/sourcing/search ─────────────────────────────────────────────
export const searchCandidates = async (req, res) => {
  try {
    const recruiterId = req.id;
    const { q, skills, location, designation, minExp, maxExp, page = 1, limit = 10 } = req.query;

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const query = { createdBy: recruiterId };

    if (q?.trim())           query.$text      = { $search: q.trim() };
    if (location?.trim())    query.location   = { $regex: location.trim(),   $options: "i" };
    if (designation?.trim()) query.designation = { $regex: designation.trim(), $options: "i" };

    if (skills?.trim()) {
      const arr = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) query.skills = { $all: arr.map((s) => new RegExp(s, "i")) };
    }

    if (minExp !== undefined || maxExp !== undefined) {
      query.totalExperience = {};
      if (minExp !== undefined) query.totalExperience.$gte = parseFloat(minExp);
      if (maxExp !== undefined) query.totalExperience.$lte = parseFloat(maxExp);
    }

    const [candidates, total] = await Promise.all([
      SourcingCandidate.find(query)
        .select("-parsedText")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      SourcingCandidate.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      candidates,
      pagination: {
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext:    pageNum < Math.ceil(total / limitNum),
        hasPrev:    pageNum > 1,
      },
    });
  } catch (error) {
    console.error("searchCandidates error:", error);
    return res.status(500).json({ success: false, message: "Search failed.", error: error.message });
  }
};

// ─── GET /api/v1/sourcing/:id ─────────────────────────────────────────────────
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await SourcingCandidate.findOne({
      _id:       req.params.id,
      createdBy: req.id,
    }).select("-parsedText");

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found." });
    }

    return res.status(200).json({ success: true, candidate });
  } catch (error) {
    console.error("getCandidateById error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch candidate.", error: error.message });
  }
};

// ─── DELETE /api/v1/sourcing/:id ──────────────────────────────────────────────
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await SourcingCandidate.findOneAndDelete({
      _id:       req.params.id,
      createdBy: req.id,
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found." });
    }

    if (candidate.resumeUrl) {
      const filePath = path.join(__dirname, "../../public", candidate.resumeUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    return res.status(200).json({ success: true, message: "Candidate deleted." });
  } catch (error) {
    console.error("deleteCandidate error:", error);
    return res.status(500).json({ success: false, message: "Delete failed.", error: error.message });
  }
};

// ─── POST /api/v1/sourcing/source-by-jd ──────────────────────────────────────
export const sourceByJobDescription = async (req, res) => {
  try {
    const { skills, location, designation, minExp, maxExp, jobDescription } = req.body;

    if (!skills && !location && !designation && !jobDescription) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one filter (skills, location, designation) or job description is required." 
      });
    }

    const jdSourcing = new JdSourcingService();
    const result = await jdSourcing.sourceAndScore(
      { skills, location, designation, minExp, maxExp, jobDescription },
      20
    );

    return res.status(200).json({
      success: true,
      candidates: result.candidates,
      total: result.total,
      mode: result.mode,
      message: result.candidates.length === 0 
        ? "No candidates found matching the criteria."
        : `Found ${result.candidates.length} candidates${jobDescription ? ' and scored against job description' : ''}.`
    });
  } catch (error) {
    console.error("sourceByJobDescription error:", error);
    return res.status(500).json({ success: false, message: "Failed to source candidates.", error: error.message });
  }
};
