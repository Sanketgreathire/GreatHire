// // This file handle to check is authencate user use the api
// import jwt from "jsonwebtoken";
// import { BlacklistToken } from "../models/blacklistedtoken.model.js";

// const isAuthenticated = async (req, res, next) => {
//   try {
//     // fetching the token from header or cookies
//     const token =
//       req.header("Authorization")?.split(" ")[1] || req.cookies.token;
    
//       // checking is user request not coming with black listed token
//     const isBlacklisted = await BlacklistToken.findOne({ token: token });

//     if (isBlacklisted) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }
//     // verify the token and decode it
//     const decode = await jwt.verify(token, process.env.SECRET_KEY);
//     if (!decode) {
//       return res.status(401).json({
//         message: "Invalid token",
//         succes: false,
//       });
//     }
//     // associate userId to req object
//     req.id = decode.userId;
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };
// export default isAuthenticated;

import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklistedtoken.model.js";

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

    // ✅ Correct field
    req.id = decode.id || decode.userId;

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
