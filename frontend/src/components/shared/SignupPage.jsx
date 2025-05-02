import joinBg from "@/assets/img121.jpeg";
import ReviewsSection from "../ui/ReviewsCarousel";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignupOption = (option) => {
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
        style={{ backgroundImage: `url(${joinBg})` }}
        className="min-h-screen bg-cover bg-center flex flex-col items-center w-full"
      >
        <div className="mt-12 w-full flex flex-col gap-9  ">
          <div className="flex flex-col-reverse md:flex-row gap-10 px-4 md:gap-20 justify-center items-center w-full">
            
            {/* Left Info Section */}
            <div className="font-[Oswald] text-center flex flex-col items-center md:w-2/1">
              <h2 className="text-3xl font-semibold text-gray-800 py-7"></h2>
              <div className="grid gap-9">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full shadow-md">
                    <span className="text-4xl text-blue-600">📢</span>
                  </div>
                  <p className="text-lg md:text-2xl font-medium text-gray-700">
                    Post a free job in a few minutes
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full shadow-md">
                    <span className="text-4xl text-blue-600">📞</span>
                  </div>
                  <p className="text-lg md:text-2xl font-medium text-gray-700">
                    Get direct phone calls from HR
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full shadow-md">
                    <span className="text-4xl text-blue-600">👔</span>
                  </div>
                  <p className="text-lg md:text-2xl font-medium text-gray-700">
                    Interview and hire the right staff
                  </p>
                </div>
              </div>
              <p className="text-center mt-14 text-2xl md:text-3xl font-bold text-gray-800">
                1000+ employers found success on GreatHire 🌟
              </p>
            </div>

            {/* Signup Form Box */}
            <div className=" bg-white w-full md:w-1/2 p-8 md:p-24 rounded-2xl shadow-lg text-center mt-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Join Great<span className="text-blue-700">Hire</span>
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleSignupOption("job")}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-all shadow-md"
                >
                  I'm looking for a Job
                </button>
                <button
                  onClick={() => handleSignupOption("recruiter")}
                  className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-900 transition-all shadow-md"
                >
                  I'm looking for Candidates
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-10 w-full ">
            <ReviewsSection />
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full mt-10 border-t border-gray-300 bg-white">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default SignupPage;
