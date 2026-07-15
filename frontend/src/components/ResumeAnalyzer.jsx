import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "./shared/Navbar";

const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

const GlobalStyles = () => (
  <style>{`
    @keyframes spin        { to { transform: rotate(360deg); } }
    @keyframes fadeSlideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    @keyframes shimmer     { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes pulse-glow  { 0%,100%{box-shadow:0 0 0 0 rgba(0,229,160,0)} 50%{box-shadow:0 0 20px 4px rgba(0,229,160,.18)} }
    @keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

    .font-syne            { font-family: 'Syne', sans-serif; }
    .font-dm              { font-family: 'DM Sans', sans-serif; }
    .animate-spin-custom  { animation: spin 1s linear infinite; }
    .animate-fade-up      { animation: fadeSlideUp .5s cubic-bezier(.22,1,.36,1) both; }
    .animate-fade-up-fast { animation: fadeSlideUp .35s cubic-bezier(.22,1,.36,1) both; }
    .animate-float        { animation: float 3.5s ease-in-out infinite; }
    .animate-pulse-glow   { animation: pulse-glow 2.5s ease-in-out infinite; }

    ::-webkit-scrollbar       { width: 5px; height: 5px; }
    .dark ::-webkit-scrollbar-thumb { background: #1f2d45; border-radius: 3px; }
    ::-webkit-scrollbar-thumb { background: #b8d8f0; border-radius: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }

    .theme-transition * { transition: background-color .3s, border-color .3s, color .3s, box-shadow .3s !important; }

    .tab-active  { background:#00e5a0; color:#071510; border-color:#00e5a0; font-weight:700; }
    .dark .tab-active { background:#00e5a0; color:#071510; border-color:#00e5a0; }
    .tab-active-light { background:#0ea5e9; color:#fff; border-color:#0ea5e9; font-weight:700; }

    /* Keyword tags */
    .kw-found     { background:rgba(16,185,129,.1);   color:#059669; border:1px solid rgba(16,185,129,.3); }
    .dark .kw-found { background:rgba(0,229,160,.1);  color:#34d399; border:1px solid rgba(0,229,160,.25); }

    .kw-missing   { background:rgba(239,68,68,.08);   color:#dc2626; border:1px solid rgba(239,68,68,.25); }
    .dark .kw-missing { background:rgba(239,68,68,.08); color:#f87171; border:1px solid rgba(239,68,68,.25); }

    .kw-suggested { background:rgba(14,165,233,.1);   color:#0284c7; border:1px solid rgba(14,165,233,.3); }
    .dark .kw-suggested { background:rgba(59,130,246,.08); color:#60a5fa; border:1px solid rgba(59,130,246,.25); }

    /* Mistake items */
    .mistake-item { background:rgba(239,68,68,.04); border:1px solid rgba(239,68,68,.2); }
    .dark .mistake-item { background:rgba(239,68,68,.055); border:1px solid rgba(239,68,68,.2); }

    /* Panel hover top bar */
    .panel-top-bar { opacity: 0; transition: opacity .3s; }
    .panel:hover .panel-top-bar { opacity: 1; }

    /* Score ring track */
    .score-ring-track { stroke: #dbeafe; }
    .dark .score-ring-track { stroke: #1f2d45; }

    /* Analyze button */
    .btn-analyze {
      background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
      color: #ffffff;
      box-shadow: 0 4px 28px rgba(14,165,233,.4);
    }
    .dark .btn-analyze {
      background: linear-gradient(135deg, #00e5a0 0%, #00c87a 100%);
      color: #071510;
      box-shadow: 0 4px 28px rgba(0,229,160,.32);
    }
    .btn-analyze:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 36px rgba(14,165,233,.5);
    }
    .dark .btn-analyze:hover {
      box-shadow: 0 8px 36px rgba(0,229,160,.4);
    }
    .btn-analyze:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Mesh BG */
    .mesh-bg {
      background:
        radial-gradient(ellipse 70% 55% at 85% 5%, rgba(56,189,248,.15) 0%, transparent 60%),
        radial-gradient(ellipse 55% 45% at 5% 90%, rgba(99,102,241,.08) 0%, transparent 60%),
        radial-gradient(ellipse 40% 35% at 50% 50%, rgba(14,165,233,.06) 0%, transparent 70%);
    }
    .dark .mesh-bg {
      background:
        radial-gradient(ellipse 70% 55% at 85% 5%, rgba(0,229,160,.07) 0%, transparent 60%),
        radial-gradient(ellipse 55% 45% at 5% 90%, rgba(59,130,246,.06) 0%, transparent 60%),
        radial-gradient(ellipse 40% 35% at 50% 50%, rgba(167,139,250,.04) 0%, transparent 70%);
    }

    /* Dot grid */
    .dot-grid {
      background-image: radial-gradient(circle, #90c4e0 1px, transparent 1px);
      background-size: 32px 32px;
      opacity: 0.25;
    }
    .dark .dot-grid {
      background-image: radial-gradient(circle, #1f2d45 1px, transparent 1px);
      opacity: 0.4;
    }

    /* Accent glow text */
    .accent-glow { text-shadow: 0 0 30px rgba(14,165,233,.2); }
    .dark .accent-glow { text-shadow: 0 0 40px rgba(0,229,160,.3); }

    /* Spinner */
    .spinner {
      border-color: #bae0f7;
      border-top-color: #0ea5e9;
    }
    .dark .spinner {
      border-color: #1f2d45;
      border-top-color: #00e5a0;
    }

    /* Score ring top stripe */
    .results-stripe {
      background: linear-gradient(90deg,#38bdf8,#0ea5e9,#6366f1);
    }
    .dark .results-stripe {
      background: linear-gradient(90deg,#00e5a0,#3b82f6,#a78bfa);
    }

    input::placeholder, textarea::placeholder { transition: color .3s; }
  `}</style>
);

// ─────────────────────────────────────────────────────────────
const REAL_WORDS = new Set([
  "a","i","an","as","at","be","by","do","go","he","if","in","is","it",
  "me","my","no","of","on","or","so","to","up","us","we","and","are",
  "but","can","did","for","get","got","had","has","her","him","his",
  "how","its","may","not","now","off","one","our","out","own","say",
  "see","she","the","too","two","use","was","who","why","yet","you",
  "been","came","come","does","done","each","find","from","give","good",
  "have","here","just","keep","know","last","like","make","more","most",
  "much","must","name","need","next","only","open","over","part","same",
  "such","take","than","that","them","then","they","this","time","used",
  "very","want","well","went","were","what","when","will","with","work",
  "year","your"
]);

function repairSplitWords(text) {
  let prev = null;
  for (let pass = 0; pass < 6; pass++) {
    const next = text.replace(
      /([A-Za-z]{1,6}) ([a-z]{1,6})(?=[^a-zA-Z]|$)/g,
      (match, left, right) => {
        if (REAL_WORDS.has(left.toLowerCase()) || REAL_WORDS.has(right)) return match;
        const combined = left + right;
        if (combined.length > 15) return match;
        if (/(?:ing|tion|ed|er|ly|ment|ness|ous|ive|ful|less|able)$/i.test(left)) return match;
        return combined;
      }
    );
    if (next === prev) break;
    prev = text;
    text = next;
  }
  return text;
}

async function extractTextFromFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "txt") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  if (ext === "pdf") {
    try {
      const pdfjsLib = await import("pdfjs-dist");
      // Use local worker bundled with pdfjs-dist to avoid CDN dependency
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.js",
        import.meta.url
      ).toString();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        let pageText = "";
        for (const item of content.items) {
          if (!item.str) continue;
          pageText += item.str;
          if (item.hasEOL) pageText += "\n";
          else pageText += " ";
        }
        fullText += pageText + "\n";
      }
      fullText = fullText.replace(/ {2,}/g, " ").replace(/\t/g, " ");
      const extracted = repairSplitWords(fullText.trim());
      if (!extracted || extracted.length < 30)
        throw new Error("PDF appears to be image-based or scanned — try a text-based PDF or .docx");
      return extracted;
    } catch (e) {
      if (e.message.includes("image-based")) throw e;
      // Fallback: try reading as raw text (handles some simple PDFs)
      try {
        const text = await file.text();
        const cleaned = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/ {3,}/g, " ").trim();
        if (cleaned.length > 100) return repairSplitWords(cleaned);
      } catch {}
      throw new Error("Could not parse PDF. Try saving it as a .docx or .txt file.");
    }
  }

  if (ext === "docx") {
    try {
      // FIX: use `mod.default ?? mod` to handle both CJS and ESM mammoth exports
      const mod = await import("mammoth");
      const mammoth = mod.default ?? mod;
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      return value.trim();
    } catch {
      throw new Error("Could not parse DOCX. Make sure mammoth is installed.");
    }
  }

  throw new Error(`Unsupported file type: .${ext}`);
}


// ── Role keyword map ────────────────────────────────────────
const ROLE_KEYWORDS = {
  default: ["communication","teamwork","problem solving","leadership","management","analytical","project","collaboration","detail","organized"],
  frontend: ["react","vue","angular","javascript","typescript","html","css","tailwind","webpack","vite","redux","responsive","ui","ux","figma","sass","next.js","performance","accessibility","rest api"],
  backend: ["node","express","python","django","flask","java","spring","sql","mongodb","postgresql","redis","api","rest","graphql","microservices","docker","kubernetes","aws","authentication","database"],
  fullstack: ["react","node","javascript","typescript","mongodb","sql","rest api","docker","git","html","css","express","redux","aws","ci/cd","testing","agile","deployment","authentication","database"],
  data: ["python","sql","machine learning","pandas","numpy","tensorflow","pytorch","statistics","visualization","tableau","power bi","excel","r","spark","hadoop","etl","data pipeline","scikit","regression","classification"],
  devops: ["docker","kubernetes","ci/cd","jenkins","aws","azure","gcp","terraform","ansible","linux","bash","monitoring","prometheus","grafana","git","pipeline","infrastructure","automation","nginx","security"],
  design: ["figma","sketch","adobe xd","photoshop","illustrator","ui","ux","wireframe","prototype","user research","typography","color theory","responsive","accessibility","design system","branding","animation","css","html","interaction"],
  marketing: ["seo","sem","google ads","social media","content","analytics","email marketing","crm","hubspot","salesforce","campaign","conversion","roi","brand","copywriting","strategy","market research","ppc","influencer","automation"],
  hr: ["recruitment","onboarding","payroll","performance management","employee relations","hris","talent acquisition","training","compliance","benefits","compensation","workforce","succession planning","engagement","diversity","labor law","kpi","appraisal","sourcing","retention"],
  finance: ["accounting","financial analysis","excel","budgeting","forecasting","gaap","ifrs","audit","tax","balance sheet","p&l","cash flow","erp","sap","quickbooks","investment","risk","compliance","reporting","reconciliation"],
  sales: ["crm","salesforce","lead generation","pipeline","negotiation","closing","quota","b2b","b2c","account management","cold calling","prospecting","revenue","upselling","customer success","demo","proposal","territory","forecasting","relationship"],
};

const WEAK_VERBS = ["worked","helped","assisted","did","made","got","went","used","tried","handled","was responsible for","participated in","involved in"];
const STRONG_VERBS = ["achieved","built","created","delivered","designed","developed","drove","engineered","established","executed","generated","implemented","improved","increased","launched","led","managed","optimized","reduced","spearheaded"];
const SECTION_HEADERS = ["experience","education","skills","projects","summary","objective","certifications","achievements","awards","publications","languages","interests","references","contact","profile"];

function getRoleKeywords(role) {
  const r = role.toLowerCase();
  if (r.includes("front")) return ROLE_KEYWORDS.frontend;
  if (r.includes("back")) return ROLE_KEYWORDS.backend;
  if (r.includes("full")) return ROLE_KEYWORDS.fullstack;
  if (r.includes("data") || r.includes("analyst") || r.includes("ml") || r.includes("machine")) return ROLE_KEYWORDS.data;
  if (r.includes("devops") || r.includes("cloud") || r.includes("infra")) return ROLE_KEYWORDS.devops;
  if (r.includes("design") || r.includes("ui") || r.includes("ux")) return ROLE_KEYWORDS.design;
  if (r.includes("market") || r.includes("seo") || r.includes("content")) return ROLE_KEYWORDS.marketing;
  if (r.includes("hr") || r.includes("human") || r.includes("recruit") || r.includes("talent")) return ROLE_KEYWORDS.hr;
  if (r.includes("financ") || r.includes("account") || r.includes("audit")) return ROLE_KEYWORDS.finance;
  if (r.includes("sales") || r.includes("business dev")) return ROLE_KEYWORDS.sales;
  return ROLE_KEYWORDS.default;
}

function analyzeResumeLocally(resumeText, role, jobDesc) {
  const text = resumeText.toLowerCase();
  const words = text.split(/\s+/);
  const lines = resumeText.split(/\n/).map(l => l.trim()).filter(Boolean);

  // ── Keywords ────────────────────────────────────────────
  const roleKws = getRoleKeywords(role);
  const jobKws = jobDesc
    ? [...new Set(jobDesc.toLowerCase().match(/\b[a-z][a-z.+#]{2,}\b/g) || [])]
        .filter(w => w.length > 3 && !ROLE_KEYWORDS.default.includes(w))
        .slice(0, 30)
    : [];
  const allKws = [...new Set([...roleKws, ...jobKws])];
  const found = allKws.filter(kw => text.includes(kw)).slice(0, 8);
  const missing = allKws.filter(kw => !text.includes(kw)).slice(0, 8);
  const suggested = roleKws.filter(kw => !found.includes(kw) && !missing.slice(0,4).includes(kw)).slice(0, 6);

  // ── Section detection ────────────────────────────────────
  const detectedSections = SECTION_HEADERS.filter(s => text.includes(s));
  const hasExperience = detectedSections.includes("experience") || text.includes("work history") || text.includes("employment");
  const hasEducation  = detectedSections.includes("education") || text.includes("university") || text.includes("college") || text.includes("degree") || text.includes("bachelor") || text.includes("master");
  const hasSkills     = detectedSections.includes("skills") || text.includes("proficient") || text.includes("expertise");
  const hasSummary    = detectedSections.includes("summary") || detectedSections.includes("objective") || detectedSections.includes("profile");
  const hasProjects   = detectedSections.includes("projects") || text.includes("project");
  const hasCerts      = detectedSections.includes("certifications") || text.includes("certified") || text.includes("certificate");
  const hasContact    = text.includes("@") || text.includes("phone") || text.includes("linkedin") || text.includes("github") || /\d{10}/.test(text);

  // ── Metrics & impact ─────────────────────────────────────
  const hasNumbers    = /\d+%|\$\d+|\d+\s*(users|clients|projects|team|members|million|k\b|years|months)/.test(text);
  const weakVerbCount = WEAK_VERBS.filter(v => text.includes(v)).length;
  const strongVerbCount = STRONG_VERBS.filter(v => text.includes(v)).length;
  const wordCount     = words.length;
  const hasLinkedIn   = text.includes("linkedin");
  const hasGitHub     = text.includes("github");
  const emailMatch    = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  // ── Length check ─────────────────────────────────────────
  const tooShort = wordCount < 200;
  const tooLong  = wordCount > 1200;

  // ── Scores ───────────────────────────────────────────────
  let expScore = 40;
  if (hasExperience) expScore += 25;
  if (hasNumbers)    expScore += 20;
  if (strongVerbCount >= 3) expScore += 10;
  if (hasProjects)   expScore += 5;
  expScore = Math.min(100, expScore);

  let skillScore = 30;
  if (hasSkills)          skillScore += 20;
  skillScore += Math.min(35, found.length * 5);
  if (hasCerts)           skillScore += 10;
  if (hasGitHub)          skillScore += 5;
  skillScore = Math.min(100, skillScore);

  let eduScore = 40;
  if (hasEducation) eduScore += 40;
  if (text.includes("gpa") || text.includes("cgpa")) eduScore += 10;
  if (text.includes("honors") || text.includes("distinction") || text.includes("merit")) eduScore += 10;
  eduScore = Math.min(100, eduScore);

  let fmtScore = 50;
  if (!tooShort && !tooLong) fmtScore += 15;
  if (hasContact)  fmtScore += 15;
  if (hasSummary)  fmtScore += 10;
  if (hasLinkedIn) fmtScore += 5;
  if (tooShort)    fmtScore -= 15;
  if (tooLong)     fmtScore -= 10;
  fmtScore = Math.max(10, Math.min(100, fmtScore));

  let impactScore = 30;
  if (hasNumbers)           impactScore += 30;
  if (strongVerbCount >= 5) impactScore += 20;
  else if (strongVerbCount >= 2) impactScore += 10;
  if (weakVerbCount <= 2)   impactScore += 10;
  if (hasSummary)           impactScore += 10;
  impactScore = Math.min(100, impactScore);

  const overall = Math.round((expScore * 0.3 + skillScore * 0.25 + eduScore * 0.15 + fmtScore * 0.15 + impactScore * 0.15));

  // ── Verdict ──────────────────────────────────────────────
  const verdict =
    overall >= 80 ? "Strong ATS-Ready Resume" :
    overall >= 65 ? "Good Resume, Minor Gaps" :
    overall >= 50 ? "Average — Needs Improvement" :
    overall >= 35 ? "Weak — Major Gaps Found" :
    "Needs Significant Rework";

  const summary =
    overall >= 65
      ? `Your resume scores well for a ${role} role with ${found.length} matching keywords. ${missing.length > 3 ? "Adding more role-specific keywords will boost ATS ranking." : "Keep refining impact statements for best results."}`
      : `Your resume needs improvement for a ${role} role. ${!hasNumbers ? "Add measurable achievements with numbers. " : ""}${missing.length > 4 ? "Several key keywords are missing." : "Focus on strengthening your experience section."}`.trim();

  // ── Suggestions ──────────────────────────────────────────
  const suggestions = [];
  if (!hasNumbers)
    suggestions.push({ type: "critical", icon: "🚨", text: "Add quantified achievements (e.g. 'Increased sales by 30%' or 'Led team of 8')" });
  if (missing.length > 4)
    suggestions.push({ type: "critical", icon: "🚨", text: `Add missing keywords: ${missing.slice(0,3).join(", ")} — these are expected for ${role}` });
  if (weakVerbCount > 2)
    suggestions.push({ type: "improve", icon: "💡", text: `Replace weak verbs like 'worked on' or 'helped' with strong ones: led, built, delivered` });
  if (!hasSummary)
    suggestions.push({ type: "improve", icon: "💡", text: "Add a professional summary at the top — 2-3 sentences about your value proposition" });
  if (!hasLinkedIn)
    suggestions.push({ type: "tip", icon: "✅", text: "Include your LinkedIn profile URL to increase recruiter trust" });
  if (!hasGitHub && (role.toLowerCase().includes("dev") || role.toLowerCase().includes("engineer") || role.toLowerCase().includes("data")))
    suggestions.push({ type: "tip", icon: "✅", text: "Add your GitHub profile link to showcase real projects" });
  if (tooShort)
    suggestions.push({ type: "improve", icon: "💡", text: "Resume is too short. Expand experience and project descriptions for better ATS scoring" });
  if (tooLong)
    suggestions.push({ type: "tip", icon: "✅", text: "Resume is quite long. Trim to 1-2 pages — keep only the most relevant experience" });
  if (!hasProjects)
    suggestions.push({ type: "tip", icon: "✅", text: "Add a Projects section to demonstrate hands-on experience" });
  if (strongVerbCount < 3)
    suggestions.push({ type: "improve", icon: "💡", text: `Start bullet points with strong action verbs: ${STRONG_VERBS.slice(0,4).join(", ")}` });

  // ── Mistakes ─────────────────────────────────────────────
  const mistakes = [];
  if (!hasContact)
    mistakes.push({ icon: "⚠️", text: "Missing contact information — add email, phone, and LinkedIn" });
  if (!emailMatch)
    mistakes.push({ icon: "⚠️", text: "No email address detected — this is critical for recruiters to reach you" });
  if (weakVerbCount > 3)
    mistakes.push({ icon: "⚠️", text: `Found ${weakVerbCount} weak action verbs — replace with impactful alternatives` });
  if (!hasNumbers)
    mistakes.push({ icon: "⚠️", text: "No measurable results found — numbers make your impact concrete and credible" });
  if (tooShort)
    mistakes.push({ icon: "⚠️", text: `Resume is only ~${wordCount} words — too brief to pass ATS filters effectively` });
  if (!hasEducation)
    mistakes.push({ icon: "⚠️", text: "Education section not detected — ensure it's clearly labeled" });
  if (!hasSkills)
    mistakes.push({ icon: "⚠️", text: "Skills section not clearly labeled — ATS systems scan for a dedicated skills section" });

  return {
    overall_score: overall,
    verdict,
    summary,
    sections: [
      { name: "Experience", score: expScore,   color: "#00e5a0" },
      { name: "Skills",     score: skillScore, color: "#3b82f6" },
      { name: "Education",  score: eduScore,   color: "#a78bfa" },
      { name: "Formatting", score: fmtScore,   color: "#f59e0b" },
      { name: "Impact",     score: impactScore,color: "#ec4899" },
    ],
    suggestions: suggestions.slice(0, 6),
    keywords: { found, missing, suggested },
    mistakes: mistakes.slice(0, 5),
  };
}

const LOADING_STEPS = [
  "Reading resume content…",
  "Identifying key skills…",
  "Checking ATS compatibility…",
  "Analyzing keyword gaps…",
  "Building your report…",
];

const useLoadingCycle = (active) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!active) { setIdx(0); return; }
    const t = setInterval(() => setIdx((i) => (i + 1) % LOADING_STEPS.length), 2200);
    return () => clearInterval(t);
  }, [active]);
  return LOADING_STEPS[idx];
};

// ── Score Ring ──────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const [animated, setAnimated] = useState(false);
  const r = 52, circ = 2 * Math.PI * r;
  const offset = animated ? circ - (score / 100) * circ : circ;
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, [score]);

  const color =
    score >= 75 ? "var(--ring-good)" :
    score >= 50 ? "#f59e0b" :
    "#ef4444";

  return (
    <>
      <style>{`
        :root { --ring-good: #0ea5e9; }
        .dark { --ring-good: #00e5a0; }
      `}</style>
      <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="score-ring-track" />
          <circle
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)",
              filter: `drop-shadow(0 0 8px ${color}66)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center font-syne">
          <span style={{ fontSize: "2.1rem", fontWeight: 900, lineHeight: 1, color }}>{score}</span>
          <span
            className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-600"
            style={{ fontSize: "0.58rem" }}
          >
            / 100
          </span>
        </div>
      </div>
    </>
  );
};

// ── Animated Bar ────────────────────────────────────────────
const AnimBar = ({ value, color }) => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 250);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="h-1.5 rounded-full bg-blue-100 dark:bg-[#1f2d45] overflow-hidden">
      <div
        style={{
          height: "100%",
          borderRadius: 6,
          background: color,
          width: `${w}%`,
          transition: "width 1.1s cubic-bezier(.4,0,.2,1)",
          boxShadow: `0 0 8px ${color}44`,
        }}
      />
    </div>
  );
};

// ── Keyword Tag ─────────────────────────────────────────────
const KwTag = ({ label, variant }) => (
  <span className={`kw-${variant} font-dm inline-block rounded-full px-3.5 py-1 text-xs font-semibold m-0.5`}>
    {label}
  </span>
);

// ── Score Card ──────────────────────────────────────────────
const ScoreCard = ({ name, score, color }) => (
  <div className="bg-white dark:bg-[#1a2235] border border-[#bae0f7] dark:border-[#1f2d45] rounded-[18px] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
    <div className="text-[0.68rem] font-bold tracking-widest uppercase mb-2.5 text-[#7ab3d0] dark:text-[#6b7a99]">
      {name}
    </div>
    <div className="font-syne mb-2.5 leading-none" style={{ fontSize: "2.2rem", fontWeight: 900, color }}>
      {score}
    </div>
    <AnimBar value={score} color={color} />
  </div>
);

// ── Suggestion Item ─────────────────────────────────────────
const SuggestionItem = ({ icon, type, text }) => {
  const typeColor     = { critical: "#ef4444", improve: "#f59e0b", tip: "#0284c7" };
  return (
    <li className="flex gap-3.5 items-start bg-white dark:bg-[#1a2235] border border-[#bae0f7] dark:border-[#1f2d45] rounded-2xl p-4 text-sm leading-relaxed list-none shadow-sm">
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <div
          className="text-[0.65rem] font-extrabold tracking-widest uppercase mb-1"
          style={{ color: typeColor[type] || "#0284c7" }}
        >
          {type}
        </div>
        <span className="text-[#2d5a7a] dark:text-[#d4dce8]">{text}</span>
      </div>
    </li>
  );
};

// ── Mistake Item ────────────────────────────────────────────
const MistakeItem = ({ icon, text }) => (
  <li className="mistake-item flex gap-3.5 items-start rounded-2xl p-4 text-sm leading-relaxed list-none">
    <span className="text-xl flex-shrink-0">{icon}</span>
    <span className="text-[#6b3a3a] dark:text-[#d4dce8]">{text}</span>
  </li>
);

// ── Panel ───────────────────────────────────────────────────
const Panel = ({ children, className = "", style = {} }) => (
  <div
    className={`panel bg-white dark:bg-[#111827] border border-[#bae0f7] dark:border-[#1f2d45] rounded-[22px] relative overflow-hidden shadow-[0_4px_32px_rgba(14,165,233,.1)] dark:shadow-[0_4px_40px_rgba(0,0,0,.3)] ${className}`}
    style={style}
  >
    <div className="panel-top-bar absolute top-0 left-0 right-0 h-0.5 rounded-t-[22px] results-stripe" />
    {children}
  </div>
);

const TABS = [
  { id: "breakdown",   label: "📊 Breakdown"  },
  { id: "suggestions", label: "💡 Suggestions" },
  { id: "keywords",    label: "🔑 Keywords"    },
  { id: "mistakes",    label: "🚨 Mistakes"    },
];

// ── Main ────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const [resumeText,  setResumeText]  = useState("");
  const [fileName,    setFileName]    = useState("");
  const [fileSize,    setFileSize]    = useState("");
  const [previewText, setPreviewText] = useState("");
  const [parseError,  setParseError]  = useState("");
  const [jobRole,     setJobRole]     = useState("");
  const [jobDesc,     setJobDesc]     = useState("");
  const [dragging,    setDragging]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [activeTab,   setActiveTab]   = useState("breakdown");
  const [toast,       setToast]       = useState({ msg: "", show: false, type: "error" });

  const fileRef    = useRef();
  const resultsRef = useRef();
  const loadingMsg = useLoadingCycle(loading);

  const showToast = useCallback((msg, type = "error") => {
    setToast({ msg, show: true, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  }, []);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setParseError(""); setResumeText(""); setPreviewText(""); setResult(null);
    if (file.size > 5 * 1024 * 1024) { showToast("File too large — max 5 MB"); return; }
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");
    try {
      const text = await extractTextFromFile(file);
      if (!text || text.trim().length < 50)
        throw new Error("Resume appears empty or could not be read.");
      setResumeText(text);
      setPreviewText(text.slice(0, 400) + (text.length > 400 ? "…" : ""));
    } catch (err) {
      setParseError(err.message);
      showToast(err.message);
    }
  }, [showToast]);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const analyzeResume = async () => {
    const role = jobRole.trim() || "General Position";
    setLoading(true); setResult(null);
    try {
      // Small artificial delay so the loading animation is visible
      await new Promise(r => setTimeout(r, 1800));
      const parsed = analyzeResumeLocally(resumeText, role, jobDesc.trim());
      setResult(parsed);
      setActiveTab("breakdown");
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        150
      );
      showToast("Analysis complete!", "success");
    } catch (err) {
      console.error("Analysis error:", err);
      showToast(err.message || "Analysis failed — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = resumeText.trim().length > 50 && !loading && !parseError;

  const dropZoneBorderColor = dragging
    ? "border-[#00e5a0] dark:border-[#00e5a0]"
    : parseError
    ? "border-red-400/50"
    : "border-[#bae0f7] dark:border-[#1f2d45]";

  const dropZoneBg = dragging
    ? "bg-sky-50/60 dark:bg-[#00e5a0]/5"
    : parseError
    ? "bg-red-50/50 dark:bg-red-900/5"
    : "bg-[#f5fbff] dark:bg-[#1a2235]";

  return (
    <>
      <FontLoader />
      <GlobalStyles />

      {/* Mesh BG */}
      <div className="mesh-bg fixed inset-0 z-0 pointer-events-none transition-all duration-400" />

      {/* Dot grid */}
      <div className="dot-grid fixed inset-0 z-0 pointer-events-none transition-opacity duration-400" />

      <div className="font-dm theme-transition min-h-screen text-slate-800 dark:text-[#e8edf5] relative z-10 bg-[#f0f8ff] dark:bg-[#07090f] transition-colors duration-300">

        {/* NAV */}
        <Navbar />

        {/* HERO */}
        <div className="animate-fade-up text-center px-6 pt-[72px] pb-[52px]">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-sky-100/80 dark:bg-[#00e5a0]/[0.08] border border-sky-300/60 dark:border-[#00e5a0]/20">
            <span className="text-[0.65rem] font-extrabold tracking-[0.14em] uppercase text-sky-500 dark:text-[#00e5a0]">
              ✦ Free AI-Powered Analysis
            </span>
          </div>

          <h1 className="font-syne text-[clamp(2rem,5.5vw,3.5rem)] font-black leading-[1.1] tracking-tight mb-5 text-slate-800 dark:text-[#e8edf5]">
            Get Your Resume{" "}
            <span className="text-sky-500 dark:text-[#00e5a0] accent-glow">Analyzed</span>
            <br />in Seconds
          </h1>

          <p className="font-dm text-slate-500 dark:text-[#6b7a99] max-w-[500px] mx-auto text-base leading-7">
            Upload your resume, tell us your target role — get an ATS score, keyword gaps,
            suggestions &amp; mistake detection.
          </p>

          {/* Stats strip */}
          <div className="flex justify-center gap-10 mt-8 flex-wrap">
            {[["🎯","ATS Score"], ["⚡","~10 Seconds"], ["🆓","Completely Free"]].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-[0.82rem] font-semibold text-slate-500 dark:text-[#6b7a99]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div
          className="animate-fade-up max-w-[1100px] mx-auto px-5 pb-24 grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))" }}
        >

          {/* ── UPLOAD PANEL ── */}
          <Panel style={{ padding: 30 }}>
            <div className="font-syne font-bold text-base mb-5 flex items-center gap-2.5 text-slate-800 dark:text-[#e8edf5]">
              <span className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-lg bg-sky-100 dark:bg-[#00e5a0]/[0.12]">
                📄
              </span>
              Upload Resume
            </div>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`border-2 border-dashed ${dropZoneBorderColor} ${dropZoneBg} rounded-2xl py-9 px-6 text-center cursor-pointer transition-all duration-200 ${dragging ? "scale-[1.01]" : "scale-100"}`}
            >
              <div className="animate-float text-4xl mb-3">
                {parseError ? "⚠️" : dragging ? "📥" : "⬆️"}
              </div>
              <p className="font-dm text-slate-500 dark:text-[#6b7a99] text-sm leading-relaxed m-0">
                {parseError ? (
                  <span className="text-red-400">{parseError}</span>
                ) : (
                  <>
                    <strong className="text-sky-500 dark:text-[#00e5a0]">Click or drag &amp; drop</strong>
                    <br />PDF, DOCX, or TXT — max 5 MB
                  </>
                )}
              </p>
              <div className="flex justify-center gap-2 mt-3.5">
                {["PDF", "DOCX", "TXT"].map((f) => (
                  <span
                    key={f}
                    className="font-dm text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full tracking-wide text-slate-500 dark:text-[#6b7a99] bg-sky-50 dark:bg-white/5 border border-[#bae0f7] dark:border-[#1f2d45]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {/* File preview */}
            {fileName && !parseError && (
              <div className="mt-4 bg-[#f5fbff] dark:bg-[#1a2235] border border-[#bae0f7] dark:border-[#1f2d45] rounded-2xl p-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <span className="text-[1.7rem]">
                    {fileName.endsWith(".pdf") ? "📕" : fileName.endsWith(".docx") ? "📘" : "📄"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-dm text-sm font-semibold text-slate-800 dark:text-[#e8edf5] overflow-hidden text-ellipsis whitespace-nowrap">
                      {fileName}
                    </div>
                    <div className="font-dm text-xs text-slate-500 dark:text-[#6b7a99]">
                      {fileSize} · {resumeText.split(/\s+/).filter(Boolean).length} words extracted
                    </div>
                  </div>
                  <button
                    className="font-dm bg-transparent border border-[#bae0f7] dark:border-[#1f2d45] rounded-lg text-slate-500 dark:text-[#6b7a99] cursor-pointer px-3 py-1 text-[0.72rem] font-semibold transition-all duration-200 hover:border-sky-400 dark:hover:border-[#00e5a0] hover:text-sky-500 dark:hover:text-[#00e5a0]"
                    onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }}
                  >
                    Change
                  </button>
                </div>
                {previewText && (
                  <div className="font-dm mt-3 pt-3 border-t border-[#bae0f7] dark:border-[#1f2d45] text-[0.72rem] text-slate-400 dark:text-[#3d4f6a] leading-relaxed max-h-[88px] overflow-auto whitespace-pre-wrap transition-colors duration-300">
                    {previewText}
                  </div>
                )}
              </div>
            )}

            {/* Job Role */}
            <div className="mt-5">
              <label className="font-dm block text-[0.72rem] font-bold tracking-widest uppercase text-slate-500 dark:text-[#6b7a99] mb-2">
                Target Job Role
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Frontend Developer, Data Analyst…"
                className="font-dm w-full bg-[#f5fbff] dark:bg-[#1a2235] border border-[#bae0f7] dark:border-[#1f2d45] rounded-xl text-slate-800 dark:text-[#e8edf5] text-[0.9rem] px-4 py-3 outline-none transition-all duration-200 focus:border-sky-400 dark:focus:border-[#00e5a0] focus:ring-2 focus:ring-sky-400/20 dark:focus:ring-[#00e5a0]/20 placeholder:text-slate-400 dark:placeholder:text-[#3d4f6a]"
              />
            </div>

            {/* Job Desc */}
            <div className="mt-4">
              <label className="font-dm block text-[0.72rem] font-bold tracking-widest uppercase text-slate-500 dark:text-[#6b7a99] mb-2">
                Job Description{" "}
                <span className="font-normal normal-case tracking-normal text-slate-400 dark:text-[#3d4f6a]">
                  (optional)
                </span>
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={4}
                placeholder="Paste the job description for a more tailored analysis…"
                className="font-dm w-full bg-[#f5fbff] dark:bg-[#1a2235] border border-[#bae0f7] dark:border-[#1f2d45] rounded-xl text-slate-800 dark:text-[#e8edf5] text-[0.9rem] px-4 py-3 outline-none resize-none transition-all duration-200 focus:border-sky-400 dark:focus:border-[#00e5a0] focus:ring-2 focus:ring-sky-400/20 dark:focus:ring-[#00e5a0]/20 placeholder:text-slate-400 dark:placeholder:text-[#3d4f6a]"
              />
            </div>

            {/* Analyze Button */}
            <button
              className="btn-analyze font-syne mt-6 w-full py-4 rounded-2xl font-black text-base tracking-wide border-none transition-all duration-200"
              disabled={!canAnalyze}
              onClick={analyzeResume}
            >
              {loading ? "Analyzing…" : resumeText ? "✦ Analyze My Resume" : "Upload a resume first"}
            </button>
            <p className="font-dm mt-2.5 text-center text-[#a0c8e0] dark:text-[#3d4f6a] text-[0.7rem]">
              Free · Supports .pdf · .docx · .txt · Results in ~10 seconds
            </p>
          </Panel>

          {/* ── RIGHT: Loading ── */}
          {loading && (
            <div className="bg-white dark:bg-[#111827] border border-[#bae0f7] dark:border-[#1f2d45] rounded-[22px] p-8 min-h-[340px] flex flex-col items-center justify-center gap-6 text-center shadow-[0_4px_32px_rgba(14,165,233,.1)] dark:shadow-[0_4px_40px_rgba(0,0,0,.3)]">
              <div className="spinner w-[60px] h-[60px] rounded-full border-4 animate-spin-custom" />
              <div>
                <div className="font-syne font-bold text-[1.05rem] text-slate-800 dark:text-[#e8edf5] mb-2.5">
                  Analyzing your resume…
                </div>
                <div key={loadingMsg} className="animate-fade-up-fast font-dm text-slate-500 dark:text-[#6b7a99] text-sm">
                  {loadingMsg}
                </div>
              </div>
              <div className="flex gap-2">
                {LOADING_STEPS.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      width: s === loadingMsg ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      transition: "width .3s, background .3s",
                    }}
                    className={s === loadingMsg ? "bg-sky-400 dark:bg-[#00e5a0]" : "bg-[#bae0f7] dark:bg-[#1f2d45]"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── RIGHT: Info ── */}
          {!loading && !result && (
            <Panel style={{ padding: 30 }}>
              <div className="font-syne font-bold text-base mb-6 flex items-center gap-2.5 text-slate-800 dark:text-[#e8edf5]">
                <span className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-lg bg-sky-100 dark:bg-[#00e5a0]/[0.12]">
                  ⚡
                </span>
                What You Get
              </div>
              <div className="flex flex-col gap-5">
                {[
                  ["🎯", "ATS Score",             "Overall score out of 100 showing how well your resume passes Applicant Tracking Systems."],
                  ["📊", "Section Breakdown",      "Individual scores for Experience, Skills, Education, Formatting, and Impact."],
                  ["💡", "Actionable Suggestions", "Specific rewrites and improvements — not generic tips."],
                  ["🔑", "Keyword Analysis",       "Keywords you have, keywords you're missing, and ones to add."],
                  ["🚨", "Mistake Detection",      "Grammar issues, weak verbs, formatting problems, and missing sections."],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="flex gap-3.5 items-start">
                    <div className="w-[38px] h-[38px] rounded-xl flex-shrink-0 flex items-center justify-center text-lg bg-sky-50 dark:bg-white/[0.04] border border-[#bae0f7] dark:border-[#1f2d45]">
                      {icon}
                    </div>
                    <div>
                      <div className="font-dm text-sm font-semibold text-slate-800 dark:text-[#e8edf5] mb-1">{title}</div>
                      <div className="font-dm text-xs text-slate-500 dark:text-[#6b7a99] leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl p-3.5 flex gap-3 items-start bg-sky-50/60 dark:bg-blue-900/[0.06] border border-sky-200 dark:border-blue-800/40">
                <span className="text-base flex-shrink-0">🆓</span>
                <div className="font-dm text-xs text-sky-600 dark:text-[#6b8ab8] leading-relaxed">
                  Completely free to use — no hidden fees. Analyze as many resumes as you like,
                  whether you're job hunting or just curious!
                </div>
              </div>
            </Panel>
          )}

          {/* ── RESULTS ── */}
          {result && (
            <div
              ref={resultsRef}
              className="animate-fade-up bg-white dark:bg-[#111827] border border-[#bae0f7] dark:border-[#1f2d45] rounded-[22px] p-7 relative overflow-hidden col-span-full shadow-[0_4px_32px_rgba(14,165,233,.1)] dark:shadow-[0_4px_40px_rgba(0,0,0,.3)]"
            >
              {/* Top accent stripe */}
              <div className="results-stripe absolute top-0 left-0 right-0 h-[3px]" />

              {/* Score header */}
              <div className="flex items-center gap-8 flex-wrap mb-8">
                <ScoreRing score={result.overall_score} />
                <div className="flex-1 min-w-[200px]">
                  <div
                    className="font-dm inline-block text-[0.65rem] font-extrabold tracking-[0.1em] uppercase mb-2 px-3 py-1 rounded-full border"
                    style={{
                      color:       result.overall_score >= 75 ? "#0284c7" : result.overall_score >= 50 ? "#f59e0b" : "#ef4444",
                      background:  result.overall_score >= 75 ? "rgba(14,165,233,.1)" : result.overall_score >= 50 ? "rgba(245,158,11,.1)" : "rgba(239,68,68,.1)",
                      borderColor: result.overall_score >= 75 ? "rgba(14,165,233,.25)" : result.overall_score >= 50 ? "rgba(245,158,11,.25)" : "rgba(239,68,68,.25)",
                    }}
                  >
                    {result.overall_score >= 75 ? "Strong" : result.overall_score >= 50 ? "Needs Work" : "Weak"}
                  </div>
                  <h3
                    className="font-syne text-[1.55rem] font-black mb-2.5 mt-0"
                    style={{ color: result.overall_score >= 75 ? "#0284c7" : result.overall_score >= 50 ? "#f59e0b" : "#ef4444" }}
                  >
                    {result.verdict}
                  </h3>
                  <p className="font-dm text-sm text-slate-500 dark:text-[#6b7a99] leading-7 m-0">{result.summary}</p>
                </div>
                <button
                  className="font-dm bg-transparent border border-[#bae0f7] dark:border-[#1f2d45] rounded-xl text-slate-500 dark:text-[#6b7a99] cursor-pointer px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-sky-400 dark:hover:border-[#00e5a0] hover:text-sky-500 dark:hover:text-[#00e5a0]"
                  onClick={() => setResult(null)}
                >
                  ↩ New Analysis
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 flex-wrap mb-6">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    className={`font-dm px-4 py-2 rounded-xl border text-sm cursor-pointer transition-all duration-200 ${
                      activeTab === tab.id
                        ? "tab-active"
                        : "border-[#bae0f7] dark:border-[#1f2d45] text-slate-500 dark:text-[#6b7a99] bg-transparent hover:border-sky-400 dark:hover:border-[#00e5a0] font-medium"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: Breakdown */}
              {activeTab === "breakdown" && (
                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
                  {result.sections.map((s) => <ScoreCard key={s.name} {...s} />)}
                </div>
              )}

              {/* Tab: Suggestions */}
              {activeTab === "suggestions" && (
                <ul className="flex flex-col gap-3 p-0 m-0">
                  {result.suggestions.length
                    ? result.suggestions.map((s, i) => <SuggestionItem key={i} {...s} />)
                    : <li className="text-slate-500 dark:text-[#6b7a99] list-none">No suggestions returned.</li>}
                </ul>
              )}

              {/* Tab: Keywords */}
              {activeTab === "keywords" && (
                <div className="flex flex-col gap-7">
                  {[
                    { label: "✅ Found in your resume", key: "found",     variant: "found"     },
                    { label: "❌ Missing — add these",  key: "missing",   variant: "missing"   },
                    { label: "💡 Also recommended",     key: "suggested", variant: "suggested" },
                  ].map(({ label, key, variant }) => (
                    <div key={key}>
                      <div className="font-dm text-[0.72rem] font-bold tracking-widest uppercase text-slate-500 dark:text-[#6b7a99] mb-3">
                        {label}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.keywords[key] || []).map((kw) => (
                          <KwTag key={kw} label={kw} variant={variant} />
                        ))}
                        {!(result.keywords[key] || []).length && (
                          <span className="font-dm text-slate-400 dark:text-[#3d4f6a] text-sm">None found</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Mistakes */}
              {activeTab === "mistakes" && (
                <ul className="flex flex-col gap-3 p-0 m-0">
                  {result.mistakes.length
                    ? result.mistakes.map((m, i) => <MistakeItem key={i} {...m} />)
                    : <li className="font-dm text-sky-600 dark:text-[#00e5a0] text-sm list-none">🎉 No significant mistakes detected!</li>}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      <div
        className="font-dm fixed bottom-8 right-8 z-[100] px-5 py-3.5 rounded-2xl max-w-[360px] text-sm font-semibold text-white flex items-center gap-2.5 shadow-[0_8px_32px_rgba(0,0,0,.25)] transition-all duration-300"
        style={{
          background:    toast.type === "success" ? "#059669" : "#dc2626",
          transform:     toast.show ? "translateY(0) scale(1)" : "translateY(5rem) scale(.95)",
          opacity:       toast.show ? 1 : 0,
          pointerEvents: toast.show ? "auto" : "none",
        }}
      >
        <span className="text-lg">{toast.type === "success" ? "✓" : "⚠"}</span>
        {toast.msg}
      </div>
    </>
  );
}