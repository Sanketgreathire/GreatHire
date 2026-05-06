import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";
import ITJobsBlog from "./Itjobsblog ";

const BlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const blogs = [
    {
      id: 1,
      title: "Effective Job Interview",
      subtitle: " Strategies",
      category: "Interview Tips",
      date: "Jan 12, 2025",
      description:
        "Making a good impression during an interview requires careful preparation, confidence, and clear communication. Begin by thoroughly researching the organization and the role you are applying for. Understanding the company’s mission, values, products, and culture allows you to align your answers with what the employer is looking for and demonstrate genuine interest in the position.Practice answering common interview questions such as “Tell me about yourself,” “Why should we hire you?” and “What are your strengths and weaknesses?” Structuring your responses using the STAR method (Situation, Task, Action, Result) helps you clearly explain your experiences, highlight your problem-solving abilities, and showcase measurable achievements.",
      image: "/interview_tips_01.webp",
    },
    {
      id: 2,
      title: "Post-Interview",
      subtitle: " Follow-Up",
      category: "Interview Tips",
      date: "Jan 18, 2025",
      description:
        "Sending a thank-you email within 24 hours of an interview demonstrates professionalism and reaffirms your interest in the position. This simple yet powerful gesture shows appreciation for the interviewer’s time and leaves a positive, lasting impression. It also reinforces your enthusiasm for the role and highlights your strong communication skills.A well-written follow-up email provides an excellent opportunity to briefly restate your key qualifications and connect them to the requirements of the job. You can reference a specific topic discussed during the interview to personalize your message, which helps you stand out from other candidates. This approach shows attentiveness and genuine engagement with the conversation.",
      image: "/interview_tips_02.webp",
    },
    {
      id: 3,
      title: "Top Companies Hiring",
      subtitle: " in 2025",
      category: "Company Insights",
      date: "Jan 25, 2025",
      description:
        "In 2025, major international corporations such as Amazon, Google, Microsoft, and GE Aerospace are expanding significantly, creating a wide range of job opportunities across multiple industries. These organizations are actively hiring talent in areas like software development, artificial intelligence, cloud computing, data analytics, aerospace engineering, supply chain management, and digital marketing to support innovation and global growth.Technology companies continue to lead hiring trends, with a strong focus on AI-driven solutions, automation, cybersecurity, and cloud infrastructure. Meanwhile, aerospace and manufacturing giants are investing heavily in research, sustainability, and advanced engineering, opening doors for skilled professionals in both technical and managerial roles.",
      image: "/company_insight_01.webp",
    },
    {
      id: 4,
      title: "Top 10 IT Jobs for",
      subtitle: " Freshers in India",
      category: "Career Advice",
      date: "May 06, 2026",
      description:
        "Looking for IT jobs for freshers in 2026? You're not alone — and you're in the right place. India's tech sector is adding thousands of entry-level roles this year across software development, data analytics, cloud, cybersecurity, and AI. But knowing which role to target, and how to actually land it, makes all the difference.\n\nIndia's IT industry is projected to cross $300 billion in revenue by 2026, driven by cloud adoption, AI integration, and digital transformation across banking, retail, and government. Companies like Infosys, TCS, Wipro, and hundreds of product startups are actively hiring freshers. The market is real — but it rewards candidates who have built relevant skills and understand the role they're applying for.\n\nHere are the Top 10 IT Jobs for Freshers in India that are actively hiring in 2026:\n\n1. Junior Software Developer — The most sought-after fresher IT job in India. You write, test, and maintain code as part of a product or services team. Python, Java, or JavaScript are the most in-demand languages. Starting salaries range from ₹3.5 to ₹6 LPA, with high demand in Bangalore, Hyderabad, and Pune.\n\n2. Data Analyst — One of the fastest-growing entry-level IT jobs in India in 2026. You help businesses make decisions using data. SQL, Excel, Python, and tools like Power BI or Tableau are key. Freshers can expect ₹3 to ₹5.5 LPA, with strong demand in fintech, e-commerce, and consulting.\n\n3. Manual QA / Software Tester — Underrated but consistently in demand. If you are detail-oriented and systematic, this is one of the easiest IT jobs for freshers to break into, with a clear growth path toward automation testing. Starting salaries range from ₹2.5 to ₹4.5 LPA.\n\n4. Cloud Support Associate — Cloud is everywhere in 2026. Companies need freshers who understand AWS, Azure, or Google Cloud basics. A free cloud certification like AWS Cloud Practitioner significantly boosts your chances. Entry-level CTC ranges from ₹3 to ₹5 LPA.\n\n5. Cybersecurity Analyst (Trainee) — India faces a genuine shortage of cybersecurity professionals, making this one of the most promising IT careers for freshers in 2026. Knowledge of networking basics, ethical hacking fundamentals, and tools like Wireshark can get you in. Starting packages range from ₹3.5 to ₹6 LPA.\n\n6. Frontend Web Developer — A portfolio-driven role where your GitHub and live projects matter more than your degree. If you can build clean, responsive websites using HTML, CSS, JavaScript, and React, companies will hire you. Entry-level salaries range from ₹3 to ₹5.5 LPA.\n\n7. Technical Support Engineer — Often dismissed, but strategically smart. You learn the product deeply, build client-facing communication skills, and many support engineers transition into product, dev, or sales roles within two years. Freshers can earn ₹2.5 to ₹4 LPA.\n\n8. DevOps Trainee — A steep learning curve, but DevOps salaries grow fast. Skills in Linux, Docker, CI/CD pipelines, and Git are key. If you prefer infrastructure over writing application code, this path is worth exploring. Starting CTC ranges from ₹3.5 to ₹6 LPA.\n\n9. AI / ML Trainee — The hottest category in IT jobs for freshers in 2026. Entry-level roles focus on data preparation, model testing, and building simple pipelines. Python and statistics are your minimum entry ticket. Freshers can earn ₹4 to ₹7 LPA.\n\n10. Business Analyst (IT / Tech) — You bridge the gap between tech teams and business stakeholders. Strong communication plus basic SQL and JIRA knowledge makes you a solid BA candidate right out of college. This role is also open to non-CS backgrounds. Starting salaries range from ₹3 to ₹5 LPA.\n\nHow to Land Your First IT Job in India (Step-by-Step):\n\nStep 1 — Pick one target role and research it deeply. Read 10 to 15 job descriptions. Note the skills mentioned repeatedly. Those are your priority.\n\nStep 2 — Build depth, not breadth. Two or three strong, relevant skills beat fifteen half-finished certifications. Build real projects. Use freeCodeCamp, NPTEL, or Coursera audit mode to learn without spending much.\n\nStep 3 — Apply strategically. Target 20 to 30 companies where you have researched the product and team. Customize your resume for each role. Apply on Naukri, LinkedIn, GreatHire, Internshala, and Cutshort. One warm referral is worth twenty cold applications.\n\nStep 4 — Track and improve. Keep a spreadsheet of applications, interview stages, and feedback. Act on every piece of feedback within 48 hours. The freshers who land jobs fastest are the ones who treat each rejection as data, not defeat.\n\nThe IT industry in India is growing fast, and with the right focus and preparation, freshers have a genuine shot at building a rewarding tech career in 2026. Start with one role, build deliberately, and apply with intention.\n\nExplore fresher-friendly IT job opportunities across India on GreatHire.in.",
      image: "/networking_bg.webp",
    },
     {
      id: 5,
      title: "How to Get a Job as a Fresher Without Experience",
      subtitle: "A Step-by-Step Guide",
      category: "Career Advice",
      date: "May 06, 2026",
      description:
        "Looking for IT jobs for freshers in 2026? You're not alone — and you're in the right place. India's tech sector is adding thousands of entry-level roles this year across software development, data analytics, cloud, cybersecurity, and AI. But knowing which role to target, and how to actually land it, makes all the difference.\n\nIndia's IT industry is projected to cross $300 billion in revenue by 2026, driven by cloud adoption, AI integration, and digital transformation across banking, retail, and government. Companies like Infosys, TCS, Wipro, and hundreds of product startups are actively hiring freshers. The market is real — but it rewards candidates who have built relevant skills and understand the role they're applying for.\n\nHere are the Top 10 IT Jobs for Freshers in India that are actively hiring in 2026:\n\n1. Junior Software Developer — The most sought-after fresher IT job in India. You write, test, and maintain code as part of a product or services team. Python, Java, or JavaScript are the most in-demand languages. Starting salaries range from ₹3.5 to ₹6 LPA, with high demand in Bangalore, Hyderabad, and Pune.\n\n2. Data Analyst — One of the fastest-growing entry-level IT jobs in India in 2026. You help businesses make decisions using data. SQL, Excel, Python, and tools like Power BI or Tableau are key. Freshers can expect ₹3 to ₹5.5 LPA, with strong demand in fintech, e-commerce, and consulting.\n\n3. Manual QA / Software Tester — Underrated but consistently in demand. If you are detail-oriented and systematic, this is one of the easiest IT jobs for freshers to break into, with a clear growth path toward automation testing. Starting salaries range from ₹2.5 to ₹4.5 LPA.\n\n4. Cloud Support Associate — Cloud is everywhere in 2026. Companies need freshers who understand AWS, Azure, or Google Cloud basics. A free cloud certification like AWS Cloud Practitioner significantly boosts your chances. Entry-level CTC ranges from ₹3 to ₹5 LPA.\n\n5. Cybersecurity Analyst (Trainee) — India faces a genuine shortage of cybersecurity professionals, making this one of the most promising IT careers for freshers in 2026. Knowledge of networking basics, ethical hacking fundamentals, and tools like Wireshark can get you in. Starting packages range from ₹3.5 to ₹6 LPA.\n\n6. Frontend Web Developer — A portfolio-driven role where your GitHub and live projects matter more than your degree. If you can build clean, responsive websites using HTML, CSS, JavaScript, and React, companies will hire you. Entry-level salaries range from ₹3 to ₹5.5 LPA.\n\n7. Technical Support Engineer — Often dismissed, but strategically smart. You learn the product deeply, build client-facing communication skills, and many support engineers transition into product, dev, or sales roles within two years. Freshers can earn ₹2.5 to ₹4 LPA.\n\n8. DevOps Trainee — A steep learning curve, but DevOps salaries grow fast. Skills in Linux, Docker, CI/CD pipelines, and Git are key. If you prefer infrastructure over writing application code, this path is worth exploring. Starting CTC ranges from ₹3.5 to ₹6 LPA.\n\n9. AI / ML Trainee — The hottest category in IT jobs for freshers in 2026. Entry-level roles focus on data preparation, model testing, and building simple pipelines. Python and statistics are your minimum entry ticket. Freshers can earn ₹4 to ₹7 LPA.\n\n10. Business Analyst (IT / Tech) — You bridge the gap between tech teams and business stakeholders. Strong communication plus basic SQL and JIRA knowledge makes you a solid BA candidate right out of college. This role is also open to non-CS backgrounds. Starting salaries range from ₹3 to ₹5 LPA.\n\nHow to Land Your First IT Job in India (Step-by-Step):\n\nStep 1 — Pick one target role and research it deeply. Read 10 to 15 job descriptions. Note the skills mentioned repeatedly. Those are your priority.\n\nStep 2 — Build depth, not breadth. Two or three strong, relevant skills beat fifteen half-finished certifications. Build real projects. Use freeCodeCamp, NPTEL, or Coursera audit mode to learn without spending much.\n\nStep 3 — Apply strategically. Target 20 to 30 companies where you have researched the product and team. Customize your resume for each role. Apply on Naukri, LinkedIn, GreatHire, Internshala, and Cutshort. One warm referral is worth twenty cold applications.\n\nStep 4 — Track and improve. Keep a spreadsheet of applications, interview stages, and feedback. Act on every piece of feedback within 48 hours. The freshers who land jobs fastest are the ones who treat each rejection as data, not defeat.\n\nThe IT industry in India is growing fast, and with the right focus and preparation, freshers have a genuine shot at building a rewarding tech career in 2026. Start with one role, build deliberately, and apply with intention.\n\nExplore fresher-friendly IT job opportunities across India on GreatHire.in.",
      image: "/networking_bg.webp",
    },
  ];

  const blog = blogs.find((b) => b.id === Number(id));
  const currentBlog = blog || blogs[0];

  // ❌ Blog not found
  if (id && !blog) {
    return (
      <>
        <Helmet>
          <title>GreatHire - Blog Not Found</title>
        </Helmet>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-300">
          <p className="text-xl font-bold text-gray-900 dark:text-white">Blog not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // 🔁 Detail View (matches TheFuture layout)
  if (id) {
    return (
      <>
        <Helmet>
          <title>GreatHire - {currentBlog.title}{currentBlog.subtitle}</title>
          <meta name="description" content={currentBlog.description.slice(0, 160)} />
        </Helmet>

        <Navbar />

        <section className="max-w-6xl mx-auto px-4 py-12 mt-10 bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
          {/* Hero Image */}
          <div className="relative w-full h-96 sm:h-[400px] overflow-hidden rounded-xl shadow-lg">
            <img
              src={currentBlog.image}
              alt={currentBlog.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => (e.target.src = "/bannerImage2.png")}
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
            {currentBlog.title}
            <span className="text-green-600 dark:text-green-400">{currentBlog.subtitle}</span>
          </h1>

          {/* Description split into paragraphs */}
          {currentBlog.id === 4
            ? currentBlog.description.split("\n\n").map((para, index) => (
              <p key={index} className="mt-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {para}
              </p>
            ))
            : currentBlog.description.split(". ").map((para, index) => (
              <p key={index} className="mt-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {para}.
              </p>
            ))
          }

          {/* Key Highlights / Callout Box */}
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-400 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              Key Takeaways
            </h2>
            <ul className="list-disc list-inside text-gray-800 dark:text-gray-300">
              {currentBlog.id === 4 ? (
                <>
                  <li>India's IT sector offers 10+ high-demand entry-level roles for freshers.</li>
                  <li>Cloud, AI/ML, and Cybersecurity roles offer the highest starting salaries.</li>
                  <li>Certifications (AWS, CCNA, CEH) significantly boost employability.</li>
                  <li>Build a portfolio and practice coding to stand out in the job market.</li>
                  <li>Use GreatHire.in to find curated IT job listings tailored for freshers.</li>
                </>
              ) : (
                <>
                  <li>Prepare thoroughly and research the company before interviews.</li>
                  <li>Follow structured response methods like STAR for clarity.</li>
                  <li>Post-interview follow-ups reinforce professionalism and interest.</li>
                  <li>Top companies actively seek talent in AI, cloud, and engineering.</li>
                </>
              )}
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back
            </button>
            {currentBlog.id < blogs.length && (
              <button
                onClick={() => navigate(`/CareerAdvice/${currentBlog.id + 1}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </section>

        <Footer />
      </>
    );
  }

  // 📋 Blog List View
  return (
    <>
      <Helmet>
        <title>GreatHire Blogs</title>
      </Helmet>

      <Navbar />

      <section className="py-16 px-4 bg-white dark:bg-gray-950 transition-colors duration-300 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Blogs</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Discover our latest and featured blogs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.id}`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-56 w-full object-cover"
                  loading="lazy" />

                <div className="p-6">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{blog.category}</span>

                  <h3 className="text-xl font-bold mt-2 text-gray-900 dark:text-white">
                    {blog.title}
                    <span className="text-green-600 dark:text-green-400">{blog.subtitle}</span>
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mt-3">{blog.description.slice(0, 100)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BlogPage;
