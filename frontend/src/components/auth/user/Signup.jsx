import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../../../assets/img1.png";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "@/components/GoogleLogin";
import { google_client_id } from "../../../utils/GoogleOAuthCredentials.js";
import axios from "axios";
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Update state when input fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        {
          ...formData,
          role: "student",
        }
      );

      // Show success message
      toast.success(response.data.message);

      // Reset form fields
      setFormData({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
      });

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      // Show error message
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section - Background Image and Content */}
      <div className="relative w-full md:w-2/3 h-1/2 md:h-full">
        <img
          src={img1}
          alt="Image 1"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="font-bold text-3xl md:text-4xl">
            Find the job made for you.
          </h1>
          <p className="font-medium text-gray-800 text-md md:text-lg w-4/5 md:w-3/5">
            Browse over 150K jobs at top companies.
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-gradient-to-r from-white to-blue-100">
        <form className="w-4/5 space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center">
            Great<span className="text-blue-700">Hire</span>
          </h1>
          <h1 className="text-4xl font-bold text-center">Create Account</h1>
          <h1 className="text-md font-semibold text-gray-500 text-center">
            Find your next opportunity!
          </h1>
          {/* Google Sign up Button */}
          <GoogleOAuthProvider clientId={google_client_id}>
            <GoogleLogin text="Sign up" role="student" />
          </GoogleOAuthProvider>
          <h1 className="text-sm font-semibold text-gray-400 text-center">
            ---- or Sign up with email ----
          </h1>
          <div className="flex flex-col space-y-2">
            <label className="font-bold">Full Name</label>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <label className="font-bold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="mail@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <label className="font-bold">Mobile Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Contact number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <label className="font-bold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="min 8 characters"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create Account
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;