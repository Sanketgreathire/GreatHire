// ProductDetailPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Helmet } from "react-helmet-async";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const productItems = [
    {
      id: 1,
      name: "Effective Job Interview Strategies",
      category: "Interview Tips",
      description:
        "Thorough preparation is the foundation of a successful job interview. Researching the company, understanding the role, and practicing responses using the STAR method — Situation, Task, Action, Result — allows candidates to present their experience with clarity and confidence. GreatHire.in provides expert guidance and interview preparation resources to help candidates perform at their best and make a lasting impression on employers.",
      image: "/interview_tips_01.webp",
    },
    {
      id: 2,
      name: "Post-Interview Follow-Up",
      category: "Interview Tips",
      description:
        "Sending a thoughtful thank-you email within 24 hours of an interview is a simple yet powerful way to reinforce your professionalism. A well-crafted follow-up message allows you to restate your key qualifications, reaffirm your enthusiasm for the role, and politely inquire about the next steps in the hiring process — leaving a positive and memorable impression on the employer.",
      image: "/interview_tips_02.webp",
    },
    {
      id: 3,
      name: "Common Interview Questions",
      category: "Interview Tips",
      description:
        "Preparing for commonly asked interview questions — such as 'Tell me about yourself,' 'Why do you want to work here?' and 'What are your strengths and weaknesses?' — gives candidates a significant advantage. Thoughtful, well-rehearsed answers demonstrate self-awareness and clear communication, helping candidates present their skills, experiences, and goals in a way that resonates with interviewers.",
      image: "/interview_tips_03.webp",
    },
    {
      id: 4,
      name: "Top Companies Hiring in 2025",
      category: "Company Insights",
      description:
        "In 2025, leading global organizations including Amazon, Google, and GE Aerospace are expanding their teams across technology, engineering, finance, and operations. Alongside these industry giants, fast-growing startups and mid-sized firms are actively recruiting in fields such as Artificial Intelligence, Data Science, and Cybersecurity. GreatHire.in provides real-time job updates and personalized recommendations to help you discover opportunities that align with your skills, career goals, and preferred work style.",
      image: "/company_insight_01.webp",
    },
    {
      id: 5,
      name: "Industry Trends",
      category: "Company Insights",
      description:
        "Emerging industry trends — including AI-driven automation, the rise of remote and hybrid work models, and a growing focus on sustainable business practices — are reshaping how organizations operate. Companies that invest in digital transformation and advanced technologies are better equipped to boost productivity, protect data, and foster innovation. Staying informed about these shifts is essential for professionals and organizations looking to remain competitive.",
      image: "/company_insight_02.webp",
    },
    {
      id: 6,
      name: "Development Programs",
      category: "Company Insights",
      description:
        "Leading organizations recognize that investing in employee development is key to long-term success. Through technical certifications, leadership training, mentorship programs, and continuous learning initiatives, companies equip their workforce with the skills needed to grow and adapt. A strong commitment to professional development not only enhances individual performance but also drives higher engagement, retention, and organizational resilience.",
      image: "/company_insight_03.webp",
    },
  ];

  const product = productItems.find((item) => item.id === Number(id));
  const currentProduct = product || productItems[0];

  const currentIndex = productItems.indexOf(currentProduct);
  const prevProduct = productItems[(currentIndex - 1 + productItems.length) % productItems.length];
  const nextProduct = productItems[(currentIndex + 1) % productItems.length];

  if (!product && id) {
    return (
      <>
        <Helmet>
          <title>GreatHire - Product Not Found</title>
        </Helmet>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-300">
          <p className="text-xl font-bold text-gray-900 dark:text-white">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>GreatHire - {currentProduct.name}</title>
        <meta name="description" content={currentProduct.description.slice(0, 160)} />
      </Helmet>

      <Navbar />

      <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors duration-300">
      <section className="max-w-6xl mx-auto px-4 py-12 mt-10">

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            {currentProduct.category}
          </span>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-96 sm:h-[400px] overflow-hidden rounded-xl shadow-lg">
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => (e.target.src = "/bannerImage2.png")}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
          {currentProduct.name}
        </h1>

        {/* Description split into paragraphs */}
        {currentProduct.description.split(". ").map((para, index) => (
          <p key={index} className="mt-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {para}.
          </p>
        ))}

        {/* Key Highlights */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-600 dark:border-blue-400 rounded-lg shadow transition-colors duration-300">
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
            Key Takeaways
          </h2>
          <ul className="list-disc list-inside text-gray-800 dark:text-gray-300 space-y-1">
            <li>Prepare thoroughly for interviews and research the company.</li>
            <li>Follow structured methods like STAR to answer questions.</li>
            <li>Post-interview follow-ups enhance professionalism and interest.</li>
            <li>Stay updated on industry trends and top hiring companies.</li>
            <li>Utilize resources like GreatHire.in for career guidance and job opportunities.</li>
            <li>Focus on continuous learning and development for career growth.</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded transition-colors duration-200"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate(`/ProductDetailPage/${nextProduct.id}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded transition-colors duration-200"
          >
            Next →
          </button>
        </div>
      </section>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;