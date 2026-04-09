import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { validateSignupForm } from "@/utils/signupValidation";

const INPUT_CLS =
  "block w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500";
const LABEL_CLS = "block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5";
const SECTION_LABEL_CLS = "text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest";

export default function StudentSignup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    inputReferralCode: "",
    collegeName: "",
    rollNo: "",
    cgpa: "",
    stream: "",
    hometown: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        { ...formData },
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success("Account created successfully ✅");
        dispatch(setUser(res.data.user));
        navigate("/profile");
      } else {
        toast.error(res?.data?.message || "Signup failed ❌");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error, please try again ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-10 transition-colors duration-300">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Logo + Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Great<span className="text-blue-600">Hire</span>
            </h1>
          </Link>
          <div className="mt-4 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-blue-500/30">
            🎓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">Student Sign Up</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Register as a campus student to explore placement opportunities
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Personal Info ── */}
            <p className={SECTION_LABEL_CLS}>Personal Information</p>

            <div>
              <label className={LABEL_CLS}>Full Name <span className="text-blue-600 dark:text-blue-400">*</span></label>
              <input name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Enter your full name" className={INPUT_CLS} />
              {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Email <span className="text-blue-600 dark:text-blue-400">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={INPUT_CLS} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className={LABEL_CLS}>Mobile Number <span className="text-blue-600 dark:text-blue-400">*</span></label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="10-digit mobile" className={INPUT_CLS} />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Password <span className="text-blue-600 dark:text-blue-400">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className={INPUT_CLS + " pr-16"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs font-medium transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className={LABEL_CLS}>Referral Code <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input name="inputReferralCode" value={formData.inputReferralCode} onChange={handleChange} placeholder="Enter referral code if you have one" className={INPUT_CLS} />
            </div>

            {/* ── College Info ── */}
            <p className={SECTION_LABEL_CLS + " pt-2"}>College Information</p>

            <div>
              <label className={LABEL_CLS}>College Name</label>
              <input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="e.g. IIT Bombay" className={INPUT_CLS} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Roll No</label>
                <input name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="e.g. 20CS001" className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>CGPA</label>
                <input type="number" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="e.g. 8.5" min="0" max="10" step="0.1" className={INPUT_CLS} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Stream / Branch</label>
                <input name="stream" value={formData.stream} onChange={handleChange} placeholder="e.g. Computer Science & Engineering" className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>Hometown</label>
                <input name="hometown" value={formData.hometown} onChange={handleChange} placeholder="e.g. Jaipur, Rajasthan" className={INPUT_CLS} />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 mt-2 ${
                loading
                  ? "opacity-70 cursor-not-allowed bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/jobseeker-login")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors underline cursor-pointer"
            >
              Log In
            </span>
          </p>
        </div>

        <p className="text-center mt-5">
          <Link to="/" className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 text-xs transition-colors">
            ← Back to GreatHire
          </Link>
        </p>
      </div>
    </div>
  );
}
