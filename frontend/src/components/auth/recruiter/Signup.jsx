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
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Updated Left Section - Background Image and Content */}
        <div className="relative h-screen w-2/3 hidden xl:flex">
          <img
            src={img3}
            alt="Image 1"
            className="w-full h-full object-cover  opacity-70"
          />
          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col items-center text-center space-y-4 justify-center px-4">
            <h1 className="font-semibold text-2xl md:text-3xl text-gray-800">
              Powerful recruiting tools to find your{" "}
              <span className="text-black"> Perfect Team!</span>
            </h1>
            <p className=" flex items-center gap-2 font-semibold  text-lg md:text-xl text-gray-800">
              <MdOutlineVerified size={30} color="red" />
              Post your job and source candidates.
            </p>
            <p className=" flex items-center gap-2 font-semibold  text-lg md:text-xl text-gray-800">
              <MdOutlineVerified size={30} color="red" />
              Save time with intelligent applicant sorting.
            </p>
            <p className=" flex items-center gap-2 font-semibold  text-lg md:text-xl text-gray-800">
              <MdOutlineVerified size={30} color="red" />
              Free built-in ATS to manage your pipeline.
            </p>
            <p className=" flex items-center gap-2 font-semibold  text-lg md:text-xl text-gray-800">
              <MdOutlineVerified size={30} color="red" />
              Industry high 40% candidate response rate.
            </p>
          </div>
        </div>

        {/* Updated Right Section - Form */}
        <div className="w-full md:w-1/3 flex items-center justify-center bg-gradient-to-r from-white to-blue-100  flex-grow min-h-screen">
          <form className="w-4/5 max-w-lg space-y-4" onSubmit={handleSubmit}>
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
      </div>
      <Footer />
      </div>
    </>
  );
};

export default Signup;
