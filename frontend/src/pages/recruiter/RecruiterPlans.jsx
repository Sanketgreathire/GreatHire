import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, ChevronDown, TrendingUp, Award, Users, Zap, Shield, Clock, BarChart3, Target } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import RecruiterFAQ from "../../components/RecruiterFAQ";
import Navbar from "@/components/shared/Navbar";
import DashboardNavigations from "./DashboardNavigations";

import {
  ORDER_API_END_POINT,
  VERIFICATION_API_END_POINT,
  COMPANY_API_END_POINT,
  REVENUE_API_END_POINT,
} from "@/utils/ApiEndPoint";
import { razorpay_key_id } from "@/utils/RazorpayCredentials";
import { addJobPlan } from "@/redux/jobPlanSlice";
import { addCompany } from "@/redux/companySlice";

/* ================= SUBSCRIPTION PLANS ================= */
const subscriptionPlans = [
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
  // {
  //   id: "monthly-talent-partner",
  //   title: "Monthly Talent Partner",
  //   price: 10000,
  //   billing: "Monthly Retainer",
  //   jobs: "Up to 3 Hires",
  //   resumes: "Managed Hiring",
  //   features: [
  //     "Dedicated recruiter",
  //     "Up to 3 successful hires per month",
  //     "Fixed predictable cost",
  //     "Ideal for startups & GCCs",
  //   ],
  //   extraInfo: ["₹10,000 per month", "1 month advance required"],
  //   cta: "Talk to RPO Expert",
  // },
];

const PlanBadge = ({ planId, user }) => {
  if (window.location.pathname.startsWith("/admin")) {
    return null;
  }

  if (!user) return null;

  if (user.role && String(user.role).toUpperCase() === "ADMIN") {
    return null;
  }

  if (user.subscriptionStatus !== "ACTIVE") return null;

  const planMap = {
    STANDARD: "swift-hire",
    PREMIUM: "growth-engine",
    ENTERPRISE: "enterprise-elite",
  };

  if (planMap[user.plan] !== planId) return null;

  if (user.plan === "STANDARD") {
    return (
      <span className="absolute top-3 right-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-[10px] font-bold px-2 py-1 rounded-full">
        VERIFIED
      </span>
    );
  }

  if (user.plan === "PREMIUM") {
    return (
      <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
        ⭐ MOST POPULAR
      </span>
    );
  }

  if (user.plan === "ENTERPRISE") {
    return (
      <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-lg shadow-lg">
        👑 ENTERPRISE ELITE
      </span>
    );
  }

  return null;
};

function RecruiterPlans() {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isRecruiter = user?.role === "recruiter";

  const [selectedPlanId, setSelectedPlanId] = useState(
    subscriptionPlans.find((p) => p.popular)?.id
  );
  const [showComparison, setShowComparison] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const initiateCreditPayment = async (plan) => {
    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error("Razorpay SDK failed to load.");
        return;
      }
      const res = await axios.post(
        `${ORDER_API_END_POINT}/create-order-for-jobplan`,
        {
          planName: plan.title,
          companyId: company._id,
          amount: plan.price,
          creditsForJobs: plan.creditsForJobs,
          creditsForCandidates: plan.creditsForCandidates,
        },
        { withCredentials: true }
      );

      const options = {
        key: razorpay_key_id,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "GreatHire",
        order_id: res.data.orderId,
        handler: async (response) => {
          const verify = await axios.post(
            `${VERIFICATION_API_END_POINT}/verify-payment-for-jobplan`,
            {
              ...response,
              companyId: company._id,
              creditsForJobs: plan.creditsForJobs,
              creditsForCandidates: plan.creditsForCandidates,
            },
            { withCredentials: true }
          );

          if (verify.data.success) {
            dispatch(addJobPlan(verify.data.plan));
            
            // Refresh company data to update credits
            const companyRes = await axios.post(
              `${COMPANY_API_END_POINT}/company-by-userid`,
              { userId: user._id },
              { withCredentials: true }
            );
            if (companyRes?.data.success) {
              dispatch(addCompany(companyRes.data.company));
            }
            
            // Store revenue record
            await axios.post(`${REVENUE_API_END_POINT}/store-revenue`, {
              itemDetails: {
                itemType: "Job Plan",
                itemName: plan.title,
                price: plan.price,
              },
              companyName: company?.companyName,
              userDetails: {
                userName: user?.fullname,
                email: user.emailId.email,
                phoneNumber: user.phoneNumber.number,
              },
            });
            
            toast.success("Payment Successful");
            navigate("/recruiter/dashboard/home");
          }
        },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment failed");
    }
  };

  const handleSubscription = async (plan) => {
    if (["full-cycle-rpo", "monthly-talent-partner", "partnership"].includes(plan.id)) {
      navigate("/contact");
      return;
    }
    if (!user) {
      toast.error("Please login to purchase a plan.");
      navigate("/recruiter/signup");
      return;
    }

    if (!company) {
      toast.error("Please complete company profile first.");
      navigate("/recruiter/company-profile");
      return;
    }

    if (!user.isActive) {
      toast.error("Your account is not active.");
      return;
    }

    if (plan.isFree) {
      if (company.hasUsedFreePlan) {
        toast.error("You have already used the free plan. Please purchase a paid plan.");
        return;
      }

      if (company.creditedForJobs === 0 && company.creditedForCandidates === 0) {
        try {
          const response = await axios.post(
            `${COMPANY_API_END_POINT}/company-by-userid`,
            { userId: user._id },
            { withCredentials: true }
          );
          if (response?.data.success) {
            dispatch(addCompany(response?.data.company));
            toast.success("Free plan activated! You now have 2 job posts and 5 candidate views.");
            navigate("/recruiter/dashboard/post-job");
          }
        } catch (err) {
          console.error("Error fetching company:", err);
          toast.error("Failed to activate free plan. Please try again.");
        }
        return;
      }

      if (company.creditedForJobs < 500) {
        toast.error("Insufficient credits. Please purchase a plan to post jobs.");
        return;
      }
      navigate("/recruiter/dashboard/post-job");
      return;
    }

    if (plan.enterprise) {
      let creditsForJobs = 999999;
      initiateCreditPayment({
        title: plan.title,
        price: plan.price,
        creditsForJobs,
        creditsForCandidates: 1500,
      });
      return;
    }

    if (["full-cycle-rpo", "monthly-talent-partner", "partnership"].includes(plan.id)) {
      navigate("/contact");
      return;
    }

    let creditsForJobs = plan.id === "swift-hire" ? 2500 : 7500;

    initiateCreditPayment({
      title: plan.title,
      price: plan.price,
      creditsForJobs,
      creditsForCandidates: plan.id === "swift-hire" ? 50 : 300,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Helmet>
        <title>Recruiter Plans | GreatHire</title>
      </Helmet>

      <Navbar />

      {/* Layout wrapper with sidebar and main content */}
      <div className="flex">
        {/* Dashboard Navigation - Only show for logged-in recruiters */}
        {isRecruiter && <DashboardNavigations />}

        {/* Main Content */}
        <div className="flex-1">
          {/* ================= ANIMATED HERO SECTION ================= */}
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white pt-20 pb-6 overflow-hidden transition-colors duration-300">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
              {/* Mobile Back Button */}
              {user && (
                <button
                  onClick={() => navigate(-1)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors mb-8 backdrop-blur-sm"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Back</span>
                </button>
              )}

              {/* Hero Content */}
              <div className="text-center mb-2">
                <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-500/50 backdrop-blur-sm">
                  ✨ Transparent Pricing, No Hidden Fees
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="pb-4 block">Recruiters</span>
                  Hiring Plans That <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Scale With You</span>
                </h1>

                <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                  Find top talent faster with AI-powered tools. Start free, upgrade anytime. Pay only for what you use.
                </p>          
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-16">

            {/* ================= PRICING TOGGLE + DESCRIPTION ================= */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Simple, Transparent Pricing
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 transition-colors duration-300">
                Choose the plan that fits your hiring needs. Upgrade or downgrade anytime.
              </p>

              {/* Plan Selection Indicator */}
              <div className="flex justify-center gap-2 mb-8">
                <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold transition-colors duration-300">
                  💰 Save up to 20% on yearly plans
                </span>
              </div>
            </div>

            {/* ================= PRICING CARDS (ORIGINAL) ================= */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {subscriptionPlans
                .filter(plan => !(plan.isFree && company?.hasUsedFreePlan))
                .map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className="border border-gray-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900 shadow hover:shadow-lg cursor-pointer transition-all duration-300"
                  >
                    {plan.popular && (
                      <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    )}

                    <h3 className="text-xl font-semibold mt-3 text-gray-900 dark:text-white transition-colors duration-300">
                      {plan.title}
                    </h3>

                    <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                      ₹{plan.price}{" "}
                      <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        / {plan.billing}
                      </span>
                    </p>

                    <p className="mt-3 font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      {plan.jobs} • {plan.resumes}
                    </p>

                    <ul className="mt-4 space-y-2 text-sm">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <Check size={16} className="text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.enterprise ? (
                      <div className="mt-6 space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubscription(plan);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300"
                        >
                          {plan.cta}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/contact");
                          }}
                          className="w-full bg-gray-600 dark:bg-slate-700 hover:bg-gray-700 dark:hover:bg-slate-600 text-white py-2 rounded-lg transition-colors duration-300"
                        >
                          Contact Sales
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscription(plan);
                        }}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300"
                      >
                        {plan.cta}
                      </button>
                    )}
                  </div>
                ))}
            </div>

            {/* ================= FEATURES HIGHLIGHT ================= */}
            <div className="my-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  🚀 Packed With Features
                </h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Everything you need to hire smarter
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800 transition-colors duration-300">
                  <Zap className="text-blue-600 dark:text-blue-400 mb-3 transition-colors duration-300" size={28} />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Lightning Fast</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">Find qualified candidates in minutes, not days</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-6 border border-purple-200 dark:border-purple-800 transition-colors duration-300">
                  <TrendingUp className="text-purple-600 dark:text-purple-400 mb-3 transition-colors duration-300" size={28} />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Data-Driven</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">Get insights with advanced analytics dashboard</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-6 border border-green-200 dark:border-green-800 transition-colors duration-300">
                  <Shield className="text-green-600 dark:text-green-400 mb-3 transition-colors duration-300" size={28} />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Secure & Verified</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">All candidates verified with background checks</p>
                </div>
              </div>
            </div>

            {/* ================= FINAL CTA ================= */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 rounded-2xl px-8 py-12 text-white text-center mb-16 transition-colors duration-300">
              <Award className="mx-auto mb-4 text-yellow-300" size={40} />
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
              <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
                Join 10,000+ recruiters using GreatHire. Start free, no credit card required.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => {
                    if (user) {
                      navigate("/recruiter/dashboard/post-job");
                    } else {
                      navigate("/recruiter/signup");
                    }
                  }}
                  className="bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  {user ? "📊 Go to Dashboard" : "🚀 Get Started Free"}
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  💬 Talk to Sales
                </button>
              </div>
            </div>

            {/* ================= FAQ ================= */}
            <RecruiterFAQ />

            {/* ================= TRUST BADGES ================= */}
            <div className="my-12 pt-8 border-t border-gray-200 dark:border-slate-700 transition-colors duration-300">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 transition-colors duration-300">Trusted by leading companies</p>
                <div className="flex justify-center items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">10,000+ Active Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="text-blue-600 dark:text-blue-400 transition-colors duration-300" size={20} />
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Industry Award Winner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="text-green-600 dark:text-green-400 transition-colors duration-300" size={20} />
                    <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">ISO 27001 Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterPlans;