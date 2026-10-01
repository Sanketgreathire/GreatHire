import jwt from "jsonwebtoken";
import Groq from "groq-sdk";
import { User } from "../models/user.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { RecruiterChatLog } from "../models/recruiterChatLog.model.js";

let groqClient = null;
const getGroqClient = () => {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

// Database logging helper
const recordRecruiterChatInDB = async ({
  req,
  userMessage,
  botReply,
  detectedCategory = "GENERAL",
  isRestricted = false,
}) => {
  try {
    let recruiterId = req.id || null;
    let recruiterEmail = "";
    let recruiterName = "";
    let companyName = "";

    if (!recruiterId) {
      const token = req.header("Authorization")?.split(" ")[1] || req.cookies?.token;
      if (token && process.env.SECRET_KEY) {
        try {
          const decode = jwt.verify(token, process.env.SECRET_KEY);
          recruiterId = decode?.id || decode?.userId || null;
        } catch (e) {}
      }
    }

    if (recruiterId) {
      const recruiterObj = (await User.findById(recruiterId).select("fullname email emailId company").lean()) ||
                         (await Recruiter.findById(recruiterId).select("fullname email companyName").lean());
      if (recruiterObj) {
        recruiterName = recruiterObj.fullname || "";
        recruiterEmail = recruiterObj.emailId?.email || recruiterObj.email || "";
        companyName = recruiterObj.companyName || recruiterObj.company?.name || "";
      }
    }

    const ipAddress = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";

    await RecruiterChatLog.create({
      recruiterId,
      recruiterEmail,
      recruiterName,
      companyName,
      userMessage,
      botReply,
      detectedCategory,
      isRestricted,
      ipAddress,
    });
  } catch (err) {
    console.error("Recruiter Chat DB Logging Error:", err.message);
  }
};

// Off-topic regex (movies, sports, entertainment, food, lifestyle, gaming, casual chat)
const OFF_TOPIC_REGEX = /\b(movie|movies|cinema|film|films|trailer|actor|actors|actress|actresses|hero|heroine|bollywood|hollywood|tollywood|kollywood|box\s*office|netflix|hotstar|prime\s*video|ott|series|episode|episodes|tv\s*show|celebrity|celebrities|song|songs|lyrics|singer|singers|music\s*album|dance|dancing|reels?|tiktok|youtube\s*video|vlog|cricket|ipl|football|fifa|sports|match|matches|score|scores|tournament|world\s*cup|tennis|badminton|kabaddi|recipe|recipes|cook|cooking|food|dish|dishes|pizza|burger|biryani|restaurant|hotel|trip|travel|resort|flight|ticket|car|cars|bike|bikes|joke|jokes|funny|comedy|meme|memes|story|stories|riddle|riddles|girlfriend|boyfriend|dating|romance|marriage|love|crush|politics|political|election|elections|minister|ministers|modi|bjp|congress|president|horoscope|astrology|zodiac|tarot|pubg|freefire|fortnite|gta|gaming|video\s*game|gameplay|games?|weather|forecast|temperature|climate|gossip|fashion|makeup|shopping|product\s*review|news)\b/i;

// Blocked Student Educational Concept Questions (e.g., "what is java", "explain loops")
const STUDENT_CONCEPT_REGEX = /\b(what is java|what's java|what is python|explain python|what is mean by|definition of|what is oops|what is react|explain loops|how to code|learn coding|student roadmap|how to write a program|what is dsa)\b/i;

// Blocked Job Description Document Generation (Writing full JD document explicitly excluded)
const JD_GENERATION_REGEX = /\b(write\s+(a\s+)?(jd|job\s+description)|draft\s+(a\s+)?(jd|job\s+description)|generate\s+(a\s+)?(jd|job\s+description)|job\s+description\s+(for|generator|template))\b/i;

// Allowed Recruiter Intent Patterns
const INTERVIEW_QUESTIONS_REGEX = /\b(interview question|interview questions|evaluate|expected answer|technical round|behavioral question|coding question|screening question|question benchmark|interview benchmark|how to test)\b/i;

const EMAIL_TEMPLATES_REGEX = /\b(email|template|offer letter|invitation|invite|rejection|polite rejection|follow up|interview invite|job offer|draft email|email template|letter template)\b/i;

const SALARY_BENCHMARKS_REGEX = /\b(salary|ctc|package|benchmark|salary range|compensation|market rate|ctc range|in-demand skills|hiring trends|salary expectation)\b/i;

const CANDIDATE_SCREENING_REGEX = /\b(screening|screen|ats|notice period|resume|red flag|red flags|shortlist|candidate evaluation|fake resume|experience verification)\b/i;

const PLATFORM_HELPER_REGEX = /\b(greathire|calendar|schedule|google calendar|sync|post a job|create a job|publish a job|create job|post job|display|job seeker|jobseeker|recruiter dashboard|recruiter portal|shortlist|candidate|platform|how to post|how to create|how to publish|how to view|how to search|how to filter|job listing|job posting|hiring workflow)\b/i;

// Official Restriction Message
const RECRUITER_RESTRICT_MESSAGE = `⛔ **Access Restricted: Recruiter & Hiring Guidance Only**

I am **GreatHire's Recruiter AI Assistant** 💼. My system is strictly restricted to assisting recruiters with:

- 🎯 **Custom Interview Questions & Evaluation Benchmarks**
- 📧 **Recruitment Email & Offer Letter Templates**
- 📊 **CTC Salary Benchmarks & Market Insights**
- 🔍 **Candidate Resume Screening & ATS Checklists**
- 📅 **GreatHire Platform Tools & Calendar Helper**

I cannot generate Job Descriptions (JDs), explain basic student educational concepts (e.g., *"what is java"*), or answer non-recruitment queries.

💡 **Try asking me:**
- *"Give me 8 technical interview questions for a React.js Developer with evaluation criteria"*
- *"Draft a formal offer letter template for a Senior Developer"*
- *"What is the standard CTC range for a Full Stack Developer (3 yrs exp) in Bangalore?"*
- *"What key skills and ATS keywords should I look for when screening a DevOps Resume?"*
- *"How do I schedule an interview and sync it to Google Calendar on GreatHire?"*`;

const RECRUITER_RESTRICT_SUGGESTIONS = [
  "React Developer Interview Questions",
  "Job Offer Letter Email Template",
  "Full Stack CTC Salary Benchmark",
  "DevOps ATS Resume Checklist",
];

function isGreeting(text) {
  return /^\s*(hi|hello|hey|heya|hola|namaste|good\s*(morning|afternoon|evening|day)|greetings|who\s*are\s*you|what\s*can\s*you\s*do|help)\s*[\.!?]*$/i.test(text.trim());
}

export const handleRecruiterChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const cleanMsg = message.trim();
    const lowerMsg = cleanMsg.toLowerCase();

    // 1. Check for Intro / Greeting
    if (isGreeting(lowerMsg)) {
      const greetingReply = `👋 Hello! I am **GreatHire's Recruiter AI Assistant** 💼.\n\nI can assist you with:\n- 🎯 **Technical & Behavioral Interview Questions** with Expected Evaluation Benchmarks\n- 📧 **Recruitment Email & Offer Letter Templates** (Invitations, Rejections, Offers)\n- 📊 **CTC Salary Benchmarks & Market Insights** across Indian tech hubs\n- 🔍 **Candidate Resume Screening & ATS Checklists**\n- 📅 **GreatHire Platform Tools & Calendar Sync Helper**\n\nHow can I support your hiring process today?`;

      await recordRecruiterChatInDB({
        req,
        userMessage: cleanMsg,
        botReply: greetingReply,
        detectedCategory: "GREETING",
        isRestricted: false,
      });

      return res.status(200).json({
        success: true,
        reply: greetingReply,
        suggestions: [
          "React Developer Interview Questions",
          "Job Offer Letter Email Template",
          "Full Stack CTC Salary Benchmark",
          "DevOps ATS Resume Checklist",
        ],
      });
    }

    // 2. Strict Guardrail Check: Block Off-Topic Content
    if (OFF_TOPIC_REGEX.test(lowerMsg)) {
      await recordRecruiterChatInDB({
        req,
        userMessage: cleanMsg,
        botReply: RECRUITER_RESTRICT_MESSAGE,
        detectedCategory: "OFF_TOPIC",
        isRestricted: true,
      });

      return res.status(200).json({
        success: true,
        reply: RECRUITER_RESTRICT_MESSAGE,
        suggestions: RECRUITER_RESTRICT_SUGGESTIONS,
      });
    }

    // 3. Strict Guardrail Check: Block Student Concept Questions
    if (STUDENT_CONCEPT_REGEX.test(lowerMsg)) {
      await recordRecruiterChatInDB({
        req,
        userMessage: cleanMsg,
        botReply: RECRUITER_RESTRICT_MESSAGE,
        detectedCategory: "STUDENT_CONCEPT",
        isRestricted: true,
      });

      return res.status(200).json({
        success: true,
        reply: RECRUITER_RESTRICT_MESSAGE,
        suggestions: RECRUITER_RESTRICT_SUGGESTIONS,
      });
    }

    // 4. Strict Guardrail Check: Block Job Description (JD) Generation Requests
    if (JD_GENERATION_REGEX.test(lowerMsg)) {
      await recordRecruiterChatInDB({
        req,
        userMessage: cleanMsg,
        botReply: RECRUITER_RESTRICT_MESSAGE,
        detectedCategory: "JD_GENERATION",
        isRestricted: true,
      });

      return res.status(200).json({
        success: true,
        reply: RECRUITER_RESTRICT_MESSAGE,
        suggestions: RECRUITER_RESTRICT_SUGGESTIONS,
      });
    }

    // 5. Detect Allowed Recruiter Category
    let detectedCategory = "";
    if (INTERVIEW_QUESTIONS_REGEX.test(lowerMsg)) detectedCategory = "INTERVIEW_QUESTIONS";
    else if (EMAIL_TEMPLATES_REGEX.test(lowerMsg)) detectedCategory = "EMAIL_TEMPLATES";
    else if (SALARY_BENCHMARKS_REGEX.test(lowerMsg)) detectedCategory = "SALARY_BENCHMARKS";
    else if (CANDIDATE_SCREENING_REGEX.test(lowerMsg)) detectedCategory = "CANDIDATE_SCREENING";
    else if (PLATFORM_HELPER_REGEX.test(lowerMsg)) detectedCategory = "PLATFORM_HELPER";

    // Default unmatched valid recruiter queries to GENERAL_RECRUITMENT
    if (!detectedCategory) {
      detectedCategory = "GENERAL_RECRUITMENT";
    }

    // 6. Generate Professional Recruiter Content via Groq AI
    let botReply = "";

    const groq = getGroqClient();
    if (groq) {
      try {
        const systemPrompt = `You are "GreatHire Recruiter AI Assistant", an expert hiring copilot, talent acquisition specialist, and recruitment advisor.

CRITICAL POLICY - STRICTLY RECRUITER & HIRING CONTENT ONLY:
- You ONLY assist recruiters with the following 5 specific features:
  1. Custom Interview Questions categorized by difficulty with Expected Candidate Answer Evaluation Benchmarks.
  2. Professional Recruitment Emails & Document Templates (Interview invites, formal offer letters, polite application rejection emails).
  3. CTC Salary Benchmarks & Market Hiring Insights across Indian tech hubs (Mumbai, Bangalore, Hyderabad, Pune, Gurgaon, etc.).
  4. Candidate Resume Screening Checklists, ATS Keywords, and Red-Flag evaluation tips.
  5. GreatHire Recruiter Platform & Calendar Guidance (scheduling interviews, 1-click Google Calendar sync, managing job listings).

FORBIDDEN TOPICS - MUST REFUSE:
- You MUST NEVER write or generate Job Descriptions (JDs).
- You MUST NEVER answer basic student educational concepts (e.g. "what is java", "explain python loops").
- You MUST NEVER answer off-topic queries (movies, sports, entertainment, food, casual chat).
- DEFAULT COMPANY NAME: Always use "GreatHire" as the default company name in all email templates, offer letters, invitations, and communication responses unless the user explicitly provides a different company name.

Format your responses with clean markdown headings (###), bold key terms, structured bullet points, and an executive, professional tone suitable for HR Directors and Hiring Managers.`;

        const userPrompt = `Recruiter Prompt: "${cleanMsg}"
Detected Category: ${detectedCategory}`;

        const recentMessages = (history || []).slice(-4).map((h) => ({
          role: h.sender === "user" ? "user" : "assistant",
          content: h.text,
        }));

        const completion = await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: systemPrompt },
            ...recentMessages,
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 800,
        });

        botReply = completion.choices[0]?.message?.content || "";

        if (botReply.includes("RESTRICT_OFF_TOPIC")) {
          await recordRecruiterChatInDB({
            req,
            userMessage: cleanMsg,
            botReply: RECRUITER_RESTRICT_MESSAGE,
            detectedCategory,
            isRestricted: true,
          });

          return res.status(200).json({
            success: true,
            reply: RECRUITER_RESTRICT_MESSAGE,
            suggestions: RECRUITER_RESTRICT_SUGGESTIONS,
          });
        }
      } catch (aiErr) {
        console.warn("Groq AI Recruiter Error, using fallback generator:", aiErr.message);
      }
    }

    // 7. Fallback Recruiter Content Generator (100% Reliable Offline Fallback)
    if (!botReply) {
      botReply = generateFallbackRecruiterReply(cleanMsg, detectedCategory);
    }

    if (botReply === RECRUITER_RESTRICT_MESSAGE) {
      await recordRecruiterChatInDB({
        req,
        userMessage: cleanMsg,
        botReply: RECRUITER_RESTRICT_MESSAGE,
        detectedCategory,
        isRestricted: true,
      });

      return res.status(200).json({
        success: true,
        reply: RECRUITER_RESTRICT_MESSAGE,
        suggestions: RECRUITER_RESTRICT_SUGGESTIONS,
      });
    }

    // Dynamic Follow-up Suggestions
    const suggestions = generateRecruiterSuggestions(detectedCategory);

    // Record successful recruiter chat in Database
    await recordRecruiterChatInDB({
      req,
      userMessage: cleanMsg,
      botReply,
      detectedCategory,
      isRestricted: false,
    });

    return res.status(200).json({
      success: true,
      reply: botReply,
      suggestions,
    });
  } catch (err) {
    console.error("Recruiter chat controller error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating recruiter guidance. Please try again.",
    });
  }
};

// Fallback Recruiter Reply Generator
function generateFallbackRecruiterReply(cleanMsg, category) {
  if (category === "INTERVIEW_QUESTIONS") {
    return `### 🎯 Technical & Behavioral Interview Questions & Evaluation Benchmarks

---

#### 🟢 Basic / Screening Questions:
1. **Core Architecture & Fundamentals**: Explain your experience with state management, modular component architecture, and component lifecycles in real-world production.
   - 💡 **Expected Evaluation Benchmark**: Candidate should articulate clear separation of concerns, immutability, and state lifting without over-engineering.

2. **Error Handling & Resilience**: How do you implement global exception boundaries and gracefully handle API failures?
   - 💡 **Expected Evaluation Benchmark**: Look for try/catch strategies, toast notifications, fallback UI elements, and HTTP status code awareness.

---

#### 🟡 Intermediate / Scenario-Based Questions:
3. **Performance Optimization**: What specific techniques do you apply to minimize bundle size, optimize re-renders, and improve load times?
   - 💡 **Expected Evaluation Benchmark**: Mentions lazy loading, code splitting, memoization (\`useMemo\` / \`useCallback\`), asset compression, and virtualized lists.

4. **API Integration & Security**: How do you handle authentication tokens (JWT), authorization headers, and CORS security in web applications?
   - 💡 **Expected Evaluation Benchmark**: Candidate should emphasize HttpOnly cookies, bearer authorization headers, and payload validation.

---

#### 🔴 Advanced / System Design Questions:
5. **Scalability & Code Quality**: How do you structure a enterprise frontend repository for team collaboration and maintainability?
   - 💡 **Expected Evaluation Benchmark**: Discusses feature folder architecture, ESLint/Prettier rules, unit testing (Jest/RTL), and CI/CD automated pipelines.`;
  }

  if (category === "EMAIL_TEMPLATES") {
    return `### 📧 Recruitment Email & Document Templates

---

#### 1️⃣ Technical Interview Invitation Template:
**Subject**: Interview Invitation: [Job Title] Role at GreatHire

Dear [Candidate Name],

Thank you for your interest in the **[Job Title]** position at **GreatHire**. We were impressed by your background and experience.

We would like to invite you for a **Technical Interview** on **[Date]** at **[Time]**.

- 🕒 **Duration**: [e.g., 45 Minutes]
- 📹 **Meeting Link**: [Insert Google Meet / Zoom Link]
- 🎯 **Agenda**: Technical discussion, scenario exercise, and Q&A.

Please confirm if this time works for you. We look forward to speaking with you!

Best regards,  
**[Your Name]**  
Recruitment Team | **GreatHire**

---

#### 2️⃣ Formal Job Offer Letter Template:
**Subject**: Job Offer: [Job Title] at GreatHire

Dear [Candidate Name],

On behalf of **GreatHire**, I am thrilled to offer you the position of **[Job Title]**!

- 💰 **Annual CTC**: ₹[Salary Amount]
- 📅 **Joining Date**: [Joining Date]
- 📍 **Work Location**: [Location / Remote]

Please review the attached formal offer letter and return a signed copy by **[Acceptance Deadline]**.

Welcome to the team!

Warm regards,  
**[Your Name]**  
Talent Acquisition | **GreatHire**`;
  }

  if (category === "SALARY_BENCHMARKS") {
    return `### 📊 CTC Salary Benchmarks & Market Insights (India 2026)

---

#### 🏢 Average Salary Ranges by Experience Level:

| Role & Stack | Junior (1-3 Yrs) | Mid-Level (3-6 Yrs) | Senior (6-10 Yrs) |
| :--- | :--- | :--- | :--- |
| **Full Stack Developer (MERN/Java)** | ₹5.5 LPA – ₹9.5 LPA | ₹10.0 LPA – ₹18.0 LPA | ₹19.0 LPA – ₹32.0 LPA |
| **Python Backend / FastAPI** | ₹6.0 LPA – ₹10.0 LPA | ₹11.0 LPA – ₹20.0 LPA | ₹21.0 LPA – ₹35.0 LPA |
| **React.js Frontend** | ₹5.0 LPA – ₹8.5 LPA | ₹9.5 LPA – ₹16.5 LPA | ₹17.5 LPA – ₹28.0 LPA |
| **DevOps & Cloud Engineer** | ₹6.5 LPA – ₹11.0 LPA | ₹12.0 LPA – ₹22.0 LPA | ₹23.0 LPA – ₹40.0 LPA |

---

#### 📍 Location Tier Premiums:
- **Tier 1 (Bangalore, Hyderabad, Gurgaon)**: +15% to 25% premium above national average.
- **Tier 2 (Pune, Mumbai, Chennai)**: Standard market benchmark.
- **Tier 3 (Remote / Hybrid)**: Standard competitive benchmark.`;
  }

  if (category === "CANDIDATE_SCREENING") {
    return `### 🔍 Candidate Resume Screening & Red-Flag Checklist

---

#### 🛠️ Essential Resume Screening Checklist:
1. **Core Skill Alignment**: Verify direct experience with primary stack tools versus passive keywords listed in a generic skills dump.
2. **Project Impact Metrics**: Look for quantifiable outcomes (e.g. *"reduced page load speed by 40%"*, *"scaled API throughput to 10k req/sec"*).
3. **Career Progression**: Track logical growth in responsibilities across previous employment roles.

---

#### 🚩 Key Red-Flags During Initial HR Screening Call:
- **Notice Period Ambiguity**: Candidates giving vague answers about buyout options or official resignation dates.
- **Unexplained Employment Gaps**: Gaps longer than 6 months without clear upskilling, personal leave, or freelance context.
- **Vague Role Ownership**: Candidate uses "we did" exclusively without describing their personal technical contributions.`;
  }

  if (category === "PLATFORM_HELPER" || category === "GENERAL_RECRUITMENT") {
    const lower = cleanMsg.toLowerCase();
    if (lower.includes("create") || lower.includes("post") || lower.includes("publish") || lower.includes("job seeker") || lower.includes("jobseeker") || lower.includes("display")) {
      return `### 💼 How to Create & Publish a Job Listing on GreatHire

---

#### 📝 Step-by-Step Job Posting Guide:
1. **Navigate to Job Posting**:
   - Go to your **Recruiter Dashboard** and click **Post a Job** (or navigate to \`/recruiter/jobs/post\`).

2. **Fill in Role Details**:
   - **Job Title & Role**: Enter a clear title (e.g. *Senior Full Stack Developer*).
   - **Work Mode & Location**: Select On-Site, Hybrid, or Remote, and set target location (*e.g. Bangalore, Hyderabad, Mumbai*).
   - **Experience & Compensation**: Define required years of experience and annual CTC salary range.
   - **Skills & Requirements**: Enter must-have technical skills, key responsibilities, and application deadline.

3. **Publish Listing**:
   - Click **Publish Job** to make your posting live immediately.

---

#### 👁️ How Jobseekers View & Apply to Your Job:
- **Instant Live Indexing**: Once published, your job is automatically displayed on the **Jobseekers' Portal** (\`/jobs\`) and search feeds.
- **Direct Candidate Applications**: Interested jobseekers can view your listing details and apply directly. You will see incoming applications in your **Recruiter Dashboard** under **Applications**!`;
    }

    return `### 💼 GreatHire Recruiter Platform & Hiring Helper

---

#### 🌟 How to Schedule Interviews & Manage Candidates:
1. **Schedule Technical Rounds**:
   - Go to **Calendar & Interviews** (\`/recruiter/dashboard/calendar\`).
   - Click **"+ Add Event"**, fill candidate details, and click **Create Event**.
   - Use the **1-Click Google Calendar** sync link to send Google Meet invites directly to the candidate.

2. **Candidate Shortlisting**:
   - Go to **Applications** on your dashboard to review candidate resumes and transition status (\`Pending\` → \`Shortlisted\` → \`Interview Scheduled\`).`;
  }

  return RECRUITER_RESTRICT_MESSAGE;
}

function generateRecruiterSuggestions(category) {
  if (category === "INTERVIEW_QUESTIONS") {
    return [
      "Behavioral Leadership Questions",
      "Offer Letter Email Template",
      "DevOps Salary Benchmark",
      "ATS Resume Screening Checklist",
    ];
  }
  if (category === "EMAIL_TEMPLATES") {
    return [
      "Polite Rejection Email Template",
      "Interview Invite Template",
      "React Developer Questions",
      "Full Stack CTC Range",
    ];
  }
  return RECRUITER_RESTRICT_SUGGESTIONS;
}
