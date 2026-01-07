// Import necessary modules and dependencies
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

// Success component displayed after successfully applying for a job
const Success = () => {
  return (
    <>

      <Helmet>
        <title>Successful Submission of a Job Application | GreatHire's Next Step</title>
        <meta
          name="description"
          content="Read GreatHire’s Terms of Service and Privacy Policy to understand how our platform operates, how user data is collected and protected, and what responsibilities apply to job seekers and recruiters. Based in Hyderabad State, India, GreatHire is committed to transparency, ethical hiring practices, and compliance with global data protection laws such as GDPR and CCPA."
        />
      </Helmet>


      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center transform transition duration-700 ease-in-out animate-fadeIn">
            {/* Animated Success Illustration */}
            <DotLottieReact
              src="https://lottie.host/bf8c1194-fd41-420e-86bf-daf6d286d278/DBE1qCSi50.lottie"
              loop
              autoplay
            />

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Job Applied Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Great Hire responds to you as soon as possible.
            </p>

            {/* Button to Return to Job Search */}
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
            >
              Return to Job Search
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
