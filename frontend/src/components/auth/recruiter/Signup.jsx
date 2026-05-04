import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { RECRUITER_API_END_POINT, OTP_API_END_POINT } from "@/utils/ApiEndPoint";
import { validateSignupForm } from "@/utils/signupValidation";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=600&q=60",
    title: "Find Top Talent Fast",
    subtitle: "Post jobs, manage applications, and hire efficiently with GreatHire Recruiter.",
    stats: "1,000+ Companies Hiring",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=60",
    title: "Streamline Recruitment",
    subtitle: "Use intelligent tools to shortlist candidates and save valuable time.",
    stats: "AI-Powered Matching",
  },
  {
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=60",
    title: "Grow Your Team",
    subtitle: "Connect with skilled professionals and build a strong workforce.",
    stats: "50,000+ Job Seekers",
  },
];

const RESEND_COOLDOWN = 30;

const OtpInput = ({ value, onChange, onVerify, verifying, inputRef }) => (
  <div className="flex gap-2 mt-2">
    <input
      ref={inputRef}
      type="text"
      maxLength={6}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      placeholder="Enter 6-digit OTP"
      className="flex-1 pl-3 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
    />
    <button
      type="button"
      onClick={onVerify}
      disabled={verifying || value.length !== 6}
      className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors whitespace-nowrap"
    >
      {verifying ? (
        <span className="flex items-center gap-1">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Verifying
        </span>
      ) : "Verify OTP"}
    </button>
  </div>
);

const RecruiterSignup = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullname: "", email: "", phoneNumber: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Email OTP state
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  const emailOtpRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const t = setTimeout(() => setEmailCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [emailCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "email") {
      setEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp("");
    }
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email first" }));
      return;
    }
    setSendingEmailOtp(true);
    try {
      const res = await axios.post(`${OTP_API_END_POINT}/send-email`, { email: formData.email });
      if (res.data.success) {
        setEmailOtpSent(true);
        setEmailCooldown(RESEND_COOLDOWN);
        toast.success("OTP sent to your email");
        setTimeout(() => emailOtpRef.current?.focus(), 100);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setVerifyingEmail(true);
    try {
      const res = await axios.post(`${OTP_API_END_POINT}/verify-email`, { email: formData.email, otp: emailOtp });
      if (res.data.success) {
        setEmailVerified(true);
        toast.success("Email verified ✅");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    if (!emailVerified) {
      toast.error("Please verify your email before signing up.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${RECRUITER_API_END_POINT}/register`, { ...formData }, { withCredentials: true });
      if (response?.data?.success) {
        toast.success("Recruiter account created successfully ✅");
        setFormData({ fullname: "", email: "", phoneNumber: "", password: "" });
        dispatch(setUser(response.data.user));
        navigate("/recruiter/dashboard/create-company");
      } else {
        toast.error(response?.data?.message || "Signup failed ❌");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error, please try again ❌");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: "01", title: "Create Account", description: "Set up your recruiter account in minutes" },
    { number: "02", title: "Company Profile", description: "Build a compelling company profile" },
    { number: "03", title: "Post Jobs", description: "Publish job openings effortlessly" },
    { number: "04", title: "Review Applications", description: "Manage candidate submissions efficiently" },
    { number: "05", title: "Hire Top Talent", description: "Connect with qualified candidates quickly" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full opacity-10 dark:opacity-5"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full opacity-10 dark:opacity-5"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />

        <div className="flex justify-center w-full py-8 sm:py-16 mt-6">
          <div className="flex w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
            {/* LEFT SIDE - Carousel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-white dark:bg-gray-900 p-4 transition-colors duration-300">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-[95%] h-full overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 rounded-l-2xl rounded-r-[80px] transition-colors duration-300">
                  <div
                    className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {slides.map((slide, index) => (
                      <div key={index} className="min-w-full relative">
                        <img src={slide.image} alt={slide.title} loading="lazy" className="w-full h-full object-cover rounded-l-2xl rounded-r-[80px]" />
                        <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 rounded-l-2xl rounded-r-[80px] transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                          <div className="text-center max-w-xs">
                            <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                            <p className="text-sm opacity-90 leading-relaxed mb-2">{slide.subtitle}</p>
                            <div className="inline-block bg-white/20 dark:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">{slide.stats}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                    {slides.map((_, index) => (
                      <button key={index} onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white w-6" : "bg-white bg-opacity-50 dark:bg-opacity-40"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute -right-4 top-20 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                </div>
                <div className="absolute -left-4 bottom-20 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">50k+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Active Jobs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
              <div className="w-full max-w-md space-y-4">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                    Great<span className="text-blue-600 dark:text-blue-400">Hire</span>
                  </h1>
                  <h2 className="text-xl font-semibold mt-2 text-gray-900 dark:text-white">Create Recruiter Account</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hire smarter. Connect faster.</p>
                  <p className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/recruiter-login")} className="cursor-pointer underline font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      Log In
                    </span>
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <form className="space-y-5" onSubmit={handleCreateAccount}>
                    {/* Full Name */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Full Name</label>
                      <input
                        type="text" name="fullname" value={formData.fullname} onChange={handleChange}
                        placeholder="Enter your full name" required
                        className="block w-full pl-3 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      {errors.fullname && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.fullname}</p>}
                    </div>

                    {/* Email with OTP */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">
                        Work Email
                        {emailVerified && <span className="ml-2 text-green-500 text-xs font-semibold">✔ Verified</span>}
                      </label>
                      <div className="flex items-center">
                        <input
                          type="email" name="email" value={formData.email} onChange={handleChange}
                          placeholder="Enter your work email" required disabled={emailVerified}
                          className="block flex-1 pl-3 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-60"
                        />
                        {!emailVerified && (
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            disabled={sendingEmailOtp || emailCooldown > 0}
                            className="ml-2 px-3 py-2.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                          >
                            {sendingEmailOtp ? (
                              <>
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Sending
                              </>
                            ) : emailCooldown > 0 ? `Resend (${emailCooldown}s)` : emailOtpSent ? "Resend OTP" : "Send OTP"}
                          </button>
                        )}
                      </div>
                      {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>}
                      {emailOtpSent && !emailVerified && (
                        <>
                          <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">OTP sent to your email</p>
                          <OtpInput
                            value={emailOtp}
                            onChange={setEmailOtp}
                            onVerify={handleVerifyEmailOtp}
                            verifying={verifyingEmail}
                            inputRef={emailOtpRef}
                          />
                        </>
                      )}
                    </div>

                    {/* Phone (no OTP) */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Company Contact Number</label>
                      <input
                        type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                        placeholder="Company phone number" required
                        className="block w-full pl-3 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      {errors.phoneNumber && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                          placeholder="min 8 characters" required
                          className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading || !emailVerified}
                      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-300 ${
                        loading || !emailVerified
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 hover:shadow-lg transform hover:-translate-y-0.5"
                      }`}
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </button>

                    {!emailVerified && (
                      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Verify your email to enable signup
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="w-full py-16 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">How to Get Started</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Join thousands of recruiters hiring top talent in just a few simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {steps.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition-all duration-200">
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold">{step.number}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                  {index < steps.length - 1 && <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-px bg-gray-300 dark:bg-gray-600 -translate-y-1/2" />}
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button onClick={() => navigate("/recruiter-login")}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200">
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
