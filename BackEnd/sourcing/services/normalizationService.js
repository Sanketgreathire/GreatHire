/**
 * normalizationService.js
 * Canonicalizes skill names and candidate data for consistent storage.
 */

const SKILL_ALIASES = new Map([
  ["js","JavaScript"],["javascript","JavaScript"],["es6","JavaScript"],
  ["typescript","TypeScript"],["ts","TypeScript"],
  ["react","React"],["reactjs","React"],["react.js","React"],
  ["next","Next.js"],["nextjs","Next.js"],["next.js","Next.js"],
  ["vue","Vue.js"],["vuejs","Vue.js"],["angular","Angular"],["angularjs","Angular"],
  ["node","Node.js"],["nodejs","Node.js"],["node.js","Node.js"],
  ["express","Express.js"],["expressjs","Express.js"],
  ["python","Python"],["py","Python"],
  ["django","Django"],["flask","Flask"],["fastapi","FastAPI"],
  ["java","Java"],["spring","Spring Boot"],["springboot","Spring Boot"],["spring boot","Spring Boot"],
  ["mongo","MongoDB"],["mongodb","MongoDB"],
  ["postgres","PostgreSQL"],["postgresql","PostgreSQL"],["mysql","MySQL"],["sql","SQL"],
  ["redis","Redis"],["elasticsearch","Elasticsearch"],["elastic","Elasticsearch"],
  ["aws","AWS"],["amazon web services","AWS"],
  ["gcp","GCP"],["google cloud","GCP"],
  ["azure","Azure"],["microsoft azure","Azure"],
  ["docker","Docker"],["k8s","Kubernetes"],["kubernetes","Kubernetes"],
  ["ci/cd","CI/CD"],["cicd","CI/CD"],["jenkins","Jenkins"],
  ["terraform","Terraform"],["ansible","Ansible"],
  ["git","Git"],["github","GitHub"],["gitlab","GitLab"],
  ["ml","Machine Learning"],["machine learning","Machine Learning"],
  ["dl","Deep Learning"],["deep learning","Deep Learning"],
  ["nlp","NLP"],["natural language processing","NLP"],
  ["tensorflow","TensorFlow"],["tf","TensorFlow"],
  ["pytorch","PyTorch"],["torch","PyTorch"],
  ["react native","React Native"],["flutter","Flutter"],
  ["graphql","GraphQL"],["rest","REST API"],["rest api","REST API"],
  ["html","HTML"],["css","CSS"],["tailwind","Tailwind CSS"],
  ["figma","Figma"],["photoshop","Photoshop"],
  ["c++","C++"],["c#","C#"],["golang","Go"],["go","Go"],["rust","Rust"],
  ["php","PHP"],["ruby","Ruby"],["swift","Swift"],["kotlin","Kotlin"],
  ["power bi","Power BI"],["tableau","Tableau"],["excel","Excel"],
  ["sap","SAP"],["salesforce","Salesforce"],["jira","JIRA"],["agile","Agile"],["scrum","Scrum"],
]);

export function normalizeSkill(skill) {
  if (!skill || typeof skill !== "string") return null;
  const lower = skill.trim().toLowerCase();
  return SKILL_ALIASES.get(lower) || skill.trim();
}

export function normalizeSkills(skills = []) {
  const seen = new Set();
  const result = [];
  for (const s of skills) {
    const n = normalizeSkill(s);
    if (!n) continue;
    const key = n.toLowerCase();
    if (!seen.has(key)) { seen.add(key); result.push(n); }
  }
  return result;
}

function normalizeUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url.trim());
    return u.href.replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

export function normalizeCandidate(raw) {
  return {
    ...raw,
    fullName:         (raw.fullName || "").trim(),
    emails:           (raw.emails || []).map((e) => e.trim().toLowerCase()).filter(Boolean),
    phones:           (raw.phones || []).map((p) => p.replace(/\s+/g, "")).filter(Boolean),
    skills:           (raw.skills || []).map((s) => s.trim()).filter(Boolean),
    normalizedSkills: normalizeSkills(raw.skills || []),
    location:         (raw.location || "").trim(),
    currentCompany:   (raw.currentCompany || "").trim(),
    designation:      (raw.designation || "").trim(),
    githubUrl:        normalizeUrl(raw.githubUrl),
    linkedinUrl:      normalizeUrl(raw.linkedinUrl),
    totalExperience:  Math.max(0, parseFloat(raw.totalExperience) || 0),
  };
}
