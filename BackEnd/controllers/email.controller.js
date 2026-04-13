import nodemailer from "nodemailer";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import https from "https";
import http from "http";

// ── Helper: fetch PDF buffer from URL ──
const fetchPdfBuffer = (url) => new Promise((resolve) => {
  try {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", () => resolve(null));
    }).on("error", () => resolve(null));
  } catch { resolve(null); }
});

// ── Helper: extract skills from resume text ──
const extractSkillsFromText = (text, jobSkills) => {
  if (!text || !jobSkills.length) return [];
  const lower = text.toLowerCase();
  return jobSkills.filter(skill => lower.includes(skill.toLowerCase()));
};

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
    if (!applicationIds?.length) return res.status(400).json({ success: false, message: "applicationIds are required." });

    const applications = await Application.find({ _id: { $in: applicationIds } })
      .populate("applicant", "fullname profile address")
      .populate("job", "jobDetails.title jobDetails.skills jobDetails.experience jobDetails.salary jobDetails.location")
      .lean();

    if (!applications.length) return res.status(404).json({ success: false, message: "No applications found." });

    const job = applications[0]?.job?.jobDetails;

    const parseSalary = (str) => {
      if (!str) return null;
      const nums = String(str).replace(/[^0-9\-]/g, "").split("-").map(Number).filter(Boolean);
      if (nums.length === 2) return { min: nums[0], max: nums[1] };
      if (nums.length === 1) return { min: 0, max: nums[0] };
      return null;
    };
    const parseExpYears = (str) => {
      if (!str) return 0;
      const nums = String(str).match(/\d+/g)?.map(Number) || [];
      return nums.length ? Math.max(...nums) : 0;
    };

    const jobSkills = (job?.skills || []).map(s => s.toLowerCase().trim());
    const jobExpRequired = parseExpYears(job?.experience);
    const jobSalary = parseSalary(job?.salary);
    const jobLocation = (job?.location || "").toLowerCase();

    // Fetch & parse all resumes in parallel
    const resumeTexts = await Promise.all(
      applications.map(async (app) => {
        const resumeUrl = app.applicant?.profile?.resume;
        if (!resumeUrl || typeof resumeUrl !== "string" || !resumeUrl.startsWith("http")) return "";
        try {
          const buf = await fetchPdfBuffer(resumeUrl);
          if (!buf) return "";
          const parsed = await pdfParse(buf);
          return parsed.text || "";
        } catch { return ""; }
      })
    );

    const scored = applications.map((app, i) => {
      const candidate = app.applicant;
      const profile = candidate?.profile || {};
      const resumeText = resumeTexts[i];

      // Merge profile skills + resume-extracted skills, deduplicated
      const profileSkills = (profile.skills || []).map(s => s.toLowerCase().trim());
      const resumeExtracted = extractSkillsFromText(resumeText, jobSkills);
      const allCandSkills = [...new Set([...profileSkills, ...resumeExtracted])];

      const candExp = parseExpYears(profile.experiences?.[0]?.duration || profile.experience?.duration);
      const candCTC = parseFloat(String(profile.expectedCTC || "0").replace(/[^0-9.]/g, "")) || 0;
      const candLocation = [candidate?.address?.city, candidate?.address?.state, candidate?.address?.country].filter(Boolean).join(" ").toLowerCase();

      // Skills Score (40%)
      let skillScore = 0;
      const matchedSkills = [], missingSkills = [];
      if (jobSkills.length > 0) {
        jobSkills.forEach(skill => {
          const matched = allCandSkills.some(cs => cs.includes(skill) || skill.includes(cs));
          if (matched) matchedSkills.push(skill); else missingSkills.push(skill);
        });
        skillScore = Math.round((matchedSkills.length / jobSkills.length) * 40);
      } else { skillScore = 20; }

      // Experience Score (30%)
      let expScore = 0, expNote = "";
      if (jobExpRequired === 0) { expScore = 30; expNote = "No experience required"; }
      else if (candExp >= jobExpRequired) { expScore = 30; expNote = `${candExp} yrs meets requirement`; }
      else if (candExp >= jobExpRequired * 0.7) { expScore = 20; expNote = `${candExp} yrs (slightly below ${jobExpRequired} yrs)`; }
      else if (candExp > 0) { expScore = 10; expNote = `${candExp} yrs (below ${jobExpRequired} yrs)`; }
      else { expScore = 0; expNote = "No experience listed"; }

      // Location Score (15%)
      let locationScore = 0, locationNote = "";
      if (!jobLocation || jobLocation.includes("remote")) { locationScore = 15; locationNote = "Remote / Any"; }
      else if (candLocation && jobLocation.split(/[,\s]+/).some(p => candLocation.includes(p) && p.length > 2)) { locationScore = 15; locationNote = "Location matches"; }
      else if (candLocation) { locationScore = 5; locationNote = "Different location"; }
      else { locationScore = 8; locationNote = "Not specified"; }

      // CTC Score (15%)
      let ctcScore = 0, ctcNote = "";
      if (!jobSalary || candCTC === 0) { ctcScore = 10; ctcNote = "CTC not specified"; }
      else if (candCTC <= jobSalary.max) { ctcScore = 15; ctcNote = `₹${candCTC} within budget`; }
      else if (candCTC <= jobSalary.max * 1.2) { ctcScore = 8; ctcNote = `₹${candCTC} slightly above`; }
      else { ctcScore = 0; ctcNote = `₹${candCTC} exceeds budget`; }

      return {
        applicationId: app._id.toString(),
        name: candidate?.fullname || "Unknown",
        score: skillScore + expScore + locationScore + ctcScore,
        skillScore, expScore, locationScore, ctcScore,
        matchedSkills, missingSkills, expNote, locationNote, ctcNote,
        status: app.status,
        resumeParsed: resumeText.length > 0,
      };
    });

    // Sort: non-rejected by score desc, rejected at bottom
    scored.sort((a, b) => {
      if (a.status === "Rejected" && b.status !== "Rejected") return 1;
      if (a.status !== "Rejected" && b.status === "Rejected") return -1;
      return b.score - a.score;
    });

    return res.status(200).json({ success: true, jobTitle: job?.title || "Job", results: scored });
  } catch (err) {
    console.error("Error analyzing candidates:", err);
    return res.status(500).json({ success: false, message: "Analysis failed.", error: err.message });
  }
};
