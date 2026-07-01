import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import isAdmin from "../../middlewares/isAdmin.js";
import { AISourcedCandidate } from "../../models/postgres/aiSourcedCandidate.model.js";

const router = express.Router();
router.use(isAuthenticated, isAdmin);

// GET /api/v1/admin/sourcing/stats (POSTGRES)
router.get("/stats", async (req, res) => {
  try {
    const [total, bySourceArray] = await Promise.all([
      AISourcedCandidate.countAll(),
      AISourcedCandidate.getStatsBySourceType()
    ]);
    
    // Map PostgreSQL source types to frontend expected names
    const sourceMapping = {
      'GITHUB': 'GITHUB_PROFILE',
      'LINKEDIN': 'LINKEDIN_PROFILE',
      'NAUKRI': 'PUBLIC_PROFILE',
      'INDEED': 'PUBLIC_PROFILE',
      'MONSTER': 'PUBLIC_PROFILE',
      'API_IMPORT': 'API_IMPORT',
      'CSV_IMPORT': 'CSV_IMPORT',
      'MANUAL': 'MANUAL'
    };
    
    const bySource = {};
    bySourceArray.forEach(({ ai_source_type, count }) => { 
      const mappedType = sourceMapping[ai_source_type] || ai_source_type;
      bySource[mappedType] = (bySource[mappedType] || 0) + parseInt(count); 
    });

    return res.json({ success: true, stats: { total, bySource } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/admin/sourcing/candidates (POSTGRES)
router.get("/candidates", async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [rawCandidates, total] = await Promise.all([
      AISourcedCandidate.getAll(limitNum, skip),
      AISourcedCandidate.countAll()
    ]);

    // Transform PostgreSQL format to MongoDB format for frontend compatibility
    const candidates = rawCandidates.map(c => ({
      _id: c.id.toString(),
      fullName: c.full_name,
      designation: c.designation,
      currentCompany: c.current_company,
      totalExperience: c.total_experience,
      location: c.location,
      emails: c.email ? [c.email] : [],
      phones: c.phone ? [c.phone] : [],
      skills: c.skills || [],
      githubUrl: c.github_url,
      linkedinUrl: c.linkedin_url,
      resumeUrl: c.resume_url,
      sourceType: c.ai_source_type,
      createdAt: c.created_at,
      createdBy: { fullName: 'AI Sourced' }
    }));

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

// DELETE /api/v1/admin/sourcing/:id (POSTGRES)
router.delete("/:id", async (req, res) => {
  try {
    const candidate = await AISourcedCandidate.deleteById(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: "Not found." });
    return res.json({ success: true, message: "Deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
