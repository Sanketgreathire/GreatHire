import { User } from "../../models/user.model.js";
import { Application } from "../../models/application.model.js";

// returning all number of user / candidate of our application
export const getUserStats = async (req, res) => {
  try {
    // counting the document of user in User model / collection
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

// get all users List for admin
export const getUsersList = async (req, res) => {
  try {
    // Aggregation is useful for performing complex data manipulations and transformations in MongoDB
    const users = await User.aggregate([
      {
        // Join with the applications collection where the application's "applicant" field matches the user's _id
        $lookup: {
          from: "applications", // Target collection
          localField: "_id", // Field from the User collection
          foreignField: "applicant", // Field from the Applications collection
          as: "applications", // Output array field
        },
      },
      {
        // Add a new field that counts the number of applications per user
        $addFields: {
          applicationCount: { $size: "$applications" }, // caculating the size of application of each user
        },
      },
      {
        // Create a new field "joinedFormatted" that formats the createdAt date
        $addFields: {
          joinedFormatted: {
            $concat: [
              {
                // $switch converts the day of the week ($dayOfWeek) from createdAt into a short string (e.g., "Sun", "Mon").
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
                // $dateToString formats the date as day, year (e.g., 05, 2024).
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

// get details of particular user
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
    const user = await User.findById(userId).select("-password").lean(); // return plain user js object rather than mongoose object

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

// get all application of a user
export const getAllApplication = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = userId ? { applicant: userId } : {};

    // fetch applicatoin with populate job with job title and job company name
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
