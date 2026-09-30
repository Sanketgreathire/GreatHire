import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const blog = {
  title: "ATS Optimization",
  subtitle: "Getting Your Resume Past the Robots in 2026",
  date: "Dec 18, 2025",
  readTime: "12 min read",
  category: "Resume Tips",
  keywords: [
    "ATS friendly resume",
    "applicant tracking system tips",
    "resume keyword optimization",
    "pass ATS screening 2026",
    "ATS resume format",
    "beat resume filters",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics — What an ATS Actually Does",
    desc: "An Applicant Tracking System (ATS) is software that companies use to collect, sort, filter, and rank resumes before a human recruiter ever opens them. It scans your resume for keywords, job titles, skills, and formatting cues that match the job posting, then assigns a match score or filters you out entirely. Roughly 75% of resumes are rejected by an ATS before reaching a recruiter — often not because the candidate lacks the skills, but because the resume wasn't structured in a way the system could read. Understanding this reality is the first step to beating it.",
  },
  {
    num: "02",
    title: "Build an ATS-Compatible Resume Structure",
    desc: "Most ATS software struggles with anything that isn't plain, linear text. Use a single-column layout with standard section headings like 'Work Experience,' 'Education,' and 'Skills.' Avoid tables, text boxes, columns, headers/footers, graphics, and icons — these often get scrambled or skipped entirely during parsing. Stick to standard fonts (Calibri, Arial, Times New Roman) and save your final resume as a .docx or a text-based PDF, since some older ATS systems struggle with certain PDF exports.",
  },
  {
    num: "03",
    title: "Apply Smart Keyword and Content Strategies",
    desc: "ATS systems rank resumes largely by keyword match against the job description. Carefully read the posting and mirror its exact language — job titles, tools, certifications, and required skills — while keeping your writing natural and truthful. Include both the spelled-out term and its abbreviation where relevant (e.g., 'Search Engine Optimization (SEO)'), since some systems search for one or the other. Place your most important keywords in your summary and skills section, where they're weighted most heavily.",
  },
  {
    num: "04",
    title: "Test, Verify, and Continuously Improve",
    desc: "Before submitting, run your resume through a free ATS-scoring tool to check keyword match and formatting compatibility against a specific job posting. Save multiple tailored versions of your resume for different types of roles, and track which versions produce more callbacks. ATS algorithms and company systems evolve — treat resume optimization as an ongoing practice, not a one-time fix.",
  },
];

const strategies = [
  {
    num: "01",
    category: "Formatting Strategy",
    title: "Use a Simple, Single-Column Layout",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    type: "Formatting",
    desc: "Multi-column resumes, sidebars, and creative templates often confuse ATS parsers, causing sections to be read out of order or skipped entirely. Stick to a single-column, top-to-bottom layout with clear section breaks. Save as .docx unless the employer specifies PDF, and always test your PDF export by copy-pasting its text into a plain document to check nothing got garbled.",
  },
  {
    num: "02",
    category: "Keyword Strategy",
    title: "Mirror the Job Description's Exact Language",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    type: "Keywords",
    desc: "If the posting says 'Project Management,' don't only write 'managed projects' — include the exact phrase somewhere natural in your resume. Build a shortlist of the top 10–15 keywords from the job posting (skills, tools, certifications, job titles) and confirm each one appears at least once in your resume, ideally in context with a real achievement.",
  },
  {
    num: "03",
    category: "Section Naming",
    title: "Use Standard, Recognizable Section Headers",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    type: "Structure",
    desc: "Creative header names like 'My Journey' or 'What I Bring' can confuse ATS parsing logic, which is trained to recognize standard terms. Stick to conventional headers: 'Professional Summary,' 'Work Experience,' 'Education,' 'Skills,' and 'Certifications.' This ensures the system correctly categorizes each part of your resume.",
  },
  {
    num: "04",
    category: "File & Format Hygiene",
    title: "Avoid Images, Icons, and Embedded Text",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    type: "Formatting",
    desc: "Skill icons, star ratings, profile photos, and text embedded inside images or graphics are typically invisible to ATS software — meaning any information inside them is effectively lost. Convert all content to plain, selectable text, and reserve visual design elements for a supplementary portfolio or LinkedIn profile instead of your primary ATS-facing resume.",
  },
  {
    num: "05",
    category: "Contact & Metadata",
    title: "Keep Contact Information Simple and in the Body",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    type: "Structure",
    desc: "Placing your name, phone number, or email inside a header or footer can cause some ATS systems to miss this information entirely, resulting in a resume that looks complete to you but arrives at the recruiter with no way to contact you. Always place contact details in the main body, at the very top of the document.",
  },
  {
    num: "06",
    category: "Job Title Alignment",
    title: "Align Your Titles With Industry-Standard Terms",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    type: "Keywords",
    desc: "If your actual title was something company-specific like 'Growth Ninja,' but the industry-standard term is 'Marketing Specialist,' include both — the standard term ensures ATS keyword matching works, while your real title preserves accuracy. Clarify in parentheses if needed: 'Growth Ninja (Marketing Specialist).'",
  },
  {
    num: "07",
    category: "Tailoring Per Application",
    title: "Customize Your Resume for Each Job Posting",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    type: "Strategy",
    desc: "A single generic resume, no matter how well-optimized, will rarely score as highly as a resume tailored to a specific posting's exact keywords and priorities. Spend 5–10 minutes per application adjusting your summary and skills section to reflect that particular role's language — this consistently produces meaningfully higher ATS match scores.",
  },
  {
    num: "08",
    category: "Verification",
    title: "Test Your Resume Before You Submit It",
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    type: "Quality Check",
    desc: "Never assume your resume is ATS-friendly — verify it. Use a free ATS-checker tool to scan your resume against the specific job description and see your match percentage and missing keywords. Also do a manual check: copy your resume text into a plain notepad file. If the text looks scrambled, out of order, or missing sections, your original formatting likely won't parse correctly either.",
  },
];

const faqs = [
  {
    q: "What percentage of resumes get rejected by ATS before a human sees them?",
    a: "Industry estimates suggest around 75% of resumes are filtered out by ATS software before ever reaching a recruiter. This is often not because the candidate is unqualified, but because of formatting issues, missing keywords, or non-standard section headers that the system fails to parse correctly.",
  },
  {
    q: "Do all companies use the same type of ATS?",
    a: "No. There are many different ATS platforms (Workday, Greenhouse, Lever, Taleo, and others), each with slightly different parsing capabilities and ranking algorithms. This is exactly why sticking to universally safe formatting — simple layout, standard headers, no graphics — is the safest strategy, since it works across the widest range of systems.",
  },
  {
    q: "Should I use a resume template I found online?",
    a: "Be cautious. Many visually appealing templates use multi-column layouts, text boxes, or graphics that look great to a human but parse poorly in ATS software. If you use a template, verify it uses a simple, single-column structure, or test it thoroughly with an ATS-checker tool before relying on it.",
  },
  {
    q: "How many keywords should I include from a job description?",
    a: "There's no strict number, but aim to naturally incorporate the 10–15 most important skills, tools, and qualifications mentioned in the posting. Avoid keyword-stuffing (repeating the same term unnaturally many times), as this can look suspicious to both ATS systems and human reviewers.",
  },
  {
    q: "Does a PDF resume work with ATS software?",
    a: "Most modern ATS systems can read text-based PDFs correctly, but older or less sophisticated systems sometimes struggle with certain PDF exports, especially ones created from image-heavy or design-heavy tools. If a job posting doesn't specify a format, a simple, text-based PDF or a .docx file are both generally safe choices.",
  },
  {
    q: "Can a great resume still get rejected because of ATS issues?",
    a: "Yes — this is one of the most frustrating realities of modern job searching. A candidate can be fully qualified, but if their resume uses graphics, unusual formatting, or misses key terminology, the ATS may filter them out before a recruiter ever reviews their actual experience. This is exactly why ATS optimization matters as much as the content itself.",
  },
  {
    q: "How do I know if my resume actually passed an ATS scan?",
    a: "You typically won't get direct feedback from the ATS itself, but you can proactively test your resume using free or paid ATS-checker tools that simulate how a system will read it and give you a match score against a specific job description. A consistently low score across multiple postings usually signals a formatting or keyword problem worth fixing.",
  },
];

const practices = [
  "Use a single-column, text-based resume format with standard section headers.",
  "Mirror the exact keywords, job titles, and skills from each job description.",
  "Save your resume as a text-based PDF or .docx, and verify it copy-pastes cleanly.",
  "Tailor your resume's summary and skills section for every individual application.",
  "Test your resume with an ATS-checker tool before submitting to important roles.",
  "Keep contact information in the main body of the resume, not in a header or footer.",
];

const mistakes = [
  "Using multi-column layouts, tables, or text boxes that ATS systems can't parse.",
  "Relying on icons, star ratings, or graphics to represent skills instead of plain text.",
  "Sending the same generic, untailored resume to every job posting.",
  "Using creative section headers instead of standard terms like 'Work Experience.'",
  "Placing your name or contact details inside a header/footer element.",
  "Assuming a visually impressive resume design automatically means it's ATS-friendly.",
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
        <span className={`text-green-600 font-bold text-xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function ATSOptimizationBlog() {
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
        <header className="bg-gradient-to-br from-rose-600 via-pink-700 to-purple-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-rose-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-rose-200 text-sm">
              <span>📅 {blog.date}</span>
              <span className="hidden sm:inline">·</span>
              <span>⏱ {blog.readTime}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.keywords.map((kw) => (
                <span key={kw} className="bg-white/15 border border-white/25 text-white text-xs px-3 py-1 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* ── INTRODUCTION ── */}
          <section className="mb-14">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Gaining visibility in today's competitive job market requires an ATS-friendly resume.{" "}
                <strong className="text-rose-700">Applicant Tracking Systems (ATS)</strong> automatically
                analyze and assess resumes based on predetermined criteria — including relevant
                keywords, skills, job titles, and formatting — before they're ever sent to a recruiter.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                Regardless of a candidate's actual qualifications, resumes that aren't suited to
                applicant tracking systems can be eliminated early in the process. Making your resume
                ATS-compliant ensures recruiting professionals actually get to review your profile —
                dramatically improving your chances of passing that critical first screening.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Why ATS Optimization Matters More Than Ever in 2026</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Most mid-to-large companies now use some form of ATS to manage the flood of applications
              they receive for every open role. These systems don't judge you the way a human would —
              they scan for pattern matches: keywords lifted from the job posting, standard formatting
              they can reliably parse, and section structures they recognize.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This means two equally qualified candidates can have wildly different outcomes based
              purely on how their resume was built — one optimized for ATS parsing sails through to a
              recruiter's desk, while the other, despite stronger real-world experience, never gets
              seen at all. Understanding and optimizing for ATS isn't optional anymore — it's a
              foundational part of a successful job search.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Framework to Beat the ATS</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step system to build, optimize, and verify an ATS-friendly resume.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── STRATEGIES ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Proven ATS Optimization Strategies</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">From formatting to keyword strategy — the complete ATS playbook.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {strategies.map((strategy) => (
                <div key={strategy.num} className={`border rounded-2xl p-5 sm:p-6 ${strategy.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{strategy.num}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${strategy.badge}`}>{strategy.type}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-widest">{strategy.category}</p>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{strategy.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{strategy.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: From Zero Callbacks to a 90% ATS Match Score</h2>
            <div className="bg-gradient-to-br from-rose-600 to-purple-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">R</div>
                <div>
                  <p className="font-bold">Rohan Mehta</p>
                  <p className="text-rose-200 text-xs">2 Years Experience, Data Analyst — Hyderabad</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    period: "Before Optimization",
                    status: "0 callbacks in 30+ applications",
                    breakdown: "Two-column, graphic-heavy template → skill icons and star ratings → contact info in a styled header → 41% average ATS match score",
                  },
                  {
                    period: "After Optimization",
                    status: "6 recruiter callbacks in 2 weeks",
                    breakdown: "Single-column plain layout → keywords mirrored from each job posting → contact info moved into the body → 90% average ATS match score",
                  },
                ].map((item) => (
                  <div key={item.period} className="bg-white/15 rounded-xl p-4">
                    <p className="text-rose-200 text-xs font-bold uppercase tracking-wider mb-2">{item.period}</p>
                    <p className="font-bold mb-2">{item.status}</p>
                    <p className="text-rose-100 text-sm leading-relaxed">{item.breakdown}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-rose-100 text-sm leading-relaxed">
                  <strong className="text-white">What changed?</strong> Removed all graphics and icons, converted to a single-column format with standard section headers, tailored the skills section to match each job posting's exact terminology, and verified every version with a free ATS-checker tool before submitting.
                </p>
              </div>
              <p className="text-rose-100 text-sm italic border-t border-white/20 pt-4">
                "I had the right experience the whole time — my resume just wasn't speaking the same language as the system reading it. Once I fixed that, everything changed within two weeks."
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
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
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
                {mistakes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 font-bold mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
            </div>
          </section>

          {/* ── CONCLUSION ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Conclusion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              ATS optimization isn't about gaming a system — it's about making sure your real
              qualifications actually get seen. A simple, well-structured resume with the right
              keywords consistently outperforms a visually creative one that a computer can't read
              correctly.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              In 2026's competitive job market, the candidates who understand both the human and the
              software side of hiring have a real edge. Build your resume for both audiences, and
              you'll spend less time wondering why you're not getting callbacks — and more time
              preparing for interviews.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Format for the machine. Write for the human. Get seen by both.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-rose-600 to-purple-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Get Your Resume ATS-Ready</h2>
            <p className="text-rose-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire.in offers ATS-friendly resume guidance and connects your optimized profile
              with recruiters actively hiring in your field — so your qualifications actually get seen.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-rose-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-rose-50 transition-colors shadow-lg"
            >
              Optimize Your Resume on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}