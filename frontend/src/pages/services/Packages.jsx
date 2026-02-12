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
    id: "launchpad",
    title: "Free Launchpad",
    price: 0,
    billing: "Free",
    jobs: "2 Jobs",
    resumes: "5 Credits / month",
    isFree: true,
    features: [
      "2 Job Postings per month",
      "Basic ATS",
      "5 Resume Views / month",
      "AI-generated Job Descriptions",
    ],
    cta: "Start Free",
  },
  {
    id: "swift-hire",
    title: "Standard",
    price: 999,
    billing: "Monthly",
    jobs: "5 Jobs",
    resumes: "50 Credits",
    features: [
      "5 Job Postings (30 days)",
      "50 Resume Credits",
      "WhatsApp & Email Invites",
    ],
    cta: "Upgrade Now",
  },
  {
    id: "growth-engine",
    title: "Premium (Most Popular)",
    price: 2999,
    billing: "Monthly",
    jobs: "15 Jobs",
    resumes: "300 Credits",
    popular: true,
    features: [
      "15 Job Postings (60 days)",
      "300 Resume Credits",
      "Advanced AI Filters",
      "Priority Listing (7 days)",
      "Multi-user Login (3 recruiters)",
      "HR Tool Integration",
    ],
    cta: "Go Professional",
  },
  {
    id: "enterprise-elite",
    title: "Enterprise Elite",
    price: 24999,
    billing: "Yearly",
    jobs: "Unlimited",
    resumes: "1,500 Credits / year",
    enterprise: true,
    features: [
      "Unlimited Job Postings",
      "1,500 Resume Credits / year",
      "Homepage Employer Branding",
      "Dedicated Account Manager",
      "AI Headhunter Reports",
    ],
    cta: "Buy Now",
  },
  {
    id: "full-cycle-rpo",
    title: "Full-Cycle RPO",
    price: "8.33%",
    billing: "Per Hire",
    jobs: "End-to-End Hiring",
    resumes: "Unlimited",
    features: [
      "Complete sourcing to offer management",
      "Technical & HR screening",
      "Salary negotiation & closure",
      "Free replacement within 90 days",
      "Dedicated recruitment team",
    ],
    extraInfo: [
      "Fee: 8.33% of annual gross CTC",
      "₹5,000 sourcing advance (non-refundable)",
    ],
    cta: "Contact Sales",
  },
  {
    id: "monthly-talent-partner",
    title: "Monthly Talent Partner",
    price: 10000,
    billing: "Monthly Retainer",
    jobs: "Up to 3 Hires",
    resumes: "Managed Hiring",
    features: [
      "Dedicated recruiter",
      "Up to 3 successful hires per month",
      "Fixed predictable cost",
      "Ideal for startups & GCCs",
    ],
    extraInfo: ["₹10,000 per month", "1 month advance required"],
    cta: "Talk to RPO Expert",
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
        <title>Premium Job Posting Packages at Reasonable Prices | Hire More Quickly - GreatHire</title>
        <meta
          name="description"
          content="Select flexible and economical premium job posting packages to expedite your success in recruitment. Our recruitment solutions assist organizations in posting jobs, looking up authentic candidate databases, and recruiting quickly with optimum ROI and clarity on prices. Counted on by thousands of HR professionals, we provide scalable recruitment solutions for startups, SMEs, and corporate entities to grow their employee base effectively. Operating from Hyderabad State in India, our recruitment services and solutions address the recruitment challenges of local firms as well as organizations across the nation with our innovative solutions and qualified talent pool ready for recruitment."
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
