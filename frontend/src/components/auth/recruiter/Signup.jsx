import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { validateSignupForm } from "@/utils/signupValidation";

// ✅ Slides for recruiter side (first image fixed)
const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=600&q=60",
    title: "Find Top Talent Fast",
    subtitle:
      "Post jobs, manage applications, and hire efficiently with GreatHire Recruiter.",
    stats: "1,000+ Companies Hiring",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=60",
    title: "Streamline Recruitment",
    subtitle:
      "Use intelligent tools to shortlist candidates and save valuable time.",
    stats: "AI-Powered Matching",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignupForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${RECRUITER_API_END_POINT}/register`,
        { ...formData },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success("Recruiter account created successfully ✅");
        setFormData({ fullname: "", email: "", phoneNumber: "", password: "" });
        dispatch(setUser(response.data.user));
        navigate("/recruiter/dashboard/create-company");
      } else {
        toast.error(response?.data?.message || "Signup failed ❌");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Network error, please try again ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Set up your recruiter account in minutes"
    },
    {
      number: "02",
      title: "Company Profile",
      description: "Build a compelling company profile"
    },
    {
      number: "03",
      title: "Post Jobs",
      description: "Publish job openings effortlessly"
    },
    {
      number: "04",
      title: "Review Applications",
      description: "Manage candidate submissions efficiently"
    },
    {
      number: "05",
      title: "Hire Top Talent",
      description: "Connect with qualified candidates quickly"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 🔵🩷 Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full opacity-10"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full opacity-10"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />

        <div className="flex justify-center w-full py-8 sm:py-16 mt-6">
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
                          loading="lazy"
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
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
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
                      onClick={() => navigate("/recruiter-login")}
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
                      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-300 ${loading
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

        <section className="w-full py-16 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                How to Get Started
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join thousands of recruiters hiring top talent in just a few simple steps.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center p-6 
                     rounded-lg bg-gray-50 dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700 
                     hover:border-blue-500 hover:shadow-sm 
                     transition-colors duration-200"
                >
                  {/* Step Number */}
                  <div className="mb-4 flex items-center justify-center 
                          w-12 h-12 rounded-full 
                          bg-blue-600 text-white font-semibold">
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Simple Connector Line (No gradient, lightweight) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-px bg-gray-300 dark:bg-gray-600 -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/recruiter-login')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 
                   text-white font-semibold rounded-md 
                   transition-colors duration-200"
              >
                Get Started Now
              </button>
            </div>

          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default RecruiterSignup;