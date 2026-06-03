import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const blog = {
  title: "Top 20 Common Interview Questions and Best Answers",
  subtitle: "Interview Preparation Guide — 2026",
  date: "May 09, 2026",
  readTime: "15 min read",
  category: "Career Development",
  keywords: [
    "common interview questions",
    "interview questions and answers",
    "how to answer interview questions",
    "behavioral interview questions",
    "technical interview questions",
    "interview preparation 2026",
  ],
};

const steps = [
  {
    num: "01",
    title: "Understand the Basics and Industry Expectations",
    desc: "Most interview questions fall into 3 categories: behavioral (how you've handled situations), technical (what you can do), and situational (how you'd handle hypothetical problems). Interviewers use these to assess: 1) Can you do the job? 2) Will you fit the culture? 3) Are you reliable and communicative? Every question has an underlying intent. 'Tell me about yourself' isn't asking for your life story — it's asking you to demonstrate why you're right for THIS role. 'Why do you want to work here?' tests whether you've researched and whether you're genuinely interested or just job-hunting. Understanding the intent behind questions lets you answer what the interviewer actually wants to know, not just what they literally asked.",
  },
  {
    num: "02",
    title: "Build Relevant Skills or Knowledge",
    desc: "Preparation isn't about memorizing answers — it's about building evidence. For behavioral questions, you need real stories: 'Tell me about a time you failed' requires an actual failure and what you learned. 'Describe a conflict with a colleague' needs a real conflict and how you resolved it. These stories are credible because they're genuine. For technical questions, you need practice: if the role requires coding, solve LeetCode problems. If it needs data analysis, practice SQL queries. If it's a business role, understand the company's products and market. This isn't busywork — it builds real capability that shows through in interviews. Interviewers can sense whether you've prepared or you're just regurgitating canned answers.",
  },
  {
    num: "03",
    title: "Apply Strategies and Tools Effectively",
    desc: "Use the STAR method for behavioral questions: Situation (set the context), Task (what you needed to do), Action (what you did), Result (what happened). This structure keeps answers focused and memorable. Practice your answers out loud — don't just think about them. Record yourself answering questions and listen back. This reveals filler words ('um,' 'like,' 'basically'), rambling, or unclear explanations. Practice with a friend or mentor who can give feedback. For technical questions, think out loud: explain your approach before coding, ask clarifying questions, and discuss trade-offs. Interviewers want to see your thought process, not just the right answer. Use online resources: platforms like InterviewBit, Pramp, or Blind have real interview questions and peer practice opportunities.",
  },
  {
    num: "04",
    title: "Track Progress and Improve Continuously",
    desc: "After each interview, analyze what went well and what didn't. Did you stumble on a question? Why? Was it unclear, or did you not prepare that story? Write down tough questions you encountered and add them to your preparation. Ask interviewers for feedback after rejection — many will tell you if you didn't answer something well. Collect this feedback. Over time, patterns emerge: maybe you ramble in technical explanations, or your stories lack specific metrics. Fix these before your next interview. Keep a spreadsheet: company, role, date, questions asked, how you answered, feedback received. This becomes your personal interview database. Your interview skills improve with deliberate practice, not just showing up.",
  },
];

const questions = [
  {
    num: "01",
    title: "Tell me about yourself",
    category: "Opening",
    difficulty: "Foundational",
    desc: "This is your 2-minute pitch. Start with your professional identity (role, experience, skills), not your personal life. Mention 1–2 achievements that show impact. End with why you're interested in this specific role. Customize it for each interview.",
    example: "'I'm a software engineer with 3 years of experience building backend systems. I've led a team project that reduced API latency by 40%, working with Python and AWS. I'm interested in this role because your company's focus on scalability aligns with my experience, and I'm excited about your tech stack.'",
  },
  {
    num: "02",
    title: "Why do you want to work here?",
    category: "Motivation",
    difficulty: "Foundational",
    desc: "This tests whether you've researched. Mention something specific about the company: a product you use, a problem they solve, their tech stack, their growth, or their mission. Never say 'it's a good company' or 'I need a job.' Be genuine.",
    example: "'I've used your product for a year and I'm impressed by how you've solved X problem in the market. Your recent acquisition of Y aligns with my interests in AI. Plus, your team's blog on Z shows a deep engineering culture that matches how I want to work.'",
  },
  {
    num: "03",
    title: "What are your strengths?",
    category: "Self-Assessment",
    difficulty: "Foundational",
    desc: "Pick 2–3 strengths relevant to the role. Back each with a brief example. Avoid generic strengths like 'hard-working.' Be specific and tied to the job description.",
    example: "'My main strength is problem-solving — I enjoy breaking complex problems into steps. At my last role, I redesigned our data pipeline that improved processing speed by 50%. I'm also good at collaboration — I proactively communicate blockers and seek input from teammates, which helped ship features faster.'",
  },
  {
    num: "04",
    title: "What are your weaknesses?",
    category: "Self-Assessment",
    difficulty: "Foundational",
    desc: "Pick a real weakness, not a 'strength in disguise' like 'I'm a perfectionist.' Mention something you've struggled with and how you're improving. Show growth mindset.",
    example: "'Early in my career, I wasn't great at prioritizing — I'd dive into every problem instead of focusing on high-impact work. I recognized this when projects started slipping, so I started using frameworks like Eisenhower Matrix to prioritize. Now I'm much better at saying no to low-value tasks and focusing on what matters most.'",
  },
  {
    num: "05",
    title: "Tell me about a time you failed",
    category: "Behavioral",
    difficulty: "Intermediate",
    desc: "Use STAR method: Situation, Task, Action, Result. Pick a real failure where you learned something. Don't pick something that reveals a deal-breaker (dishonesty, negligence). Focus on what you learned and how you changed.",
    example: "'In a project, I didn't communicate clearly with my manager about a dependency, assuming they knew. The project missed a deadline as a result. I learned that assumptions are dangerous. Now I proactively document blockers and send weekly updates. I also apologized and helped catch up the project.'",
  },
  {
    num: "06",
    title: "Describe a time you handled conflict with a colleague",
    category: "Behavioral",
    difficulty: "Intermediate",
    desc: "Show maturity and communication skills. Pick a conflict where you listened, understood the other person's perspective, and found a solution. Avoid bad-mouthing the other person.",
    example: "'A colleague and I disagreed on the technical approach for a feature. I felt my approach was clearer; they preferred theirs. Instead of going with seniority, I asked them to explain their reasoning. I realized they had valid points I hadn't considered. We combined both approaches and shipped something better than either of us had proposed alone.'",
  },
  {
    num: "07",
    title: "Give an example of a project you're proud of",
    category: "Achievement",
    difficulty: "Intermediate",
    desc: "Pick a project you genuinely care about. Mention the challenge, your role, and the impact (metrics if possible). Show both technical and soft skills.",
    example: "'I led a project to refactor our authentication system. The old system was causing 20% of production issues. I coordinated with 3 teams, created a migration plan, and shipped it without downtime. We reduced related bugs by 85% and improved login speed by 30%. It taught me the importance of cross-team communication and careful planning.'",
  },
  {
    num: "08",
    title: "How do you handle pressure or tight deadlines?",
    category: "Work Style",
    difficulty: "Intermediate",
    desc: "Show that you stay calm, prioritize, and communicate. Mention a specific example where you handled pressure well.",
    example: "'I thrive under pressure if there's clarity on priorities. When a client escalation came in with a 2-day deadline, I broke the work into smallest shippable increments, delegated strategically, and kept stakeholders updated daily. We shipped on time. I recognize pressure is temporary and clear communication reduces panic.'",
  },
  {
    num: "09",
    title: "Why are you leaving your current job?",
    category: "Career History",
    difficulty: "Foundational",
    desc: "Focus on what you're moving toward, not what you're running from. Never bad-mouth your current employer. Keep it professional.",
    example: "'I've learned a lot at my current role, but I'm looking for the next challenge. Specifically, I want to work on distributed systems at scale, which isn't a focus area here. This role aligns with that goal, and I'm excited about the technical challenges.'",
  },
  {
    num: "10",
    title: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    difficulty: "Foundational",
    desc: "Show ambition but keep it realistic and aligned with the role. Mention growth (technical expertise, leadership, impact), not just salary or title.",
    example: "'In 5 years, I see myself as a senior engineer leading a team, but still hands-on with code. I want to ship systems that scale to millions of users and mentor junior developers. This role is a great step toward that because I'll gain experience with [specific tech or domain] and work with talented people I can learn from.'",
  },
  {
    num: "11",
    title: "How do you stay updated with industry trends?",
    category: "Learning",
    difficulty: "Intermediate",
    desc: "Mention specific resources: blogs, podcasts, conferences, online courses, side projects. Show genuine curiosity.",
    example: "'I follow engineering blogs like [X], listen to podcasts like [Y], and spend 5 hours a week on side projects exploring new tech. Recently, I've been learning about [specific technology] and built a small project to understand its trade-offs. I also attend local meetups to connect with the community.'",
  },
  {
    num: "12",
    title: "Tell me about a time you took initiative",
    category: "Behavioral",
    difficulty: "Intermediate",
    desc: "Show that you see problems and fix them without being asked. Mention the impact.",
    example: "'Our testing was manual and slow, causing deployments to take hours. Instead of complaining, I proposed an automation plan, learned CI/CD tools, and built a pipeline. We cut deployment time from 4 hours to 15 minutes. It wasn't my job, but I saw it needed doing.'",
  },
  {
    num: "13",
    title: "How do you approach learning a new skill or technology?",
    category: "Learning",
    difficulty: "Intermediate",
    desc: "Describe your learning process: research, practice, build, reflect. Show you're systematic.",
    example: "'First, I understand why I need to learn it and what problems it solves. Then I learn the fundamentals through documentation and tutorials. I build a small project to apply it. Finally, I reflect on what I learned and where it fits in my toolkit. This approach has helped me learn Python, Docker, and React.'",
  },
  {
    num: "14",
    title: "What do you know about our company/product?",
    category: "Research",
    difficulty: "Foundational",
    desc: "Show you've done homework. Mention product, market, recent news, tech stack, or culture.",
    example: "'Your product serves [market]. Recently you launched [feature], which addresses [problem]. Your tech stack includes [tools], which interests me because [reason]. I also read that you're expanding into [market], which aligns with [vision].'",
  },
  {
    num: "15",
    title: "How do you measure success in your work?",
    category: "Values",
    difficulty: "Intermediate",
    desc: "Mention metrics and impact. Show you care about outcomes, not just activities.",
    example: "'I measure success by impact. For engineering, it's: Did we ship on time? Did the feature solve the user problem? Did we maintain code quality? Is the team happy? I track these and reflect regularly. I don't just measure by lines of code or hours worked.'",
  },
  {
    num: "16",
    title: "Describe your ideal work environment/team",
    category: "Work Style",
    difficulty: "Intermediate",
    desc: "Be honest but show you're flexible. Mention what helps you do your best work.",
    example: "'I thrive in collaborative environments where communication is open and people care about growth. I prefer autonomy to make decisions within clear boundaries. A team that values learning, has good documentation, and doesn't blame people for reasonable failures is ideal. That said, I can adapt to different styles.'",
  },
  {
    num: "17",
    title: "Tell me about a time you had to learn something quickly",
    category: "Behavioral",
    difficulty: "Intermediate",
    desc: "Show adaptability and learning ability. Use STAR method.",
    example: "'When a client asked us to migrate from X to Y, I had a week to learn Y. I read documentation, watched tutorials, and built a small migration. I shipped the solution on time and became the team's expert on Y. It showed me I can pick up new skills fast under pressure.'",
  },
  {
    num: "18",
    title: "How do you handle feedback or criticism?",
    category: "Growth",
    difficulty: "Intermediate",
    desc: "Show you're coachable and not defensive. Give an example of constructive feedback you received and how you acted on it.",
    example: "'I appreciate feedback. In my last review, my manager said I could communicate better in meetings. Instead of getting defensive, I listened, understood the gap, and started preparing more and speaking up earlier. Three months later, my manager said I'd improved significantly. I see feedback as a gift.'",
  },
  {
    num: "19",
    title: "Do you have any questions for us?",
    category: "Closing",
    difficulty: "Foundational",
    desc: "Always ask questions. This shows curiosity and helps you evaluate fit. Ask about team, culture, growth opportunities, or technical challenges.",
    example: "'What does success look like for this role at 6 months? How does the team approach technical debt? What's the biggest challenge the team is facing right now? How do you support professional development?'",
  },
  {
    num: "20",
    title: "What's your expected salary?",
    category: "Compensation",
    difficulty: "Tricky",
    desc: "Research market rates first. Ask about range rather than naming a number. If pressed, give a range with reasoning.",
    example: "'Based on market research for this role in this city, with my experience, I'm looking for [range]. However, I'm more interested in the role and growth opportunity. What range does the company typically offer for this position?'",
  },
];

const practices = [
  "Use STAR method for behavioral questions: Situation, Task, Action, Result.",
  "Research the company thoroughly before the interview.",
  "Practice answers out loud — record yourself and listen for clarity.",
  "Back strengths with specific examples and metrics.",
  "Show growth mindset when discussing weaknesses or failures.",
  "Ask thoughtful questions about the role and company.",
];

const interviewMistakesPractices = [
  "Giving generic 'strength in disguise' answers for weaknesses.",
  "Not researching the company and giving generic answers.",
  "Rambling or going off-topic in responses.",
  "Bad-mouthing previous employers or colleagues.",
  "Not preparing stories with specific examples and metrics.",
  "Not asking any questions at the end of the interview.",
];

const faqs = [
  {
    q: "How long should interview answers be?",
    a: "Behavioral/story questions: 1–2 minutes. Opening questions: 1–3 minutes. Quick factual questions: 30 seconds. A good rule: if you're talking longer than the interviewer asked, you're probably rambling. If they ask 'tell me about yourself,' 2 minutes is perfect. If they ask 'what's your experience with Python?', 30 seconds is fine.",
  },
  {
    q: "Should I memorize my answers?",
    a: "No. Memorized answers sound robotic. Instead, know your stories (what happened, what you learned), key points you want to make, and examples. Practice enough that you can tell the story naturally, but let it be conversational. Interviewers can tell the difference between genuine storytelling and rehearsed speeches.",
  },
  {
    q: "What if I don't know the answer to a technical question?",
    a: "Be honest. Don't fake it. Say 'I don't know, but here's how I'd approach learning it' or 'I haven't worked with X, but I have experience with similar tools.' Then explain your reasoning. Interviewers respect honesty and problem-solving approach over pretending you know something you don't.",
  },
  {
    q: "How do I handle nervousness during an interview?",
    a: "Nervousness is normal. Acknowledge it mentally but don't let it hijack your answers. Pause before answering to collect your thoughts. Take a breath. Practice beforehand so your preparation builds confidence. Remember: the interviewer wants you to succeed — they're not trying to trick you.",
  },
  {
    q: "What if I make a mistake during the interview?",
    a: "Keep going. Don't apologize excessively or draw attention to it. If you misspeak, gently correct yourself and continue. Interviewers understand people aren't perfect. They're evaluating your overall capability, not perfection.",
  },
  {
    q: "Should I talk about my experience online (GitHub, blog, portfolio)?",
    a: "Yes, if it's strong. If you have a GitHub repo, blog, or portfolio that showcases your work, mention it when relevant. 'I can show you examples of my work on my GitHub' is powerful. But make sure it's clean and represents you well.",
  },
  {
    q: "How do I handle a question about experience I don't have?",
    a: "Be honest but reframe. 'I haven't done X, but I have done Y which taught me similar principles.' Pivot to related experience. Show you can learn. For freshers: 'I haven't done this professionally, but I've built projects using these concepts.'",
  },
  {
    q: "What if the interviewer is quiet or doesn't react to my answers?",
    a: "Don't panic. Some interviewers are naturally quiet or deliberate. A lack of enthusiasm doesn't mean you're doing poorly. They might be taking notes or thinking. Keep answering well regardless of their body language.",
  },
];

function QuestionCard({ q }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl font-black text-gray-200 leading-none">{q.num}</span>
        <div className="flex gap-2">
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {q.category}
          </span>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            {q.difficulty}
          </span>
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">{q.title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{q.desc}</p>
      <div className="pt-3 border-t border-gray-200/70">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          Example Answer
        </p>
        <p className="text-xs text-gray-600 leading-relaxed italic">{q.example}</p>
      </div>
    </div>
  );
}

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

export default function InterviewQuestionsBlog() {
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
                Job interviews are where you prove your capability and culture fit. But most candidates go in underprepared, getting tripped up by questions they've heard a dozen times. <strong className="text-slate-700">Common interview questions</strong> aren't tricks — they're predictable, which means you can prepare solid answers that stand out.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This guide covers the 20 most common interview questions, why interviewers ask them, how to answer them in a way that impresses, and real examples that show what strong answers sound like. Prepare these, and you'll walk into interviews with confidence.
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Why Interview Preparation Matters More Than Ever in 2026
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In 2026, interviews are more structured and standardized. Companies use behavioral interview frameworks, take-home assessments, and detailed rubrics to evaluate candidates. This sounds intimidating — but it actually plays to your advantage. Structured interviews reward preparation. A candidate who prepares gets better results than one who wings it. The bar has risen, but so has the payoff for being ready.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Most candidates lose offers not because they're unqualified, but because they didn't answer well. They rambled, got defensive on a weakness question, or failed to ask thoughtful questions at the end. These are all fixable with preparation. This guide fixes them.
            </p>
          </section>

          {/* ── STEP BY STEP ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              4-Step Interview Preparation Framework
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              A structured approach to understanding what interviewers want, building credible answers, and practicing effectively.
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

          {/* ── QUESTIONS ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              20 Common Interview Questions with Best Answer Strategies
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base">
              Organized by category. Each includes why it's asked, how to answer, and an example.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {questions.map((q) => (
                <QuestionCard key={q.num} q={q} />
              ))}
            </div>
          </section>

          {/* ── REAL EXAMPLE ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Real Example: How Priya Went From Nervous to Confident in 3 Weeks
            </h2>
            <div className="bg-gradient-to-br from-slate-700 to-gray-900 text-white rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                  P
                </div>
                <div>
                  <p className="font-bold">Priya — Fresher from Bangalore</p>
                  <p className="text-slate-300 text-xs">
                    First job interview — Nervous about common questions
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    week: "Week 1",
                    title: "Realization",
                    desc: "First interview didn't go well. She rambled, gave generic answers, and forgot to ask questions. She realized she wasn't prepared despite being qualified.",
                  },
                  {
                    week: "Week 2",
                    title: "Preparation",
                    desc: "Studied common questions. Built real stories with STAR method. Researched companies. Practiced with friends. Recorded herself and listened critically to improve.",
                  },
                  {
                    week: "Week 3",
                    title: "Results ✓",
                    desc: "Got 3 interview offers from companies. Her prepared answers, research, and thoughtful questions impressed interviewers. She negotiated and joined her first choice.",
                  },
                ].map((m) => (
                  <div key={m.week} className="bg-white/15 rounded-xl p-4">
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">
                      {m.week}
                    </p>
                    <p className="font-bold mb-2">{m.title}</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-slate-300 text-sm italic border-t border-white/20 pt-4">
                "Preparation transformed my interviews from stressful to confident. I knew what to expect and had thoughtful answers ready."
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
                {interviewMistakesPractices.map((item, i) => (
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
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </section>

          {/* ── CONCLUSION ── */}
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Conclusion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Interview questions are predictable because they test the same things: competence, communication, cultural fit, and learning ability. By preparing 20 common questions with specific examples, using the STAR method, and researching your target company, you remove the uncertainty. You walk in prepared, confident, and ready to show why you're the right hire.
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              Preparation is confidence. Confidence is what gets you hired.
            </p>
          </section>

          {/* ── CTA ── */}
          <section className="bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Ready for Your Next Interview?
            </h2>
            <p className="text-slate-300 mb-8 text-sm sm:text-base max-w-xl mx-auto">
              GreatHire helps job seekers prepare for interviews, practice with peers, and connect with companies hiring. Get feedback on your interview skills and land the role you want.
            </p>
            <a
              href="https://greathire.in"
              className="inline-block bg-white text-slate-800 font-bold text-sm sm:text-base px-8 py-3 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
            >
              Start Preparing on GreatHire →
            </a>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
