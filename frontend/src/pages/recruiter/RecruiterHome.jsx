import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import {
  FaUsers,
  FaBriefcase,
  FaClipboardList,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa"; // Importing icons

const RecruiterHome = () => {
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const { recruiters } = useSelector((state) => state.recruiters);
  const [loading, setLoading] = useState(false);
  const [jobsStatistics, setJobsStatistics] = useState(null);

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

  useEffect(() => {
    if (user && company && !jobsStatistics) {
      fetchJobsStatistics();
    }
  }, [user]);

  const cards = [
    {
      title: "Recruiters",
      count: recruiters.length,
      icon: (
        <FaUsers
          className="text-4xl text-blue-600 bg-blue-100 rounded-lg p-2"
          size={45}
        />
      ),
      description: "Recruiters in you company.",
    },
    {
      title: "Posted Jobs",
      count: jobsStatistics?.totalJobs,
      icon: (
        <FaBriefcase
          className="text-4xl text-green-600 bg-green-100 rounded-lg p-2"
          size={45}
        />
      ),
      description: "Jobs that you have posted.",
    },
    {
      title: "Max Post Jobs",
      count: company?.maxPostJobs,
      icon: (
        <FaClipboardList
          className="text-4xl text-pink-600 bg-pink-100 rounded-lg p-2"
          size={45}
        />
      ),
      description: "Number of jobs you can post.",
    },
    {
      title: "Active Jobs",
      count: jobsStatistics?.activeJobs,
      icon: (
        <FaBriefcase
          className="text-4xl text-purple-600 bg-purple-100 rounded-lg p-2"
          size={45}
        />
      ),
      description: "Jobs that are currently active and open.",
    },
    {
      title: "Expired Jobs",
      count: jobsStatistics?.inactiveJobs,
      icon: (
        <FaBriefcase
          className="text-4xl text-orange-600 bg-orange-100 rounded-lg p-2"
          size={45}
        />
      ),
      description: "Jobs that have expired and are no longer active.",
    },
    {
      title: "Applicants",
      count: jobsStatistics?.totalApplicants,
      icon: (
        <FaUsers
          className="text-4xl text-red-600 bg-red-100 rounded-lg p-2"
          size={45}
        />
      ),
      description: "Total number of applicants for your jobs.",
    },
    {
      title: "Shortlisted Candidates",
      count: jobsStatistics?.selectedCandidates,
      icon: (
        <FaUsers
          className="text-4xl text-teal-600 bg-teal-100 rounded-lg p-2"
          size={45}
        />
      ),
      description: "Candidates who have been selected.",
    },
  ];

  return (
    <>
      {company && user?.isVerify ? (
        <div className="min-h-screen p-8">
          {/* Header Section */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome, {company?.companyName || "Recruiter"}
            </h1>
            <p className="text-gray-600 mt-2">
              Empower your hiring process with key insights and metrics at a
              glance.
            </p>
          </header>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 flex  items-center justify-evenly border-l-4 border-gray-300 hover:border-blue-700 transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {card.icon}
                </div>
                <div className="flex flex-col gap-2 justify-center items-center w-full">
                  <h2 className="text-xl font-semibold text-gray-700 text-center">
                    {card.title}
                  </h2>
                  <h3 className="text-3xl font-bold text-gray-800">
                    {card.count}
                  </h3>
                  <p className="w-48 text-gray-600 text-sm text-center">
                    {card.description}
                  </p>
                </div>
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
            You are not verified by your company
          </span>
        </p>
      )}
    </>
  );
};

export default RecruiterHome;
