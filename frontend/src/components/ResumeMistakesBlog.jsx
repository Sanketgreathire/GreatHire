import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Resume Mistakes That Get You Rejected Instantly",
  subtitle: "Resume Guide for Freshers — 2026",
  date: "May 09, 2026",
  readTime: "10 min read",
  category: "Career Development",
  keywords: [
    "resume mistakes freshers",
    "common resume mistakes 2026",
    "how to write resume for freshers",
    "resume tips for entry-level jobs",
    "fresher resume mistakes",
    "resume best practices India 2026",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "Before writing your resume, understand what recruiters are actually looking for. Most fresher resumes are generic — they list skills without proof, pad achievements, or focus on irrelevant details. Recruiters spend 6–8 seconds on a resume. In that time, they need to see: 1) Can you do the job? 2) Have you done anything similar? 3) Are you worth interviewing? Your resume must answer all three in the first 20 seconds. Industry expectations for freshers are not about experience — they're about clarity, proof, and demonstration of learning ability. Understand that your resume competes against hundreds of other freshers, so differentiation comes from specific projects, measurable results, and clear communication.",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge",
    desc: "Your resume is only as strong as the skills and projects behind it. If you're applying for a data role, you need real data projects — not just 'proficient in Excel.' Build a portfolio: create 2–3 project examples you can speak about in detail, contribute to open-source projects, complete certifications relevant to the role, and document everything with metrics. For software roles: build real applications with GitHub repos. For data roles: create notebooks analyzing real datasets. For business roles: create case studies or analyses. Recruiters will ask you about your resume in interviews — if you've padding or listed something you can't explain, it's rejection. Build skills that you can honestly defend and demonstrate.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "Use an ATS-friendly format: single column, standard fonts (Arial, Calibri), no graphics or boxes, clean sections (Education, Experience, Projects, Skills). Use keywords from job descriptions so your resume passes ATS screening and ranks higher. Tailor your resume for each role — don't send the same resume to 50 companies. For each application, review the job description and highlight 2–3 relevant skills or projects prominently. Proofread obsessively — typos, grammatical errors, and inconsistent formatting are instant rejections. Use tools: Grammarly for writing, Figstack or ATS-checker tools to validate formatting, GitHub to showcase code. Most importantly: get feedback. Send your resume to mentors, seniors, or peers in the industry before submitting.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Monitor your resume performance: how many applications are you sending weekly? How many interviews are you getting? Calculate your response rate (interviews / applications). If it's below 5%, your resume has a problem. Track which versions get responses and which don't. Ask for feedback after rejections when possible — 'Thank you for considering me. If there was anything in my application that wasn't a fit, I'd appreciate feedback so I can improve.' Save all feedback and iterate. Document what works: which project descriptions get questions? Which keywords trigger calls? Which format got the best response rate? Update your resume monthly, not just when applying. Your resume is a living document that improves with every cycle of feedback and iteration.",
  },
];

const mistakes = [
  {
    num: "01",
    title: "Making Your Resume About You Instead of the Job",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    badgeLabel: "Most Common",
    desc: "Freshers often list everything they've done — all hobbies, all courses, all projects — regardless of relevance. Your resume isn't a biography. If you're applying to a data science role, your high school debate team trophy is irrelevant. Recruiters are looking for evidence you can do THIS job, not everything you've ever done. Every line on your resume should answer: 'Why is this relevant to the role I'm applying for?' A resume filled with irrelevant information is harder to skim, dilutes your actual strengths, and signals you don't understand the role.",
    fix: "Tailor your resume for each role. Move relevant projects and skills to the top. Remove anything that doesn't connect to the job description. Keep your resume to one page as a fresher.",
  },
  {
    num: "02",
    title: "Listing Skills Without Proof or Context",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    badgeLabel: "Credibility Killer",
    desc: "A resume that says 'Proficient in Python, JavaScript, SQL, AWS, Machine Learning, Data Analysis' without any project or achievement to back it up is a red flag. Recruiters see hundreds of resumes like this. How do they know you actually know Python? Did you build something with it? Can you explain what you built? Listing technologies without context is padding, and recruiters can spot it immediately. You'll get called to interview on false credentials, stumble when asked to explain, and damage your credibility.",
    fix: "For each skill, mention one project where you used it. Example: 'Python (built a web scraper for 10K+ product reviews)' instead of just 'Python.' Add GitHub link if you have code to show.",
  },
  {
    num: "03",
    title: "Focusing on Responsibilities Instead of Results",
    color: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Impact Gap",
    desc: "Freshers often write: 'Responsible for developing a web application' or 'Worked on a data analysis project.' These are responsibilities, not results. They don't tell a recruiter what you actually accomplished. Did the web app work? How many users? What was the improvement? Did your analysis lead to a decision? Recruiters want to know the impact of your work. Result-focused descriptions stand out and prove you understand how to translate work into value.",
    fix: "Rewrite using metrics. 'Developed a web application that processed 1000+ user requests/day' or 'Built a data model that improved prediction accuracy by 15%.' Use numbers. They're memorable and quantifiable.",
  },
  {
    num: "04",
    title: "Using Generic or Buzzword-Heavy Language",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    badgeLabel: "Noise",
    desc: "Phrases like 'hardworking team player,' 'passionate about technology,' 'excellent communication skills,' and 'problem-solving mindset' are on thousands of resumes. They're meaningless without proof. Recruiters skip these. Buzzwords signal lazy writing and lack of specificity. Every word on your resume should either convey a skill, achievement, or relevant fact. Generic language wastes space and makes your resume harder to scan.",
    fix: "Replace buzzwords with specific examples. Instead of 'team player,' write: 'Collaborated with 4 team members to ship feature X in 2 weeks.' Specificity always beats generic praise.",
  },
  {
    num: "05",
    title: "Poor Formatting or Grammar Mistakes",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    badgeLabel: "Instant Rejection",
    desc: "Typos, inconsistent formatting, unclear sections, or poor spacing are automatic rejections. If you can't proofread your own resume, why should a company trust you with their code or data? Formatting issues also confuse ATS systems, causing your resume to be parsed incorrectly and filtered out before a human even sees it. A poorly formatted resume signals carelessness — and in hiring, carelessness is a major red flag.",
    fix: "Proofread 3+ times. Use Grammarly. Test your resume with an ATS checker. Use one consistent font, standard formatting, clear sections. Get a friend or mentor to review.",
  },
  {
    num: "06",
    title: "No Quantifiable Metrics or Evidence of Learning",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Missed Proof",
    desc: "As a fresher, you don't have work experience — you have projects and learning. But many freshers list projects without proof. 'Built a recommendation system' means nothing without context. Did you evaluate it? What was the accuracy? How did you learn from failures? Recruiters hiring freshers are looking for learning potential and intellectual honesty. They want to see you've built something real, measured it, reflected on it, and improved. Metrics prove you're analytical. Evidence of learning proves you're adaptable.",
    fix: "For each project, include: what you built, what metrics you tracked, what you learned. Add GitHub link and deployment link if possible. Mention specific challenges and how you overcame them.",
  },
  {
    num: "07",
    title: "Hiding Your Best Work or GitHub",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    badgeLabel: "Visibility Loss",
    desc: "Many freshers have built projects but don't link to them on their resume. They mention projects in vague terms but don't provide a way for recruiters to actually see the work. For technical roles, your code is your proof. Recruiters often check GitHub before or after the interview. If you have good projects on GitHub, they should be linked and highlighted on your resume. Not showing your work is like being a chef without letting people taste your food.",
    fix: "Add GitHub link at the top of your resume. Link to your best 2–3 projects directly. Include deployment links (Heroku, Vercel, etc.) if available. Make sure your profile is clean and README files are good.",
  },
  {
    num: "08",
    title: "Sending the Same Resume to Every Company",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    badgeLabel: "Effort Gap",
    desc: "Generic resumes get generic results (no interviews). A company looking for a full-stack developer doesn't care about your machine learning projects. A fintech company doesn't want to see your portfolio project about recipe recommendations. When you send the same resume to 50 different roles, you're competing against candidates who tailored their resume for each role. Those candidates get the interviews. Tailoring takes 10 minutes per role, but it's the difference between a 2% and a 10% response rate.",
    fix: "For each application, read the job description. Add 2–3 keywords from the description to your resume. Move the most relevant project to the top. Reorder skills to match the role. Spend 10 minutes per application on tailoring.",
  },
];

const practices = [
  "Tailor your resume for each role — match keywords and highlight relevant projects.",
  "Include GitHub link, portfolio, or deployment links so recruiters can see your actual work.",
  "Quantify everything — 'increased accuracy by 12%' is better than 'improved performance.'",
  "Limit to one page as a fresher — recruiters won't dig deeper into a second page.",
  "Proofread multiple times and ask someone experienced to review before submitting.",
  "Focus on impact over responsibilities — what did you build and what was the result?",
];

const resumeMistakesPractices = [
  "Listing skills without mentioning projects where you used them.",
  "Using generic phrases like 'passionate' and 'team player' without specific examples.",
  "Focusing on what you did instead of what you achieved (no metrics).",
  "Ignoring ATS requirements — complex formatting that breaks in ATS systems.",
  "Not linking to GitHub, portfolio, or project demos that prove your work.",
  "Writing a one-size-fits-all resume instead of tailoring for each role.",
];

const faqs = [
  {
    q: "How long should a fresher's resume be?",
    a: "One page is ideal. As a fresher, your resume should be concise and highlight your best work. Two pages signal you're padding. Use single spacing, 11–12pt font, narrow margins (0.75–1 inch) to fit everything. Recruiters spend 6–8 seconds on a fresher resume — make it count on one page. You don't have 10 years of experience to justify extra pages.",
  },
  {
    q: "Should I include projects if I haven't published them or deployed them?",
    a: "Yes, but only if you have code or documentation to show. Undeployed projects are less impressive, but having code on GitHub is better than nothing. For every project, include: what it does, how it works, what you learned, and a link to the code. If it's not deployed, mention you can provide a video demo. Recruiters value seeing how you think and write code over polished deployment.",
  },
  {
    q: "What should I do if I don't have relevant internship experience?",
    a: "Build projects. Internship experience is less important for freshers than for mid-level candidates. What matters is that you've built something real and can explain it. Create 2–3 projects that directly match the role you're applying for. Document them well, deploy them, and put them on your resume with detailed descriptions. Projects substitute for internship experience if they demonstrate the same skills.",
  },
  {
    q: "How do I explain gaps in my resume as a fresher?",
    a: "Freshers don't usually have 'gaps' — you're just graduating. If you took time off for personal reasons, you don't need to explain it on your resume (brief gaps are normal). If you took a long break between college and starting job search, spend that time building projects. Your resume will be stronger with your time explained by strong projects rather than left blank. Don't apologize for gaps — move forward with strong evidence of what you've been doing.",
  },
  {
    q: "Should I include my GPA or college marks on my resume?",
    a: "Only if your GPA is above 3.5/4.0 (or 75%+). If your GPA is lower, exclude it. Most companies don't care about GPA for technical roles — they care about what you can do. If your GPA is strong, include it. If it's not, let your projects and skills speak. Never lie about your GPA (it will be verified during background checks).",
  },
  {
    q: "How do I handle multiple roles or career directions on one resume?",
    a: "Create different versions of your resume for different roles. You can have a 'Data Science Resume,' a 'Web Development Resume,' and a 'Full-Stack Resume' depending on what you're applying for. When you tailor, move the most relevant skills and projects to the top. Consistency matters more than coverage — a focused resume for one role beats a generic resume for all roles.",
  },
  {
    q: "What if I've done projects in college but didn't publish them?",
    a: "Clean them up and publish them. Push old college projects to GitHub even if they're not recent. Add a README explaining what the project does and what you learned. A messy, undocumented GitHub repo is worse than no GitHub at all. If your projects are too embarrassing to show, they're not resume-worthy. Update them first or replace them with newer, stronger projects.",
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

export default function ResumeMistakesBlog() {
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
                Your resume is your first impression — and in most cases, your only impression before the interview. In 2026's competitive job market, fresher resumes are more scrutinized than ever. Recruiters are flooded with applications, so they're ruthless about filtering. <strong className="text-slate-700">Resume mistakes freshers make</strong> aren't just costing them interviews — they're costing them entry to their dream companies.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide walks through the 8 most costly resume mistakes freshers make, why they matter, and exactly how to fix them — so your resume gets noticed and your resume actually gets you interviews.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Resume Mistakes Matter More for Freshers
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              As a fresher, you don't have years of work experience to fall back on. Your resume is often your only credibility signal. A vague resume, missing GitHub link, or spelling mistake might cost a mid-level professional one interview — but it could cost you your career entry point. Recruiters spend 6–8 seconds on a fresher resume. In that time, they're making a binary decision: interview or reject. There's no second chance to impress.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The difference between a 2% response rate and a 15% response rate is usually not luck — it's a resume that's been optimized, tailored, and proofread. Every fresh graduate applying to your dream company has similar skills. Your resume is what separates you from the noise. Fix it, and doors open. Ignore it, and you'll spend weeks wondering why you're not getting interviews.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              4-Step Framework to Build a Standout Resume
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A structured approach to understanding what matters, building proof, and continuously improving.
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
              8 Resume Mistakes That Get You Rejected Instantly (and How to Fix Them)
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              Each mistake has consequences, but all are fixable.
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
              Real Example: How Aisha Went From 2% Response Rate to 25% in 3 Weeks
            </h2>
            <div className="bg-gradient-to-br from-slate-700 to-gray-900 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  A
                </div>
                <div>
                  <p className="font-bold">Aisha — Fresher from Delhi</p>
                  <p className="text-slate-300 text-xs">
                    Computer Science Graduate — Applying for Data Analyst Roles
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Week 1",
                    title: "The Problem",
                    desc: "Sent 50 resumes over 2 months. Got 1 interview. Resume was generic: listed 10 skills, 5 half-finished projects, no GitHub link, no metrics. No tailoring for different roles.",
                  },
                  {
                    month: "Week 2",
                    title: "The Fix",
                    desc: "Rewrote resume completely. Created 2 polished data projects with deployed links. Added GitHub URL prominently. Tailored resume keywords to each role. Added metrics to every project (e.g., 'Analyzed 50K+ rows of sales data'). Proofread 5 times.",
                  },
                  {
                    month: "Week 3–4",
                    title: "Results ✓",
                    desc: "Sent 15 new tailored resumes. Got 4 interviews. Response rate jumped from 2% to 27%. Now interviewing at 3 companies. Same person, better presentation.",
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
                "It wasn't about changing who I was. It was about showing who I actually am — clearly."
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
                {resumeMistakesPractices.map((item, i) => (
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
              Your resume is not just a list of skills — it's your professional narrative. For freshers, it's often the only thing between you and rejection. The mistakes that get resumes binned instantly are all fixable: vague language, missing proof, poor formatting, lack of tailoring, and generic descriptions. The companies getting the most callbacks from freshers aren't luckier — they've just invested time in clarity, proof, and presentation.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Fix your resume today. Your next interview is waiting.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Ready to Land Your First Opportunity?
            </h2>
            <p className="text-slate-300 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire connects freshers with the right companies — verified job opportunities, personalized support, and real hiring. Build your profile, show your skills, and get discovered.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-slate-800 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
            >
              Get Started on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
