// controllers/admin/userStats.controller.js
import { User } from "../../models/user.model.js";
import { Application } from "../../models/application.model.js";

// ===============================
// UPDATE USER (ADMIN) — full-profile update
// ===============================
// UPDATE USER — accepts flat fields & nested fields
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const body = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Build update object dynamically
    const updateData = {};

    // BASIC fields (top-level)
    if (body.fullname !== undefined) updateData.fullname = body.fullname;
    if (body.contact !== undefined) updateData.contact = body.contact;

    // PROFILE fields - accept full profile object or individual fields
    if (body.profile) {
      const p = body.profile;

      if (p.bio !== undefined) updateData["profile.bio"] = p.bio;
      if (p.gender !== undefined) updateData["profile.gender"] = p.gender;
      if (p.qualification !== undefined)
        updateData["profile.qualification"] = p.qualification;
      if (p.otherQualification !== undefined)
        updateData["profile.otherQualification"] = p.otherQualification;
      if (p.profilePhoto !== undefined)
        updateData["profile.profilePhoto"] = p.profilePhoto;
      if (p.resume !== undefined) updateData["profile.resume"] = p.resume;
      if (p.resumeOriginalName !== undefined)
        updateData["profile.resumeOriginalName"] = p.resumeOriginalName;

      // Arrays: ensure arrays are saved only when provided as arrays
      if (Array.isArray(p.skills)) updateData["profile.skills"] = p.skills;
      if (Array.isArray(p.category))
        updateData["profile.category"] = p.category;
      if (Array.isArray(p.language))
        updateData["profile.language"] = p.language;
      if (Array.isArray(p.documents))
        updateData["profile.documents"] = p.documents;

      // ⭐⭐⭐ NORMALIZATION ADDED HERE ⭐⭐⭐
      // SKILLS normalization → always array
      if (p.skills !== undefined) {
        updateData["profile.skills"] = Array.isArray(p.skills)
          ? p.skills
          : typeof p.skills === "string" && p.skills.trim() !== ""
          ? p.skills.split(",").map((s) => s.trim())
          : [];
      }

      // CATEGORY normalization → always array
      if (p.category !== undefined) {
        updateData["profile.category"] = Array.isArray(p.category)
          ? p.category
          : [p.category];
      }

      // LANGUAGE normalization → always array
      if (p.language !== undefined) {
        updateData["profile.language"] = Array.isArray(p.language)
          ? p.language
          : [p.language];
      }
      // ⭐⭐⭐ END NORMALIZATION ⭐⭐⭐

      // experiences: ensure valid array
      if (Array.isArray(p.experiences))
        updateData["profile.experiences"] = p.experiences;
    }

    // Update user's profile object with atomic operations
    const updatedUser = await UserStats.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};


// Helper to support both old & new experience paths for list view
const addExperienceSupport = {
  jobRole: {
    $ifNull: [
      { $arrayElemAt: ["$profile.experiences.jobProfile", 0] },
      "$profile.experience.jobProfile"
    ]
  },
  duration: {
    $ifNull: [
      { $arrayElemAt: ["$profile.experiences.duration", 0] },
      "$profile.experience.duration"
    ]
  },
};

// ===============================
// GET USER STATS + LIST
// ===============================
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const users = await User.aggregate([

      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "applicant",
          as: "applications",
        }
      },

      // 1️⃣ Convert dates to safe Date type
      {
        $addFields: {
          createdAtSafe: {
            $cond: [
              { $eq: ["$createdAt", null] },
              null,
              { $toDate: "$createdAt" }
            ]
          },
          lastActiveAtSafe: {
            $cond: [
              { $eq: ["$lastActiveAt", null] },
              null,
              { $toDate: "$lastActiveAt" }
            ]
          }
        }
      },

      // 2️⃣ Sort immediately — light document = fast sort
      {
        $sort: { createdAtSafe: -1 }
      },

      // 3️⃣ Heavy formatting AFTER sorting
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
          email: "$emailId.email",
          phoneNumber: "$phoneNumber.number",

          ...addExperienceSupport,

          joined: {
            $concat: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 1] }, then: "Sun" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 2] }, then: "Mon" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 3] }, then: "Tue" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 4] }, then: "Wed" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 5] }, then: "Thu" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 6] }, then: "Fri" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 7] }, then: "Sat" },
                  ],
                  default: "N/A",
                }
              },
              ", ",
              {
                $dateToString: {
                  format: "%d, %Y",
                  date: "$createdAtSafe",
                },
              }
            ]
          },

          lastActiveAt: {
            $cond: {
              if: { $eq: ["$lastActiveAtSafe", null] },
              then: null,
              else: {
                $dateToString: {
                  format: "%b %d, %Y",
                  date: "$lastActiveAtSafe"
                }
              }
            }
          },

          resumeurl: "$profile.resume",
        }
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
        }
      }

    ]).allowDiskUse(true);

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



// ===============================
// GET ALL USERS LIST (ADMIN)
// ===============================
export const getUsersList = async (req, res) => {
  try {

    const users = await User.aggregate([

      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "applicant",
          as: "applications",
        }
      },

      // 1️⃣ Convert date fields first (lightweight)
      {
        $addFields: {
          createdAtSafe: {
            $cond: [
              { $eq: ["$createdAt", null] },
              null,
              { $toDate: "$createdAt" }
            ]
          },
          lastActiveAtSafe: {
            $cond: [
              { $eq: ["$lastActiveAt", null] },
              null,
              { $toDate: "$lastActiveAt" }
            ]
          }
        }
      },

      // 2️⃣ Sort IMMEDIATELY — avoids memory overflow
      {
        $sort: { createdAtSafe: -1 }
      },

      // 3️⃣ Heavy formatting only AFTER sort
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
          email: "$emailId.email",
          phoneNumber: "$phoneNumber.number",

          ...addExperienceSupport,

          joined: {
            $concat: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 1] }, then: "Sun" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 2] }, then: "Mon" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 3] }, then: "Tue" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 4] }, then: "Wed" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 5] }, then: "Thu" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 6] }, then: "Fri" },
                    { case: { $eq: [{ $dayOfWeek: "$createdAtSafe" }, 7] }, then: "Sat" },
                  ],
                  default: "N/A",
                }
              },
              ", ",
              {
                $dateToString: {
                  format: "%d, %Y",
                  date: "$createdAtSafe"
                }
              }
            ]
          },

          lastActiveAt: {
            $cond: {
              if: { $eq: ["$lastActiveAtSafe", null] },
              then: null,
              else: {
                $dateToString: {
                  format: "%b %d, %Y",
                  date: "$lastActiveAtSafe"
                }
              }
            }
          },

          resumeurl: "$profile.resume",
        }
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
        }
      }

    ]).allowDiskUse(true);

    return res.status(200).json({
      success: true,
      data: users,
    });

  } catch (error) {
    console.error("Error fetching users list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



// ===============================
// GET ONE USER
// ===============================
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
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

// ===============================
// GET ALL APPLICATIONS OF USER
// ===============================
export const getAllApplication = async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await Application.find({ applicant: userId }).populate({
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
