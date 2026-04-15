import React, { useEffect, useState } from "react";
import img from "../../../assets/img10.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "react-hot-toast";
import Loading from "../../Loading";
import { ADMIN_API_END_POINT } from "@/utils/ApiEndPoint";

const AdminLogin = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);  // Add loading state

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "Owner")
        navigate("/admin/dashboard");
      else navigate("/admin/login");
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
        `${ADMIN_API_END_POINT}/login`,
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
        navigate("/admin/dashboard/home");
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col-reverse md:flex-row h-screen">
        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-l from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 h-screen p-6">
          <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
            {/* Logo/Brand */}
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              Great<span className="text-blue-700 dark:text-blue-400">Hire</span>
            </h1>
            
            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
              Login
            </h1>

            {/* Subtitle */}
            <h1 className="text-lg font-bold text-gray-700 dark:text-gray-300 text-center mt-6">
              Empowering administrators to build and manage with precision
            </h1>

            {/* Form Fields */}
            <div className="flex flex-col space-y-4">
              <label className="font-bold text-gray-900 dark:text-white">Email</label>
              <input
                type="email"
                name="email"
                placeholder="mail@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                required
              />
              
              <label className="font-bold text-gray-900 dark:text-white">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                required
              />
              
              <div className="flex flex-row-reverse">
                <p
                  className="text-blue-600 dark:text-blue-400 text-sm cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loading color="white" />
                </div>
              ) : (
                "Login"
              )}
            </button>

            {/* Optional: Sign Up Link (commented out in original) */}
            {/* <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              New Admin?{" "}
              <a 
                href="/admin/signup" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                Sign Up
              </a>
            </p> */}
          </form>
        </div>

        {/* Right Section - Background Image */}
        <div className="relative w-full md:w-1/2 md:h-full hidden md:block">
          <img
            src={img}
            alt="Background"
            className="w-full h-full object-cover opacity-85 dark:opacity-70"
          />
          {/* Optional: Dark overlay for better contrast in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/10 dark:to-gray-900/40"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;