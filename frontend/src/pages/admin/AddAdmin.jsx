import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";

const AddAdmin = () => {
  const { company } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    position: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Navbar linkName="Add Admin" />
      
      {/* Main Layout Wrapper */}
      <div className="flex">
       

        {/* Content Section (After Navbar) */}
        <div className="flex-grow min-h-screen bg-gray-100 pt-16 flex justify-center items-center">
          {/* Centered Form */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Provide Admin Details
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block font-semibold text-sm">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-sm">Work Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="mail@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-sm">Mobile Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Contact number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="min 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm ${
                  loading ? "cursor-not-allowed opacity-75" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdmin;
