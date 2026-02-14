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
import { addCompany } from "@/redux/companySlice";
import { Helmet } from "react-helmet-async";
import VerifiedRecruiterBadges from "@/components/VerifiedRecruiterBadges";


const RecruiterHome = () => {
  const { company } = useSelector((state) => state.company);
  const dispatch = useDispatch();
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
      title: "Max Post Jobs",
      count: company?.creditedForJobs >= 500 
        ? Math.floor(company.creditedForJobs / 500) 
        : 0,
      icon: (
        <FaClipboardList className="text-4xl text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Number of jobs you can post.",
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
      title: "Credits For Database",
      count: company?.creditedForCandidates || 0,
      icon: (
        <BsCoin className="text-4xl text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-2 transition-colors duration-300" />
      ),
      description: "Credits available for candidate database.",
    },
  ];

  const recruiterPlan = company?.plan ?? user?.plan ?? "PREMIUM";
  console.log("Company plan:", company?.plan);
  console.log("User plan:", user?.plan);
  console.log("Final recruiterPlan:", recruiterPlan);

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



      {company && user?.isActive ? (
        <div className="min-h-screen p-8 pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
              <VerifiedRecruiterBadges plan={recruiterPlan} />
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 p-6 hover:shadow-xl dark:hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center border-t-4 border-blue-500 dark:border-blue-400"
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
      ) : !company ? (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <p className="text-4xl text-gray-400 dark:text-gray-500 transition-colors duration-300">Company not created</p>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <p className="text-4xl text-gray-400 dark:text-gray-500 transition-colors duration-300">
            GreatHire will verify your company soon.
          </p>
        </div>
      )}
    </>
  );
};

export default RecruiterHome;