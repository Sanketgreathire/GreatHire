import fs from "fs";
import path from "path";

/**
 * Extract raw text from a resume file (PDF or DOCX).
 * Returns empty string on failure — never throws.
 */
export async function extractResumeText(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".pdf") {
      return await extractFromPdf(filePath);
    }

    if (ext === ".doc" || ext === ".docx") {
      return await extractFromDocx(filePath);
    }

    return "";
  } catch {
    return "";
  }
}

async function extractFromPdf(filePath) {
  try {
    // Dynamic import — only loads when needed
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch {
    return "";
  }
}

async function extractFromDocx(filePath) {
  try {
    const mammoth = (await import("mammoth")).default;
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || "";
  } catch {
    return "";
  }
}

/**
 * Parse structured fields from raw resume text.
 * Basic heuristic extraction — replace with AI/NLP later.
 */
export function parseResumeFields(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  return {
    emails:           extractEmails(text),
    phones:           extractPhones(text),
    skills:           extractSkills(text),
    totalExperience:  extractExperience(text),
    currentCompany:   extractCurrentCompany(lines),
    designation:      extractDesignation(lines),
    location:         extractLocation(text),
    education:        extractEducation(lines),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractEmails(text) {
  const matches = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];
  return [...new Set(matches)].slice(0, 3);
}

function extractPhones(text) {
  const matches = text.match(/(\+?\d[\d\s\-().]{8,14}\d)/g) || [];
  return [...new Set(matches.map((p) => p.replace(/\s+/g, "")))].slice(0, 3);
}

function extractSkills(text) {
  const COMMON_SKILLS = [
    "JavaScript","TypeScript","React","Node.js","Python","Java","C++","C#","Go","Ruby",
    "PHP","Swift","Kotlin","SQL","MongoDB","PostgreSQL","MySQL","Redis","Docker",
    "Kubernetes","AWS","Azure","GCP","Git","REST","GraphQL","HTML","CSS","Tailwind",
    "Angular","Vue","Django","Flask","Spring","Express","Next.js","Machine Learning",
    "Deep Learning","TensorFlow","PyTorch","NLP","Data Science","Power BI","Tableau",
    "Excel","SAP","Salesforce","Figma","Photoshop","AutoCAD","Revit","Linux","DevOps",
    "CI/CD","Jenkins","Terraform","Ansible","Selenium","JIRA","Agile","Scrum",
  ];
  const lower = text.toLowerCase();
  return COMMON_SKILLS.filter((s) => lower.includes(s.toLowerCase())).slice(0, 20);
}

function extractExperience(text) {
  // "5 years", "5+ years", "5.5 years experience"
  const match = text.match(/(\d+(?:\.\d+)?)\s*\+?\s*years?\s*(?:of\s+)?(?:experience|exp)/i);
  if (match) return parseFloat(match[1]);

  // "2019 - 2024" style — rough estimate
  const yearMatches = text.match(/\b(20\d{2})\b/g);
  if (yearMatches && yearMatches.length >= 2) {
    const years = yearMatches.map(Number).sort();
    const diff = years[years.length - 1] - years[0];
    if (diff > 0 && diff < 40) return diff;
  }
  return 0;
}

function extractCurrentCompany(lines) {
  const keywords = ["current", "present", "working at", "employed at"];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (keywords.some((k) => lower.includes(k))) {
      return line.replace(/current|present|working at|employed at/gi, "").replace(/[-:|]/g, "").trim().slice(0, 80);
    }
  }
  return "";
}

function extractDesignation(lines) {
  const TITLES = [
    "engineer","developer","analyst","manager","designer","architect","lead","consultant",
    "specialist","executive","officer","director","intern","associate","senior","junior",
  ];
  for (const line of lines.slice(0, 10)) {
    const lower = line.toLowerCase();
    if (TITLES.some((t) => lower.includes(t)) && line.length < 80) {
      return line.slice(0, 80);
    }
  }
  return "";
}

function extractLocation(text) {
  const CITIES = [
    "Hyderabad","Bangalore","Mumbai","Delhi","Chennai","Pune","Kolkata","Ahmedabad",
    "Noida","Gurgaon","Gurugram","Chandigarh","Jaipur","Kochi","Coimbatore",
    "Visakhapatnam","Vizag","Indore","Bhopal","Lucknow","Nagpur","Surat",
    "Remote","Work from Home","WFH",
  ];
  for (const city of CITIES) {
    if (text.toLowerCase().includes(city.toLowerCase())) return city;
  }
  return "";
}

function extractEducation(lines) {
  const DEGREES = ["b.tech","m.tech","bca","mca","b.sc","m.sc","mba","bba","b.e","m.e","phd","diploma","b.com","m.com"];
  const results = [];
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (DEGREES.some((d) => lower.includes(d))) {
      results.push({ degree: line.slice(0, 100), institution: "", year: "" });
      if (results.length >= 3) break;
    }
  }
  return results;
}
