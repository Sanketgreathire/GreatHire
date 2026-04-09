import nodemailer from "nodemailer";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendFirstJobReminder = async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: "No recipients provided." });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1D4ED8; text-align: center;">Great<span style="color: #333;">Hire</span></h2>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">Dear Recruiter,</p>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">We noticed you haven't posted your first job yet on <strong>GreatHire</strong>.</p>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">Posting a job is quick and easy — reach thousands of qualified candidates today!</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="https://greathire.in/recruiter/dashboard/post-job" style="background-color: #1D4ED8; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: bold;">Post Your First Job Now</a>
          </div>
          <p style="color: #555; font-size: 15px; line-height: 1.8;">If you have any questions, feel free to reach out to our support team.</p>
          <p style="color: #555; font-size: 15px;">Best regards,<br/>The GreatHire Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">This message was sent via GreatHire. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"GreatHire Team" <${process.env.EMAIL_USER}>`,
      to: emails.join(", "),
      subject: "Reminder: Post Your First Job on GreatHire",
      html,
    });

    return res.status(200).json({ success: true, message: `First job reminder sent to ${emails.length} recipient(s).` });
  } catch (err) {
    console.error("Error sending first job reminder:", err);
    return res.status(500).json({ success: false, message: "Failed to send reminder.", error: err.message });
  }
};

export const sendBulkEmail = async (req, res) => {
  try {
    const { emails, subject, message } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: "No recipients provided." });
    }
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "Subject and message are required." });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1D4ED8; text-align: center;">Great<span style="color: #333;">Hire</span></h2>
          <div style="color: #555; line-height: 1.8; font-size: 15px; white-space: pre-line;">${message}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">This message was sent via GreatHire. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"GreatHire Team" <${process.env.EMAIL_USER}>`,
      to: emails.join(", "),
      subject,
      html,
    });

    return res.status(200).json({ success: true, message: `Email sent to ${emails.length} recipient(s).` });
  } catch (err) {
    console.error("Error sending bulk email:", err);
    return res.status(500).json({ success: false, message: "Failed to send email.", error: err.message });
  }
};

export const analyzeCandidates = async (req, res) => {
  try {
    const { applicationIds } = req.body;

    if (!applicationIds?.length) {
      return res.status(400).json({ success: false, message: "applicationIds are required." });
    }

    const applications = await Application.find({ _id: { $in: applicationIds } })
      .populate("applicant", "fullname profile.skills profile.experience profile.expectedCTC address")
      .populate("job", "jobDetails.title jobDetails.skills jobDetails.experience jobDetails.salary jobDetails.location jobDetails.jobType")
      .lean();

    if (!applications.length) {
      return res.status(404).json({ success: false, message: "No applications found." });
    }

    const job = applications[0]?.job?.jobDetails;

    // ── Helper: parse salary range from string like "30000-50000" ──
    const parseSalary = (str) => {
      if (!str) return null;
      const nums = String(str).replace(/[^0-9\-]/g, "").split("-").map(Number).filter(Boolean);
      if (nums.length === 2) return { min: nums[0], max: nums[1] };
      if (nums.length === 1) return { min: 0, max: nums[0] };
      return null;
    };

    // ── Helper: parse experience years from string like "1-2 years" or "2" ──
    const parseExpYears = (str) => {
      if (!str) return 0;
      const nums = String(str).match(/\d+/g)?.map(Number) || [];
      return nums.length ? Math.max(...nums) : 0;
    };

    const jobSkills = (job?.skills || []).map(s => s.toLowerCase().trim());
    const jobExpRequired = parseExpYears(job?.experience);
    const jobSalary = parseSalary(job?.salary);
    const jobLocation = (job?.location || "").toLowerCase();

    const scored = applications.map((app) => {
      const candidate = app.applicant;
      const profile = candidate?.profile || {};

      const candSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
      const candExp = parseExpYears(profile.experience?.duration);
      const candCTC = parseFloat(String(profile.expectedCTC || "0").replace(/[^0-9.]/g, "")) || 0;
      const candLocation = [
        candidate?.address?.city,
        candidate?.address?.state,
        candidate?.address?.country
      ].filter(Boolean).join(" ").toLowerCase();

      // ── 1. Skills Score (40%) ──
      let skillScore = 0;
      const matchedSkills = [];
      const missingSkills = [];
      if (jobSkills.length > 0) {
        jobSkills.forEach(skill => {
          const matched = candSkills.some(cs => cs.includes(skill) || skill.includes(cs));
          if (matched) matchedSkills.push(skill);
          else missingSkills.push(skill);
        });
        skillScore = Math.round((matchedSkills.length / jobSkills.length) * 40);
      } else {
        skillScore = 20; // neutral if no skills specified
      }

      // ── 2. Experience Score (30%) ──
      let expScore = 0;
      let expNote = "";
      if (jobExpRequired === 0) {
        expScore = 30;
        expNote = "No experience required";
      } else if (candExp >= jobExpRequired) {
        expScore = 30;
        expNote = `${candExp} yrs meets requirement`;
      } else if (candExp >= jobExpRequired * 0.7) {
        expScore = 20;
        expNote = `${candExp} yrs (slightly below ${jobExpRequired} yrs required)`;
      } else if (candExp > 0) {
        expScore = 10;
        expNote = `${candExp} yrs (below ${jobExpRequired} yrs required)`;
      } else {
        expScore = 0;
        expNote = "No experience listed";
      }

      // ── 3. Location Score (15%) ──
      let locationScore = 0;
      let locationNote = "";
      if (!jobLocation || jobLocation.includes("remote")) {
        locationScore = 15;
        locationNote = "Remote / Any location";
      } else if (candLocation && jobLocation.split(/[,\s]+/).some(part => candLocation.includes(part) && part.length > 2)) {
        locationScore = 15;
        locationNote = "Location matches";
      } else if (candLocation) {
        locationScore = 5;
        locationNote = "Different location";
      } else {
        locationScore = 8;
        locationNote = "Location not specified";
      }

      // ── 4. CTC Score (15%) ──
      let ctcScore = 0;
      let ctcNote = "";
      if (!jobSalary || candCTC === 0) {
        ctcScore = 10;
        ctcNote = "CTC not specified";
      } else if (candCTC <= jobSalary.max) {
        ctcScore = 15;
        ctcNote = `Expected ₹${candCTC} within budget`;
      } else if (candCTC <= jobSalary.max * 1.2) {
        ctcScore = 8;
        ctcNote = `Expected ₹${candCTC} slightly above budget`;
      } else {
        ctcScore = 0;
        ctcNote = `Expected ₹${candCTC} exceeds budget`;
      }

      const totalScore = skillScore + expScore + locationScore + ctcScore;

      return {
        applicationId: app._id.toString(),
        name: candidate?.fullname || "Unknown",
        score: totalScore,
        skillScore, expScore, locationScore, ctcScore,
        matchedSkills,
        missingSkills,
        expNote,
        locationNote,
        ctcNote,
        status: app.status,
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      jobTitle: job?.title || "Job",
      results: scored,
    });
  } catch (err) {
    console.error("Error analyzing candidates:", err);
    return res.status(500).json({ success: false, message: "Analysis failed.", error: err.message });
  }
};
