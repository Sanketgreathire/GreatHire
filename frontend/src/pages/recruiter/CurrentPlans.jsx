import React from "react";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";

const CurrentPlans = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const { jobPlan } = useSelector((state) => state.jobPlan);
  console.log("CurrentPlans", user, company, jobPlan);
  // Show loading message if user or company data is not available
  if (!user || !company) return <p className="dark:text-gray-300">Loading...</p>;

  return (
    <>
      <Helmet>
        {/* Meta Title */}
        <title>
          Current Subscription Plan | GreatHire's Hiring Credits & Benefits Management
        </title>

        {/* Meta Description */}
        <meta
          name="description"
          content="View and manage your existing subscription plan on GreatHire in a completely transparent and controlled manner. Hyderabad State, India based hiring platform enables recruiters, startups, enterprises to empower trusted hiring solutions. It provides innovative hiring tools, viewing of existing plans, real-time tracking of credits, advantages of posting jobs, viewing or knowing about pricing, viewing or knowing about expiry, and upgrades."
        />
      </Helmet>
      {/* Check if the company exists and the user is active */}
      {company && user?.isActive ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 pt-20">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 text-center">
              <AiFillSafetyCertificate className="mx-auto text-5xl mb-3 text-green-400 dark:text-green-300" />
              <h1 className="text-3xl font-bold">Your Current Plan</h1>
              <p className="text-lg text-gray-200 dark:text-gray-300">
                {jobPlan?.status === "Active"
                  ? "Active Plan"
                  : "No Active Plan"}
              </p>
            </div>

            {/* Plan Details */}
            <div className="p-6">
              {jobPlan ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-lg mb-6 shadow-md">
                  <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
                    {jobPlan.planName} Plan
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Enjoy exclusive benefits with the {jobPlan.planName} Plan.
                  </p>

                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <span className="font-medium">Company:</span>
                      <span className="font-semibold">{company.companyName}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <span className="font-medium">Phone:</span>
                      <span className="font-semibold">{company.phone}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow items-start">
                      <span className="font-medium">Location:</span>
                      <div className="flex flex-col text-right font-semibold">
                        <span>{company.address.streetAddress}</span>
                        <span>{company.address.city}, {company.address.state}</span>
                        <span>{company.address.country} - {company.address.postalCode}</span>
                      </div>
                    </div>
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <span className="font-medium">Price:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        ₹{jobPlan.price}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <span className="font-medium">Max Job Posts Remaining:</span>
                      <span className="font-semibold">{Math.floor(company.creditedForJobs / 500)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <span className="font-medium">Credits For Database:</span>
                      <span className="font-semibold">{company.creditedForCandidates}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <span className="font-medium">Purchase Date:</span>
                      <span className="font-semibold">
                        {jobPlan.purchaseDate 
                          ? format(new Date(jobPlan.purchaseDate), "dd MMM yyyy")
                          : "N/A"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow">
                      <span className="font-medium">Expiry Date:</span>
                      <span
                        className={`font-semibold ${jobPlan.expiryDate && new Date(jobPlan.expiryDate) < new Date()
                            ? "text-red-500 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                          }`}
                      >
                        {jobPlan.expiryDate
                          ? format(new Date(jobPlan.expiryDate), "dd MMM yyyy")
                          : "N/A"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400">
                  You do not have an active plan. Upgrade to unlock more
                  features.
                </p>
              )}

              {/* Upgrade Button - Always show for admin */}
              {user?.emailId?.email === company?.adminEmail && (
                <div className="text-center mt-4">
                  <Button
                    onClick={() =>
                      navigate("/packages")
                    }
                    className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 font-semibold text-lg"
                  >
                    {jobPlan && company?.maxJobPosts > 0 ? "Get Started" : "Upgrade Plan"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <span className="text-4xl text-gray-400 dark:text-gray-500">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <span className="text-4xl text-gray-400 dark:text-gray-500">
            GreatHire will verify your company soon.
          </span>
        </p>
      )}
    </>
  );
};

export default CurrentPlans;