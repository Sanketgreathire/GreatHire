import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import isAdmin from "../../middlewares/isAdmin.js";
import { AISourcedCandidate } from "../../models/sourcing/aiSourcedCandidate.model.js";
import { AutoSourcingConfig } from "../../models/sourcing/autoSourcingConfig.model.js";
import { triggerAutoSourcing } from "../../sourcing/cron/autoSourcingCron.js";

const router = express.Router();
router.use(isAuthenticated, isAdmin);

// GET /api/v1/admin/sourcing/stats
router.get("/stats", async (req, res) => {
  try {
    const [total, bySourceArray] = await Promise.all([
      AISourcedCandidate.countDocuments(),
      AISourcedCandidate.aggregate([
        { $group: { _id: "$aiSourceType", count: { $sum: 1 } } }
      ]),
    ]);

    const bySource = {};
    bySourceArray.forEach(({ _id, count }) => {
      if (_id) bySource[_id] = count;
    });

    return res.json({ success: true, stats: { total, bySource } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/admin/sourcing/auto-stats  — global auto-sourcing stats across all recruiters
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

// POST /api/v1/admin/sourcing/trigger  — manually trigger auto-sourcing
router.post("/trigger", async (req, res) => {
  try {
    triggerAutoSourcing()
      .then(results => console.log("✅ Manual auto-sourcing done:", results))
      .catch(err   => console.error("❌ Manual auto-sourcing failed:", err));
    return res.json({ success: true, message: "Auto-sourcing triggered. Candidates will appear shortly." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/admin/sourcing/candidates
router.get("/candidates", async (req, res) => {
  try {
    const { page = 1, limit = 12, q, skills, location, sourceType } = req.query;
    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const filter = {};
    if (q?.trim()) {
      const re = new RegExp(q.trim(), "i");
      filter.$or = [{ fullName: re }, { designation: re }, { currentCompany: re }, { location: re }];
    }
    if (skills?.trim()) {
      const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);
      if (skillList.length) filter.skills = { $in: skillList.map(s => new RegExp(s, "i")) };
    }
    if (location?.trim()) filter.location = new RegExp(location.trim(), "i");
    if (sourceType?.trim()) filter.aiSourceType = sourceType.trim();

    const [candidates, total] = await Promise.all([
      AISourcedCandidate.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      AISourcedCandidate.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      candidates: candidates.map(c => ({
        ...c,
        emails: c.email ? [c.email] : [],
        phones: c.phone ? [c.phone] : [],
        sourceType: c.aiSourceType,
        createdBy: { fullName: "AI Sourced" },
      })),
      pagination: {
        total,
        page:       pageNum,
        limit:      limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext:    pageNum < Math.ceil(total / limitNum),
        hasPrev:    pageNum > 1,
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

    const candidate = await AISourcedCandidate.create({
      fullName:        fullName.trim(),
      email:           email?.trim() || null,
      phone:           phone?.trim() || null,
      skills:          Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : []),
      location:        location?.trim() || null,
      designation:     designation?.trim() || null,
      currentCompany:  currentCompany?.trim() || null,
      githubUrl:       githubUrl?.trim() || null,
      linkedinUrl:     linkedinUrl?.trim() || null,
      totalExperience: Number(totalExperience) || 0,
      summary:         summary?.trim() || null,
      aiSourceType:    "MANUAL",
    });
    return res.status(201).json({ success: true, candidate });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/admin/sourcing/:id
router.delete("/:id", async (req, res) => {
  try {
    const candidate = await AISourcedCandidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Not found." });
    return res.json({ success: true, message: "Deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
