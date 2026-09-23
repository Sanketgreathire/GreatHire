// Import necessary modules and components
import React, { useEffect, useState } from "react";

// Import hooks for handling URL parameters and navigation
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// Import image for UI
import img5 from "../assets/webp/img5.webp";

// Import navigation bar component
import Navbar from "@/components/shared/Navbar";

// Import footer component
import Footer from "@/components/shared/Footer";

// Import axios for making API requests
import axios from "axios";

// Import toast for notifications
import { toast } from "react-hot-toast";

// Import API endpoints
import {
  USER_API_END_POINT,
  VERIFICATION_API_END_POINT,
} from "@/utils/ApiEndPoint";

// Import loading component
import Loading from "@/components/Loading";

// Import pageNotFound component
import PageNotFound from "./PageNotFound";

import { Helmet } from "react-helmet-async";
import { useTheme } from "@/context/ThemeContext";

// ResetPassword Component - Allows users to reset their password using a token
const ResetPassword = () => {
  const themeContext = useTheme();

  // State to track page status
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  // Extract token from URL parameters
  const { token } = useParams();

  // State to store decoded token data
  const [decoded, setDecodeData] = useState(null);

  // State for new password input
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State for confirm password input
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // Ensure dark mode is active on html root
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    if (themeContext?.setTheme) {
      themeContext.setTheme("dark");
    }
  }, []);

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
        } else {
          toast.error(response.data.message || "Reset link is invalid or expired.");
          setStatus("page not found");
        }
      } catch (err) {
        console.log(`Error in token verification: ${err}`);
        const errMsg = err.response?.data?.message || "Reset link is invalid or has expired.";
        toast.error(errMsg);
        setStatus("page not found"); // Set status to error if verification fails
      }
    };

    if (token) verifyToken(); // Call verification function if token exists
    else navigate("/"); // Redirect to home if token is missing
  }, [token]);

  // Function to determine login redirect path based on user role
  const getLoginPath = () => {
    const role = (decoded?.role || "").toLowerCase();
    if (role === "recruiter") {
      return "/recruiter-login";
    }
    return "/jobseeker-login";
  };

  // Function to handle password reset submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

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
          token, // Send token for fallback resolution
          newPassword: password, // Send new password
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Password reset successfully!"); // Show success message
        navigate(getLoginPath()); // Redirect to correct login page
      } else {
        toast.error(response.data.message || "Failed to reset password."); // Show error message if reset fails
      }
    } catch (err) {
      console.error("Error in resetting password:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Reset Password | GreatHire's Secure Account Recovery
        </title>

        <meta
          name="description"
          content="With the platform's headquarters located in Hyderabad state and constructed on contemporary security standards, you can safely reset your GreatHire account password using our verified recovery process. With the help of a secure token-based verification system, users can establish a new password on this reset password page, guaranteeing the highest level of account security and data protection. To verify reset links, stop illegal access, and provide a seamless recovery process, GreatHire adheres to stringent authentication procedures. This procedure guarantees continuous platform utilization, whether you are a recruiter viewing dashboards or a job seeker managing applications. Account recovery is quick and easy because to the interface's optimization for speed, clarity, and mobile responsiveness. GreatHire upholds performance, privacy, and confidence at every stage with secured workflows and dependable redirection."
        />
      </Helmet>

      {/* Show loading indicator while verifying token */}
      {status === "loading" && (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <Loading color="blue-600" />
        </div>
      )}

      {/* Show in-page dark mode card if token is invalid or expired */}
      {status === "page not found" && (
        <>
          <Navbar />
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-gray-900 via-slate-900 to-gray-800 text-white px-4 py-16">
            <div className="w-full max-w-md p-8 bg-slate-800/90 border border-gray-700/80 rounded-2xl shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto text-3xl">
                ⚠️
              </div>
              <h2 className="text-2xl font-bold text-white">
                Reset Link Expired or Invalid
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                This password reset link is invalid, has expired, or has already been used. For your account security, password reset links can only be used once and expire after 1 hour.
              </p>
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                >
                  Request New Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => navigate(getLoginPath())}
                  className="w-full py-2.5 px-4 bg-transparent hover:bg-slate-700 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-200 text-sm"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}

      {/* Show reset password form if token is valid */}
      {status === "valid token" && (
        <>
          <Navbar />

          <div className="flex flex-row md:flex-row-reverse items-center bg-gradient-to-tl from-gray-900 via-slate-900 to-gray-800 min-h-screen text-white">
            {/* Left Side - Background Image */}
            <div className="hidden md:flex w-full md:w-2/3 items-center justify-center p-8">
              <img
                src={img5}
                alt="Reset Password Illustration"
                className="w-full max-h-[550px] object-contain opacity-75"
              />
            </div>

            {/* Right Side - Reset Password Form */}
            <div className="w-full md:w-1/3 p-8 flex flex-col space-y-4 max-w-md mx-auto md:mx-0">
              {/* Branding and title */}
              <h1 className="text-3xl font-bold text-center text-white">
                Great<span className="text-blue-400">Hire</span>
              </h1>
              <h3 className="text-2xl font-bold text-white text-center mb-6">
                Reset Password
              </h3>
              <p className="text-gray-300 text-center mb-4">
                Enter your new password below to reset it.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Input Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200"
                  >
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password (min length 8)"
                      className="mt-1 block w-full px-4 py-2.5 pr-11 border border-gray-700 bg-slate-800 text-white placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="mt-1 block w-full px-4 py-2.5 pr-11 border border-gray-700 bg-slate-800 text-white placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              {/* Navigation back to login page */}
              <div className="text-center mt-6">
                <p
                  className="text-blue-400 hover:text-blue-300 hover:underline text-sm cursor-pointer transition-colors"
                  onClick={() => navigate(getLoginPath())}
                >
                  Back to Login
                </p>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

// Export component for use in the application
export default ResetPassword;
