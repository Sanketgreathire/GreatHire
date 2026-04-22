import React, { useState, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { addRecruiter } from "@/redux/recruiterSlice";
import { Helmet } from "react-helmet-async";

const USER_LIMITS = { FREE: 1, STANDARD: 1, PREMIUM: 3, PRO: 5, ENTERPRISE: Infinity };

const AddRecruiter = () => {
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);

  const planType = company?.plan || "FREE";
  const userLimit = USER_LIMITS[planType] ?? 1;
  const atLimit = userLimit !== Infinity && (company?.userId?.length ?? 0) >= userLimit;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "", email: "", phoneNumber: "", position: "", password: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${RECRUITER_API_END_POINT}/add-recruiter`,
        { ...formData, companyId: company?._id },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(addRecruiter(response.data.recruiter));
        toast.success(response.data.message);
        setFormData({ fullname: "", email: "", phoneNumber: "", position: "", password: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [formData, company?._id, dispatch]);

  return (
    <>
      <Helmet>
        {/* Meta Title */}
        <title>
          Add Recruiter | Create Your Hiring Team, Manage Recruiters, and Add Recruiters with GreatHire
        </title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Add and manage recruiters with ease on GreatHire-a trusted recruitment platform operating from Hyderabad State, India-empowering companies to build strong and efficient hiring teams. This Add Recruiter page gives organizations a scope to onboard recruiters in a secure manner by capturing the essential details like name, work email, role, and contact information. Strengthen your hiring, assign responsibilities, and scale up faster by managing your recruiters from a single window. GreatHire is designed for growing companies and their HR teams to create an intelligent, professional, and verified recruiter network, ultimately accelerating hiring success."
        />
      </Helmet>
      
      {company && user?.isActive ? (
        <div className="flex items-center justify-center pt-20 min-h-screen bg-gray-100 dark:bg-gray-950">
          {atLimit ? (
            <div className="w-full md:w-1/2 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">User Limit Reached</p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Your <strong>{planType}</strong> plan allows a maximum of <strong>{userLimit}</strong> user{userLimit > 1 ? "s" : ""}.
                Upgrade your plan to add more recruiters.
              </p>
              <button
                onClick={() => window.location.href = "/recruiter/dashboard/upgrade-plans"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Upgrade Plan
              </button>
            </div>
          ) : (
            <form
              className="w-full p-4 md:w-1/2 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
              onSubmit={handleSubmit}
            >
            <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400">
              {company?.companyName}
            </h1>
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
              Give Recruiter Details
            </h1>
            <h1 className="text-md font-semibold text-gray-500 text-center text-gray-500 dark:text-gray-400">
              Build your smart and powerful recruiter team
            </h1>
            <div className="flex flex-col space-y-2">
              <label className="font-bold text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="fullname" // Updated name
                placeholder="Full Name"
                value={formData.fullName} // Updated value
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="font-bold text-gray-700 dark:text-gray-300">Work Email</label>
              <input
                type="email"
                name="email"
                placeholder="mail@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="font-bold text-gray-700 dark:text-gray-300">Mobile Number</label>
              <input
                type="text"
                name="phoneNumber" // Updated name
                placeholder="Contact number"
                value={formData.phoneNumber} // Updated value
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="font-bold text-gray-700 dark:text-gray-300">Position In Company</label>
              <input
                type="text"
                name="position"
                placeholder="Hiring manager, consultant ..."
                value={formData.position}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="font-bold text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                placeholder="min 8 characters"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Recruiter"}
            </button>
          </form>
          )}
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400 dark:text-gray-500">Company not created</span>
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
