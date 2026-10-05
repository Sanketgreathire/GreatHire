import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import { Recruiter } from "../../models/recruiter.model.js";
import { Admin } from "../../models/admin/admin.model.js";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";

// this controller for creating new admin profie
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password } = req.body;
    console.log(req.body);
    // check validation of email and password by express-validator
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

    // Hash the password by running 10 times recursive hash algorithm
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await Admin.create({
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
                    <a href="${
                      process.env.FRONTEND_URL
                    }admin/login" style="color: #1e90ff; text-decoration: none;">GreatHire Login</a>
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
    // cookies strict used...
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
    //check mail is correct or not...
    let user = await Admin.findOne({ "emailId.email": email });

    if (!user) {
      return res.status(200).json({
        message: "Account not found.",
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

    // creating token data by user id
    const tokenData = {
      userId: user._id,
    };
    // create token by token data
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // hiding sensitive data like password
    const userWithoutPassword = await Admin.findById(user._id).select(
      "-password"
    );

    // cookies strict used...
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

// this contorller give the admin list to Owner
export const getAdminList = async (req, res) => {
  try {
    // Fetch all admin documents from the Admin collection. we select role as admin because in admin collection one document of Owner and we skip that document
    const admins = await Admin.find({ role: "admin" });

    // Return a success response with the list of admins
    return res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error("Error retrieving admin list:", error);

    // Return an error response if something goes wrong
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// this controller remove the account of admin by owner
export const removeAccount = async (req, res) => {
  try {
    // ID of the admin performing the deletion (assumed to be set in req.id)
    const adminId = req.id;
    const { userId } = req.params; // admin id

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    // Fetch the current admin from the database
    const currentAdmin = await Admin.findById(adminId);
    if (!currentAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Admin not found" });
    }

    // Find and delete the user (admin) by their ID
    const deletedUser = await Admin.findByIdAndDelete(userId);

    // If no user is found, return a 404 error
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Return a success response
    return res
      .status(200)
      .json({ success: true, message: "Removed successfully." });
  } catch (error) {
    console.error("Error removing user account:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update custom credits for a recruiter
// Update custom credits for a recruiter
// Update custom credits for a recruiter
export const updateRecruiterCredits = async (req, res) => {
  try {
    const {
      companyId,
      customCreditsForJobs,
      customCreditsForCandidates,
      customMaxJobPosts,
      limitCredits,
    } = req.body;

    // =========================================
    // 1. VALIDATE COMPANY ID
    // =========================================
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const { Company } = await import("../../models/company.model.js");

    // =========================================
    // 2. FIND COMPANY
    // =========================================
    const existing = await Company.findById(companyId).lean();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const setData = {};

    // =========================================
    // 3. CUSTOM JOB CREDITS
    // =========================================
    if (
      customCreditsForJobs !== null &&
      customCreditsForJobs !== undefined
    ) {
      const val = Number(customCreditsForJobs);

      if (!Number.isInteger(val)) {
        return res.status(400).json({
          success: false,
          message: "Custom Job Credits must be a whole number",
        });
      }

      const currentJobCredits =
        Number(existing.creditedForJobs) || 0;

      const newJobCredits = currentJobCredits + val;

      if (newJobCredits < 0) {
        return res.status(400).json({
          success: false,
          message: "Job Credits cannot be negative",
        });
      }

      setData.creditedForJobs = newJobCredits;

      setData.customCreditsForJobs =
        (Number(existing.customCreditsForJobs) || 0) + val;
    }

    // =========================================
    // 4. CUSTOM CANDIDATE CREDITS
    // =========================================
    if (
      customCreditsForCandidates !== null &&
      customCreditsForCandidates !== undefined
    ) {
      const val = Number(customCreditsForCandidates);

      if (!Number.isInteger(val)) {
        return res.status(400).json({
          success: false,
          message:
            "Custom Candidate Credits must be a whole number",
        });
      }

      const currentCandidateCredits =
        Number(existing.creditedForCandidates) || 0;

      const newCandidateCredits =
        currentCandidateCredits + val;

      if (newCandidateCredits < 0) {
        return res.status(400).json({
          success: false,
          message: "Candidate Credits cannot be negative",
        });
      }

      setData.creditedForCandidates =
        newCandidateCredits;

      setData.customCreditsForCandidates =
        (Number(existing.customCreditsForCandidates) || 0) + val;
    }

    // =========================================
    // 5. CUSTOM MAX JOB POSTS
    // =========================================
    if (
      customMaxJobPosts !== null &&
      customMaxJobPosts !== undefined
    ) {
      const val = Number(customMaxJobPosts);

      if (!Number.isInteger(val) || val < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Job Posts must be a valid whole number",
        });
      }

      const plan = existing.plan || "FREE";

      const planLimits = {
        FREE: 2,
        STANDARD: 5,
        PREMIUM: 15,
        PRO: 15,
        ENTERPRISE: 999999,
      };

      const used =
        plan === "FREE"
          ? Number(existing.freeJobsPosted) || 0
          : Number(existing.planJobsPostedThisMonth) || 0;

      const currentLimit =
        existing.maxJobPosts !== null &&
        existing.maxJobPosts !== undefined
          ? Number(existing.maxJobPosts) || 0
          : planLimits[plan] ?? 2;

      const currentRemaining = Math.max(
        0,
        currentLimit - used
      );

      setData.maxJobPosts =
        used + currentRemaining + val;

      setData.customMaxJobPosts =
        (Number(existing.customMaxJobPosts) || 0) + val;
    }

    // =========================================
    // 6. AI CREDITS
    // =========================================
    if (
      limitCredits !== null &&
      limitCredits !== undefined
    ) {
      // Empty value
      if (limitCredits === "") {
        return res.status(400).json({
          success: false,
          message: "AI Credits cannot be empty",
        });
      }

      // Only numbers
      const aiCredits = Number(limitCredits);

      // Integer validation
      if (!Number.isInteger(aiCredits)) {
        return res.status(400).json({
          success: false,
          message:
            "AI Credits must be a whole number",
        });
      }

      // Range validation
      if (aiCredits < 0 || aiCredits > 5) {
        return res.status(400).json({
          success: false,
          message:
            "AI Credits must be between 0 and 5",
        });
      }

      // IMPORTANT:
      // Company schema uses aiSourcingCredits
      setData.aiSourcingCredits = aiCredits;
    }

    // =========================================
    // 7. NOTHING TO UPDATE
    // =========================================
    if (Object.keys(setData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No credits data provided for update",
      });
    }

    // =========================================
    // 8. UPDATE COMPANY
    // =========================================
    const company = await Company.findByIdAndUpdate(
      companyId,
      {
        $set: setData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // =========================================
    // 9. SOCKET UPDATE
    // =========================================
    try {
      const { getIO } = await import(
        "../../utils/socket.js"
      );

      const io = getIO();

      if (io) {
        io.emit("companyCreditsUpdated", {
          companyId: company._id.toString(),

          creditedForJobs:
            company.creditedForJobs,

          customCreditsForJobs:
            company.customCreditsForJobs,

          creditedForCandidates:
            company.creditedForCandidates,

          customCreditsForCandidates:
            company.customCreditsForCandidates,

          maxJobPosts:
            company.maxJobPosts,

          customMaxJobPosts:
            company.customMaxJobPosts,

          aiSourcingCredits:
            company.aiSourcingCredits,
        });
      }
    } catch (emitErr) {
      console.error(
        "Error emitting companyCreditsUpdated:",
        emitErr
      );
    }

    // =========================================
    // 10. RESPONSE
    // =========================================
    return res.status(200).json({
      success: true,
      message: "Credits updated successfully",

      company: {
        _id: company._id,

        creditedForJobs:
          company.creditedForJobs,

        customCreditsForJobs:
          company.customCreditsForJobs,

        creditedForCandidates:
          company.creditedForCandidates,

        customCreditsForCandidates:
          company.customCreditsForCandidates,

        maxJobPosts:
          company.maxJobPosts,

        customMaxJobPosts:
          company.customMaxJobPosts,

        // Correct field
        aiSourcingCredits:
          company.aiSourcingCredits,

        plan:
          company.plan,

        freeJobsPosted:
          company.freeJobsPosted,

        planJobsPostedThisMonth:
          company.planJobsPostedThisMonth,
      },
    });
  } catch (error) {
    console.error(
      "Error updating recruiter credits:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
