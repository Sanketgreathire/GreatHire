import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import user_video from "../../../assets/videos/user_video.mp4";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle account creation
 const handleCreateAccount = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post(
      `${USER_API_END_POINT}/register`,
      { ...formData },
      { withCredentials: true }
    );

    if (response?.data?.success) {
      toast.success("Account created successfully ✅");
      setFormData({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
      });
      dispatch(setUser(response.data.user));
      navigate("/profile");
    } else {
      toast.error(response?.data?.message || "Signup failed ❌");
    }
  } catch (err) {
    console.error("Error in signup:", err);
    // Show only backend / network error
    toast.error(err?.response?.data?.message || "Network error, please try again ❌");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-col xl:flex-row flex-grow bg-gradient-to-b from-white to-blue-300 pt-10">
          {/* Left Section */}
          <div className="relative h-screen w-2/3 hidden xl:flex items-center justify-center ">
            <div className="text-center p-10 rounded-lg">
              <h1 className="font-bold text-3xl text-gray-900 mb-6">
                Follow These <span className="text-blue-600">Simple Steps</span>
              </h1>
              <ul className="text-sm font-semibold text-gray-800 space-y-4">
                {[
                  "Create An Account",
                  "Update Your Profile",
                  "Upload Your Resume",
                  "Apply For Your Dream Job",
                ].map((step, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-lg bg-white shadow-md px-4 py-2 rounded-lg"
                  >
                    <span className="text-blue-600 font-semibold text-2xl">
                      {index + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <video
                src={user_video}
                loop
                controls
                className="mt-4 rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
            </div>
          </div>

          {/* Signup Form Section */}
          <div className="w-full xl:w-1/3 flex flex-col items-center pt-12 sm:pt-20 xl:items-center xl:min-h-screen">
            <form
              className="w-4/5 max-w-lg p-2 rounded-lg mb-8 sm:mb-12"
              onSubmit={handleCreateAccount}
            >
              <h1 className="text-3xl font-bold text-center">
                Great<span className="text-blue-700">Hire</span>
              </h1>
              <h1 className="text-4xl font-bold text-center">Create Account</h1>
              <h1 className="text-md font-semibold text-gray-500 text-center">
                Find your next opportunity!
              </h1>

              {/* <h1 className="text-sm font-semibold text-gray-400 text-center">
                ---- or Sign up with email ----
              </h1> */}

              <div className="flex flex-col space-y-2">
                {/* Full Name */}
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

                {/* Email */}
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

                {/* Phone Number */}
                <label className="font-bold">Mobile Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Contact number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                {/* Password */}
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

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Log In
                </a>
              </p>
            </form>

            {/* Steps for smaller screens */}
            <div className="w-full xl:hidden flex flex-col items-center text-center p-6 rounded-lg mt-8 sm:mt-12">
              <h1 className="font-bold text-3xl text-gray-900 mb-4">
                Follow These <span className="text-blue-600">Simple Steps</span>
              </h1>
              <ul className="text-lg font-semibold text-gray-800 space-y-3">
                {[
                  "Create An Account",
                  "Update Your Profile",
                  "Upload Your Resume",
                  "Apply For Your Dream Job",
                ].map((step, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-lg bg-white shadow-md px-4 py-2 rounded-lg"
                  >
                    <span className="text-blue-600 font-semibold text-2xl">
                      {index + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <video
                src={user_video}
                loop
                controls
                className="mt-4 rounded-lg shadow-lg w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Signup;