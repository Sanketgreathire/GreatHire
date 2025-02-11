import { Recruiter } from "../../models/recruiter.model.js";

export const getRecruitersList = async (req, res) => {
  try {
    const recruiters = await Recruiter.aggregate([
      {
        // Lookup jobs created by the recruiter
        $lookup: {
          from: "jobs", // collection name (ensure it matches your Job model collection)
          localField: "_id",
          foreignField: "created_by",
          as: "jobs",
        },
      },
      {
        // Add computed fields:
        // - postedJobs: the number of jobs in the joined array
        // - email: flatten from emailId.email
        // - phoneNumber: flatten from phoneNumber.number
        $addFields: {
          postedJobs: { $size: "$jobs" },
          email: "$emailId.email",
          phoneNumber: "$phoneNumber.number",
        },
      },
      {
        // Project only the fields needed
        $project: {
          fullname: 1,
          email: 1,
          phoneNumber: 1,
          position: 1,
          postedJobs: 1,
          isVerify: 1,
          isActive: 1,
          // Note: _id is not included per your instruction.
          // If you need _id, add: _id: 1
        },
      },
      {
        // Optional: Sort by creation date descending
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      recruiters,
    });
  } catch (error) {
    console.error("Error fetching recruiter list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRecruiter = async (req, res) => {
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
