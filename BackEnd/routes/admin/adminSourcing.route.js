import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import isAdmin from "../../middlewares/isAdmin.js";
import { SourcingCandidate } from "../../models/sourcing/sourcingCandidate.model.js";

const router = express.Router();
router.use(isAuthenticated, isAdmin);

// GET /api/v1/admin/sourcing/stats
router.get("/stats", async (req, res) => {
  try {
    const total = await SourcingCandidate.countDocuments();
    const bySourceRaw = await SourcingCandidate.aggregate([
      { $group: { _id: "$sourceType", count: { $sum: 1 } } },
    ]);
    const bySource = {};
    bySourceRaw.forEach(({ _id, count }) => { bySource[_id] = count; });

    return res.json({ success: true, stats: { total, bySource } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/admin/sourcing/candidates
router.get("/candidates", async (req, res) => {
  try {
    const { q, skills, location, sourceType, page = 1, limit = 12 } = req.query;
    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const query = {};
    if (q?.trim())          query.$text       = { $search: q.trim() };
    if (location?.trim())   query.location    = { $regex: location.trim(),  $options: "i" };
    if (sourceType?.trim()) query.sourceType  = sourceType.trim();
    if (skills?.trim()) {
      const arr = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (arr.length) query.skills = { $all: arr.map((s) => new RegExp(s, "i")) };
    }

    const [candidates, total] = await Promise.all([
      SourcingCandidate.find(query)
        .select("-parsedText -embedding")
        .populate("createdBy", "fullName emailId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      SourcingCandidate.countDocuments(query),
    ]);

    return res.json({
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
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/admin/sourcing/:id
router.delete("/:id", async (req, res) => {
  try {
    const candidate = await SourcingCandidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Not found." });
    return res.json({ success: true, message: "Deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
