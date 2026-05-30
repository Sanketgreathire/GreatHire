import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Top High-Paying Skills You Can Learn in 3 Months",
  subtitle: "Salary Boost Roadmap",
  date: "May 06, 2026",
  readTime: "13 min read",
  category: "Quick Skills Guide",
  keywords: [
    "high paying skills India",
    "skills to learn in 3 months",
    "high salary skills 2026",
    "quick money making skills",
    "in-demand high-paying jobs",
    "fast track career skills",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "Research which skills are in highest demand RIGHT NOW in your target industry. Check job descriptions to see what's being offered at premium salaries. Identify skills that have short learning curves but high market value — these are your opportunities. Talk to professionals already earning well from these skills. Understand the job market gap: where are companies struggling to find talent? That's where premium salaries exist.",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge",
    desc: "Pick ONE skill to master in 3 months. Trying to learn multiple skills dilutes focus and extends timeline. Use structured, paid courses from Udemy, Coursera, or industry-specific platforms (Salesforce Trailhead, AWS, Google Cloud) rather than free resources — paid courses compress learning time. Dedicate 2–3 hours daily. Build 1–2 portfolio projects proving your capability. Get certified if the certification is recognized in your industry.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "Start applying WHILE still learning (month 2–3). Don't wait for perfection. Apply to companies actively hiring for this skill. Highlight your new certification and projects prominently. Use LinkedIn to announce your new skill, connect with recruiters, and engage in relevant conversations. For some skills (AWS, Salesforce, Power BI), build a portfolio demonstrating competence. Reach out to mentors already in the field for referrals.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Track your learning milestones: course completion date, project dates, certification date, interview calls, offer received. After landing a role with your new skill, continue learning — the learning doesn't stop at month 3. Plan your next skill addition for 6–12 months out. Aim for continuous upskilling: every 6–12 months, add a complementary skill to increase your market value and salary.",
  },
];

const skills = [
  {
    num: "01",
    title: "AWS Cloud Certification (Solutions Architect)",
    salary: "₹5–8 LPA",
    learning: "3 months (60–80 hours)",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    type: "Certification",
    desc: "AWS is the cloud king. Certification + hands-on projects make you immediately hireable. Employers pay premium for certified AWS professionals. Free tier available for practice. Exam costs ₹13,000 but ROI is massive — salary boost of ₹1.5–3 LPA typical.",
    roadmap: "Week 1-2: EC2, S3, VPC basics. Week 3-4: RDS, Lambda, IAM. Week 5-6: Projects. Week 7-8: Mock exams & certification.",
  },
  {
    num: "02",
    title: "Data Analytics (SQL + Python + Power BI)",
    salary: "₹4.5–7 LPA",
    learning: "3 months (70–90 hours)",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    type: "Skill Stack",
    desc: "Fastest growing fresher role. SQL + Python + Power BI is the holy trinity. Build 2–3 analytics projects. Companies desperate for data analysts right now. Salary growth potential to ₹8–12 LPA within 2 years.",
    roadmap: "Month 1: SQL mastery (HackerRank, LeetCode). Month 2: Python + Pandas. Month 3: Power BI + 2 portfolio projects.",
  },
  {
    num: "03",
    title: "Salesforce Administrator / Developer",
    salary: "₹4–7 LPA",
    learning: "3 months (80–100 hours)",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    type: "Certification",
    desc: "Salesforce skills are in permanent shortage. Free learning on Trailhead. Admin certification easier, Developer harder but pays more. Indian tech companies desperate for Salesforce talent. Salary jumps of ₹2–4 LPA common.",
    roadmap: "Month 1: Salesforce fundamentals on Trailhead. Month 2: Deep admin features. Month 3: Mock exams + certification.",
  },
  {
    num: "04",
    title: "UI/UX Design (Figma + Design Systems)",
    salary: "₹3.5–6 LPA",
    learning: "3 months (60–80 hours)",
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    type: "Design Skill",
    desc: "Design skills command premium. Figma is industry standard. Build 3–5 portfolio projects. Work on real Dribbble/Behance projects. Freelance gigs pay ₹1–3 LPA while employed. High demand in startups and product companies.",
    roadmap: "Month 1: Figma basics + design fundamentals. Month 2: Design systems & UI components. Month 3: 3–4 portfolio projects.",
  },
  {
    num: "05",
    title: "Azure Cloud Certification",
    salary: "₹4.5–7 LPA",
    learning: "3 months (60–80 hours)",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    type: "Certification",
    desc: "Microsoft's cloud platform gaining massive traction. Azure + Office 365 = high demand in enterprises. Easier than AWS for beginners. Exam costs ₹5,500. Free credits for practice. Enterprise companies pay well for Azure expertise.",
    roadmap: "Week 1-2: Azure basics. Week 3-4: Virtual machines, storage, databases. Week 5-6: App services & monitoring. Week 7-8: Certification prep.",
  },
  {
    num: "06",
    title: "Advanced Excel (Finance / Data Analysis)",
    salary: "₹3–5.5 LPA",
    learning: "2–3 months (40–60 hours)",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    type: "Practical Skill",
    desc: "Underestimated but high-paying. VLOOKUP, pivot tables, macros, financial modeling. Finance and investment roles value this heavily. Build financial models. Create dashboards. Excel expertise + domain knowledge = ₹5–8 LPA entry.",
    roadmap: "Week 1-2: Formulas & functions deep dive. Week 3-4: Pivot tables & data analysis. Week 5-6: Macros & automation. Week 7-8: Financial modeling projects.",
  },
  {
    num: "07",
    title: "Ethical Hacking / Cybersecurity Basics (CEH)",
    salary: "₹5–9 LPA",
    learning: "3 months (100–120 hours)",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    type: "Certification",
    desc: "Cybersecurity shortage is severe. CEH certification highly valued. Steep learning curve but highest ROI among 3-month skills. Government and finance sectors pay premium. Career growth to ₹12–25+ LPA realistic.",
    roadmap: "Month 1: Networking + security fundamentals. Month 2: Penetration testing basics. Month 3: Practical labs + CEH mock exams.",
  },
  {
    num: "08",
    title: "Digital Marketing (Google Ads + SEO + Analytics)",
    salary: "₹2.5–5 LPA",
    learning: "3 months (50–70 hours)",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    type: "Skill Stack",
    desc: "Google Ads certification free. SEO expertise valuable for content companies and e-commerce. Build 2–3 real campaigns, not just theory. Freelance income potential ₹50K–2 LPA/month while learning. Fast track to startup roles.",
    roadmap: "Month 1: Google Ads + Analytics certification. Month 2: SEO fundamentals. Month 3: 2–3 live campaign projects.",
  },
];

const faqs = [
  {
    q: "Is 3 months really enough to become job-ready in these skills?",
    a: "For entry-level roles? Yes. For junior positions? Absolutely. You won't be a senior in 3 months, but you'll be hirable at competitive salaries. The key: you need focused, disciplined learning + 1–2 portfolio projects. Theory alone won't work.",
  },
  {
    q: "Which of these 8 skills has the fastest ROI (salary increase)?",
    a: "Fastest: AWS, Azure, CEH (instant ₹1.5–3 LPA jump). Most accessible: Advanced Excel, Digital Marketing (learnable even without tech background). Best for freshers: Data Analytics, Salesforce (higher entry salary than other freshers).",
  },
  {
    q: "Should I get certified or just build portfolio projects?",
    a: "Both. Certifications (AWS, Azure, Salesforce, CEH) are your ticket past ATS systems. Portfolio proves actual capability. Together: certification gets you interview call, portfolio gets you offer. Certification alone often isn't enough.",
  },
  {
    q: "Can I learn 2 of these skills in 3 months to maximize income?",
    a: "Not recommended. Trying to learn 2 complex skills (AWS + CEH) will dilute focus and you'll finish neither properly. Better: master 1 skill in 3 months, get hired, earn while learning, add second skill in months 4–6.",
  },
  {
    q: "What's the cost of learning these skills?",
    a: "AWS: Udemy course ₹400 + exam ₹13K. Azure: ₹500 + exam ₹5.5K. Salesforce: Free (Trailhead). Data Analytics: Udemy ₹400. Ethical Hacking: ₹2–5K (pricey). Digital Marketing: Most free. Total range: ₹500–20K depending on skill.",
  },
  {
    q: "I don't have an IT background. Can I still learn these in 3 months?",
    a: "Depends on skill. AWS, Azure, Salesforce: Yes. Data Analytics: Yes (need basic coding). CEH, UI/UX Design: Possible but harder. Digital Marketing, Advanced Excel: Easy. Start with your strength, not the highest salary.",
  },
  {
    q: "After learning the skill, how long until I get hired?",
    a: "If portfolio projects are strong: 1–2 weeks to first interview, 2–4 weeks to offer. If only certified but no projects: 2–3 months to offer (certification gets interview, but projects seal the deal). Active job search essential.",
  },
  {
    q: "Do these skills keep their value, or will they become obsolete?",
    a: "AWS, Azure, Data Analytics: Solid for 5+ years minimum. Salesforce, Excel: Evergreen. CEH: Evolves but always valuable. Digital Marketing: Changes fast, need continuous learning. Pick skills with longevity, not just quick money.",
  },
];

const practices = [
  "Choose ONE skill aligned with job market demand right now, not personal interest alone.",
  "Commit to 2–3 hours daily for 3 months — consistency beats intensity.",
  "Build portfolio projects while learning, not after — they prove capability.",
  "Get certified if it exists for your skill — certification + portfolio = job offer.",
  "Start job searching in month 2 — don't wait until month 3 finishes.",
  "Find a mentor already earning well with this skill — they'll accelerate your learning.",
];

const mistakes = [
  "Trying to learn multiple complex skills simultaneously — pick ONE.",
  "Only learning theory without building portfolio projects — projects get you hired.",
  "Waiting until certification before applying — apply during month 2 of learning.",
  "Choosing skills based on personal interest rather than market demand — check job boards.",
  "Not negotiating on salary when hired — your new skill is worth ₹1–3 LPA premium.",
  "Forgetting soft skills — high-paying skills require communication to monetize.",
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

export default function HighPayingSkills3Months() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-emerald-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-emerald-200 text-sm">
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
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                What if you could learn a skill in just 3 months and command ₹1.5–3 LPA more salary immediately? In 2026, this isn't a dream — it's a documented pattern. <strong className="text-emerald-700">Specialized, high-demand skills have compressed learning curves and inflated salaries.</strong> Companies will pay premiums for professionals who know AWS, Salesforce, advanced analytics, or cybersecurity.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide identifies 8 proven high-paying skills you can genuinely master in 90 days, along with exact roadmaps, salary expectations, and real examples of freshers who learned these skills and landed premium roles.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">The 3-Month Skill Economy: Why It Works in 2026</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The job market has bifurcated. Generalists compete heavily. Specialists command premium salaries. Why? <strong>Skill shortage is acute.</strong> Companies can't find AWS-certified professionals, data analysts, or Salesforce experts fast enough. They're willing to pay 30–50% more for someone who has the specific skill vs. someone without it.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The 3-month window works because these skills have been designed to be learnable quickly. AWS and Salesforce have certification programs built around 3-month timelines. Data Analytics has a clear learning path. The barrier isn't time — it's focused, disciplined execution. Most people quit at week 4. Those who finish are in high demand.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to learn high-paying skills in 3 months.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── SKILLS BREAKDOWN ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 High-Paying Skills: Salary, Timeline & Roadmap</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">Learnable in 3 months, valued for ₹4–9 LPA entry salaries.</p>
            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.num} className={`border rounded-2xl overflow-hidden ${skill.color}`}>
                  <div className="bg-gradient-to-r from-transparent to-white/10 px-5 sm:px-6 py-4 border-b border-gray-200/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-black text-gray-200">{skill.num}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${skill.badge}`}>{skill.type}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{skill.title}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm mt-3">
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-semibold">Expected Salary</p>
                        <p className="font-bold text-gray-900">{skill.salary}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-semibold">Learning Time</p>
                        <p className="font-bold text-gray-900">{skill.learning}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 sm:px-6 py-5">
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{skill.desc}</p>
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase mb-2">📋 3-Month Roadmap:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{skill.roadmap}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: ₹2 LPA → ₹5.5 LPA in 90 Days</h2>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">V</div>
                <div>
                  <p className="font-bold">Vikram</p>
                  <p className="text-emerald-200 text-xs">Business Graduate, IT Services Job</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    period: "Month 1: January",
                    title: "Decision & Start",
                    desc: "Researched AWS vs Salesforce. Chose AWS (larger opportunity). Enrolled in Udemy AWS Solutions Architect course. Started learning 2 hours daily after work.",
                  },
                  {
                    period: "Month 2: February",
                    title: "Deep Learning + Projects",
                    desc: "Completed course, built 2 projects: auto-scaling web app, data pipeline using S3+Lambda. Uploaded to GitHub. Started applying to AWS-focused roles in parallel.",
                  },
                  {
                    period: "Month 3: March",
                    title: "Certified + Hired",
                    desc: "Passed AWS certification exam. Interviewed at 4 companies. Got 2 offers: ₹5.5 LPA (AWS-heavy role) + ₹5 LPA (AWS + DevOps role). Accepted ₹5.5 LPA role.",
                  },
                ].map((m) => (
                  <div key={m.period} className="bg-white/15 rounded-xl p-4">
                    <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">{m.period}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-emerald-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-emerald-100 text-sm italic border-t border-white/20 pt-4">
                "Salary jumped from ₹2 LPA to ₹5.5 LPA. Cost: ₹13.5K for exam + 3 months of discipline. Return: ₹3.5 LPA+ immediately, and career trajectory shifted permanently. Best 90 days of investment ever."
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
              Learning a high-paying skill in 3 months isn't theoretical — it's a proven, repeatable pattern. AWS, Data Analytics, Salesforce, and others have well-designed learning paths and acute market demand. The barrier isn't knowledge availability — it's discipline.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Most people start courses with excitement and quit by week 4. Those who stick finish, get certified, build projects, and land premium roles. Your 3-month commitment today translates to ₹1–3 LPA salary increase, permanent career trajectory shift, and global job opportunities.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Pick one skill. Commit 3 months. Change your career. The math is simple — execution is the only variable.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Learn a High-Paying Skill?</h2>
            <p className="text-emerald-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Explore job openings for professionals with these premium skills on GreatHire. See the actual salary ranges, connect with mentors already earning in these fields, and start your 3-month journey today.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-emerald-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Explore High-Paying Roles on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
