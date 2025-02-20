import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Admin } from "../models/admin/admin.model.js";
import { Contact } from "../models/contact.model.js";
import { BlacklistToken } from "../models/blacklistedtoken.model.js";

import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";
import { validationResult } from "express-validator";

import nodemailer from "nodemailer";
import { Application } from "../models/application.model.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    let userExists =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (userExists) {
      return res.status(200).json({
        message: "Account already exists.",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    let newUser = await User.create({
      fullname,
      emailId: {
        email, // Setting the email
        isVerified: false, // Default to false unless you have a value to set
      },
      phoneNumber: {
        number: phoneNumber, // Setting the phone number
        isVerified: false, // Default to false unless you have a value to set
      },
      password: hashedPassword,
    });

    // Remove sensitive information before sending the response
    const userWithoutPassword = await User.findById(newUser._id).select(
      "-password"
    );

    const tokenData = {
      userId: userWithoutPassword._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // cookies strict used...
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
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
    //check mail is correct or not...
    let user =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({
        "emailId.email": email,
      }));

    if (!user) {
      return res.status(200).json({
        message: "Account Not found.",
        success: false,
      });
    }

    //checking password is correct or not...
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(200).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
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
      isCompanyCreated,
      position,
      isActive,
    };

    // cookies strict used...
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// login by google
export const googleLogin = async (req, res) => {
  try {
    const { code, role } = req.body;

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
          httpsOnly: true,
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
    user = new User({
      fullname: googleUser.name || googleUser.given_name || "No Name",
      emailId: {
        email: googleUser.email, // Set email from Google user data
        isVerified: true, // Google-authenticated users are usually verified
      },
      phoneNumber: {
        number: "", // No phone number provided by Google
        isVerified: false, // Default to false since no phone verification
      },
      password: "", // No password for Google-authenticated users
      role: role, // Use the provided role
      profile: {
        profilePhoto: googleUser.picture || "",
      },
    });

    await user.save();

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
        httpsOnly: true,
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
    await BlacklistToken.create({ token });
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "An error occurred during logout. Please try again later.",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      city,
      state,
      country,
      experience,
      jobProfile,
      companyName,
      currentCTC,
      expectedCTC,
      experienceDetails,
      bio,
      skills,
    } = req.body;

    const { profilePhoto, resume } = req.files; // Access files from req.files
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

    let user = await User.findById(userId);

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

    // Upload resume if provided
    if (resume && resume.length > 0) {
      const fileUri = getDataUri(resume[0]);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = resume[0].originalname;
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : skills?.split(",").map((skill) => skill.trim()) || [];

    if (fullname && user.fullname !== fullname) user.fullname = fullname;

    if (city) user.address.city = city;
    if (state) user.address.state = state;
    if (country) user.address.country = country;

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
    if (bio && user.profile.bio !== bio) user.profile.bio = bio;
    if (experience) {
      user.profile.experience = {
        ...user.profile.experience,
        duration: experience,
      };
    }
    if (jobProfile) {
      user.profile.experience = {
        ...user.profile.experience,
        jobProfile,
      };
    }
    if (companyName) {
      user.profile.experience = {
        ...user.profile.experience,
        companyName,
      };
    }

    if (experienceDetails) {
      user.profile.experience = {
        ...user.profile.experience,
        experienceDetails,
      };
    }

    if (currentCTC) user.profile.currentCTC = currentCTC;
    if (expectedCTC) user.profile.expectedCTC = expectedCTC;
    if (skillsArray.length) user.profile.skills = skillsArray;

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let user =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (!user) {
      return res.status(200).json({
        message: "User not found with this email.",
        success: false,
      });
    }

    // Create a token with a 5-minute expiry
    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });

    // Generate reset URL
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or your email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: `"GreatHire Support" <${process.env.SUPPORT_EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 30px; max-width: 600px; margin: auto; border-radius: 10px; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2>Great<span style="color: #1D4ED8;">Hire</span></h2>
            <p style="color: #555;">Connecting Skills with Opportunity - Your Next Great Hire Awaits!</p>
          </div>
    
          <h3 style="color: #333;">Hi ${user.fullname},</h3>
          <p style="color: #555;">We received a request to reset your password. If you made this request, please click the button below to reset your password:</p>
    
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetURL}" target="_blank" style="background-color: #1D4ED8; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px;">
              Reset Password
            </a>
          </div>
    
          <p style="color: #555;">
            Please note: This link will expire in 5 minutes. If you didn’t request this reset, you can ignore this email.
          </p>
    
          <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="font-size: 14px; color: #888;">If you need help, feel free to reach out to our support team.</p>
          </div>
    
          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 14px; color: #aaa;">© ${new Date().getFullYear()} GreatHire. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Password reset link sent successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { decoded, newPassword } = req.body;

    let user =
      (await User.findById(decoded.userId)) ||
      (await Recruiter.findById(decoded.userId)) ||
      (await Admin.findById(decoded.userId));

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Validate password type and length
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be a string and at least 8 characters long.",
        success: false,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

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

    // check is email valid
    if (!emailRegex.test(email)) {
      console.log("gud");
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
