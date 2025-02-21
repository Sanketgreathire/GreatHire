import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Success = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center transform transition duration-700 ease-in-out animate-fadeIn">
          <DotLottieReact
            src="https://lottie.host/bf8c1194-fd41-420e-86bf-daf6d286d278/DBE1qCSi50.lottie"
            loop
            autoplay
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Job Applied Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Great Hire responds to you as soon as possible.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
          >
            Return to Job Search
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
