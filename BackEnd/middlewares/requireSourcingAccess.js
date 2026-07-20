import { Company } from "../models/company.model.js";

// AI Sourcing (GitHub-based free sourcing + Recruitkar paid sourcing) is a
// paid-plan feature — the Starter/FREE plan explicitly excludes AI features.
const requireSourcingAccess = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      userId: { $elemMatch: { user: req.id } },
    }).select("hasSubscription plan");

    if (!company?.hasSubscription) {
      return res.status(403).json({
        success: false,
        message: "AI Sourcing is available on paid plans only. Please upgrade your plan.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to verify plan access." });
  }
};

export default requireSourcingAccess;
