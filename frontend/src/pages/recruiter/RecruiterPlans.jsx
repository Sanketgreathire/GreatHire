// import React, { useState } from "react";
// import { Briefcase, Zap, Crown, Check } from "lucide-react";
// import { FaStar } from "react-icons/fa";
// import { useSelector, useDispatch } from "react-redux";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import RecruiterFAQ from "../../components/RecruiterFAQ";

// import {
//   ORDER_API_END_POINT,
//   VERIFICATION_API_END_POINT,
// } from "@/utils/ApiEndPoint";
// import { razorpay_key_id } from "@/utils/RazorpayCredentials";
// import { addJobPlan } from "@/redux/jobPlanSlice";

// /* ================= SUBSCRIPTION PACKAGES ================= */
// const subscriptionPlans = [
//   {
//     id: "launchpad",
//     title: "Free Launchpad",
//     price: 0,
//     billing: "Free",
//     jobs: "2 Jobs",
//     jobCredits: 30,
//     resumes: "5 Credits / month",
//     isFree: true,
//     features: [
//       "2 Job Postings per month",
//       "5 Job Credits per month",
//       "Basic ATS",
//       "5 Resume Views / month",
//       "AI-generated Job Descriptions",
//     ],
//     cta: "Start Free",
//   },
//   {
//     id: "swift-hire",
//     title: "Standard",
//     price: 1,
//     billing: "Monthly",
//     jobs: "5 Jobs",
//     resumes: "50 Credits",
//     features: [
//       "5 Job Postings (30 days)",
//       "50 Resume Credits",
//       "WhatsApp & Email Invites",
//       "Verified Recruiter Badge",
//     ],
//     cta: "Upgrade Now",
//   },
//   {
//     id: "growth-engine",
//     title: "Premium (Most Popular)",
//     price: 2999,
//     billing: "Monthly",
//     jobs: "15 Jobs",
//     resumes: "300 Credits",
//     popular: true,
//     features: [
//       "15 Job Postings (60 days)",
//       "300 Resume Credits",
//       "Advanced AI Filters",
//       "Priority Listing (7 days)",
//       "Multi-user Login (3 recruiters)",
//       "HR Tool Integration",
//     ],
//     cta: "Go Professional",
//   },
//   {
//     id: "enterprise-elite",
//     title: "Enterprise Elite",
//     price: 24999,
//     billing: "Yearly",
//     jobs: "Unlimited",
//     resumes: "1,500 Credits / year",
//     enterprise: true,
//     features: [
//       "Unlimited Job Postings",
//       "1,500 Resume Credits / year",
//       "Homepage Employer Branding",
//       "Dedicated Account Manager",
//       "AI Headhunter Reports",
//     ],
//     cta: "Contact Sales",
//   },
// ];

// function RecruiterPlans() {
//   const { user } = useSelector((state) => state.auth);
//   const { company } = useSelector((state) => state.company);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ⭐ Premium selected by default
//   const [selectedPlanId, setSelectedPlanId] = useState(
//     subscriptionPlans.find((p) => p.popular)?.id
//   );

//   /* ============== PAYMENT FLOW ============== */
//   const initiateCreditPayment = async (plan) => {
//     try {
//       const res = await axios.post(
//         `${ORDER_API_END_POINT}/create-order-for-jobplan`,
//         {
//           planName: plan.title,
//           companyId: company._id,
//           amount: plan.price,
//           creditsForJobs: plan.creditsForJobs,
//           creditsForCandidates: plan.creditsForCandidates,
//         },
//         { withCredentials: true }
//       );

//       if (!window.Razorpay) {
//         toast.error("Razorpay SDK not loaded");
//         return;
//       }

//       const options = {
//         key: razorpay_key_id,
//         amount: res.data.amount,
//         currency: res.data.currency,
//         name: "GreatHire",
//         order_id: res.data.orderId,
//         handler: async (response) => {
//           const verify = await axios.post(
//             `${VERIFICATION_API_END_POINT}/verify-payment-for-jobplan`,
//             {
//               ...response,
//               companyId: company._id,
//               creditsForJobs: plan.creditsForJobs,
//               creditsForCandidates: plan.creditsForCandidates,
//             },
//             { withCredentials: true }
//           );

//           if (verify.data.success) {
//             dispatch(addJobPlan(verify.data.plan));
//             toast.success("Payment Successful");
//             navigate("/recruiter/dashboard/post-job");
//           }
//         },
//       };

//       new window.Razorpay(options).open();
//     } catch {
//       toast.error("Payment failed");
//     }
//   };

//   /* ============== CTA HANDLER ============== */
//   const handleSubscription = (plan) => {
//     if (plan.isFree) {
//       // Check if company has enough credits for free plan
//       if (company.creditedForJobs < 500) {
//         toast.error("Insufficient credits. Please purchase a plan to post jobs.");
//         return;
//       }
//       navigate("/recruiter/dashboard/post-job");
//       return;
//     }

//     if (plan.enterprise) {
//       navigate("/contact-sales");
//       return;
//     }

//     // Calculate credits based on plan
//     let creditsForJobs = 0;
//     if (plan.id === "swift-hire") {
//       creditsForJobs = 2500; // 5 jobs * 500 credits
//     } else if (plan.id === "growth-engine") {
//       creditsForJobs = 7500; // 15 jobs * 500 credits
//     } else if (plan.id === "enterprise-elite") {
//       creditsForJobs = 999999; // Unlimited
//     }

//     initiateCreditPayment({
//       title: plan.title,
//       price: plan.price,
//       creditsForJobs: creditsForJobs,
//       creditsForCandidates: plan.id === "swift-hire" ? 50 : plan.id === "growth-engine" ? 300 : 1500,
//     });
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Recruiter Plans | GreatHire</title>
//       </Helmet>

//       {company && user?.isActive && (
//         <div className="max-w-7xl mx-auto px-4 py-20">
//           {/* Credit Status Banner */}
//           <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold text-lg">Your Current Credits</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Job Credits: <span className="font-bold text-blue-600">{company.creditedForJobs || 0}</span> 
//                   {" "}(1 job = 500 credits) | 
//                   Candidate Credits: <span className="font-bold text-blue-600">{company.creditedForCandidates || 0}</span>
//                 </p>
//               </div>
//               {company.creditedForJobs < 500 && (
//                 <div className="text-sm text-red-600 font-medium">
//                   ⚠️ Insufficient credits to post jobs
//                 </div>
//               )}
//             </div>
//           </div>

//           <h2 className="text-3xl font-bold text-center mb-10">
//             Recruiter Subscription Plans
//           </h2>

//           <div className="grid md:grid-cols-4 gap-6 mb-20">
//             {subscriptionPlans.map((plan) => {
//               const isSelected = selectedPlanId === plan.id;

//               return (
//                 <div
//                   key={plan.id}
//                   onClick={() => setSelectedPlanId(plan.id)}
//                   className={`border rounded-xl p-6 bg-white shadow cursor-pointer transition-all duration-300
//                     ${
//                       isSelected
//                         ? "border-blue-500 ring-2 ring-blue-500 scale-[1.02]"
//                         : "hover:shadow-lg"
//                     }
//                   `}
//                 >
//                   {plan.popular && (
//                     <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
//                       MOST POPULAR
//                     </span>
//                   )}

//                   <h3 className="text-xl font-semibold mt-3">{plan.title}</h3>

//                   <p className="text-3xl font-bold">
//                     ₹{plan.price}
//                     <span className="text-sm text-gray-500">
//                       {" "}
//                       / {plan.billing}
//                     </span>
//                   </p>

//                   <p className="mt-3 font-medium">
//                     {plan.jobs} • {plan.resumes}
//                   </p>

//                   <ul className="mt-4 space-y-2 text-sm">
//                     {plan.features.map((f, idx) => (
//                       <li key={idx} className="flex gap-2">
//                         <Check size={16} className="text-green-500" />
//                         {f}
//                       </li>
//                     ))}
//                   </ul>

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleSubscription(plan);
//                     }}
//                     className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                   >
//                     {plan.cta}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-10 flex justify-center">
//             <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow">
//               <FaStar className="text-yellow-400" />
//               <span className="text-sm">Trusted by 10,000+ recruiters</span>
//             </div>
//           </div>
//           {/* FAQ section */}
//           <div className="mt-2">
//             <RecruiterFAQ />
//           </div>
//         </div>
//       )}
//       {/* Fallback: show FAQ and help section even if company/user not ready */}
//       {!(company && user?.isActive) && (
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <RecruiterFAQ />
//           {/* UpgradeHelpSection removed */}
//         </div>
//       )}
//     </>
//   );
// }

// export default RecruiterPlans;
import React, { useState } from "react";
import { Check } from "lucide-react";
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
  COMPANY_API_END_POINT,
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

/* ================= SERVICE / HIRING PLANS ================= */
const servicePlans = [
  
];

function RecruiterPlans() {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedPlanId, setSelectedPlanId] = useState(
    subscriptionPlans.find((p) => p.popular)?.id
  );

  /* ============== PAYMENT FLOW (UNCHANGED) ============== */
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

  /* ============== CTA HANDLER ================= */
  const handleSubscription = async (plan) => {
    if (plan.isFree) {
      // Check if user has already used free plan
      if (company.hasUsedFreePlan) {
        toast.error("You have already used the free plan. Please purchase a paid plan.");
        return;
      }
      
      // If they have 0 credits and haven't posted jobs, give them free plan credits
      if (company.creditedForJobs === 0 && company.creditedForCandidates === 0) {
        // Fetch updated company data to refresh Redux state
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

    // Service plans redirect to contact
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
    <>
      <Helmet>
        <title>Recruiter Plans | GreatHire</title>
      </Helmet>

      {company && user?.isActive && (
        <div className="max-w-7xl mx-auto px-4 py-20">

          {/* ================= SUBSCRIPTION SECTION ================= */}
          <h2 className="text-3xl font-bold text-center mb-10">
            Recruiter Subscription Plans
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {subscriptionPlans
              .filter(plan => !(plan.isFree && company.hasUsedFreePlan)) // Hide free plan if already used
              .map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className="border rounded-xl p-6 bg-white shadow hover:shadow-lg cursor-pointer"
              >
                {plan.popular && (
                  <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}

                <h3 className="text-xl font-semibold mt-3">{plan.title}</h3>

                <p className="text-3xl font-bold">
                  ₹{plan.price}{" "}
                  <span className="text-sm text-gray-500">
                    / {plan.billing}
                  </span>
                </p>

                <p className="mt-3 font-medium">
                  {plan.jobs} • {plan.resumes}
                </p>

                <ul className="mt-4 space-y-2 text-sm">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <Check size={16} className="text-green-500" />
                      {f}
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
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      {plan.cta}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/contact");
                      }}
                      className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
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
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>

        

          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow">
              <FaStar className="text-yellow-400" />
              <span className="text-sm">
                Trusted by 10,000+ recruiters
              </span>
            </div>
          </div>

          <RecruiterFAQ />
        </div>
      )}
    </>
  );
}

export default RecruiterPlans;
