// this package help to encrypt the password
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
// this package help to create token and provide user authentication by token
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import Job from "../models/job.model.js";
import { createUniqueReferralCode } from "../utils/referralCode.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Admin } from "../models/admin/admin.model.js";
import { DigitalMarketer } from "../models/digitalmarketer.model.js";
import { Contact } from "../models/contact.model.js";
import { findModelByEmail, normalizeAccountEmail } from "../utils/accountEmail.js";
// this model help to blacklist recent logout token
import { BlacklistToken } from "../models/blacklistedtoken.model.js";
import { sendForgotPasswordEmail } from "../services/forgotPassword.service.js";

import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
// help in google login
import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";
// this one give us validationResult when req object will validate by express-validator
import { validationResult } from "express-validator";
// help in send email
import nodemailer from "nodemailer";
import { Application } from "../models/application.model.js";
import notificationService from "../utils/notificationService.js";
import { autoApplyExistingJobsForUser, autoApply as autoApplyService } from "../src/services/autoApply.service.js";

// this controller help in user registration
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || "Invalid input.",
        errors: errors.array(),
      });
    }

    const { fullname, phoneNumber, password, inputReferralCode, collegeName, rollNo, cgpa, stream, hometown } = req.body;
    const email = normalizeAccountEmail(req.body.email);

    // Validate fullname
    if (!fullname || fullname.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters long.",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. It must be 10 digits starting with 6–9.",
      });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check existing email
    const existingEmail =
      (await findModelByEmail(User, email)) ||
      (await findModelByEmail(Recruiter, email)) ||
      (await findModelByEmail(Admin, email));
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already used by someone",
      });
    }

    // Check existing phone number
    const existingPhone = await User.findOne({
      "phoneNumber.number": phoneNumber,
    });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "This phone number is already used by someone",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique referral code for new user
    const referralCode = await createUniqueReferralCode();

    // Link referrer if valid inputReferralCode provided (check both User and Recruiter)
    let referredBy = null;
    if (inputReferralCode) {
      const referrer =
        (await User.findOne({ referralCode: inputReferralCode })) ||
        (await Recruiter.findOne({ referralCode: inputReferralCode }));
      if (referrer) {
        referredBy = referrer._id;
        // increment referralCount only on User referrers (recruiters don't have this field)
        if (referrer.role !== "recruiter") {
          const updatedReferrer = await User.findByIdAndUpdate(
            referrer._id,
            { $inc: { referralCount: 1 } },
            { new: true }
          );
          // At 25 referrals: boost profile + unlock recruiter contacts reward
          if (updatedReferrer && updatedReferrer.referralCount >= 25) {
            const updates = {};
            if (!updatedReferrer.isProfileBoosted) updates.isProfileBoosted = true;
            if (!updatedReferrer.referral25AchievedAt) updates.referral25AchievedAt = new Date();
            if (Object.keys(updates).length) {
              await User.findByIdAndUpdate(referrer._id, updates);
            }
          }
        }
      }
    }

    // Create new user
    const user = await User.create({
      fullname,
      emailId: { email },
      phoneNumber: { number: phoneNumber },
      password: hashedPassword,
      lastActiveAt: new Date(),
      referralCode,
      referredBy,
      collegeName: collegeName || "",
      rollNo: rollNo || "",
      cgpa: cgpa ? parseFloat(cgpa) : 0,
      stream: stream || "",
      hometown: hometown || "",
    });

    // Send welcome notification once, on account creation
    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role || "student",
        name: user.fullname,
      });
    } catch (notificationError) {
      console.error("Error sending welcome notification:", notificationError);
    }

    // Fetch user without password
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    // Create JWT token
    const tokenData = { userId: userWithoutPassword._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Send cookie + response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Account created successfully.",
        success: true,
        user: userWithoutPassword,
      });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//login section...
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    // check validation of email and password by express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const cleanEmail = normalizeAccountEmail(email);

    // Check across User, Recruiter, Admin, and DigitalMarketer
    let user =
      (await findModelByEmail(User, cleanEmail)) ||
      (await findModelByEmail(Recruiter, cleanEmail)) ||
      (await findModelByEmail(Admin, cleanEmail)) ||
      (await findModelByEmail(DigitalMarketer, cleanEmail));

    if (!user) {
      return res.status(200).json({
        message: "Account Not found.",
        success: false,
      });
    }

    if (!user.password) {
      return res.status(200).json({
        message: "No password set on this account. Please log in using Google or Phone OTP, or reset your password.",
        success: false,
      });
    }

    //checking/comparing the password is correct or not...
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Update lastActiveAt safely
    try {
      user.lastActiveAt = new Date();
      await user.save({ validateBeforeSave: false });
    } catch (saveErr) {
      console.warn("User save skipped on login:", saveErr.message);
    }

    notificationService.notifyWelcome({
      userId: user._id,
      userType: user.role,
      name: user.fullname,
    }).catch((err) => console.error("Error sending welcome notification:", err.message));

    const tokenData = {
      userId: user._id,
    };
    // generate the token using JWT 
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const isCompanyCreated = user.isCompanyCreated || false;
    const position = user.position || "";
    const isActive = user.isActive || null;

    //return user
    user = {
      _id: user._id,
      fullname: user.fullname,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      address: user.address,
      lastActiveAt: user.lastActiveAt,
      isFirstLogin: user.isFirstLogin,
      isCompanyCreated,
      position,
      isActive,
      referralCode: user.referralCode || null,
      referralCount: user.referralCount || 0,
      isProfileBoosted: user.isProfileBoosted || false,
    };

    // sending cookies from server to client with response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "An error occurred during login.",
      success: false,
    });
  }
};

// Job seeker specific login
export const jobseekerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const cleanEmail = normalizeAccountEmail(email);

    // Only search in User collection for job seekers
    let user = await findModelByEmail(User, cleanEmail);

    if (!user) {
      const recruiterAccount =
        (await findModelByEmail(Recruiter, cleanEmail)) ||
        (await findModelByEmail(Admin, cleanEmail));
      if (recruiterAccount) {
        return res.status(200).json({
          message: "This email is registered as a recruiter. Please use Recruiter Login.",
          success: false,
        });
      }
      return res.status(200).json({
        message: "Job seeker account not found. Please sign up or check the email you used while registering.",
        success: false,
      });
    }

    if (!user.password) {
      return res.status(200).json({
        message: "No password set on this account. Please log in using Google or Phone OTP, or reset your password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Track login activity without blocking authentication if the update fails
    try {
      user.lastActiveAt = new Date();
      await user.save({ validateBeforeSave: false });
    } catch (saveError) {
      console.warn("Login tracking save skipped:", saveError.message);
    }

    try {
      const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "";
      const device = req.headers["user-agent"]?.slice(0, 200) || "";
      await User.findByIdAndUpdate(user._id, {
        $push: { loginHistory: { $each: [{ timestamp: new Date(), ip, device }], $slice: -50 } },
      });
    } catch (historyError) {
      console.warn("Login history update skipped:", historyError.message);
    }

    notificationService.notifyWelcome({
      userId: user._id,
      userType: user.role,
      name: user.fullname,
    }).catch((err) => console.error("Error sending welcome notification:", err.message));

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      address: user.address,
      lastActiveAt: user.lastActiveAt,
      isFirstLogin: user.isFirstLogin,
      referralCode: user.referralCode || null,
      referralCount: user.referralCount || 0,
      isProfileBoosted: user.isProfileBoosted || false,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("Job seeker login error:", error);
    return res.status(500).json({
      message: "An error occurred during login.",
      success: false,
    });
  }
};

// Recruiter specific login
export const recruiterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const cleanEmail = normalizeAccountEmail(email);

    // Search in Recruiter and Admin collections for recruiters
    let user =
      (await findModelByEmail(Recruiter, cleanEmail)) ||
      (await findModelByEmail(Admin, cleanEmail));

    if (!user) {
      const jobseekerAccount = await findModelByEmail(User, cleanEmail);
      if (jobseekerAccount) {
        return res.status(200).json({
          message: "This email is registered as a job seeker. Please use Jobseeker Login.",
          success: false,
        });
      }
      return res.status(200).json({
        message: "Recruiter account not found. Please sign up or check the email you used while registering.",
        success: false,
      });
    }

    if (!user.password) {
      return res.status(200).json({
        message: "No password set on this account. Please log in using Google or Phone OTP, or reset your password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Set login tracking and reset email flag for new session
    user.isRecruiterLoggedIn = true;
    user.lastLoginTime = new Date();
    user.reminderEmailSent = false;
    // Safety net: generate referral code if missing
    if (!user.referralCode) {
      user.referralCode = await createUniqueReferralCode();
    }

    // Notify on every login
    await user.save();

    notificationService.notifyWelcome({
      userId: user._id,
      userType: user.role,
      name: user.fullname,
    }).catch((err) => console.error("Error sending welcome notification:", err.message));

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const isCompanyCreated = user.isCompanyCreated || false;
    const position = user.position || "";
    const isActive = user.isActive || null;

    user = {
      _id: user._id,
      fullname: user.fullname,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      lastActiveAt: user.lastActiveAt,
      isFirstLogin: user.isFirstLogin,
      isCompanyCreated,
      position,
      isActive,
      plan: user.plan || "FREE",
      subscriptionStatus: user.subscriptionStatus || "INACTIVE",
      remainingJobPosts: user.remainingJobPosts || 0,
      referralCode: user.referralCode || null,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("Recruiter login error:", error);
    return res.status(500).json({
      message: "An error occurred during login.",
      success: false,
    });
  }
};

// login by google
export const googleLogin = async (req, res) => {
  try {
    // this code from frontend which is given by google during google login
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
      (await User.findOne({ "emailId.email": googleUser.email }).select(
        "-password"
      )) ||
      (await Recruiter.findOne({ "emailId.email": googleUser.email }).select(
        "-password"
      )) ||
      (await Admin.findOne({ "emailId.email": googleUser.email }).select(
        "-password"
      ));

    if (user) {
      if (role && role !== user.role) {
        res.status(200).json({
          message: "Account already exist!",
          success: false,
        });
      }

      // Update lastActiveAt for existing users; notify on every login
      await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            lastActiveAt: new Date(),
          },
        },
        { new: true }
      );

      notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role,
        name: user.fullname,
      }).catch((err) => console.error("Error sending welcome notification:", err.message));

      const tokenData = {
        userId: user._id,
      };
      // generating token with jwt sign with 1 day expiry time
      const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      // return cookies with response
      return res
        .status(200)
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
        })
        .json({
          message: `Welcome back ${user.fullname}`,
          user,
          success: true,
        });
    }

    if (!role) role = "student";

    // If user doesn't exist, create a new one
    const newReferralCode = await createUniqueReferralCode();
    user = new User({
      fullname: googleUser.name || googleUser.given_name || "No Name",
      emailId: {
        email: googleUser.email,
        isVerified: true,
      },
      phoneNumber: {
        number: "",
        isVerified: false,
      },
      password: "",
      role: role,
      profile: {
        profilePhoto: googleUser.picture || "",
      },
      referralCode: newReferralCode,
    });

    await user.save();

    // Send welcome notification once, for newly created Google user
    try {
      await notificationService.notifyWelcome({
        userId: user._id,
        userType: user.role,
        name: user.fullname,
      });
    } catch (notificationError) {
      console.error("Error sending welcome notification:", notificationError);
    }

    const tokenData = {
      userId: user._id,
    };
    // generating token with jwt sign with 1 day expiry time
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    // return cookies with response
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
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

// Logout Section

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (token) {
      try {
        // Decode the token to get user ID
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        Promise.all([
          User.findByIdAndUpdate(userId, { $set: { lastActiveAt: new Date() } }).catch(() => {}),
          Recruiter.findByIdAndUpdate(userId, { $set: { lastActiveAt: new Date() } }).catch(() => {})
        ]).catch(() => {});

        BlacklistToken.updateOne(
          { token },
          { $setOnInsert: { token } },
          { upsert: true }
        ).catch(() => {});
      } catch (tokenError) {
        console.error("Token processing error (non-blocking):", tokenError.message);
      }
    }

    // Clear cookie and return success immediately
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    // Even if there's an error, clear the cookie and return success
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  }
};


// for uploading services
export const uploadResumeToCloudinary = async (fileBuffer, fileName) => {
  try {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          public_id: fileName,
          folder: "resumes",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Error uploading resume to Cloudinary");
  }
};

//this controller  update the profile of user
export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      alternatePhone,
      city,
      state,
      country,
      pincode,
      gender,
      qualification,
      otherQualification,
      category,
      language,
      bio,
      skills,
      documents,
      autoApply,
    } = req.body;
    console.log(req.body);
    const { profilePhoto, resume } = req.files || {}; // Access files from req.files
    //console.log(req.files);
    const userId = req.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing in the request.",
        success: false,
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // finding the user by userId
    let user = await User.findById(userId);

    // if not user return user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Initialize nested objects if missing
    if (!user.profile) user.profile = {};
    if (!user.address) user.address = {};
    if (!user.emailId) user.emailId = { email: "", isVerified: false };
    if (!user.phoneNumber) user.phoneNumber = { number: "", isVerified: false };
    if (!user.alternatePhone) user.alternatePhone = { number: "", isVerified: false };

    // Normalize documents — frontend sends as 'documents[]' in FormData
    const rawDocs =
      req.body["documents[]"] ||
      req.body["profile[documents][]"] ||
      documents;
    if (rawDocs) {
      user.profile.documents = Array.isArray(rawDocs) ? rawDocs : [rawDocs];
    }

    // Upload profile photo if provided
    if (profilePhoto && profilePhoto.length > 0) {
      // fetching data uri of file
      const fileUri = getDataUri(profilePhoto[0]);
      // upload file to cloudnary
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      // set cloudResponse.secure_url to user profile photo
      user.profile.profilePhoto = cloudResponse.secure_url;
    }

    // Upload resume if provided
    if (resume && resume.length > 0) {
      console.log("Uploading resume:", resume[0].originalname);

      try {
        // ✅ Upload resume to Cloudinary using the function
        const cloudResponse = await uploadResumeToCloudinary(
          resume[0].buffer,
          resume[0].originalname
        );

        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = resume[0].originalname;
      } catch (error) {
        console.error("Resume Upload Error:", error);
        return res.status(500).json({
          message: "Failed to upload resume.",
          success: false,
        });
      }
    }


    // checking is skillsArray is array by Array.isArray(variable)
    const skillsArray = Array.isArray(skills)
      ? skills
      : skills?.split(",").map((skill) => skill.trim()) || [];

    if (fullname && user.fullname !== fullname) user.fullname = fullname;

    if (!user.address) user.address = {};
    if (city) user.address.city = city;
    if (state) user.address.state = state;
    if (country) user.address.country = country;
    if (pincode) user.address.pincode = pincode;

    // Updating gender 
    if (gender && user.profile.gender !== gender) user.profile.gender = gender;

    if (autoApply !== undefined) {
  user.profile.autoApply =
    autoApply === true ||
    autoApply === "true" ||
    autoApply === 1 ||
    autoApply === "1";
  console.log("AUTO APPLY RECEIVED:", autoApply);
  console.log("AUTO APPLY SAVED VALUE:", user.profile.autoApply);
}



    // Updating qualification + otherQualification
    if (qualification && user.profile.qualification !== qualification) {
      user.profile.qualification = qualification;

      if (qualification === "Others") {
        // Save the additional text field
        user.profile.otherQualification = otherQualification || "";
      } else {
        // Clear it if not "Others"
        user.profile.otherQualification = "";
      }
    }

    // ✅ Robustly normalize category into an array
    let categoryArray = [];
    if (Array.isArray(category)) {
      categoryArray = category;
    } else if (typeof category === "string") {
      // could be "Education" (single), "Education,Manufacturing", or '["Education","Manufacturing"]'
      try {
        const parsed = JSON.parse(category);
        if (Array.isArray(parsed)) {
          categoryArray = parsed;
        } else if (parsed) {
          categoryArray = String(parsed).split(",").map((c) => c.trim()).filter(Boolean);
        }
      } catch {
        categoryArray = category.split(",").map((c) => c.trim()).filter(Boolean);
      }
    }
    if (categoryArray.length > 0) {
      user.profile.category = categoryArray;
    }

    // ✅ Robustly normalize category into an array
    let languageArray = [];
    if (Array.isArray(language)) {
      languageArray = language;
    } else if (typeof language === "string") {
      try {
        const parsed = JSON.parse(language);
        if (Array.isArray(parsed)) {
          languageArray = parsed;
        } else if (parsed) {
          languageArray = String(parsed).split(",").map((c) => c.trim()).filter(Boolean);
        }
      } catch {
        languageArray = language.split(",").map((c) => c.trim()).filter(Boolean);
      }
    }
    if (languageArray.length > 0) {
      user.profile.language = languageArray;
    }

    if (email && user.emailId.email !== email) {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ "emailId.email": email });

      if (existingUser) {
        return res.status(401).json({
          message: "Email already exist!",
          success: false,
        });
      }

      // If the email does not exist, update it
      user.emailId.email = email;
      user.emailId.isVerified = false;
    }
    if (phoneNumber && user.phoneNumber.number !== phoneNumber) {
      user.phoneNumber.number = phoneNumber;
      user.phoneNumber.isVerified = false;
    }
    // Alternate phone update
    if (alternatePhone && user.alternatePhone.number !== alternatePhone) {
      user.alternatePhone.number = alternatePhone;
      user.alternatePhone.isVerified = false;
    }

    if (bio && user.profile.bio !== bio) user.profile.bio = bio;
    // ✅ Normalize experiences into an array
    let experiencesArray = [];
    if (req.body.experiences) {
      try {
        experiencesArray =
          typeof req.body.experiences === "string"
            ? JSON.parse(req.body.experiences)
            : req.body.experiences;
      } catch (err) {
        console.error("Error parsing experiences:", err);
        experiencesArray = [];
      }
    }

    // ✅ If Fresher (No experience selected)
    if (Array.isArray(experiencesArray) && experiencesArray.length === 0) {
      user.profile.experiences = []; // overwrite old experiences
    } else if (Array.isArray(experiencesArray) && experiencesArray.length > 0) {
      user.profile.experiences = experiencesArray;
    }

    if (skillsArray.length) user.profile.skills = skillsArray;

    // Referral reward: give recruiter +1 job post every 15 candidate profile completions
    if (user.referredBy && !user.referralRewardGiven) {
      const recruiter =
        (await Recruiter.findById(user.referredBy)) ||
        (await User.findById(user.referredBy));
      if (recruiter && recruiter.role === "recruiter") {
        recruiter.candidateReferralsCount = (recruiter.candidateReferralsCount || 0) + 1;
        if (recruiter.candidateReferralsCount >= 15) {
          recruiter.remainingJobPosts = (recruiter.remainingJobPosts || 0) + 1;
          recruiter.candidateReferralsCount = 0;
        }
        await recruiter.save();
        user.referralRewardGiven = true;
      }
    }

    // Mark as not first login after profile update
    user.isFirstLogin = false;

    await user.save();

    console.log(
  "AUTO APPLY AFTER SAVE:",
  user.profile.autoApply
);

if (user.profile.autoApply === true) {
  try {
    await autoApplyExistingJobsForUser(user._id);
    console.log("✅ Existing jobs Auto Apply completed");
  } catch (error) {
    console.error(
      "❌ Existing jobs Auto Apply failed:",
      error.message
    );
  }
}

    // extract user without password
    const updatedUser = await User.findById(userId).select("-password");
    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    console.error("Stack:", error.stack);
    return res.status(500).json({
      message: "An error occurred while updating the profile.",
      error: error.message,
      success: false,
    });
  }
};

// this controller send message from contact section of website
export const sendMessage = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, message } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // Set up transporter for sending email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Access from .env
        pass: process.env.EMAIL_PASS, // Access from .env
      },
    });

    // Define the email options
    const mailOptions = {
      from: email,
      to: "sanketbabde@greathire.in",
      subject: `Message from ${fullname}`,
      text: `${message}\nContact: ${phoneNumber}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    await Contact.create({
      name: fullname,
      email,
      phoneNumber,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "our team will be in touch with you soon!",
    });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the message.",
    });
  }
};

// this controller use when user forgot the password
export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    const cleanEmail = normalizeAccountEmail(email);
    let user = null;
    let resolvedRole = role;

    if (role === "recruiter") {
      user = await findModelByEmail(Recruiter, cleanEmail);
    } else if (role === "student" || role === "user") {
      user = await findModelByEmail(User, cleanEmail);
    } else if (role === "admin") {
      user = await findModelByEmail(Admin, cleanEmail);
    }

    if (!user) {
      const [studentAccount, recruiterAccount, adminAccount, marketerAccount] = await Promise.all([
        findModelByEmail(User, cleanEmail),
        findModelByEmail(Recruiter, cleanEmail),
        findModelByEmail(Admin, cleanEmail),
        findModelByEmail(DigitalMarketer, cleanEmail),
      ]);

      // Prioritize candidate (student) accounts first, then recruiter
      const foundAccounts = [
        { doc: studentAccount, role: "student" },
        { doc: recruiterAccount, role: "recruiter" },
        { doc: marketerAccount, role: "digital_marketer" },
        { doc: adminAccount, role: "admin" },
      ].filter((item) => item.doc);

      const genericWords = new Set([
        "user", "test", "testing", "tester", "new", "admin", "recruiter",
        "student", "candidate", "jobseeker", "job", "seeker", "null",
        "undefined", "company", "compony", "hr", "demo", "account", "profile", "na", "none"
      ]);

      if (foundAccounts.length > 0) {
        // Find best match that has a meaningful human name
        const best = foundAccounts.find((item) => {
          const n = (item.doc.fullname || item.doc.fullName || item.doc.name || "").trim().toLowerCase();
          return n && n.length > 1 && !genericWords.has(n) && !n.startsWith("test ") && !n.endsWith(" test");
        }) || foundAccounts[0];

        user = best.doc;
        resolvedRole = best.role;
      }
    }

    if (!user) {
      return res.status(200).json({
        message: "User not found with this email.",
        success: false,
      });
    }

    // Resolve a clean, human-friendly full name
    const genericWords = new Set([
      "user", "test", "testing", "tester", "new", "admin", "recruiter",
      "student", "candidate", "jobseeker", "job", "seeker", "null",
      "undefined", "company", "compony", "hr", "demo", "account", "profile", "na", "none"
    ]);

    let userName = "";
    const candidateNames = [
      user.fullname,
      user.fullName,
      user.name,
      user.username,
      user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ""}` : null,
    ];

    for (let raw of candidateNames) {
      if (typeof raw !== "string" || !raw.trim()) continue;
      // Strip trailing digits (e.g. "Sravan Pilla 2" -> "Sravan Pilla")
      let cleaned = raw.trim().replace(/\s*\d+$/, "").replace(/[0-9_#$@!%^&*()+=~`<>?/:;{}[\]|\\"]+/g, " ").trim();
      const words = cleaned.split(/\s+/).filter(Boolean);
      const meaningful = words.filter((w) => !genericWords.has(w.toLowerCase()));

      if (meaningful.length > 0) {
        userName = meaningful
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
        break;
      }
    }

    // Fallback: If no good name in database, extract clean name from email prefix without digits (e.g. sravanpilla1809 -> Sravan Pilla)
    if (!userName) {
      const emailPrefix = cleanEmail.split("@")[0] || "";
      const alphaPrefix = emailPrefix.replace(/\d+/g, "");
      const parts = alphaPrefix.split(/[._\-+]+/).filter((w) => w.length >= 2 && !genericWords.has(w.toLowerCase()));
      if (parts.length > 0) {
        userName = parts
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");
      }
    }

    // Expiry from env or default 1 hour
    const tokenExpiry = process.env.FORGOT_PASSWORD_TOKEN_EXPIRY || "1h";

    // Create a secure token with user identification
    const resetToken = jwt.sign(
      { userId: String(user._id), email: cleanEmail, role: resolvedRole || user.role || "user" },
      process.env.SECRET_KEY,
      { expiresIn: tokenExpiry }
    );

    const frontendBase = (process.env.FRONTEND_URL || "https://greathire.in")
      .replace(/^["']|["']$/g, "")
      .trim()
      .replace(/\/+$/, "") || "https://greathire.in";
    const resetURL = `${frontendBase}/reset-password/${resetToken}`;

    // Send reset email via dedicated Forgot Password email service
    await sendForgotPasswordEmail({
      toEmail: cleanEmail,
      userName,
      resetToken,
      resetURL,
    });

    return res.status(200).json({
      message: "Password reset link sent successfully. Please check your email inbox.",
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in forgotPassword controller:", error);
    res.status(500).json({
      message: error.message || "An error occurred while sending the reset link. Please try again later.",
      success: false,
    });
  }
};

// this controller reset the password of user
export const resetPassword = async (req, res) => {
  try {
    const { decoded, token, newPassword } = req.body;

    // Validate password type and length immediately
    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
        success: false,
      });
    }

    // Resolve userId and email either from decoded object or from raw token
    let userId = decoded?.userId;
    let userEmail = decoded?.email;

    if (token) {
      try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        if (verified) {
          userId = userId || verified.userId;
          userEmail = userEmail || verified.email;
        }
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(400).json({
            message: "This password reset link has expired. Please request a new link.",
            success: false,
          });
        }
        return res.status(400).json({
          message: "Reset token is invalid. Please request a new link.",
          success: false,
        });
      }
    }

    if (!userId && !userEmail) {
      return res.status(400).json({
        message: "Invalid reset session. Please request a new password reset link.",
        success: false,
      });
    }

    let user = null;

    // 1. Try finding by ObjectId if valid
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      user =
        (await User.findById(userId)) ||
        (await Recruiter.findById(userId)) ||
        (await Admin.findById(userId)) ||
        (await DigitalMarketer.findById(userId));
    }

    // 2. Fallback to email query if user was not found by ID
    if (!user && userEmail) {
      const emailQuery = { $regex: new RegExp(`^${userEmail.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") };
      user =
        (await User.findOne({ "emailId.email": emailQuery })) ||
        (await Recruiter.findOne({ "emailId.email": emailQuery })) ||
        (await Admin.findOne({ "emailId.email": emailQuery })) ||
        (await DigitalMarketer.findOne({ "emailId.email": emailQuery }));
    }

    if (!user) {
      return res.status(404).json({
        message: "User account not found. Please request a new reset link.",
        success: false,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password using direct update to prevent unrelated schema validation issues
    await user.constructor.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

    return res.status(200).json({
      message: "Password reset successfully. You can now log in with your new password.",
      success: true,
    });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    return res.status(500).json({
      message: error.message || "Failed to reset password. Please try again.",
      success: false,
    });
  }
};

// deleting account of user by self or admin
export const deleteAccount = async (req, res) => {
  const { email } = req.body;
  const userId = req.id; // Logged-in user ID
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({
        message: "Email is required to delete an account.",
        success: false,
      });
    }

    // test the  email is valid or not
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid Email.",
        success: false,
      });
    }

    // Check if the user exists
    const user = await User.findOne({ "emailId.email": email });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Check if the logged-in user is either an Admin or the user themselves
    const admin = await Admin.findById(userId);
    const isSelf = user._id.toString() === userId;

    // either amdin can delete account of user or user can delete own account
    if (!admin && !isSelf) {
      return res.status(403).json({
        message: "You are not authorized to delete this account.",
        success: false,
      });
    }

    // Remove all applications associated with the user
    await Application.deleteMany({ applicant: user._id });

    // Delete the user
    await User.findOneAndDelete({ "emailId.email": email });

    // If the user is deleting their own account, remove their token
    if (isSelf) {
      return res
        .status(200)
        .cookie("token", "", {
          maxAge: 0,
          httpOnly: true,
          sameSite: "strict",
        })
        .json({
          message: "Your account has been deleted successfully.",
          success: true,
        });
    }

    // If an admin deletes another user's account, just send a success response
    return res.status(200).json({
      message: "User account deleted successfully.",
      success: true,
    });
  } catch (err) {
    console.error("Error in deleteAccount:", err);

    return res.status(500).json({
      message: "An error occurred while deleting the account.",
      error: err.message,
      success: false,
    });
  }
};
// ---------------- OTP LOGIN ----------------

// Step 1: Send OTP to email
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    let user =
      (await findModelByEmail(User, email)) ||
      (await findModelByEmail(Recruiter, email)) ||
      (await findModelByEmail(Admin, email));

    if (!user) {
      return res.status(200).json({ success: false, message: "User not found" });
    }

    //  Check if OTP already exists and not expired
    if (user.emailId.otp && Date.now() < user.emailId.otpExpiry) {
      const remainingTime = Math.ceil((user.emailId.otpExpiry - Date.now()) / 1000); // in sec
      return res.status(400).json({
        success: false,
        message: `OTP already sent. Please wait ${remainingTime} seconds before resending.`,
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry (5 min)
    user.emailId.otp = otp;
    user.emailId.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"GreatHire OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Login",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
      
      <h2 style="color: #1d4ed8; text-align: center;">Your Secure OTP for GreatHire Login</h2>
      
      <p style="font-size: 16px; color: #555;">Hi there,</p>
      
      <p style="font-size: 16px; color: #555;">
        We’re glad to have you at <strong>GreatHire</strong>! Use the One-Time Password (OTP) below to access your account:
      </p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; color: #1d4ed8; font-weight: bold; border: 2px dashed #1d4ed8; padding: 10px 20px; border-radius: 8px;">
          ${otp}
        </span>
      </div>
      
      <p style="font-size: 16px; color: #555;">
        This code will <strong>expire in 5 minutes</strong>. Please keep it confidential to protect your account.
      </p>
      
      <p style="font-size: 16px; color: #555;">
       If you did not request for this OTP, please contact our support team at <a href="mailto:hr@babde.tech?subject=">hr@babde.tech</a> immediately.
      </p>
      
      <br>
      <p style="font-size: 16px; color: #555;">
        Warm regards,<br><strong>GreatHire Support Team</strong>
      </p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eaeaea;" />
      
      <p style="font-size: 14px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} GreatHire. All rights reserved.
      </p>
    </div>
  `,
});

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. It will expire in 5 minutes.",
    });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Step 2: Verify OTP (Original function - kept for backward compatibility)
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    let user =
      (await findModelByEmail(User, email)) ||
      (await findModelByEmail(Recruiter, email)) ||
      (await findModelByEmail(Admin, email));

    if (!user || !user.emailId.otp) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (user.emailId.otp !== otp || Date.now() > user.emailId.otpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.emailId.otp = null;
    user.emailId.otpExpiry = null;

    // Notify on every login, for both job seekers and recruiters
    await user.save();

    notificationService.notifyWelcome({
      userId: user._id,
      userType: user.role,
      name: user.fullname,
    }).catch((err) => console.error("Error sending welcome notification:", err.message));

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome ${user.fullname}`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          emailId: user.emailId,
          role: user.role,
          referralCode: user.referralCode || null,
          referralCount: user.referralCount || 0,
          isProfileBoosted: user.isProfileBoosted || false,
        },
      });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Step 2: Verify OTP for Job Seekers
export const verifyJobseekerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Only search in User collection
    let user = await findModelByEmail(User, email);

    if (!user || !user.emailId.otp) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (user.emailId.otp !== otp || Date.now() > user.emailId.otpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.emailId.otp = null;
    user.emailId.otpExpiry = null;

    // Notify on every login
    await user.save();

    notificationService.notifyWelcome({
      userId: user._id,
      userType: user.role,
      name: user.fullname,
    }).catch((err) => console.error("Error sending welcome notification:", err.message));

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome ${user.fullname}`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          emailId: user.emailId,
          role: user.role,
          referralCode: user.referralCode || null,
          referralCount: user.referralCount || 0,
          isProfileBoosted: user.isProfileBoosted || false,
        },
      });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Step 2: Verify OTP for Recruiters
export const verifyRecruiterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Only search in Recruiter collection
    let user = await findModelByEmail(Recruiter, email);

    if (!user || !user.emailId.otp) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    if (user.emailId.otp !== otp || Date.now() > user.emailId.otpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.emailId.otp = null;
    user.emailId.otpExpiry = null;

    // Notify on every login
    await user.save();

    notificationService.notifyWelcome({
      userId: user._id,
      userType: user.role,
      name: user.fullname,
    }).catch((err) => console.error("Error sending welcome notification:", err.message));

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome ${user.fullname}`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          emailId: user.emailId,
          role: user.role,
          plan: user.plan || "FREE",
          subscriptionStatus: user.subscriptionStatus || "INACTIVE",
          remainingJobPosts: user.remainingJobPosts || 0,
          referralCode: user.referralCode || null,
        },
      });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("loginHistory");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, loginHistory: (user.loginHistory || []).reverse() });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user =
      (await User.findById(req.id).select("-password")) ||
      (await Recruiter.findById(req.id).select("-password"));
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUserLanguages = async (req, res) => {
  const { languages } = req.body;

  if (!Array.isArray(languages)) {
    return res.status(400).json({ error: "Languages must be an array of strings." });
  }

  // Sanitize: Trim, capitalize first letter, and remove empty strings
  const cleanLanguages = languages
    .map(lang => {
      if (typeof lang !== "string") return null;
      const trimmed = lang.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase(); // Capitalize
    })
    .filter(lang => lang && lang.length > 0);

  try {
    const user = await User.findByIdAndUpdate(
      // req.user._id,
       req.id,
      { "profile.languages": cleanLanguages.length ? cleanLanguages : ["Not Specified"] },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "Languages updated successfully.", languages: user.profile.languages });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};