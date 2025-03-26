import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img3 from "../../../assets/img3.png";
import { MdOutlineVerified } from "react-icons/md";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "@/components/GoogleLogin";
import { google_client_id } from "../../../utils/GoogleOAuthCredentials.js";
import { toast } from "react-hot-toast";
import axios from "axios";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { setUser } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
    setLoading(true); // Set loading to true
    try {
      const response = await axios.post(
        `${RECRUITER_API_END_POINT}/register`,
        {
          ...formData,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Show success message

        // Reset form fields
        setFormData({
          fullname: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
        dispatch(setUser(response.data.user)); // Set user in redux store
        // Redirect to login page
        navigate("/recruiter/dashboard/home");
      }
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      // Show error message
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col xl:flex-row flex-grow bg-gradient-to-b from-white to-blue-300">

        {/* Updated Left Section - Background Image and Content */}

        <div className="relative h-screen w-2/3 hidden xl:flex">

          {/* <img
            src={img3}
            alt="Image 1"
            className="w-full h-full object-cover  opacity-70"
          /> */}
          
          {/* Centered Content */}
        <div className="absolute inset-0 flex flex-col items-center text-center space-y-4 justify-center px-4 pt-10">
          <div className="mb-32 text-gray-900">
          <h2 className="text-2xl font-bold mb-2">Follow These <span className="text-blue-600">Simple Steps :</span>
          </h2>
                <ul className="text-lg md:text-lg font-semibold text-gray-900 space-y-2">
                  {[
                    "Create An Account",
                    "Create Your Company",
                    "Post Jobs",
                  ].map((step, index) => (
                    <li key={index} className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-lg">
                      <span className="text-blue-600 font-semibold text-lg">
                        {index + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative top-[-60px] flex flex-col items-center text-center space-y-4 px-4">
                <h1 className="font-semibold text-xl md:text-2xl text-gray-900">
                  Powerful recruiting tools to find your{" "}
                  <span className="text-gray-800">Perfect Team!</span>
                </h1>
                {[
                  "Post your job and source candidates.",
                  "Save time with intelligent applicant sorting.",
                  "Free built-in ATS to manage your pipeline.",
                  "Industry high 40% candidate response rate.",
                ].map((text, index) => (
                  <p key={index} className="flex items-center gap-2 font-semibold text-sm md:text-lg text-gray-800">
                    <MdOutlineVerified size={30} color="red" />
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>

        {/* Updated Right Section - Form */}
        <div className="w-full xl:w-1/3 flex justify-center py-8 mb-16">
          <form className="w-full max-w-md space-y-4 px-6" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center">
              Great<span className="text-blue-700">Hire</span>
            </h1>
            <h1 className="text-4xl font-bold text-center">Create Account</h1>
            <h1 className="text-md font-semibold text-gray-500 text-center">
              Where the best company find their teams
            </h1>
            {/* Google Sign up Button */}
            <GoogleOAuthProvider clientId={google_client_id}>
              <GoogleLogin text="Sign up" role="recruiter" route="recruiter" />
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
                value={formData.fullname}
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
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button when loading`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Log In
              </a>
            </p>
          </form>
          </div>

          {/* Steps Content for Small and Medium Screens */}
      <div className="w-full xl:hidden flex flex-col items-center text-center p-4 rounded-lg mt-4 sm:mt-6">
          <h1 className="font-bold text-3xl text-gray-900 mb-4">
            Follow These <span className="text-blue-600">Simple Steps</span>
          </h1>
          <ul className="text-lg font-semibold text-gray-800 space-y-3">
            {["Create An Account", "Create Your Company", "Post Jobs"].map((step, index) => (
              <li key={index} className="flex items-center gap-3 text-lg bg-white shadow-md px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-semibold text-2xl">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
      </div>
    </>
  );
};

export default Signup;
