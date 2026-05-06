import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Best Resume Format for Freshers",
  subtitle: "With Free Template",
  date: "May 06, 2026",
  readTime: "10 min read",
  category: "Resume Guide",
  keywords: [
    "resume format for freshers",
    "fresher resume template",
    "best resume format 2026",
    "fresher CV format",
    "resume format India",
    "entry level resume",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "Study 15–20 job descriptions for your target role and note common resume formats companies expect. Most recruiters spend only 6–8 seconds on a resume, so clarity matters more than content. Research industry standards using LinkedIn profiles of people in your target role. Join resume review groups on Reddit or LinkedIn communities.",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge",
    desc: "Your resume is only powerful if it has substance behind it. Build 2–3 real projects relevant to your target role. Complete one focused certification or course from Coursera, freeCodeCamp, or NPTEL. Write about your contributions with measurable impact wherever possible. Soft skills like communication and problem-solving matter as much as technical skills.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "Use ATS-friendly resume templates from Canva, Google Docs, or GitHub. Keep formatting simple — no graphics, tables, or unusual fonts. Follow the standard structure: Contact Info → Summary → Skills → Experience/Projects → Education → Certifications. Customize your resume for each role by highlighting relevant skills. Save as PDF to preserve formatting.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "After submitting each resume, track whether you get interview calls. If not, ask for feedback from mentors, professors, or LinkedIn community. Iterate — update your projects, add new skills, refine your summary. A/B test different versions of your resume to see what works. Review rejected applications monthly to identify patterns.",
  },
];

const tips = [
  {
    num: "01",
    title: "Use a Clean, ATS-Friendly Template",
    skills: "Standard fonts, no graphics, simple layout",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    desc: "Applicant Tracking Systems (ATS) scan resumes for keywords. Avoid columns, tables, creative fonts, and images. Stick to Arial, Calibri, or Times New Roman. Margins should be 0.5 to 1 inch. Your resume is a data document, not a design piece.",
  },
  {
    num: "02",
    title: "Start with a Strong Professional Summary",
    skills: "2–3 lines, 30–50 words, your value proposition",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    desc: "Write a brief summary highlighting your target role, key skills, and unique value. Example: 'Aspiring Junior Developer with hands-on experience in Python, React, and REST APIs. Built 3 full-stack projects. Seeking growth in a collaborative team environment.'",
  },
  {
    num: "03",
    title: "Highlight Real Projects, Not Just Coursework",
    skills: "GitHub links, live demos, measurable outcomes",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    desc: "One solid project with a GitHub link beats 10 certifications. For each project, include 1–2 lines about what you built, technologies used, and measurable outcomes. Example: 'Built E-commerce Platform in React with 50+ SKUs, reducing load time by 40% through lazy loading optimization.'",
  },
  {
    num: "04",
    title: "Use Action Verbs and Measurable Impact",
    skills: "Designed, built, optimized, automated, managed",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    desc: "Instead of 'Responsible for coding', write 'Coded and tested 12 features, reducing production bugs by 30%.' Numbers make impact concrete. Use verbs like developed, designed, implemented, optimized, managed, created.",
  },
  {
    num: "05",
    title: "Keep Your Education Section Lean",
    skills: "Degree, college, graduation date, GPA (if strong)",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    desc: "For freshers, education is crucial but keep it simple. Include degree, college, graduation date, and GPA only if it's 7.5+ or relevant. Skip high school. Add relevant coursework if it strengthens your candidacy (e.g., 'Relevant Coursework: Data Structures, Algorithms, DBMS').",
  },
  {
    num: "06",
    title: "Add a Skills Section with Relevant Keywords",
    skills: "Technical, tools, languages, platforms",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    desc: "List skills under categories: Technical (Python, Java, React), Tools (Git, Figma, Jira), Certifications. Keep it short and relevant to the job. ATS scans this section heavily, so match keywords from job descriptions. Avoid padding with skills you barely know.",
  },
  {
    num: "07",
    title: "Make Your Contact Information Clear",
    skills: "Phone, email, LinkedIn, GitHub, portfolio",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    desc: "Place at the top of your resume. Include professional email (not cuteemail@...), phone number, LinkedIn URL, GitHub profile, and portfolio website if you have one. Make URLs clickable in your PDF for easy access.",
  },
  {
    num: "08",
    title: "Avoid Common Fresher Resume Mistakes",
    skills: "No photo, no irrelevant info, no typos",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    desc: "Skip your photo (unless the job requires it). Avoid mentioning hobbies like 'gaming' or 'watching movies'. No typos or grammatical errors — spell-check is non-negotiable. Don't list outdated technologies unless directly relevant. Keep length to 1 page.",
  },
];

const faqs = [
  {
    q: "What should be the ideal length of a fresher's resume?",
    a: "Stick to 1 page. Recruiters spend 6–8 seconds on a resume — one focused page beats two pages of fluff. Every line should add value. After 2–3 years of experience, you can expand to 2 pages.",
  },
  {
    q: "Should freshers include a photo on their resume?",
    a: "Only if the job description explicitly asks for it. In India, some companies request it; most don't. A professional headshot is fine if included, but it's not necessary for IT, data, or tech roles.",
  },
  {
    q: "How do I make my resume ATS-friendly?",
    a: "Use simple fonts (Arial, Calibri), standard section headings, no columns or graphics, and keywords from the job description. Save as PDF to preserve formatting. Test with ATS checker tools available online.",
  },
  {
    q: "What if I don't have work experience as a fresher?",
    a: "Focus on projects, internships, coursework, and certifications. A strong portfolio project with GitHub link is worth more than experience doing nothing. Highlight problem-solving skills and learning ability.",
  },
  {
    q: "Should I include GPA if it's below 7?",
    a: "Only include if it's 7.5 or above. If your GPA is lower, focus on projects, skills, and practical learning instead. Many companies filter by GPA, so be strategic.",
  },
  {
    q: "How should I list my projects on a resume?",
    a: "For each project, include: Project Name, technologies used, brief description (1–2 lines), and measurable outcome. Add GitHub or live demo link. Example: 'Social Media Platform (React, Node.js, MongoDB) — Built with 500+ active users, 95% page load performance score. GitHub: [link]'",
  },
  {
    q: "Is it okay to use a creative resume template?",
    a: "Only if it's ATS-friendly and passes ATS scanners. Avoid colored backgrounds, multiple columns, or heavy graphics. Stick to simple, clean templates. Remember: ATS and recruiter scanning come before design appreciation.",
  },
  {
    q: "What certifications should freshers list on their resume?",
    a: "List certifications directly relevant to your target role (AWS, Google Cloud, React, Python, SQL). Skip general certifications like 'Personality Development'. Add only if completed — fake certifications will be verified.",
  },
];

const practices = [
  "Use consistent formatting — same font, spacing, and bullet style throughout.",
  "Tailor your resume for each application — highlight skills matching the job description.",
  "Include links to GitHub, portfolio, or live projects to showcase your work.",
  "Update your resume monthly with new skills, projects, or achievements.",
  "Get feedback from mentors, professors, or LinkedIn communities before applying.",
  "Use a professional email address — firstname@gmail.com or firstnamelastname@gmail.com.",
];

const mistakes = [
  "Generic objective statement ('Seeking a challenging role...') — write a specific summary instead.",
  "Too much text — recruiters skim, so use bullet points and keep sentences short.",
  "Spelling and grammar errors — one typo can eliminate your application.",
  "Irrelevant information — hobbies, high school grades, or unrelated skills clutter your resume.",
  "Weak action verbs — avoid 'responsible for' or 'involved in', use 'built', 'designed', 'optimized'.",
  "No quantifiable impact — always include numbers, percentages, or measurable outcomes.",
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

export default function ResumeFresherGuide() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-blue-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-blue-200 text-sm">
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
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                Your resume is your first introduction to recruiters and hiring managers. For freshers, a well-structured resume can mean the difference between being shortlisted and overlooked. With <strong className="text-blue-700">thousands of applications</strong> per opening, your resume has only <strong>6–8 seconds</strong> to grab attention.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide covers the best resume format for freshers in 2026, industry expectations, step-by-step strategies, real examples, and actionable templates to help you land interviews.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Why Resume Format Matters for Freshers in 2026</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Most companies use <strong>Applicant Tracking Systems (ATS)</strong> to scan resumes for keywords before a human ever sees them. A poorly formatted resume — no matter how strong your background — can be filtered out automatically. Additionally, recruiters are scanning resumes faster than ever, expecting clear structure and immediate clarity about your skills and value.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The right resume format is ATS-compatible, mobile-friendly when shared as a link, and optimized for both human readers and automation systems. In 2026, a 1-page resume with relevant projects, skills, and certifications beats a 2-page resume filled with irrelevant information every single time.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A practical 4-step plan to build your perfect resume.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── RESUME COMPONENTS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Key Resume Components for Freshers</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">What to include and how to structure each section.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {tips.map((tip) => (
                <div key={tip.num} className={`border rounded-2xl p-5 sm:p-6 ${tip.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{tip.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${tip.badge}`}>{tip.skills}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: Before & After Resume Transformation</h2>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-red-500/20 rounded-xl p-4 border border-red-300/50">
                  <p className="font-bold text-red-100 text-xs uppercase tracking-wider mb-3">❌ Weak Resume</p>
                  <ul className="space-y-2 text-sm">
                    <li>• "Objective: Seeking a challenging job role..."</li>
                    <li>• "Responsible for coding in Python"</li>
                    <li>• "Developed a project" (no details)</li>
                    <li>• "Languages: C, C++, Java, Python"</li>
                    <li>• No projects or links</li>
                    <li>• GPA: 6.8 (included unnecessarily)</li>
                  </ul>
                </div>
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-300/50">
                  <p className="font-bold text-green-100 text-xs uppercase tracking-wider mb-3">✓ Strong Resume</p>
                  <ul className="space-y-2 text-sm">
                    <li>• "Aspiring Junior Developer with Python & React experience..."</li>
                    <li>• "Built full-stack e-commerce platform reducing load time by 40%"</li>
                    <li>• Projects with GitHub links & measurable outcomes</li>
                    <li>• "Skills: Python, React, REST APIs, Git"</li>
                    <li>• 2–3 real, portfolio projects linked</li>
                    <li>• Education only — no GPA (kept focused)</li>
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-blue-100 text-sm italic border-t border-white/20 pt-4">
                "One focused, well-structured resume landed 3 interviews in 2 weeks. The transformation was clarity, specificity, and proof of capability."
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
              Your resume is your marketing document — it needs to communicate your value in seconds, not minutes. Follow the format guidelines, highlight real projects and measurable impact, and customize for each role. Remember: quality beats quantity, clarity beats creativity, and proof beats promises.
            </p>
            <p className="text-gray-800 font-semibold text-lg">A strong resume opens doors. Build it right, and let your skills do the talking.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Build Your Perfect Resume?</h2>
            <p className="text-blue-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Get access to free resume templates, ATS checkers, and personalized feedback from industry professionals on GreatHire.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-blue-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
            >
              Download Resume Template on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
