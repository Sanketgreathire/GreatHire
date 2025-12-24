import React from 'react'
import { FcCheckmark } from "react-icons/fc"; // Importing a checkmark icon for success indication
import Navbar from "@/components/shared/Navbar"; // Importing the Navbar component
import { Link } from "react-router-dom"; // Importing Link for navigation
import { Helmet } from 'react-helmet-async';

export const RecruiterSuccess = () => {
  return (
    <>
      <Helmet>
        <title>
          Registration Successful | Email Confirmation Sent – GreatHire
        </title>

        <meta
          name="description"
          content="Your recruiter registration on GreatHire has been completed successfully, and a confirmation email has been sent to your registered address. Operating from Hyderabad State, India, GreatHire is designed to ensure trust, security, and seamless onboarding, empowering recruiters to start hiring with confidence. Serving fast-growing companies, HR professionals, and startups, the platform offers reliable hiring solutions, intuitive dashboard access, and powerful recruiter tools built for speed and simplicity. Take the next step in your hiring journey, return to your dashboard, and connect with top talent through a trusted, efficient recruitment ecosystem."
        />
      </Helmet>

      <div>
        <Navbar />

        {/* Success Message */}
        <div className="flex flex-col items-center justify-center p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
            <div className="flex items-center gap-2 mb-4">
              <FcCheckmark className="text-2xl" />
              <p className="text-gray-700">
                You will get an email confirmation at{" "}
                <strong>abc123@gmail.com</strong>
              </p>
            </div>

            <div>
              <Link
                to="/recruiter/dashboard"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterSuccess