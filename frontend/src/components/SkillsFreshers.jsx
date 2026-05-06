import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Top Skills Companies Look for in Freshers in 2026",
  subtitle: "In-Demand Skills Guide",
  date: "May 06, 2026",
  readTime: "12 min read",
  category: "Skills Guide",
  keywords: [
    "skills for freshers 2026",
    "in-demand skills freshers",
    "top technical skills 2026",
    "soft skills for freshers",
    "skills companies want",
    "fresher job skills India",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "Research 20+ job descriptions across your target roles and industries. Identify which skills appear repeatedly — these are the ones companies genuinely value. Join industry-specific communities on LinkedIn, Reddit, or Discord. Talk to recently hired freshers and senior professionals to understand what separates candidates who land jobs from those who don't. Note both technical and soft skills mentioned.",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge",
    desc: "Focus on depth, not breadth. Pick 2–3 core skills aligned with your target role and industry. For developers, this might be Python + React + SQL. For data analysts, SQL + Python + Excel/Power BI. Build projects that demonstrate mastery, not just completion. Use free resources like freeCodeCamp, NPTEL, and YouTube. Practice daily — even 45 minutes of focused skill-building compounds quickly.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "Build a portfolio showcasing your skills through real projects. Upload to GitHub, Kaggle, or Behance. Create a personal portfolio website (free templates available). Document your learning journey on LinkedIn or Medium. Practice coding on LeetCode or HackerRank for technical roles. For non-technical skills like communication, practice on platforms like Toastmasters or record yourself presenting. Get feedback on your work regularly.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "Maintain a skill development tracker: skill, start date, milestones, practice hours, projects completed. Review weekly — which skills improved? Which need more focus? Set monthly targets: complete 1 project, solve 20 coding problems, write 2 articles, practice 1 new tool. Record yourself in interviews or presentations and review for improvement areas. Update your portfolio monthly with new projects.",
  },
];

const skills = [
  {
    num: "01",
    category: "Programming Languages",
    title: "Python, Java, JavaScript",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    skills: "Core programming",
    desc: "Python dominates in data, AI/ML, and backend. Java is crucial for enterprise development. JavaScript is non-negotiable for web development. Master one language deeply before learning a second. Companies value quality code and problem-solving over the number of languages you know.",
  },
  {
    num: "02",
    category: "Web Development",
    title: "React, HTML, CSS, Git",
    color: "bg-violet-50 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    skills: "Frontend technologies",
    desc: "React skills are in massive demand for frontend roles. HTML and CSS remain foundational. Git version control is non-negotiable — every developer needs it. Build 2–3 full projects using React, deploy them, and keep the GitHub links polished. Portfolio projects matter more than certifications.",
  },
  {
    num: "03",
    category: "Database & SQL",
    title: "SQL, Databases, Query Optimization",
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    skills: "Data management",
    desc: "SQL is universally required across IT, data, and backend roles. Understand RDBMS fundamentals, write efficient queries, and know when to optimize. No-SQL databases like MongoDB are increasingly valuable. A fresher with strong SQL beats someone with weak SQL and multiple certifications.",
  },
  {
    num: "04",
    category: "Cloud & DevOps",
    title: "AWS, Azure, Docker, Kubernetes",
    color: "bg-sky-50 border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    skills: "Cloud infrastructure",
    desc: "Cloud is everywhere in 2026. AWS and Azure certifications (free tier available) significantly boost your chances. Understand basics: EC2, S3, RDS, VPCs. Docker and container basics are increasingly expected even at junior levels. Hands-on practice matters more than theory.",
  },
  {
    num: "05",
    category: "Data Analytics",
    title: "Excel, SQL, Power BI / Tableau",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    skills: "Data visualization",
    desc: "Excel remains king for data work — master pivot tables, VLOOKUP, and formulas. SQL is essential for querying data. Power BI and Tableau are high-demand for visualization. Build end-to-end analytics projects: extract data, clean it, analyze, and visualize insights.",
  },
  {
    num: "06",
    category: "AI & Machine Learning",
    title: "Python, TensorFlow, Scikit-learn",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    skills: "ML frameworks",
    desc: "Python with ML libraries (NumPy, Pandas, Scikit-learn) is the standard. TensorFlow and PyTorch for deep learning. Focus on practical understanding, not just theory. Build real ML projects: classification, regression, NLP. Kaggle competitions are excellent for portfolio building.",
  },
  {
    num: "07",
    category: "Communication & Leadership",
    title: "Written & Verbal Communication, Teamwork",
    color: "bg-teal-50 border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    skills: "Soft skills",
    desc: "Soft skills separate average candidates from exceptional ones. Write clear emails and documentation. Present ideas confidently in meetings and demos. Listen actively, ask clarifying questions, and adapt your communication style. Most fresher roles involve collaboration — teamwork matters as much as technical ability.",
  },
  {
    num: "08",
    category: "Problem-Solving & Learning",
    title: "Logical Thinking, Adaptability, Curiosity",
    color: "bg-indigo-50 border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
    skills: "Core competencies",
    desc: "Companies hire freshers for potential. Strong problem-solving ability (shown through coding challenges, projects) signals capability. Adaptability and curiosity — willingness to learn new tools, take on unfamiliar tasks, and grow — are as valuable as current skills.",
  },
];

const faqs = [
  {
    q: "Which single skill should a fresher prioritize in 2026?",
    a: "Depends on your target role. For developers: Python or JavaScript. For data analysts: SQL. For cloud roles: AWS basics. For QA: Testing fundamentals. Pick based on your target role, not general interest. Depth in one skill beats breadth across many.",
  },
  {
    q: "How long does it take to learn a skill well enough for a job?",
    a: "3–6 months of consistent, focused learning (45–60 mins daily) can make you job-ready for entry-level roles. This includes: learning fundamentals, building 2–3 projects, and practicing interview problems. Quality beats speed — a fresher who invested 6 months deep-learning Python beats someone who skimmed 10 languages in 2 months.",
  },
  {
    q: "Should I focus on technical or soft skills as a fresher?",
    a: "Both matter equally. Technical skills get you shortlisted (resume passes ATS). Soft skills get you hired (you perform well in interviews and on the job). Ideal balance: 70% technical skill-building, 30% soft skills (communication, teamwork, problem-solving). Neglect either and you'll struggle.",
  },
  {
    q: "Are certifications important for freshers, or are projects enough?",
    a: "Projects > Certifications. A fresher with 2 strong GitHub projects beats someone with 5 certifications. Certifications are valuable only if they're directly relevant to your target role (AWS, Google Cloud, specific tools). Use certifications to structure your learning, not as your primary credential.",
  },
  {
    q: "What's the best way to demonstrate skills to employers?",
    a: "Portfolio > Resume > Certifications. Build real projects that solve problems or showcase your skills. Put code on GitHub. Create a portfolio website. Write blogs explaining your projects. These demonstrate capability far better than a resume claiming 'proficient in Python'. When hiring managers see your work, technical depth becomes obvious.",
  },
  {
    q: "How do I know which skills to focus on for my target role?",
    a: "Study job descriptions. Open 10–15 job descriptions for your target role and industry. Note which skills appear in ALL or most of them — those are your priorities. Use keyword frequency to guide your learning. For example, if 14 out of 15 senior analyst roles mention Tableau, prioritize it.",
  },
  {
    q: "Can I learn multiple skills simultaneously or should I learn them sequentially?",
    a: "Sequential learning works better for freshers. Master core skill → build projects → add complementary skills. Example: Learn SQL deeply → build data projects → add Python → learn visualization. Switching between too many skills dilutes focus and slows progress.",
  },
  {
    q: "How do I stay updated with trending skills in 2026?",
    a: "Follow industry leaders on LinkedIn, join GitHub communities, read tech blogs (Dev.to, Medium, Hacker News), and participate in hackathons. Spend 10% of your learning time on emerging trends (AI, Web3, etc.) and 90% on foundational skills that stay relevant.",
  },
];

const practices = [
  "Build real projects quarterly to strengthen your skill portfolio.",
  "Practice coding 45–60 minutes daily — consistency beats intensity.",
  "Document your learning on GitHub, LinkedIn, or a personal blog.",
  "Contribute to open-source projects to gain real-world experience.",
  "Get feedback from mentors, peers, or online communities on your work.",
  "Teach others — writing tutorials or helping juniors solidifies your understanding.",
];

const mistakes = [
  "Learning too many skills superficially instead of mastering 2–3 deeply.",
  "Taking courses without building projects — theory without practice doesn't stick.",
  "Ignoring soft skills — technical skill alone won't get you hired.",
  "Not updating your portfolio or GitHub — employers judge you by recent work.",
  "Waiting for perfection before shipping projects — done is better than perfect.",
  "Not asking for feedback — you won't know your weak areas without it.",
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

export default function SkillsFreshers2026() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white font-sans">
        {/* ── HERO ── */}
        <header className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 uppercase tracking-widest">
              {blog.category}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-purple-200 text-xl sm:text-2xl font-light mb-6">({blog.subtitle})</p>
            <div className="flex flex-wrap items-center gap-3 text-purple-200 text-sm">
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
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 sm:p-8 mb-8">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                In 2026, the job market for freshers is more skill-centric than ever. Companies no longer hire based on degrees alone — they hire based on demonstrated ability. But with so many skills to choose from, most freshers feel paralyzed: <strong className="text-purple-700">Which skills should I learn? How do I prioritize? When am I ready to apply?</strong>
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide breaks down the top skills companies actually look for in 2026, explains why each matters, and gives you a clear roadmap to build the right skill stack for your target role — without wasting time on irrelevant learning.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Why Skills Matter More Than Ever for Freshers in 2026</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The shift is dramatic. Five years ago, a B.Tech degree from a decent college could get you interviews. In 2026, thousands of freshers have degrees. What separates them is <strong>demonstrable skills</strong> — real projects, GitHub contributions, certifications, and portfolio work that prove you can actually do the job.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Companies are also facing rapid technological change. Cloud adoption, AI integration, and digital transformation mean the skills they need change annually. They want freshers who have learned how to learn, built a depth of knowledge in relevant areas, and shown the ability to solve real problems. A fresher with no experience but strong, demonstrated skills will outcompete someone with mediocre experience and weak skills.</p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guidance</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">A 4-step framework to build job-winning skills.</p>
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 items-start bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-sm sm:text-base">
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

          {/* ── TOP SKILLS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">8 Most In-Demand Skills for Freshers in 2026</h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">From technical fundamentals to soft skills that actually matter.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {skills.map((skill) => (
                <div key={skill.num} className={`border rounded-2xl p-5 sm:p-6 ${skill.color} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl font-black text-gray-200 leading-none">{skill.num}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${skill.badge}`}>{skill.skills}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-widest">{skill.category}</p>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{skill.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{skill.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Real Example: 90-Day Skill Transformation to Job Offer</h2>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">S</div>
                <div>
                  <p className="font-bold">Moin</p>
                  <p className="text-purple-200 text-xs">Graduate, Zero Tech Skills</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    month: "Month 1: Foundation",
                    title: "Clarity on Skills",
                    desc: "Researched data analyst roles. Identified SQL + Python + visualization as core needs. Started with free SQL course on YouTube. Built first tiny project: analyzed a public dataset.",
                  },
                  {
                    month: "Month 2: Deep Building",
                    title: "Portfolio Projects",
                    desc: "Completed SQL + Python courses on freeCodeCamp. Built 2 end-to-end analytics projects: restaurant sales analysis, e-commerce customer segmentation. Uploaded to GitHub with clear documentation.",
                  },
                  {
                    month: "Month 3: Job Ready",
                    title: "Offer Landed ✓",
                    desc: "Applied to 30 target companies highlighting her GitHub projects. 5 interview calls. 2 offers. Joined as Junior Data Analyst at ₹4 LPA. Her portfolio projects made the difference.",
                  },
                ].map((m) => (
                  <div key={m.month} className="bg-white/15 rounded-xl p-4">
                    <p className="text-purple-200 text-xs font-bold uppercase tracking-wider mb-1">{m.month}</p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-purple-100 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-purple-100 text-sm italic border-t border-white/20 pt-4">
                "She went from zero tech skills to hired in 90 days. Not by learning everything — by learning the right things deeply, and proving it through projects."
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
              The skills fresher companies value in 2026 aren't hidden — they're loudly advertised in every job description. Your job is to listen, pick the right skills for your target role, build them deeply through projects, and prove your capability through a portfolio. Depth beats breadth. Projects beat certifications. Consistent effort beats genius bursts.
            </p>
            <p className="text-gray-800 font-semibold text-lg">Start with one skill, build something real, and watch the opportunities follow.</p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Build Your Skill Stack?</h2>
            <p className="text-purple-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              Get access to curated learning paths, project templates, and mentorship to develop the exact skills companies are hiring for in 2026.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-purple-700 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-purple-50 transition-colors shadow-lg"
            >
              Start Your Skill Journey on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
