const isRecruiterWithCompany = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied. Recruiters only.", success: false });
    }

    if (!req.user.isCompanyCreated) {
      return res.status(403).json({
        message: "Create your company profile first before performing this action.",
        success: false,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export default isRecruiterWithCompany;
