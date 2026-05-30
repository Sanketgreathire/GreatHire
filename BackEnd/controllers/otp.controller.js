import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { OtpModel } from "../models/otp.model.js";

const OTP_EXPIRY_MINUTES = 10;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","tempmail.com","throwam.com",
  "yopmail.com","sharklasers.com","guerrillamailblock.com","grr.la",
  "guerrillamail.info","guerrillamail.biz","guerrillamail.de","guerrillamail.net",
  "guerrillamail.org","spam4.me","trashmail.com","trashmail.me","trashmail.net",
  "dispostable.com","maildrop.cc","fakeinbox.com","mailnull.com",
  "spamgourmet.com","spamgourmet.net","spamgourmet.org","tempr.email",
  "discard.email","mailnesia.com","spamfree24.org","spamfree.eu","spam.la",
  "spamoff.de","trashdevil.com","trashdevil.de","wegwerfmail.de",
  "wegwerfmail.net","wegwerfmail.org","10minutemail.com","10minutemail.net",
  "10minutemail.org","tempinbox.com","tempinbox.co.uk","tempemail.net",
  "minitts.net","fosil.pro","mailtemp.info","tempmail.io",
  "temp-mail.org","temp-mail.io","tempmail.plus","emailondeck.com",
  "getairmail.com","filzmail.com","mohmal.com","throwam.net",
  "spamevader.com","spamevader.net","spamevader.org","mailnew.com",
]);

const isDisposableEmail = (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/v1/otp/send-email
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    if (isDisposableEmail(email)) {
      return res.status(400).json({ success: false, message: "Temporary/disposable email addresses are not allowed. Please use a real work email." });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Send email FIRST — only save to DB if delivery succeeds
    try {
      await transporter.sendMail({
        from: `"GreatHire" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your GreatHire Email Verification OTP",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:10px;">
            <h2 style="color:#1D4ED8;text-align:center;">Great<span style="color:#333;">Hire</span></h2>
            <p style="color:#555;">Your email verification OTP is:</p>
            <div style="text-align:center;margin:24px 0;">
              <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1D4ED8;">${otp}</span>
            </div>
            <p style="color:#888;font-size:13px;">This OTP expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>. Do not share it with anyone.</p>
          </div>`,
      });
    } catch (mailErr) {
      console.error("sendMail error:", mailErr.message);
      return res.status(500).json({ success: false, message: "Could not deliver email. Please check the email address and try again." });
    }

    // Email delivered — now upsert OTP record (no rate limiting)
    await OtpModel.findOneAndUpdate(
      { email },
      {
        emailOtp: hashedOtp,
        emailOtpExpiry: expiry,
        emailVerified: false,
        lastEmailRequest: new Date(),
        $inc: { emailAttempts: 1 },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("sendEmailOtp error:", err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};

// POST /api/v1/otp/verify-email
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

    const record = await OtpModel.findOne({ email });
    if (!record || !record.emailOtp) return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    if (record.emailVerified) return res.status(400).json({ success: false, message: "Email already verified" });
    if (new Date() > record.emailOtpExpiry) return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });

    const isMatch = await bcrypt.compare(otp, record.emailOtp);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    record.emailVerified = true;
    record.emailOtp = null;
    await record.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyEmailOtp error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
