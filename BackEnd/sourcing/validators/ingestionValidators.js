/**
 * ingestionValidators.js
 * Lightweight validation helpers — no external library needed.
 */

export function validateGithubUrl(url) {
  if (!url || typeof url !== "string") return "GitHub URL is required.";
  const trimmed = url.trim();
  if (!/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/.test(trimmed)) {
    return "Invalid GitHub profile URL. Expected: https://github.com/username";
  }
  return null;
}

export function validateCsvRow(row, rowIndex) {
  const errors = [];
  if (!row.fullName?.trim() && !row.full_name?.trim() && !row.name?.trim()) {
    errors.push(`Row ${rowIndex}: fullName is required`);
  }
  return errors;
}

export function extractGithubUsername(url) {
  const match = url.trim().match(/github\.com\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function extractLinkedinUsername(url) {
  if (!url) return null;
  const match = url.trim().match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Map CSV column headers to our schema fields.
 * Supports various header naming conventions.
 */
export function mapCsvHeaders(row) {
  const get = (...keys) => {
    for (const k of keys) {
      const val = row[k] || row[k.toLowerCase()] || row[k.toUpperCase()];
      if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
    }
    return "";
  };

  const skillsRaw = get("skills", "Skills", "SKILLS", "skill_set", "skillset");
  const skills = skillsRaw
    ? skillsRaw.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const emailsRaw = get("email", "Email", "EMAIL", "emails", "email_address");
  const emails = emailsRaw
    ? emailsRaw.split(/[,;]/).map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [];

  const phonesRaw = get("phone", "Phone", "PHONE", "phones", "mobile", "contact");
  const phones = phonesRaw
    ? phonesRaw.split(/[,;]/).map((p) => p.trim()).filter(Boolean)
    : [];

  return {
    fullName:        get("fullName","full_name","name","Name","Full Name","FULL_NAME"),
    emails,
    phones,
    skills,
    designation:     get("designation","Designation","title","Title","job_title","jobTitle","role","Role"),
    currentCompany:  get("currentCompany","current_company","company","Company","employer","Employer"),
    location:        get("location","Location","city","City","LOCATION"),
    totalExperience: parseFloat(get("totalExperience","total_experience","experience","Experience","exp","years_exp")) || 0,
    githubUrl:       get("githubUrl","github_url","github","Github","GitHub"),
    linkedinUrl:     get("linkedinUrl","linkedin_url","linkedin","LinkedIn"),
    summary:         get("summary","Summary","bio","Bio","about","About","profile","Profile"),
  };
}
