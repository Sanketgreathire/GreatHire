// src/pages/job/Jobs.jsx
import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Link } from "react-router-dom";
import { FiFilter } from "react-icons/fi";

import FilterCard from "@/pages/job/FilterCard";
import Job from "@/pages/job/Job";
import { useJobDetails } from "@/context/JobDetailsContext";

const Jobs = () => {
  const { jobs, resetFilter, error } = useJobDetails();

  const [isLoading, setIsLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({}); // keep filter state here
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const jobsPerPage = 24;

  // reset filters on mount
  useEffect(() => {
    resetFilter?.();
  }, []);

  // when jobs or filters change → apply filtering
  useEffect(() => {
    if (!jobs) return;

    setIsLoading(false);

    const parseJobSalary = (salaryStr) => {
      if (!salaryStr) return null;
      const nums = salaryStr.match(/\d+/g);
      if (!nums) return null;
      const min = parseInt(nums[0], 10);
      const max = nums[1] ? parseInt(nums[1], 10) : min;
      return [min, max];
    };

    const filtered = jobs.filter((job) => {
      // location
      if (filters.location) {
        const jobLoc =
          (job?.jobDetails?.location || job?.location || "").toLowerCase();
        if (!jobLoc.includes(filters.location.toLowerCase())) return false;
      }

      // job title
      if (filters.jobTitle) {
        const title =
          (job?.jobDetails?.title || job?.job_title || "").toLowerCase();
        if (!title.includes(filters.jobTitle.toLowerCase())) return false;
      }

      // job type
      if (Array.isArray(filters.jobType) && filters.jobType.length) {
        const jobType = (job?.jobDetails?.jobType || "").toLowerCase();
        const matchesType = filters.jobType.some((t) =>
          jobType.includes(t.toLowerCase())
        );
        if (!matchesType) return false;
      }

      // company
      if (filters.company) {
        const company =
          (job?.jobDetails?.companyName ||
            job?.jobDetails?.company ||
            job?.employer_name ||
            job?.company ||
            ""
          ).toLowerCase();
        if (!company.includes(filters.company.toLowerCase())) return false;
      }

      // workplace
      if (Array.isArray(filters.workPlace) && filters.workPlace.length) {
        const wp = (job?.jobDetails?.workPlaceFlexibility || "").toLowerCase();
        const matchesWP = filters.workPlace.some((p) =>
          wp.includes(p.toLowerCase())
        );
        if (!matchesWP) return false;
      }

      // qualification
      if (filters.qualification) {
        const qual =
          (job?.jobDetails?.qualification ||
            (Array.isArray(job?.jobDetails?.qualifications)
              ? job.jobDetails.qualifications.join(" ")
              : "") ||
            ""
          ).toLowerCase();
        if (!qual.includes(filters.qualification.toLowerCase())) return false;
      }

      // date posted
      if (Array.isArray(filters.datePosted) && filters.datePosted.length) {
        const dateStr =
          job?.jobDetails?.datePosted ||
          job?.createdAt ||
          job?.jobDetails?.createdAt ||
          job?.postedAt ||
          job?.job_posted_at ||
          null;

        const jobDate = dateStr ? new Date(dateStr) : null;
        if (!jobDate || isNaN(jobDate)) return false;

        const today = new Date();
        const matchesAny = filters.datePosted.some((sel) => {
          let daysLimit = 0;
          switch (sel) {
            case "Last 24 hours":
              daysLimit = 1;
              break;
            case "Last 7 days":
              daysLimit = 7;
              break;
            case "Last 14 days":
              daysLimit = 14;
              break;
            case "Last 30 days":
              daysLimit = 30;
              break;
            default:
              daysLimit = 0;
          }
          const diffDays = (today - jobDate) / (1000 * 60 * 60 * 24);
          return diffDays <= daysLimit;
        });
        if (!matchesAny) return false;
      }

      // salary
      if (Array.isArray(filters.salary) && filters.salary.length) {
        const jobSalaryRange = parseJobSalary(job?.jobDetails?.salary);
        if (!jobSalaryRange) return false;
        const [jobMin, jobMax] = jobSalaryRange;

        const matchesSalary = filters.salary.some((selRange) => {
          if (selRange.includes("+")) {
            const min = parseInt(selRange.replace(/[^\d]/g, ""), 10);
            return jobMax >= min;
          }
          const [minStr, maxStr] = selRange.split("-");
          const min = parseInt(minStr, 10);
          const max = parseInt(maxStr, 10);
          return jobMax >= min && jobMin <= max;
        });
        if (!matchesSalary) return false;
      }

      return true;
    });

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, filters, error]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
        <div className="w-full px-2 lg:px-4 dark:bg-gray-700">
      <div className="flex-grow w-full mx-auto bg-gray-100 pt-20  dark:bg-gray-800 ">
          <div className="flex gap-6 ">
            {/* Sidebar (Desktop only) */}
            <div className="hidden lg:block lg:w-72 dark:bg-gray-700">
              <FilterCard
                onFilterChange={setFilters}
                onReset={resetFilters}
              />
            </div>

            {/* Main area */}
            <div className="flex-1">
              {/* Mobile toggle */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md"
                >
                  <FiFilter /> Filters
                </button>
                <div className="text-sm text-gray-600">
                  {filteredJobs.length} jobs
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                </div>
              ) : currentJobs.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentJobs.map((job) => (
                      <div key={job._id}>
                        <Link to={`/jobs/${job._id}`}>
                          <Job job={job} />
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded ${currentPage === 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                      Previous
                    </button>
                    <span className="text-gray-600 font-medium">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded ${currentPage === totalPages
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <span className="text-gray-500">Job not found</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay background */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsFilterOpen(false)}
          ></div>

          {/* Sidebar content */}
          <div className="relative bg-white w-72 h-full shadow-lg transform transition-transform duration-300 translate-x-0">
            <FilterCard
              onFilterChange={setFilters}
              onReset={resetFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Jobs;