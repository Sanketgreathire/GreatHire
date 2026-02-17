// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Check } from "lucide-react";

// const RecruiterPlansHome = () => {
//   const navigate = useNavigate();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const plans = [
//     {
//       id: "launchpad",
//       title: "Free Launchpad",
//       price: 0,
//       billing: "Free",
//       jobs: "2 Jobs",
//       resumes: "5 Credits",
//       features: [
//         "2 Job Postings per month",
//         "Basic ATS",
//         "5 Resume Views / month",
//       ],
//     },
//     {
//       id: "swift-hire",
//       title: "Standard",
//       price: 999,
//       billing: "Monthly",
//       jobs: "5 Jobs",
//       resumes: "50 Credits",
//       features: [
//         "5 Job Postings (30 days)",
//         "50 Resume Credits",
//         "Verified Recruiter Badge",
//       ],
//     },
//     {
//       id: "growth-engine",
//       title: "Premium",
//       price: 2999,
//       billing: "Monthly",
//       jobs: "15 Jobs",
//       resumes: "300 Credits",
//       popular: true,
//       features: [
//         "15 Job Postings (60 days)",
//         "300 Resume Credits",
//         "Advanced AI Filters",
//         "Multi-user Login",
//       ],
//     },
//     {
//       id: "enterprise-elite",
//       title: "Enterprise Elite",
//       price: 24999,
//       billing: "Yearly",
//       jobs: "Unlimited",
//       resumes: "1,500 Credits",
//       features: [
//         "Unlimited Job Postings",
//         "1,500 Resume Credits / year",
//         "Dedicated Account Manager",
//       ],
//     },
//     {
//       id: "full-cycle-rpo",
//       title: "Full-Cycle RPO",
//       price: "8.33%",
//       billing: "Per Hire",
//       jobs: "End-to-End",
//       resumes: "Unlimited",
//       features: [
//         "Complete sourcing",
//         "Technical & HR screening",
//         "Free replacement 90 days",
//       ],
//     },
//     {
//       id: "monthly-talent-partner",
//       title: "Monthly Talent Partner",
//       price: 10000,
//       billing: "Monthly",
//       jobs: "3 Hires",
//       resumes: "Managed",
//       features: [
//         "Dedicated recruiter",
//         "Up to 3 hires per month",
//         "Fixed predictable cost",
//       ],
//     },
//   ];

//   // duplicate for seamless infinite loop
//   const loopedPlans = [...plans, ...plans];

//   // auto slide (ONE direction only)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => prev + 1);
//     }, 3500);

//     return () => clearInterval(interval);
//   }, []);

//   // reset silently (no jump)
//   useEffect(() => {
//     if (currentIndex >= plans.length) {
//       setTimeout(() => {
//         setCurrentIndex(0);
//       }, 500);
//     }
//   }, [currentIndex, plans.length]);

//   return (
//     <section className="py-16 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-10">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
//             Recruiter{" "}
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Plans
//             </span>
//           </h2>
//           <p className="text-lg text-gray-600">
//             Choose the perfect plan to hire top talent
//           </p>
//         </div>

//         {/* Carousel */}
//         <div className="overflow-hidden">
//           <div
//             className="flex gap-4 transition-transform duration-500 ease-in-out"
//             style={{
//               transform: `translateX(-${currentIndex * 25}%)`,
//             }}
//           >
//             {loopedPlans.map((plan, idx) => (
//               <div
//                 key={`${plan.id}-${idx}`}
//                 className="min-w-full sm:min-w-[50%] lg:min-w-[25%]"
//               >
//                 <div
//                   onClick={() => navigate("/recruiter/signup")}
//                   className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-blue-500 h-full flex flex-col"
//                 >
//                   {plan.popular && (
//                     <div className="mb-2 text-center">
//                       <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">
//                         MOST POPULAR
//                       </span>
//                     </div>
//                   )}

//                   <div className="text-center mb-4">
//                     <h3 className="text-sm font-bold text-gray-900 mb-2 min-h-[2.5rem] flex items-center justify-center">
//                       {plan.title}
//                     </h3>

//                     <div className="mb-2">
//                       <span className="text-2xl font-extrabold text-gray-900">
//                         ₹{plan.price}
//                       </span>
//                       <span className="text-[10px] text-gray-500 block mt-1">
//                         {plan.billing}
//                       </span>
//                     </div>

//                     <p className="text-[11px] font-medium text-gray-600">
//                       {plan.jobs} • {plan.resumes}
//                     </p>
//                   </div>

//                   <ul className="space-y-2 mb-4 flex-grow">
//                     {plan.features.map((feature, i) => (
//                       <li
//                         key={i}
//                         className="flex items-start gap-2 text-[11px]"
//                       >
//                         <Check
//                           size={12}
//                           className="text-green-500 flex-shrink-0 mt-0.5"
//                         />
//                         <span className="text-gray-700 leading-snug">
//                           {feature}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>

//                   <button className="w-full mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-xs hover:shadow-lg transition-all">
//                     Get Started
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="text-center mt-10">
//           <p className="text-gray-600 text-sm">
//             Already have an account?{" "}
//             <button
//               onClick={() => navigate("/recruiter-login")}
//               className="text-blue-600 font-semibold hover:underline"
//             >
//               Login here
//             </button>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default RecruiterPlansHome;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

/* ================= PLAN BADGE (AFTER PAYMENT ONLY) ================= */
const PlanBadge = ({ planId, user }) => {
  if (!user) return null;
  if (user.role === "ADMIN") return null;
  if (user.subscriptionStatus !== "ACTIVE") return null;

  const planMap = {
    STANDARD: "swift-hire",
    PREMIUM: "growth-engine",
    ENTERPRISE: "enterprise-elite",
  };

  if (planMap[user.plan] !== planId) return null;

  if (user.plan === "STANDARD") {
    return (
      <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
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

const RecruiterPlansHome = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // TEMP user (replace later with real backend data)
  const user = {
    role: "RECRUITER",
    subscriptionStatus: "ACTIVE",
    plan: "PREMIUM",
  };

  const plans = [
    {
      id: "launchpad",
      title: "Free Launchpad",
      price: 0,
      billing: "Free",
      jobs: "2 Jobs",
      resumes: "5 Credits",
      features: [
        "2 Job Postings per month",
        "Basic ATS",
        "5 Resume Views / month",
      ],
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
        "Verified Recruiter Badge",
      ],
    },
    {
      id: "growth-engine",
      title: "Premium",
      price: 2999,
      billing: "Monthly",
      jobs: "15 Jobs",
      resumes: "300 Credits",
      popular: true,
      features: [
        "15 Job Postings (60 days)",
        "300 Resume Credits",
        "Advanced AI Filters",
        "Multi-user Login",
      ],
    },
    {
      id: "enterprise-elite",
      title: "Enterprise Elite",
      price: 24999,
      billing: "Yearly",
      jobs: "Unlimited",
      resumes: "1,500 Credits",
      features: [
        "Unlimited Job Postings",
        "1,500 Resume Credits / year",
        "Dedicated Account Manager",
      ],
    },
    {
      id: "full-cycle-rpo",
      title: "Full-Cycle RPO",
      price: "8.33%",
      billing: "Per Hire",
      jobs: "End-to-End",
      resumes: "Unlimited",
      features: [
        "Complete sourcing",
        "Technical & HR screening",
        "Free replacement 90 days",
      ],
    },
    // {
    //   id: "monthly-talent-partner",
    //   title: "Monthly Talent Partner",
    //   price: 10000,
    //   billing: "Monthly",
    //   jobs: "3 Hires",
    //   resumes: "Managed",
    //   features: [
    //     "Dedicated recruiter",
    //     "Up to 3 hires per month",
    //     "Fixed predictable cost",
    //   ],
    // },
  ];

  const loopedPlans = [...plans, ...plans];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex >= plans.length) {
      setTimeout(() => {
        setCurrentIndex(0);
      }, 500);
    }
  }, [currentIndex, plans.length]);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Recruiter{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plans
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Choose the perfect plan to hire top talent
          </p>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {loopedPlans.map((plan, idx) => (
              <div
                key={`${plan.id}-${idx}`}
                className="min-w-full sm:min-w-[50%] lg:min-w-[25%]"
              >
                <div
                  onClick={() => navigate("/recruiter/signup")}
                  className="relative bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-blue-500 h-full flex flex-col"
                >
                  {/* 🔥 BADGE (after payment only) */}
                  <PlanBadge planId={plan.id} user={user} />

                  <div className="text-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 min-h-[2.5rem] flex items-center justify-center">
                      {plan.title}
                    </h3>

                    <div className="mb-2">
                      <span className="text-2xl font-extrabold text-gray-900">
                        ₹{plan.price}
                      </span>
                      <span className="text-[10px] text-gray-500 block mt-1">
                        {plan.billing}
                      </span>
                    </div>

                    <p className="text-[11px] font-medium text-gray-600">
                      {plan.jobs} • {plan.resumes}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-4 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[11px]"
                      >
                        <Check
                          size={12}
                          className="text-green-500 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700 leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-xs hover:shadow-lg transition-all">
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/recruiter-login")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecruiterPlansHome;
