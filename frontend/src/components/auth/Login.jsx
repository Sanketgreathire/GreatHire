import React, { useEffect, useState } from "react";
import img2 from "../../assets/img2.png";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "../GoogleLogin";
import { google_client_id } from "../../utils/GoogleOAuthCredentials.js";
import axios from "axios";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "react-hot-toast";
import Loading from "../Loading";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (user) {
      if (user.role === "recruiter") navigate("/recruiter/dashboard");
      else navigate("/");
    }
  }, [user]);
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
        `${USER_API_END_POINT}/login`,
        {
          ...formData,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        setFormData({
          email: "",
          password: "",
        });
        const userRole = response.data.user.role;
        if (userRole.includes("student")) navigate("/");
        else if (userRole.includes("recruiter"))
          navigate("/recruiter/dashboard/home");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(`error in login ${err}`);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col-reverse md:flex-row h-screen relative top-[-10px]">
        {/* Left Section - Form */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-l from-white to-blue-100 ">
          <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center">
              Great<span className="text-blue-700">Hire</span>
            </h1>
            <h1 className="text-2xl md:text-4xl font-bold text-center">
              Login
            </h1>
            <p className="text-sm md:text-md font-semibold text-gray-500 text-center">
              Find the job made for you!
            </p>
            {/* Google Login Button */}
            <GoogleOAuthProvider clientId={google_client_id}>
              <GoogleLogin text="Login" role={null} route="user" />
            </GoogleOAuthProvider>
            <p className="text-sm font-semibold text-gray-400 text-center">
              ---- or Login with email ----
            </p>
            <div className="flex flex-col space-y-4">
              <label className="font-bold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="mail@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <label className="font-bold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex flex-row-reverse ">
                <p
                  className="text-blue-600 text-sm cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password
                </p>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <>
                  <Loading color="white" />
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Updated Right Section - Background Image */}
        <div className="relative w-full hidden xl:flex">
          <img
            src={img2}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover lg:object-fill opacity-70"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 p-4 z-10">
            <h1 className="font-bold text-3xl md:text-4xl text-gray-700">
              Find the job made for you.
            </h1>
            <p className="font-medium text-gray-800 text-sm md:text-lg max-w-[90%] md:max-w-[70%]">
              Browse over 150K jobs at top companies.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
