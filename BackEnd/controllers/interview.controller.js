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

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================================================
   PREVIEW INTERVIEW
========================================================= */

export const previewInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Extract resume text
    const resumeUrl = application.resume;

    const resumeText = resumeUrl
      ? await extractResumeText(resumeUrl)
      : "";

    // Generate questions
    const questions = resumeText
      ? await generateInterviewQuestions(job, resumeText)
      : `Ask candidate about their experience with ${
          job.jobDetails.skills?.join(", ") || "required skills"
        } and their interest in the ${
          job.jobDetails.title
        } role.`;

    return res.json({
      success: true,
      questions,
      script: questions,
    });
  } catch (error) {
    console.error("========== INTERVIEW PREVIEW ERROR ==========");
    console.error("Message:", error?.message);
    console.error("Status:", error?.response?.status);
    console.error("Response:", error?.response?.data);
    console.error("==============================================");

    return res.status(500).json({
      success: false,
      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to generate interview preview",
    });
  }
};

/* =========================================================
   START AI INTERVIEW
========================================================= */

export const startInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // -----------------------------------------------------
    // Fetch application
    // -----------------------------------------------------

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // -----------------------------------------------------
    // Fetch job
    // -----------------------------------------------------

    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // -----------------------------------------------------
    // Extract resume text
    // -----------------------------------------------------

    const resumeUrl = application.resume;

    const resumeText = resumeUrl
      ? await extractResumeText(resumeUrl)
      : "";

    // -----------------------------------------------------
    // Get phone number
    // -----------------------------------------------------

    let phone = application.applicantPhone;

    // First try extracting phone from resume
    if (!phone && resumeText) {
      phone = extractPhoneFromResume(resumeText);
    }

    // Fallback to user profile
    if (!phone) {
      const user = await User.findById(application.applicant);

      phone =
        user?.phoneNumber?.number ||
        user?.alternatePhone?.number ||
        null;
    }

    // No phone found
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "No phone number found for this applicant",
      });
    }

    // -----------------------------------------------------
    // Calculate resume/job match
    // -----------------------------------------------------

    let matchData = {
      matchScore: 0,
      skillsMatched: [],
      missingSkills: [],
    };

    if (resumeText) {
      matchData = await calculateMatchScore(
        resumeText,
        job.jobDetails.title,
        job.jobDetails.details,
        job.jobDetails.skills || []
      );
    }

    // -----------------------------------------------------
    // Generate interview questions
    // -----------------------------------------------------

    const questions = resumeText
      ? await generateInterviewQuestions(job, resumeText)
      : `Ask candidate about their experience with ${
          job.jobDetails.skills?.join(", ") ||
          "the required skills"
        } and their interest in the ${
          job.jobDetails.title
        } role.`;

    console.log("📞 Starting AI interview:", {
      applicationId,
      phone,
      jobTitle: job?.jobDetails?.title,
      questionsLength: questions?.length,
    });

    // -----------------------------------------------------
    // Start Bland.ai call
    // -----------------------------------------------------

    const call = await startInterviewCall(
      phone,
      questions
    );

    if (!call?.call_id) {
      return res.status(500).json({
        success: false,
        message: "Bland.ai did not return a call ID",
      });
    }

    // -----------------------------------------------------
    // Save interview information
    // -----------------------------------------------------

    application.aiInterview.status = "Scheduled";

    application.aiInterview.blandCallId =
      call.call_id;

    application.aiInterview.matchScore =
      Number(matchData.matchScore || 0);

    application.aiInterview.skillsMatched =
      matchData.skillsMatched || [];

    application.aiInterview.missingSkills =
      matchData.missingSkills || [];

    application.aiInterview.questions =
      questions;

    application.aiInterview.logsSaved = false;

    await application.save();

    // -----------------------------------------------------
    // Response
    // -----------------------------------------------------

    return res.json({
      success: true,

      call,

      aiInterview: {
        status:
          application.aiInterview.status,

        blandCallId:
          application.aiInterview.blandCallId,

        questions:
          application.aiInterview.questions,

        matchScore:
          application.aiInterview.matchScore,

        skillsMatched:
          application.aiInterview.skillsMatched,

        missingSkills:
          application.aiInterview.missingSkills,

        logsSaved:
          application.aiInterview.logsSaved || false,
      },

      matchScore:
        application.aiInterview.matchScore,

      skillsMatched:
        application.aiInterview.skillsMatched,

      missingSkills:
        application.aiInterview.missingSkills,

      phoneUsed: phone,
    });
  } catch (error) {
  console.error("========== INTERVIEW START ERROR ==========");
  console.error("Message:", error?.message);
  console.error("Status:", error?.response?.status);
  console.error("Response:", error?.response?.data);
  console.error("============================================");

  const blandMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Failed to start AI interview";

  return res.status(error?.response?.status || 500).json({
    success: false,
    message: blandMessage,
    error: blandMessage,
  });
}
};

/* =========================================================
   FETCH CALL LOGS
========================================================= */

export const fetchCallLogs = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // -----------------------------------------------------
    // Fetch application
    // -----------------------------------------------------

    const application =
      await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // -----------------------------------------------------
    // Get Bland call ID
    // -----------------------------------------------------

    const callId =
      application.aiInterview?.blandCallId;

    if (!callId) {
      return res.status(400).json({
        success: false,
        message:
          "No call found for this application",
      });
    }

    // -----------------------------------------------------
    // If transcript already exists
    // -----------------------------------------------------

    if (application.aiInterview?.transcript) {
      /*
       * If transcript already exists,
       * make sure logsSaved is true.
       */

      if (!application.aiInterview.logsSaved) {
        application.aiInterview.logsSaved = true;

        await application.save();
      }

      return res.json({
        success: true,

        transcript:
          application.aiInterview.transcript,

        recording:
          application.aiInterview.recordingUrl ||
          null,

        logsSaved:
          application.aiInterview.logsSaved ||
          false,

        aiInterview: {
          status:
            application.aiInterview.status ||
            "Completed",

          blandCallId:
            application.aiInterview.blandCallId ||
            callId,

          transcript:
            application.aiInterview.transcript ||
            "",

          recordingUrl:
            application.aiInterview.recordingUrl ||
            "",

          logsSaved:
            application.aiInterview.logsSaved ||
            false,
        },

        callData: {
          status:
            application.aiInterview.status ||
            "Completed",

          blandCallId: callId,
        },
      });
    }

    // -----------------------------------------------------
    // Fetch call data from Bland.ai
    // -----------------------------------------------------

    console.log(
      "Fetching call data from Bland.ai:",
      callId
    );

    const blandResponse = await fetch(
      `https://api.bland.ai/v1/calls/${callId}`,
      {
        headers: {
          authorization:
            process.env.BLAND_API_KEY,
        },
      }
    );

    const callData =
      await blandResponse.json();

    if (!blandResponse.ok) {
      console.error(
        "Bland API error:",
        blandResponse.status,
        callData
      );

      return res.status(
        blandResponse.status
      ).json({
        success: false,

        message:
          callData?.message ||
          callData?.error ||
          "Failed to fetch call data",

        callId,
      });
    }

    console.log(
      "Bland.ai response keys:",
      Object.keys(callData || {})
    );

    // -----------------------------------------------------
    // Extract transcript
    // -----------------------------------------------------

    let transcript = "";

    // Direct transcript
    if (callData?.transcript) {
      transcript = callData.transcript;
    }

    // Messages
    else if (
      Array.isArray(callData?.messages)
    ) {
      transcript = callData.messages
        .map((message) => {
          const role =
            message?.role === "assistant"
              ? "AI Agent"
              : "Candidate";

          const time = message?.timestamp
            ? ` [${new Date(
                message.timestamp
              ).toLocaleTimeString()}]`
            : "";

          return `${role}${time}:\n${
            message?.content || ""
          }`;
        })
        .filter(Boolean)
        .join("\n\n---\n\n");
    }

    // Analysis transcript
    else if (
      callData?.analysis?.transcript
    ) {
      transcript =
        callData.analysis.transcript;
    }

    // Processed messages
    else if (
      Array.isArray(
        callData?.messages_processed
      )
    ) {
      transcript =
        callData.messages_processed
          .map((message) => {
            return `${
              message?.speaker ||
              "Speaker"
            }:\n${
              message?.text || ""
            }`;
          })
          .filter(Boolean)
          .join("\n\n---\n\n");
    }

    // -----------------------------------------------------
    // If transcript unavailable, use Groq
    // -----------------------------------------------------

    if (!transcript) {
      console.log(
        "No transcript from Bland.ai. Generating fallback transcript..."
      );

      const job = await Job.findById(
        application.job
      );

      const applicant = await User.findById(
        application.applicant
      );

      const storedQuestions =
        application.aiInterview?.questions ||
        "Job-related technical questions";

      const sleep = (ms) =>
        new Promise((resolve) =>
          setTimeout(resolve, ms)
        );

      const maxRetries = 3;

      for (
        let attempt = 0;
        attempt < maxRetries;
        attempt++
      ) {
        try {
          const groqResponse =
            await groq.chat.completions.create({
              model:
                "openai/gpt-oss-120b",

              messages: [
                {
                  role: "user",

                  content: `
You are a professional interview transcriber.

Based on the following call information,
generate a realistic interview transcript
between an AI interviewer and a candidate.

Call Duration:
${callData?.duration || "Unknown"} seconds

Job Title:
${job?.jobDetails?.title || "Unknown"}

Candidate Name:
${applicant?.fullname || "Candidate"}

Interview Questions:
${storedQuestions}

Call Status:
${callData?.status || "completed"}

Generate the transcript in this format:

AI Agent: [question or statement]
Candidate: [response]

Make it professional and conversational.
Focus on technical questions and answers relevant
to the job.
                  `,
                },
              ],

              temperature: 0.7,

              max_tokens: 1500,
            });

          transcript =
            groqResponse
              ?.choices?.[0]
              ?.message?.content || "";

          console.log(
            "✓ Transcript generated using Groq"
          );

          break;
        } catch (groqError) {
          if (
            groqError?.status === 429 &&
            attempt < maxRetries - 1
          ) {
            const retryAfter = parseInt(
              groqError?.headers?.[
                "retry-after"
              ] || "10",
              10
            );

            console.warn(
              `Groq rate limited. Retrying in ${retryAfter}s...`
            );

            await sleep(
              retryAfter * 1000
            );
          } else {
            console.error(
              "Groq API error:",
              groqError?.message
            );

            transcript = `Call Summary:
- Duration: ${
              callData?.duration ||
              "Unknown"
            } seconds
- Status: ${
              callData?.status ||
              "completed"
            }
- Candidate: ${
              applicant?.fullname ||
              "Unknown"
            }
- Job: ${
              job?.jobDetails?.title ||
              "Unknown"
            }

Note: Full transcript is being processed. Please try again in a few moments.`;

            break;
          }
        }
      }
    }

    // -----------------------------------------------------
    // Recording URL
    // -----------------------------------------------------

    const recording =
      callData?.recording_url ||
      callData?.recordingUrl ||
      callData?.recording ||
      null;

    // -----------------------------------------------------
    // Determine interview status
    // -----------------------------------------------------

    const normalizedStatus =
      String(
        callData?.status || ""
      )
        .toLowerCase()
        .trim();

    const interviewCompleted = [
      "completed",
      "complete",
      "ended",
      "finished",
    ].includes(normalizedStatus);

    // -----------------------------------------------------
    // Save transcript
    // -----------------------------------------------------

    application.aiInterview.transcript =
      transcript.trim();

    // Save recording
    if (recording) {
      application.aiInterview.recordingUrl =
        recording;
    }

    // Update interview status
    if (interviewCompleted) {
      application.aiInterview.status =
        "Completed";
    }

    // -----------------------------------------------------
    // Mark logs as saved
    // -----------------------------------------------------

    if (
      application.aiInterview.transcript ||
      application.aiInterview.recordingUrl
    ) {
      application.aiInterview.logsSaved =
        true;
    }

    // -----------------------------------------------------
    // Save application
    // -----------------------------------------------------

    await application.save();

    console.log(
      "✅ Interview logs saved:",
      {
        applicationId,
        callId,
        status:
          application.aiInterview.status,
        logsSaved:
          application.aiInterview.logsSaved,
      }
    );

    // -----------------------------------------------------
    // Final response
    // -----------------------------------------------------

    return res.json({
      success: true,

      transcript:
        application.aiInterview.transcript ||
        "",

      recording:
        application.aiInterview.recordingUrl ||
        null,

      logsSaved:
        application.aiInterview.logsSaved ||
        false,

      aiInterview: {
        status:
          application.aiInterview.status,

        blandCallId:
          application.aiInterview.blandCallId,

        transcript:
          application.aiInterview.transcript ||
          "",

        recordingUrl:
          application.aiInterview.recordingUrl ||
          "",

        logsSaved:
          application.aiInterview.logsSaved ||
          false,
      },

      callData: {
        status:
          callData?.status ||
          application.aiInterview.status,

        duration:
          callData?.duration || null,

        from:
          callData?.from || null,

        to:
          callData?.to || null,

        createdAt:
          callData?.created_at ||
          callData?.createdAt ||
          null,

        blandCallId:
          callId,
      },
    });
  } catch (error) {
    console.error(
      "========== FETCH CALL LOGS ERROR =========="
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Status:",
      error?.response?.status
    );

    console.error(
      "Response:",
      error?.response?.data
    );

    console.error(
      "============================================"
    );

    return res.status(500).json({
      success: false,

      error:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch call logs",
    });
  }
};