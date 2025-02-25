// Import necessary modules and components
import React, { useEffect, useState } from "react";

// Import hooks for handling URL parameters and navigation
import { useParams, useNavigate } from "react-router-dom"; 

// Import image for UI
import img5 from "../assets/img5.png"; 

// Import axios for making API requests
import axios from "axios"; 

// Import toast for notifications
import { toast } from "react-hot-toast"; 

// Import API endpoints
import { USER_API_END_POINT, VERIFICATION_API_END_POINT } from "@/utils/ApiEndPoint";

// Import loading component
import Loading from "@/components/Loading"; 

// Import pageNotFound component
import PageNotFound from "./PageNotFound"; 

// ResetPassword Component - Allows users to reset their password using a token
const ResetPassword = () => {

  // State to track page status
  const [status, setStatus] = useState("loading"); 
  const navigate = useNavigate();

  // Extract token from URL parameters
  const { token } = useParams();
  
  // State to store decoded token data
  const [decoded, setDecodeData] = useState(null); 

  // State for new password input
  const [password, setPassword] = useState(""); 

  // State for confirm password input
  const [confirmPassword, setConfirmPassword] = useState(""); 

  // State for loading indicator
  const [loading, setLoading] = useState(false); 

  // Effect hook to verify the token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          `${VERIFICATION_API_END_POINT}/verify-token`,
          {
            token,
          }
        );
        if (response.data.success) {
          setDecodeData(response.data.decoded); // Store decoded token data
          setStatus("valid token"); // Set status to valid if token is verified
        }
      } catch (err) {
        console.log(`Error in token verification: ${err}`);
        setStatus("page not found"); // Set status to error if verification fails
      }
    };

    if (token) verifyToken(); // Call verification function if token exists
    else navigate("/"); // Redirect to home if token is missing
  }, [token]);

  // Function to handle password reset submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/reset-password`,
        {
          decoded, // Send decoded user data
          newPassword: password, // Send new password
        }
      );

      if (response.data.success) {
        toast.success(response.data.message); // Show success message
        navigate("/login"); // Redirect to login page
      } else {
        toast.error(response.data.message); // Show error message if reset fails
      }
    } catch (err) {
      console.error(`Error in resetting password: ${err}`);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      {/* Show loading indicator while verifying token */}
      {status === "loading" && <Loading color="blue-600" />}
      
      {/* Show 404 page if token is invalid */}
      {status === "page not found" && <PageNotFound />}
      
      {/* Show reset password form if token is valid */}
      {status === "valid token" && (
        <>
          <div className="flex flex-row md:flex-row-reverse bg-gradient-to-tl from-white to-blue-100 items-center justify-evenly">
            {/* Left Side - Image Section */}
            <div className="w-full md:w-1/2 h-screen p-10">
              <img
                src={img5}
                alt="Reset Password Illustration"
                className="w-full h-full object-cover opacity-70"
              />
            </div>

            {/* Right Side - Reset Password Form */}
            <div className="w-full px-8 md:w-1/3 flex flex-col space-y-4">
              <h1 className="text-3xl font-bold text-center">
                Great<span className="text-blue-700">Hire</span>
              </h1>
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Reset Password
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Enter your new password below to reset it.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Input Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (min length 8)"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                {/* Confirm Password Input Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Export component for use in the application
export default ResetPassword;

