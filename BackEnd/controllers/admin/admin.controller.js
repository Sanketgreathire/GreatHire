import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import { Admin } from "../../models/admin/admin.model.js";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";

// Register new admin
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
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
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"GreatHire Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Admin Account Has Been Created",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2>Great<span style="color: #1D4ED8;">Hire</span></h2>
            <p style="color: #555;">Building Smart and Powerful Admin Teams</p>
          </div>
          <h3 style="color: #333;">Welcome to Great<span style="color: #1D4ED8;">Hire</span>, ${fullname}!</h3>
          <p style="color: #555;">
            We are excited to inform you that you have been added as a admin GreatHire. Below are your account details:
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
              <td style="padding: 10px; border: 1px solid #ddd;">Admin</td>
            </tr>
          </table>
          <h4 style="color: #1e90ff;">Your Login Credentials:</h4>
          <p style="font-weight: bold; color: #333;">Email: ${email}</p>
          <p style="font-weight: bold; color: #333;">Password: ${password}</p>
          <p style="color: #555;">
            Please log in to your account using the credentials above at the following link:
            <a href="${process.env.FRONTEND_URL}admin/login" style="color: #1e90ff; text-decoration: none;">GreatHire Login</a>
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

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await Admin.findOne({ "emailId.email": email });

    if (!user) {
      return res.status(200).json({
        message: "Account Not found.",
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

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userWithoutPassword = await Admin.findById(user._id).select(
      "-password"
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome ${user.fullname}`,
        user: userWithoutPassword,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Logout function
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
  return res.status(200).json({
    message: "Logged out successfully.",
    success: true,
  });
};

// Get admin list
export const getAdminList = async (req, res) => {
  try {
    const admins = await Admin.find({ role: "admin" });

    return res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error("Error retrieving admin list:", error);

    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Remove admin account
export const removeAccount = async (req, res) => {
  try {
    const adminId = req.id;
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const currentAdmin = await Admin.findById(adminId);
    if (!currentAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Admin not found" });
    }

    const deletedUser = await Admin.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Removed successfully." });
  } catch (error) {
    console.error("Error removing user account:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
