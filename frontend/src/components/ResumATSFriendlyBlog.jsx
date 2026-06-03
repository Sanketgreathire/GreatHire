import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "How to Make Your Resume ATS-Friendly",
  subtitle: "ATS Resume Guide for Job Seekers — 2026",
  date: "May 09, 2026",
  readTime: "12 min read",
  category: "Career Development",
  keywords: [
    "ATS friendly resume",
    "ATS resume format",
    "how to pass ATS screening",
    "ATS resume tips 2026",
    "applicant tracking system",
    "resume optimization for ATS",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "First, understand what ATS (Applicant Tracking System) is and why it matters. An ATS is software that recruiter use to parse, filter, and rank resumes. Between 70–80% of resumes submitted to large companies are filtered by ATS before a human ever sees them. If your resume isn't ATS-friendly, it won't reach the recruiter's inbox — no matter how qualified you are. ATS systems scan resumes for: keywords matching the job description, proper formatting that can be parsed, consistent section headings, and relevant skills and experience. A resume optimized for humans but not machines is invisible to ATS. You need to optimize for both: clarity for humans and structure for machines. Understanding this duality is the foundation of ATS-friendly resume design.",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge",
    desc: "ATS systems rank resumes by keyword matching — so you need to know which keywords matter for your target roles. Start with job descriptions: copy 3–5 job descriptions for your target role and analyze them. What skills, tools, certifications, and qualifications appear repeatedly? These are your target keywords. Build your actual skills to match: if the role requires 'Python' and you don't know it, learn it. If it requires 'Agile', understand Agile methodologies. Your resume should reflect genuine skills you have or are actively developing. Don't lie — but do be strategic about which skills you highlight. If you know Java, Python, and SQL, but the role emphasizes Python and SQL, lead with those. Match your genuine capabilities to the role's needs.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "Use these ATS-optimization strategies: 1) Single-column format (multi-column breaks ATS parsing). 2) Standard fonts (Arial, Calibri, Times New Roman — avoid fancy fonts). 3) Standard section headings (Education, Experience, Skills, Certifications — ATS recognizes these). 4) Keywords from job description woven naturally into your bullet points. 5) Numbers and metrics (ATS recognizes quantifiable achievements). 6) File format: PDF (preserves formatting better than Word). 7) No headers, footers, graphics, tables, or text boxes (ATS can't parse them). 8) Consistent date format. Use tools to validate: paste your resume into an ATS simulator tool (free versions available online) to see how it's being parsed. If sections are scrambled or unreadable, the formatting is the problem, not your content.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Monitor which resumes get screened past ATS. If you're applying to 20 roles with similar requirements and only 1–2 get past ATS screening (you know this when you get interview invites), your resume formatting or keywords are wrong. Test iterations: make small changes to your resume, submit 5–10 applications, track response rates. Did adding specific keywords help? Did changing the format improve results? Ask for feedback from people in your industry who've recently hired: 'Did my resume pass your ATS screening?' and 'What keywords would have helped?' Use this feedback to refine. ATS optimization is not a one-time fix — it's iterative. Your resume should evolve as you gain skills and as job market keywords shift.",
  },
];

const mistakes = [
  {
    num: "01",
    title: "Using Multi-Column Layouts or Creative Formatting",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "ATS Killer",
    desc: "A resume with two columns, a sidebar, headers, footers, or text boxes looks great to humans but is chaos to ATS software. ATS reads resumes linearly, left to right, top to bottom. When it encounters a multi-column layout, it scrambles the content, mixing sections together or skipping entire columns. A fancy design that looks impressive to you becomes unreadable gibberish to the ATS — and your resume gets rejected automatically. This is the #1 ATS formatting mistake.",
    fix: "Use single-column layout only. Standard format: left-aligned text, standard sections stacked vertically. Test your resume in an ATS parser tool to see how it reads.",
  },
  {
    num: "02",
    title: "Using Graphics, Images, or Complex Formatting",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Parsing Failure",
    desc: "Infographic elements, icons, bars (skill level bars), images, QR codes, or decorative elements look modern but break ATS parsing. ATS software can't read images or interpret visual elements. If your resume includes a bar chart showing 'Python: 90%, JavaScript: 80%', the ATS skips it entirely. You lose the opportunity to highlight that skill. Complex formatting also extends parse time — some ATS systems give up if parsing takes too long and auto-reject.",
    fix: "Remove all graphics and visual elements. Use text-only formatting. Express skill levels with simple text: 'Advanced Python' or 'Intermediate JavaScript' instead of visual bars.",
  },
  {
    num: "03",
    title: "Ignoring Keywords from the Job Description",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Ranking Loss",
    desc: "ATS software ranks resumes by keyword match. If the job description emphasizes 'Kubernetes,' 'Docker,' and 'CI/CD pipeline' and your resume doesn't mention these keywords, you'll rank lower than candidates who do — even if you have equivalent skills. Many candidates hide their relevant keywords. They'll write 'containerization experience' instead of 'Docker' or 'deployment automation' instead of 'CI/CD pipeline.' ATS is literal — it doesn't understand synonyms. If you have the skill, use the exact terminology from the job description.",
    fix: "Copy the job description. Highlight technical keywords, tools, certifications, and soft skills mentioned. Ensure these keywords appear in your resume naturally. Use them in experience descriptions and skills sections.",
  },
  {
    num: "04",
    title: "Submitting in the Wrong File Format",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Format Issue",
    desc: "Submitting your resume as a .doc (older Word format) or .pages (Mac format) can cause parsing issues. Some ATS systems accept these formats but don't parse them consistently. PDF is more reliably parsed but can sometimes lose formatting if saved incorrectly. The safest approach: save as PDF, but also keep a clean .docx version for when companies specifically request Word format. However, when given a choice, PDF is usually safer.",
    fix: "Default to PDF format unless the job application specifically requests .doc or .docx. When saving as PDF, use 'Save as PDF' from your word processor, not a third-party converter.",
  },
  {
    num: "05",
    title: "Using Inconsistent Section Headings or Non-Standard Labels",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Parsing Confusion",
    desc: "ATS systems are trained to recognize standard section headings: 'Experience,' 'Education,' 'Skills,' 'Certifications,' 'Projects,' 'Languages.' When you use non-standard headings like 'Career History' instead of 'Experience,' 'My Skills' instead of 'Skills,' or 'Projects I Built' instead of 'Projects,' the ATS has trouble categorizing and ranking your information. Some creative headings are missed entirely. Consistency also helps — if you use 'Experience' but later use 'Work History' or 'Professional Background,' you're confusing the ATS.",
    fix: "Use standard section headings: Experience, Education, Skills, Certifications, Projects, Languages, Volunteer Experience. Be consistent throughout the resume.",
  },
  {
    num: "06",
    title: "Hiding Keywords in Invisible Text or Trying to Game the System",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Black Hat Tactic",
    desc: "Some candidates try to game ATS by adding keywords in white text (invisible to humans but readable to ATS), duplicating keywords, or using keyword stuffing. Modern ATS systems are sophisticated enough to detect these tactics — and they penalize you. Adding 'Python Python Python' or invisible keywords triggers spam filters. You'll get rejected faster. Additionally, if you do make it past the ATS, the recruiter will interview you and discover you don't actually have the skills you claimed. Authenticity works; gaming doesn't.",
    fix: "Use keywords naturally in your experience descriptions and skills section. One mention of each keyword is enough. Focus on genuine skill alignment, not keyword manipulation.",
  },
  {
    num: "07",
    title: "Using Dates in Non-Standard Formats or Leaving Date Gaps Unexplained",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Timeline Issues",
    desc: "ATS systems parse dates to build a timeline of your experience. Non-standard date formats like 'Jan '20' or 'Q3 2020' or 'Summer 2019' confuse the parser. Similarly, unexplained gaps in employment are flagged by ATS algorithms — they look like red flags. Some ATS systems automatically lower your ranking if gaps are detected. Not addressing gaps creates noise in the system.",
    fix: "Use consistent date format: 'January 2020 – May 2021' or 'MM/YYYY – MM/YYYY'. Include all employment dates even if there are gaps. If you have employment gaps, address them briefly in cover letter or during interview.",
  },
  {
    num: "08",
    title: "Forgetting to Customize for Each Application",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Keyword Mismatch",
    desc: "Sending the same generic resume to every application means you're ranking poorly on average. A data scientist applying to 'Data Science' roles should emphasize different keywords than when applying to 'Machine Learning Engineer' roles. ATS rankings are role-specific. If the job description emphasizes 'statistical analysis' and your generic resume emphasizes 'visualization,' you'll rank lower. You're competing against candidates who tailored their resume to include the exact keywords from that specific job description.",
    fix: "For each application, review the job description and tailor your resume's keywords accordingly. Move relevant projects to the top, adjust the skills section to match, and ensure keywords from the job description appear naturally in your experience.",
  },
];

const practices = [
  "Use single-column layout with standard fonts (Arial, Calibri, Times New Roman).",
  "Include keywords from the job description naturally throughout your resume.",
  "Use standard section headings: Experience, Education, Skills, Certifications, Projects.",
  "Format dates consistently: MM/YYYY or 'January 2020' format.",
  "Save as PDF to preserve formatting and ensure consistent parsing.",
  "Use metrics and numbers to make achievements quantifiable and rankable.",
];

const atsMistakesPractices = [
  "Multi-column layouts or creative formatting that breaks ATS parsing.",
  "Including graphics, bars, icons, or images that ATS cannot read.",
  "Using synonyms for keywords instead of exact terminology from job description.",
  "Submitting in unsupported formats (.pages, .rtf, or low-quality PDFs).",
  "Using creative or non-standard section headings that confuse ATS.",
  "Keyword stuffing or invisible text — attempting to game the system.",
];

const faqs = [
  {
    q: "How do I know if my resume will pass ATS screening?",
    a: "Use an ATS simulator tool (search 'free ATS parser online'). Copy and paste your resume into the tool. It will show you how an ATS system parses your resume — the order of sections, how it reads your information, and whether any content gets scrambled. If sections are out of order or unreadable, your formatting is ATS-incompatible. Fix the formatting and test again.",
  },
  {
    q: "Should I include a photo on my resume?",
    a: "No. Photos are not ATS-friendly and can introduce bias into the hiring process. ATS systems can't evaluate photos, and including a photo may confuse the parser. In some international contexts (like parts of Europe), photos are standard, but in most cases, especially in the US and India, photos are unnecessary and can hurt your chances.",
  },
  {
    q: "Can I use tables in my resume?",
    a: "No. Tables break ATS parsing. If you have information you want to organize in a table, use text instead. For example, instead of a table showing 'Skill | Level,' write 'Python (Advanced), JavaScript (Intermediate)' in your skills section. ATS systems read left-to-right, top-to-bottom. Tables confuse that reading pattern.",
  },
  {
    q: "How many times should I include keywords in my resume?",
    a: "Include keywords naturally, typically 1–3 times throughout your resume. If the job description mentions 'Python,' include it once in your experience (e.g., 'Developed microservices in Python') and once in your skills section ('Python'). Keyword stuffing (repeating the keyword many times) is detected by modern ATS systems and may trigger spam filters.",
  },
  {
    q: "Does the ATS rank resumes or just filter them?",
    a: "Most ATS systems do both: they first filter out resumes that don't match basic criteria, then rank the remaining resumes by keyword match strength. A resume with all the required keywords ranks higher and appears first in the recruiter's queue. This is why keyword optimization is critical — you want your resume to rank at the top of the filtered list.",
  },
  {
    q: "Should I include a cover letter? Does ATS read it?",
    a: "Some ATS systems parse cover letters, but most focus on resumes. To be safe, optimize your cover letter with the same keywords and formatting principles. However, prioritize your resume — it's the primary document ATS evaluates. If the application doesn't have a cover letter field, don't worry; your resume alone should be enough.",
  },
  {
    q: "Can I use special characters or symbols in my resume?",
    a: "Limit special characters. Standard punctuation (periods, commas, hyphens) is fine. But symbols like bullets (•), arrows (→), or non-ASCII characters can confuse ATS parsing. Use simple dashes or asterisks (*) for bullet points instead of fancy characters. When in doubt, stick with standard keyboard characters.",
  },
  {
    q: "What if the job description has conflicting requirements? Which keywords do I prioritize?",
    a: "Prioritize keywords mentioned most frequently or listed first. If 'Python' appears in the job title and multiple times in the description, it's a core requirement. If a skill appears only once in a 'nice-to-have' section, it's lower priority. Focus your resume on the top 3–5 most frequently mentioned requirements and keywords.",
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">{q}</span>
        <span
          className={`text-slate-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function ResumATSFriendlyBlog() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">

        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-slate-300 text-xl sm:text-2xl font-light mb-6">
              ({blog.subtitle})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-slate-300 text-sm">
              <span>📅 {blog.date}</span>
              <span className="hidden sm:inline">·</span>
              <span>⏱ {blog.readTime}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.keywords.map((kw) => (
                <span
                  key={kw}
                  className="bg-white/15 border border-white/25 text-white text-xs px-3 py-1 rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* ── INTRODUCTION ── */}
          <section className="mb-14">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Between 70–80% of resumes submitted to large companies never reach a recruiter's inbox. They're rejected automatically by ATS (Applicant Tracking System) — software designed to filter and rank resumes. If your resume isn't <strong className="text-slate-700">ATS friendly</strong>, your qualifications don't matter. The system will reject you before a human ever sees your name.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide shows you how ATS systems work, exactly what makes a resume ATS-incompatible, and the precise steps to make your resume pass ATS screening while staying readable and impressive to human recruiters.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why ATS-Friendly Matters More Than Ever in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In 2026, nearly every medium-to-large company uses ATS software. Companies like Google, Microsoft, Meta, Amazon, and most Fortune 500 companies filter applications through ATS before recruiters see them. If you apply through a corporate careers portal, your resume goes through ATS. If you apply through LinkedIn or a job portal, the company's ATS processes it. There's almost no way to avoid ATS — so you have to optimize for it.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The problem: resumes that look great to humans often get rejected by ATS. A beautifully formatted resume with multiple columns, creative fonts, and design elements will be parsed as gibberish by ATS software. You need to optimize for both machines (ATS) and humans (recruiters). This balance is the key to getting past the first filter and into the recruiter's hands.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              4-Step Framework to Build an ATS-Friendly Resume
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A structured approach to understanding ATS, optimizing your content, and validating your resume.
            </p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">{step.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── MISTAKES CARDS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              8 ATS Resume Mistakes That Get You Auto-Rejected (and How to Fix Them)
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              Each mistake has a root cause and a specific fix.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {mistakes.map((mistake) => (
                <div
                  key={mistake.num}
                  className={`border rounded-2xl p-5 sm:p-6 ${mistake.color} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{mistake.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${mistake.badge}`}>
                      {mistake.badgeLabel}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">{mistake.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{mistake.desc}</p>
                  <div className="pt-3 border-t border-gray-200/70">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      The Fix
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">{mistake.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Real Example: How Raj Went From 5% to 35% Interview Invite Rate by Fixing ATS Issues
            </h2>
            <div className="bg-gradient-to-br from-slate-700 to-gray-900 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  R
                </div>
                <div>
                  <p className="font-bold">Raj — Software Developer</p>
                  <p className="text-slate-300 text-xs">
                    Applied to 40 roles in 2 months — Got 2 interviews
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Before",
                    title: "The Problem",
                    desc: "Resume was beautifully formatted with a two-column layout, icons for skills, colored headers, and a fancy font. It looked impressive — but ATS couldn't parse it. Skills section didn't match job keywords. Keywords from job descriptions weren't in resume.",
                  },
                  {
                    month: "The Fix",
                    title: "Rebuild",
                    desc: "Converted to single-column, standard font. Removed graphics and icons. Analyzed 5 job descriptions for keywords. Added: 'Python, Django, PostgreSQL, REST APIs, Docker, CI/CD, Agile' to resume. Customized resume for each role with relevant keywords from job description.",
                  },
                  {
                    month: "Results ✓",
                    title: "Outcome",
                    desc: "Applied to 20 similar roles with updated resume. Got 7 interview invites. Response rate jumped from 5% to 35%. Same experience, better ATS optimization.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">
                      {m.month}
                    </p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-slate-300 text-sm italic border-t border-white/20 pt-4">
                "I didn't know ATS was rejecting me before I even applied. Once I fixed the formatting and added the right keywords, everything changed."
              </p>
            </div>
          </section>

          {/* ── BEST PRACTICES + MISTAKES ── */}
          <section className="mb-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Best Practices
              </h3>
              <ul className="space-y-3">
                {practices.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="text-red-500">✗</span> Common Mistakes
              </h3>
              <ul className="space-y-3">
                {atsMistakesPractices.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={i} {...faq} />
              ))}
            </div>
          </section>

          {/* ── CONCLUSION ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Conclusion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              An ATS-friendly resume isn't boring or stripped of personality — it's a resume that's structured for machines and readable for humans. The best resume is one that passes ATS screening AND impresses recruiters. This balance is achievable: single-column layout, standard fonts, keyword optimization, and clean formatting serve both purposes.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Optimize for ATS first. Impress recruiters second. You'll get through both gates.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Get Your Resume Past ATS and Into Recruiters' Hands
            </h2>
            <p className="text-slate-300 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire helps job seekers optimize their profiles and connect with verified opportunities. Upload your resume, get feedback, and apply to roles that are the right fit.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-slate-800 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
            >
              Optimize Your Profile on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
