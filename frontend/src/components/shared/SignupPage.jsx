import ReviewsSection from "../ui/ReviewsCarousel";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignupOption = (option) => {
    console.log(`Selected option: ${option}`);
    if (option === "recruiter") {
      navigate("/recruiter/signup");
    } else if (option === "job") {
      navigate("/signup");
    } else if (option === "college") {
      navigate("/college/signup");
    } else if (option === "student") {
      navigate("/student/signup");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-900 pt-24 pb-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                <span className="font-['Oswald'] uppercase">JOIN GREATHIRE TODAY</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
                Connect with opportunities or find the perfect talent
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch min-w-0">

            {/* Job Seeker Card */}
            <div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👔</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    For Job Seekers
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Discover your dream job and take the next step in your career
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    "Get direct phone calls from HR",
                    "Apply to thousands of jobs instantly",
                    "Track your applications easily",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSignupOption("job")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg whitespace-nowrap"
              >
                Sign Up as Job Seeker
              </button>
            </div>

            {/* Recruiter Card */}
            <div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📢</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    For Recruiters
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Find the perfect candidates for your organization
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    "Post jobs for free in minutes",
                    "Access qualified candidates instantly",
                    "Interview and hire the right staff",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSignupOption("recruiter")}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-sm shadow-lg whitespace-nowrap"
              >
                Sign Up as Recruiter
              </button>
            </div>

            {/* College TPO Card */}
            <div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🏫</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    For Colleges TPO
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Connect your students with top recruiters via campus hiring
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    "Manage campus placement drives",
                    "Partner with leading companies",
                    "Track student placement outcomes",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSignupOption("college")}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm shadow-lg whitespace-nowrap"
              >
                Sign Up as College TPO
              </button>
            </div>

            {/* Student Card */}
            <div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    For College / Student
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Kickstart your career through campus placement opportunities
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    "Access exclusive campus job drives",
                    "Get noticed by top recruiters",
                    "Build your profile and get hired",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSignupOption("student")}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold text-sm shadow-lg whitespace-nowrap"
              >
                College / Student Signup
              </button>
            </div>

          </div>

          {/* Success Stats */}
          <div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 md:p-12 text-center shadow-xl transition-colors duration-300"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              1000+ employers found success on GreatHire
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 transition-colors duration-300">
                <p className="text-4xl font-bold text-white mb-2">10K+</p>
                <p className="text-blue-100 dark:text-blue-200">Active Job Seekers</p>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 transition-colors duration-300">
                <p className="text-4xl font-bold text-white mb-2">5K+</p>
                <p className="text-blue-100 dark:text-blue-200">Jobs Posted</p>
              </div>
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 transition-colors duration-300">
                <p className="text-4xl font-bold text-white mb-2">95%</p>
                <p className="text-blue-100 dark:text-blue-200">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="testimonials-section" className="py-7">
          <ReviewsSection />
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default SignupPage;