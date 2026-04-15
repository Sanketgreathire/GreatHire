import { User } from "../../models/user.model.js";
import { Application } from "../../models/application.model.js";

export const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No users selected for deletion.",
      });
    }

    // Delete all applications related to users
    await Application.deleteMany({ applicant: { $in: userIds } });

    // Delete users
    await User.deleteMany({ _id: { $in: userIds } });

    res.status(200).json({
      success: true,
      message: `${userIds.length} user(s) deleted successfully.`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting users.",
    });
  }
};
