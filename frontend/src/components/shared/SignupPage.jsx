
// SignupPage.js

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
      <div
        style={{
          background: "linear-gradient(90deg, #1CB5E0 -10%, #000851 100%)",
        }}
        className="min-h-screen w-full flex flex-col items-center"
      >
        <div className="mt-20 w-full flex flex-col gap-9">
          <div className="flex flex-col-reverse md:flex-row gap-10 px-4 md:gap-20 justify-center items-center w-full">

            {/* Left Info Section */}
            <div className="font-[Oswald] text-center flex flex-col items-center max-w-lg">
              <h2 className="text-3xl font-semibold text-white py-7"></h2>
              <div className="grid gap-9">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-md">
                    <span className="text-4xl">📢</span>
                  </div>
                  {/* 4. UI Problem: Dark background par dark text dikhega nahi. White kar diya. */}
                  <p className="text-lg md:text-2xl font-medium text-white text-left">
                    Post a free job in a few minutes
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-md">
                    <span className="text-4xl">📞</span>
                  </div>
                  <p className="text-lg md:text-2xl font-medium text-white text-left">
                    Get direct phone calls from HR
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-md">
                    <span className="text-4xl">👔</span>
                  </div>
                  <p className="text-lg md:text-2xl font-medium text-white text-left">
                    Interview and hire the right staff
                  </p>
                </div>
              </div>
              <p className="text-center mt-14 text-2xl md:text-3xl font-bold text-white">
                1000+ employers found success on GreatHire 🌟
              </p>
            </div>

            {/* Signup Form Box */}

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              // Changed max-w-md to a smaller value or removed it
              className="bg-white/80 backdrop-blur-xl w-full max-w-sm p-10 md:p-12 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/50">

              <h2 className="text-center text-4xl md:text-5xl font-bold mb-10 text-gray-800">
                Join Great
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Hire
                </span>
              </h2>

              <div className="space-y-5">
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => handleSignupOption("job")}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/40 transition-shadow duration-400 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Job Seekers
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => handleSignupOption("recruiter")}
                  className="w-full py-4 bg-gray-800 text-white rounded-xl shadow-lg hover:bg-gray-900 hover:shadow-xl hover:shadow-gray-800/40 transition-all duration-300 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-gray-400"
                >
                  Recruiters
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <div className="pt-10 w-full ">
            <ReviewsSection />
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full mt-10 border-t border-gray-700 bg-white">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default SignupPage;
