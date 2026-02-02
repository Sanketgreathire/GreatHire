import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

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
      image: "/interview_tips_01.png",
    },
    {
      id: 2,
      title: "Post-Interview",
      subtitle: " Follow-Up",
      category: "Interview Tips",
      date: "Jan 18, 2025",
      description:
        "Sending a thank-you email within 24 hours of an interview demonstrates professionalism and reaffirms your interest in the position. This simple yet powerful gesture shows appreciation for the interviewer’s time and leaves a positive, lasting impression. It also reinforces your enthusiasm for the role and highlights your strong communication skills.A well-written follow-up email provides an excellent opportunity to briefly restate your key qualifications and connect them to the requirements of the job. You can reference a specific topic discussed during the interview to personalize your message, which helps you stand out from other candidates. This approach shows attentiveness and genuine engagement with the conversation.",
      image: "/interview_tips_02.png",
    },
    {
      id: 3,
      title: "Top Companies Hiring",
      subtitle: " in 2025",
      category: "Company Insights",
      date: "Jan 25, 2025",
      description:
        "In 2025, major international corporations such as Amazon, Google, Microsoft, and GE Aerospace are expanding significantly, creating a wide range of job opportunities across multiple industries. These organizations are actively hiring talent in areas like software development, artificial intelligence, cloud computing, data analytics, aerospace engineering, supply chain management, and digital marketing to support innovation and global growth.Technology companies continue to lead hiring trends, with a strong focus on AI-driven solutions, automation, cybersecurity, and cloud infrastructure. Meanwhile, aerospace and manufacturing giants are investing heavily in research, sustainability, and advanced engineering, opening doors for skilled professionals in both technical and managerial roles.",
      image: "/company_insight_01.png",
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
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl font-bold">Blog not found</p>
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
          <title>GreatHire - {currentBlog.title}</title>
          <meta name="description" content={currentBlog.description.slice(0, 160)} />
        </Helmet>

        <Navbar />

        <section className="max-w-6xl mx-auto px-4 py-12 mt-10">
          {/* Hero Image */}
          <div className="relative w-full h-96 sm:h-[400px] overflow-hidden rounded-xl shadow-lg">
            <img
              src={currentBlog.image}
              alt={currentBlog.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/bannerImage2.png")}
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mt-8 mb-4 text-gray-900">
            {currentBlog.title}
            <span className="text-green-600">{currentBlog.subtitle}</span>
          </h1>

          {/* Description split into paragraphs */}
          {currentBlog.description.split(". ").map((para, index) => (
            <p key={index} className="mt-4 text-gray-700 text-lg leading-relaxed">
              {para}.
            </p>
          ))}

          {/* Key Highlights / Callout Box */}
          <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
              Key Takeaways
            </h2>
            <ul className="list-disc list-inside text-gray-800">
              <li>Prepare thoroughly and research the company before interviews.</li>
              <li>Follow structured response methods like STAR for clarity.</li>
              <li>Post-interview follow-ups reinforce professionalism and interest.</li>
              <li>Top companies actively seek talent in AI, cloud, and engineering.</li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              ← Back
            </button>
            <button
              onClick={() => navigate(`/CareerAdvice/${currentBlog.id + 1}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next →
            </button>
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

      <section className="py-16 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Our Blogs</h2>
            <p className="text-gray-600 mt-2">Discover our latest and featured blogs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden"
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-56 w-full object-cover"
                />

                <div className="p-6">
                  <span className="text-sm text-blue-600 font-semibold">{blog.category}</span>

                  <h3 className="text-xl font-bold mt-2">
                    {blog.title}
                    <span className="text-green-600">{blog.subtitle}</span>
                  </h3>

                  <p className="text-gray-600 mt-3">{blog.description.slice(0, 100)}...</p>
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
