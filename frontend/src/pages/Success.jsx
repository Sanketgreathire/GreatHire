import React from "react";
import { FcCheckmark } from "react-icons/fc";
import Navbar from "../components/shared/Navbar";
import { Link } from "react-router-dom";

export const Success = () => {
  return (
    <div>
      <Navbar />

      {/* Success Message */}
      <div className="flex flex-col items-center justify-center p-6">
        {/* <img
          src="/Your-application.png"
          alt="Application Submitted"
          className="w-40 h-40 mb-6"
        /> */}

        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          <div className="flex items-center gap-2 mb-4">
            <FcCheckmark className="text-2xl" />
            <p className="text-gray-700">
              Job Applied Successfully.
            </p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <FcCheckmark className="text-2xl" />
            <p className="text-gray-700">
              <strong>Great Hre</strong> responds to you as soon as possible.
            </p>
          </div>

          <div>
            <Link
              to="/"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Return to job search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
