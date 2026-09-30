/**
 * AI Screening & Scoring Engine
 *
 * Compares a candidate's profile against a job's:
 * - Skills
 * - Qualifications
 * - Experience
 *
 * Scoring:
 * - Skills         = 60%
 * - Experience     = 25%
 * - Qualifications = 15%
 *
 * Threshold:
 * - 75+  = Shortlisted
 * - <75  = Rejected
 */

import { Application } from "../models/application.model.js";
import StageHistory from "../models/stageHistory.model.js";
import notificationService from "../utils/notificationService.js";
import mongoose from "mongoose";
import { syncApplicationToSheet } from "./googleSheetsSyncService.js";
import { retryWithBackoff } from "./retryWithBackoff.js";

/**
 * Convert different possible values into a clean array of strings.
 */
const normalizeArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "string") return [item];

        if (item && typeof item === "object") {
          return [
            item.name,
            item.skill,
            item.title,
            item.value,
            item.jobProfile,
            item.experienceDetails,
          ].filter(Boolean);
        }

        return [];
      })
      .map((item) => String(item).trim().toLowerCase())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[,;\n|]/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
};

/**
 * Normalize text for comparison.
 */
const normalizeText = (value) => {
  if (!value) return "";

  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Check how many required items exist in candidate items.
 */
const calculateMatchPercentage = (candidateItems, requiredItems) => {
  const candidate = normalizeArray(candidateItems);
  const required = normalizeArray(requiredItems);

  if (required.length === 0) return 100;
  if (candidate.length === 0) return 0;

  let matched = 0;

  for (const requiredItem of required) {
    const requiredText = normalizeText(requiredItem);

    const isMatched = candidate.some((candidateItem) => {
      const candidateText = normalizeText(candidateItem);
      return (
        candidateText === requiredText ||
        candidateText.includes(requiredText) ||
        requiredText.includes(candidateText)
      );
    });

    if (isMatched) matched++;
  }

  return Math.round((matched / required.length) * 100);
};

/**
 * Convert experience value to years.
 */
const parseExperienceYears = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  if (typeof value === "object") {
    return Math.max(
      parseExperienceYears(value.duration),
      parseExperienceYears(value.experienceDetails),
      parseExperienceYears(value.totalExperience),
      parseExperienceYears(value.yearsOfExperience)
    );
  }

  const text = String(value).toLowerCase();
  const yearsMatch = text.match(/(\d+(?:\.\d+)?)\s*\+?\s*years?/);
  if (yearsMatch) return Number(yearsMatch[1]);

  const monthsMatch = text.match(/(\d+(?:\.\d+)?)\s*\+?\s*months?/);
  if (monthsMatch) return Number(monthsMatch[1]) / 12;

  const numberMatch = text.match(/\d+(?:\.\d+)?/);
  return numberMatch ? Number(numberMatch[0]) : 0;
};

/**
 * Extract minimum required experience from a job.
 */
const getRequiredExperience = (job) => {
  return parseExperienceYears(
    job?.experience ??
      job?.experienceRequired ??
      job?.requiredExperience ??
      job?.minExperience ??
      job?.yearsOfExperience ??
      job?.jobDetails?.experience
  );
};

/**
 * Extract candidate's total experience.
 */
const getCandidateExperience = (profile) => {
  if (Array.isArray(profile?.experiences) && profile.experiences.length > 0) {
    return profile.experiences.reduce((total, exp) => {
      return total + Math.max(
        parseExperienceYears(exp?.duration),
        parseExperienceYears(exp?.experienceDetails)
      );
    }, 0);
  }

  const directExperience =
    profile?.experience?.duration ??
    profile?.experience?.experienceDetails ??
    profile?.experience ??
    profile?.totalExperience ??
    profile?.yearsOfExperience ??
    profile?.experienceYears;

  if (
    directExperience !== undefined &&
    directExperience !== null &&
    directExperience !== ""
  ) {
    return parseExperienceYears(directExperience);
  }

  return 0;
};

/**
 * Calculate experience score percentage.
 */
const calculateExperiencePercentage = (candidateProfile, job) => {
  const candidateExperience = getCandidateExperience(candidateProfile);
  const requiredExperience = getRequiredExperience(job);

  if (requiredExperience <= 0) return 100;
  if (candidateExperience <= 0) return 0;
  if (candidateExperience >= requiredExperience) return 100;

  return Math.round((candidateExperience / requiredExperience) * 100);
};

/**
 * Extract candidate qualifications.
 */
const getCandidateQualifications = (profile) => {
  return (
    profile?.qualifications ??
    profile?.qualification ??
    profile?.education ??
    profile?.degrees ??
    profile?.certifications ??
    []
  );
};

/**
 * Extract job qualifications.
 */
const getJobQualifications = (job) => {
  return (
    job?.qualifications ??
    job?.qualification ??
    job?.education ??
    job?.requirements ??
    job?.jobDetails?.qualifications ??
    []
  );
};

/**
 * Main pure calculation function.
 */
export const calculateScreeningScore = (candidateProfile = {}, job = {}) => {
  const candidateSkills =
    candidateProfile?.skills ??
    candidateProfile?.technicalSkills ??
    candidateProfile?.skillSet ??
    [];

  const jobSkills =
    job?.skills ??
    job?.requiredSkills ??
    job?.technicalSkills ??
    job?.jobDetails?.skills ??
    [];

  const candidateQualifications = getCandidateQualifications(candidateProfile);
  const jobQualifications = getJobQualifications(job);

  const skillsScore = calculateMatchPercentage(candidateSkills, jobSkills);
  const experienceScore = calculateExperiencePercentage(candidateProfile, job);
  const qualificationScore = calculateMatchPercentage(
    candidateQualifications,
    jobQualifications
  );

  const finalScore = Math.round(
    skillsScore * 0.6 + experienceScore * 0.25 + qualificationScore * 0.15
  );

  const score = Math.max(0, Math.min(100, finalScore));

  return {
    score,
    breakdown: {
      skills: skillsScore,
      experience: experienceScore,
      qualifications: qualificationScore,
    },
  };
};

/**
 * Enrich candidate profile with resume text data if profile skills/experience are missing.
 */
export const getEnrichedCandidateProfile = async (candidateProfile = {}, resumeUrl = "") => {
  const profile = { ...(candidateProfile || {}) };
  const hasSkills = Array.isArray(profile.skills) && profile.skills.length > 0;
  const hasExperience =
    getCandidateExperience(profile) > 0 ||
    Boolean(profile.experience?.duration || profile.experience?.experienceDetails);
  const hasQualification = Boolean(
    profile.qualification ||
      profile.qualifications ||
      profile.education ||
      profile.degrees ||
      profile.certifications
  );

  if ((!hasSkills || !hasExperience || !hasQualification) && resumeUrl) {
    try {
      const { extractResumeText } = await import("./interview.service.js");
      const { parseResumeFields } = await import("../controllers/sourcing/resumeParser.service.js");
      const text = await extractResumeText(resumeUrl);
      if (text) {
        const parsed = parseResumeFields(text);
        if (parsed.skills?.length) {
          profile.skills = parsed.skills;
        }
        if (!profile.experiences?.length && parsed.totalExperience) {
          profile.experience = parsed.totalExperience;
        }
        if (!hasQualification && parsed.education?.length) {
          profile.qualification = parsed.education
            .map((education) => education.degree)
            .filter(Boolean)
            .join(", ");
        }
      }
    } catch (e) {
      // Non-blocking fallback
    }
  }

  return profile;
};

/**
 * Centralized FSM transition for Application status and ATS pipeline stages.
 * Reusable across automated screening, manual scoring, and recruiter override.
 */
export const applyApplicationTransition = async ({
  application,
  decision, // "Shortlisted" | "Rejected" | "Interview Schedule" | "Pending"
  score = null,
  changedBy = null,
  notify = true,
}) => {
  if (!application) throw new Error("Application is required for stage transition");

  const previousStatus = application.status || "Pending";
  const fromStage = application.recruitmentStatus || "Application";

  application.status = decision;

  if (score !== null && score !== undefined && !isNaN(Number(score))) {
    const intScore = Math.max(0, Math.min(100, Math.round(Number(score))));
    application.matchScore = intScore;
  }

  if (decision === "Shortlisted") {
    application.screeningStatus = "Passed";
    application.recruitmentStatus = "Shortlisted";
  } else if (decision === "Rejected") {
    application.screeningStatus = "Rejected";
    application.recruitmentStatus = "Application";
  } else if (decision === "Interview Schedule") {
    application.recruitmentStatus = "Interview";
  } else if (decision === "Pending") {
    application.screeningStatus = "Pending";
    application.recruitmentStatus = "Application";
  }

    const toStage = application.recruitmentStatus;

  await application.save();

  // Sync to Google Sheets (Task 1 — Excel Sync), with retry + DLQ (Task 3)
  retryWithBackoff(
    () => syncApplicationToSheet(application),
    {
      jobType: "sheet-sync",
      payload: {
        applicationId: application._id,
        status: application.status,
      },
    }
  ).catch((err) => {
    console.error("Retry wrapper itself failed unexpectedly:", err.message);
  });

  // Record transition in StageHistory if stage changed
  try {
    const validChangedBy = changedBy && mongoose.Types.ObjectId.isValid(changedBy)
      ? changedBy
      : (application.applicant?._id || (mongoose.Types.ObjectId.isValid(application.applicant) ? application.applicant : null));

    if (validChangedBy && fromStage !== toStage) {
      await StageHistory.create({
        application: application._id,
        fromStage,
        toStage,
        changedBy: validChangedBy,
        changedAt: new Date(),
      });
    }
  } catch (historyError) {
    console.error("Failed to record StageHistory:", historyError.message);
  }

  // Emit real-time notification to applicant
  if (notify && previousStatus !== decision) {
    try {
      const applicantId = application.applicant?._id || application.applicant;
      const jobId = application.job?._id || application.job;
      const jobTitle = application.job?.jobDetails?.title || "your application";
      const companyName = application.job?.jobDetails?.companyName || "Company";
      const recruiterId = application.job?.created_by || changedBy;

      if (applicantId && jobId) {
        await notificationService.notifyApplicationStatusChanged({
          applicantId,
          jobId,
          jobTitle,
          companyName,
          status: decision,
          previousStatus,
          recruiterId,
        });
      }
    } catch (notifErr) {
      console.error("Failed to send status transition notification:", notifErr.message);
    }
  }

  return application;
};

/**
 * Screen an existing application in DB.
 */
export const scoreApplication = async (applicationId, changedBy = null) => {
  const application = await Application.findById(applicationId)
    .populate("applicant")
    .populate("job");

  if (!application) throw new Error("Application not found");
  if (!application.job) throw new Error("Job not found");

  const rawProfile =
    application.applicant?.profile || application.applicantProfile || {};
  const resumeUrl = application.resume || rawProfile.resume || "";

  const candidateProfile = await getEnrichedCandidateProfile(rawProfile, resumeUrl);

  const screeningResult = calculateScreeningScore(
    candidateProfile,
    application.job
  );

  const score = screeningResult.score;
  const decision = score >= 75 ? "Shortlisted" : "Rejected";

  await applyApplicationTransition({
    application,
    decision,
    score,
    changedBy,
    notify: true,
  });

  return {
    score,
    status: application.status,
    screeningStatus: application.screeningStatus,
    recruitmentStatus: application.recruitmentStatus,
    breakdown: screeningResult.breakdown,
    application,
  };
};

/**
 * Recruiter override function.
 */
export const overrideApplicationScore = async (
  applicationId,
  decision,
  changedBy = null,
  overrideScore = null
) => {
  if (!["Shortlisted", "Rejected"].includes(decision)) {
    throw new Error("Decision must be Shortlisted or Rejected");
  }

  const application = await Application.findById(applicationId)
    .populate("applicant")
    .populate("job");
  if (!application) throw new Error("Application not found");

  const parsedScore =
    overrideScore !== null && overrideScore !== undefined && !isNaN(Number(overrideScore))
      ? Math.max(0, Math.min(100, Math.round(Number(overrideScore))))
      : application.matchScore;

  await applyApplicationTransition({
    application,
    decision,
    score: parsedScore,
    changedBy,
    notify: true,
  });

  return {
    applicationId: application._id,
    decision,
    matchScore: application.matchScore,
    status: application.status,
    screeningStatus: application.screeningStatus,
    recruitmentStatus: application.recruitmentStatus,
    overridden: true,
    changedBy,
    application,
  };
};

export const screenCandidate = calculateScreeningScore;
export default calculateScreeningScore;
