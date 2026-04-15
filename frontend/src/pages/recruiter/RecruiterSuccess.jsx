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
          Sucessful Registration | Email Confirmation Sent - GreatHire
        </title>

        <meta
          name="description"
          content="The process of registering as a recruiter on GreatHire has been successfully completed, and an alert email has been sent to your registered mail. Founded in the state of Hyderabad, in India, GreatHire is made to provide assurance, security, and smooth onboarding, so recruiters feel encouraged to start hiring immediately. With a focus on quickly expanding companies, HR professionals, and startups, the website provides a genuine hiring solution along with easy access to a recruiter dashboard. Move ahead in your hiring process and go back to your dashboard to connect with the brightest talent via a genuine hiring platform."
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