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
        "Making a good impression during an interview requires careful preparation. Examine the organization and position to learn about its objectives, principles, and standards; rehearse your answers to frequently asked interview questions; and use the STAR (Situation, Task, Action, Result) method to showcase your abilities and accomplishments. GreatHire.in offers professional advice, tools for interview preparation, and access to pertinent career prospects to support candidates at every stage. This will help you perform successfully, make an impression on employers, and land your dream job.",
      image: "/interview_tips_01.png",
    },
    {
      id: 2,
      name: "Post-Interview Follow-Up",
      category: "Interview Tips",
      description:
        "It shows professionalism and reaffirms your interest in the job to send a thank-you email within 24 hours of the interview. In order to make a good and lasting impression on the employer, a well-written follow-up message also offers the chance to restate important qualifications, emphasize your appropriateness for the position, and respectfully ask about the next steps or hiring timeframe.",
      image: "/interview_tips_02.png",
    },
    {
      id: 3,
      name: "Common Interview Questions",
      category: "Interview Tips",
      description:
        "Candidates can comfortably and successfully react to frequently asked interview questions, such as 'Tell me about yourself,' 'Why do you want to work here?' and 'What are your strengths and weaknesses?' Candidates can show self-awareness, clearly communicate their abilities, experiences, and goals, and make a good impression on interviewers by anticipating these inquiries.",
      image: "/interview_tips_03.png",
    },
    {
      id: 4,
      name: "Top Companies Hiring in 2025",
      category: "Company Insights",
      description:
        "In 2025, major international corporations like Amazon, Google, and GE Aerospace are expanding significantly and providing a variety of professional options. You may stay up to date on the most recent job openings—including remote and flexible employment—by using GreatHire.in. This allows you to investigate positions that fit your talents, career objectives, and preferred work schedules.",
      image: "/company_insight_01.png",
    },
    {
      id: 5,
      name: "Industry Trends",
      category: "Company Insights",
      description:
        "AI-driven automation, sustainable business practices, and the quick growth of remote and hybrid work models are examples of emerging trends in a variety of industries. Businesses are concentrating more on cybersecurity, digital transformation, and the use of cutting-edge technologies that boost productivity, safeguard data, and spur creativity in order to stay competitive in this changing environment. Organizations and professionals looking to match their talents with future prospects must keep an eye on these trends.",
      image: "/company_insight_02.png",
    },
    {
      id: 6,
      name: "Development Programs",
      category: "Company Insights",
      description:
        "Prominent companies actively fund training, mentorship, and upskilling initiatives to support staff development and advancement. In addition to improving workforce skills, initiatives like technical certifications, leadership development courses, and ongoing education also boost engagement, productivity, and employee retention. By placing a high priority on employee development, businesses build a workforce that is capable, driven, and prepared for the future, all of which contribute to long-term organizational success.",
      image: "/company_insight_03.png",
    },
  ];

  const product = productItems.find((item) => item.id === Number(id));
  const currentProduct = product || productItems[0];

  // Navigation for next/prev
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
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl font-bold">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
        <meta
          name="description"
          content={currentProduct.description.slice(0, 160)}
        />
      </Helmet>

      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-12 mt-10">
        {/* Hero Image */}
        <div className="relative w-full h-96 sm:h-[400px] overflow-hidden rounded-xl shadow-lg">
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/bannerImage2.png")}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mt-8 mb-4 text-gray-900">
          {currentProduct.name}
        </h1>

        {/* Description split into paragraphs */}
        {currentProduct.description.split(". ").map((para, index) => (
          <p key={index} className="mt-4 text-gray-700 text-lg leading-relaxed">
            {para}.
          </p>
        ))}

        {/* Key Highlights */}
        <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Key Takeaways
          </h2>
          <ul className="list-disc list-inside text-gray-800">
            <li>Prepare thoroughly for interviews and research the company.</li>
            <li>Follow structured methods like STAR to answer questions.</li>
            <li>Post-interview follow-ups enhance professionalism and interest.</li>
            <li>Stay updated on industry trends and top hiring companies.</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Go Back
          </button>
         
          <button
            onClick={() => navigate(`/ProductDetailPage/${nextProduct.id}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next →
          </button>
        </div>

        {/* Go Back Button */}
        {/* <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Go Back
          </button>
        </div> */}
      </section>

      <Footer />
    </>
  );
};

export default ProductDetailPage;
