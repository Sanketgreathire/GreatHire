/**
 * linkedinParser.js
 * Parses LinkedIn profile URLs using public data scraping via proxycurl-style
 * approach. Falls back to manual data extraction from URL + user-provided data.
 * 
 * For production scale (100M candidates), use:
 * - Proxycurl API (paid, $0.01/profile)
 * - PhantomBuster LinkedIn Agent
 * - Or manual CSV export from LinkedIn Recruiter
 */
import axios from "axios";

const PROXYCURL_KEY = process.env.PROXYCURL_API_KEY || "";
const TIMEOUT = 15000;

/**
 * Extract LinkedIn username/ID from URL
 */
export function extractLinkedinUsername(url) {
  if (!url) return null;
  const match = url.trim().match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Parse LinkedIn profile via Proxycurl API (if key available)
 * Falls back to basic data from URL
 */
export async function parseLinkedinProfile(linkedinUrl) {
  const username = extractLinkedinUsername(linkedinUrl);
  if (!username) throw new Error("Invalid LinkedIn profile URL. Expected: https://linkedin.com/in/username");

  // ── Try Proxycurl if API key is set ──────────────────────────────────────
  if (PROXYCURL_KEY) {
    try {
      const { data } = await axios.get("https://nubela.co/proxycurl/api/v2/linkedin", {
        params: { url: linkedinUrl, skills: "include", extra: "include" },
        headers: { Authorization: `Bearer ${PROXYCURL_KEY}` },
        timeout: TIMEOUT,
      });

      return mapProxycurlToCandidate(data, linkedinUrl);
    } catch (err) {
      if (err.response?.status === 404) throw new Error(`LinkedIn profile "${username}" not found.`);
      if (err.response?.status === 429) throw new Error("Proxycurl rate limit exceeded.");
      // Fall through to basic parse
      console.warn("Proxycurl failed, using basic parse:", err.message);
    }
  }

  // ── Basic parse — return skeleton with LinkedIn URL ───────────────────────
  // Recruiter fills in details manually or via CSV
  return {
    fullName:        username.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    emails:          [],
    phones:          [],
    skills:          [],
    designation:     "",
    currentCompany:  "",
    location:        "",
    summary:         "",
    linkedinUrl:     linkedinUrl.trim(),
    githubUrl:       "",
    portfolioUrl:    "",
    totalExperience: 0,
    education:       [],
    _source:         "linkedin_basic",
  };
}

function mapProxycurlToCandidate(data, linkedinUrl) {
  const skills = (data.skills || []).map((s) => s.name || s).filter(Boolean).slice(0, 30);

  const experiences = data.experiences || [];
  const currentExp  = experiences.find((e) => !e.ends_at) || experiences[0] || {};

  // Calculate total experience in years
  let totalExp = 0;
  for (const exp of experiences) {
    const start = exp.starts_at ? new Date(exp.starts_at.year, (exp.starts_at.month || 1) - 1) : null;
    const end   = exp.ends_at   ? new Date(exp.ends_at.year,   (exp.ends_at.month   || 1) - 1) : new Date();
    if (start) totalExp += (end - start) / (1000 * 60 * 60 * 24 * 365);
  }

  const education = (data.education || []).slice(0, 3).map((e) => ({
    degree:      e.degree_name || "",
    institution: e.school      || "",
    year:        e.ends_at?.year?.toString() || "",
  }));

  return {
    fullName:        `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.full_name || "",
    emails:          data.personal_emails || [],
    phones:          data.personal_numbers || [],
    skills,
    designation:     currentExp.title || data.headline || "",
    currentCompany:  currentExp.company || "",
    location:        data.city || data.country_full_name || "",
    summary:         (data.summary || "").slice(0, 500),
    linkedinUrl:     linkedinUrl.trim(),
    githubUrl:       "",
    portfolioUrl:    "",
    totalExperience: Math.round(totalExp * 10) / 10,
    education,
    _source:         "linkedin_proxycurl",
  };
}
