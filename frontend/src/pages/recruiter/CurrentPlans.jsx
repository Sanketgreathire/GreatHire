import React from "react";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const CurrentPlans = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const { jobPlan } = useSelector((state) => state.jobPlan);

  if (!user || !company) return <p>Loading...</p>;

  return (
    <>
      {company && user?.isActive ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 text-center">
              <AiFillSafetyCertificate className="mx-auto text-5xl mb-3 text-green-400" />
              <h1 className="text-3xl font-bold">Your Current Plan</h1>
              <p className="text-lg text-gray-200">
                {jobPlan?.status === "Active"
                  ? "Active Plan"
                  : "No Active Plan"}
              </p>
            </div>

            {/* Plan Details */}
            <div className="p-6">
              {jobPlan ? (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6 shadow-md">
                  <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                    {jobPlan.planName} Plan
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Enjoy exclusive benefits with the {jobPlan.planName} Plan.
                  </p>

                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between p-3 bg-white rounded-lg shadow">
                      <span className="font-medium">Price:</span>
                      <span className="font-semibold text-blue-600">
                        ₹{jobPlan.price}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg shadow">
                      <span className="font-medium">Job Boosts:</span>
                      <span className="font-semibold">{jobPlan.jobBoost}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg shadow">
                      <span className="font-medium">Purchase Date:</span>
                      <span className="font-semibold">
                        {format(new Date(jobPlan.purchaseDate), "dd MMM yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg shadow">
                      <span className="font-medium">Expiry Date:</span>
                      <span
                        className={`font-semibold ${
                          new Date(jobPlan.expiryDate) < new Date()
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {format(new Date(jobPlan.expiryDate), "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  You do not have an active plan. Upgrade to unlock more
                  features.
                </p>
              )}

              {/* Upgrade Button (if no active plan) */}
              {user?.emailId?.email === company?.adminEmail && !jobPlan && (
                <div className="text-center mt-4">
                  <Button
                    onClick={() =>
                      navigate("/recruiter/dashboard/upgrade-plans")
                    }
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold text-lg"
                  >
                    Upgrade Plan
                  </Button>
                </div>
              )}
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
};

export default CurrentPlans;
