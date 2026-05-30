/**
 * manualImport.js
 * Handles:
 * 1. Single manual candidate entry
 * 2. Bulk JSON import (from any portal export)
 * 3. LinkedIn profile URL import
 * 4. Bulk LinkedIn URLs import
 */
import { ingestCandidate, ingestBatch } from "./ingestionService.js";
import { parseLinkedinProfile }         from "../parsers/linkedinParser.js";
import { parseGithubProfile }           from "../parsers/githubParser.js";

/**
 * Import a single candidate manually (form data)
 */
export async function importManualCandidate(rawData, recruiterId) {
  const sourceInfo = { sourceType: "MANUAL", batchId: "", sourceUrl: "" };
  return ingestCandidate(rawData, recruiterId, sourceInfo);
}

/**
 * Import from LinkedIn URL
 */
export async function importLinkedinProfile(linkedinUrl, recruiterId) {
  const raw = await parseLinkedinProfile(linkedinUrl);
  const sourceInfo = { sourceType: "PUBLIC_PROFILE", sourceUrl: linkedinUrl, batchId: "" };
  return ingestCandidate(raw, recruiterId, sourceInfo);
}

/**
 * Bulk import from array of LinkedIn URLs
 */
export async function importBulkLinkedinUrls(urls, recruiterId) {
  const stats = { total: urls.length, created: 0, duplicates: 0, failed: 0, errors: [] };

  for (const url of urls) {
    try {
      const raw = await parseLinkedinProfile(url.trim());
      const sourceInfo = { sourceType: "PUBLIC_PROFILE", sourceUrl: url.trim(), batchId: "" };
      const result = await ingestCandidate(raw, recruiterId, sourceInfo);
      if      (result.status === "created")   stats.created++;
      else if (result.status === "duplicate") stats.duplicates++;
      else { stats.failed++; stats.errors.push({ url, error: result.error }); }
    } catch (err) {
      stats.failed++;
      stats.errors.push({ url, error: err.message });
    }
  }
  return stats;
}

/**
 * Bulk import from JSON array (exported from any portal — Naukri, Indeed, etc.)
 * Expected format: array of objects with any of these fields:
 * name/fullName, email, phone, skills, designation, company, location, experience, linkedin, github
 */
export async function importBulkJson(candidates, recruiterId, sourceLabel = "API_IMPORT") {
  const normalized = candidates.map(mapPortalCandidate);
  const sourceInfo = { sourceType: sourceLabel, batchId: `bulk_${Date.now()}`, sourceUrl: "" };
  return ingestBatch(normalized, recruiterId, sourceInfo);
}

/**
 * Map any portal's candidate format to our schema
 */
function mapPortalCandidate(raw) {
  const get = (...keys) => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null && String(raw[k]).trim() !== "") {
        return String(raw[k]).trim();
      }
    }
    return "";
  };

  const emailRaw = get("email", "Email", "EMAIL", "email_address", "emailAddress");
  const phoneRaw = get("phone", "Phone", "mobile", "Mobile", "contact", "phone_number");
  const skillsRaw = get("skills", "Skills", "skill_set", "skillSet", "key_skills", "keySkills");

  return {
    fullName:        get("fullName", "full_name", "name", "Name", "candidate_name", "candidateName"),
    emails:          emailRaw ? [emailRaw.toLowerCase()] : [],
    phones:          phoneRaw ? [phoneRaw.replace(/\s+/g, "")] : [],
    skills:          skillsRaw ? skillsRaw.split(/[,;|]/).map((s) => s.trim()).filter(Boolean) : [],
    designation:     get("designation", "title", "job_title", "jobTitle", "role", "current_role", "currentRole", "position"),
    currentCompany:  get("currentCompany", "current_company", "company", "employer", "organization"),
    location:        get("location", "city", "Location", "City", "current_location"),
    totalExperience: parseFloat(get("totalExperience", "total_experience", "experience", "exp", "years_exp", "experience_years")) || 0,
    linkedinUrl:     get("linkedinUrl", "linkedin_url", "linkedin", "LinkedIn", "linkedin_profile"),
    githubUrl:       get("githubUrl", "github_url", "github", "GitHub"),
    summary:         get("summary", "bio", "about", "profile_summary", "objective"),
    education:       [],
  };
}
