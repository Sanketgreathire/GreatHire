import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { calculateMatchScore } from "../services/resumeMatch.service.js";
import {
  startInterviewCall,
  generateInterviewQuestions,
  extractPhoneFromResume,
  extractResumeText,
} from "../services/interview.service.js";
export const previewInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Fetch application with job populated
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Extract resume text from PDF/DOCX on Cloudinary
    const resumeUrl = application.resume;
    const resumeText = resumeUrl ? await extractResumeText(resumeUrl) : "";

    // Generate personalized interview questions
    const questions = resumeText
      ? await generateInterviewQuestions(job, resumeText)
      : `Ask candidate about their experience with ${job.jobDetails.skills.join(", ")} and their interest in the ${job.jobDetails.title} role.`;

    return res.json({
      success: true,
      questions,
      script: questions,
    });
  } catch (error) {
    console.error("Interview preview error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const startInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Fetch application with job populated
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Extract resume text from PDF/DOCX on Cloudinary
    const resumeUrl = application.resume;
    const resumeText = resumeUrl ? await extractResumeText(resumeUrl) : "";

    // Get phone — first from application, then extract from resume
    let phone = application.applicantPhone;
    if (!phone && resumeText) {
      phone = extractPhoneFromResume(resumeText);
    }

    // Fallback to user profile phone
    if (!phone) {
      const user = await User.findById(application.applicant);
      phone = user?.phoneNumber?.number || user?.alternatePhone?.number || null;
    }

    if (!phone) {
      return res.status(400).json({ success: false, message: "No phone number found for this applicant" });
    }

    // Calculate match score from resume vs job
    let matchData = { matchScore: 0, skillsMatched: [], missingSkills: [] };
    if (resumeText) {
      matchData = await calculateMatchScore(
        resumeText,
        job.jobDetails.title,
        job.jobDetails.details,
        job.jobDetails.skills
      );
    }

    // Generate personalized interview questions
    const questions = resumeText
      ? await generateInterviewQuestions(job, resumeText)
      : `Ask candidate about their experience with ${job.jobDetails.skills.join(", ")} and their interest in the ${job.jobDetails.title} role.`;

    // Start the call
    const call = await startInterviewCall(phone, questions);

    // Save results to application
    application.aiInterview.status = "Scheduled";
    application.aiInterview.blandCallId = call.call_id;
    application.aiInterview.matchScore = matchData.matchScore;
    application.aiInterview.skillsMatched = matchData.skillsMatched;
    application.aiInterview.missingSkills = matchData.missingSkills;
    await application.save();

    return res.json({
      success: true,
      call,
      matchScore: matchData.matchScore,
      skillsMatched: matchData.skillsMatched,
      missingSkills: matchData.missingSkills,
      phoneUsed: phone,
    });
  } catch (error) {
    console.error("Interview start error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const fetchCallLogs = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Fetch application
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Check if call ID exists
    const callId = application.aiInterview?.blandCallId;
    if (!callId) {
      return res.status(400).json({ success: false, message: "No call found for this application" });
    }

    // Fetch call data from Bland.ai
    const blandResponse = await fetch(`https://api.bland.ai/v1/calls/${callId}`, {
      headers: {
        authorization: process.env.BLAND_API_KEY,
      },
    });

    if (!blandResponse.ok) {
      console.error("Bland API error:", blandResponse.statusText);
      return res.status(500).json({ success: false, message: "Failed to fetch call data" });
    }

    const callData = await blandResponse.json();
    
    // Extract transcript and recording
    let transcript = callData.transcript || callData.messages?.map(m => `${m.role}: ${m.content}`).join("\n") || "No transcript available";
    const recording = callData.recording_url || null;

    // If no transcript but we have a recording, use Groq to transcribe (optional enhancement)
    // For now, just return what we have
    
    return res.json({
      success: true,
      transcript,
      recording,
      callData: {
        status: callData.status,
        duration: callData.duration,
        from: callData.from,
        to: callData.to,
      },
    });
  } catch (error) {
    console.error("Fetch call logs error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

