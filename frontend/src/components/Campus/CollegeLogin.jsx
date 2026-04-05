import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { COLLEGE_API_END_POINT } from "@/utils/ApiEndPoint";

export default function CollegeLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${COLLEGE_API_END_POINT}/login`, formData, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        sessionStorage.setItem("college", JSON.stringify(res.data.college));
        navigate("/college-details");
      } else {
        toast.error(res.data.message || "Login failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">

      {/* Background blobs — same as GreatHire home */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Great<span className="text-blue-600">Hire</span>
            </h1>
          </Link>
          <div className="mt-4 w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-blue-500/30">
            🎓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">College Portal</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to view your placement dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">
                College Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tpo@yourcollege.ac.in"
                className="block w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className="block w-full px-4 py-2.5 pr-16 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500"
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
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                loading
                  ? "opacity-70 cursor-not-allowed bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Signing in…" : "Sign In to Dashboard"}
            </button>
          </form>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
            New college?{" "}
            <Link to="/college/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors underline">
              Register here
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
