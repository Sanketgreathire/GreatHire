import React, { useState } from "react";
import { Briefcase, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaStar } from "react-icons/fa";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";


function Packges() {
  const plans = [
    {
      title: "Free 1 Job Posting",
      creditsForJobs: 0,
      creditsForCandidates: 0,
      price: 0,
      originalPrice: 500,
      perJob: 0,
      discount: "Flat 100% Off",
      icon: <FaRocket />,
      borderColor: "border-blue-300",
      selectedBorderColor: "ring-2 ring-blue-500",

    },
    {
      title: "1 x Premium Job",
      creditsForJobs: 500,
      creditsForCandidates: 15,
      price: 250,
      originalPrice: 500,
      perJob: 250,
      discount: "Flat 50% Off",
      icon: <Briefcase />,
      borderColor: "border-blue-300",
      selectedBorderColor: "ring-2 ring-blue-500",

    },
    {
      title: "5 x Premium Jobs",
      creditsForJobs: 2500,
      creditsForCandidates: 50,
      price: 925,
      originalPrice: 2500,
      perJob: 185,
      discount: "Flat 63% Off",
      icon: <Zap />,
      borderColor: "ring-indigo-300",
      selectedBorderColor: "ring-2 ring-indigo-600",

    },
    {
      title: "10 x Premium Jobs",
      creditsForJobs: 5000,
      creditsForCandidates: 100,
      price: 1500,
      originalPrice: 5000,
      perJob: 150,
      discount: "Flat 70% Off",
      recommended: true,
      icon: <Crown />,
      borderColor: "border-purple-300",
      selectedBorderColor: "ring-2 ring-purple-500",
    },
  ];
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(plans[1].title);



  // Handles plan selection by updating state
  const handleSelectPlan = (planTitle) => {
    setSelectedPlan(planTitle);
  };

  // Handles plan purchase flow
  const purchasePlan = (plan) => {
    handleSelectPlan(plan.title);
    try {
      initiatePayment(plan);
    } catch (err) { }
  };

  return (
    <>

      <Helmet>
        <title>Affordable Premium Job Posting Packages | Recruit Faster in Hyderabad</title>
        <meta
          name="description"
          content="Choose flexible and cost-effective premium job posting packages designed to accelerate your hiring success. Our recruitment platform helps employers post jobs, access verified candidate databases, and hire faster with transparent pricing and maximum ROI. Trusted by thousands of recruiters, we offer scalable plans for startups, SMEs, and enterprises looking to grow their teams efficiently. Based in Hyderabad State, India, our recruitment solutions support local businesses and nationwide hiring needs with reliable technology, expert support, and industry-ready talent. Start recruiting smarter today with premium job credits that deliver real results."
        />
      </Helmet>


      <Navbar />
      <div className="min-h-screen  py-8 px-4 flex items-center justify-center pt-20">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Select Your Recruitment Solution
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              Scale your hiring process with our industry-leading platform
            </p>
            <h2 className="text-center text-2xl font-bold mb-6">💎 Premium Job Plans</h2>
          </div>


          <div className="grid md:grid-cols-3 gap-6 justify-center">
            {plans.map((plan, index) => {
              const isSelected = selectedPlan === plan.title;

              return (

                <div
                  key={index}
                  className={`relative bg-white rounded-xl shadow-md p-6 border-2 transition-all duration-300 cursor-pointer ${isSelected ? plan.selectedBorderColor : plan.borderColor
                    }`}
                  onClick={() => handleSelectPlan(plan.title)}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                      RECOMMENDED FOR YOU
                    </div>
                  )}

                  {/* Icon */}
                  <div className="flex justify-center mb-4 text-4xl">{plan.icon}</div>

                  <h3 className="text-lg font-semibold mb-2 text-center">{plan.title}</h3>
                  <p className="text-sm text-gray-500 mb-1 text-center">🪙 {plan.creditsForJobs} Credits for Job Postings</p>
                  <p className="text-sm text-gray-500 mb-1 text-center">🪙 {plan.creditsForCandidates} Credits for Database</p>
                  <p className="text-2xl font-bold text-gray-800 mb-1 text-center">₹ {plan.price}</p>

                  {plan.originalPrice && (
                    <p className="text-sm text-gray-400 line-through text-center">₹ {plan.originalPrice}</p>
                  )}

                  <p className="text-sm mt-2 text-center">✨ ₹{plan.perJob} per job</p>
                  {plan.discount && (
                    <p className="text-green-600 text-sm mt-1 text-center">⬇ {plan.discount}</p>
                  )}

                  <button
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                    onClick={() => navigate("/recruiter/signup")}

                  >
                    Buy Now
                  </button>

                  <p className="text-xs text-gray-400 mt-2 text-center">To be used within 30 days</p>
                </div>

              );
            })}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-2 shadow-sm">
              <FaStar className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-600">
                Trusted by 10,000+ recruitment teams worldwide
              </span>
            </div>
          </div>
        </div>
      </div>

      <Footer />

    </>
  );
}

export default Packges;
