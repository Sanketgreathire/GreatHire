import React, { useState } from "react";
import { AiFillSafetyCertificate, AiOutlineCheck } from "react-icons/ai";
import { Briefcase, Zap, Crown } from "lucide-react";

import { FaRocket, FaGem, FaStar } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  VERIFICATION_API_END_POINT,
  ORDER_API_END_POINT,
} from "@/utils/ApiEndPoint";
import { razorpay_key_id } from "@/utils/RazorpayCredentials";
import { toast } from "react-hot-toast";
import axios from "axios";
import { updateMaxPostJobs } from "@/redux/companySlice";
import { addJobPlan } from "@/redux/jobPlanSlice";
import { REVENUE_API_END_POINT } from "../../utils/ApiEndPoint";
import { useNavigate } from "react-router-dom";

function RecruiterPlans() {
  //Define available subscription plans
  // const plans = [
  //   {
  //     name: "Basic",
  //     icon: AiFillSafetyCertificate,
  //     price: "499",
  //     color: "blue",
  //     jobBoost: 10,
  //     features: [
  //       "Boost 10 active job posts",
  //       "Basic candidate matching",
  //       "Email & chat support",
  //       "Basic analytics",
  //     ],
  //     popular: false,
  //     borderColor: "border-blue-300",
  //     selectedBorderColor: "ring-2 ring-blue-500",
  //   },
  //   {
  //     name: "Standard",
  //     icon: FaRocket,
  //     price: "699",
  //     jobBoost: 25,
  //     color: "indigo",
  //     features: [
  //       "Boost 25 active job posts",
  //       "Priority 24/7 support",
  //       "Advanced analytics suite",
  //     ],
  //     popular: true, // Marked as most popular plan
  //     borderColor: "ring-indigo-300",
  //     selectedBorderColor: "ring-2 ring-indigo-600",
  //   },
  //   {
  //     name: "Premium",
  //     icon: FaGem,
  //     price: "1399",
  //     jobBoost: 50,
  //     color: "purple",
  //     features: [
  //       "Boost 50 active job posts",
  //       "Dedicated success manager",
  //       "Custom API integration",
  //     ],
  //     popular: false,
  //     borderColor: "border-purple-300",
  //     selectedBorderColor: "ring-2 ring-purple-500",
  //   },
  // ];
  const plans = [
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(plans[1].title); 
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  // Handles plan selection by updating state
  const handleSelectPlan = (planTitle) => {
    setSelectedPlan(planTitle);
  };
  
  

  // const getCardClasses = (plan) => {
  //   const isSelected = selectedPlan === plan.name;
  //   const baseClasses =
  //     "relative bg-white rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer";
  //   const borderClasses = isSelected
  //     ? plan.selectedBorderColor
  //     : plan.popular
  //     ? `ring-2 ${plan.borderColor}`
  //     : `border-2 ${plan.borderColor}`;
  //   return `${baseClasses} ${borderClasses}`;
  // };

  // const getButtonClasses = (color, popular) => {
  //   const baseClasses =
  //     "mt-4 w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg active:scale-98";
  //   const colorStyles = {
  //     blue: popular
  //       ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
  //       : "bg-blue-50 text-blue-600 hover:bg-blue-100",
  //     indigo: popular
  //       ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
  //       : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  //     purple: popular
  //       ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
  //       : "bg-purple-50 text-purple-600 hover:bg-purple-100",
  //   };
  //   return `${baseClasses} ${colorStyles[color]}`;
  // };

  // Handles payment process using Razorpay API
  const initiatePayment = async (plan) => {
    try {
      const response = await axios.post(
        `${ORDER_API_END_POINT}/create-order-for-jobplan`,
        {
          planName: plan.title,
          companyId: company?._id,
          amount: plan.price,
          creditsForJobs: plan.creditsForJobs,
          creditsForCandidates: plan.creditsForCandidates,
        },
        {
          withCredentials: true, // This sends cookies or authentication data with the request
        }
      );

      const { orderId, amount, currency } = response.data;

      // Razorpay payment configuration
      const options = {
        key: razorpay_key_id,
        amount,
        currency,
        name: "GreatHire",
        description: plan?.title,
        order_id: orderId,
        handler: async (response) => {
          // Verify payment after successful transaction
          const verificationResponse = await axios.post(
            `${VERIFICATION_API_END_POINT}/verify-payment-for-jobplan`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              creditsForJobs: plan.creditsForJobs,
              creditsForCandidates: plan.creditsForCandidates,
              companyId: company?._id,
            },
            { withCredentials: true }
          );

          if (verificationResponse.data.success) {
            toast.success("Payment Successful!");
            // dispatch(updateMaxPostJobs(plan.credits));
            dispatch(addJobPlan(verificationResponse.data.plan));

            // Call revenue API to store details
            await axios.post(`${REVENUE_API_END_POINT}/store-revenue`, {
              itemDetails: {
                itemType: "Job Posting Plan",
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
            navigate("/recruiter/dashboard/post-job");
          } else {
            toast.error("Payment Verification Failed!");
          }
        },
        prefill: {
          name: company?.companyName,
          email: company.email,
          contact: company?.phone,
        },
        theme: { color: "#528FF0" },
      };

      if (typeof window.Razorpay === "undefined") {
        toast.error("Razorpay SDK not loaded. Please try again.");
        return;
      }

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Error initiating payment. Please try again.");
    }
  };

  // Handles plan purchase flow
  const purchasePlan = (plan) => {
    handleSelectPlan(plan.title);
    try {
      initiatePayment(plan);
    } catch (err) {}
  };

  return (
    <>
      {company && user?.isActive ? (
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

            {/* <div className="grid md:grid-cols-3 gap-5">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <div
                    key={plan.name}
                    className={getCardClasses(plan)}
                    onClick={() => handleSelectPlan(plan.name)}
                  >
                    {plan.popular && selectedPlan === plan.name && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                          {plan.name}
                        </h2>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{plan.price}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            /mo
                          </span>
                        </p>
                      </div>
                      <div className={`p-2.5 rounded-xl bg-${plan.color}-50`}>
                        <Icon className={`h-6 w-6 text-${plan.color}-500`} />
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div
                            className={`p-0.5 rounded-full bg-${plan.color}-50 mt-0.5`}
                          >
                            <AiOutlineCheck
                              className={`h-3.5 w-3.5 text-${plan.color}-500`}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => purchasePlan(plan)}
                      className={getButtonClasses(plan.color, plan.popular)}
                    >
                      Get Started
                    </button>
                  </div>
                );
              })}
            </div> */}
            
        
            <div className="grid md:grid-cols-3 gap-6 justify-center">
              {plans.map((plan, index) => {
                const isSelected = selectedPlan === plan.title;
                
                return (
                
                  <div
                    key={index}
                    className={`relative bg-white rounded-xl shadow-md p-6 border-2 transition-all duration-300 cursor-pointer ${
                      isSelected ? plan.selectedBorderColor : plan.borderColor
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
                    onClick={() => purchasePlan(plan)}

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
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">
            GreatHire will verify your company soon.
          </span>
        </p>
      )}
    </>
  );
}

export default RecruiterPlans;
