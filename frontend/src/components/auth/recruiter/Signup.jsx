import React, { useState, useEffect, useRef } from "react";

const SLIDES = [
  { img: "/19276.webp",     stats: { top: "98%", topLabel: "Success Rate", bottom: "50k+", bottomLabel: "Active Jobs" } },
  { img: "/3320008.webp",  stats: { top: "10K+", topLabel: "Companies",    bottom: "1M+",  bottomLabel: "Candidates"  } },
  { img: "/971.webp",      stats: { top: "24/7", topLabel: "Support",      bottom: "98%",  bottomLabel: "Placement"   } },
];

const LeftCarousel = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[active];
  return (
    <div className="hidden md:flex w-[42%] relative overflow-hidden rounded-l-2xl">
      {/* Carousel images */}
      {SLIDES.map((slide, i) => (
        <img
          key={i}
          src={slide.img}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Top-right stat badge */}
      <div className="absolute top-6 right-6 bg-white rounded-2xl px-4 py-3 shadow-xl z-20">
        <h2 className="text-2xl font-bold text-[#2563eb]">{s.stats.top}</h2>
        <p className="text-xs text-gray-500">{s.stats.topLabel}</p>
      </div>

      {/* Bottom-left stat badge */}
      <div className="absolute bottom-6 left-6 bg-white rounded-2xl px-4 py-3 shadow-xl z-20">
        <h2 className="text-2xl font-bold text-[#22c55e]">{s.stats.bottom}</h2>
        <p className="text-xs text-gray-500">{s.stats.bottomLabel}</p>
      </div>

      {/* Text content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-8 w-full text-white">
        <h1 className="text-4xl font-bold leading-tight">Find Top Talent Fast</h1>
        <p className="mt-5 text-sm leading-7 text-white/80 max-w-sm">
          Post jobs, manage applications and hire efficiently with GreatHire Recruiter Platform.
        </p>
        <p className="mt-4 text-xs text-white/70 tracking-wide">10,000+ Companies Hiring</p>
        <div className="flex gap-8 mt-10">
          <div><h3 className="text-2xl font-bold">10K+</h3><p className="text-xs text-white/60 mt-1">Companies</p></div>
          <div><h3 className="text-2xl font-bold">1M+</h3><p className="text-xs text-white/60 mt-1">Candidates</p></div>
          <div><h3 className="text-2xl font-bold">24/7</h3><p className="text-xs text-white/60 mt-1">Support</p></div>
        </div>
        {/* Dots */}
        <div className="flex gap-2 mt-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === active ? "bg-white w-5" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { setUser, setRecruiterIsCompanyCreated } from "@/redux/authSlice";
import { addCompany } from "@/redux/companySlice";
import Footer from "@/components/shared/Footer";
import { RECRUITER_API_END_POINT, COMPANY_API_END_POINT, OTP_API_END_POINT } from "@/utils/ApiEndPoint";
import { validateSignupForm } from "@/utils/signupValidation";

const RESEND_COOLDOWN = 10;

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
      {verifying ? "Verifying..." : "Verify OTP"}
    </button>
  </div>
);

const RecruiterSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Account, 2 = Company
  const [loading, setLoading] = useState(false);

  // Step 1 — Account
  const [accountData, setAccountData] = useState({ fullname: "", email: "", phoneNumber: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [registeredUser, setRegisteredUser] = useState(null); // user from step 1 API
  const emailOtpRef = useRef(null);

  // Step 2 — Company
  const [companyData, setCompanyData] = useState({
    companyName: "", companyWebsite: "", industry: "",
    streetAddress: "", city: "", state: "", country: "", postalCode: "",
    email: "", phone: "", CIN: "", recruiterPosition: "", businessFile: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const t = setTimeout(() => setEmailCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [emailCooldown]);

  // ── Step 1 handlers ──
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "email") {
      setEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp("");
    }
  };

  const handleSendEmailOtp = async () => {
    if (!accountData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email first" }));
      return;
    }
    const disposableDomains = ["mailinator.com","guerrillamail.com","tempmail.com","yopmail.com","trashmail.com","maildrop.cc","fakeinbox.com","10minutemail.com","temp-mail.org","tempmail.io","minitts.net","fosil.pro","mailtemp.info","emailondeck.com","mohmal.com","dispostable.com","tempr.email","discard.email","spamgourmet.com","throwam.com"];
    const domain = accountData.email.split("@")[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      setErrors((prev) => ({ ...prev, email: "Disposable email addresses are not allowed. Please use a real work email." }));
      return;
    }
    setSendingEmailOtp(true);
    try {
      const res = await axios.post(`${OTP_API_END_POINT}/send-email`, { email: accountData.email }, { timeout: 20000 });
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
      const res = await axios.post(`${OTP_API_END_POINT}/verify-email`, { email: accountData.email, otp: emailOtp });
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

  const handleAccountNext = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(accountData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!emailVerified) {
      toast.error("Please verify your email before continuing.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${RECRUITER_API_END_POINT}/register`, { ...accountData }, { withCredentials: true });
      if (res.data.success) {
        toast.success("Account created ✅");
        dispatch(setUser(res.data.user));
        setRegisteredUser(res.data.user);
        setCompanyData((prev) => ({ ...prev, recruiterPosition: res.data.user?.position || "" }));
        setStep(2);
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 handlers ──
  const handleCompanyChange = (e) => {
    setCompanyData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const allowedTypes = [
      "image/jpeg", "image/png", "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, PDF, or Word documents are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB.");
      return;
    }
    setCompanyData((prev) => ({ ...prev, businessFile: file }));
    setFileUploaded(false);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); setFileUploaded(true); return 100; }
        return prev + 10;
      });
    }, 200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userEmail = registeredUser?.emailId?.email;
      const formPayload = new FormData();
      Object.entries(companyData).forEach(([key, value]) => {
        if (value !== "" && value !== null) formPayload.append(key, value);
      });
      formPayload.append("userEmail", userEmail);

      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setRecruiterIsCompanyCreated(true));
        toast.success("Company registered! Post your first job.");
        navigate("/recruiter/dashboard/post-job");
      } else {
        toast.error(res.data.message || "Error creating company");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <div className="relative z-10 flex-1 flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-400 px-8 py-3">
          <h2 className="text-4xl font-bold">
            <span className="text-black dark:text-white">Great</span>
            <span className="text-blue-600">Hire</span>
          </h2>
        </header>

        <div className="min-h-screen bg-[#f5f7fb] dark:bg-gray-950 flex flex-col items-center justify-center px-4 pt-24 pb-10">

          {/* Main Card */}
          <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex">

            {/* Left Side — image carousel background */}
            <LeftCarousel />

            {/* Right Side — existing signup form */}
            <div className="w-full md:w-[58%] bg-white dark:bg-gray-900">

            {/* Step indicator */}
            <div className="flex">
              {["Account Details", "Company Details"].map((label, i) => (
                <div
                  key={i}
                  className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
                    step > i + 1
                      ? "bg-green-500 text-white"
                      : step === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step > i + 1 ? `✓ ${label}` : `${i + 1}. ${label}`}
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-6">
              <div className="text-center mb-3">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Great<span className="text-blue-600 dark:text-blue-400">Hire</span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {step === 1 ? "Create your recruiter account" : "Set up your company profile"}
                </p>
                {step === 1 && (
                  <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/recruiter-login")} className="cursor-pointer underline font-semibold hover:text-blue-800 dark:hover:text-blue-300">
                      Log In
                    </span>
                  </p>
                )}
              </div>

              {/* ── STEP 1: Account ── */}
              {step === 1 && (
                <form className="space-y-5" onSubmit={handleAccountNext}>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Full Name</label>
                    <input
                      type="text" name="fullname" value={accountData.fullname} onChange={handleAccountChange}
                      placeholder="Enter your full name" required
                      className="block w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">
                      Work Email {emailVerified && <span className="ml-2 text-green-500 text-xs font-semibold">✔ Verified</span>}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="email" name="email" value={accountData.email} onChange={handleAccountChange}
                        placeholder="Enter your work email" required disabled={emailVerified}
                        className="block flex-1 px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-60"
                      />
                      {!emailVerified && (
                        <button
                          type="button" onClick={handleSendEmailOtp}
                          disabled={sendingEmailOtp || emailCooldown > 0}
                          className="ml-2 px-3 py-2.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors whitespace-nowrap"
                        >
                          {sendingEmailOtp ? "Sending..." : emailCooldown > 0 ? `Resend (${emailCooldown}s)` : emailOtpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                      )}
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    {emailOtpSent && !emailVerified && (
                      <>
                        <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">OTP sent to your email</p>
                        <OtpInput value={emailOtp} onChange={setEmailOtp} onVerify={handleVerifyEmailOtp} verifying={verifyingEmail} inputRef={emailOtpRef} />
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Company Contact Number</label>
                    <input
                      type="text" name="phoneNumber" value={accountData.phoneNumber} onChange={handleAccountChange}
                      placeholder="10-digit phone number" required
                      className="block w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"} name="password" value={accountData.password} onChange={handleAccountChange}
                        placeholder="Min 8 characters" required
                        className="block w-full pl-3 pr-16 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 text-xs hover:text-gray-700 dark:hover:text-gray-200">
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={accountData.confirmPassword} onChange={handleAccountChange}
                        placeholder="Re-enter your password" required
                        className="block w-full pl-3 pr-16 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 text-xs hover:text-gray-700 dark:hover:text-gray-200">
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    {!errors.confirmPassword && accountData.confirmPassword && accountData.password === accountData.confirmPassword && (
                      <p className="text-green-500 text-xs mt-1">✔ Passwords match</p>
                    )}
                  </div>

                  <button
                    type="submit" disabled={loading || !emailVerified}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                  >
                    {loading ? "Creating Account..." : "Continue to Company Details →"}
                  </button>
                  {!emailVerified && (
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">Verify your email to continue</p>
                  )}
                </form>
              )}

              {/* ── STEP 2: Company ── */}
              {step === 2 && (
                <form className="space-y-3" onSubmit={handleCompanySubmit}>
                  {/* Company Information */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Company Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">Company Name *</label>
                        <input type="text" name="companyName" value={companyData.companyName} onChange={handleCompanyChange} required
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">Company Website *</label>
                        <input type="url" name="companyWebsite" value={companyData.companyWebsite} onChange={handleCompanyChange} required
                          placeholder="https://example.com"
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">Industry *</label>
                        <input type="text" name="industry" value={companyData.industry} onChange={handleCompanyChange} required
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { name: "streetAddress", label: "Street Address", required: true },
                        { name: "city", label: "City", required: true },
                        { name: "state", label: "State", required: true },
                        { name: "postalCode", label: "Postal Code", required: true },
                        { name: "country", label: "Country", required: true },
                      ].map(({ name, label, required }) => (
                        <div key={name}>
                          <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">{label}{required && " *"}</label>
                          <input type="text" name={name} value={companyData[name]} onChange={handleCompanyChange} required={required}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">Business Email *</label>
                        <input type="email" name="email" value={companyData.email} onChange={handleCompanyChange} required
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">Phone Number *</label>
                        <input type="text" name="phone" value={companyData.phone} onChange={handleCompanyChange} required
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Verification */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Verification Details</h3>
                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">CIN/EAN <span className="font-bold">(Optional)</span></label>
                      <input type="text" name="CIN" value={companyData.CIN} onChange={handleCompanyChange}
                        placeholder="Corporate Identification Number"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                    </div>
                    <div className="mt-2">
                      <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">Upload Business Registration Certificate</label>
                      <div
                        {...getRootProps()}
                        className={`relative border-2 border-dashed border-blue-500 px-4 py-3 rounded-lg flex items-center justify-center cursor-pointer transition-all ${isDragActive ? "bg-blue-100 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-800"} hover:bg-blue-50 dark:hover:bg-blue-900/10`}
                      >
                        <input {...getInputProps()} />
                        {uploadProgress > 0 ? (
                          <div className="w-12">
                            <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`}
                              styles={buildStyles({ textColor: "#3b82f6", pathColor: "#3b82f6", trailColor: "#d1d5db" })} />
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-xs text-center">
                            {isDragActive ? "Drop the file here..." : "Drag & drop or click to upload (JPG, PNG, PDF, Word)"}
                          </p>
                        )}
                      </div>
                      {companyData.businessFile && (
                        <p className="mt-1 text-green-500 text-xs">✓ {companyData.businessFile.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Recruiter Details */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Your Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">Your Position *</label>
                        <input type="text" name="recruiterPosition" value={companyData.recruiterPosition} onChange={handleCompanyChange} required
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-xs mb-0.5">Your Mobile Number</label>
                        <input type="text" value={accountData.phoneNumber} readOnly
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                    {loading ? "Creating Company..." : "Create Company & Post Job →"}
                  </button>
                </form>
              )}
            </div>
            </div>{/* end right side */}
          </div>{/* end main card */}

          {/* How to Get Started */}
          <div className="mt-20 w-full max-w-6xl text-center">
            <h2 className="text-4xl font-bold text-[#0f172a] dark:text-white">How to Get Started</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Join thousands of recruiters hiring top talent in just a few simple steps.</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-12">
              {[
                { n: "01", title: "Create Account", desc: "Set up your recruiter account in minutes" },
                { n: "02", title: "Company Profile", desc: "Build a compelling company profile" },
                { n: "03", title: "Post Jobs", desc: "Publish job openings effortlessly" },
                { n: "04", title: "Review Applications", desc: "Manage candidate submissions efficiently" },
                { n: "05", title: "Hire Top Talent", desc: "Connect with qualified candidates quickly" },
              ].map(({ n, title, desc }) => (
                <div key={n} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center mx-auto text-sm font-bold">{n}</div>
                  <h3 className="font-semibold mt-5 text-sm dark:text-white">{title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-5">{desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-10 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-lg text-sm font-medium shadow-md transition"
            >
              Get Started Now
            </button>
          </div>

        </div>{/* end outer wrapper */}

        <Footer />
      </div>
    </div>
  );
};

export default RecruiterSignup;
