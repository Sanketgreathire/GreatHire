import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img3 from "../../../assets/img3.png";
import { MdOutlineVerified } from "react-icons/md";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "@/components/GoogleLogin";
import { google_client_id } from "../../../utils/GoogleOAuthCredentials.js";
import { toast } from "react-hot-toast";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

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
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        {
          ...formData,
          role: "recruiter",
        }
      );

      console.log(response);

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
      console.log(err);
      // Show error message
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen ">
      {/* Left Section - Background Image and Content */}
      <div className="relative w-full md:w-2/3 h-1/2 md:h-full">
        {/* Background Image */}
        <img
          src={img3}
          alt="Image 1"
          className="w-full h-full object-cover  opacity-70"
        />
        {/* Centered Content */}
        <div className="absolute inset-0 flex flex-col items-center text-center space-y-4 justify-center">
          <h1 className="font-semibold  m-4 p-2 rounded-xl  text-2xl md:text-3xl text-gray-500">
            Powerful recruiting tools to find your{" "}
            <span className="text-black"> Perfect Team!</span>
          </h1>
          <p className=" flex items-center gap-2 font-semibold  text-lg md:text-xl w-4/5 md:w-3/5  p-1 rounded-xl text-gray-600">
            <MdOutlineVerified size={35} color="red" />
            Post your job and source candidates.
          </p>
          <p className=" flex items-center gap-2 font-semibold  text-lg md:text-xl w-4/5 md:w-3/5  p-1 rounded-xl text-gray-600">
            <MdOutlineVerified size={35} color="red" />
            Save time with intelligent applicant sorting.
          </p>
          <p className=" flex items-center gap-2 font-semibold  text-lg md:text-xl w-4/5 md:w-3/5  p-1 rounded-xl text-gray-600">
            <MdOutlineVerified size={35} color="red" />
            Free built-in ATS to manage your pipeline.
          </p>
          <p className=" flex items-center gap-2 font-semibold  text-lg md:text-xl w-4/5 md:w-3/5  p-1 rounded-xl text-gray-600">
            <MdOutlineVerified size={35} color="red" />
            Industry high 40% candidate response rate.
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
            Where the best startups find their teams
          </h1>
          {/* Google Sign-Up Button */}
          {/* Google Sign up Button */}
          <GoogleOAuthProvider clientId={google_client_id}>
            <GoogleLogin text="Sign up" role="recruiter" />
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
            <label className="font-bold">Work Email</label>
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