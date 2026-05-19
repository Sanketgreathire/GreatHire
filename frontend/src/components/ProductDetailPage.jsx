// ProductDetailPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const productItems = [
  {
    id: 1,
    name: "Effective Job Interview Strategies",
    category: "Interview Tips",
    primaryKeyword: "Job Interview Strategies",
    image: "/interview_tips_01.webp",
    badgeLabel: "Interview Tips",
    heroTitle: "How to Crack Your First HR Interview",
    heroSubtitle: "Freshers' Complete Guide",
    publishDate: "May 19, 2025",
    readTime: "12 min read",
    tags: [
      "HR Interview Tips for Freshers",
      "How to Prepare for HR Interview",
      "First Job Interview Questions",
      "HR Interview Questions and Answers",
    ],
    intro: [
      "Most freshers spend weeks preparing for technical rounds — and then walk into the HR interview completely unprepared. The result? Vague answers, nervous energy, and offers that slip away despite strong technical performance.",
      "This guide covers the most common HR interview questions for freshers, exactly how to answer them, a step-by-step preparation framework, and real tips that actually work — so you walk in confident and walk out with an offer.",
    ],
    whySection: {
      title: "Why HR Interviews Matter More Than Most Freshers Realize",
      body: [
        "In 2026, HR rounds are no longer box-ticking exercises. They're genuine cultural-fit assessments. Companies invest months training freshers — they want to make sure they're hiring someone who communicates well, handles pressure gracefully, and fits the team. Many candidates who clear technical rounds get stuck in HR because of poor self-presentation: too rehearsed, too vague, or structured answers that go nowhere.",
        "The good news: HR interviews are highly predictable. The same 15–20 questions appear in over 80% of fresher rounds. Prepare them well, practice them out loud, and you'll consistently convert offers while your peers wonder what went wrong.",
      ],
    },
    steps: [
      {
        color: "#f97316",
        number: "01",
        title: "Understand the Basics and What HR Interviews Are Really About",
        body: "Most freshers think HR interviews are just formalities after technical rounds. They're not. HR rounds assess your personality, communication style, attitude, cultural fit, and whether you're the kind of person the company wants to invest in. Research the company — their values, product, culture, recent news. Read the job description carefully and understand the role. Prepare for the 15–20 most common fresher HR questions and understand the intent behind each one. HR is evaluating: Do I want to work with this person?",
      },
      {
        color: "#f59e0b",
        number: "02",
        title: "Build Your Answer Framework and Self-Awareness",
        body: "Prepare structured answers using the STAR method (Situation, Task, Action, Result). For behavioral questions, know your stories cold — they should be something you can speak to for 2 minutes. Develop clear, honest answers for the classics: Tell me about yourself, your strengths/weaknesses, why this company, where do you see yourself in 5 years. Employers are choosing people who know themselves and articulate in ways that demonstrate value, not just activity. Self-awareness — knowing what you're good at and where you're growing — is one of the most impressive qualities in a fresher.",
      },
      {
        color: "#10b981",
        number: "03",
        title: "Apply Strategies and Tools for Interview Practice",
        body: "Don't just read answers — practice speaking them out loud. Record yourself answering common HR questions and review how you come across: fluency, body language. Use mock interview platforms like Pramp, Interviewpro, or ask a friend to conduct a practice round. Dress appropriately (check company culture), join the call or arrive 5 minutes early, and have thoughtful questions prepared for the HR. Treat each mock interview as practice too — log what you were asked, how you answered, and what to improve.",
      },
      {
        color: "#3b82f6",
        number: "04",
        title: "Track Progress and Improve Continuously",
        body: "After each interview, write down every question asked and how you answered it — within 24 hours. Identify which questions caught you off guard and prepare better answers for them. Track patterns: if you're consistently struggling with Tell me about a time you failed or salary negotiations, those become your priority areas. Set targets: practice 5 new questions weekly, do 1 mock interview per week until you feel genuinely confident. Each HR round, whether you pass or not, is data — treat it that way.",
      },
    ],
    commonQuestions: {
      title: "8 Most Common HR Interview Questions for Freshers (+ How to Answer)",
      subtitle:
        "These questions appear in over 80% of fresher HR rounds — prepare every single one.",
      questions: [
        {
          q: '"Tell me about yourself."',
          badge: "Always Asked",
          badgeColor: "#3b82f6",
          hint: "Classic Trap",
          hintColor: "#ef4444",
          a: "Graduate-lite: who you are → your education/background → your key skills → something about you outside studies. Cover it in 2 minutes. Cover: what you've studied, any relevant projects or internships, what interests you about this field, and something that makes you memorable. Lead with purpose: \"I'm a computer science grad from [college], I've done [project/internship], and I'm interested in this role because...\"",
        },
        {
          q: '"What are your strengths and weaknesses?"',
          badge: "Classic Trap",
          badgeColor: "#ef4444",
          hint: "Common Gap",
          hintColor: "#f97316",
          a: "Strengths: pick 2-3 that are relevant to this role and back each with a specific example — don't just list traits. For weaknesses, be real but show growth: pick an actual gap you're aware of and tell them what you're actively improving. Never say \"I work too hard.\" That answer is transparent and is telling to experienced HR.",
        },
        {
          q: '"Why do you want to work at this company?"',
          badge: "Freshers Bomb",
          badgeColor: "#8b5cf6",
          hint: "Freshers Bomb",
          hintColor: "#8b5cf6",
          a: "Do your homework. Research the company's mission, culture, growth, recent news, or something specific about the role they offer. Say it clearly: \"I did my homework, this is where I see myself growing in [area], and this role aligns to my own goals.\" This is your chance to show you actually think about fit — not just paycheck.",
        },
        {
          q: '"Where do you see yourself in 5 years?"',
          badge: "Negotiation",
          badgeColor: "#06b6d4",
          hint: "Freshers Check",
          hintColor: "#10b981",
          a: "Give a sincere answer that shows ambition, planning, and loyalty to the firm. Give a 5-year plan at a broad level: starting to master the basics in this role, taking on leadership by year 3, ideally in a senior-level role in specialty within this company. Always loosely tie it back with the role or company rather than say \"I want to be in a totally different company.\"",
        },
        {
          q: '"Tell me about a challenge you faced and how you overcame it."',
          badge: "STAR Moment",
          badgeColor: "#f97316",
          hint: "Negotiation",
          hintColor: "#06b6d4",
          a: "Use the STAR Method: Situation → Task → Action → Result. Pick a story that demonstrates qualities they're looking for in this position. Walk them through it quickly — 2 mins tops. End on what you learned and retained. Pick a story from studies, a project, internship, or extra-curricular and not something that questions your judgment or accountability.",
        },
        {
          q: '"What are your salary expectations?"',
          badge: "Negotiation",
          badgeColor: "#06b6d4",
          hint: "Negotiation",
          hintColor: "#06b6d4",
          a: "Research the industry range for this role, level, and location. Give a researched, confident range rather than a single number: \"Based on my research for this role in [city], I'm expecting somewhere in the range of X-Y, but I'm flexible based on the total package.\" Saying \"I don't know\" or \"whatever you offer\" signals low confidence. Know your number.",
        },
        {
          q: '"Do you have any questions for us?"',
          badge: "Your Turn",
          badgeColor: "#10b981",
          hint: "Your Turn",
          hintColor: "#10b981",
          a: "Always have 2-3 thoughtful questions. Good options: What does growth look like for someone in this role? What does the onboarding look like for new graduates? What are the biggest challenges the team is currently working on? Keep this as 2-3 questions. Don't ask 10 or you appear indecisive. Never ask questions easily answered on the website.",
        },
        {
          q: '"Why should we hire you?"',
          badge: "Closing Shot",
          badgeColor: "#f59e0b",
          hint: "Closing Shot",
          hintColor: "#f59e0b",
          a: "This is your 60-second pitch: summarize your 2 skills + 1 personal quality. Set up your proposition: \"I bring [X technical skill], [Y soft skill], and I've demonstrated [specific example]. I'm genuinely excited about this company because [reason]. And I'm ready to get started.\" Practice this till it feels natural.",
        },
      ],
    },
    example: {
      title: "Real Example: From Nervous Fresher to Confident Offer-Getter in 30 Days",
      person: "Riya",
      avatar: "R",
      timeline: [
        {
          week: "Week 1",
          label: "Preparation",
          text: "Riya researched the company for hours, listed her academic projects and mapped them to the role skills. She prepared STAR stories for every major question.",
        },
        {
          week: "Week 2",
          label: "Practice",
          text: "She recorded mock answers every morning and reviewed them at night. She did 3 mock interviews with a friend and a mentor, and adjusted based on feedback.",
        },
        {
          week: "Week 3",
          label: "Refinement",
          text: "She refined her 'Tell me about yourself' to a tight 90-second version, and rehearsed her salary answer with real market data from GreatHire and Glassdoor.",
        },
        {
          week: "Week 4",
          label: "The Interview",
          text: "Day of interview: she arrived 10 mins early, was calm, and answered confidently. Asked 2 strong questions at the end. Got the offer within 48 hours.",
        },
      ],
      note: "Her single best move: She did three mock interview sessions before her real one. We offer delayed practice sessions.",
    },
    bestPractices: [
      "Practice out loud, not just in your head — speaking an answer is a completely different skill.",
      "Research the company deeply (values, culture, recent news) before every interview.",
      "Know 2-3 thoughtful questions to ask the interviewer at the end. Always.",
      "Show approximately where you want to grow at this company, at least loosely.",
      "Send a thank-you note/email within 24 hours of an in-person interview — it's a mini impression.",
    ],
    mistakes: [
      "Being vague, scripted answers; recruiters can spot canned examples — make it concrete.",
      "Saying \"I don't have any weaknesses\" or \"I work too hard\" — it signals low self-awareness.",
      "Not researching the company — \"Tell me about the company\" catches freshers unprepared.",
      "Being over-formal or too stiff — HR interviews value personality, warmth, and genuine curiosity.",
      "Sending no follow-up email after the interview — most freshers skip this and miss a relationship-builder.",
    ],
    faqs: [
      {
        q: "What is the most important thing to prepare for an HR interview as a fresher?",
        a: "Start with 'Tell me about yourself' — it sets the tone for the entire interview. Prepare a clear, 90-second version that covers your education, relevant skills, and what makes you excited about this specific role. Then build your STAR stories for behavioral questions.",
      },
      {
        q: "How do I answer 'Tell me about yourself' as a fresher with no work experience?",
        a: "Focus on your academic background, projects, internships, or activities that are relevant to the role. Structure it: Education → Projects/Internships → Skills → Why this role. Keep it under 2 minutes. End with what draws you to this specific position.",
      },
      {
        q: "Should I be honest about my weaknesses in an HR interview?",
        a: "Yes — but frame it as growth awareness. Pick a real weakness you've identified and explain the steps you're taking to improve it. This shows self-awareness and a growth mindset, both of which HR teams value highly in freshers.",
      },
      {
        q: "How do I handle salary negotiation as a fresher?",
        a: "Research the standard salary range for the role in your city before the interview. Give a range rather than a fixed number, and position it as flexible based on the full package. Never say 'whatever you decide' — it signals low confidence.",
      },
      {
        q: "What should I do if I don't know the answer to an HR question?",
        a: "Don't freeze or fabricate. Take a breath and say: 'That's a great question — let me think about that for a moment.' Then answer honestly, even if imperfect. HR often respects composure and honesty over a polished but hollow response.",
      },
      {
        q: "How many mock interviews should I do before my real HR round?",
        a: "At minimum, three. One with yourself (recorded), one with a friend or peer, and one with a mentor or professional. Each session reveals different blind spots. After three rounds, most freshers report dramatically improved confidence and fluency.",
      },
    ],
    conclusion: {
      body: [
        "Cracking your first HR interview isn't about being perfect — it's about being prepared, genuine, and self-aware. Study the common questions, build structured answers, research every company you apply to, and practice out loud until your answers feel natural rather than rehearsed. The HR panel doesn't need superhumans — they need people who know themselves and can communicate that clearly.",
        "Prepare once, prepare well — and watch the HR round become your strongest asset, not your biggest fear.",
      ],
    },
    cta: {
      title: "Ready to Land Your First Job?",
      body: "Explore thousands of fresher-friendly openings across IT, Business, Data, and more — and walk in with everything you need to succeed.",
      button: "Explore Fresher Jobs on GreatHire",
    },
    description:
      "Thorough preparation is the foundation of a successful job interview. Researching the company, understanding the role, and practising responses using the STAR method allows candidates to present their experience with clarity and confidence.",
  },
  {
    id: 2,
    name: "Post-Interview Follow-Up",
    category: "Interview Tips",
    primaryKeyword: "Post-Interview Follow-Up",
    image: "/interview_tips_02.webp",
    badgeLabel: "Interview Tips",
    heroTitle: "How to Write the Perfect Post-Interview Follow-Up",
    heroSubtitle: "Stand Out After Every Interview",
    publishDate: "May 19, 2025",
    readTime: "8 min read",
    tags: ["Post Interview Email", "Thank You Email After Interview", "Follow Up After Interview"],
    intro: [
      "Most candidates believe the interview ends when they walk out the door. The smartest ones know the game isn't over yet.",
      "A well-timed, thoughtfully written follow-up message can be the detail that tips a hiring decision in your favour. This guide shows you exactly how to do it.",
    ],
    whySection: {
      title: "Why Post-Interview Follow-Up Matters More Than You Think",
      body: [
        "In a world where employers screen dozens of near-identical candidates, your post-interview communication is a second chance to demonstrate professionalism, enthusiasm, and strategic thinking.",
        "Most candidates skip it entirely. Doing it well immediately separates you from the pack — often more than your interview performance alone.",
      ],
    },
    steps: [
      { color: "#f97316", number: "01", title: "Understand What a Follow-Up Actually Achieves", body: "A follow-up email isn't just courtesy — it's strategic. It keeps your name top-of-mind after the interview, lets you address anything you forgot to mention, and signals genuine interest in the role." },
      { color: "#f59e0b", number: "02", title: "Craft the Right Message", body: "Send within 24 hours. Address the interviewer by name. Reference a specific moment from the conversation to show you were engaged. Restate one or two key qualifications and reaffirm your enthusiasm. Keep it under 200 words." },
      { color: "#10b981", number: "03", title: "Choose the Right Channel & Timing", body: "Email is universally appropriate for professional follow-ups. If you connected on LinkedIn during the process, a short message there can complement the email. Avoid messaging over weekends unless the hiring process is explicitly fast-moving." },
      { color: "#3b82f6", number: "04", title: "Follow Up on the Follow-Up", body: "If you haven't heard back by the timeline they gave you, send one polite check-in. Keep it brief: express continued interest, acknowledge they're busy, and ask if there's an update. More than two follow-ups without a response is the line — respect it." },
    ],
    commonQuestions: { title: "Common Follow-Up Scenarios", subtitle: "Handle each one confidently.", questions: [] },
    example: {
      title: "Real Example: How One Follow-Up Email Landed the Offer",
      person: "Arjun",
      avatar: "A",
      timeline: [
        { week: "Day 1", label: "Interview", text: "Arjun interviewed alongside nine other shortlisted candidates for a competitive marketing role." },
        { week: "Day 1", label: "Follow-Up Sent", text: "He sent a personalised follow-up email within 12 hours, referencing the interviewer's comment about brand positioning." },
        { week: "Day 3", label: "Response", text: "The hiring manager replied — impressed by the specific callback to the interview conversation." },
        { week: "Day 5", label: "Offer", text: "He got the offer. The hiring manager later told him the follow-up was a deciding factor." },
      ],
      note: "One email. Twelve hours. A deciding factor in the final call.",
    },
    bestPractices: [
      "Send within 24 hours while you're fresh in the interviewer's mind.",
      "Personalise every message — generic templates are spotted immediately.",
      "Proofread twice; a typo undermines the professionalism it's meant to show.",
    ],
    mistakes: [
      "Sending a follow-up that's just 'Thank you for your time' — it adds no value.",
      "Waiting too long — beyond 48 hours and the moment has passed.",
      "Over-following up — more than two messages without a reply crosses into pressure.",
    ],
    faqs: [
      { q: "What is the best way to start a follow-up email?", a: "Open by addressing the interviewer by name and referencing something specific from your conversation." },
      { q: "How soon should I send a thank-you email after an interview?", a: "Within 24 hours is ideal. Same-day follow-ups are increasingly common and well-received in fast-moving industries." },
      { q: "Should I follow up via email or LinkedIn?", a: "Email is the professional standard. LinkedIn can be a secondary touchpoint if you connected during the process." },
      { q: "Is this relevant for phone or video interviews too?", a: "Absolutely. Format and channel of the interview don't change the value of a thoughtful follow-up." },
      { q: "What if the interviewer doesn't reply to my follow-up?", a: "Wait for the timeline they mentioned. Then send one polite check-in. After two unanswered messages, stop and move on." },
      { q: "Should I follow up with every person who interviewed me?", a: "Yes, if you have their contact details. Personalise each message with something specific from your conversation with them." },
    ],
    conclusion: {
      body: [
        "The interview isn't over until the offer is signed. A sharp, timely follow-up is one of the simplest and highest-impact actions you can take.",
        "Use it to reinforce your strengths, show genuine interest, and stay memorable. GreatHire.in has everything you need to prepare for every stage of the hiring process.",
      ],
    },
    cta: { title: "Ready to Land Your First Job?", body: "Explore thousands of fresher-friendly openings across IT, Business, Data, and more.", button: "Explore Fresher Jobs on GreatHire" },
    description: "Sending a thoughtful thank-you email within 24 hours of an interview reinforces your professionalism and keeps you top-of-mind with employers.",
  },
  {
    id: 3,
    name: "Common Interview Questions",
    category: "Interview Tips",
    primaryKeyword: "Common Interview Questions",
    image: "/interview_tips_03.webp",
    badgeLabel: "Interview Tips",
    heroTitle: "Most Common Interview Questions & How to Answer Them",
    heroSubtitle: "Freshers' Complete Preparation Guide",
    publishDate: "May 19, 2025",
    readTime: "10 min read",
    tags: ["Common Interview Questions", "Interview Preparation", "HR Questions for Freshers"],
    intro: [
      "Certain interview questions appear again and again across industries — and yet, countless candidates stumble over them every day.",
      "These aren't trick questions. They're structured tests of self-awareness, communication, and fit. Preparing for these staples gives you an enormous edge.",
    ],
    whySection: {
      title: "Why Common Questions Trip Up Even Prepared Candidates",
      body: [
        "Most freshers read lists of questions but never practice speaking them out loud. The gap between knowing an answer and delivering it confidently is enormous.",
        "The 15-20 questions that dominate HR rounds are predictable. There's no excuse to be caught off guard by any of them.",
      ],
    },
    steps: [
      { color: "#f97316", number: "01", title: "Know the Most Common Questions Cold", body: "Build a list of the 15–20 questions that appear in almost every interview. These include introductory, behavioural, situational, and role-specific technical questions. Don't leave any of them to chance." },
      { color: "#f59e0b", number: "02", title: "Build Strong, Authentic Answers", body: "Use the STAR method for behavioural questions. For open-ended questions like 'Tell me about yourself,' prepare a 90-second structured narrative: past (relevant background), present (current role and skills), future (why this role). Rehearse until it sounds natural." },
      { color: "#10b981", number: "03", title: "Adapt Answers to the Role & Company", body: "Generic answers fail. Every response should contain a specific reference to the role or the company. Show that you've thought about why this job at this company matters to you." },
      { color: "#3b82f6", number: "04", title: "Practice Under Real Conditions", body: "Do mock interviews with a friend, mentor, or AI-powered simulator. Time your answers. Review recordings. The goal isn't perfection — it's fluency. You want to feel so comfortable with your answers that nerves can't derail you." },
    ],
    commonQuestions: { title: "8 Most Common Interview Questions", subtitle: "Prepare every one of these before your next interview.", questions: [] },
    example: {
      title: "Real Example: How Proper Preparation Transformed an Interview Outcome",
      person: "Priya",
      avatar: "P",
      timeline: [
        { week: "Week 1", label: "Identified Gaps", text: "Priya identified 'What's your greatest weakness?' as her weakest answer." },
        { week: "Week 2", label: "Built Answer", text: "She constructed a genuine, growth-oriented response and practiced it daily." },
        { week: "Week 3", label: "Mock Interviews", text: "Three mock sessions refined her delivery and boosted confidence." },
        { week: "Week 4", label: "The Result", text: "She delivered it confidently in the real interview. The panel noted her self-awareness. She was offered the role two days later." },
      ],
      note: "One week of targeted preparation transformed her weakest answer into a highlight.",
    },
    bestPractices: [
      "Prepare specific stories, not generic statements — concrete examples always land better.",
      "Keep answers concise: 1-2 minutes per question is the sweet spot.",
      "Always end behavioural answers with the result — what changed because of your action.",
    ],
    mistakes: [
      "Memorising answers word-for-word — it sounds scripted and falls apart under follow-up questions.",
      "Being vague — 'I'm a hard worker' tells the interviewer nothing.",
      "Neglecting the question about questions — always prepare two or three thoughtful questions to ask.",
    ],
    faqs: [
      { q: "What is the most important interview question to prepare for?", a: "'Tell me about yourself' sets the tone for the entire interview. Get this one right and you'll enter every other question with momentum." },
      { q: "How long should my answers be?", a: "Aim for 60–90 seconds per answer. Structured, concise answers demonstrate clear thinking. Rambling is one of the top complaints from interviewers." },
      { q: "What tools can I use to practice interview questions?", a: "GreatHire.in's interview resources, AI mock-interview tools, and recorded self-practice sessions are all highly effective." },
      { q: "Can these preparation tips work for technical interviews too?", a: "Yes, though technical interviews require domain-specific preparation in addition to these behavioural frameworks." },
      { q: "How do I handle unexpected questions?", a: "Pause, breathe, and answer honestly. Composure under unexpected questions often impresses interviewers more than a polished but hollow response." },
      { q: "Should I prepare questions to ask the interviewer?", a: "Always. Prepare 2-3 thoughtful questions that show you've researched the role and company." },
    ],
    conclusion: {
      body: [
        "The candidates who ace interviews aren't necessarily the most talented — they're the most prepared.",
        "By knowing the common questions, building authentic answers, and practising under real conditions, you transform interviews from anxiety-inducing ordeals into opportunities to shine.",
      ],
    },
    cta: { title: "Ready to Land Your First Job?", body: "Explore thousands of fresher-friendly openings across IT, Business, Data, and more.", button: "Explore Fresher Jobs on GreatHire" },
    description: "Preparing for commonly asked interview questions gives candidates a significant advantage and helps them present their skills and experience with confidence.",
  },
  {
    id: 4,
    name: "Top Companies Hiring in 2025",
    category: "Company Insights",
    primaryKeyword: "Top Companies Hiring in 2025",
    image: "/company_insight_01.webp",
    badgeLabel: "Company Insights",
    heroTitle: "Top Companies Hiring in 2025: Where to Apply Now",
    heroSubtitle: "Company Insights for Job Seekers",
    publishDate: "May 19, 2025",
    readTime: "9 min read",
    tags: ["Top Hiring Companies 2025", "Best Companies to Work For", "Job Market 2025"],
    intro: [
      "2025 is a landmark year for hiring. As global economies stabilise and AI-driven transformation accelerates, leading companies are expanding aggressively.",
      "Knowing where the opportunities are, and how to position yourself for them, has never been more valuable. This guide gives you the map.",
    ],
    whySection: {
      title: "Why Knowing Where Companies Are Hiring Matters",
      body: [
        "The job market in 2025 isn't uniform. Some sectors are growing explosively; others are contracting. Understanding which companies are hiring helps you focus your energy where it will pay off.",
        "Strategic targeting consistently outperforms volume applications. The data is clear.",
      ],
    },
    steps: [
      { color: "#f97316", number: "01", title: "Identify the Industries & Companies Leading Hiring", body: "In 2025, the fastest-growing hiring sectors include AI & Machine Learning, Cybersecurity, Cloud Infrastructure, Healthcare Technology, and Renewable Energy. Companies like Amazon, Google, GE Aerospace, and a wave of well-funded startups are actively recruiting." },
      { color: "#f59e0b", number: "02", title: "Align Your Skills to What's In Demand", body: "Review job descriptions from your target companies and note the recurring skills. Build those competencies through certifications, projects, and relevant experience. Candidates who can demonstrate AI literacy are significantly more attractive to modern employers." },
      { color: "#10b981", number: "03", title: "Use the Right Platforms & Apply Strategically", body: "Don't spray applications randomly. Identify 10–15 target companies, monitor their careers pages, and set up alerts on GreatHire.in. Tailor your resume and cover letter for each application. Quality over quantity is the strategy that works." },
      { color: "#3b82f6", number: "04", title: "Track Applications & Iterate", body: "Use a simple spreadsheet or job-tracking tool to monitor where you've applied, the status, and any follow-up actions. Review what's working and adjust your approach. Job searching is a skill you improve with deliberate practice." },
    ],
    commonQuestions: { title: "Key Questions About the 2025 Job Market", subtitle: "Get clear on what's happening and how to navigate it.", questions: [] },
    example: {
      title: "Real Example: How Targeted Applications Tripled Interview Rates",
      person: "Karan",
      avatar: "K",
      timeline: [
        { week: "Month 1", label: "Research", text: "Karan identified 5 target companies through GreatHire.in and deeply researched each one." },
        { week: "Month 2", label: "Upskilling", text: "He completed a cloud certification in 8 weeks to close a key skill gap." },
        { week: "Month 3", label: "Applications", text: "Applied to 12 targeted roles with tailored resumes and cover letters." },
        { week: "Month 3", label: "Result", text: "Received responses from 7 companies. Accepted an offer with a 55% compensation increase." },
      ],
      note: "Targeted applications with a tailored approach outperform volume applications every time.",
    },
    bestPractices: [
      "Research each target company deeply before applying — generic applications are filtered out fast.",
      "Build your network inside target companies through LinkedIn connections and informational interviews.",
      "Stay current with industry news — knowing a company's recent news gives you talking points in interviews.",
    ],
    mistakes: [
      "Applying to every open role without filtering by fit — volume without strategy wastes time.",
      "Ignoring company culture when evaluating offers — a misaligned company rarely ends well.",
      "Not preparing for role-specific technical assessments that many top companies use in 2025.",
    ],
    faqs: [
      { q: "Which companies are hiring the most in 2025?", a: "Amazon, Google, Microsoft, and GE Aerospace continue large-scale hiring. In India, Reliance Jio, Infosys, and Razorpay are among the most active employers." },
      { q: "How long does the hiring process take at top companies?", a: "Startups can move in 1–2 weeks. Enterprise companies often have multi-stage processes spanning 4–8 weeks." },
      { q: "What tools should I use to find top hiring companies?", a: "GreatHire.in, LinkedIn Jobs, and company careers pages are the most reliable. Set up job alerts so you're notified immediately." },
      { q: "Is this guide useful for entry-level job seekers?", a: "Yes. Many top companies have dedicated graduate and entry-level hiring programmes. The strategies apply equally regardless of experience level." },
      { q: "What sectors are most in-demand for freshers in 2025?", a: "AI/ML, Data Science, Cybersecurity, Cloud Computing, and Renewable Energy are the fastest-growing sectors for freshers." },
      { q: "How do I stand out when applying to top companies?", a: "Tailor your application, highlight relevant projects, demonstrate company-specific research, and leverage your network for referrals." },
    ],
    conclusion: {
      body: [
        "The best opportunities in 2025 are going to the most prepared candidates — not necessarily the most experienced.",
        "Target the right companies, align your skills to current demand, and apply with precision. Let GreatHire.in connect you to the roles that fit who you are and where you're headed.",
      ],
    },
    cta: { title: "Ready to Find Your Next Opportunity?", body: "Browse thousands of curated job listings across top companies in India and globally.", button: "Browse Jobs on GreatHire" },
    description: "In 2025, leading global organisations and fast-growing startups are actively recruiting. GreatHire.in provides real-time job updates and personalised recommendations.",
  },
  {
    id: 5,
    name: "Industry Trends Shaping Work in 2025",
    category: "Company Insights",
    primaryKeyword: "Industry Trends 2025",
    image: "/company_insight_02.webp",
    badgeLabel: "Company Insights",
    heroTitle: "Industry Trends Reshaping Work in 2025",
    heroSubtitle: "What Every Professional Needs to Know",
    publishDate: "May 19, 2025",
    readTime: "11 min read",
    tags: ["Industry Trends 2025", "Future of Work", "AI in the Workplace", "Remote Work Trends"],
    intro: [
      "The workplace is changing faster than at any point in recent history. AI-driven automation is reshaping job roles. Remote and hybrid work has become a baseline expectation.",
      "For professionals who understand these trends and position themselves accordingly, the opportunities are extraordinary.",
    ],
    whySection: {
      title: "Why Staying Current on Industry Trends Matters for Your Career",
      body: [
        "Trend-aware professionals consistently outperform their peers — not because they're smarter, but because they see shifts coming and adapt early.",
        "The professionals who struggled most in recent years weren't caught by surprise — they chose not to pay attention.",
      ],
    },
    steps: [
      { color: "#f97316", number: "01", title: "Understand the Major Trends Reshaping Work", body: "The three biggest forces in 2025: AI & automation (redefining roles across every function), hybrid & remote work (changing how teams are structured and managed), and sustainability (driving new roles and reshaping supply chains)." },
      { color: "#f59e0b", number: "02", title: "Identify How These Trends Affect Your Field", body: "The impact of AI varies by sector. In finance, it's automating risk modelling. In marketing, it's transforming content and analytics. In HR, it's changing how companies source and screen talent. Map the trends specifically to your industry." },
      { color: "#10b981", number: "03", title: "Build Skills That Are Future-Proof", body: "Skills that remain valuable regardless of automation: critical thinking, creative problem-solving, stakeholder management, and complex communication. Layer these with domain expertise and basic AI literacy — the ability to work with and prompt AI tools effectively." },
      { color: "#3b82f6", number: "04", title: "Position Yourself as a Trend-Aware Professional", body: "Use your understanding of industry trends in interviews, in your resume, and on LinkedIn. Mention how you've adapted to or leveraged these shifts. Employers aren't just hiring for today's job description — they're hiring for tomorrow's challenges." },
    ],
    commonQuestions: { title: "Key Questions About Industry Trends in 2025", subtitle: "Get clear on what's changing and how to stay ahead.", questions: [] },
    example: {
      title: "Real Example: How Trend Awareness Led to a Promotion",
      person: "Sana",
      avatar: "S",
      timeline: [
        { week: "Q1", label: "Trend Identified", text: "Sana noticed her company investing in AI-driven supply chain tools." },
        { week: "Q2", label: "Upskilling", text: "She completed a digital operations course proactively, without being asked." },
        { week: "Q3", label: "Implementation", text: "Led the pilot implementation of the new AI tools for her team." },
        { week: "Q4", label: "Promoted", text: "Promoted to Head of Digital Operations with a 35% salary increase — two years ahead of typical progression." },
      ],
      note: "She saw the trend before her colleagues did and moved toward it — that made all the difference.",
    },
    bestPractices: [
      "Read industry publications and trend reports regularly — awareness is the first step to adaptation.",
      "Experiment with AI tools relevant to your field before they become required.",
      "Network with people at the frontier of your industry — they're your early-warning system.",
    ],
    mistakes: [
      "Assuming your current skills will remain sufficient — continuous learning is no longer optional.",
      "Dismissing AI as irrelevant to your role — it's reshaping every function.",
      "Waiting for your employer to upskill you — the most successful professionals take personal ownership.",
    ],
    faqs: [
      { q: "What is the most important industry trend for job seekers in 2025?", a: "AI literacy is the most universally relevant skill — valued across virtually every sector and role." },
      { q: "How long does it take to develop future-proof skills?", a: "Many relevant skills can be developed through structured online courses in 4–8 weeks with targeted, consistent effort." },
      { q: "What tools can I use to stay current with industry trends?", a: "GreatHire.in's company insights, LinkedIn newsletters, McKinsey Global Institute reports, and sector-specific publications." },
      { q: "Can understanding trends help me in my current role?", a: "Absolutely. Trend awareness helps you have more strategic conversations with leadership and identify growth opportunities within your company." },
      { q: "Is remote work here to stay?", a: "Hybrid models appear to be the permanent norm for knowledge work, though fully remote arrangements vary significantly by company and sector." },
      { q: "How does sustainability affect my career?", a: "Sustainability is creating entirely new roles and reshaping procurement, supply chains, and product development across nearly every industry." },
    ],
    conclusion: {
      body: [
        "The professionals who thrive in 2025 won't be the ones who resisted change — they'll be the ones who understood it, adapted to it, and used it to accelerate their careers.",
        "Start by getting informed, then get skilled, then get visible. GreatHire.in is your guide for every step of that journey.",
      ],
    },
    cta: { title: "Stay Ahead of the Curve", body: "Browse trend-aligned job listings and career resources on GreatHire.in.", button: "Explore Opportunities on GreatHire" },
    description: "AI-driven automation, hybrid work models, and sustainability imperatives are reshaping how organisations operate. Staying informed is essential for professionals looking to remain competitive.",
  },
  {
    id: 6,
    name: "Development Programs That Accelerate Careers",
    category: "Company Insights",
    primaryKeyword: "Employee Development Programs",
    image: "/company_insight_03.webp",
    badgeLabel: "Company Insights",
    heroTitle: "Development Programs That Actually Accelerate Your Career",
    heroSubtitle: "What to Look For and How to Leverage Them",
    publishDate: "May 19, 2025",
    readTime: "10 min read",
    tags: ["Employee Development Programs", "Career Growth", "Professional Development", "Learning at Work"],
    intro: [
      "The most forward-thinking companies understand something that short-sighted ones miss: investing in people is investing in performance.",
      "Employee development programs are no longer a perk. They're a competitive necessity — and knowing how to find and use them is a career accelerator.",
    ],
    whySection: {
      title: "Why Development Programs Matter More Than Ever",
      body: [
        "In 2025, skills have a shorter shelf life than at any previous point in history. The professionals who stay relevant are those who make learning a continuous habit — not a one-time event.",
        "Companies that invest in development consistently outperform those that don't on every metric: retention, productivity, innovation, and profitability.",
      ],
    },
    steps: [
      { color: "#f97316", number: "01", title: "Know What Strong Development Programs Look Like", body: "The best programs go beyond one-off training days. Look for structured learning pathways, mentorship pairing, access to industry certifications, internal mobility opportunities, and leadership development tracks." },
      { color: "#f59e0b", number: "02", title: "Identify the Development Opportunities Available to You", body: "Take stock of what's available: e-learning platforms, tuition reimbursement, conference attendance, cross-functional projects, shadowing opportunities, and coaching access. Many professionals underutilise existing resources." },
      { color: "#10b981", number: "03", title: "Build a Personal Development Plan", body: "Don't wait for HR to hand you a plan. Identify 3–5 skills you want to develop over the next 12 months, find the resources to develop them, and set measurable milestones. Share your plan with your manager." },
      { color: "#3b82f6", number: "04", title: "Measure Growth & Make It Visible", body: "Track your development: certifications earned, skills gained, projects led, mentees supported. Make it visible — update your LinkedIn, your resume, and your internal profile. Development that isn't documented doesn't count." },
    ],
    commonQuestions: { title: "Key Questions About Employee Development", subtitle: "Get the most out of your company's investment in you.", questions: [] },
    example: {
      title: "Real Example: How One Employee Used Development Programs to Fast-Track a Promotion",
      person: "Vikram",
      avatar: "V",
      timeline: [
        { week: "Month 1", label: "Enrolled", text: "Vikram enrolled in his company's leadership development program immediately after joining." },
        { week: "Month 6", label: "Certified", text: "Completed two certifications and took on a cross-functional project." },
        { week: "Month 12", label: "Mentorship", text: "Found an internal mentor at senior director level who provided strategic career guidance." },
        { week: "Month 20", label: "Promoted", text: "Promoted to team lead — two years ahead of the typical progression track." },
      ],
      note: "He treated development as a priority, not an afterthought. The results spoke for themselves.",
    },
    bestPractices: [
      "Ask about development programs during interviews — it signals long-term thinking and helps you evaluate the company.",
      "Combine formal programs with informal learning: books, podcasts, peer learning, and project-based skill-building.",
      "Find a mentor — the fastest learners almost always have one.",
    ],
    mistakes: [
      "Waiting to be tapped for development rather than proactively seeking it.",
      "Focusing only on technical skills while neglecting leadership and communication development.",
      "Not tracking or documenting growth — invisible development doesn't get rewarded.",
    ],
    faqs: [
      { q: "How do I find out if a company has strong development programs?", a: "Ask directly during interviews: 'What does professional development look like for someone in this role?' Check Glassdoor reviews too." },
      { q: "How long does it take for development efforts to show results?", a: "Meaningful skill development is typically visible within 3–6 months. Career advancement driven by development often manifests within 12–24 months." },
      { q: "What tools should I use to build my skills?", a: "Coursera, LinkedIn Learning, and Udemy for structured courses. GreatHire.in for career guidance and job opportunities aligned to your growth goals." },
      { q: "Is this relevant if I'm not planning to change jobs?", a: "Absolutely. Development programs are most powerful when you're already employed — they help you grow within your current organisation." },
      { q: "How do I approach my manager about development?", a: "Bring a specific plan, not a vague request. Come with 2-3 skills you want to develop, the resources you need, and how it benefits the team." },
      { q: "What if my company doesn't have formal development programs?", a: "Create your own: set learning goals, find online courses, seek out mentors externally, and document everything. Self-directed learners are always valued." },
    ],
    conclusion: {
      body: [
        "Your career doesn't develop by default — it develops by design.",
        "Whether you're choosing an employer, navigating your current role, or planning your next move, understanding and leveraging development programs is one of the highest-return investments you can make. Let GreatHire.in help you find organisations that will grow with you.",
      ],
    },
    cta: { title: "Find a Company That Invests in You", body: "Browse companies known for strong development culture and growth opportunities on GreatHire.in.", button: "Explore Opportunities on GreatHire" },
    description: "Leading organisations recognise that investing in employee development is key to long-term success. Strong development programs drive higher engagement, retention, and organisational resilience.",
  },
];

/* ─────────────────────────────────────────────────────────────
   FAQ ACCORDION ITEM
───────────────────────────────────────────────────────────── */
const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900 dark:text-white text-[15px] pr-4">{faq.q}</span>
        <svg
          className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 pr-8">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{faq.a}</p>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────────────────────── */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = productItems.find((item) => item.id === Number(id));
  const currentProduct = product || productItems[0];
  const currentIndex = productItems.indexOf(currentProduct);
  const prevProduct = productItems[(currentIndex - 1 + productItems.length) % productItems.length];
  const nextProduct = productItems[(currentIndex + 1) % productItems.length];

  if (!product && id) {
    return (
      <>
        <Helmet><title>GreatHire - Not Found</title></Helmet>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
          <p className="text-xl font-bold text-gray-900 dark:text-white">Product not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Go Back</button>
        </div>
        <Footer />
      </>
    );
  }

  const p = currentProduct;

  return (
    <>
      <Helmet>
        <title>GreatHire - {p.name}</title>
        <meta name="description" content={p.description.slice(0, 160)} />
        <meta name="keywords" content={p.primaryKeyword} />
      </Helmet>

      <Navbar />

      <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors duration-300">

        {/* ══════════════════════════════════════
            ORANGE HERO BANNER
        ══════════════════════════════════════ */}
        <div
          style={{ background: "linear-gradient(135deg, #c2410c 0%, #ea580c 40%, #f97316 70%, #fb923c 100%)" }}
          className="relative overflow-hidden"
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-[0.08]" style={{ backgroundColor: "#fff" }} />
            <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full opacity-[0.08]" style={{ backgroundColor: "#fff" }} />
          </div>

          <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-md bg-white/20 text-white border border-white/30">
                {p.badgeLabel}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-white leading-tight mb-2 tracking-tight max-w-3xl">
              {p.heroTitle}
            </h1>
            <p className="text-orange-100 font-medium text-lg mb-5">{p.heroSubtitle}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-orange-100 text-sm mb-6 font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {p.publishDate}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {p.readTime}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {p.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-medium hover:bg-white/25 cursor-pointer transition-colors duration-150"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            ARTICLE BODY
        ══════════════════════════════════════ */}
        <article className="max-w-5xl mx-auto px-6 pb-24">

          {/* ── INTRO ── */}
          <section className="mt-10 max-w-3xl">
            {p.intro.map((para, i) => (
              <p key={i} className={`text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed ${i > 0 ? "mt-4" : ""}`}>
                {para}
              </p>
            ))}
          </section>

          {/* ── WHY SECTION ── */}
          <section className="mt-12 max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{p.whySection.title}</h2>
            {p.whySection.body.map((para, i) => (
              <p key={i} className={`text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed ${i > 0 ? "mt-3" : ""}`}>
                {para}
              </p>
            ))}
          </section>

          {/* ── STEP-BY-STEP ── */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Step-by-Step Guidance to Crack Your HR Interview
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">4-step framework used by top freshers</p>
            <div className="space-y-4">
              {p.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-[15px] mb-1.5">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── COMMON QUESTIONS GRID (only for product 1) ── */}
          {p.commonQuestions.questions && p.commonQuestions.questions.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {p.commonQuestions.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{p.commonQuestions.subtitle}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {p.commonQuestions.questions.map((item, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Badges row */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold text-white"
                        style={{ backgroundColor: item.badgeColor }}
                      >
                        {item.badge}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold text-white"
                        style={{ backgroundColor: item.hintColor }}
                      >
                        {item.hint}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm mb-2 leading-snug">{item.q}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── REAL EXAMPLE — orange gradient timeline ── */}
          <section className="mt-14">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{p.example.title}</h2>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #c2410c 0%, #ea580c 35%, #f97316 65%, #fb923c 100%)" }}
            >
              <div className="p-6 sm:p-8">
                {/* Person header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base border-2 border-white/30" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    {p.example.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">{p.example.person}</p>
                    <p className="text-orange-200 text-xs font-medium">Success Story</p>
                  </div>
                </div>

                {/* Timeline 4-column grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {p.example.timeline.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-4"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
                    >
                      <p className="text-orange-200 text-[11px] font-bold uppercase tracking-wider mb-1">{t.week}</p>
                      <p className="text-white font-bold text-sm mb-2">{t.label}</p>
                      <p className="text-orange-100 text-[12px] leading-relaxed">{t.text}</p>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <p className="mt-5 pt-4 border-t border-white/20 text-orange-100 text-sm italic">
                  {p.example.note}
                </p>
              </div>
            </div>
          </section>

          {/* ── BEST PRACTICES + COMMON MISTAKES ── */}
          <section className="mt-10 grid sm:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Best Practices</h2>
              <ul className="space-y-3">
                {p.bestPractices.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <svg className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {bp}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Common Mistakes</h2>
              <ul className="space-y-3">
                {p.mistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <svg className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── FAQs ── */}
          <section className="mt-14 max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="border-t border-gray-200 dark:border-gray-700">
              {p.faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} />
              ))}
            </div>
          </section>

          {/* ── CONCLUSION ── */}
          <section className="mt-14 max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Conclusion</h2>
            {p.conclusion.body.map((para, i) => (
              <p key={i} className={`text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed ${i > 0 ? "mt-4" : ""}`}>
                {para}
              </p>
            ))}
          </section>

          {/* ── CTA — green gradient ── */}
          <section className="mt-12">
            <div
              className="rounded-2xl overflow-hidden text-center"
              style={{ background: "linear-gradient(135deg, #14532d 0%, #15803d 40%, #16a34a 70%, #22c55e 100%)" }}
            >
              <div className="px-8 py-12 relative">
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: "#fff" }} />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: "#fff" }} />

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 relative z-10">{p.cta.title}</h3>
                <p className="text-green-100 mb-7 max-w-lg mx-auto text-[15px] leading-relaxed relative z-10">{p.cta.body}</p>
                <a
                  href="/"
                  className="inline-block px-8 py-3 rounded-xl font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all duration-150 relative z-10"
                  style={{ backgroundColor: "#f97316" }}
                >
                  {p.cta.button}
                </a>
              </div>
            </div>
          </section>

          {/* ── NAVIGATION ── */}
          <div className="mt-12 flex justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-8">
            <button
              onClick={() => navigate(`/ProductDetailPage/${prevProduct.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition-colors duration-150"
            >
              All Resources
            </button>
            <button
              onClick={() => navigate(`/ProductDetailPage/${nextProduct.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-sm transition-colors duration-150"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </article>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;