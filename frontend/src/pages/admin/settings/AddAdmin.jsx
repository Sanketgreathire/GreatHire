// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowLeft } from "react-icons/fi";
import Navbar from "@/components/admin/Navbar";
import { RiAdminLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/ApiEndPoint";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  // Retrieves the authenticated user details from the Redux store
  const { user } = useSelector((state) => state.auth);

  // State to manage loading status during form submission
  const [loading, setLoading] = useState(false);

  // Hook for navigation within the application
  const navigate = useNavigate();

  // State to manage form input values
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // Redirects non-owner users to the admin page
  useEffect(() => {
    if (user?.role !== "Owner") {
      navigate("/admin");
    }
  }, [user]);

  // Handles input field changes and updates formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handles form submission for adding a new admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Sends a POST request to register a new admin
      const response = await axios.post(
        `${ADMIN_API_END_POINT}/register`,
        {
          ...formData,
        },
        { withCredentials: true }
      );

      // Displays success message and resets form on successful registration
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          fullname: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
      }
    } catch (err) {
      // Logs error in case of failure
      console.log(`Error in add admin ${err}`);
    } finally {
      // Resets loading state after request completion
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar linkName="Add Admin" />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r bg-gray-100 relative px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md relative overflow-hidden mt-0 md:mt-[-50px]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 bg-white opacity-10 rounded-xl"
          />
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-2 left-4 md:top-5 md:left-6 flex items-center text-gray-600 hover:text-gray-900 text-lg z-20"
          >
            <FiArrowLeft size={30} className="mr-2" />
          </button>
          <h2 className="flex items-center justify-center gap-4 text-2xl font-bold text-center text-gray-700 mb-6">
            <RiAdminLine size={45} className="text-blue-700" />
            <span>Add New Admin</span>
          </h2>
          <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
            {[
              {
                label: "Full Name",
                name: "fullname",
                type: "text",
                placeholder: "Enter full name",
                icon: <FiUser size={25} />,
              },
              {
                label: "Work Email",
                name: "email",
                type: "email",
                placeholder: "mail@domain.com",
                icon: <FiMail size={25} />,
              },
              {
                label: "Mobile Number",
                name: "phoneNumber",
                type: "text",
                placeholder: "Contact number",
                icon: <FiPhone size={25} />,
              },
              {
                label: "Password",
                name: "password",
                type: "password",
                placeholder: "Min 8 characters",
                icon: <FiLock size={25} />,
              },
            ].map(({ label, name, type, placeholder, icon }) => (
              <div key={name} className="relative">
                <label className="block text-gray-600 font-semibold text-sm mb-1">
                  {label}
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg shadow-sm bg-white px-3 py-1 focus-within:ring-2 focus-within:ring-blue-400">
                  <span className="text-gray-500 text-lg mr-2">{icon}</span>
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full focus:outline-none text-lg bg-transparent py-1"
                    required
                  />
                </div>
              </div>
            ))}

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              type="submit"
              className={`w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm font-semibold transition-all ${
                loading ? "cursor-not-allowed opacity-75" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Admin"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default AddAdmin;
