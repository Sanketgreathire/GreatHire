import React, { useState } from "react";
import img from "../../../assets/img9.png";
import { toast } from "react-hot-toast";
import axios from "axios";

import { ADMIN_API_END_POINT } from "@/utils/ApiEndPoint";
import { setUser } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

const AdminSignup = () => {
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
        `${ADMIN_API_END_POINT}/register`,
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
        toast.success(response.data.message);
      }
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
      <div className="flex flex-col md:flex-row h-screen ">
        {/* Left Section - Background Image and Content */}
        <div className="relative w-full md:w-2/3 md:h-full hidden md:block p-2">
          {/* Background Image */}
          <img
            src={img}
            alt="Image 1"
            className="w-full h-full object-contain opacity-85"
          />
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/3 flex items-center justify-center bg-gradient-to-r from-white to-blue-100 h-full ">
          <form className="w-4/5 space-y-4" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center">
              Great<span className="text-blue-700">Hire</span>
            </h1>
            <h1 className="text-4xl font-bold text-center">Create Account</h1>
            <h1 className="text-md font-semibold text-gray-500 text-center">
              Empowering you to manage and grow your organization effortlessly
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
              <a href="/admin/login" className="text-blue-500 hover:underline">
                Log In
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminSignup;
