import { User } from "../../models/user.model.js";

// GET /api/v1/admin/referring-candidates
// Returns all users who have reached 25 referrals
export const getReferringCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ referral25AchievedAt: { $ne: null } })
      .select("fullname emailId phoneNumber referralCount referral25AchievedAt referral25RewardStatus")
      .sort({ referral25AchievedAt: -1 })
      .lean();

    return res.status(200).json({ success: true, candidates });
  } catch (error) {
    console.error("getReferringCandidates error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/v1/admin/referring-candidates/:userId/mark-shared
// Marks the reward status as Shared for a candidate
export const markRewardShared = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { referral25RewardStatus: "Shared" },
      { new: true }
    ).select("fullname referral25RewardStatus");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Marked as Shared", user });
  } catch (error) {
    console.error("markRewardShared error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
