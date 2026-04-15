// controllers/admin/userStats.controller.js
import { User } from "../../models/user.model.js";
import { Application } from "../../models/application.model.js";

// ===============================
// UPDATE USER (ADMIN)
// ===============================
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

    const updateData = {};

    // BASIC fields
    if (body.fullname !== undefined) updateData.fullname = body.fullname;
    if (body.contact !== undefined) updateData.contact = body.contact;

    // PROFILE fields
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

      // ✅ NORMALIZATION (single source of truth)

      if (p.skills !== undefined) {
        updateData["profile.skills"] = Array.isArray(p.skills)
          ? p.skills
          : typeof p.skills === "string" && p.skills.trim() !== ""
          ? p.skills.split(",").map((s) => s.trim())
          : [];
      }

      if (p.category !== undefined) {
        updateData["profile.category"] = Array.isArray(p.category)
          ? p.category
          : [p.category];
      }

      if (p.language !== undefined) {
        updateData["profile.language"] = Array.isArray(p.language)
          ? p.language
          : [p.language];
      }

      if (Array.isArray(p.documents))
        updateData["profile.documents"] = p.documents;

      if (Array.isArray(p.experiences))
        updateData["profile.experiences"] = p.experiences;
    }

    // ✅ FIX: UserStats → User
    const updatedUser = await User.findByIdAndUpdate(
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

// ===============================
// EXPERIENCE SUPPORT
// ===============================
const addExperienceSupport = {
  jobRole: {
    $ifNull: [
      { $arrayElemAt: ["$profile.experiences.jobProfile", 0] },
      "$profile.experience.jobProfile",
    ],
  },
  duration: {
    $ifNull: [
      { $arrayElemAt: ["$profile.experiences.duration", 0] },
      "$profile.experience.duration",
    ],
  },
};

// ===============================
// GET USER STATS
// ===============================
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const users = await User.aggregate([
      // 1️⃣ Convert dates FIRST
      {
        $addFields: {
          createdAtSafe: {
            $cond: [
              { $eq: ["$createdAt", null] },
              null,
              {
                $convert: {
                  input: "$createdAt",
                  to: "date",
                  onError: null,   // ✅ ignores bad dates
                  onNull: null
                }
              },
            ],
          },
          lastActiveAtSafe: {
            $cond: [
              { $eq: ["$lastActiveAt", null] },
              null,
              { $toDate: "$lastActiveAt" },
            ],
          },
        },
      },

      // 2️⃣ SORT BEFORE LOOKUP (FIX)
      { $sort: { createdAtSafe: -1 } },

      // 3️⃣ LOOKUP AFTER SORT
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "applicant",
          as: "applications",
        },
      },

      // 4️⃣ Formatting
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
          email: "$emailId.email",
          phoneNumber: "$phoneNumber.number",
          ...addExperienceSupport,

          joined: {
                    $dateToString: {
                      format: "%Y-%m-%d",   // ✅ VALID
                      date: "$createdAtSafe",
                    },
                  },

          lastActiveAt: {
            $cond: {
              if: { $eq: ["$lastActiveAtSafe", null] },
              then: null,
              else: {
                $dateToString: {
                  format: "%Y-%m-%d",   // ✅ VALID
                  date: "$lastActiveAtSafe",
                },
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
// GET USERS LIST
// ===============================
export const getUsersList = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $addFields: {
          createdAtSafe: {
            $cond: [
              { $eq: ["$createdAt", null] },
              null,
              {
                $convert: {
                  input: "$createdAt",
                  to: "date",
                  onError: null,   // ✅ ignores bad dates
                  onNull: null
                }
              },
            ],
          },
          lastActiveAtSafe: {
            $cond: [
              { $eq: ["$lastActiveAt", null] },
              null,
              { $toDate: "$lastActiveAt" },
            ],
          },
        },
      },

      // ✅ SORT FIRST
      { $sort: { createdAtSafe: -1 } },

      // ✅ LOOKUP AFTER SORT
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
          ...addExperienceSupport,

          joined: {
                    $dateToString: {
                      format: "%Y-%m-%d",   // ✅ MongoDB supported
                      date: "$createdAtSafe",
                    },
                  },

          lastActiveAt: {
            $cond: {
              if: { $eq: ["$lastActiveAtSafe", null] },
              then: null,
              else: {
                $dateToString: {
                  format: "%Y-%m-%d",   // ✅ MongoDB supported
                  date: "$lastActiveAtSafe",
                },
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
    ]).allowDiskUse(true);

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

// ===============================
// GET ONE USER
// ===============================
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

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

// ===============================
// GET ALL APPLICATIONS OF USER
// ===============================
export const getAllApplication = async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await Application.find({
      applicant: userId,
    }).populate({
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
