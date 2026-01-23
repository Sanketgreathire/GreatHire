// import { User } from "../models/user.model.js";

export const updateLastActive = async (req, res, next) => {
  try {
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, { lastActiveAt: new Date() });
    }
  } catch (err) {
    console.error("Failed to update lastActiveAt:", err.message);
  }
  next();
};
