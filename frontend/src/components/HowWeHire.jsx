import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
// imported helmet to apply customized meta tags
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const HowWeHirePage = () => {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      id: 1,
      number: "01",
      title: "Your Application",
      description:
        "Applicants are asked to use our online application platform. We carefully examine each application to assess credentials, pertinent experience, and fit with the objectives and values of our company. Through this procedure, we are able to find people who have both technical proficiency and a sincere desire to be a part of our team.",
      icon: "📝",
      color: "from-blue-500 to-blue-600",
      details: [
        "Complete the online application form",
        "Upload your resume and cover letter",
        "Share your portfolio or relevant work samples",
        "Tell us why you're excited about GreatHire",
      ],
    },
    {
      id: 2,
      number: "02",
      title: "Initial Screening",
      description:
        "Every application is carefully and thoroughly examined by our recruitment team. We thoroughly evaluate the candidate's credentials, pertinent experience, and abilities in light of the job requirements during this procedure. In order to guarantee a solid fit and long-term success inside the firm, we also assess alignment with our corporate values and culture.",
      icon: "🔍",
      color: "from-green-500 to-green-600",
      details: [
        "Resume and qualifications review",
        "Skills assessment matching",
        "Culture fit evaluation",
        "Initial shortlisting process",
      ],
    },
    {
      id: 3,
      number: "03",
      title: "Virtual Interview",
      description:
        "During a virtual interview, you will have the chance to showcase your abilities and expertise, participate in insightful conversations, ask questions, and learn more about the position, our team, and our corporate culture.",
      icon: "💻",
      color: "from-purple-500 to-purple-600",
      details: [
        "Video call with hiring manager",
        "Technical/behavioral questions",
        "Discuss your experience and goals",
        "Learn about team dynamics and projects",
      ],
    },
    {
      id: 4,
      number: "04",
      title: "Final Decision and Offer",
      description:
        "We carefully consider each applicant before making our final choice. A thorough offer package outlining the position, pay scale, benefits, and other pertinent employment information will be sent to successful applicants.",
      icon: "✅",
      color: "from-orange-500 to-orange-600",
      details: [
        "Final evaluation and decision",
        "Offer letter preparation",
        "Compensation and benefits details",
        "Contract negotiation and signing",
      ],
    },
    {
      id: 5,
      number: "05",
      title: "Onboarding",
      description:
        "Greetings from GreatHire! Our thorough onboarding approach is meant to give you the resources, tools, and assistance you need to be successful right away. We prioritize making sure you have a seamless transition into your new position and assisting you in blending in with our team and corporate culture.",
      icon: "🚀",
      color: "from-pink-500 to-pink-600",
      details: [
        "Welcome kit and equipment setup",
        "Team introductions and orientation",
        "Training and development programs",
        "Buddy system for first 30 days",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          GreatHire Blog | Career Guidance, Employment Patterns, and
          Perspectives on the Future of Work
        </title>

        <meta
          name="description"
          content="GreatHire Blog: Your one-stop destination for expert career advice, effective hiring strategies, and interview tips, along with guidance on resume optimization and the future of work. Our insight will help both job seekers and employers deal with the most competitive markets, be it AI-driven recruitment and remote work trends or preparing for an interview and upskilling. GreatHire is based in Hyderabad State, India, and serves businesses, recruiters, and professionals throughout the Hyderabad State region with innovative hiring solutions and career guidance."
        />
      </Helmet>

      <Navbar />
      <style>
        {`
          /* Background Image Parallax Effect */
          .bg-cover {
            transition: transform 0.3s ease;
          }

          section:hover .bg-cover {
            transform: scale(1.05);
          }

          /* Step Card Hover Animation */
          .step-card {
            transition: all 0.4s ease;
          }

          @media (hover: hover) {
            .step-card:hover {
              transform: translateY(-8px) scale(1.02);
            }
          }

          /* Number Circle Animation */
          .step-number {
            transition: all 0.3s ease;
          }

          @media (hover: hover) {
            .step-card:hover .step-number {
              transform: scale(1.15) rotate(5deg);
            }
          }

          /* Progress Line Animation */
          .progress-line {
            position: relative;
            overflow: hidden;
          }

          .progress-line::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent);
            animation: shimmer 2s infinite;
          }

          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          /* Icon Bounce Animation */
          .step-icon {
            animation: bounce 2s ease-in-out infinite;
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @media (hover: hover) {
            .step-card:hover .step-icon {
              animation: none;
              transform: scale(1.2);
            }
          }

          /* Details Slide In */
          .step-details {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease, opacity 0.3s ease;
            opacity: 0;
          }

          .step-details.active {
            max-height: 800px;
            opacity: 1;
          }

          /* Gradient Text Animation */
          @keyframes gradient-shift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          .gradient-text {
            background: linear-gradient(90deg, #3b82f6, #10b981, #3b82f6);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient-shift 3s ease infinite;
          }

          /* Mobile Responsive Adjustments */
          @media (max-width: 768px) {
            .step-card {
              border-radius: 1rem;
            }

            .step-number {
              width: 3rem;
              height: 3rem;
              font-size: 1rem;
            }

            .step-icon {
              font-size: 2rem;
            }

            .step-details.active {
              max-height: 600px;
            }
          }

          @media (max-width: 640px) {
            .step-number {
              width: 2.5rem;
              height: 2.5rem;
              font-size: 0.875rem;
            }

            .step-icon {
              font-size: 1.5rem;
            }

            .step-details.active {
              max-height: 500px;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen lg:min-h-[80vh] md:min-h-[75vh] sm:min-h-[60vh] mt-10">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20"
          style={{
            backgroundImage: "url(./971.webp)",
          }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/70 to-gray-800/80 dark:from-gray-950/90 dark:via-slate-900/80 dark:to-gray-900/90"></div>

        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-60 h-60 sm:w-96 sm:h-96 bg-blue-500 opacity-10 dark:opacity-5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 sm:w-96 sm:h-96 bg-green-500 opacity-10 dark:opacity-5 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:pt-20 lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            How We <span className="gradient-text">Hire</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
            Your journey at{" "}
            <span className="text-green-400 dark:text-green-300 font-semibold">GreatHire</span>{" "}
            starts with 5 steps!
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 dark:text-gray-500 max-w-2xl mx-auto px-2">
            "We've established an open, effective hiring procedure that honors
            your time and helps us locate the best applicant for our business."
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
        {/* Optional Background Pattern/Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-5 dark:opacity-3"
          style={{
            backgroundImage: "url(/pattern-background.jpg)",
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Steps Grid */}
          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connecting Line (except for last step) - Desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 top-full h-8 w-1 bg-gradient-to-b from-gray-300 dark:from-gray-700 to-transparent transform -translate-x-1/2 z-0"></div>
                )}

                {/* Step Card */}
                <div
                  className={`step-card relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl dark:shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    activeStep === step.id ? "ring-2 sm:ring-4 ring-blue-400 dark:ring-blue-500" : ""
                  }`}
                  onClick={() =>
                    setActiveStep(activeStep === step.id ? null : step.id)
                  }
                >
                  {/* Gradient Border Top */}
                  <div
                    className={`progress-line h-1 sm:h-2 bg-gradient-to-r ${step.color}`}
                  ></div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 lg:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
                      {/* Left: Number and Icon */}
                      <div className="lg:col-span-2 flex flex-col items-center lg:items-start gap-2 sm:gap-4">
                        <div
                          className={`step-number w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg`}
                        >
                          {step.number}
                        </div>
                        <div className="step-icon text-3xl sm:text-4xl">{step.icon}</div>
                      </div>

                      {/* Middle: Content */}
                      <div className="lg:col-span-7 col-span-1">
                        <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 transition-colors duration-300 text-center lg:text-left">
                          Step {step.id}: {step.title}
                        </h3>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-3 sm:mb-4 transition-colors duration-300 text-center lg:text-left">
                          {step.description}
                        </p>

                        {/* Details Dropdown */}
                        <div
                          className={`step-details ${activeStep === step.id ? "active" : ""}`}
                        >
                          <div className="mt-4 sm:mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-colors duration-300">
                            <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 transition-colors duration-300">
                              <span className="text-blue-500 dark:text-blue-400">ℹ️</span>
                              What to Expect:
                            </h4>
                            <ul className="space-y-2 sm:space-y-3">
                              {step.details.map((detail, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 sm:gap-3"
                                >
                                  <span className="text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0">✓</span>
                                  <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                    {detail}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Right: Action Button */}
                      <div className="lg:col-span-3 col-span-1 flex items-center justify-center lg:justify-end w-full lg:w-auto mt-3 sm:mt-0">
                        <button
                          className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                            activeStep === step.id
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {activeStep === step.id
                            ? "Hide Details"
                            : "Learn More"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Visual (Mobile) */}
          <div className="lg:hidden mt-8 sm:mt-12 flex justify-center overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 transition-all duration-300 ${
                      activeStep === step.id
                        ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-110`
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-4 sm:w-6 h-0.5 sm:h-1 bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-900 dark:to-green-900 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Are You Prepared to Begin Your Adventure?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 dark:text-blue-200 mb-6 sm:mb-8 px-2">
            Become a member of our team and contribute to something incredible.
            We can't wait to meet you!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Link
              to="/jobs"
              className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-blue-500/50 transition-all duration-300 text-sm sm:text-base inline-block text-center"
            >
              View Available Positions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowWeHirePage;