/**
 * jdParserService.js
 * Extracts structured fields from raw job description text.
 * Uses heuristic NLP — replace with Gemini/GPT call for production accuracy.
 */
import { normalizeSkills } from "../../sourcing/services/normalizationService.js";

// ── Skill dictionary ──────────────────────────────────────────────────────────
const ALL_SKILLS = [
  "JavaScript","TypeScript","React","Node.js","Python","Java","C++","C#","Go","Ruby","PHP",
  "Swift","Kotlin","SQL","MongoDB","PostgreSQL","MySQL","Redis","Docker","Kubernetes","AWS",
  "Azure","GCP","Git","REST API","GraphQL","HTML","CSS","Tailwind CSS","Angular","Vue.js",
  "Next.js","Express.js","Django","Flask","FastAPI","Spring Boot","Machine Learning",
  "Deep Learning","TensorFlow","PyTorch","NLP","Data Science","Power BI","Tableau","Excel",
  "SAP","Salesforce","Figma","Photoshop","AutoCAD","Revit","Linux","DevOps","CI/CD",
  "Jenkins","Terraform","Ansible","Selenium","JIRA","Agile","Scrum","Microservices",
  "React Native","Flutter","Elasticsearch","Kafka","RabbitMQ","gRPC","Spark","Hadoop",
];

// ── Seniority keywords ────────────────────────────────────────────────────────
const SENIORITY_MAP = [
  { level: "intern",    keywords: ["intern","internship","trainee","fresher"] },
  { level: "junior",    keywords: ["junior","jr","entry level","entry-level","0-2 years","1-2 years"] },
  { level: "mid",       keywords: ["mid level","mid-level","2-5 years","3-5 years","associate"] },
  { level: "senior",    keywords: ["senior","sr","5+ years","5-8 years","experienced"] },
  { level: "lead",      keywords: ["lead","tech lead","team lead","8+ years","8-12 years"] },
  { level: "principal", keywords: ["principal","staff","architect","10+ years","12+ years"] },
  { level: "manager",   keywords: ["manager","head of","director","vp","vice president"] },
];

// ── Domain/Industry map ───────────────────────────────────────────────────────
const DOMAIN_MAP = [
  { domain: "fintech",    keywords: ["fintech","finance","banking","payments","blockchain","crypto","trading"] },
  { domain: "healthtech", keywords: ["health","medical","healthcare","hospital","pharma","clinical"] },
  { domain: "edtech",     keywords: ["education","edtech","learning","e-learning","lms","school"] },
  { domain: "ecommerce",  keywords: ["ecommerce","e-commerce","retail","marketplace","shopping"] },
  { domain: "saas",       keywords: ["saas","b2b","enterprise software","platform","cloud product"] },
  { domain: "gaming",     keywords: ["gaming","game","unity","unreal","mobile game"] },
  { domain: "logistics",  keywords: ["logistics","supply chain","warehouse","delivery","fleet"] },
  { domain: "ai_ml",      keywords: ["artificial intelligence","machine learning","ai","ml","data science"] },
  { domain: "cybersecurity", keywords: ["security","cybersecurity","infosec","penetration","soc"] },
  { domain: "iot",        keywords: ["iot","embedded","firmware","hardware","raspberry","arduino"] },
];

// ── Education keywords ────────────────────────────────────────────────────────
const EDU_MAP = [
  { req: "PhD",      keywords: ["phd","doctorate","research degree"] },
  { req: "Masters",  keywords: ["masters","m.tech","mca","mba","m.sc","postgraduate","post-graduate"] },
  { req: "Bachelors",keywords: ["bachelor","b.tech","b.e","bca","b.sc","undergraduate","degree"] },
  { req: "Diploma",  keywords: ["diploma","polytechnic"] },
];

/**
 * Parse a raw job description into structured fields.
 * @param {string} rawText  - Full JD text
 * @param {Object} jobData  - Existing job fields from DB (title, skills, experience, location)
 * @returns {Object} parsedData
 */
export function parseJobDescription(rawText, jobData = {}) {
  const text  = (rawText || "").toLowerCase();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // ── 1. Skills extraction ──────────────────────────────────────────────────
  const requiredSkills  = [];
  const preferredSkills = [];

  // Find "required" and "preferred" sections
  let inRequired  = false;
  let inPreferred = false;

  for (const line of lines) {
    if (/required|must.have|mandatory|essential/i.test(line)) { inRequired = true; inPreferred = false; }
    if (/preferred|nice.to.have|good.to.have|bonus|plus/i.test(line)) { inPreferred = true; inRequired = false; }

    for (const skill of ALL_SKILLS) {
      if (line.includes(skill.toLowerCase())) {
        if (inPreferred) {
          if (!preferredSkills.includes(skill)) preferredSkills.push(skill);
        } else {
          if (!requiredSkills.includes(skill)) requiredSkills.push(skill);
        }
      }
    }
  }

  // Merge job.skills into required if not already found
  const existingSkills = jobData.skills || [];
  for (const s of existingSkills) {
    if (!requiredSkills.includes(s) && !preferredSkills.includes(s)) {
      requiredSkills.push(s);
    }
  }

  // ── 2. Experience range ───────────────────────────────────────────────────
  let minExp = 0, maxExp = 99;

  // Patterns: "3-5 years", "5+ years", "minimum 3 years", "upto 8 years"
  const expPatterns = [
    /(\d+)\s*[-–to]+\s*(\d+)\s*years?/i,
    /(\d+)\+\s*years?/i,
    /minimum\s+(\d+)\s*years?/i,
    /at\s+least\s+(\d+)\s*years?/i,
    /(\d+)\s*years?\s+(?:of\s+)?experience/i,
  ];

  for (const pat of expPatterns) {
    const m = text.match(pat);
    if (m) {
      if (m[2]) { minExp = parseInt(m[1]); maxExp = parseInt(m[2]); }
      else       { minExp = parseInt(m[1]); maxExp = minExp + 3; }
      break;
    }
  }

  // Use job.experience field as fallback
  if (minExp === 0 && jobData.experience) {
    const em = String(jobData.experience).match(/(\d+)/);
    if (em) { minExp = parseInt(em[1]); maxExp = minExp + 3; }
  }

  // ── 3. Seniority level ────────────────────────────────────────────────────
  let seniorityLevel = "";
  for (const { level, keywords } of SENIORITY_MAP) {
    if (keywords.some((k) => text.includes(k))) { seniorityLevel = level; break; }
  }
  // Infer from experience if not found
  if (!seniorityLevel) {
    if (minExp === 0)       seniorityLevel = "junior";
    else if (minExp <= 2)   seniorityLevel = "junior";
    else if (minExp <= 5)   seniorityLevel = "mid";
    else if (minExp <= 8)   seniorityLevel = "senior";
    else                    seniorityLevel = "lead";
  }

  // ── 4. Domain / Industry ──────────────────────────────────────────────────
  let domain = "", industry = "";
  for (const { domain: d, keywords } of DOMAIN_MAP) {
    if (keywords.some((k) => text.includes(k))) { domain = d; industry = d; break; }
  }

  // ── 5. Education requirement ──────────────────────────────────────────────
  let educationReq = "";
  for (const { req, keywords } of EDU_MAP) {
    if (keywords.some((k) => text.includes(k))) { educationReq = req; break; }
  }

  // ── 6. Location ───────────────────────────────────────────────────────────
  const location = jobData.location || extractLocation(text);

  // ── 7. Designation ────────────────────────────────────────────────────────
  const designation = jobData.title || extractDesignation(lines);

  // ── 8. Job summary (first 3 meaningful lines) ─────────────────────────────
  const jobSummary = lines.slice(0, 5).join(" ").substring(0, 400);

  // ── 9. Hidden requirements (inferred) ────────────────────────────────────
  const hiddenRequirements = inferHiddenRequirements(text, domain, seniorityLevel);

  // ── 10. Normalize skills ──────────────────────────────────────────────────
  const normalizedSkills = normalizeSkills([...requiredSkills, ...preferredSkills]);

  return {
    requiredSkills:     [...new Set(requiredSkills)],
    preferredSkills:    [...new Set(preferredSkills)],
    designation,
    minExperience:      minExp,
    maxExperience:      maxExp,
    seniorityLevel,
    industry,
    domain,
    location,
    educationReq,
    jobSummary,
    hiddenRequirements,
    normalizedSkills,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractLocation(text) {
  const CITIES = [
    "hyderabad","bangalore","bengaluru","mumbai","delhi","chennai","pune","kolkata",
    "noida","gurgaon","gurugram","ahmedabad","jaipur","kochi","coimbatore",
    "visakhapatnam","vizag","indore","bhopal","lucknow","nagpur","surat",
    "remote","work from home","wfh","hybrid",
  ];
  for (const city of CITIES) {
    if (text.includes(city)) return city.charAt(0).toUpperCase() + city.slice(1);
  }
  return "";
}

function extractDesignation(lines) {
  const TITLES = [
    "engineer","developer","analyst","manager","designer","architect","lead",
    "consultant","specialist","executive","officer","director","intern","associate",
  ];
  for (const line of lines.slice(0, 5)) {
    if (TITLES.some((t) => line.includes(t)) && line.length < 80) {
      return line.substring(0, 80);
    }
  }
  return "";
}

function inferHiddenRequirements(text, domain, seniority) {
  const hidden = [];

  if (text.includes("startup") || text.includes("fast-paced")) {
    hidden.push("startup mindset", "self-starter", "adaptability");
  }
  if (text.includes("team lead") || seniority === "lead") {
    hidden.push("mentoring ability", "code review", "technical leadership");
  }
  if (domain === "fintech") {
    hidden.push("financial domain knowledge", "compliance awareness");
  }
  if (text.includes("client") || text.includes("stakeholder")) {
    hidden.push("communication skills", "client-facing experience");
  }
  if (text.includes("agile") || text.includes("scrum")) {
    hidden.push("agile methodology", "sprint planning");
  }
  if (text.includes("scale") || text.includes("high traffic") || text.includes("distributed")) {
    hidden.push("distributed systems", "performance optimization", "scalability");
  }

  return [...new Set(hidden)];
}

/**
 * Build a rich text string from parsed JD for embedding.
 */
export function buildJdEmbeddingText(parsedData, rawTitle = "") {
  const parts = [];
  if (rawTitle)                          parts.push(rawTitle);
  if (parsedData.designation)            parts.push(parsedData.designation);
  if (parsedData.seniorityLevel)         parts.push(`${parsedData.seniorityLevel} level`);
  if (parsedData.requiredSkills.length)  parts.push("Required: " + parsedData.requiredSkills.join(", "));
  if (parsedData.preferredSkills.length) parts.push("Preferred: " + parsedData.preferredSkills.join(", "));
  if (parsedData.domain)                 parts.push(`Domain: ${parsedData.domain}`);
  if (parsedData.location)               parts.push(`Location: ${parsedData.location}`);
  if (parsedData.minExperience > 0)      parts.push(`${parsedData.minExperience}-${parsedData.maxExperience} years experience`);
  if (parsedData.hiddenRequirements.length) parts.push(parsedData.hiddenRequirements.join(", "));
  if (parsedData.jobSummary)             parts.push(parsedData.jobSummary.substring(0, 300));
  return parts.join(" | ");
}
