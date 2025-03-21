// Importing React and necessary hooks for state management and side effects
import {React,useRef, useState } from "react";
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  // State to manage loading status while making API requests
  const [loading, setLoading] = useState(false);

  // Redux dispatcher to update global user state
  const dispatch = useDispatch();

  // React Router navigation hook to redirect users after successful signup
  const navigate = useNavigate();

  const [resumeUrl, setResumeUrl] = useState("");
  const [prevResumeName, setPrevResumeName] = useState("");
  // State to manage form input values
  const [formData, setFormData] = useState({
    fullname: "", 
    email: "",
    phoneNumber: "", 
    password: "",
  });

  const [input, setInput] = useState({
    resume: "",
    resumeOriginalName: "",
  });
  
  const resumeRef = useRef(null); // Use ref for file

  // Update state when input fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // Handles file input change for resume upload
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log("Selected file:", file);
        resumeRef.current = file; // Store file in ref instead of state
        if (file.size > 10 * 1024 * 1024) {
          toast.error("Resume size should be less than 10 MB.");
          return;
        }
  
        setInput((prevData) => ({
          ...prevData,
          resume: file,
          resumeOriginalName: file.name,
        }));
        setResumeUrl(file.name);
        setPrevResumeName(file.name); // Store last uploaded resume name
      }
      e.target.value = ""; // Reset input value to allow re-upload of the same file
    };
  
     // Removes the currently uploaded resume
    const removeResume = () => {
      setInput((prev) => ({
        ...prev,
        resume: "",
        resumeOriginalName: "",
      }));
      setResumeUrl("");
      setPrevResumeName(input.resumeOriginalName);
    };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("File in resumeRef before sending:", resumeRef.current);

    if (!resumeRef.current) {
      toast.error("Please upload a resume!");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.fullname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("resume", resumeRef.current); // Use ref instead of state

      console.log("Final FormData:", [...formDataToSend]);

      const response = await axios.post(
        `${USER_API_END_POINT}/register`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", response.data);

      if (response?.data?.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));
        navigate("/profile");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error in signup:", err);
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Navbar />
       <div className="flex flex-col xl:flex-row flex-grow bg-gradient-to-b from-white to-blue-200">

        {/* Large Screen Left Side */}
        <div className="relative h-screen w-2/3 hidden xl:flex items-center justify-center">
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
           <li key={index} className="flex items-center gap-3 text-lg bg-white shadow-md px-4 py-2 rounded-lg">
              <span className="text-blue-600 font-semibold text-2xl">{index + 1}.</span> 
            {step}
          </li>
          ))}
        </ul>
       </div>
     </div>

        {/* Form Section (Centered in Medium & Small Screens) */}
        <div className="w-full xl:w-1/3 flex flex-col items-center pt-12 sm:pt-20 xl:items-center xl:min-h-screen">
          
          <form className="w-4/5 max-w-lg p-2 rounded-lg mb-8 sm:mb-12" onSubmit={handleSubmit}>
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
              <div className="w-full">
                          <Label htmlFor="resume" className="block mb-2 font-semibold">
                            Resume
                          </Label>
              
                          <div className="relative w-full">
                            {/* File Input */}
                            <Input
                              id="resume"
                              name="resume"
                              type="text"
                              value={input.resumeOriginalName}
                              placeholder="Upload your resume"
                              readOnly
                              className="pr-10"
                            />
                            <input
                              type="file"
                              id="resumeInput"
                              accept=".pdf, .doc, .docx"
                              onChange={handleFileChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <p><strong>Note:</strong> PDF (.pdf)  are allowed.</p>
              
                            {/* Display remove button inside input field */}
                            {resumeUrl && (
                              <button
                                type="button"
                                onClick={removeResume}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                              >
                                ✖
                              </button>
                            )}
                          </div>
                        </div>
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4 ${
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

          {/* Background Content (Visible in Small & Medium Screens) */}
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
            <li key={index} className="flex items-center gap-3 text-lg bg-white shadow-md px-4 py-2 rounded-lg">
              <span className="text-blue-600 font-semibold text-2xl">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ul>
      </div>
        </div>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default Signup;
