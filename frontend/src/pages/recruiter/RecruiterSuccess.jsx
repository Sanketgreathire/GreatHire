import React from 'react'
import { FcCheckmark } from "react-icons/fc"; // Importing a checkmark icon for success indication
import Navbar from "@/components/shared/Navbar"; // Importing the Navbar component
import { Link } from "react-router-dom"; // Importing Link for navigation

export const RecruiterSuccess = () => {
  return (
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
  );
};

export default RecruiterSuccess