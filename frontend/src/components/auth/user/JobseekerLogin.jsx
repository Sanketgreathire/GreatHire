import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { Briefcase } from "lucide-react";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const JobseekerLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [otpData, setOtpData] = useState({ otp: "" });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
      title: "Find Your Dream Job",
      subtitle: "Connect with top companies and discover opportunities that match your skills",
      stats: "50,000+ Jobs Available"
    },
    {
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80",
      title: "Build Your Career",
      subtitle: "Join thousands of professionals who found success through GreatHire",
      stats: "95% Success Rate"
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1661587727551-7f7aac005fe3?q=80&w=1000&auto=format&fit=crop",
      title: "Network & Grow",
      subtitle: "Expand your professional network and accelerate your career growth",
      stats: "100k+ Professionals"
    },
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedJobseekerEmail');
    const savedPassword = localStorage.getItem('rememberedJobseekerPassword');
    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      setOtpData({ ...otpData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignUpClick = () => {
    navigate("/signup-choice");
  };

  const handleOtpClick = () => {
    setShowOtpInput((prev) => !prev);
    setOtpData({ otp: "" });
    setResendTimer(0);
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_END_POINT}/send-otp`, { email: formData.email });
      
      if (res.data.success) {
        toast.success("OTP sent to email");
        setOtpSent(true);
        setResendTimer(300);
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("OTP Error:", err);
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (showOtpInput) {
        response = await axios.post(
          `${USER_API_END_POINT}/verify-jobseeker-otp`,
          {
            email: formData.email,
            otp: otpData.otp,
          },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${USER_API_END_POINT}/jobseeker-login`,
          { ...formData },
          { withCredentials: true }
        );
      }

      if (response?.data?.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));

        const passwordToSave = showOtpInput ? otpData.otp : formData.password;
        if (rememberMe) {
          localStorage.setItem('rememberedJobseekerEmail', formData.email);
          localStorage.setItem('rememberedJobseekerPassword', passwordToSave);
        } else {
          localStorage.removeItem('rememberedJobseekerEmail');
          localStorage.removeItem('rememberedJobseekerPassword');
        }

        const user = response.data.user;
        if (user.role === "student" || user.role === "candidate") {
          if (user.isFirstLogin) {
            navigate("/profile");
          } else {
            navigate("/");
          }
        } else if (user.role === "recruiter") {
          navigate("/recruiter/dashboard");
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error in login:", err);
      toast.error(err?.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="w-full px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-black">
              Great<span className="text-blue-600">Hire</span>
            </h1>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Left Side - Image Carousel */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-600 p-8">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden rounded-2xl">
                <div
                  className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div key={index} className="min-w-full relative">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h2 className="text-3xl font-bold mb-3">{slide.title}</h2>
                        <p className="text-base opacity-90 leading-relaxed mb-4">{slide.subtitle}</p>
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold">
                          {slide.stats}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index ? "bg-white w-8" : "bg-white/50 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -right-6 top-16 bg-white rounded-2xl p-5 shadow-2xl border-4 border-blue-100">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">98%</div>
                  <div className="text-xs text-gray-600 font-semibold">Success Rate</div>
                </div>
              </div>
              
              <div className="absolute -left-6 bottom-16 bg-white rounded-2xl p-5 shadow-2xl border-4 border-purple-100">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">50k+</div>
                  <div className="text-xs text-gray-600 font-semibold">Active Jobs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md space-y-6">
              
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Briefcase className="w-4 h-4" />
                  Jobseeker Portal
                </div>
                <h2 className="text-3xl font-black text-gray-900">Welcome Back!</h2>
                <p className="text-gray-600 mt-2">Find the job made for you</p>
                <p className="mt-4 text-sm text-gray-700">
                  Don't have an account?{" "}
                  <span
                    onClick={handleSignUpClick}
                    className="text-blue-600 cursor-pointer underline font-semibold hover:text-blue-800 transition-colors"
                  >
                    Sign Up
                  </span>
                </p>
              </div>

              {/* Login Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="block w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password or OTP */}
                {!showOtpInput ? (
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="block w-full pl-10 pr-12 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={otpData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit OTP"
                      className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      maxLength={6}
                      required
                    />
                    <div className="mt-3 text-center">
                      {resendTimer > 0 ? (
                        <p className="text-gray-500 text-sm">
                          Resend OTP in {formatTime(resendTimer)}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={loading}
                          className="text-blue-600 text-sm font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {otpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 font-medium">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 text-sm hover:underline font-semibold transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl text-sm transition-all duration-300 ${
                    loading 
                      ? "opacity-70 cursor-not-allowed" 
                      : "hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Sign In
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </div>
                  )}
                </button>
              </form>

              {/* Toggle */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleOtpClick}
                  className="text-blue-600 text-sm hover:underline font-semibold transition-colors"
                >
                  {showOtpInput ? "Login with Password?" : "Login with OTP?"}
                </button>
              </div>

              {/* Trust */}
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 pt-4">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span>100k+ Users</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default JobseekerLogin;