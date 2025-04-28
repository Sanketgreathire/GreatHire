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
      navigate("/signup"); // or whatever route you intend
    }
  };
  
  return (
    <>
    <div
      style={{ backgroundImage: `url(${joinBg})` }}
      className="inset-0 absolute opacity-200 bg-cover bg-center z-50 flex flex-col items-center justify-content overflow-y-auto w-full"
    >
      
      <div className="mt-12 w-full max-w-9xl flex-col gap-9 lg:px-14">
        <div className="flex flex-items gap-2 justify-center w-full lg:gap-20 md:flex-row flex-cols-reverse">
          <div className="font-[Oswald] text-center justify-content d-flex flex flex-col items-center md:w-1/4 mt-5">
            <h2 className="text-3xl font-semibold text-gray-800 py-7"></h2>
            <div className="grid text-center justify-content gap-9">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full shadow-md">
                  <span className="text-4xl text-blue-600">📢</span>
                </div>
                <p className="text-2xl font-medium text-gray-700 whitespace-nowrap">
                  Post a free job in a few minutes
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full shadow-md">
                  <span className="text-4xl text-blue-600">📞</span>
                </div>
                <p className="text-2xl font-medium text-gray-700 whitespace-nowrap">
                  Get direct phone calls from HR
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full shadow-md">
                  <span className="text-4xl text-blue-600">👔</span>
                </div>
                <p className="text-2xl font-medium text-gray-700 whitespace-nowrap">
                  Interview and hire the right staff
                </p>
              </div>
            </div>
            <p className="text-center mt-14 text-3xl font-bold text-gray-800 whitespace-nowrap w-screen">
              1000+ employers found success on GreatHire 🌟
            </p>
          </div>

          <div className="tracking-wide mb-10 mt-10 text-center bg-white md:w-4/4 p-20 ml-20 rounded-2xl shadow-lg transform translate-x-20" style={{ backgroundImage: "url('/img.jpeg')" }}>
            <h2 className="text-4xl font-bold text-gray-800 p-2 mb-2 -mt-6">
              Join Great<span className="text-blue-700">Hire</span>
            </h2>
            <div className="space-y-3">
              <button onClick={() => handleSignupOption("job")} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md mt-4">
                I'm looking for a Job
              </button>
              <button onClick={() => handleSignupOption("recruiter")} className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-all shadow-md">
                I'm looking for Candidates
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-20 w-full max-w-9xl flex-col gap-9 lg:px-14">

          <ReviewsSection />
        </div>
      </div>

      <footer className="w-full mt-9 border-gray-300 bg-white">
        <Footer />
      </footer>
    </div>
    </>
  );
};

export default SignupPage;
