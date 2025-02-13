import { Company } from "../../models/company.model.js";
import { Recruiter } from "../../models/recruiter.model.js";

export const getRecrutierStats = async (req, res) => {
  try {
    const totalRecruiters = await Recruiter.countDocuments();
    const totalActiveRecruiters = await Recruiter.countDocuments({
      isActive: true,
    });
    const totalDeactiveRecruiters = await Recruiter.countDocuments({
      isActive: false,
    });

    return res.status(200).json({
      success: true,
      stats:{totalRecruiters,
      totalActiveRecruiters,
      totalDeactiveRecruiters},
    });
  } catch (err) {
    console.error("Error fetching recruiter stats:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getRecruitersList = async (req, res) => {
  try {
    // Get companyId from the route parameters
    const { companyId } = req.params;

    // Find the company by its ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    // Extract the recruiter IDs from the company's userId array.
    // Assuming the structure is: userId: [ { user: ObjectId }, ... ]
    const recruiterIds = company.userId.map((u) => u.user);

    // Aggregate recruiters matching the company recruiter IDs
    const recruitersAggregation = await Recruiter.aggregate([
      // Match recruiters whose _id is in the extracted list
      {
        $match: { _id: { $in: recruiterIds } },
      },
      // Lookup jobs created by each recruiter
      {
        $lookup: {
          from: "jobs", // Make sure this matches the actual collection name for jobs
          localField: "_id",
          foreignField: "created_by", // In the Job model, this field indicates the creator recruiter
          as: "jobs",
        },
      },
      // Add a field for the number of posted jobs
      {
        $addFields: {
          postedJobs: { $size: "$jobs" },
        },
      },
      // Project the desired fields
      {
        $project: {
          fullname: 1,
          email: "$emailId.email", // Flatten the nested email field
          phone: "$phoneNumber.number", // Flatten the nested phone number
          position: 1,
          postedJobs: 1,
          isActive: 1, // Recruiter status (active/inactive)
        },
      },
    ]);

    // Compute summary information from the retrieved recruiters
    const totalRecruiters = recruitersAggregation.length;
    const activeRecruiters = recruitersAggregation.filter(
      (r) => r.isActive
    ).length;
    const totalJobPosts = recruitersAggregation.reduce(
      (sum, r) => sum + (r.postedJobs || 0),
      0
    );

    return res.status(200).json({
      success: true,
      recruiters: recruitersAggregation,
      summary: {
        totalRecruiters,
        activeRecruiters,
        totalJobPosts,
      },
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
