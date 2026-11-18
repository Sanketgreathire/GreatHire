import "dotenv/config";
import mongoose from "mongoose";
import Blog from "../models/blog.model.js";

// One-time migration of the hardcoded Blog-page arrays
// (frontend/src/components/Main_blog_page.jsx) into the Blog collection.
//
// Run:  node scripts/seedBlogs.js     (idempotent — safe to re-run)
//
// Every card is stored as kind:"card" so it never appears in the sitemap.
// `expiresAt` is intentionally left unset (never expires); to rotate a tile
// out after 30 days, set expiresAt on that document.
// `publishAt` is only set on insert so re-running never clobbers a date an
// editor has adjusted.

const SEED = [
  {
    section: "slides",
    cards: [
      {
        cardId: 1,
        title: "The future technology",
        excerpt:
          "The future of technology is shaped by bold ideas and the courage to act on them. At GreatHire, we believe that innovation begins with people — the right talent, in the right roles, driving meaningful change across industries.",
        image: "./3320008.webp",
      },
      {
        cardId: 2,
        title: "Innovation drives growth",
        excerpt:
          "Innovation is the engine behind every thriving organization. By embracing forward-thinking strategies and emerging technologies, businesses can unlock new opportunities, improve efficiency, and build a competitive edge that lasts.",
        image: "./innovation-bg.webp",
      },
      {
        cardId: 3,
        title: "Digital transformation",
        excerpt:
          "Digital transformation is no longer optional — it is the foundation of modern business success. Organizations that adapt to evolving technologies and digital workflows are better positioned to serve their customers and grow sustainably.",
        image: "./digital_bg.webp",
      },
      {
        cardId: 4,
        title: "Technology solutions",
        excerpt:
          "Scalable, secure, and sustainable technology platforms are the backbone of tomorrow's enterprises. Building with the right tools and the right talent ensures that organizations remain resilient, agile, and ready for what comes next.",
        image: "./technology-solutions_bg.webp",
      },
    ],
  },
  {
    section: "featured",
    cards: [
      {
        title: "Mastering",
        subtitle: "remote work",
        excerpt:
          "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.",
        image: "./vector.webp",
        displayDate: "December 20, 2024",
        category: "Featured",
      },
      {
        title: "AI",
        subtitle: "Recruitment",
        excerpt:
          "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening, Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in",
        image: "./19276.webp",
        displayDate: "December 18, 2024",
        category: "Featured",
      },
      {
        title: "Build",
        subtitle: "Winning Resumes",
        excerpt:
          "Make a strong first impression with a standout resume with key skills and clean formatting, optimized for ATS. GreatHire.in helps you land your ideal job by connecting you with the best opportunities.",
        image: "./Resume_bg.webp",
        displayDate: "December 15, 2024",
        category: "Trending",
      },
      {
        title: "Interview",
        subtitle: "Preparations",
        excerpt:
          "Research the company, practice questions, and present yourself professionally. GreatHire.in provides expert tips and top job opportunities to help you succeed and make a lasting impression.",
        image: "./Interview_bg.webp",
        displayDate: "December 12, 2024",
        category: "Featured",
      },
      {
        title: "The Future",
        subtitle: "Of Work",
        excerpt:
          "AI-driven hiring, remote work, and flexible roles are reshaping the workplace, making upskilling crucial. GreatHire.in keeps you informed on trends and connects you to top career opportunities.",
        image: "./future_of_work.png",
        displayDate: "December 10, 2024",
        category: "Trending",
      },
      {
        title: "Upskilling for",
        subtitle: "Career Growth",
        excerpt:
          "Continuous learning is essential for career advancement, with in-demand skills shifting toward AI, cloud computing, and data analytics. Investing in online courses, certifications.",
        image: "./trendingz-topic_02.webp",
        displayDate: "December 10, 2024",
        category: "Trending",
      },
    ],
  },
  {
    section: "articles",
    cards: [
      {
        cardId: 1,
        title: "Advance Your Career in Tech",
        excerpt:
          "Explore top opportunities with GreatHire.in, gain expert insights, and access resources to accelerate your growth. Stay ahead by upskilling, following industry trends, and landing your dream job.",
        image: "./971.webp",
        category: "Business",
        author: "Moin Shaikh",
        displayDate: "December 20, 2024",
      },
      {
        cardId: 2,
        title: "Work-Life Balance Tips",
        excerpt:
          "Balancing work and personal life is essential for success. Set realistic boundaries, take breaks, and manage time to reduce stress. GreatHire.in offers flexible job opportunities for a healthy work-life balance.",
        image: "./feature_article.webp",
        category: "Technology",
        author: "Moin Shaikh",
        displayDate: "December 18, 2024",
      },
      {
        cardId: 3,
        title: "Networking For Career Growth",
        excerpt:
          "Networking opens doors to career growth engage on LinkedIn, attend events, and build meaningful connections. GreatHire.in helps you find the right opportunities and insights to advance your career.",
        image: "./networking_bg.webp",
        category: "Network",
        author: "Moin Shaikh",
        displayDate: "December 15, 2024",
      },
      {
        cardId: 4,
        title: "Top 10 IT Jobs for Freshers in India",
        excerpt:
          "The complete roadmap — from choosing the right role to cracking your first offer. No fluff, just real guidance for the class of 2026.",
        image: "./networking_bg.webp",
        category: "Network",
        author: "Moin Shaikh",
        displayDate: "December 15, 2024",
      },
      {
        cardId: 5,
        title: "How to Get a Job as a Fresher Without Experience",
        excerpt:
          "Breaking into the job market as a fresher can be challenging, but with the right approach and preparation, you can land your dream job. Here are some tips to help you get started.",
        image: "/how-to-get-a-job-as-a-fresher.jpg",
        category: "Career Advice",
        author: "Moin Shaikh",
        displayDate: "December 20, 2024",
      },
      {
        cardId: 6,
        title: "Best Resume Format for Freshers (With Free Template)",
        excerpt:
          "A well-crafted resume is crucial for freshers to make a strong first impression on potential employers. The best resume format for freshers typically includes a clear and concise layout, highlighting key sections such as contact information, objective statement, education, skills, and any relevant internships or projects. Using a clean design with bullet points and appropriate keywords can help your resume stand out in applicant tracking systems (ATS) and increase your chances of landing an interview.",
        image: "/bestResume.web.p.webp",
        category: "Career Advice",
        author: "Moin Shaikh",
        displayDate: "December 20, 2024",
      },
      {
        cardId: 7,
        title: "Top Skills Companies Look for in Freshers in 2026",
        excerpt:
          "In 2026, companies are seeking freshers with a blend of technical and soft skills. Key technical skills include proficiency in programming languages, data analysis, and digital literacy. Soft skills such as communication, adaptability, problem-solving, and teamwork are equally important. Freshers who demonstrate a willingness to learn and a proactive attitude towards upskilling will have a competitive edge in the job market.",
        image: "/topSkill.jpg",
        category: "Career Advice",
        author: "Moin Shaikh",
        displayDate: "December 20, 2024",
      },
      {
        cardId: 8,
        title: "How to Crack Your First HR Interview",
        excerpt:
          "Cracking your first HR interview requires preparation and confidence. Research the company, understand the role, and practice common HR questions. Focus on showcasing your skills, experiences, and cultural fit. GreatHire.in provides resources and job opportunities to help you succeed in your career journey.",
        image: "/HRinterviewtip.webp",
        category: "Career Advice",
        author: "Moin Shaikh",
        displayDate: "December 20, 2024",
      },
    ],
  },
  {
    section: "hiring-advice",
    cards: [
      {
        cardId: 1,
        title: "Mastering Remote Work",
        excerpt:
          "Successful remote hiring needs clear communication, strong collaboration tools, and structured onboarding. GreatHire.in helps you find top remote talent and build strong, engaged teams effortlessly.",
        image: "./Mastering_remote_work.webp",
        link: "/blog/mastering-remote-work",
      },
      {
        cardId: 2,
        title: "AI For Recruitment",
        excerpt:
          "AI is revolutionizing recruitment by enabling faster, smarter hiring with resume screening, Job seekers gain personalized job recommendations and quicker interview processes with GreatHire.in.",
        image: "./AI_recruitment.webp",
        link: "/blog/ai-recruitment",
      },
      {
        cardId: 3,
        title: "Industry-Specific Hiring",
        excerpt:
          "Tech hiring emphasizes AI, cloud computing, and cybersecurity skills, while non-tech sectors focus on adaptability, customer experience. Remote work and gig economy roles are growing across both industries.",
        image: "./Industry_work.webp",
        link: "/blog/mastering-remote-work",
      },
      {
        cardId: 4,
        title: "How to Find Jobs in Hyderabad Fast (Complete Guide)",
        excerpt:
          "Finding jobs in Hyderabad quickly requires a strategic approach. Start by updating your resume and LinkedIn profile, and utilize job portals like GreatHire.in to access the latest opportunities. Networking with local professionals, attending job fairs, and connecting with recruiters can also accelerate your job search in Hyderabad's competitive market.",
        image: "/findJodInHydrabad.webp",
        link: "/HiringAdvice/4",
      },
      {
        cardId: 5,
        title: "Top Job Portals in India Compared",
        excerpt:
          "Finding the right job portal in India can significantly impact your job search. GreatHire.in stands out with its user-friendly interface, personalized job recommendations, and real-time updates. Compared to other portals, GreatHire.in offers a more tailored experience, connecting you with opportunities that align with your skills and career goals.",
        image: "/bestJobPortale.webp",
        link: "/HiringAdvice/5",
      },
      {
        cardId: 6,
        title: "Remote Jobs in India",
        excerpt:
          "Remote jobs in India are on the rise, offering flexibility and access to global opportunities. GreatHire.in helps you find remote positions across various industries, from tech to customer service. With the right skills and a proactive approach, you can thrive in India's growing remote work landscape.",
        image: "/REMOTE-JOBS-copy.webp",
        link: "/HiringAdvice/6",
      },
      {
        cardId: 7,
        title: "Walk-in Interviews in Hyderabad",
        excerpt:
          "Walk-in interviews in Hyderabad offer a direct way to connect with potential employers. GreatHire.in provides information on upcoming walk-in events and helps you prepare for these opportunities.",
        image: "/Walk-in-Interview1 - Copy.webp",
        link: "/HiringAdvice/7",
      },
      {
        cardId: 8,
        title: "How to Apply for 50 Jobs a Day",
        excerpt:
          "Applying for 50 jobs a day requires organization, efficiency, and the right tools. Use job portals like GreatHire.in to quickly find relevant opportunities, and create a streamlined application process with a well-crafted resume and cover letter templates. Prioritize quality over quantity by tailoring your applications to each role, and stay consistent in your job search efforts.",
        image: "/applyfor50job.webp",
        link: "/HiringAdvice/8",
      },
    ],
  },
  {
    section: "trending-topics",
    cards: [
      {
        cardId: 1,
        title: "The Future of Work",
        excerpt:
          "The workplace is shifting with AI-driven hiring, remote work, and flexible roles, making upskilling essential. GreatHire.in keeps you updated on trends and connects you with top career opportunities.",
        image: "./future_of_work.webp",
        link: "/blog/future-of-work",
      },
      {
        cardId: 2,
        title: "Future Skills for Job Seekers",
        excerpt:
          "With automation and AI reshaping industries, in-demand skills include cloud computing, cybersecurity, data analytics, and digital marketing. Soft skills like adaptability, problem-solving, and collaboration are also becoming essential.",
        image: "./trendingz-topic_02.webp",
        link: "/blog/upskilling-career-growth",
      },
      {
        cardId: 3,
        title: "Impact of Global Events on Workforce",
        excerpt:
          "Economic and political events, such as recessions, conflicts, and policy changes, influence job markets, hiring trends, and remote work adoption. Businesses adjust workforce strategies based on global stability.",
        image: "./trendingz_topic_03.webp",
        link: "/blog/mastering-remote-work",
      },
      {
        cardId: 4,
        title: "Best Career Options After Graduation in India",
        excerpt:
          "Graduates in India have diverse career options, including IT, engineering, healthcare, finance, and emerging fields like data science and AI. GreatHire.in provides insights and job opportunities to help you navigate the post-graduation job market and find the right path for your skills and interests.",
        image: "/BestCarrerOptionAfterGraduation.webp",
        link: "/TrendingTopics/4",
      },
      {
        cardId: 5,
        title: "IT vs Non-IT Jobs",
        excerpt:
          "IT jobs focus on technology, software development, and data analysis, while non-IT roles span healthcare, finance, education, and more. Both sectors offer growth opportunities, with IT emphasizing technical skills and non-IT valuing interpersonal and industry-specific expertise. GreatHire.in connects you with the right opportunities in both fields based on your skills and career goals.",
        image: "/IT-Non-ITrecruitment-min.webp",
        link: "/TrendingTopics/5",
      },
      {
        cardId: 6,
        title: "Top High-Paying Skills You Can Learn in 3 Months",
        excerpt:
          "In-demand, high-paying skills that can be learned in 3 months include data analysis, digital marketing, coding (Python, JavaScript), UX/UI design, and cloud computing. These skills are highly sought after by employers and can significantly boost your career prospects. GreatHire.in offers resources and job opportunities to help you acquire these skills and connect with top employers.",
        image: "/heigh paying skills.webp",
        link: "/TrendingTopics/6",
      },
      {
        cardId: 7,
        title: "Switching to IT Without Coding Experience",
        excerpt:
          "Transitioning to the IT field without a coding background is possible with the right skills and training. GreatHire.in provides resources and job opportunities to help you make this career change successfully.",
        image: "/SWITCH-FROM-NON-IT-TO-IT-CAREER-blog.jpg",
        link: "/TrendingTopics/7",
      },
      {
        cardId: 8,
        title: "Resume Mistakes That Get You Rejected Instantly",
        excerpt:
          "Common resume mistakes that lead to instant rejection include typos, poor formatting, lack of relevant keywords, and including irrelevant information. GreatHire.in offers expert guidance to help you create a standout resume that avoids these pitfalls and increases your chances of landing an interview.",
        image: "/resumemistake.webp",
        link: "/TrendingTopics/8",
      },
      {
        cardId: 9,
        title: "Resume ATS-Friendly Tips",
        excerpt:
          "Creating an ATS-friendly resume is crucial for getting past automated screening systems. GreatHire.in provides expert guidance to help you optimize your resume for ATS, increasing your chances of landing an interview.",
        image: "/ATSfriendlyresume.webp",
        link: "/TrendingTopics/9",
      },
      {
        cardId: 10,
        title: "Top 20 Common Interview Questions and Best Answers",
        excerpt:
          "Preparing for common interview questions is essential for success. GreatHire.in provides expert tips and resources to help you craft strong answers to the top 20 interview questions, increasing your confidence and improving your chances of landing your dream job.",
        image: "/Top_20+_HR_Interview_Questions_with_Answers.png",
        link: "/TrendingTopics/10",
      },
    ],
  },
  {
    section: "insights",
    cards: [
      {
        cardId: 1,
        category: "Recruiter / HR Insights",
        title: "How to Hire the Right Candidate Faster",
        displayDate: "19 Dec, 2025",
        image: "./Resume_bg.webp",
        excerpt:
          "Hiring the right candidate faster requires a strategic approach that combines clear job descriptions, efficient screening processes, and effective communication. GreatHire.in offers AI-powered tools and expert insights to help recruiters streamline their hiring process, identify top talent quickly, and make informed decisions that lead to successful hires.",
        link: "/CarouselItems/1",
      },
      {
        cardId: 2,
        category: "Recruiter / HR Insights",
        title: "Avoiding Common Hiring Mistakes",
        displayDate: "18 Dec, 2025",
        image: "/hrinsight_2.webp",
        excerpt:
          "Avoiding common hiring mistakes is crucial for building a strong team and ensuring long-term success. Common pitfalls include unclear job descriptions, relying too heavily on resumes, and neglecting cultural fit. GreatHire.in provides AI-powered tools and expert insights to help recruiters identify and avoid these mistakes, leading to better hiring outcomes and stronger teams.",
        link: "/CarouselItems/2",
      },
      {
        cardId: 3,
        category: "Recruiter / HR Insights",
        title: "Best Ways to Screen Candidates Efficiently",
        displayDate: "18 Dec, 2025",
        image: "/hrinsight_3.webp",
        excerpt:
          "Efficient candidate screening is essential for identifying top talent quickly and effectively. Best practices include using AI-powered resume screening tools, conducting structured interviews, and assessing cultural fit. GreatHire.in offers resources and insights to help recruiters streamline their screening process, ensuring they connect with the best candidates for their organization.",
        link: "/CarouselItems/3",
      },
      {
        cardId: 4,
        category: "Resume Tips",
        title: "Creating a Successful CV",
        displayDate: "19 Dec, 2025",
        image: "./Resume_bg.webp",
        excerpt:
          "A well-crafted resume is your first opportunity to make a lasting impression on a potential employer. It should clearly highlight your skills, accomplishments, and professional experience using a clean, consistent structure and relevant keywords. GreatHire.in supports candidates by offering ATS-friendly resume guidance, ensuring your profile gains maximum visibility and reaches the right recruiters faster.",
        link: "/CarouselItems/4",
      },
      {
        cardId: 5,
        category: "Resume Tips",
        title: "ATS Optimization",
        displayDate: "18 Dec, 2025",
        image: "./ATS_bg.webp",
        excerpt:
          "Gaining awareness in the competitive job market of today requires an ATS-friendly resume. Applicant tracking systems (ATS) automatically analyze and assess resumes based on predetermined criteria, including pertinent keywords, abilities, job titles, and formatting, before they are sent to a recruiter. Regardless of a candidate's qualifications, resumes that are not suited for applicant tracking systems may be eliminated early in the process. Making an ATS-compliant resume guarantees that recruiting experts analyze your profile and improves your chances of passing first screenings.",
        link: "/CarouselItems/5",
      },
      {
        cardId: 6,
        category: "Resume Tips",
        title: "Using Keywords",
        displayDate: "17 Dec, 2025",
        image: "./Keyword_bg.webp",
        excerpt:
          "Strategically incorporating industry-specific keywords into your resume can significantly improve its visibility to Applicant Tracking Systems. By carefully reviewing job descriptions, you can identify the skills, phrases, and qualifications that employers prioritize. Naturally weaving these keywords throughout your resume improves ATS matching accuracy and increases the likelihood of your profile being shortlisted.",
        link: "/CarouselItems/6",
      },
      {
        cardId: 7,
        category: "HR Insights",
        title: "Interview Preparation",
        displayDate: "16 Dec, 2025",
        image: "./Interview_bg.webp",
        excerpt:
          "A structured interview process helps employers evaluate candidates across key dimensions, including problem-solving ability, cultural alignment, and behavioral competencies. GreatHire.in enhances this process with AI-powered tools and professional insights, enabling recruiters to make faster, more informed hiring decisions and connect with the talent best suited for their organization.",
        link: "/CarouselItems/7",
      },
      {
        cardId: 8,
        category: "HR Insights",
        title: "Behavioral Interview Techniques",
        displayDate: "16 Dec, 2025",
        image: "./HR_Insight_02.webp",
        excerpt:
          "Behavioral interview techniques are designed to assess how candidates have handled real-world situations in the past, offering valuable insight into their future performance. By evaluating responses to structured questions around teamwork, conflict resolution, and decision-making, employers can identify candidates who are not only skilled but also a strong fit for the team. GreatHire.in provides AI-powered tools and expert insights to help streamline this process.",
        link: "/CarouselItems/8",
      },
      {
        cardId: 9,
        category: "HR Insights",
        title: "Cultural Fit Assessment",
        displayDate: "16 Dec, 2025",
        image: "./HR_Insight_03.webp",
        excerpt:
          "A cultural fit assessment evaluates how well a candidate aligns with an organization's values, team dynamics, and workplace environment. Beyond technical qualifications, it examines communication styles, work ethics, and behavioral tendencies to determine whether a candidate's approach to collaboration and decision-making complements the company's long-term vision. Organizations that prioritize cultural alignment tend to see stronger employee engagement, higher retention, and greater overall performance.",
        link: "/CarouselItems/9",
      },
    ],
  },
  {
    section: "interview-tips",
    cards: [
      {
        cardId: 1,
        title: "Effective Job Interview Strategies",
        category: "Interview Tips",
        excerpt:
          "Thorough preparation is the foundation of a successful job interview. Researching the company, understanding the role, and practicing responses using the STAR method — Situation, Task, Action, Result — allows candidates to present their experience with clarity and confidence. GreatHire.in provides expert guidance and interview preparation resources to help candidates perform at their best and make a lasting impression on employers.",
        image: "./interview_tips_01.webp",
      },
      {
        cardId: 2,
        title: "Post-Interview Follow-Up",
        category: "Interview Tips",
        excerpt:
          "Sending a thoughtful thank-you email within 24 hours of an interview is a simple yet powerful way to reinforce your professionalism. A well-crafted follow-up message allows you to restate your key qualifications, reaffirm your enthusiasm for the role, and politely inquire about the next steps in the hiring process — leaving a positive and memorable impression on the employer.",
        image: "./interview_tips_02.webp",
      },
      {
        cardId: 3,
        title: "Common Interview Questions",
        category: "Interview Tips",
        excerpt:
          "Preparing for commonly asked interview questions — such as 'Tell me about yourself,' 'Why do you want to work here?' and 'What are your strengths and weaknesses?' — gives candidates a significant advantage. Thoughtful, well-rehearsed answers demonstrate self-awareness and clear communication, helping candidates present their skills, experiences, and goals in a way that resonates with interviewers.",
        image: "./interview_tips_03.webp",
      },
      {
        cardId: 4,
        title: "Top Companies Hiring in 2025",
        category: "Company Insights",
        excerpt:
          "In 2025, leading global organizations including Amazon, Google, and GE Aerospace are expanding their teams across technology, engineering, finance, and operations. Alongside these industry giants, fast-growing startups and mid-sized firms are actively recruiting in fields such as Artificial Intelligence, Data Science, and Cybersecurity. GreatHire.in provides real-time job updates and personalized recommendations to help you discover opportunities that align with your skills, career goals, and preferred work style.",
        image: "./company_insight_01.webp",
      },
      {
        cardId: 5,
        title: "Industry Trends",
        category: "Company Insights",
        excerpt:
          "Emerging industry trends — including AI-driven automation, the rise of remote and hybrid work models, and a growing focus on sustainable business practices — are reshaping how organizations operate. Companies that invest in digital transformation and advanced technologies are better equipped to boost productivity, protect data, and foster innovation. Staying informed about these shifts is essential for professionals and organizations looking to remain competitive.",
        image: "./company_insight_02.webp",
      },
      {
        cardId: 6,
        title: "Development Programs",
        category: "Company Insights",
        excerpt:
          "Leading organizations recognize that investing in employee development is key to long-term success. Through technical certifications, leadership training, mentorship programs, and continuous learning initiatives, companies equip their workforce with the skills needed to grow and adapt. A strong commitment to professional development not only enhances individual performance but also drives higher engagement, retention, and organizational resilience.",
        image: "./company_insight_03.webp",
      },
    ],
  },
];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function seed() {
  await mongoose.connect(
    process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/great_hire_db"
  );
  console.log("MongoDB connected — seeding blog cards...");

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const { section, cards } of SEED) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const slug = `${section}-${slugify(card.title)}`;

      // Drop undefined keys so $set never carries them, and keep editor-owned
      // fields (publishAt, expiresAt, status) out of $set on re-runs.
      const $set = Object.fromEntries(
        Object.entries({ ...card, slug, kind: "card", section, order: i + 1 }).filter(
          ([, value]) => value !== undefined
        )
      );

      try {
        const res = await Blog.updateOne(
          { slug },
          { $set, $setOnInsert: { publishAt: new Date() } },
          { upsert: true }
        );
        if (res.upsertedCount) inserted += 1;
        else if (res.matchedCount) updated += 1;
      } catch (error) {
        skipped += 1;
        console.error(`  skipped ${slug}: ${error.message}`);
      }
    }
  }

  console.log(
    `Blog seed complete — ${inserted} inserted, ${updated} updated, ${skipped} skipped.`
  );
  await mongoose.connection.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
