// Import necessary modules and dependencies
// Import React and useState hook for component state management
import React, { useState } from "react";

// Hook for programmatic navigation
import { useNavigate } from "react-router-dom"; 

// Import background image for the page
import img4 from "../assets/img4.png"; 

// Import navigation bar component
import Navbar from "@/components/shared/Navbar"; 

// Import footer component
import Footer from "@/components/shared/Footer";

// Import Axios for making API requests
import axios from "axios"; 

// Import toast notifications for user feedback
import { toast } from "react-hot-toast";

// Import API endpoint for user operations
import { USER_API_END_POINT } from "@/utils/ApiEndPoint"; 

// ForgotPassword component allows users to request a password reset link
const ForgotPassword = () => {

  // Initialize navigation hook
  const navigate = useNavigate(); 

  // State for storing user email input
  const [email, setEmail] = useState(""); 

  // State for tracking loading status
  const [loading, setLoading] = useState(false); 

  // Function to handle form submission and send reset link request
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      setLoading(true); // Set loading state to true during API call
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        {
          email,
        }
      );

      // Show success or error message based on API response
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(`Error in sending password reset link: ${err}`);
    } finally {
      setLoading(false); // Reset loading state after API call
    }
  };

  return (
    <>
      <Navbar /> {/* Display the navigation bar */}

      {/* Main container for the forgot password page */}
      <div className="flex flex-row md:flex-row-reverse items-center bg-gradient-to-tl from-white to-blue-100 h-screen">
        
        {/* Left Side - Background Image */}
        <div className="hidden md:block w-full md:w-2/3">
          <img
            src={img4}
            alt="Forgot Password Illustration"
            className="w-full h-full object-cover opacity-70"
          />
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="w-full md:w-1/3 p-8 flex flex-col space-y-4">
          {/* Branding and title */}
          <h1 className="text-3xl font-bold text-center">
            Great<span className="text-blue-700">Hire</span>
          </h1>
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Forgot Password
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Enter your email address below and we'll send you a link to reset
            your password.
          </p>

          {/* Forgot password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            {/* Submit button with loading state */}
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Navigation back to login page */}
          <div className="text-center mt-6">
            <p
              className="text-blue-600 text-sm cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </p>
          </div>
        </div>
      </div>

      <Footer /> {/* Display the footer */}
    </>
  );
};

export default ForgotPassword; // Export the component

