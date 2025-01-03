import { Company } from "../models/company.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyWebsite,
      industry,
      streetAddress,
      city,
      state,
      country,
      postalCode,
      email,
      phone,
      taxId,
      recruiterPosition,
      recruiterPhone,
      userEmail,
    } = req.body;

    // Check if a company already exists with this email
    let company = await Company.findOne({ email });
    if (company) {
      return res.status(400).json({
        message: "Company already exists.",
        success: false,
      });
    }

    // Check if a recruiter exists with this email
    let recruiter = await Recruiter.findOne({ email: userEmail });
    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found.",
        success: false,
      });
    }

    // Update recruiter's position and phone number
    recruiter.phoneNumber = recruiterPhone;
    recruiter.position = recruiterPosition;
    recruiter.isCompanyCreated = true;
    await recruiter.save();

    let cloudResponse;
    const { businessFile } = req.files;
    if (businessFile && businessFile.length > 0) {
      // Convert file to a URI
      const fileUri = getDataUri(businessFile[0]);

      // Upload to Cloudinary
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }
    // Create a new company if it doesn't exist
    company = await Company.create({
      companyName,
      companyWebsite,
      industry,
      email,
      adminEmail: userEmail,
      phone,
      taxId,
      userId: [{ user: recruiter._id, isVerified: 0 }], // Add recruiter with `isVerified: false`
      address: {
        streetAddress,
        city,
        state,
        country,
        postalCode,
      },
      businessFile: cloudResponse ? cloudResponse.secure_url : undefined,
      bussinessFileName: businessFile ? businessFile.originalname : undefined,
    });

    // Generate a verification token
    const verificationToken = jwt.sign(
      { recruiterId: recruiter._id, companyId: company._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" } // Token expires in 24 hours
    );

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or your email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Email options
    const mailOptions = {
      from: `"GreatHire Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Recruiter/Employer Account",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 30px; max-width: 600px; margin: auto; border-radius: 10px; border: 1px solid #ddd;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1e90ff;">GreatHire</h2>
            <p style="color: #555;">Connecting Skills with Opportunity - Your Next Great Hire Awaits!</p>
          </div>
          <h3 style="color: #333;">Hi there,</h3>
          <p style="color: #555;">Thank you for signing up with GreatHire! We’re excited to have you onboard.</p>
          <p style="color: #555;">To complete your Company registration, verify your recruiter/employer details, click the link below:</p>
    
          <div style="text-align: center; margin: 20px 0;">
            <a href="${
              process.env.FRONTEND_URL
            }/verify-recruiter/${verificationToken}" style="background-color: #1e90ff; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px;">
              Verify Recruiter
            </a>
          </div>
    
          <p style="color: #555;">
            Please note: This link will expire in 24 hours.
          </p>
    
          <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="font-size: 14px; color: #888;">If you didn’t request this verification, please disregard this email.</p>
            <p style="font-size: 14px; color: #888;">For any questions or support, feel free to reach out to us.</p>
          </div>
    
          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 14px; color: #aaa;">© ${new Date().getFullYear()} GreatHire. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    let mailResponse = await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      recruiter,
      success: true,
    });
  } catch (error) {
    console.error("Error in registering company:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

//company get

export const getCompanyList = async (req, res) => {
  try {
    const userId = req.id; //logged in userId
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//get  company by id ...
export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        Success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const companyByUserId = async (req, res) => {
  const { userId } = req.body;

  try {
    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Query the company where userId matches
    const company = await Company.findOne({
      userId: { $elemMatch: { user: new mongoose.Types.ObjectId(userId) } },
    });

    if (company) {
      return res.status(200).json({ success: true, company });
    } else {
      return res.status(404).json({
        success: false,
        message: "Company not found for the given user ID.",
      });
    }
  } catch (err) {
    console.error(`Error in fetching company by user ID: ${err}`);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

//update company
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    //cloudainary is coming here....

    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company information updated.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
