import jwt from "jsonwebtoken";
import Groq from "groq-sdk";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { JobseekerChatLog } from "../models/jobseekerChatLog.model.js";

let groqClient = null;
const getGroqClient = () => {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

// Helper function to record every chatbot conversation into MongoDB
const recordChatInDatabase = async ({
  req,
  userMessage,
  botReply,
  detectedRole = "",
  detectedLocation = "",
  isJobSearch = false,
  jobsCount = 0,
  coursesCount = 0,
  isRestricted = false,
}) => {
  try {
    let userId = req.id || null;
    let userEmail = "";
    let userName = "";

    if (!userId) {
      const token = req.header("Authorization")?.split(" ")[1] || req.cookies?.token;
      if (token && process.env.SECRET_KEY) {
        try {
          const decode = jwt.verify(token, process.env.SECRET_KEY);
          userId = decode?.id || decode?.userId || null;
        } catch (e) {}
      }
    }

    if (userId) {
      const userObj = await User.findById(userId).select("fullname email emailId").lean();
      if (userObj) {
        userName = userObj.fullname || "";
        userEmail = userObj.emailId?.email || userObj.email || "";
      }
    }

    const ipAddress = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";

    await JobseekerChatLog.create({
      userId,
      userEmail,
      userName,
      userMessage,
      botReply,
      detectedRole,
      detectedLocation,
      isJobSearch,
      jobsCount,
      coursesCount,
      isRestricted,
      ipAddress,
    });
  } catch (err) {
    console.error("MongoDB Chat Logging Error:", err.message);
  }
};

// Curated list of GreatHire Courses
const GREATHIRE_COURSES = [
  {
    id: "java",
    title: "Java Full Stack Training",
    keywords: ["java", "spring", "springboot", "hibernate", "core java", "advanced java", "j2ee"],
    description: "Master Core Java, Spring Boot, Microservices, and REST APIs with hands-on projects.",
    link: "/courses/java-training",
    badge: "Popular Course"
  },
  {
    id: "python",
    title: "Python Full Stack Training",
    keywords: ["python", "django", "flask", "fastapi"],
    description: "Comprehensive Python development covering data structures, Django, and API design.",
    link: "/courses/python-training",
    badge: "Trending"
  },
  {
    id: "data-science",
    title: "Data Science Masterclass",
    keywords: ["data science", "machine learning", "ml", "ai", "deep learning", "pandas"],
    description: "Hands-on Data Science, predictive modeling, machine learning algorithms & deployment.",
    link: "/courses/data-science-training",
    badge: "High Demand"
  },
  {
    id: "data-analytics",
    title: "Data Analytics Certification",
    keywords: ["data analytics", "data analyst", "power bi", "tableau", "sql", "excel"],
    description: "Master SQL querying, Power BI dashboards, Excel data modeling, and reporting.",
    link: "/courses/data-analytics-training",
    badge: "Career Booster"
  },
  {
    id: "aws-devops",
    title: "AWS & DevOps Engineering",
    keywords: ["devops", "aws", "cloud", "docker", "kubernetes", "jenkins", "ci/cd", "terraform"],
    description: "Cloud infrastructure on AWS, CI/CD automation, Docker containers & Kubernetes.",
    link: "/courses/aws-devops-training",
    badge: "In Demand"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Masterclass",
    keywords: ["digital marketing", "seo", "sem", "social media", "google ads"],
    description: "Industry-standard SEO, SEM, content strategy, and social media advertising.",
    link: "/courses/digital-marketing-training",
    badge: "Practical Training"
  },
  {
    id: "cyber-security",
    title: "Cyber Security Training",
    keywords: ["cyber security", "ethical hacking", "network security", "infosec", "penetration testing"],
    description: "Practical network security, vulnerability assessment, defense mechanisms & protocols.",
    link: "/courses/cyber-security-training",
    badge: "Security"
  },
  {
    id: "testing-tools",
    title: "QA & Software Testing Tools",
    keywords: ["testing", "qa", "selenium", "manual testing", "automation testing", "junit"],
    description: "Automation and manual testing frameworks with Selenium, TestNG, and Postman.",
    link: "/courses/testing-tools-training",
    badge: "Job Oriented"
  },
  {
    id: "generative-ai",
    title: "Generative AI Training",
    keywords: ["generative ai", "genai", "llm", "langchain", "prompt engineering", "openai"],
    description: "Build intelligent applications with Large Language Models and prompt engineering.",
    link: "/courses/generative-AI-training",
    badge: "Next-Gen"
  },
  {
    id: "salesforce",
    title: "Salesforce Admin & Dev",
    keywords: ["salesforce", "apex", "crm", "visualforce", "lightning"],
    description: "Comprehensive Salesforce Administrator and Apex Developer certification prep.",
    link: "/courses/saleforce-training",
    badge: "Enterprise"
  },
  {
    id: "business-analyst",
    title: "Business Analyst Training",
    keywords: ["business analyst", "ba", "agile", "scrum", "requirements", "jira"],
    description: "Agile methodologies, user story creation, stakeholder management & business analysis.",
    link: "/courses/business-analytics-training",
    badge: "Management"
  },
  {
    id: "advanced-excel",
    title: "Advanced Excel Training",
    keywords: ["excel", "advanced excel", "vlookup", "macros", "vba", "pivot"],
    description: "Master complex formulas, macros, VBA automation, and executive dashboards.",
    link: "/courses/advanced-excel-training",
    badge: "Essential"
  }
];

// Common Indian tech hubs and cities
const CITIES = [
  "mumbai", "pune", "bangalore", "bengaluru", "hyderabad", "delhi", "noida",
  "gurgaon", "gurugram", "chennai", "kolkata", "ahmedabad", "jaipur",
  "visakhapatnam", "vizag", "kochi", "cochin", "chandigarh", "indore",
  "lucknow", "nagpur", "remote", "hybrid"
];

// Tech roles & domains
const ROLES = [
  "java developer", "java", "python developer", "python", "full stack developer", "full stack",
  "frontend developer", "frontend", "backend developer", "backend", "software engineer",
  "software developer", "react developer", "react", "node developer", "node", "data scientist",
  "data analyst", "devops engineer", "devops", "cloud engineer", "aws", "qa engineer",
  "software tester", "testing", "salesforce", "business analyst", "digital marketer",
  "cyber security", "ui/ux designer", "web developer", "android developer", "flutter"
];

// Off-topic keywords detection (movies, entertainment, cinema, sports, politics, food, gaming, general chat)
const OFF_TOPIC_REGEX = /\b(movie|movies|cinema|film|films|trailer|actor|actors|actress|actresses|hero|heroine|bollywood|hollywood|tollywood|kollywood|box\s*office|netflix|hotstar|prime\s*video|ott|series|episode|episodes|tv\s*show|celebrity|celebrities|song|songs|lyrics|singer|singers|music\s*album|dance|dancing|reels?|tiktok|youtube\s*video|vlog|cricket|ipl|football|fifa|sports|match|matches|score|scores|tournament|world\s*cup|tennis|badminton|kabaddi|recipe|recipes|cook|cooking|food|dish|dishes|pizza|burger|biryani|restaurant|hotel|trip|travel|resort|flight|ticket|car|cars|bike|bikes|joke|jokes|funny|comedy|meme|memes|story|stories|riddle|riddles|girlfriend|boyfriend|dating|romance|marriage|love|crush|politics|political|election|elections|minister|ministers|modi|bjp|congress|president|horoscope|astrology|zodiac|tarot|pubg|freefire|fortnite|gta|gaming|video\s*game|gameplay|games?|weather|forecast|temperature|climate|gossip|fashion|makeup|shopping|product\s*review|news)\b/i;

// Comprehensive technical keywords whitelist (Languages, Frameworks, DBs, Cloud, CS Data Structures, etc.)
const TECH_KEYWORDS = [
  // Programming Languages
  "java", "python", "javascript", "typescript", "c++", "cpp", "c#", "golang", "go lang",
  "rust", "php", "ruby", "swift", "kotlin", "dart", "scala", "perl", "bash", "shell",
  "sql", "html", "css", "sass", "scss",
  // Core Data Structures & CS Terms
  "array", "arrays", "linked list", "linkedlist", "stack", "queue", "tree", "graph", "heap",
  "hashmap", "hashtable", "hash table", "binary search", "sorting", "dynamic programming",
  "dp", "string", "recursion", "pointer", "memory", "class", "object", "variable", "loop",
  "function", "method", "promise", "async", "await", "thread", "process", "deadlock",
  "socket", "protocol", "http", "https", "tcp", "udp", "ip", "dns", "json", "xml",
  "dom", "component", "props", "state", "hook", "hooks", "routing", "orm", "crud",
  "database", "query", "schema", "index", "foreign key", "primary key", "join", "subquery",
  "transaction", "acid", "normalization", "dsa", "data structures", "algorithms", "oop",
  "oops", "object oriented", "polymorphism", "inheritance", "encapsulation", "abstraction",
  "system design", "operating system", "computer networks", "dbms", "compiler",
  "multithreading", "concurrency", "design patterns", "solid principles", "mvc", "api",
  "rest api", "restful", "microservices", "jwt", "authentication", "authorization",
  "unit testing", "selenium", "qa", "software testing", "cyber security", "ethical hacking",
  // Frameworks & Libraries
  "react", "reactjs", "react.js", "angular", "angularjs", "vue", "vuejs", "nextjs", "next.js",
  "nuxt", "svelte", "node", "nodejs", "node.js", "express", "expressjs", "django", "flask",
  "fastapi", "spring", "springboot", "spring boot", "hibernate", "asp.net", ".net", "dotnet",
  "laravel", "rails", "flutter", "react native", "redux", "zustand", "graphql", "tailwind",
  "bootstrap", "jquery", "prisma", "mongoose",
  // Databases & Cloud
  "mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite", "oracle", "dynamodb",
  "cassandra", "mariadb", "firebase", "supabase", "elasticsearch", "nosql",
  "aws", "azure", "gcp", "docker", "kubernetes", "k8s", "jenkins", "ci/cd", "cicd",
  "terraform", "ansible", "git", "github", "gitlab", "linux", "unix", "ubuntu", "nginx", "postman",
  // AI, Data Science & Analytics
  "data science", "data analytics", "data analyst", "machine learning", "ml", "ai",
  "artificial intelligence", "deep learning", "dl", "nlp", "llm", "generative ai", "genai",
  "power bi", "powerbi", "tableau", "excel", "advanced excel", "pandas", "numpy", "scikit-learn",
  "tensorflow", "pytorch",
  // Other Domains on GreatHire
  "business analyst", "salesforce", "digital marketing", "seo", "sem", "ui/ux", "figma",
  "web development", "full stack", "frontend", "backend", "mern", "mern stack", "mean", "mean stack", "lamp stack"
];

// Educational & Career keywords
const CAREER_KEYWORDS = [
  "job", "jobs", "career", "careers", "salary", "package", "ctc", "lpa", "fresher", "freshers",
  "internship", "internships", "hiring", "vacancy", "vacancies", "opening", "openings",
  "developer", "engineer", "course", "training", "skills", "learn", "learning", "roadmap", "interview",
  "questions", "resume", "cv", "portfolio", "certif", "guidance", "guide", "tutorial", "how to become", "experience"
];

// Official GreatHire Restriction Message when query is non-educational
const RESTRICT_MESSAGE = `⛔ **Access Restricted: Educational & Career Content Only**

I am **GreatHire's Career & Education Assistant** 🎓. My system is strictly restricted to assisting job seekers and students with **educational guidance**, **technical learning**, **interview preparation**, and **job opportunities** on GreatHire.

I cannot provide answers or information regarding movies, entertainment, sports, politics, gossip, food, or general non-educational topics.

💡 **Try asking me:**
- *"What is Java and what are its core OOP principles?"*
- *"Explain Python memory management and data types"*
- *"Full Stack Developer learning roadmap for freshers"*
- *"Show me Java developer jobs in Mumbai"*`;

const RESTRICT_SUGGESTIONS = [
  "Core Java & OOP Concepts",
  "Python Developer Roadmap",
  "Full Stack Interview Questions",
  "Top Tech Skills in Demand 2026"
];

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isGreeting(text) {
  return /^\s*(hi|hello|hey|heya|hola|namaste|good\s*(morning|afternoon|evening|day)|greetings|who\s*are\s*you|what\s*can\s*you\s*do|help)\s*[\.!?]*$/i.test(text.trim());
}

function hasEducationalOrCareerIntent(text, detectedRole, detectedLocation) {
  const lower = text.toLowerCase();

  // If a recognized tech role or language was detected
  if (detectedRole && detectedRole.length >= 2) {
    return true;
  }

  // Check if any tech keyword is present as a standalone token
  const hasTech = TECH_KEYWORDS.some((kw) => {
    const rx = new RegExp(`(^|[^a-zA-Z0-9_#+])${escapeRegex(kw)}([^a-zA-Z0-9_#+]|$)`, "i");
    return rx.test(lower);
  });
  if (hasTech) return true;

  // Check if any career keyword is present
  const hasCareer = CAREER_KEYWORDS.some((kw) => {
    const rx = new RegExp(`(^|[^a-zA-Z0-9_])${escapeRegex(kw)}([^a-zA-Z0-9_]|$)`, "i");
    return rx.test(lower);
  });
  if (hasCareer) return true;

  // Check if user is asking for jobs or internships in a location
  if (detectedLocation && /\b(job|jobs|hiring|opening|openings|vacancy|vacancies|work|internship|internships|placement|fresher)\b/i.test(lower)) {
    return true;
  }

  return false;
}

export const handleJobseekerChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const cleanMsg = message.trim();
    const lowerMsg = cleanMsg.toLowerCase();

    // 1. Check if user is sending a greeting / intro
    if (isGreeting(lowerMsg)) {
      const greetingReply = `👋 Hello! I am **GreatHire's Career & Education Assistant** 🎓.\n\nI can help you with:\n- 📘 **Technical Concepts & Code Explanations** (Java, Python, React, SQL, etc.)\n- 🗺️ **Learning Roadmaps & Skill Guides** for Tech Careers\n- 🎯 **Interview Questions & Preparation**\n- 💼 **Job Openings & Placement Guidance** on GreatHire\n\nWhat topic would you like to explore today?`;
      
      await recordChatInDatabase({
        req,
        userMessage: cleanMsg,
        botReply: greetingReply,
        isRestricted: false
      });

      return res.status(200).json({
        success: true,
        reply: greetingReply,
        jobs: [],
        courses: [],
        searchUrl: null,
        suggestions: [
          "Core Java & OOP Concepts",
          "Python Developer Roadmap",
          "Full Stack Interview Questions",
          "Java Jobs in Mumbai"
        ]
      });
    }

    // 2. Strict Guardrail Check: Check if message matches non-educational categories (movies, entertainment, sports, politics, etc.)
    if (OFF_TOPIC_REGEX.test(lowerMsg)) {
      await recordChatInDatabase({
        req,
        userMessage: cleanMsg,
        botReply: RESTRICT_MESSAGE,
        isRestricted: true
      });

      return res.status(200).json({
        success: true,
        reply: RESTRICT_MESSAGE,
        jobs: [],
        courses: [],
        searchUrl: null,
        suggestions: RESTRICT_SUGGESTIONS
      });
    }

    // 2. Extract Location
    let detectedLocation = "";
    for (const city of CITIES) {
      const regex = new RegExp(`\\b${city}\\b`, "i");
      if (regex.test(lowerMsg)) {
        detectedLocation = city === "bengaluru" ? "bangalore" : (city === "gurugram" ? "gurgaon" : city);
        break;
      }
    }

    // 3. Extract Role / Skill / Keyword
    let detectedRole = "";
    for (const role of ROLES) {
      if (lowerMsg.includes(role)) {
        detectedRole = role;
        break;
      }
    }

    // Match against tech keywords if role not yet identified
    if (!detectedRole) {
      for (const tech of TECH_KEYWORDS) {
        const rx = new RegExp(`(^|[^a-zA-Z0-9_#+])${escapeRegex(tech)}([^a-zA-Z0-9_#+]|$)`, "i");
        if (rx.test(lowerMsg)) {
          detectedRole = tech;
          break;
        }
      }
    }

    // 4. Strict Educational / Career Relevance Check:
    // Any query outside educational, technical, or career guidance is restricted.
    if (!hasEducationalOrCareerIntent(lowerMsg, detectedRole, detectedLocation)) {
      await recordChatInDatabase({
        req,
        userMessage: cleanMsg,
        botReply: RESTRICT_MESSAGE,
        detectedRole,
        detectedLocation,
        isRestricted: true
      });

      return res.status(200).json({
        success: true,
        reply: RESTRICT_MESSAGE,
        jobs: [],
        courses: [],
        searchUrl: null,
        suggestions: RESTRICT_SUGGESTIONS
      });
    }

    // 4. Intent Classification: Distinguish between Job Search vs Conceptual/Educational Question
    // ONLY generate job links if user explicitly asks for jobs, openings, hiring, vacancies, links, or work.
    const JOB_SEARCH_REGEX = /\b(job|jobs|job link|job links|opening|openings|vacancy|vacancies|hiring|recruitment|hire|recruit|placement|internship|internships|apply|application|want a job|need a job|find jobs?|search jobs?|look for jobs?|looking for jobs?|work in|work at|salaries|salary range)\b/i;

    const isExplicitJobSearch = JOB_SEARCH_REGEX.test(lowerMsg);
    const isAskingForLocationJob = detectedLocation && (lowerMsg.includes("in " + detectedLocation) || lowerMsg.includes("at " + detectedLocation)) && (detectedRole || lowerMsg.includes("developer") || lowerMsg.includes("engineer"));

    // Check if it's a conceptual question (e.g. "what is mean by java", "explain spring boot", "what is oops")
    const isConceptQuestion = /\b(what is|what's|what is mean by|what does .* mean|meaning of|define|definition of|explain|tell me about|tell about|how does .* work|features of|why use|difference between|what are)\b/i.test(lowerMsg);

    const isJobSearch = (isExplicitJobSearch || isAskingForLocationJob) && (!isConceptQuestion || isExplicitJobSearch);

    // 5. Query MongoDB for matching jobs ONLY when job search is requested
    let matchedJobs = [];
    if (isJobSearch) {
      try {
        const conditions = [];

        // Only active / approved jobs
        conditions.push({
          $or: [
            { "jobDetails.status": "active" },
            { "jobDetails.isActive": true }
          ]
        });

        if (detectedLocation) {
          conditions.push({
            "jobDetails.location": { $regex: detectedLocation, $options: "i" }
          });
        }

        if (detectedRole) {
          // Extract base skills from role (e.g., 'java developer' -> ['java developer', 'java'])
          const roleTokens = detectedRole
            .split(/\s+/)
            .filter((t) => !["developer", "engineer", "specialist", "expert", "lead", "fresher"].includes(t.toLowerCase()) && t.length > 2);
          const searchTerms = Array.from(new Set([detectedRole, ...roleTokens]));

          const roleOrs = searchTerms.flatMap((term) => [
            { "jobDetails.title": { $regex: term, $options: "i" } },
            { "jobDetails.skills": { $regex: term, $options: "i" } },
            { "jobDetails.details": { $regex: term, $options: "i" } }
          ]);

          conditions.push({ $or: roleOrs });
        }

        const queryFilter = conditions.length > 1 ? { $and: conditions } : (conditions[0] || {});

        matchedJobs = await Job.find(queryFilter)
          .select("jobDetails company createdAt")
          .populate("company", "name logo")
          .sort({ createdAt: -1 })
          .limit(4)
          .lean();

        // If location-specific search returned 0 results, search nationally for the role so the user still gets real openings
        if (matchedJobs.length === 0 && detectedRole && detectedLocation) {
          matchedJobs = await Job.find({
            $or: [
              { "jobDetails.status": "active" },
              { "jobDetails.isActive": true }
            ],
            $or: [
              { "jobDetails.title": { $regex: detectedRole, $options: "i" } },
              { "jobDetails.skills": { $regex: detectedRole, $options: "i" } }
            ]
          })
            .select("jobDetails company createdAt")
            .populate("company", "name logo")
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();
        }
      } catch (dbErr) {
        console.error("Chatbot MongoDB query error:", dbErr.message);
      }
    }

    // Format formatted jobs list for response
    const formattedJobs = matchedJobs.map((job) => ({
      id: job._id.toString(),
      title: job.jobDetails?.title || "Job Opening",
      company: job.company?.name || job.jobDetails?.companyName || "GreatHire Partner",
      location: job.jobDetails?.location || "India",
      salary: job.jobDetails?.salary ? `₹${job.jobDetails.salary}` : "Competitive",
      salaryType: job.jobDetails?.salaryType || "per year",
      experience: job.jobDetails?.experience || "Not specified",
      jobType: job.jobDetails?.jobType || "Full-Time",
      skills: (job.jobDetails?.skills || []).slice(0, 5),
      link: `/jobs/${job._id}`
    }));

    // 5. Match Relevant GreatHire Courses
    const matchedCourses = GREATHIRE_COURSES.filter((c) => {
      if (detectedRole && c.keywords.some((kw) => detectedRole.toLowerCase().includes(kw) || kw.includes(detectedRole.toLowerCase()))) {
        return true;
      }
      return c.keywords.some((kw) => lowerMsg.includes(kw));
    }).slice(0, 2);

    // 6. Generate AI Educational Content
    let botReply = "";

    const groq = getGroqClient();
    if (groq) {
      try {
        const jobsContext = isJobSearch && formattedJobs.length > 0
          ? formattedJobs.map((j, i) => `${i + 1}. **${j.title}** at **${j.company}** (${j.location}) - Salary: ${j.salary} - [View Job](/jobs/${j.id})`).join("\n")
          : (isJobSearch ? "No direct matching jobs found in this exact filter right now." : "No job search requested.");

        const coursesContext = matchedCourses.length > 0
          ? matchedCourses.map((c) => `- **${c.title}**: ${c.description} - [Explore Course](${c.link})`).join("\n")
          : "";

        const systemPrompt = `You are "GreatHire Career & Education AI", an educational advisor, technical teacher, and career mentor for students and job seekers.

CRITICAL POLICY - STRICTLY EDUCATIONAL & CAREER CONTENT ONLY:
- You ONLY provide educational explanations, technical concepts, learning roadmaps, interview preparation advice, and job recommendations.
- You are STRICTLY FORBIDDEN from answering questions about movies, cinema, entertainment, sports, politics, celebrities, cooking, food, or general non-educational trivia.
- If the user's question is about any non-educational, non-technical, or non-career topic, you MUST decline by replying with EXACTLY:
RESTRICT_OFF_TOPIC

RULE ON JOB LINKS AND OPENINGS:
- If the user asks a CONCEPTUAL or EDUCATIONAL question (e.g. "what is mean by java", "what is java", "explain spring boot", "what is oops", "features of java", "how does JVM work", "interview questions"):
  -> EXPLAIN the concept thoroughly, clearly, and educationally.
  -> DO NOT output, mention, or fabricate any job links or job listings. Keep the focus purely on the educational explanation.
- If and ONLY IF the user explicitly asks for JOBS, HIRING, VACANCIES, or JOB LINKS (e.g. "i want job in mumbai and field is java developer", "java developer job links in mumbai", "openings for python"):
  -> Provide job matching guidance and reference the available GreatHire job links provided in the context.

Keep the response well-structured with clear markdown headings, bullet points, and an encouraging, professional tone.`;

        const userPrompt = `User question: "${cleanMsg}"

Target Topic / Skills: ${detectedRole || "General"}
Target Location: ${detectedLocation || "Not specified"}
User Intent: ${isJobSearch ? "JOB_SEARCH_REQUESTED" : "CONCEPTUAL_OR_EDUCATIONAL_QUESTION"}

${isJobSearch ? `Available GreatHire Jobs:\n${jobsContext}` : "No job search requested. (DO NOT output job links. Focus purely on explaining the concept/topic clearly and educationally.)"}

${matchedCourses.length > 0 ? `Available GreatHire Training Courses:\n${coursesContext}` : ""}`;

        // Format recent history for conversational flow
        const recentMessages = (history || []).slice(-4).map((h) => ({
          role: h.sender === "user" ? "user" : "assistant",
          content: h.text
        }));

        const completion = await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: systemPrompt },
            ...recentMessages,
            { role: "user", content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 700
        });

        botReply = completion.choices[0]?.message?.content || "";

        // Check if LLM flagged the prompt as off-topic or declined
        if (botReply.includes("RESTRICT_OFF_TOPIC") || /i (can only|am only able to|am dedicated to) help with/i.test(botReply)) {
          await recordChatInDatabase({
            req,
            userMessage: cleanMsg,
            botReply: RESTRICT_MESSAGE,
            detectedRole,
            detectedLocation,
            isRestricted: true
          });

          return res.status(200).json({
            success: true,
            reply: RESTRICT_MESSAGE,
            jobs: [],
            courses: [],
            searchUrl: null,
            suggestions: RESTRICT_SUGGESTIONS
          });
        }
      } catch (aiErr) {
        console.warn("Groq AI generation error, falling back to educational generator:", aiErr.message);
      }
    }

    // 7. Fallback Generator (Ensures 100% reliability if LLM API is unavailable)
    if (!botReply) {
      botReply = generateFallbackEducationalReply({
        detectedRole,
        detectedLocation,
        cleanMsg,
        formattedJobs: isJobSearch ? formattedJobs : [],
        matchedCourses,
        isJobSearch
      });
    }

    // If fallback produced restriction message, return clean restricted payload
    if (botReply === RESTRICT_MESSAGE) {
      await recordChatInDatabase({
        req,
        userMessage: cleanMsg,
        botReply: RESTRICT_MESSAGE,
        detectedRole,
        detectedLocation,
        isRestricted: true
      });

      return res.status(200).json({
        success: true,
        reply: RESTRICT_MESSAGE,
        jobs: [],
        courses: [],
        searchUrl: null,
        suggestions: RESTRICT_SUGGESTIONS
      });
    }

    // 8. Dynamic Follow-up Suggestions
    const suggestions = generateDynamicSuggestions(detectedRole, detectedLocation, isJobSearch);

    const searchUrl = isJobSearch && (detectedRole || detectedLocation)
      ? `/jobs?keyword=${encodeURIComponent(detectedRole || "")}&location=${encodeURIComponent(detectedLocation || "")}`
      : (isJobSearch ? `/jobs` : null);

    // Save successful educational chat to Database
    await recordChatInDatabase({
      req,
      userMessage: cleanMsg,
      botReply,
      detectedRole,
      detectedLocation,
      isJobSearch,
      jobsCount: formattedJobs.length,
      coursesCount: matchedCourses.length,
      isRestricted: false
    });

    return res.status(200).json({
      success: true,
      reply: botReply,
      jobs: isJobSearch ? formattedJobs : [],
      courses: matchedCourses,
      searchUrl,
      suggestions
    });
  } catch (err) {
    console.error("Jobseeker chat controller error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating career guidance. Please try again."
    });
  }
};

// Generates educational fallback content when offline or fast fallback
function generateFallbackEducationalReply({ detectedRole, detectedLocation, cleanMsg, formattedJobs, matchedCourses, isJobSearch }) {
  if (!detectedRole && !isJobSearch) {
    return RESTRICT_MESSAGE;
  }
  const roleName = detectedRole ? capitalizeWords(detectedRole) : "Programming & Tech";
  const locName = detectedLocation ? capitalizeWords(detectedLocation) : "top locations across India";

  // If user asked a conceptual/educational question without requesting jobs
  if (!isJobSearch) {
    if (roleName.toLowerCase().includes("java")) {
      return `### ☕ What is Java?

**Java** is a high-level, class-based, object-oriented programming language designed according to the **"Write Once, Run Anywhere" (WORA)** principle. This means compiled Java code can run on any platform that supports a Java Virtual Machine (JVM) without needing to be recompiled.

---

#### 🌟 Key Characteristics of Java:
- **Object-Oriented**: Built around the core OOP pillars: **Encapsulation**, **Inheritance**, **Polymorphism**, and **Abstraction**.
- **Platform Independent**: Source code (`.java`) is compiled by \`javac\` into intermediate **bytecode** (\`.class\`), which is executed by the **JVM**.
- **Memory Management**: Automatic Garbage Collection frees developers from manual memory allocation and deallocation.
- **Robust & Secure**: Strict compile-time and runtime type checking, no explicit pointers, and built-in runtime exception handling.
- **Multithreaded**: Built-in support for concurrent programming to efficiently handle multiple tasks simultaneously.

---

#### 🏢 Core Components:
1. **JDK (Java Development Kit)**: The complete software development kit containing the compiler (\`javac\`), debugging tools, and the JRE.
2. **JRE (Java Runtime Environment)**: Provides the class libraries and runtime components needed to run Java programs.
3. **JVM (Java Virtual Machine)**: The execution engine that translates bytecode into machine code.

#### 🚀 Common Applications:
- **Enterprise Web Backends**: Powering financial, e-commerce, and enterprise systems using Spring Boot and Microservices.
- **Android App Development**: Native Android development and mobile services.
- **Cloud & Big Data**: Core language behind Apache Kafka, Spark, and distributed systems.`;
    }

    if (roleName.toLowerCase().includes("python")) {
      return `### 🐍 What is Python?

**Python** is an interpreted, high-level, dynamically typed programming language known for its clear, human-readable syntax and immense developer productivity.

#### 🌟 Key Characteristics:
- **Simple & Readable Syntax**: Focuses on clarity and rapid application development.
- **Interpreted**: Code is executed line by line, making debugging interactive and quick.
- **Extensive Ecosystem**: Standard and open-source libraries for Web Development (Django, FastAPI), Data Science (Pandas, NumPy), Machine Learning (PyTorch, TensorFlow), and Automation.`;
    }

    return `### 📘 Educational Guide: ${roleName}

Here is a clear educational overview of **${roleName}**:

1. **Definition & Purpose**: A core technology domain widely used in software engineering and digital products.
2. **Foundational Concepts**: Understanding modular design, clean coding standards, efficiency, and real-world implementation.
3. **Industry Applications**: Powering scalable applications, APIs, and modern platforms.`;
  }

  // If user explicitly asked for jobs
  let reply = `### 🎓 Career & Learning Guide: ${roleName} Opportunities in ${locName}\n\n`;

  reply += `To succeed as a **${roleName}** in **${locName}**, here is the recommended skill breakdown and educational roadmap:\n\n`;

  reply += `#### 🛠️ Essential Skills Required by Top Recruiters:\n`;
  if (roleName.toLowerCase().includes("java")) {
    reply += `- **Core Java (17/21)**: OOP principles, Collections framework, Streams API, Multithreading, Exception handling.\n`;
    reply += `- **Frameworks**: Spring Boot, Spring MVC, Spring Data JPA, Hibernate for ORM.\n`;
    reply += `- **Microservices & APIs**: RESTful API design, Postman, JWT authentication, Swagger.\n`;
    reply += `- **Databases**: MySQL, PostgreSQL, or MongoDB, query optimization, transactions.\n`;
    reply += `- **DevOps & Tools**: Git/GitHub, Maven/Gradle, Docker basics, and AWS/Cloud fundamentals.\n\n`;
  } else if (roleName.toLowerCase().includes("python")) {
    reply += `- **Core Python**: Data types, OOP, List comprehensions, Decorators, Generators.\n`;
    reply += `- **Frameworks**: Django, FastAPI, or Flask for backend development.\n`;
    reply += `- **Databases & ORM**: PostgreSQL, SQLAlchemy, Redis caching.\n`;
    reply += `- **APIs & Testing**: RESTful architecture, PyTest, Git version control.\n\n`;
  } else {
    reply += `- **Core Fundamentals**: Strong foundation in data structures, algorithms, and modular design.\n`;
    reply += `- **Modern Tech Stack**: Industry-standard frameworks, version control (Git), and RESTful APIs.\n`;
    reply += `- **Database & Deployment**: SQL/NoSQL proficiency, containerization (Docker), and cloud awareness.\n\n`;
  }

  reply += `#### 📚 Recommended Learning & Preparation Roadmap:\n`;
  reply += `1. **Phase 1 (Weeks 1-4)**: Master core fundamentals and implement 2 mini-projects.\n`;
  reply += `2. **Phase 2 (Weeks 5-8)**: Deep-dive into modern frameworks (e.g., Spring Boot / Django) with database integration.\n`;
  reply += `3. **Phase 3 (Weeks 9-12)**: Practice timed coding challenges, build an end-to-end full-stack project, and prep for system design basics.\n\n`;

  if (formattedJobs.length > 0) {
    reply += `#### 💼 Matching Job Opportunities on GreatHire:\n`;
    reply += `We found **${formattedJobs.length} active openings** matching your criteria. Check out the job cards below to view details and apply directly!\n\n`;
  } else {
    reply += `#### 💼 Job Search Update:\n`;
    reply += `Explore all current listings on our [GreatHire Jobs Portal](/jobs) to find active openings.\n\n`;
  }

  if (matchedCourses.length > 0) {
    reply += `#### 🚀 Upskilling with GreatHire Certified Courses:\n`;
    matchedCourses.forEach((c) => {
      reply += `- [${c.title}](${c.link}): ${c.description}\n`;
    });
  }

  return reply;
}

function generateDynamicSuggestions(role, location, isJobSearch) {
  const suggestions = [];
  const r = role ? capitalizeWords(role) : "Java";
  const loc = location ? capitalizeWords(location) : "Mumbai";
  const cleanRole = r.replace(/\bdeveloper\b/i, "").trim() || r;

  if (!isJobSearch) {
    // Strictly educational suggestions - NO job suggestions!
    suggestions.push(`Top ${r} Interview Questions`);
    suggestions.push(`${cleanRole} Learning Roadmap 2026`);
    suggestions.push(`Core Concepts in ${cleanRole}`);
    suggestions.push(`Best Practices & Mini Projects for ${cleanRole}`);
  } else {
    suggestions.push(`More Openings in ${loc}`);
    suggestions.push(`${r} Interview Questions`);
    suggestions.push(`${cleanRole} Developer Roadmap`);
    suggestions.push(`ATS Resume Tips for ${r}`);
  }

  return suggestions.slice(0, 4);
}

function capitalizeWords(str) {
  if (!str) return "";
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}
