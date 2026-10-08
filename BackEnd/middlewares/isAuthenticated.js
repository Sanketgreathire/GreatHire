import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklistedtoken.model.js";
import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Admin } from "../models/admin/admin.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
<<<<<<< Updated upstream
    const authHeader = req.header("Authorization") || req.header("authorization");
    const headerToken = authHeader?.replace(/^Bearer\s+/i, "")?.trim();
    const token = headerToken || req.cookies?.token;
=======
    const token =
      req.header("Authorization")?.split(" ")[1] || req.cookies?.token;
>>>>>>> Stashed changes

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not configured");
    }

    // Throws JsonWebTokenError / TokenExpiredError / NotBeforeError on failure
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    // Extract user ID from the decoded token
    const userId = decode.id || decode.userId;
    req.id = userId;

    let user;

    if (
      decode.userType === "admin" ||
      decode.role === "admin" ||
      decode.role === "Owner"
    ) {
      user = await Admin.findById(userId);
    } else if (
      decode.userType === "recruiter" ||
      decode.role === "recruiter"
    ) {
      user = await Recruiter.findById(userId);
    } else {
      user = await User.findById(userId);
      if (!user) user = await Recruiter.findById(userId);
      if (!user) user = await Admin.findById(userId);
    }

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(
        error.name
      )
    ) {
      return res.status(401).json({
        message:
          error.name === "TokenExpiredError" ? "Session expired" : "Invalid token",
        success: false,
      });
    }

    // Log details server-side only; never send internal error text to the client
    console.error("Auth error:", error);
    return res.status(500).json({
      message: "Internal auth error",
      success: false,
    });
  }
};

export default isAuthenticated;