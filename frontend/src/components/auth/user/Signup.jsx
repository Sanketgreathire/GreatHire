// Importing React and necessary hooks for state management and side effects
import React, { useState } from "react";
// Importing an image asset for the signup page
import img1 from "../../../assets/img1.png"; 
// Google OAuth provider for authentication
import { GoogleOAuthProvider } from "@react-oauth/google"; 
// Custom Google login component
import GoogleLogin from "@/components/GoogleLogin";
// Google Client ID for authentication 
import { google_client_id } from "../../../utils/GoogleOAuthCredentials.js"; 
// Axios for making API requests
import axios from "axios"; 
// Library for showing toast notifications
import { toast } from "react-hot-toast";
// Navbar component for navigation 
import Navbar from "@/components/shared/Navbar"; 
// Footer component
import Footer from "@/components/shared/Footer"; 
// API endpoint for user-related actions
import { USER_API_END_POINT } from "@/utils/ApiEndPoint"; 
// Hook for navigation
import { useNavigate } from "react-router-dom"; 
// Hook for dispatching actions to Redux store
import { useDispatch } from "react-redux"; 
// Redux action to set user data
import { setUser } from "@/redux/authSlice"; 

const Signup = () => {
  // State to manage loading status while making API requests
  const [loading, setLoading] = useState(false);

  // Redux dispatcher to update global user state
  const dispatch = useDispatch();

  // React Router navigation hook to redirect users after successful signup
  const navigate = useNavigate();

  // State to manage form input values
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
    setLoading(true); // Set loading to true
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/register`,
        {
          ...formData,
        },
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setFormData({
          fullname: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));
        navigate("/profile");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      // Show error message
      console.log(`error in sign up ${err}`);
      toast.error(err);
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
            src={img1}
            alt="Image 1"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-bold text-2xl md:text-2xl text-gray-800 mb-6 drop-shadow-lg">
          Follow These <span className="text-blue-600">Simple Steps :</span>
          </h1>
          <ul className="text-lg md:text-lg font-semibold text-gray-900 space-y-2">
          <li className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold text-lg">1.</span> Create An Account
          </li>
          <li className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold text-lg">2.</span> Update Your Profile
          </li>
          <li className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold text-lg">3.</span> Upload Your Resume
          </li>
          <li className="flex items-center gap-2">
          <span className="text-blue-600 font-semibold text-lg">4.</span> Apply For Your Dream Job
          </li>
          </ul>

          {/* <h1 className="font-bold text-2xl md:text-4xl">
              Find the job made <br /> for you.
            </h1>
            <p className="font-medium text-gray-800 text-md md:text-lg w-4/5 md:w-3/5">
              Browse over 150K jobs at top companies.
            </p> */}

          </div>
        </div>

        {/* Updated Right Section - Form */}

        <div className="w-full md:w-1/3 flex items-center justify-center bg-gradient-to-r from-white to-blue-100 py-10 md:py-0 flex-grow min-h-screen">
          <form className="w-4/5 max-w-lg space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center">
              Great<span className="text-blue-700">Hire</span>
            </h1>
            <h1 className="text-4xl font-bold text-center">Create Account</h1>
            <h1 className="text-md font-semibold text-gray-500 text-center">
              Find your next opportunity!
            </h1>
            {/* Google Sign up Button */}
            <GoogleOAuthProvider clientId={google_client_id}>
              <GoogleLogin text="Sign up" role="student" route="user" />
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
                value={formData.phoneNumber}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="font-bold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="min 8 characters"
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