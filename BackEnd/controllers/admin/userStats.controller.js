import { User } from "../../models/user.model.js";
import Application from "../../models/application.model.js";

// Get user statistics and user list with lastActiveAt
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Fetch user list with relevant fields
    const users = await User.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "applicant",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
          email: "$emailId.email",
          phoneNumber: "$phoneNumber.number",
          jobRole: "$profile.experience.jobProfile",
          duration: "$profile.experience.duration",
          joined: {
            $concat: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] }, then: "Sun" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] }, then: "Mon" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] }, then: "Tue" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] }, then: "Wed" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] }, then: "Thu" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] }, then: "Fri" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] }, then: "Sat" },
                  ],
                  default: "N/A",
                },
              },
              ", ",
              { $dateToString: { format: "%d, %Y", date: "$createdAt" } },
            ],
          },
          lastActiveAt: {
            $cond: {
              if: { $eq: ["$lastActiveAt", null] },
              then: null,
              else: {
                $dateToString: { format: "%b %d, %Y", date: "$lastActiveAt" },
              },
            },
          },
          resumeurl: "$profile.resume",
        },
      },
      {
        $project: {
          _id: 1,
          fullname: 1,
          email: 1,
          phoneNumber: 1,
          jobRole: 1,
          duration: 1,
          joined: 1,
          lastActiveAt: 1,
          applicationCount: 1,
          resumeurl: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      stats: { totalUsers },
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Get all users list for admin
export const getUsersList = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "applicant",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
          email: "$emailId.email",
          phoneNumber: "$phoneNumber.number",
          jobRole: "$profile.experience.jobProfile",
          duration: "$profile.experience.duration",
          joined: {
            $concat: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] }, then: "Sun" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] }, then: "Mon" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] }, then: "Tue" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] }, then: "Wed" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] }, then: "Thu" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] }, then: "Fri" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] }, then: "Sat" },
                  ],
                  default: "N/A",
                },
              },
              ", ",
              { $dateToString: { format: "%d, %Y", date: "$createdAt" } },
            ],
          },
          lastActiveAt: {
            $cond: {
              if: { $eq: ["$lastActiveAt", null] },
              then: null,
              else: {
                $dateToString: { format: "%b %d, %Y", date: "$lastActiveAt" },
              },
            },
          },
          resumeurl: "$profile.resume",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          fullname: 1,
          email: 1,
          phoneNumber: 1,
          jobRole: 1,
          duration: 1,
          joined: 1,
          lastActiveAt: 1,
          applicationCount: 1,
          resumeurl: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get details of a particular user
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format to prevent errors
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Fetch the user details (excluding sensitive fields like password)
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all applications of a user
export const getAllApplication = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = userId ? { applicant: userId } : {};

    // Fetch applications with populated job details
    const applications = await Application.find(query).populate({
      path: "job",
      select: "jobDetails.title jobDetails.companyName",
    });

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};