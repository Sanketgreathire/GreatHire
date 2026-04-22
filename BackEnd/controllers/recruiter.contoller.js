import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Recruiter } from "../models/recruiter.model.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin/admin.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { CandidateSubscription } from "../models/candidateSubscription.model.js";
import { BlacklistedCompany } from "../models/blacklistedCompany.model.js";
import { check, validationResult } from "express-validator";
import { deletedCompany } from "../models/deletedCompany.model.js";


import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";
import nodemailer from "nodemailer";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { isUserAssociated } from "./company.controller.js";
import notificationService from "../utils/notificationService.js";
import { createUniqueReferralCode } from "../utils/referralCode.js";

// recruiter registration controller
export const register = async (req, res) => {
  try {
    // validation using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, phoneNumber, password } = req.body;
    // Fullname validation
    if (!fullname || fullname.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters long.",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. It must be 10 digits and start with 6–9.",
      });
    }
    // Check if user already exists
    let userExists =
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await User.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (userExists) {
      return res.status(400).json({
        message: "Account already exists.",
        success: false,
      });
    }

    // Hash the password by performing 10 time hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique referral code
    const referralCode = await createUniqueReferralCode();

    // Create new user
    let newUser = await Recruiter.create({
      fullname,
      emailId: {
        email,
        isVerified: false,
      },
      phoneNumber: {
        number: phoneNumber,
        isVerified: false,
      },
      password: hashedPassword,
      plan: "FREE",
      subscriptionStatus: "INACTIVE",
      referralCode,
    });

    // ✅ Send welcome notification for new recruiter registration
    try {
      await notificationService.notifyWelcome({
        userId: newUser._id,
        userType: 'recruiter',
        name: newUser.fullname
      });
    } catch (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    }

    // Remove sensitive information before sending the response
    const userWithoutPassword = await Recruiter.findById(newUser._id).select(
      "-password"
    );

    const tokenData = {
      userId: userWithoutPassword._id,
    };

    // sign in into jwt to create token with 1 day expiration
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // cookies strict used...
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: "Account created successfully.",
        success: true,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// login by google
export const googleLogin = async (req, res) => {
  try {
    let { code, role } = req.body;

    if (!code) {
      return res
        .status(200)
        .json({ message: "Authorization code is required" });
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user information from Google
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const googleUser = userRes.data;

    // Check if user already exists
    let user =
      (await Recruiter.findOne({
        "emailId.email": googleUser.email,
        isActive: true,
      })) ||
      (await User.findOne({ "emailId.email": googleUser.email })) ||
      (await Admin.findOne({ "emailId.email": googleUser.email }));

    if (user) {
      if (role && role !== user.role) {
        res.status(200).json({
          message: "Account already exist use another!",
          success: false,
        });
      }

      const tokenData = {
        userId: user._id,
      };
      const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      // cookies strict used...
      return res
        .status(200)
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "lax",
        })
        .json({
          message: `Welcome back ${user.fullname}`,
          user,
          success: true,
        });
    }

    // If user doesn't exist, create a new one
    const newReferralCode = await createUniqueReferralCode();
    user = new Recruiter({
      fullname: googleUser.name || googleUser.given_name || "No Name",
      emailId: {
        email: googleUser.email,
        isVerified: false,
      },
      phoneNumber: {
        number: "",
        isVerified: false,
      },
      password: "",
      profile: {
        profilePhoto: googleUser.picture || "",
      },
      plan: "FREE",
      subscriptionStatus: "INACTIVE",
      referralCode: newReferralCode,
    });

    await user.save();

    // ✅ Send welcome notification for new Google recruiter
    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: 'recruiter',
        name: user.fullname
      });
    } catch (notificationError) {
      console.error('Error sending welcome notification:', notificationError);
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    // cookies strict used...
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (err) {
    console.error("Error during Google Login:", err.message);
    return res.status(500).json({
      message: "Google Login failed",
      error: err.message,
    });
  }
};

// recruiters list by company id
export const getAllRecruiters = async (req, res) => {
  try {
    const { companyId } = req.body;

    const company = await Company.findById(companyId).select("userId").lean();
    if (!company) {
      return res.status(400).json({ success: false, message: "Company Not found!" });
    }

    const recruiterIds = company.userId.map((u) => u.user);
    const recruiters = await Recruiter.find({ _id: { $in: recruiterIds } })
      .select("-password")
      .lean();

    return res.status(200).json({ recruiters, success: true });
  } catch (error) {
    console.error("Error in fetching recruiters:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getRecruiterById = async (req, res) => {
  const { id } = req.params;

  try {
    const recruiter = await Recruiter.findById(id).select("-password").lean();
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    const company = await Company.findOne(
      { adminEmail: recruiter.emailId.email },
      { companyName: 1 }
    ).lean();

    if (company) recruiter.companyName = company.companyName;

    res.status(200).json({ message: "Recruiter fetched successfully", recruiter, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Plan-based user limits
const USER_LIMITS = {
  FREE:       1,
  STANDARD:   1,
  PREMIUM:    3,
  PRO:        5,
  ENTERPRISE: Infinity,
};

// add recruiter to company by admin
export const addRecruiterToCompany = async (req, res) => {
  const { fullname, email, phoneNumber, password, position, companyId } =
    req.body;
  const userId = req.id;

  try {
    // Validate required fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!isUserAssociated(companyId, userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized", success: false });
    }

    // Enforce user limit per plan
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    const planType = company.plan || "FREE";
    const userLimit = USER_LIMITS[planType] ?? 1;
    const currentUserCount = company.userId.length;
    if (userLimit !== Infinity && currentUserCount >= userLimit) {
      return res.status(400).json({
        success: false,
        message: `Your ${planType} plan allows a maximum of ${userLimit} user${userLimit > 1 ? "s" : ""}. Please upgrade your plan to add more recruiters.`,
      });
    }

    // Check if recruiter email already exists
    const existingRecruiter =
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await User.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (existingRecruiter) {
      return res.status(400).json({
        success: false,
        message: "Account already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new recruiter
    const recruiter = await Recruiter.create({
      fullname,
      emailId: {
        email,
        isVerified: true,
      },
      phoneNumber: {
        number: phoneNumber,
        isVerified: true,
      },
      password: hashedPassword,
      position,
      isVerify: 1,
      isCompanyCreated: true,
    });

    // Update company with recruiter's ID
    await company.userId.push({ user: recruiter._id });
    await company.save();

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or your email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: `"GreatHire Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Recruiter Account Has Been Created",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2>Great<span style="color: #1D4ED8;">Hire</span></h2>
                <p style="color: #555;">Building Smart and Powerful Recruiter Teams</p>
              </div>
        
              <h3 style="color: #333;">Welcome to Great<span style="color: #1D4ED8;">Hire</span>, ${fullname}!</h3>
              <p style="color: #555;">
                We are excited to inform you that you have been added as a recruiter by your company admin. Below are your account details:
              </p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Full Name:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${fullname}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone Number:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${phoneNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Position:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${position}</td>
                </tr>
              </table>
        
              <h4 style="color: #1e90ff;">Your Login Credentials:</h4>
              <p style="font-weight: bold; color: #333;">Email: ${email}</p>
              <p style="font-weight: bold; color: #333;">Password: ${password}</p>
              
              <p style="color: #555;">
                Please log in to your account using the credentials above at the following link:
                <a href="${process.env.FRONTEND_URL
        }/login" style="color: #1e90ff; text-decoration: none;">GreatHire Login</a>
              </p>
        
              <p style="color: #555;">
                Make sure to update your password after logging in for the first time for security purposes.
              </p>
        
              <div style="margin-top: 20px; text-align: center;">
                <p style="font-size: 14px; color: #aaa;">This is an automated email, please do not reply.</p>
                <p style="font-size: 14px; color: #aaa;">© ${new Date().getFullYear()} GreatHire. All rights reserved.</p>
              </div>
            </div>
          `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: "Recruiter added. credentials send to recruiter mail. ",
    });
  } catch (err) {
    console.error("Error adding recruiter:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// update profile of recruiter
export const updateProfile = async (req, res) => {
  try {
    const { fullname, phoneNumber, position } = req.body;
    const { profilePhoto } = req.files; // Access files from req.files
    const userId = req.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing in the request.",
        success: false,
      });
    }

    if (fullname && (typeof fullname !== "string" || fullname.length < 3)) {
      return res.status(200).json({
        message: "Fullname must be a string and at least 3 characters long.",
        success: false,
      });
    }

    // Validate phone number (India: 10-digit starting with 6-9, US: 10-digit)
    const phoneRegex = /^[6789]\d{9}$|^\d{10}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    let user = await Recruiter.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Upload profile photo if provided
    if (profilePhoto && profilePhoto.length > 0) {
      const fileUri = getDataUri(profilePhoto[0]);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.profilePhoto = cloudResponse.secure_url;
    }

    if (fullname && user.fullname !== fullname) user.fullname = fullname;
    if (phoneNumber && user.phoneNumber.number !== phoneNumber) {
      user.phoneNumber.number = phoneNumber;
      user.phoneNumber.isVerified = false;
    }
    if (position && user.position !== position) user.position = position;
    await user.save();

    const updatedUser = await Recruiter.findById(userId).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      message: "An error occurred while updating the profile.",
      error: error.message,
      success: false,
    });
  }
};

// delete account of recruiter by admin or company admin
export const deleteAccount = async (req, res) => {
  const { userEmail, companyId } = req.body;

  try {
    const [admin, user] = await Promise.all([
      Admin.findById(req.id).select("_id").lean(),
      Recruiter.findOne({ "emailId.email": userEmail }).select("_id emailId").lean(),
    ]);

    const userId = user?._id || req.id;

    if (!admin) {
      const company = await Company.findById(companyId).select("userId").lean();
      const belongs = company?.userId.some(u => u.user.toString() === userId.toString());
      const recruiterActive = belongs
        ? (await Recruiter.findById(userId).select("isActive").lean())?.isActive
        : false;
      if (!belongs || !recruiterActive) {
        return res.status(403).json({ message: "You are not authorized", success: false });
      }
    }

    const company = await Company.findById(companyId).lean();
    if (!company) {
      if (admin && user) {
        await Recruiter.findByIdAndDelete(user._id);
        return res.status(200).json({ success: true, message: "Recruiter deleted successfully" });
      }
      return res.status(404).json({ message: "Company not found", success: false });
    }

    if (userEmail === company.adminEmail || admin) {
      const recruiterIds = company.userId.map((u) => u.user);
      const jobs = await Job.find({ company: companyId }).select("_id").lean();
      const jobIds = jobs.map(j => j._id);

      await Promise.all([
        Job.deleteMany({ company: companyId }),
        jobIds.length > 0 ? Application.deleteMany({ job: { $in: jobIds } }) : Promise.resolve(),
        Recruiter.deleteMany({ _id: { $in: recruiterIds } }),
        deletedCompany.create({
          companyName: company.companyName,
          email: company.email,
          adminEmail: company.adminEmail,
          CIN: company.CIN,
          phone: company.phone,
        }),
      ]);

      await Promise.all([
        Company.findByIdAndDelete(companyId),
        CandidateSubscription.findOneAndDelete({ company: companyId }),
        JobSubscription.findOneAndDelete({ company: companyId }),
      ]);

      if (!admin) {
        return res.status(200).cookie("token", "", { maxAge: 0, httpsOnly: true, sameSite: "lax" })
          .json({ success: true, message: "Company deleted successfully" });

//         return res
//           .status(200)
//           .cookie("token", "", {
//             maxAge: 0,
//             httpOnly: true,
//             sameSite: "lax",
//           })
//           .json({
//             success: true,
//             message: "Company deleted successfully",
//           });
//       } else {
//         return res.status(200).json({
//           success: true,
//           message: "Company deleted successfully",
//         });
// >>>>>>> e5c8431189ec89ae57f2ab2ea0a67b1e9d2fbfdd
//       }
      return res.status(200).json({ success: true, message: "Company deleted successfully" });
    } else {
      const jobs = await Job.find({ created_by: userId }).select("_id").lean();
      const jobIds = jobs.map(j => j._id);

      await Promise.all([
        Company.findByIdAndUpdate(companyId, { $pull: { userId: { user: userId } } }),
        Recruiter.findByIdAndDelete(userId),
        Job.deleteMany({ created_by: userId }),
        jobIds.length > 0 ? Application.deleteMany({ job: { $in: jobIds } }) : Promise.resolve(),
      ]);

      return res.status(200).json({ success: true, message: "Recruiter removed" });
    }
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const toggleBlock = async (req, res) => {
  const { recruiterId, companyId, isBlocked } = req.body;
  const userId = req.id;

  try {
    const [admin, recruiter, company] = await Promise.all([
      Admin.findById(userId).select("_id").lean(),
      Recruiter.findById(recruiterId).select("_id emailId isBlocked"),
      Company.findById(companyId).select("userId adminEmail companyName email CIN").lean(),
    ]);

    if (!recruiter) return res.status(404).json({ success: false, message: "Recruiter not found" });
    if (!company || !company.userId.some((u) => u.user.toString() === recruiterId)) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    if (!admin) {
      const belongs = company.userId.some(u => u.user.toString() === userId);
      const callerActive = belongs
        ? (await Recruiter.findById(userId).select("isActive").lean())?.isActive
        : false;
      if (!belongs || !callerActive) {
        return res.status(403).json({ success: false, message: "You are not authorized" });
      }
    }

    recruiter.isBlocked = isBlocked;
    await recruiter.save();

    const recruiterIds = company.userId.map(u => u.user);

    if (isBlocked) {
      const blacklistQuery = company.CIN
        ? { CIN: company.CIN }
        : { companyName: company.companyName };
      const [existing] = await Promise.all([
        BlacklistedCompany.findOne(blacklistQuery).select("_id").lean(),
      ]);
      await Promise.all([
        existing ? Promise.resolve() : BlacklistedCompany.create({
          companyName: company.companyName, email: company.email,
          adminEmail: company.adminEmail, CIN: company.CIN || null,
        }),
        Recruiter.updateMany({ _id: { $in: recruiterIds } }, { $set: { isActive: false } }),
      ]);
    } else {
      await Promise.all([
        company.CIN
          ? BlacklistedCompany.deleteOne({ CIN: company.CIN })
          : BlacklistedCompany.deleteOne({ companyName: company.companyName }),
        Recruiter.updateMany({ _id: { $in: recruiterIds } }, { $set: { isActive: true } }),
      ]);
    }

    res.status(200).json({
      success: true,
      message: `Recruiter ${isBlocked ? "blocked and company blacklisted" : "unblocked and company removed from blacklist"} successfully`,
    });
  } catch (err) {
    console.error("Error toggling recruiter block status:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};



// change the status of recruiter
export const toggleActive = async (req, res) => {
  const { recruiterId, companyId, isActive } = req.body;
  const userId = req.id;

  try {
    // Run admin check + fetch company + fetch recruiter in parallel
    const [admin, company, recruiter] = await Promise.all([
      Admin.findById(userId).select("_id").lean(),
      Company.findById(companyId).select("userId adminEmail").lean(),
      Recruiter.findById(recruiterId).select("emailId isActive").lean(),
    ]);

    if (!company) return res.status(404).json({ message: "Company not found", success: false });
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found", success: false });

    if (!admin) {
      const belongs = company.userId.some(u => u.user.toString() === userId);
      const isRecruiterActive = (await Recruiter.findById(userId).select("isActive").lean())?.isActive;
      if (!belongs || !isRecruiterActive) {
        return res.status(403).json({ message: "You are not authorized", success: false });
      }
    }

    const recruiterIds = company.userId.map((u) => u.user);

    if (recruiter.emailId.email === company.adminEmail) {
      await Promise.all([
        Recruiter.updateMany({ _id: { $in: recruiterIds } }, { isActive }),
        Job.updateMany({ created_by: { $in: recruiterIds } }, { isActive }),
      ]);
    } else {
      await Recruiter.findByIdAndUpdate(recruiterId, { isActive });
    }

    res.status(200).json({ message: "Recruiter status updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const hasCreatedCompany = async (req, res) => {
  // try {
  //   const recruiterId = req.id;

  //   const company = await Company.findOne({ "userId.user": recruiterId });


  //   if (company) {

  //     return res.status(200).json({ companyExists: true });
  //   } else {
  //     return res.status(200).json({ companyExists: false });
  //   }
  // } catch (error) {
  //   console.error("Error checking company existence:", error);
  //   return res.status(500).json({
  //     companyExists: false,
  //     message: "Server error",
  //   });



  try {
    // ⚡ हमेशा companyExists true भेजेंगे, चाहे DB में हो या ना हो
    return res.status(200).json({ companyExists: true });
  } catch (error) {
    console.error("Error checking company existence:", error);
    return res.status(500).json({
      companyExists: true, // 🔴 Error होने पर भी true भेजेंगे
      message: "Server error",
    });
  }
};


