import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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

export const sendVerificationStatus = async (req, res) => {
  try {
    const { companyData, recruiterData, status } = req.body;

    // Validate input
    if (!companyData || !recruiterData || status === undefined) {
      return res.status(400).json({
        message: "Missing required data.",
        success: false,
      });
    }

    // Construct the message based on status
    let message;
    if (status === -1) {
      message = `${recruiterData.fullname} with email ${recruiterData.email} has been marked as not verified.`;
    } else if (status === 1) {
      message = `${recruiterData.fullname} with email ${recruiterData.email} has been verified successfully.`;
    } else {
      return res.status(400).json({
        message: "Invalid status provided.",
        success: false,
      });
    }

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to Great Hire
    const mailOptionsForGreatHire = {
      from: ` "GreatHire Support" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Recruiter Verification Status by ${companyData.companyName}`,
      html: `
        <h3>Recruiter Verification Status</h3>
        <p><strong>Company Name:</strong> ${companyData.companyName}</p>
        <p><strong>Recruiter Name:</strong> ${recruiterData.fullname}</p>
        <p><strong>Recruiter Email:</strong> ${recruiterData.email}</p>
        <p><strong>Status:</strong> ${
          status === 1 ? "Verified" : "Not Verified"
        }</p>
        <p>${message}</p>
        <br/>
        <p>Thanks</p>
      `,
    };

    // Email to Company
    const mailOptionsForCompany = {
      from: `"GreatHire Support" <${process.env.EMAIL_USER}>`,
      to: companyData.email,
      subject: `Verification Response`,
      html: `
        <h3>Recruiter Verification Status</h3>
        <p>Your verification response for recruiter <strong>${recruiterData.fullname}</strong> has been recorded. We will update the recruiter’s status shortly.</p>
        <br/>
        <p>Thanks,</p>
        <p>Great Hire</p>
      `,
    };

    // Send emails concurrently
    await Promise.all([
      transporter.sendMail(mailOptionsForGreatHire),
      transporter.sendMail(mailOptionsForCompany),
    ]);

    // Return success response
    return res.status(200).json({
      message: "Verification emails sent successfully.",
      success: true,
    });
  } catch (err) {
    console.error("Error in sending verification status:", err);
    return res.status(500).json({
      message: "Failed to send verification emails.",
      success: false,
      error: err.message,
    });
  }
};
