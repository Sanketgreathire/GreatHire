import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Recruiter } from "../models/recruiter.model.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin/admin.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import randomstring from "randomstring";
import { serviceOrder } from "../models/serviceOrder.model.js";
import { JobSubscription } from "../models/jobSubscription.model.js";
import { CandidateSubscription } from "../models/candidateSubscription.model.js";
import { hmac } from "fast-sha256";
import { TextEncoder } from "util";
import { validationResult } from "express-validator";
// otpService.js
import twilio from "twilio";
// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// OTP Secret
const OTP_SECRET = process.env.SECRET_KEY;

export const verifyToken = async (req, res) => {
  const { token } = req.body;
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json({
      decoded,
      message: "Token Valid",
      success: true,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired.",
        success: false,
      });
    }
    return res.status(400).json({
      message: `Invalid token. ${err}`,
      success: false,
    });
  }
};

// this controller help to active and deactive a company
export const sendVerificationStatus = async (req, res) => {
  try {
    // Extract data from the request body
    const { email, adminEmail, companyId, isActive } = req.body;
    // userId is available as req.id if needed for audit purposes
    const userId = req.id;

    // Find the company by its ID
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    const admin = await Admin.findById(userId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "You are not authorized" });
    }

    // Update the company's isActive status
    company.isActive = isActive;
    await company.save();

    // Extract recruiter IDs from the company's userId array
    // (Assuming the company model stores recruiter IDs in the format: [{ user: ObjectId }, ...])
    const recruiterIds = company.userId.map((u) => u.user);

    // Update all recruiters associated with this company
    await Recruiter.updateMany(
      { _id: { $in: recruiterIds } },
      { isActive: isActive }
    );

    // Update all jobs for this company.
    // In the Job model, the active status is stored in the nested jobDetails.isActive field.
    await Job.updateMany(
      { company: companyId },
      { "jobDetails.isActive": isActive }
    );

    // Prepare the email notification content
    const subject = `Company Status Update: ${
      isActive ? "Active" : "Inactive"
    }`;
    const message = `
<html>
  <head>
    <meta charset="utf-8">
    <title>Company Verification Status</title>
    <style>
      /* Inline CSS styles for the email */
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 20px;
      }
      .container {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 5px;
        max-width: 600px;
        margin: auto;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .logo {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .logo .great {
        color: #000000;
      }
      .logo .hire {
        color: #1D4ED8;
      }
      .message {
        font-size: 16px;
        line-height: 1.6;
        color: #333333;
      }
      .footer {
        margin-top: 30px;
        font-size: 14px;
        color: #777777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <span class="great">Great</span><span class="hire">Hire</span>
      </div>
      <div class="message">
        <p>Dear ${company.companyName},</p>
        <p>Greetings from <strong><span class="great">Great</span><span class="hire">Hire</span></strong>!</p>
        <p>
          We hope you are doing well. We are writing to inform you that the verification status of your company has been updated to: 
          <strong>${isActive ? "Active" : "Inactive"}</strong>.
        </p>
        ${
          isActive
            ? `<p>Great news! With your account now active, all your recruiters and job postings have been successfully activated. Your company is now fully visible on our platform, allowing you to enjoy our comprehensive recruitment services.</p>`
            : `<p>Please note that since your company status has been set to Inactive, all associated recruiters and job postings have been temporarily deactivated. If you have any questions or need further assistance, our support team is here to help.</p>`
        }
        <p>Thank you for choosing <strong><span class="great">Great</span><span class="hire">Hire</span></strong>. We look forward to continuing to support your hiring success.</p>
      </div>
      <div class="footer">
        <p>Warm regards,</p>
        <p>The <span class="great">Great</span><span class="hire">Hire</span> Team</p>
      </div>
    </div>
  </body>
</html>
`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${email}, ${adminEmail}`,
      subject: subject,
      html: message,
    };

    // Send the email notification
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        // Optionally handle email errors, but the DB update succeeded.
      } else {
        //console.log("Email sent:", info.response);
      }
    });

    return res.status(200).json({
      success: true,
      message:
        "Verification status updated successfully and email notifications sent.",
    });
  } catch (err) {
    console.error("Error in sending verification status:", err);
    return res.status(500).json({
      message: "Failed to update verification status.",
      success: false,
      error: err.message,
    });
  }
};

export const requestOTPForEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    // Generate OTP
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    const token = jwt.sign({ otp }, OTP_SECRET, {
      expiresIn: "30s",
    });

    // Send OTP via email
    await transporter.sendMail({
      from: `"GreatHire Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your GreatHire OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #1d4ed8; text-align: center;">GreatHire OTP Verification</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">
            Thank you for using <strong>GreatHire</strong>! Please use the OTP below to complete your verification:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; color: #1d4ed8; font-weight: bold; border: 2px dashed #1d4ed8; padding: 10px 20px; border-radius: 8px;">${otp}</span>
          </div>
          <p style="font-size: 16px; color: #555;">
            This OTP is valid for <strong>30 seconds</strong>. Please do not share it with anyone for security reasons.
          </p>
          <p style="font-size: 16px; color: #555;">
            If you did not request this OTP, please ignore this email or contact our support team.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eaeaea;" />
          <p style="font-size: 14px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} GreatHire. All rights reserved.
          </p>
        </div>
      `,
    });

    res.status(200).json({
      message: "OTP sent successfully!",
      success: true,
      token,
    });
  } catch (err) {
    console.error(`Error in sending OTP: ${err}`);
    res.status(500).json({
      message: "Failed to send OTP. Please try again.",
      success: false,
    });
  }
};

export const requestOTPForNumber = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { number } = req.body;
    const client = twilio(accountSid, authToken);
    // Generate a JWT token with the OTP and 30-second expiration
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    const token = jwt.sign({ otp }, OTP_SECRET, {
      expiresIn: "30s",
    });

    // Send OTP to mobile number via Twilio
    await client.messages.create({
      body: `Hello from GreatHire!\n ${otp}.\nThis OTP is valid for the next 30 seconds.`,
      from: `${process.env.TWILIO_PHONE_NUMBER}`, // Replace with your Twilio phone number
      to: `+91${number}`,
    });

    res.status(200).json({
      message: "OTP sent successfully!",
      success: true,
      token, // Return the JWT token for client-side verification
    });
  } catch (err) {
    console.error(`Error in sending OTP: ${err}`);
    res.status(500).json({
      message: "Failed to send OTP. Please try again.",
      success: false,
    });
  }
};

// Verify OTP Controller
export const verifyOTP = async (req, res) => {
  const { decodedOTP, otp } = req.body;

  // Check if token and OTP are provided
  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP required.",
    });
  }

  try {
    // Check if the OTP matches and is still valid
    if (decodedOTP !== otp) {
      return res.status(200).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
    });
  }
};

// Compare the generated signature with Razorpay's signature
const matchSignature = (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  // Secret key and data for HMAC
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const data = razorpay_order_id + "|" + razorpay_payment_id;

  // Generate HMAC signature
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);
  const message = encoder.encode(data);
  const generatedSignature = Buffer.from(hmac(secretKey, message)).toString(
    "hex"
  );
  return generatedSignature === razorpay_signature;
};

// Verify Payment Controller
export const verifyPaymentForService = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (
      matchSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    ) {
      // Update the order status in the database
      await serviceOrder.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "paid",
          paymentDetails: {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          },
        }
      );

      res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyPaymentForJobPlans = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      jobBoost,
      companyId,
    } = req.body;

    if (
      matchSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    ) {
      // Update the order status in the database
      const currentPlan = await JobSubscription.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          paymentDetails: {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          },
          status: "Active", // Activate the plan after paymentStatus is paid
        },
        { new: true } // Return the updated document
      ).select("jobBoost expiryDate planName price status purchaseDate");

      // here remove expired plan of company
      await JobSubscription.deleteOne({
        company: companyId,
        status: "Expired",
      });

      // Find the company and update maxPostJobs
      const company = await Company.findById(companyId);
      if (!company) {
        return res
          .status(404)
          .json({ success: false, message: "Company not found" });
      }

      // If the plan is unlimited, set maxPostJobs accordingly
      if (jobBoost === null) {
        company.maxPostJobs = null; // this one set unlimited
      } else {
        company.maxPostJobs = company.maxPostJobs + jobBoost; // Add the jobBoost to existing maxPostJobs
      }

      await company.save();

      res.status(200).json({
        success: true,
        plan: currentPlan,
        message: "Payment verified successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyPaymentForCandidatePlans = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      creditBoost,
      companyId,
    } = req.body;

    if (
      matchSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    ) {
      // Update the order status in the database
      const currentPlan = await CandidateSubscription.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          paymentDetails: {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          },
          status: "Active", // Activate the plan after paymentStatus is paid
        },
        { new: true } // Return the updated document
      ).select("creditBoost expiryDate planName price status purchaseDate");

      // here remove expired plan of company
      await CandidateSubscription.deleteOne({
        company: companyId,
        status: "Expired",
      });

      // Find the company and update maxPostJobs
      const company = await Company.findById(companyId);
      if (!company) {
        return res
          .status(404)
          .json({ success: false, message: "Company not found" });
      }

      // If the plan is unlimited, set maxPostJobs accordingly
      if (creditBoost === null) {
        company.creditedForCandidates = null; // this one set unlimited
      } else {
        company.creditedForCandidates =
          company.creditedForCandidates + creditBoost; // Add the creditBoost to existing creditedForCandidates
      }

      await company.save();

      res.status(200).json({
        success: true,
        plan: currentPlan,
        message: "Payment verified successfully",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// update user email verification
export const updateEmailVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;

    let user =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Update email verification status
    user.set("emailId.isVerified", true);

    await user.save();

    return res.status(200).json({
      message: "Email Verified.",
      success: true,
    });
  } catch (err) {
    console.error("Error updating email verification:", err);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: err.message,
    });
  }
};

// update user phone number verification
export const updateNumberVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;

    let user =
      (await User.findOne({ "emailId.email": email })) ||
      (await Recruiter.findOne({ "emailId.email": email })) ||
      (await Admin.findOne({ "emailId.email": email }));

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Update email verification status
    user.set("phoneNumber.isVerified", true);

    await user.save();

    return res.status(200).json({
      message: "Number Verified.",
      success: true,
    });
  } catch (err) {
    console.error("Error updating email verification:", err);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: err.message,
    });
  }
};

export const sendEmailToApplicant = async (req, res) => {
  try {
    const jobId = req.params.id; // Job ID from the URL
    const { email, status } = req.body; // Recipient email and status from the request body

    // Find the job details
    const job = await Job.findById(jobId).populate("company"); // Ensure "company" is populated for company name
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Extract important job details
    const { jobDetails, company } = job;
    const companyName = company?.companyName || "Our Company"; // Fallback in case the company name is missing

    // Create email content
    const subject =
      status === "Shortlisted"
        ? "Congratulations! You've been Shortlisted"
        : "Application Status Update: Rejected";

    const message =
      status === "Shortlisted"
        ? `
        <p>Dear Applicant,</p>
        <p>We are pleased to inform you that you have been shortlisted for the position of <strong>${jobDetails.title}</strong> at <strong>${companyName}</strong>.</p>
        <p>Here are the key details of the job:</p>
        <ul>
          <li><strong>Job Title:</strong> ${jobDetails.title}</li>
          <li><strong>Location:</strong> ${jobDetails.location}</li>
          <li><strong>Salary:</strong> ${jobDetails.salary}</li>
          <li><strong>Experience Required:</strong> ${jobDetails.experience} years</li>
        </ul>
        <p>We will contact you shortly with the next steps in the process.</p>
        <p>Thank you for applying to <strong>${companyName}</strong>. We wish you all the best!</p>
        <p>Warm Regards,</p>
        <p>The ${companyName} Team</p>
      `
        : `
        <p>Dear Applicant,</p>
        <p>Thank you for applying for the position of <strong>${jobDetails.title}</strong> at <strong>${companyName}</strong>.</p>
        <p>After careful consideration, we regret to inform you that you have not been shortlisted for this role. Please don't be discouraged, as there will be other opportunities in the future.</p>
        <p>We encourage you to continue your job search and wish you the best in your career journey.</p>
        <p>Thank you once again for your interest in <strong>${companyName}</strong>.</p>
        <p>Warm Regards,</p>
        <p>The ${companyName} Team</p>
      `;

    // Send email
    await transporter.sendMail({
      from: `"GreatHire Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: message,
    });

    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
