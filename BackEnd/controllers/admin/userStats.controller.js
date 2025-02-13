import { User } from "../../models/user.model.js";
import { Application } from "../../models/application.model.js";

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      success: true,
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

export const getUsersList = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        // Join with the applications collection where the application's "applicant" field matches the user's _id
        $lookup: {
          from: "applications", // Ensure this matches your Application collection name
          localField: "_id",
          foreignField: "applicant",
          as: "applications",
        },
      },
      {
        // Add a new field that counts the number of applications per user
        $addFields: {
          applicationCount: { $size: "$applications" },
        },
      },
      {
        // Create a new field "joinedFormatted" that formats the createdAt date
        $addFields: {
          joinedFormatted: {
            $concat: [
              {
                $switch: {
                  branches: [
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] },
                      then: "Sun",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] },
                      then: "Mon",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] },
                      then: "Tue",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] },
                      then: "Wed",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] },
                      then: "Thu",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] },
                      then: "Fri",
                    },
                    {
                      case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] },
                      then: "Sat",
                    },
                  ],
                  default: "N/A",
                },
              },
              ", ",
              {
                $dateToString: { format: "%d, %Y", date: "$createdAt" },
              },
            ],
          },
        },
      },
      {
        // Project only the required fields:
        // - fullname
        // - email (from emailId.email)
        // - phoneNumber (from phoneNumber.number)
        // - joined (the formatted joined date)
        // - applicationCount
        $project: {
          fullname: 1,
          email: "$emailId.email",
          phoneNumber: "$phoneNumber.number",
          joined: "$joinedFormatted",
          applicationCount: 1,
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

export const getAllApplication = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = userId ? { applicant: userId } : {};

    const applications = await Application.find(query).populate({
      path: "job",
      select: "jobDetails.title jobDetails.companyName", // Only return these fields from jobDetails
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
