import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { COLLEGE_API_END_POINT } from "@/utils/ApiEndPoint";

const INPUT_CLS = "block w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500";
const LABEL_CLS = "block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5";
const SECTION_LABEL_CLS = "text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest";

export default function CollegeSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    website: "",
    tpo: "",
    tpoEmail: "",
    tpoPhone: "",
    naac: "",
    established: "",
    type: "",
  });

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.collegeName || !formData.email || !formData.password) {
      toast.error("College name, email and password are required.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${COLLEGE_API_END_POINT}/register`, formData, { withCredentials: true });
      if (res.data.success) {
        toast.success("College registered successfully!");
        sessionStorage.setItem("college", JSON.stringify(res.data.college));
        navigate("/college-details");
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-10 transition-colors duration-300">

      {/* Background blobs — same as GreatHire home */}
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">Register Your College</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Create a placement dashboard for your institution</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Basic Info ── */}
            <p className={SECTION_LABEL_CLS}>Basic Information</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>College Short Name <span className="text-blue-600 dark:text-blue-400">*</span></label>
                <input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="e.g. IIT Bombay" className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Indian Institute of Technology Bombay" className={INPUT_CLS} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>College Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className={INPUT_CLS}>
                  <option value="">Select type</option>
                  {["IIT", "NIT", "BITS", "State University", "Private", "Deemed", "Other"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>NAAC Grade</label>
                <input name="naac" value={formData.naac} onChange={handleChange} placeholder="e.g. A++" className={INPUT_CLS} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Established Year</label>
                <input type="number" name="established" value={formData.established} onChange={handleChange} placeholder="e.g. 1958" className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>Website</label>
                <input name="website" value={formData.website} onChange={handleChange} placeholder="www.yourcollege.ac.in" className={INPUT_CLS} />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="City, State – Pincode" className={INPUT_CLS} />
            </div>

            {/* ── TPO Info ── */}
            <p className={SECTION_LABEL_CLS + " pt-2"}>Training & Placement Officer</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>TPO Name</label>
                <input name="tpo" value={formData.tpo} onChange={handleChange} placeholder="Dr. Name" className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>TPO Email</label>
                <input type="email" name="tpoEmail" value={formData.tpoEmail} onChange={handleChange} placeholder="tpo@college.ac.in" className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>TPO Phone</label>
                <input name="tpoPhone" value={formData.tpoPhone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={INPUT_CLS} />
              </div>
            </div>

            {/* ── Account Credentials ── */}
            <p className={SECTION_LABEL_CLS + " pt-2"}>Account Credentials</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Email <span className="text-blue-600 dark:text-blue-400">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@yourcollege.ac.in" className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>Phone Number</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="10-digit mobile" className={INPUT_CLS} />
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
              {loading ? "Registering…" : "Register & Go to Dashboard"}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
            Already registered?{" "}
            <Link to="/college/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors underline">
              Sign in here
            </Link>
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
