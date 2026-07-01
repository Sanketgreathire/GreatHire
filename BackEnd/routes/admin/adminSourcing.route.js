import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import isAdmin from "../../middlewares/isAdmin.js";
import { AISourcedCandidate } from "../../models/sourcing/aiSourcedCandidate.model.js";

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

    const sourceMapping = {
      GITHUB:     "GITHUB_PROFILE",
      LINKEDIN:   "LINKEDIN_PROFILE",
      NAUKRI:     "PUBLIC_PROFILE",
      INDEED:     "PUBLIC_PROFILE",
      API_IMPORT: "API_IMPORT",
      CSV_IMPORT: "CSV_IMPORT",
      MANUAL:     "MANUAL",
    };

    const bySource = {};
    bySourceArray.forEach(({ _id, count }) => {
      const mapped = sourceMapping[_id] || _id;
      bySource[mapped] = (bySource[mapped] || 0) + count;
    });

    return res.json({ success: true, stats: { total, bySource } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/admin/sourcing/candidates
router.get("/candidates", async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [candidates, total] = await Promise.all([
      AISourcedCandidate.find().sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      AISourcedCandidate.countDocuments(),
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
