import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { addRecruiter } from "@/redux/recruiterSlice";

const AddRecruiter = () => {
  const dispatch = useDispatch();

  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);

  // State to manage form loading state
  const [loading, setLoading] = useState(false);

  // State to store form data
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    position: "",
    password: "",
  });

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sending a POST request to add a new recruiter
      const response = await axios.post(
        `${RECRUITER_API_END_POINT}/add-recruiter`,
        {
          ...formData,
          companyId: company?._id, // Attaching company ID
        },
        { withCredentials: true }
      );

      // If the request is successful
      if (response.data.success) {
        dispatch(addRecruiter(response.data.recruiter));
        toast.success(response.data.message); // Showing success notification

        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          position: "",
          password: "",
        });
      } else {
        toast.error(response.data.message); // Showing error notification
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {company && user?.isActive ? (
        <div className="flex items-center justify-center ">
          <form
            className="w-full p-4 md:w-1/2 space-y-4"
            onSubmit={handleSubmit}
          >
            <h1 className="text-3xl font-bold text-center text-blue-700">
              {company?.companyName}
            </h1>
            <h1 className="text-3xl font-bold text-center">
              Give Recruiter Details
            </h1>
            <h1 className="text-md font-semibold text-gray-500 text-center">
              Build your smart and powerful recruiter team
            </h1>
            <div className="flex flex-col space-y-2">
              <label className="font-bold">Full Name</label>
              <input
                type="text"
                name="fullname" // Updated name
                placeholder="Full Name"
                value={formData.fullName} // Updated value
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
                name="phoneNumber" // Updated name
                placeholder="Contact number"
                value={formData.phoneNumber} // Updated value
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="font-bold">Position In Company</label>
              <input
                type="text"
                name="position"
                placeholder="Hiring manager, consultant ..."
                value={formData.position}
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
              className={`w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Recruiter"}
            </button>
          </form>
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">
            GreatHire will verify your company soon.
          </span>
        </p>
      )}
    </>
  );
};

export default AddRecruiter;
