import { Application } from "../../models/application.model.js";

export const applicationStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();

    return res.status(200).json({
      success: true,
      stats: { totalApplications },
    });
  } catch (err) {
    console.error("Error fetching application stats:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
