import React, { useState } from "react";
import { Briefcase, Zap, Crown, Check } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import RecruiterFAQ from "../../components/RecruiterFAQ";

import {
  ORDER_API_END_POINT,
  VERIFICATION_API_END_POINT,
} from "@/utils/ApiEndPoint";
import { razorpay_key_id } from "@/utils/RazorpayCredentials";
import { addJobPlan } from "@/redux/jobPlanSlice";

/* ================= SUBSCRIPTION PACKAGES ================= */
const subscriptionPlans = [
  {
    id: "launchpad",
    title: "Free Launchpad",
    price: 0,
    billing: "Free",
    jobs: "2 Jobs",
    jobCredits: 30,
    resumes: "5 Downloads / month",
    isFree: true,
    features: [
      "2 Job Postings per month",
      "5 Job Credits per month",
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
    resumes: "50 Downloads",
    features: [
      "5 Job Postings (30 days)",
      "50 Resume Downloads",
      "WhatsApp & Email Invites",
      "Verified Recruiter Badge",
    ],
    cta: "Upgrade Now",
  },
  {
    id: "growth-engine",
    title: "Premium (Most Popular)",
    price: 2999,
    billing: "Monthly",
    jobs: "15 Jobs",
    resumes: "300 Downloads",
    popular: true,
    features: [
      "15 Job Postings (60 days)",
      "300 Resume Downloads",
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
    resumes: "1,500 / year",
    enterprise: true,
    features: [
      "Unlimited Job Postings",
      "1,500 Resume Downloads / year",
      "Homepage Employer Branding",
      "Dedicated Account Manager",
      "AI Headhunter Reports",
    ],
    cta: "Contact Sales",
  },
];

function RecruiterPlans() {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ⭐ Premium selected by default
  const [selectedPlanId, setSelectedPlanId] = useState(
    subscriptionPlans.find((p) => p.popular)?.id
  );

  /* ============== PAYMENT FLOW ============== */
  const initiateCreditPayment = async (plan) => {
    try {
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

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded");
        return;
      }

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
            toast.success("Payment Successful");
            navigate("/recruiter/dashboard/post-job");
          }
        },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment failed");
    }
  };

  /* ============== CTA HANDLER ============== */
  const handleSubscription = (plan) => {
    if (plan.isFree) {
      navigate("/recruiter/dashboard/post-job");
      return;
    }

    if (plan.enterprise) {
      navigate("/contact-sales");
      return;
    }

    initiateCreditPayment({
      title: plan.title,
      price: plan.price,
      creditsForJobs: plan.jobs === "Unlimited" ? 999999 : 1000,
      creditsForCandidates: 100,
    });
  };

  return (
    <>
      <Helmet>
        <title>Recruiter Plans | GreatHire</title>
      </Helmet>

      {company && user?.isActive && (
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-10">
            Recruiter Subscription Plans
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {subscriptionPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`border rounded-xl p-6 bg-white shadow cursor-pointer transition-all duration-300
                    ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500 scale-[1.02]"
                        : "hover:shadow-lg"
                    }
                  `}
                >
                  {plan.popular && (
                    <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  )}

                  <h3 className="text-xl font-semibold mt-3">{plan.title}</h3>

                  <p className="text-3xl font-bold">
                    ₹{plan.price}
                    <span className="text-sm text-gray-500">
                      {" "}
                      / {plan.billing}
                    </span>
                  </p>

                  <p className="mt-3 font-medium">
                    {plan.jobs} • {plan.resumes}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex gap-2">
                        <Check size={16} className="text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscription(plan);
                    }}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow">
              <FaStar className="text-yellow-400" />
              <span className="text-sm">Trusted by 10,000+ recruiters</span>
            </div>
          </div>
          {/* FAQ section */}
          <div className="mt-2">
            <RecruiterFAQ />
          </div>
        </div>
      )}
      {/* Fallback: show FAQ and help section even if company/user not ready */}
      {!(company && user?.isActive) && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <RecruiterFAQ />
          {/* UpgradeHelpSection removed */}
        </div>
      )}
    </>
  );
}

export default RecruiterPlans;
  