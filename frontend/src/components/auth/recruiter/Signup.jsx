import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/utils/supabase";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
// import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import recruiter_video from "../../../assets/videos/recruiter_video.mp4";

// ✅ Slides for recruiter side (first image fixed)
const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1000&q=80",
    title: "Find Top Talent Fast",
    subtitle:
      "Post jobs, manage applications, and hire efficiently with GreatHire Recruiter.",
    stats: "1,000+ Companies Hiring",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
    title: "Streamline Recruitment",
    subtitle:
      "Use intelligent tools to shortlist candidates and save valuable time.",
    stats: "AI-Powered Matching",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80",
    title: "Grow Your Team",
    subtitle:
      "Connect with skilled professionals and build a strong workforce.",
    stats: "50,000+ Job Seekers",
  },
];

const RecruiterSignup = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullname || formData.fullname.length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Enter a valid phone number (10 digits, starting with 6–9).";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleCreateAccount = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Please fix the errors before submitting.");
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullname,
          phone: formData.phoneNumber,
          role: "recruiter" // ✅ IMPORTANT
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Recruiter account created successfully ✅");

    dispatch(setUser(data.user));

    setFormData({
      fullname: "",
      email: "",
      phoneNumber: "",
      password: "",
    });

    navigate("/recruiter/dashboard/create-company");
  } catch (err) {
    toast.error("Something went wrong ❌");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 🔵🩷 Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />

        <div className="flex justify-center w-full py-8 sm:py-16">
          <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* LEFT SIDE - Carousel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-white p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-[95%] h-full overflow-hidden shadow-md border border-gray-200 rounded-l-2xl rounded-r-[80px]">
                  <div
                    className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
                    // style={{ `transform: translateX(-${currentSlide * 100}%)` }}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}

                    // style = {{transform: trans}}
                  >
                    {slides.map((slide, index) => (
                      <div key={index} className="min-w-full relative">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover rounded-l-2xl rounded-r-[80px]"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-l-2xl rounded-r-[80px]"></div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                          <div className="text-center max-w-xs">
                            <h2 className="text-2xl font-bold mb-2">
                              {slide.title}
                            </h2>
                            <p className="text-sm opacity-90 leading-relaxed mb-2">
                              {slide.subtitle}
                            </p>
                            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                              {slide.stats}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Slide Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? "bg-white w-6"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Stats Cards (added - same style as user page) */}
                <div className="absolute -right-4 top-20 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">98%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                </div>

                <div className="absolute -left-4 bottom-20 bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">50k+</div>
                    <div className="text-xs text-gray-600">Active Jobs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
              <div className="w-full max-w-md space-y-4">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800">
                    Great<span className="text-blue-600">Hire</span>
                  </h1>
                  <h2 className="text-xl font-semibold mt-2 text-gray-900">
                    Create Recruiter Account
                  </h2>
                  <p className="text-sm text-gray-600">
                    Hire smarter. Connect faster.
                  </p>
                  <p className="mt-3 text-sm text-blue-600">
                    Already have an account?{" "}
                    <span
                      onClick={() => navigate("/login")}
                      className="cursor-pointer underline font-semibold hover:text-blue-800 transition-colors"
                    >
                      Log In
                    </span>
                  </p>
                </div>

                {/* FORM */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <form className="space-y-5" onSubmit={handleCreateAccount}>
                    {/* Full Name */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="block w-full pl-3 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      {errors.fullname && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullname}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1.5">
                        Work Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your work email"
                        className="block w-full pl-3 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1.5">
                        Company Contact Number
                      </label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Company phone number"
                        className="block w-full pl-3 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="min 8 characters"
                          className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-300 ${
                        loading
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VIDEO & INSTRUCTIONS SECTION */}
        <div className="flex flex-col lg:flex-row w-full max-w-4xl mx-auto gap-6 mb-12 px-4">
          <div className="lg:w-1/2">
            <video
              src={recruiter_video}
              controls
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div className="lg:w-1/2 flex flex-col justify-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              How to Get Started
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2  dark:text-white ">
              <li>Create your recruiter account.</li>
              <li>Set up your company profile.</li>
              <li>Post job openings easily.</li>
              <li>Review applications efficiently.</li>
              <li>Hire top candidates quickly.</li>
            </ul>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default RecruiterSignup;