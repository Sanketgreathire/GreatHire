import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklistedtoken.model.js";
import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Admin } from "../models/admin/admin.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    const userId = decode.id || decode.userId;
    req.id = userId;

    // Find user and set req.user for notification controller
    let user = await User.findById(userId) || 
               await Recruiter.findById(userId) || 
               await Admin.findById(userId);
    
    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      message: "Internal auth error",
      success: false,
      error: error.message,
    });
  }
};

export default isAuthenticated;