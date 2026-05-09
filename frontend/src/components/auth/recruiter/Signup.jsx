import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { setUser, setRecruiterIsCompanyCreated } from "@/redux/authSlice";
import { addCompany } from "@/redux/companySlice";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { RECRUITER_API_END_POINT, COMPANY_API_END_POINT, OTP_API_END_POINT } from "@/utils/ApiEndPoint";
import { validateSignupForm } from "@/utils/signupValidation";

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
  const [accountData, setAccountData] = useState({ fullname: "", email: "", phoneNumber: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
    setSendingEmailOtp(true);
    try {
      const res = await axios.post(`${OTP_API_END_POINT}/send-email`, { email: accountData.email });
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
        <Navbar />

        <div className="flex justify-center w-full py-8 sm:py-16 mt-6 px-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">

            {/* Step indicator */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {["Account Details", "Company Details"].map((label, i) => (
                <div
                  key={i}
                  className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
                    step === i + 1
                      ? "bg-blue-600 text-white"
                      : step > i + 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step > i + 1 ? "✓ " : `${i + 1}. `}{label}
                </div>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
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
                <form className="space-y-6" onSubmit={handleCompanySubmit}>
                  {/* Company Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Company Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Company Name *</label>
                        <input type="text" name="companyName" value={companyData.companyName} onChange={handleCompanyChange} required
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Company Website *</label>
                        <input type="url" name="companyWebsite" value={companyData.companyWebsite} onChange={handleCompanyChange} required
                          placeholder="https://example.com"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Industry *</label>
                        <input type="text" name="industry" value={companyData.industry} onChange={handleCompanyChange} required
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "streetAddress", label: "Street Address", required: true },
                        { name: "city", label: "City", required: true },
                        { name: "state", label: "State", required: true },
                        { name: "postalCode", label: "Postal Code", required: true },
                        { name: "country", label: "Country", required: true },
                      ].map(({ name, label, required }) => (
                        <div key={name}>
                          <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">{label}{required && " *"}</label>
                          <input type="text" name={name} value={companyData[name]} onChange={handleCompanyChange} required={required}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Business Email *</label>
                        <input type="email" name="email" value={companyData.email} onChange={handleCompanyChange} required
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Phone Number *</label>
                        <input type="text" name="phone" value={companyData.phone} onChange={handleCompanyChange} required
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                    </div>
                  </div>

                  {/* Verification */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Verification Details</h3>
                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">CIN/EAN <span className="font-bold">(Optional)</span></label>
                      <input type="text" name="CIN" value={companyData.CIN} onChange={handleCompanyChange}
                        placeholder="Corporate Identification Number"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                    </div>
                    <div className="mt-4">
                      <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Upload Business Registration Certificate</label>
                      <div
                        {...getRootProps()}
                        className={`relative border-2 border-dashed border-blue-500 p-4 rounded-lg h-36 flex items-center justify-center cursor-pointer transition-all ${isDragActive ? "bg-blue-100 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-800"} hover:bg-blue-50 dark:hover:bg-blue-900/10`}
                      >
                        <input {...getInputProps()} />
                        {uploadProgress > 0 ? (
                          <div className="w-16">
                            <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`}
                              styles={buildStyles({ textColor: "#3b82f6", pathColor: "#3b82f6", trailColor: "#d1d5db" })} />
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                            {isDragActive ? "Drop the file here..." : "Drag & drop or click to upload (JPG, PNG, PDF, Word)"}
                          </p>
                        )}
                      </div>
                      {companyData.businessFile && (
                        <p className="mt-2 text-green-500 text-sm text-center">File ready: {companyData.businessFile.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Recruiter Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Your Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Your Position *</label>
                        <input type="text" name="recruiterPosition" value={companyData.recruiterPosition} onChange={handleCompanyChange} required
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-blue-500" />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-1">Your Mobile Number</label>
                        <input type="text" value={accountData.phoneNumber} readOnly
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      ← Back
                    </button>
                    <button type="submit" disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                      {loading ? "Creating Company..." : "Create Company & Post Job →"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default RecruiterSignup;
