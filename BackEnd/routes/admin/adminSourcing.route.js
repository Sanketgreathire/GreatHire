import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import isAdmin from "../../middlewares/isAdmin.js";
import { SourcingCandidate } from "../../models/sourcing/sourcingCandidate.model.js";
import { AISourcedCandidate } from "../../models/sourcing/aiSourcedCandidate.model.js";
import { AutoSourcingConfig } from "../../models/sourcing/autoSourcingConfig.model.js";
import { triggerAutoSourcing } from "../../sourcing/cron/autoSourcingCron.js";

const router = express.Router();
router.use(isAuthenticated, isAdmin);

const sourceMapping = {
  GITHUB: "GITHUB_PROFILE",
  LINKEDIN: "LINKEDIN_PROFILE",
  NAUKRI: "PUBLIC_PROFILE",
  INDEED: "PUBLIC_PROFILE",
  API_IMPORT: "API_IMPORT",
  CSV_IMPORT: "CSV_IMPORT",
  MANUAL: "MANUAL",
};

// GET /api/v1/admin/sourcing/stats
// Candidates live in two collections: GitHub/LinkedIn/Naukri/Indeed scrapes are
// still saved to the legacy AISourcedCandidate collection, while Recruitkar
// imports and admin manual-adds go to SourcingCandidate. Recruitkar imports are
// also mirrored into AISourcedCandidate for backward compatibility, so that
// slice is excluded here to avoid counting it twice.
router.get("/stats", async (req, res) => {
  try {
    const [aiBySourceArray, rkBySourceArray, aiTotal, rkTotal] = await Promise.all([
      AISourcedCandidate.aggregate([{ $group: { _id: "$aiSourceType", count: { $sum: 1 } } }]),
      SourcingCandidate.aggregate([{ $group: { _id: "$sourceType", count: { $sum: 1 } } }]),
      AISourcedCandidate.countDocuments({ aiSourceType: { $ne: "API_IMPORT" } }),
      SourcingCandidate.countDocuments(),
    ]);

    const bySource = {};
    aiBySourceArray.forEach(({ _id, count }) => {
      if (_id === "API_IMPORT") return;
      const mapped = sourceMapping[_id] || _id;
      bySource[mapped] = (bySource[mapped] || 0) + count;
    });
    rkBySourceArray.forEach(({ _id, count }) => {
      const mapped = sourceMapping[_id] || _id;
      bySource[mapped] = (bySource[mapped] || 0) + count;
    });

    return res.json({ success: true, stats: { total: aiTotal + rkTotal, bySource } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/admin/sourcing/auto-stats — global auto-sourcing stats across all recruiters
router.get("/auto-stats", async (req, res) => {
  try {
    const configs = await AutoSourcingConfig.find().lean();
    const totalRuns     = configs.reduce((s, c) => s + (c.stats?.totalRuns || 0), 0);
    const totalImported = configs.reduce((s, c) => s + (c.stats?.totalImported || 0), 0);
    const totalSkipped  = configs.reduce((s, c) => s + (c.stats?.totalSkipped || 0), 0);
    const lastRunAt     = configs.reduce((latest, c) => {
      const t = c.stats?.lastRunAt;
      return t && (!latest || t > latest) ? t : latest;
    }, null);
    const lastRunResult = configs.reduce((acc, c) => {
      acc.imported += c.stats?.lastRunResult?.imported || 0;
      acc.skipped  += c.stats?.lastRunResult?.skipped  || 0;
      return acc;
    }, { imported: 0, skipped: 0 });

    return res.json({ success: true, stats: { totalRuns, totalImported, totalSkipped, lastRunAt, lastRunResult } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/admin/sourcing/trigger — manually trigger auto-sourcing
router.post("/trigger", async (req, res) => {
  try {
    triggerAutoSourcing()
      .then(results => console.log("Manual auto-sourcing done:", results))
      .catch(err   => console.error("Manual auto-sourcing failed:", err));
    return res.json({ success: true, message: "Auto-sourcing triggered. Candidates will appear shortly." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/admin/sourcing/candidates
// Merges both collections (see /stats comment above) in application code rather
// than $unionWith because createdBy/recruiterId point at different ref models
// (Recruiter vs User) that populate() can't resolve in a single pass.
const AI_ONLY_SOURCE_TYPES = ["GITHUB", "LINKEDIN", "NAUKRI", "INDEED"];

router.get("/candidates", async (req, res) => {
  try {
    const { q, skills, location, sourceType, page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const fetchCap = skip + limitNum;

    const rkQuery = {};
    const aiQuery = {};

    if (q?.trim()) {
      const re = { $regex: q.trim(), $options: "i" };
      const orClause = [
        { fullName: re }, { designation: re }, { currentCompany: re }, { location: re }, { skills: re },
      ];
      rkQuery.$or = orClause;
      aiQuery.$or = orClause;
    }
    if (location?.trim()) {
      rkQuery.location = { $regex: location.trim(), $options: "i" };
      aiQuery.location = { $regex: location.trim(), $options: "i" };
    }
    if (skills?.trim()) {
      const arr = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) {
        rkQuery.skills = { $all: arr.map((s) => new RegExp(s, "i")) };
        aiQuery.skills = { $all: arr.map((s) => new RegExp(s, "i")) };
      }
    }

    let queryRk = true;
    let queryAi = true;
    if (sourceType?.trim()) {
      const st = sourceType.trim();
      if (st === "API_IMPORT") {
        rkQuery.sourceType = st;
        queryAi = false;
      } else if (AI_ONLY_SOURCE_TYPES.includes(st)) {
        aiQuery.aiSourceType = st;
        queryRk = false;
      } else {
        rkQuery.sourceType = st;
        aiQuery.aiSourceType = st;
      }
    } else {
      aiQuery.aiSourceType = { $ne: "API_IMPORT" };
    }

    const [rkDocs, aiDocs, rkTotal, aiTotal] = await Promise.all([
      queryRk
        ? SourcingCandidate.find(rkQuery)
            .select("-parsedText -embedding")
            .populate("createdBy", "fullName emailId")
            .sort({ createdAt: -1 })
            .limit(fetchCap)
            .lean()
        : [],
      queryAi
        ? AISourcedCandidate.find(aiQuery)
            .populate({ path: "recruiterId", select: "fullName emailId", model: "Recruiter" })
            .sort({ createdAt: -1 })
            .limit(fetchCap)
            .lean()
        : [],
      queryRk ? SourcingCandidate.countDocuments(rkQuery) : 0,
      queryAi ? AISourcedCandidate.countDocuments(aiQuery) : 0,
    ]);

    const normalizedRk = rkDocs.map((c) => ({
      ...c,
      emails: c.emails?.length ? c.emails : (c.email ? [c.email] : []),
      phones: c.phones?.length ? c.phones : (c.phone ? [c.phone] : []),
      sourceType: c.sourceType || "API_IMPORT",
      createdBy: c.createdBy
        ? { fullName: c.createdBy.fullName || "Recruiter", emailId: c.createdBy.emailId }
        : { fullName: "AI Sourced" },
    }));

    const normalizedAi = aiDocs.map((c) => ({
      ...c,
      emails: c.email ? [c.email] : [],
      phones: c.phone ? [c.phone] : [],
      sourceType: c.aiSourceType,
      createdBy: c.recruiterId
        ? { fullName: c.recruiterId.fullName || "Recruiter", emailId: c.recruiterId.emailId }
        : { fullName: "AI Sourced" },
    }));

    const total = rkTotal + aiTotal;
    const candidates = [...normalizedRk, ...normalizedAi]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limitNum);

    return res.json({
      success: true,
      candidates,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/admin/sourcing/manual — add candidate manually
router.post("/manual", async (req, res) => {
  try {
    const { fullName, email, phone, skills, location, designation, currentCompany, githubUrl, linkedinUrl, totalExperience, summary } = req.body;
    if (!fullName?.trim()) return res.status(400).json({ success: false, message: "Full name is required." });

    const candidate = await SourcingCandidate.create({
      fullName:        fullName.trim(),
      emails:          email?.trim() ? [email.trim()] : [],
      phones:          phone?.trim() ? [phone.trim()] : [],
      skills:          Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : []),
      location:        location?.trim() || "",
      designation:     designation?.trim() || "",
      currentCompany:  currentCompany?.trim() || "",
      githubUrl:       githubUrl?.trim() || "",
      linkedinUrl:     linkedinUrl?.trim() || "",
      totalExperience: Number(totalExperience) || 0,
      summary:         summary?.trim() || "",
      sourceType:      "MANUAL",
      createdBy:       req.id,
      createdByModel:  "Admin",
    });
    return res.status(201).json({ success: true, candidate });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/admin/sourcing/:id
router.delete("/:id", async (req, res) => {
  try {
    const candidate =
      (await SourcingCandidate.findByIdAndDelete(req.params.id)) ||
      (await AISourcedCandidate.findByIdAndDelete(req.params.id));
    if (!candidate) return res.status(404).json({ success: false, message: "Not found." });
    return res.json({ success: true, message: "Deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
