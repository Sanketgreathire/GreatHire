import ReviewsSection from "../ui/ReviewsCarousel";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignupOption = (option) => {
    console.log(`Selected option: ${option}`);
    if (option === "recruiter") {
      navigate("/recruiter/signup");
    } else if (option === "job") {
      navigate("/signup");
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
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

            {/* Job Seeker Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <span className="text-4xl">👔</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  For Job Seekers
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">
                  Discover your dream job and take the next step in your career
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Get direct phone calls from HR</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Apply to thousands of jobs instantly</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Track your applications easily</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSignupOption("job")}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
              >
                Sign Up as Job Seeker
              </motion.button>
            </motion.div>

            {/* Recruiter Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <span className="text-4xl">📢</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  For Recruiters
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">
                  Find the perfect candidates for your organization
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Post jobs for free in minutes</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Access qualified candidates instantly</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">Interview and hire the right staff</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSignupOption("recruiter")}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400 dark:focus:ring-gray-600"
              >
                Sign Up as Recruiter
              </motion.button>
            </motion.div>
          </div>

          {/* Success Stats */}
          <motion.div
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
          </motion.div>
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