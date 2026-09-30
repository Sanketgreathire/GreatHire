import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const blog = {
  title: "Creating a Successful CV",
  subtitle: "The Complete Resume Writing Guide for 2026",
  date: "Dec 19, 2025",
  readTime: "10 min read",
  category: "Resume Tips",
  keywords: [
    "how to write a resume 2026",
    "ATS friendly resume tips",
    "successful CV format India",
    "resume mistakes to avoid",
    "best resume format for freshers",
    "keyword optimization resume",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — Why Your Resume Is Your First (and Only) Chance",
    desc: "Recruiters spend an average of 6–8 seconds scanning a resume before deciding whether to read further. Before writing anything, understand what your resume actually needs to do in that window: prove you can do the job, prove it quickly, and pass through software before a human even sees it. Most rejections don't happen because a candidate lacks skills — they happen because the resume fails to communicate those skills clearly, in the format recruiters and ATS systems expect. Auditing your current resume against this reality is the first step toward fixing it.",
  },
  {
    num: "02",
    title: "Build the Right Structure and Formatting Foundation",
    desc: "A successful CV starts with a clean, predictable structure: contact information, a short professional summary, work experience in reverse-chronological order, education, and a focused skills section. Use a single-column layout, standard fonts (Calibri, Arial, Georgia), consistent spacing, and clear section headers. Avoid tables, text boxes, columns, and graphics — many ATS systems cannot parse them correctly, which means a beautifully designed resume can silently fail before a recruiter ever opens it. Save your final resume as a PDF unless the employer specifically requests a different format.",
  },
  {
    num: "03",
    title: "Apply Better Strategies for Content and Keyword Optimization",
    desc: "Fix your resume at every section. In your summary: lead with your role, years of experience, and one standout achievement. In your experience section: replace duty-based bullets ('Responsible for...') with achievement-based bullets that use numbers ('Increased X by 40% in 6 months'). In your skills section: mirror the exact keywords used in the job description, since most ATS systems rank resumes by keyword match. In your education section: keep it brief unless you're a fresher, in which case place it higher and include relevant coursework or projects.",
  },
  {
    num: "04",
    title: "Test, Get Feedback, and Improve Continuously",
    desc: "Your resume isn't a one-time document — it should evolve with every job application and every round of feedback. Run your resume through a free ATS-scan tool to check keyword match against a specific job posting. Ask a mentor, senior colleague, or career coach to review it for clarity and impact. Track which versions of your resume get callbacks and which don't, and refine accordingly. Treat resume writing as an iterative process, not a single afternoon task — small improvements compound into significantly better response rates.",
  },
];

const mistakes = [
  {
    num: "01",
    title: "Listing Duties Instead of Achievements",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "Most Common",
    desc: "Writing 'Responsible for managing social media accounts' tells a recruiter what your job was, not how well you did it. Recruiters want evidence of impact — did engagement grow? Did you save time or money? Did a process improve because of you? Duty-based bullets are forgettable; achievement-based bullets, backed by numbers, are what get remembered and shortlisted.",
    fix: "Rewrite every bullet point to start with an action verb and end with a measurable result: 'Grew Instagram engagement by 65% in 6 months through a targeted content strategy.'",
  },
  {
    num: "02",
    title: "Overloading the Resume With Irrelevant Information",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Clutter Risk",
    desc: "Including every job you've ever had, every skill you've ever touched, and unrelated hobbies dilutes your strongest qualifications. Recruiters have to work harder to find what matters, and often won't bother. A resume isn't a full autobiography — it's a curated pitch tailored to one specific role.",
    fix: "Remove anything older than 10–15 years unless directly relevant. Cut hobbies unless they demonstrate a real, job-relevant skill. Tailor content to the specific role you're applying for.",
  },
  {
    num: "03",
    title: "Ignoring ATS Compatibility",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Silent Rejection",
    desc: "A visually striking resume with columns, graphics, icons, or text boxes might look great to a human — but many ATS systems can't read that formatting correctly, meaning your experience and skills may never even register in the system. Candidates are frequently rejected without a human ever seeing their resume, simply because of formatting.",
    fix: "Use a single-column, text-based layout. Use standard section headers like 'Work Experience' and 'Skills.' Avoid placing important information in headers, footers, or images.",
  },
  {
    num: "04",
    title: "Using a Generic, One-Size-Fits-All Resume",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Low Match Rate",
    desc: "Sending the exact same resume to every job posting ignores the fact that each role has different priority skills and keywords. A generic resume might pass a basic scan, but it rarely ranks near the top, especially for competitive roles where dozens of tailored resumes are also being submitted.",
    fix: "Adjust your skills section and summary for each application to reflect the specific language and priorities in that job posting — this can take just 5–10 minutes per application.",
  },
  {
    num: "05",
    title: "Weak or Missing Professional Summary",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Missed First Impression",
    desc: "Many candidates either skip the summary entirely or write something vague like 'Hardworking professional seeking growth opportunities.' This wastes the most valuable, highest-visibility space on your resume — the first thing a recruiter reads.",
    fix: "Write a 2–3 sentence summary that states your role, years of experience, and one measurable achievement or core strength, tailored to the job you want.",
  },
  {
    num: "06",
    title: "Spelling, Grammar, and Formatting Errors",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Credibility Killer",
    desc: "Typos and inconsistent formatting (mismatched fonts, uneven spacing, inconsistent date formats) signal a lack of attention to detail — a red flag for almost any role, but especially damaging for roles requiring precision or communication skills.",
    fix: "Read your resume aloud before submitting. Run it through a grammar-checking tool. Ask at least one other person to review it with fresh eyes.",
  },
  {
    num: "07",
    title: "Making the Resume Too Long (or Too Short)",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Length Mismatch",
    desc: "Entry-level candidates sometimes stretch a half-page of real content into two pages with excessive white space or repeated information, while experienced professionals sometimes cram 15 years of achievements into a cramped single page, losing readability.",
    fix: "Aim for 1 page if you have less than 5 years of experience, and up to 2 pages for more senior profiles. Prioritize your most relevant and recent achievements.",
  },
  {
    num: "08",
    title: "No Clear Skills Section Aligned to the Role",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Missed Keywords",
    desc: "Burying your skills inside paragraphs of experience, or leaving out a dedicated skills section entirely, makes it harder for both ATS systems and human recruiters to quickly confirm you have what the role requires.",
    fix: "Add a clearly labeled 'Skills' section near the top, listing both technical/hard skills and relevant soft skills, using the same terms found in the job posting.",
  },
];

const caseStudy = {
  name: "Ananya Verma",
  role: "3 Years Experience, Marketing Analyst",
  location: "Bengaluru — 0 Callbacks in 8 Weeks Before Resume Rewrite",
  stages: [
    {
      month: "Week 1–2",
      title: "Diagnosis",
      desc: "Reviewed her resume against 5 recent job postings she'd applied to. Found: duty-based bullets with no metrics, a two-column design that likely broke ATS parsing, and a generic summary that didn't mention her actual specialization in performance marketing.",
    },
    {
      month: "Week 3–4",
      title: "Resume Rebuild",
      desc: "Rewrote all experience bullets with measurable outcomes. Switched to a single-column, ATS-friendly format. Added a tailored summary highlighting her core skill (paid social campaign optimization) and one standout metric (35% reduction in cost-per-lead).",
    },
    {
      month: "Week 5–6",
      title: "Results ✓",
      desc: "Received 4 recruiter callbacks in the first 10 days after resubmitting to previously silent applications. Landed 2 first-round interviews within 3 weeks, and accepted an offer with a 20% salary increase in week 6.",
    },
  ],
  quote:
    "\"I didn't change my experience — I changed how clearly I communicated it. The same 3 years suddenly looked completely different on paper.\"",
};

const practices = [
  "Tailor your resume's summary and skills section to each specific job posting.",
  "Use measurable achievements in every bullet point, not just responsibilities.",
  "Stick to a clean, single-column, ATS-friendly format with standard section headers.",
  "Keep length appropriate to experience level — 1 page for early career, up to 2 for senior roles.",
  "Proofread thoroughly and get at least one second opinion before submitting.",
  "Update your resume every few months, even while employed, so it's always ready.",
];

const commonMistakesList = [
  "Sending the same generic resume to every job application without tailoring it.",
  "Using columns, tables, or graphics that break ATS parsing.",
  "Writing a vague or missing professional summary at the top.",
  "Listing job duties instead of specific, quantified achievements.",
  "Including outdated or irrelevant experience from 15+ years ago.",
  "Skipping a dedicated, keyword-aligned skills section.",
];

const faqs = [
  {
    q: "What is the ideal length for a resume in 2026?",
    a: "One page for candidates with less than 5 years of experience, and up to two pages for more senior professionals with extensive relevant history. Length should always be driven by relevance — never pad a resume just to fill space, and never cram content so tightly that it becomes hard to read.",
  },
  {
    q: "How important are keywords for passing ATS systems?",
    a: "Extremely important. Most companies use Applicant Tracking Systems to filter and rank resumes before a human ever reviews them. Mirroring the exact skills, tools, and phrases used in the job description — while keeping the writing natural — significantly increases your chances of passing this first automated screening.",
  },
  {
    q: "Should I include a photo on my resume?",
    a: "In most English-speaking and many Indian corporate hiring contexts, photos are not recommended and can even trigger unconscious bias filters. Focus the space instead on your summary, skills, and achievements. Always check region- or industry-specific norms if you're applying internationally.",
  },
  {
    q: "How do I make my resume stand out without using flashy design?",
    a: "Strong content beats flashy design almost every time. Use a clean, simple layout, but make your achievements specific and quantified, tailor your summary to each role, and ensure every bullet point clearly communicates impact rather than just listing tasks.",
  },
  {
    q: "Do I need a different resume for every job I apply to?",
    a: "You don't need a completely different resume, but you should adjust your summary and skills section for each application to reflect that specific job posting's priorities and keywords. This targeted approach consistently produces higher callback rates than a single generic version.",
  },
  {
    q: "What's the biggest resume mistake freshers make?",
    a: "Trying to compensate for limited work experience with vague, generic language instead of highlighting specific projects, internships, coursework, and measurable outcomes. Freshers should treat academic projects and internships with the same achievement-focused approach as work experience.",
  },
  {
    q: "How often should I update my resume?",
    a: "Ideally every 3–6 months, even if you're not actively job hunting. Adding new achievements while they're fresh in your memory (with real numbers and context) is far easier than trying to reconstruct them a year or two later when you suddenly need an updated resume.",
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

export default function CreatingSuccessfulCV() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
           {/* ── BACK BUTTON ── */}
  <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
    <Link
      to="/Main_blog_page"
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Blog
    </Link>
  </div>
      

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
                A well-crafted resume is your first opportunity to make a lasting impression on a
                potential employer. In 2026's competitive job market,{" "}
                <strong className="text-slate-700">creating a successful CV</strong> means more than
                listing your history — it means clearly communicating your skills, accomplishments,
                and professional experience using a clean, consistent structure and relevant keywords.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide breaks down exactly what makes a resume stand out to both recruiters and
                Applicant Tracking Systems (ATS) — including the most common mistakes candidates make,
                a real example of a resume rewrite that doubled callback rates, and answers to the
                questions job seekers ask most often.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Your Resume Matters More Than Ever in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Recruiters often spend just a few seconds scanning each resume before deciding whether
              to move forward. Before a human even sees your application, most companies now run it
              through an ATS that filters and ranks resumes by keyword match and formatting
              compatibility — meaning a strong candidate with a poorly structured resume can be
              rejected before anyone reads a single achievement.
            </p>
            <p className="text-gray-600 leading-relaxed">
              GreatHire.in supports candidates by offering ATS-friendly resume guidance, ensuring your
              profile gains maximum visibility and reaches the right recruiters faster. Getting your
              resume right isn't just about looking professional — it's the single highest-leverage
              document in your entire job search.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Step-by-Step Guidance to Build a Successful Resume
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A 4-step framework to write, structure, and continuously improve your CV.
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
              8 Most Common Resume Mistakes (and How to Fix Them)
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              Each mistake has a root cause, a real impact, and a specific fix.
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
              Real Example: How One Candidate Went From 0 Callbacks to a New Job in 6 Weeks
            </h2>
            <div className="bg-gradient-to-br from-slate-700 to-gray-900 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  A
                </div>
                <div>
                  <p className="font-bold">{caseStudy.name}</p>
                  <p className="text-slate-300 text-xs">
                    {caseStudy.role} — {caseStudy.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {caseStudy.stages.map((m) => (
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
                {caseStudy.quote}
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
                {commonMistakesList.map((item, i) => (
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
              A successful CV isn't about listing everything you've ever done — it's about clearly
              communicating the value you bring, in a format that's easy for both recruiters and ATS
              systems to evaluate. Clean structure, achievement-focused content, and keyword alignment
              consistently outperform flashy design or generic, one-size-fits-all resumes.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Fix the resume. The interviews will follow.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Get Discovered by the Right Recruiters, Faster
            </h2>
            <p className="text-slate-300 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire connects job seekers with real, active opportunities across IT, business,
              data, and more — with ATS-friendly resume guidance to help your profile stand out from
              the very first screening.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-slate-800 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
            >
              Build Your Resume with GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}