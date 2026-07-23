import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { validateSignupForm } from "@/utils/signupValidation";
import { Loader2 } from "lucide-react";

// ── Extracted from UserUpdateProfile.jsx ──
import JobCategory from "@/components/ui/JobCategory";
import SelectedCategoryPreview from "@/components/ui/SelectedCategoryPreview";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=60",
    title: "Find Your Dream Job",
    subtitle: "Connect with top companies and discover opportunities that match your skills",
    stats: "50,000+ Jobs Available",
  },
  {
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=60",
    title: "Build Your Career",
    subtitle: "Join thousands of professionals who found success through GreatHire",
    stats: "95% Success Rate",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1661587727551-7f7aac005fe3?q=60&w=600&auto=format&fit=crop",
    title: "Network & Grow",
    subtitle: "Expand your professional network and accelerate your career growth",
    stats: "100k+ Professionals",
  },
];

const QUALIFICATIONS = [
  "10th Pass", "12th Pass", "Diploma", "Under Graduation", "Post Graduation",
  "B.Tech", "M.Tech", "MBA", "MCA", "B.Sc", "M.Sc",
  "B.Sc. Computer Science", "M.Sc. Computer Science",
  "B.Sc. Information Technology", "M.Sc. Information Technology",
  "B.Com", "M.Com", "Others",
];

const NOTICE_PERIODS = ["Immediate", "15 Days", "1 Month", "2 Months", "3 Months"];

const inputClass =
  "block w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Step 1 — Account
  const [formData, setFormData] = useState({
    fullname: "", email: "", phoneNumber: "", password: "", inputReferralCode: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Step 2 — Profile
  const [profileData, setProfileData] = useState({
    gender: "",
    qualification: "",
    otherQualification: "",
    city: "",
    state: "",
    country: "",
    bio: "",
    skills: "",
  });

  // ── Job Category (extracted from UserUpdateProfile.jsx) ──
  const [selectedCategories, setSelectedCategories] = useState([]);

  // ── Resume (extracted from UserUpdateProfile.jsx) ──
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeData, setResumeData] = useState({
    resume: "",
    resumeOriginalName: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Resume size should be less than 10 MB.");
        return;
      }
      setResumeUploading(true);
      // Small delay to let the file read complete reliably
      setTimeout(() => {
        setResumeData({
          resume: file,
          resumeOriginalName: file.name,
        });
        setResumeUploading(false);
        toast.success(`"${file.name}" selected successfully.`);
      }, 300);
    }
    e.target.value = "";
  };

  const removeResume = () => {
    setResumeData({
      resume: "",
      resumeOriginalName: "",
    });
  };

  // Experience (optional)
  const [hasExperience, setHasExperience] = useState(null); // null = unanswered
  const [experience, setExperience] = useState({
    companyName: "", jobProfile: "", duration: "",
    currentlyWorking: false, currentCTC: "", noticePeriod: "",
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleExpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExperience((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Step 1 — create account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/register`,
        { ...formData },
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success("Account created ✅");
        dispatch(setUser(response.data.user));
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(response?.data?.message || "Signup failed ❌");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error, please try again ❌");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — save profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formPayload = new FormData();

      // Basic profile fields
      formPayload.append("fullname", formData.fullname);
      formPayload.append("phoneNumber", formData.phoneNumber);
      Object.entries(profileData).forEach(([key, value]) => {
        if (value) formPayload.append(key, value);
      });

      // Job categories
      (Array.isArray(selectedCategories) ? selectedCategories : []).forEach((cat) => {
        formPayload.append("profile[category][]", cat); // nested
        formPayload.append("category[]", cat);           // flat fallback
      });

      // Resume
      if (resumeData.resume instanceof File) {
        formPayload.append("resume", resumeData.resume);
      }

      // Experience
      if (hasExperience && experience.companyName) {
        formPayload.append("experiences", JSON.stringify([experience]));
      } else if (hasExperience === false) {
        formPayload.append("experiences", JSON.stringify([]));
      }

      const response = await axios.put(
        `${USER_API_END_POINT}/profile/update`,
        formPayload,
        { withCredentials: true }
      );
      if (response?.data?.success) {
        dispatch(setUser(response.data.user));
        toast.success("Profile saved! Welcome to GreatHire 🎉");
        navigate("/profile");
      } else {
        toast.error(response?.data?.message || "Failed to save profile");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error, please try again ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 dark:opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 dark:opacity-10 animate-pulse" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />

        <div className="flex justify-center w-full py-8 sm:py-16 mt-6 px-4">
          <div className="flex w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">

            {/* LEFT — Carousel (hidden on step 2 mobile) */}
            <div className="hidden lg:flex lg:w-5/12 relative bg-white dark:bg-gray-900 p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-[95%] overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 rounded-l-2xl rounded-r-[80px]" style={{ minHeight: "520px" }}>
                  <div
                    className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {slides.map((slide, index) => (
                      <div key={index} className="min-w-full relative h-full" style={{ minHeight: "520px" }}>
                        <img src={slide.image} alt={slide.title} loading="lazy"
                          className="w-full h-full object-cover rounded-l-2xl rounded-r-[80px]" style={{ minHeight: "520px" }} />
                        <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 rounded-l-2xl rounded-r-[80px]" />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                          <div className="text-center max-w-xs">
                            <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                            <p className="text-sm opacity-90 leading-relaxed mb-2">{slide.subtitle}</p>
                            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">{slide.stats}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                    {slides.map((_, index) => (
                      <button key={index} onClick={() => setCurrentSlide(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white w-6" : "bg-white bg-opacity-50 w-3"}`} />
                    ))}
                  </div>
                </div>
                <div className="absolute -right-4 top-20 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                </div>
                <div className="absolute -left-4 bottom-20 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">50k+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Active Jobs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="w-full lg:w-7/12 flex flex-col bg-gray-50 dark:bg-gray-800">

              {/* Step tabs */}
              <div className="flex">
                {["Account Details", "Profile Details", "Additional Details"].map((label, i) => (
                  <div key={i}
                    className={`flex-1 py-3 px-1 text-center text-xs sm:text-sm font-semibold transition-colors truncate ${
                      step > i + 1 ? "bg-green-500 text-white"
                      : step === i + 1 ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                    }`}>
                    {step > i + 1 ? `✓ ${label}` : `${i + 1}. ${label}`}
                  </div>
                ))}
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="text-center mb-5">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Great<span className="text-blue-600 dark:text-blue-400">Hire</span>
                  </h1>
                  <h2 className="text-lg font-semibold mt-1 text-gray-900 dark:text-white">
                    {step === 1 ? "Create your account" : step === 2 ? "Complete your profile" : "Almost there"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step === 1
                      ? "Join GreatHire and find opportunities!"
                      : step === 2
                      ? "Tell us a bit about yourself"
                      : "Add your skills, resume & experience"}
                  </p>
                  {step === 1 && (
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                      Already have an account?{" "}
                      <span onClick={() => navigate("/jobseeker-login")}
                        className="cursor-pointer underline font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                        Log In
                      </span>
                    </p>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">

                  {/* ── STEP 1: Account ── */}
                  {step === 1 && (
                    <form className="space-y-4" onSubmit={handleCreateAccount}>
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Full Name</label>
                        <input type="text" name="fullname" value={formData.fullname} onChange={handleChange}
                          placeholder="Enter your full name" className={inputClass} />
                        {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                          placeholder="Enter your email" className={inputClass} />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Mobile Number</label>
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                          placeholder="10-digit mobile number" className={inputClass} />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Password</label>
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                            onChange={handleChange} placeholder="Min 8 characters"
                            className="block w-full pl-3 pr-16 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 text-xs hover:text-gray-800 dark:hover:text-gray-200">
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">
                          Referral Code <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input type="text" name="inputReferralCode" value={formData.inputReferralCode} onChange={handleChange}
                          placeholder="Enter referral code if you have one" className={inputClass} />
                      </div>

                      <button type="submit" disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-300 ${
                          loading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
                        }`}>
                        {loading ? "Creating..." : "Continue to Profile Details →"}
                      </button>
                    </form>
                  )}

                  {/* ── STEP 2: Profile ── */}
                  {step === 2 && (
                    <form className="space-y-5" onSubmit={handleProfileSubmit}>

                      {/* Personal Info */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Gender</label>
                            <select name="gender" value={profileData.gender} onChange={handleProfileChange} className={inputClass}>
                              <option value="">Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Qualification</label>
                            <select name="qualification" value={profileData.qualification} onChange={handleProfileChange} className={inputClass}>
                              <option value="">Select qualification</option>
                              {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                            </select>
                          </div>
                          {profileData.qualification === "Others" && (
                            <div className="sm:col-span-2">
                              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Specify Qualification</label>
                              <input type="text" name="otherQualification" value={profileData.otherQualification}
                                onChange={handleProfileChange} placeholder="Enter your qualification" className={inputClass} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Location</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">City</label>
                            <input type="text" name="city" value={profileData.city} onChange={handleProfileChange}
                              placeholder="Your city" className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">State</label>
                            <input type="text" name="state" value={profileData.state} onChange={handleProfileChange}
                              placeholder="Your state" className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Country</label>
                            <input type="text" name="country" value={profileData.country} onChange={handleProfileChange}
                              placeholder="Your country" className={inputClass} />
                          </div>
                        </div>
                      </div>

                      {/* Skills & Bio */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Skills & Bio</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Skills</label>
                            <input type="text" name="skills" value={profileData.skills} onChange={handleProfileChange}
                              placeholder="e.g. JavaScript, React, Node.js (comma separated)" className={inputClass} />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate multiple skills with commas</p>
                          </div>
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Bio</label>
                            <textarea name="bio" value={profileData.bio} onChange={handleProfileChange} rows={3}
                              maxLength={500}
                              placeholder="Tell recruiters about yourself, your goals and strengths..."
                              className="block w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 resize-none" />
                            <p className="text-xs text-gray-400 mt-1 text-right">{profileData.bio.length}/500</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                          Continue →
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ── STEP 3: Additional Details ── */}
                  {step === 3 && (
                    <form className="space-y-5" onSubmit={handleProfileSubmit}>

                      {/* ── Job Category (extracted from UserUpdateProfile.jsx) ── */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Job Category</h3>
                        <JobCategory
                          selectedCategories={selectedCategories}
                          setSelectedCategories={setSelectedCategories}
                        />
                        <SelectedCategoryPreview
                          selectedCategories={selectedCategories}
                          setSelectedCategories={setSelectedCategories}
                        />
                      </div>

                      {/* ── Resume (extracted from UserUpdateProfile.jsx) ── */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Resume</h3>

                        <input
                          type="file"
                          id="resumeInput"
                          accept=".pdf, .doc, .docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        <div className="flex items-center gap-3">
                          <label
                            htmlFor="resumeInput"
                            className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap"
                          >
                            {resumeUploading ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                            ) : (
                              "Browse"
                            )}
                          </label>

                          <div className="flex-1 flex items-center justify-between border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 min-h-[40px]">
                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {resumeData.resumeOriginalName || "No file selected"}
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {resumeData.resume instanceof File && (
                                <button
                                  type="button"
                                  onClick={() => window.open(URL.createObjectURL(resumeData.resume), "_blank")}
                                  className="text-blue-600 hover:text-blue-800 text-xs font-semibold underline"
                                >
                                  View
                                </button>
                              )}
                              {resumeData.resumeOriginalName && (
                                <button
                                  type="button"
                                  onClick={removeResume}
                                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                                >
                                  ✖ Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1"><strong>Note:</strong> PDF or DOCX (.pdf, .docx) only. Max 10MB.</p>
                      </div>

                      {/* Experience */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Work Experience</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Do you have work experience?</p>
                        <div className="flex gap-3 mb-4">
                          <button type="button" onClick={() => setHasExperience(true)}
                            className={`px-5 py-2 text-sm rounded-lg border font-medium transition-colors ${
                              hasExperience === true
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                            }`}>
                            Yes
                          </button>
                          <button type="button" onClick={() => setHasExperience(false)}
                            className={`px-5 py-2 text-sm rounded-lg border font-medium transition-colors ${
                              hasExperience === false
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                            }`}>
                            No (Fresher)
                          </button>
                        </div>

                        {hasExperience === true && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div>
                              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Company Name</label>
                              <input type="text" name="companyName" value={experience.companyName} onChange={handleExpChange}
                                placeholder="e.g. Infosys" className={inputClass} />
                            </div>
                            <div>
                              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Job Profile / Role</label>
                              <input type="text" name="jobProfile" value={experience.jobProfile} onChange={handleExpChange}
                                placeholder="e.g. Software Engineer" className={inputClass} />
                            </div>
                            <div>
                              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Duration</label>
                              <input type="text" name="duration" value={experience.duration} onChange={handleExpChange}
                                placeholder="e.g. Jan 2022 – Dec 2023" className={inputClass} />
                            </div>
                            <div>
                              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Current CTC</label>
                              <input type="text" name="currentCTC" value={experience.currentCTC} onChange={handleExpChange}
                                placeholder="e.g. 6 LPA" className={inputClass} />
                            </div>
                            <div>
                              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Notice Period</label>
                              <select name="noticePeriod" value={experience.noticePeriod} onChange={handleExpChange} className={inputClass}>
                                <option value="">Select notice period</option>
                                {NOTICE_PERIODS.map((n) => <option key={n} value={n}>{n}</option>)}
                              </select>
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                              <input type="checkbox" id="currentlyWorking" name="currentlyWorking"
                                checked={experience.currentlyWorking} onChange={handleExpChange}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600" />
                              <label htmlFor="currentlyWorking" className="text-sm text-gray-700 dark:text-gray-300">Currently working here</label>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          ← Back
                        </button>
                        <button type="submit" disabled={loading}
                          className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-300 ${
                            loading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                          }`}>
                          {loading ? "Saving..." : "Save & Go to Profile →"}
                        </button>
                      </div>
                    </form>
                  )}


                </div>
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Signup;