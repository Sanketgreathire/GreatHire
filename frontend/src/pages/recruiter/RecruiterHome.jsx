import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import {
  FaUsers,
  FaBriefcase,
  FaClipboardList,
  FaTrophy,
} from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
import { FiGift } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { addCompany } from "@/redux/companySlice";
import { Helmet } from "react-helmet-async";
import VerifiedRecruiterBadges from "@/components/VerifiedRecruiterBadges";


const RecruiterHome = () => {
  const { company } = useSelector((state) => state.company);
  const { jobPlan } = useSelector((state) => state.jobPlan);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { recruiters } = useSelector((state) => state.recruiters);
  const [loading, setLoading] = useState(false);
  const [jobsStatistics, setJobsStatistics] = useState(null);

  // Fetch job statistics
  const fetchJobsStatistics = async (companyId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${JOB_API_END_POINT}/job-statistics/${company?._id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setJobsStatistics(response.data.statistics);
      }
    } catch (err) {
      console.error("Failed to fetch job statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch company by user ID
  const fetchCompanyByUserId = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${COMPANY_API_END_POINT}/company-by-userid`,
        { userId: user?._id },
        { withCredentials: true }
      );
      if (response?.data.success) {
        dispatch(addCompany(response?.data.company));
      }
    } catch (err) {
      console.error(`Error fetching company by user: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && company) {
      fetchJobsStatistics();
      fetchCompanyByUserId();
    }
  }, [user]);

  // Cards data
  const cards = [
    {
      title: "Recruiters",
      count: recruiters.length,
      icon: (
        <FaUsers className="text-4xl text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Recruiters in your company.",
    },
    {
      title: "Posted Jobs",
      count: jobsStatistics?.totalJobs,
      icon: (
        <FaBriefcase className="text-4xl text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Jobs that you have posted.",
    },
    {
      title: "Remaining Job Posts",
      count: (() => {
        const plan = company?.plan || "FREE";
        const limits = { FREE: 2, STANDARD: 5, PREMIUM: 15, ENTERPRISE: Infinity };
        // const PAID_PLAN_FREE_JOBS = 2;
        const referralBonus = user?.remainingJobPosts ?? 0;

        if (plan === "FREE") {
          const limit = limits[plan] ?? 2;
          const used = company?.freeJobsPosted || 0;
          return Math.max(0, limit - used) + referralBonus;
        } else {
          const paidLimit = limits[plan] ?? 0;
          if (paidLimit === Infinity) return "∞";
          const paidUsed = company?.planJobsPostedThisMonth || 0;
          return Math.max(0, paidLimit - paidUsed) + referralBonus;
        }
      })(),
      icon: (
        <FaClipboardList className="text-4xl text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: (
        <span>
          Number of jobs you can post.
          {(user?.remainingJobPosts ?? 0) > 0 && (
            <span className="block text-green-500 text-xs mt-0.5">
              🎁 Includes referral bonus
            </span>
          )}
        </span>
      ),
    },
    {
      title: "Active Jobs",
      count: jobsStatistics?.activeJobs,
      icon: (
        <FaBriefcase className="text-4xl text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Currently active and open jobs.",
    },
    {
      title: "Expired Jobs",
      count: jobsStatistics?.inactiveJobs,
      icon: (
        <FaBriefcase className="text-4xl text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Jobs that have expired.",
    },
    {
      title: "Applicants",
      count: jobsStatistics?.totalApplicants,
      icon: (
        <FaUsers className="text-4xl text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Total applicants for your jobs.",
    },
    {
      title: "Shortlisted Candidates",
      count: jobsStatistics?.selectedCandidates,
      icon: (
        <FaUsers className="text-4xl text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Candidates who have been shortlisted.",
    },
    {
      title: "Hiring Success Rate",
      count: jobsStatistics?.selectedCandidates && jobsStatistics?.totalApplicants
        ? `${Math.round((jobsStatistics.selectedCandidates / jobsStatistics.totalApplicants) * 100)}%`
        : "0%",
      icon: (
        <FaTrophy className="text-4xl text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Percentage of shortlisted candidates.",
    },
    {
      title: "Invite & Earn",
      count: <FiGift className="text-3xl text-indigo-500" />,
      icon: (
        <FiGift className="text-4xl text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Refer candidates and earn free job posts.",
      link: "/recruiter/dashboard/invite-and-earn",
    },
    {
      title: "Credits For Database",
      count: company?.creditedForCandidates || 0,
      icon: (
        <BsCoin className="text-4xl text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Credits available for candidate database.",
    },
  ];

  const recruiterPlan = jobPlan?.title || jobPlan?.planName || jobPlan?.name || company?.plan || user?.plan;
  console.log("=== BADGE DEBUG ===");
  console.log("Job plan object:", jobPlan);
  console.log("Job plan title:", jobPlan?.title);
  console.log("Job plan planName:", jobPlan?.planName);
  console.log("Job plan name:", jobPlan?.name);
  console.log("Job plan status:", jobPlan?.status);
  console.log("Job plan expiryDate:", jobPlan?.expiryDate);
  console.log("Company plan:", company?.plan);
  console.log("User plan:", user?.plan);
  console.log("Final recruiterPlan:", recruiterPlan);
  console.log("===================");

  return (
    <>
      <Helmet>
        <title>
          Recruiter's Home | GreatHire's Jobs, Applications, and Hiring Analytics
        </title>

        <meta
          name="description"
          content="GreatHire's Recruiter Home is a comprehensive hiring management system for today's recruiters, based in Hyderabad State, India, serving startups, corporates, IT companies, and rapidly growing businesses in different sectors. With this state-of-the-art dashboard, you can publish and maintain jobs, view active and expired postings, view application status, shortlist qualified candidates, maintain recruiters, and regulate job and database credits conveniently. GreatHire enables hiring entities to recruit quickly, intelligently, and effectively while, at the same time, enhancing their corporate brands."
        />
      </Helmet>



      {company ? (
        <div className="min-h-screen p-8 pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {/* Verification Status Banner */}
          {!company?.isActive && (
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <span className="font-medium">Verification Pending:</span>{" "}
                    {(() => {
                      const plan = company?.plan || "FREE";
                      const jobsPosted = plan === "FREE" ? (company?.freeJobsPosted || 0) : ((company?.planJobsPostedThisMonth || 0) + (company?.paidPlanFreeJobsPosted || 0));

                      if (jobsPosted === 0) {
                        return "Post your first job now. It will be reviewed by admin and published upon approval.";
                      } else {
                        return "Your first job is under admin review. You cannot post additional jobs until your account is verified.";
                      }
                    })()
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header Section */}
          <header className="mb-10 flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                👋 Welcome,{" "}
                <span className="text-blue-600 dark:text-blue-400 transition-colors duration-300">
                  {company?.companyName || "Recruiter"}
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">
                Here's an overview of your recruitment activity.
              </p>
            </div>

            {/* Badge on the right */}
            <div className="flex items-start">
              <VerifiedRecruiterBadges
                plan={recruiterPlan}
                status={jobPlan?.status}
                expiryDate={jobPlan?.expiryDate}
              />
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() => card.link && navigate(card.link)}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 p-6 hover:shadow-xl dark:hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center border-t-4 border-blue-500 dark:border-blue-400 ${card.link ? "cursor-pointer" : ""
                  }`}
              >
                <div className="mb-3">{card.icon}</div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-300">
                  {card.title}
                </h2>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50 transition-colors duration-300">{card.count}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <p className="text-4xl text-gray-400 dark:text-gray-500 transition-colors duration-300">Company not created</p>
        </div>
      )}
    </>
  );
};

export default RecruiterHome;