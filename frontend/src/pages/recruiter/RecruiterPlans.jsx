import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Check, ArrowLeft, Award, Zap, Shield, TrendingUp } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import RecruiterFAQ from "../../components/RecruiterFAQ";
import Navbar from "@/components/shared/Navbar";
import DashboardNavigations from "./DashboardNavigations";
import Footer from "@/components/shared/Footer";
import {
  ORDER_API_END_POINT,
  VERIFICATION_API_END_POINT,
  COMPANY_API_END_POINT,
  REVENUE_API_END_POINT,
  RECRUITER_API_END_POINT,
} from "@/utils/ApiEndPoint";
import { razorpay_key_id } from "@/utils/RazorpayCredentials";
import { addJobPlan } from "@/redux/jobPlanSlice";
import { addCompany } from "@/redux/companySlice";
import { updateUserPlan } from "@/redux/authSlice";

/* ================= COLOR MAPS (module-level, never recreated) ================= */
const BORDER_COLOR = {
  gray:   "border-gray-300 dark:border-gray-600",
  blue:   "border-blue-400 dark:border-blue-500",
  purple: "border-purple-500 dark:border-purple-400",
  orange: "border-orange-400 dark:border-orange-500",
  gold:   "border-yellow-400 dark:border-yellow-500",
  teal:   "border-teal-400 dark:border-teal-500",
};

const BADGE_BG = {
  gray:   "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  blue:   "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  gold:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  teal:   "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
};

const PLAN_CREDITS = {
  growth: { creditsForJobs: 5,  creditsForCandidates: 500  },
  scale:  { creditsForJobs: 10, creditsForCandidates: 1500 },
  pro:    { creditsForJobs: 25, creditsForCandidates: 5000 },
};

const PLAN_MAP = { STANDARD: "growth", PREMIUM: "scale", PRO: "pro", ENTERPRISE: "enterprise" };

const RPO_IDS = new Set(["full-cycle-rpo", "monthly-talent-partner", "partnership"]);
const subscriptionPlans = [
  {
    id: "starter",
    title: "Starter Plan",
    price: 0,
    billing: "Forever Free",
    jobs: "1 Job / 3 months",
    resumes: "20 Applications",
    isFree: true,
    bestFor: "Best for trying the platform",
    features: [
      "1 Job Posting every 3 months",
      "Access to first 20 applications per job",
      "Basic Search Filters",
      "1 User",
      "No AI Features",
    ],
    cta: "Start Free",
    color: "gray",
  },
  {
    id: "growth",
    title: "Growth Plan",
    price: 1999,
    billing: "month",
    jobs: "5 Jobs",
    resumes: "500 Candidates",
    bestFor: "Best for: Startups hiring 1–3 roles/month",
    features: [
      "5 Job Postings",
      "500 Candidates Database Access",
      "1 User",
      "Basic Filters +1",
      "1,000 Email Support",
    ],
    cta: "Upgrade Now",
    color: "blue",
  },
  {
    id: "scale",
    title: "Scale Plan",
    price: 2999,
    billing: "month",
    jobs: "10 Jobs",
    resumes: "1,500 Candidates",
    popular: true,
    bestFor: "Best for: Teams hiring consistently",
    features: [
      "10 Job Postings",
      "1,500 Candidates Database Access",
      "3 Users",
      "AI Candidate Matching",
      "AI JD Creation",
      "Smart Filters & Shortlisting",
      "Hire 3x faster",
      "Save 50–70% hiring cost",
      "3,000 Email Support",
    ],
    cta: "Get Started",
    color: "purple",
  },
  {
    id: "pro",
    title: "Pro Plan",
    price: 4999,
    billing: "month",
    jobs: "25 Jobs",
    resumes: "5,000 Candidates",
    bestFor: "For companies scaling aggressively",
    features: [
      "25 Job Postings",
      "5,000 Candidates Database Access",
      "5 Users",
      "AI JD Creation",
      "AI Candidate Matching",
      "Advanced Analytics Dashboard",
      "Priority Support",
      "Interview Tracking",
      "Replace external recruiters",
      "Build in-house hiring engine",
      "10,000 Email Support",
    ],
    cta: "Go Pro",
    color: "orange",
  },
  {
    id: "enterprise",
    title: "Enterprise Plan",
    price: 30000,
    billing: "year",
    jobs: "Unlimited",
    resumes: "Unlimited",
    enterprise: true,
    bestFor: "Best for: High-volume hiring companies",
    features: [
      "Unlimited Job Postings",
      "Unlimited Users (Role-based access)",
      "Dedicated Relationship Manager",
      "AI JD Creation + AI Matching",
      "Full Analytics Dashboard",
      "Custom Hiring Workflows",
      "Unlimited Email Support",
    ],
    cta: "Buy Now",
    color: "gold",
  },
  {
    id: "full-cycle-rpo",
    title: "Full-Cycle RPO",
    price: "8.33%",
    billing: "Per Hire",
    jobs: "End-to-End Hiring",
    resumes: "Unlimited",
    bestFor: "For companies that want zero hiring hassle",
    features: [
      "Complete sourcing to offer management",
      "Technical & HR screening",
      "Salary negotiation & closure",
      "Free replacement within 90 days",
      "Dedicated recruitment team",
      "Unlimited Email Support",
    ],
    extraInfo: [
      "Fee: 8.33% of annual gross CTC",
      "₹5,000 sourcing advance (non-refundable)",
    ],
    cta: "Contact Sales",
    color: "teal",
  },
];

const PlanBadge = ({ planId, user }) => {
  if (!user || String(user.role).toUpperCase() === "ADMIN") return null;
  if (user.subscriptionStatus !== "ACTIVE") return null;
  if (PLAN_MAP[user.plan] !== planId) return null;

  if (user.plan === "STANDARD") return (
    <span className="absolute top-3 right-3 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-[10px] font-bold px-2 py-1 rounded-full">VERIFIED</span>
  );
  if (user.plan === "PREMIUM") return (
    <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">⭐ MOST POPULAR</span>
  );
  if (user.plan === "ENTERPRISE") return (
    <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-lg shadow-lg">👑 ENTERPRISE ELITE</span>
  );
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
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

  // Refresh user plan info once on mount — only if recruiter and plan not yet loaded
  useEffect(() => {
    if (!user || user.role !== "recruiter" || !user._id) return;
    if (user.subscriptionStatus === "ACTIVE") return; // already up to date
    axios.get(`${RECRUITER_API_END_POINT}/recruiter-by-id/${user._id}`, { withCredentials: true })
      .then(res => {
        if (res?.data?.success && res?.data?.recruiter) {
          dispatch(updateUserPlan({
            plan: res.data.recruiter.plan || "FREE",
            subscriptionStatus: res.data.recruiter.subscriptionStatus || "INACTIVE"
          }));
        }
      })
      .catch(() => {});
  }, [user?._id]);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initiateCreditPayment = useCallback(async (plan) => {
    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) { toast.error("Razorpay SDK failed to load."); return; }

      const res = await axios.post(
        `${ORDER_API_END_POINT}/create-order-for-jobplan`,
        { planName: plan.title, companyId: company._id, amount: plan.price, creditsForJobs: plan.creditsForJobs, creditsForCandidates: plan.creditsForCandidates },
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
            { ...response, companyId: company._id, creditsForJobs: plan.creditsForJobs, creditsForCandidates: plan.creditsForCandidates },
            { withCredentials: true }
          );
          if (verify.data.success) {
            dispatch(addJobPlan(verify.data.plan));
            if (verify.data.userPlan) dispatch(updateUserPlan({ plan: verify.data.userPlan, subscriptionStatus: "ACTIVE" }));

            const companyRes = await axios.post(
              `${COMPANY_API_END_POINT}/company-by-userid`,
              { userId: user._id },
              { withCredentials: true }
            );
            if (companyRes?.data.success) dispatch(addCompany(companyRes.data.company));

            await axios.post(`${REVENUE_API_END_POINT}/store-revenue`, {
              itemDetails: { itemType: "Job Plan", itemName: plan.title, price: plan.price },
              companyName: company?.companyName,
              userDetails: { userName: user?.fullname, email: user.emailId.email, phoneNumber: user.phoneNumber.number },
            });

            toast.success("Payment Successful");
            if (!user.isActive || !companyRes?.data?.company?.isActive) {
              setShowVerificationBanner(true);
            } else {
              navigate("/recruiter/dashboard/home");
            }
          }
        },
      };
      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment failed");
    }
  }, [company, user, dispatch, navigate, loadRazorpayScript]);

  const handleSubscription = useCallback(async (plan) => {
    if (RPO_IDS.has(plan.id)) { navigate("/contact"); return; }
    if (!user) { toast.error("Please login to purchase a plan."); navigate("/recruiter/signup"); return; }
    if (!company) { toast.error("Please complete company profile first."); navigate("/recruiter/company-profile"); return; }

    if (plan.isFree && company.hasSubscription) { toast.error("You already have a paid plan. Free plan is not available."); return; }

    if (plan.isFree) {
      if (company.hasUsedFreePlan) { toast.error("You have already used the free plan. Please purchase a paid plan."); return; }
      if (company.creditedForJobs === 0 && company.creditedForCandidates === 0) {
        try {
          const response = await axios.post(`${COMPANY_API_END_POINT}/company-by-userid`, { userId: user._id }, { withCredentials: true });
          if (response?.data.success) {
            dispatch(addCompany(response?.data.company));
            toast.success("Free plan activated! You now have 1 job post every 3 months.");
            navigate("/recruiter/dashboard/post-job");
          }
        } catch { toast.error("Failed to activate free plan. Please try again."); }
        return;
      }
      if (company.creditedForJobs < 500) { toast.error("Insufficient credits. Please purchase a plan to post jobs."); return; }
      navigate("/recruiter/dashboard/post-job");
      return;
    }

    if (plan.enterprise) {
      initiateCreditPayment({ title: plan.title, price: plan.price, creditsForJobs: 999999, creditsForCandidates: 999999 });
      return;
    }

    const credits = PLAN_CREDITS[plan.id] || { creditsForJobs: 5, creditsForCandidates: 500 };
    initiateCreditPayment({ title: plan.title, price: plan.price, ...credits });
  }, [company, user, dispatch, navigate, initiateCreditPayment]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Helmet>
        <title>Recruiter Plans | GreatHire</title>
      </Helmet>

      <Navbar />

      {/* Verification Pending Banner — shown after payment for unverified recruiters */}
      {showVerificationBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="text-5xl mb-4">🕐</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Plan Purchased Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your account and company are currently under admin verification. Once verified, you will be able to access all the features included in your plan.
            </p>
            <button
              onClick={() => navigate("/recruiter/dashboard/home")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Layout wrapper with sidebar and main content */}
      <div className="flex">
        {/* Dashboard Navigation - Only show for logged-in recruiters */}
        {isRecruiter && <DashboardNavigations />}

        {/* Main Content */}
        <div className={`flex-1 min-w-0 ${isRecruiter ? "lg:ml-52" : ""}`}>
          {/* ================= ANIMATED HERO SECTION ================= */}
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white -mt-[117px] pt-[117px] pb-6 overflow-hidden">
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

            {/* ================= PRICING CARDS ================= */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {subscriptionPlans.map((plan) => {
                  const borderColor = BORDER_COLOR[plan.color] || "border-gray-200";
                  const badgeBg = BADGE_BG[plan.color] || "bg-gray-100 text-gray-600";

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative border-2 ${borderColor} rounded-2xl p-6 bg-white dark:bg-slate-900 shadow hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col ${
                        plan.popular ? "ring-2 ring-purple-500 dark:ring-purple-400" : ""
                      }`}
                    >
                      {/* Popular badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                            ⭐ MOST POPULAR
                          </span>
                        </div>
                      )}

                      {/* Current plan badge for starter */}
                      {plan.isFree && company && !company.hasSubscription && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-gray-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                            ✓ CURRENT PLAN
                          </span>
                        </div>
                      )}

                      {/* Plan name + bestFor */}
                      <div className="mb-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeBg}`}>
                          {plan.title}
                        </span>
                        {plan.bestFor && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                            {plan.bestFor}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        {plan.isFree ? (
                          <div>
                            <span className="text-4xl">₹0</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Forever Free</span>
                          </div>
                        ) : typeof plan.price === "number" ? (
                          <div>
                            <span className="text-4xl">₹{plan.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ {plan.billing}</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-4xl">{plan.price}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ {plan.billing}</span>
                          </div>
                        )}
                      </div>

                      {/* Jobs & Candidates summary */}
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-medium">
                          📋 {plan.jobs}
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-medium">
                          👥 {plan.resumes}
                        </span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 text-sm flex-1 mb-4">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{f}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Extra info (RPO) */}
                      {plan.extraInfo && (
                        <ul className="mb-4 space-y-1">
                          {plan.extraInfo.map((info, i) => (
                            <li key={i} className="text-xs text-gray-500 dark:text-gray-400 italic">{info}</li>
                          ))}
                        </ul>
                      )}

                      {/* CTA Button(s) */}
                      {plan.enterprise ? (
                        <div className="space-y-2 mt-auto">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSubscription(plan); }}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-lg transition-colors duration-300"
                          >
                            {plan.cta}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate("/contact"); }}
                            className="w-full bg-gray-600 dark:bg-slate-700 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors duration-300 text-sm"
                          >
                            Contact Sales
                          </button>
                        </div>
                      ) : plan.isFree && company && !company.hasSubscription ? (
                        <button
                          disabled
                          className="mt-auto w-full font-semibold py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        >
                          ✓ Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSubscription(plan); }}
                          className={`mt-auto w-full font-semibold py-2.5 rounded-lg transition-colors duration-300 ${
                            plan.popular
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {plan.cta}
                        </button>
                      )}
                    </div>
                  );
                })}
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
      <Footer />
    </div>
  );
}

export default RecruiterPlans;