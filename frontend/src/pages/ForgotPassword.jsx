import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img4 from "../assets/webp/img4.webp";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@/context/ThemeContext";

// ForgotPassword component allows users to request a password reset link
const ForgotPassword = () => {
  const themeContext = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Ensure dark mode matches the reset password page
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    if (themeContext?.setTheme) {
      themeContext.setTheme("dark");
    }
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Function to handle form submission and send / resend reset link request
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email || !email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email: email.trim() }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Password reset link sent! Check your inbox.");
        setEmailSent(true);
        setResendTimer(60);
      } else {
        toast.error(response.data.message || "Unable to send password reset link.");
      }
    } catch (err) {
      console.error(`Error in sending password reset link:`, err);
      const errorMessage =
        err.response?.data?.message ||
        "Unable to connect to server. Please ensure the backend server is running.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Forgot Password | Safely Reset Your GreatHire Account
        </title>
        <meta
          name="description"
          content="Our forgotten password site makes it simple to secure your GreatHire account. With its headquarters located in Hyderabad, the platform facilitates hassle-free access restoration for customers throughout India. By entering their registered email address and promptly obtaining a secure reset link, this page is intended to assist applicants in safely changing their passwords. To guarantee a reliable job search experience, GreatHire places a high priority on user data protection, privacy, and seamless authentication. Our password recovery procedure is easy, quick, and dependable whether you are actively looking for jobs, maintaining your profile, or monitoring applications. Professionals, recent graduates, and recruiters across the country may have a smooth experience with the platform, which is geared for both desktop and mobile users. GreatHire ensures that every account is secure at every stage by adhering to contemporary security procedures and compliance regulations."
        />
      </Helmet>

      <Navbar />

      {/* Main container for the forgot password page with sleek dark mode styling */}
      <div className="flex flex-row md:flex-row-reverse items-center bg-gradient-to-tl from-gray-900 via-slate-900 to-gray-800 min-h-screen text-white">

        {/* Left Side - Background Image */}
        <div className="hidden md:flex w-full md:w-2/3 items-center justify-center p-8">
          <img
            src={img4}
            alt="Forgot Password Illustration"
            className="w-full max-h-[550px] object-contain opacity-75"
          />
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="w-full md:w-1/3 p-8 flex flex-col space-y-4 max-w-md mx-auto md:mx-0">
          {/* Branding and title */}
          <h1 className="text-3xl font-bold text-center text-white">
            Great<span className="text-blue-400">Hire</span>
          </h1>
          <h3 className="text-2xl font-bold text-white text-center mb-2">
            Forgot Password
          </h3>
          <p className="text-gray-300 text-center mb-4 text-sm">
            Enter your registered email address below and we'll send you a secure link to reset your password.
          </p>

          {emailSent && (
            <div className="p-3 bg-blue-900/30 border border-blue-500/40 rounded-lg text-sm text-blue-200 text-center">
              Password reset link sent to <span className="font-semibold text-white">{email}</span>. Please check your inbox and spam folder.
            </div>
          )}

          {/* Forgot password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
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
                className="mt-1 block w-full px-4 py-2.5 border border-gray-700 bg-slate-800 text-white placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            {/* Submit / Resend button with loading and cooldown states */}
            <button
              type="submit"
              disabled={loading || (emailSent && resendTimer > 0)}
              className={`w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
                (loading || (emailSent && resendTimer > 0)) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading
                ? "Sending..."
                : emailSent
                ? resendTimer > 0
                  ? `Resend link in ${resendTimer}s`
                  : "Resend Reset Link"
                : "Send Reset Link"}
            </button>
          </form>

          {/* Navigation back to login page */}
          <div className="text-center mt-6">
            <p
              className="text-blue-400 hover:text-blue-300 hover:underline text-sm cursor-pointer transition-colors"
              onClick={() => navigate("/jobseeker-login")}
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

