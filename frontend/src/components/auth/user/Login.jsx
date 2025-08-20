import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to manage the form data for email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State to manage the OTP data
  const [otpData, setOtpData] = useState({
    otp: "",
  });

  // State to toggle the visibility of the OTP input field
  const [showOtpInput, setShowOtpInput] = useState(false);

  // State for loading
  const [loading, setLoading] = useState(false);

  // Handle changes for both email/password and OTP inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      setOtpData({ ...otpData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handler for the "Sign Up" link click
  const handleSignUpClick = () => {
    navigate("/signup-choice");
  };

  // Handler to show the OTP input field
  const handleOtpClick = () => {
    setShowOtpInput(!showOtpInput);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showOtpInput) {
        // Handle OTP login
        // Make an API call to verify the OTP and email
                const response = await axios.post(
          `${USER_API_END_POINT}/verify-otp`,
          {
            email: formData.email,
            otp: otpData.otp,
          }
        );


        if (response?.data?.success) {
          toast.success(response.data.message);
          dispatch(setUser(response.data.user));
          navigate("/profile");
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Handle password login
        // Make an API call to log in with email and password
        const response = await axios.post(
                `${USER_API_END_POINT}/login`,
                { ...formData },
                { withCredentials: true }
              );

        if (response?.data?.success) {
          toast.success(response.data.message);
          dispatch(setUser(response.data.user));
          navigate("/profile");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      console.error("Error in login:", err);
      toast.error(err?.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4 flex-grow bg-gradient-to-b from-white to-blue-300 my-10 font-sans">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Great<span className="text-blue-600">Hire</span>
        </h1>
        <h2 className="text-2xl font-semibold mt-2 text-center">User Login</h2>
        <p className="text-sm text-gray-500 mt-1 text-center">
          Find the job made for you!
        </p>
        <p className="mt-4 text-sm text-blue-600 text-center">
          Don't have an account?{" "}
          <span
            onClick={handleSignUpClick}
            className="cursor-pointer underline font-semibold"
          >
            Sign Up
          </span>
        </p>

        <form
          className="space-y-4 mt-6 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          {!showOtpInput ? (
            <>
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="mail@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="mail@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  required
                />
              </div>
              {/* OTP Input */}
              <div>
                <label
                  htmlFor="otp"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otpData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                  required
                />
              </div>
            </>
          )}

          <p className="text-blue-600 text-sm cursor-pointer hover:underline text-right"
            onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </p>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
              loading ? "cursor-not-allowed bg-blue-400" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="mt-4 text-blue-600 text-sm cursor-pointer hover:underline"
          onClick={handleOtpClick}
        >
          {showOtpInput ? "Login with Password?" : "Login with OTP?"}
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;