import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import {
  FaUsers,
  FaBriefcase,
  FaClipboardList,
  FaCoins,
} from "react-icons/fa";
import { BsCoin } from "react-icons/bs";
import { addCompany } from "@/redux/companySlice";
import { Helmet } from "react-helmet-async";

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
        <FaUsers className="text-4xl text-blue-600 bg-blue-100 rounded-lg p-2" />
      ),
      description: "Recruiters in your company.",
    },
    {
      title: "Posted Jobs",
      count: jobsStatistics?.totalJobs,
      icon: (
        <FaBriefcase className="text-4xl text-green-600 bg-green-100 rounded-lg p-2" />
      ),
      description: "Jobs that you have posted.",
    },
    {
      title: "Max Post Jobs",
      count: <span className="text-green-600 text-2xl">Infinity</span>,
      icon: (
        <FaClipboardList className="text-4xl text-pink-600 bg-pink-100 rounded-lg p-2" />
      ),
      description: "Number of jobs you can post.",
    },
    {
      title: "Active Jobs",
      count: jobsStatistics?.activeJobs,
      icon: (
        <FaBriefcase className="text-4xl text-purple-600 bg-purple-100 rounded-lg p-2" />
      ),
      description: "Currently active and open jobs.",
    },
    {
      title: "Expired Jobs",
      count: jobsStatistics?.inactiveJobs,
      icon: (
        <FaBriefcase className="text-4xl text-orange-600 bg-orange-100 rounded-lg p-2" />
      ),
      description: "Jobs that have expired.",
    },
    {
      title: "Applicants",
      count: jobsStatistics?.totalApplicants,
      icon: (
        <FaUsers className="text-4xl text-red-600 bg-red-100 rounded-lg p-2" />
      ),
      description: "Total applicants for your jobs.",
    },
    {
      title: "Shortlisted Candidates",
      count: jobsStatistics?.selectedCandidates,
      icon: (
        <FaUsers className="text-4xl text-teal-600 bg-teal-100 rounded-lg p-2" />
      ),
      description: "Candidates who have been shortlisted.",
    },
    {
      title: "Credits For Job Post",
      count: company?.creditedForJobs || 0,
      icon: (
        <FaCoins className="text-4xl text-yellow-500 bg-yellow-100 rounded-lg p-2" />
      ),
      description: "Credits available for job postings.",
    },
    {
      title: "Credits For Database",
      count: company?.creditedForCandidates || 0,
      icon: (
        <BsCoin className="text-4xl text-yellow-500 bg-yellow-100 rounded-lg p-2" />
      ),
      description: "Credits available for candidate database.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Home | Hiring Analytics, Jobs & Applicants – GreatHire
        </title>

        <meta
          name="description"
          content="GreatHire’s Recruiter Home is a powerful hiring control platform for modern recruiters, located in Hyderabad State, India, supporting startups, enterprises, IT firms, and fast-growing companies across multiple industries. This advanced dashboard allows you to post and manage jobs, track active and expired listings, monitor applicants, shortlist top candidates, manage recruiters, and control job and database credits with ease. With real-time analytics, clean insights, and streamlined workflows, GreatHire empowers organizations to hire faster, smarter, and more efficiently while building a strong employer brand."
        />
      </Helmet>



      {company && user?.isActive ? (
        <div className="min-h-screen p-8 pt-20 bg-gray-50">
          {/* Header Section */}
          <header className="mb-10 flex flex-col items-center md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">
                👋 Welcome,{" "}
                <span className="text-blue-600">
                  {company?.companyName || "Recruiter"}
                </span>
              </h1>
              <p className="text-gray-500 mt-2">
                Here’s an overview of your recruitment activity.
              </p>
            </div>

          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center border-t-4 border-blue-500"
              >
                <div className="mb-3">{card.icon}</div>
                <h2 className="text-lg font-semibold text-gray-700">
                  {card.title}
                </h2>
                <p className="text-3xl font-bold text-gray-900">{card.count}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {card.description}
                </p>
              </div>
            ))}
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

export default RecruiterHome;
