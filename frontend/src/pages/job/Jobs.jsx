import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
import { FiFilter } from "react-icons/fi";

import FilterCard from "@/pages/job/FilterCard";
import LatestJobs from "./LatestJobs";
import JobSearch from "@/pages/job/JobSearch";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useLocation } from "react-router-dom";

// imported helmet to apply customized meta tags
import { Helmet } from "react-helmet-async";

const Jobs = () => {
  const { jobs, resetFilter, error, setSelectedJob } = useJobDetails();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const jobListingsRef = useRef(null);

  const [filters, setFilters] = useState({
    jobTitle: "",
    location: "",
    jobType: [],
    workPlace: [],
    company: "",
    datePosted: [],
  });

  // searchInfo drives the JobSearch bar UI (title input + location input)
  const [searchInfo, setSearchInfo] = useState({
    titleKeyword: "",
    location: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 20;

  useEffect(() => {
    resetFilter?.();
  }, []);

  // Pre-select job when navigating from marquee
  useEffect(() => {
    const jobId = location.state?.selectedJobId;
    if (jobId && jobs?.length > 0) {
      const job = jobs.find((j) => j._id === jobId);
      if (job) setSelectedJob(job);
    }
  }, [location.state?.selectedJobId, jobs]);

  useEffect(() => {
    setIsLoading(!jobs);
  }, [jobs, error]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSearchUpdate = useCallback((updates) => {
    setSearchInfo((prev) => ({ ...prev, ...updates }));
    setFilters((prev) => ({
      ...prev,
      jobTitle: updates.titleKeyword !== undefined ? updates.titleKeyword : prev.jobTitle,
      location: updates.location !== undefined ? updates.location : prev.location,
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setSearchInfo((prev) => ({
      ...prev,
      location: newFilters.location ?? prev.location,
      titleKeyword: newFilters.jobTitle ?? prev.titleKeyword,
    }));
  }, []);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      if (filters.location) {
        const jobLocation = (job?.jobDetails?.location || job?.location || "").toLowerCase();
        if (!jobLocation.includes(filters.location.toLowerCase())) return false;
      }
      if (filters.jobTitle) {
        const jobTitle = (job?.jobDetails?.title || job?.job_title || "").toLowerCase();
        const companyName = (job?.jobDetails?.companyName || "").toLowerCase();
        const keyword = filters.jobTitle.toLowerCase();
        if (!jobTitle.includes(keyword) && !companyName.includes(keyword)) return false;
      }
      if (Array.isArray(filters.jobType) && filters.jobType.length > 0) {
        const jobType = (job?.jobDetails?.jobType || "").toLowerCase();
        if (!filters.jobType.some((type) => jobType.includes(type.toLowerCase()))) return false;
      }
      if (Array.isArray(filters.workPlace) && filters.workPlace.length > 0) {
        const workPlace = (job?.jobDetails?.workPlaceFlexibility || "").toLowerCase();
        if (!filters.workPlace.some((wp) => workPlace.includes(wp.toLowerCase()))) return false;
      }
      if (filters.company) {
        const company = (job?.jobDetails?.companyName || job?.jobDetails?.company || job?.employer_name || job?.company || "").toLowerCase();
        if (!company.includes(filters.company.toLowerCase())) return false;
      }
      if (Array.isArray(filters.datePosted) && filters.datePosted.length > 0) {
        const dateStr = job?.jobDetails?.datePosted || job?.createdAt || job?.jobDetails?.createdAt || job?.postedAt || job?.job_posted_at || null;
        const jobDate = dateStr ? new Date(dateStr) : null;
        if (!jobDate || isNaN(jobDate)) return false;
        const today = new Date();
        const dayMap = { "Last 24 hours": 1, "Last 7 days": 7, "Last 15 days": 15, "Past Month": 30 };
        if (!filters.datePosted.some((d) => (today - jobDate) / 86400000 <= (dayMap[d] || 0))) return false;
      }
      return true;
    });
  }, [jobs, filters]);

  const totalFilteredJobs = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredJobs / jobsPerPage));
  const displayedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handleResetFilters = useCallback(() => {
    setFilters({ jobTitle: "", location: "", jobType: [], workPlace: [], company: "", datePosted: [] });
    setSearchInfo({ titleKeyword: "", location: "" });
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    if (jobListingsRef.current) {
      const y = jobListingsRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);


  return (
    <>
      <Helmet>
        <title>Find Latest Jobs & Hire Talent Faster | Smart Job Search - GreatHire</title>
        <meta name="description" content="Use advanced search and apply features on GreatHire to search and apply for the latest genuine job listings based on various search criteria, Hyderabad State, India, job title, location, company, job type, flexibility of the workplace, and the date of posting." />
      </Helmet>

      <div className="min-h-screen flex flex-col pb-4 bg-white dark:bg-gray-900">
        <Navbar />

        {/* Hero Section */}
        <div className="pt-4 pb-3 text-center px-4 sm:px-6 lg:px-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-5 my-10">
            <span className="mx-auto px-2 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium animate-bounce">
              No. 1 Job Hunt Website
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold leading-tight dark:text-white">
              <span className="block">Search Jobs</span>
              <span className="block mt-4">
                & Get Hired{" "}
                <span className="text-blue-700 dark:text-blue-500">Smarter, Faster, Risk Free</span>
              </span>
            </h1>
    
            <div className="flex items-center justify-center gap-2">
              <div className="w-full max-w-[900px]">
                {/* searchInfo.location is passed down so LocationSearch stays in sync with FilterCard */}
                <JobSearch searchInfo={searchInfo} onSearchUpdate={handleSearchUpdate} />
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Listing Section */}
        <div className="w-full bg-white dark:bg-gray-900">
          <div ref={jobListingsRef} className="flex-grow w-full max-w-[1500px] mx-auto pt-2 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

            {/* ── CHANGE: gap-4 added so sidebar and job list never touch ── */}
            <div className="flex gap-4">

              {/* Sidebar — ── CHANGE: reduced from lg:w-72 to lg:w-56, added pr-2 so content doesn't butt against job list ── */}
              <div className="hidden lg:block lg:w-56 lg:flex-shrink-0 lg:pl-4 lg:pr-2 pb-4">
                <FilterCard filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
              </div>

              {/* Main area — min-w-0 prevents flex overflow */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-4 lg:hidden px-4 sm:px-6">
                  <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors shadow-md">
                    <FiFilter size={18} /> Filters
                  </button>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{totalFilteredJobs} jobs</div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-r-transparent"></div>
                  </div>
                ) : displayedJobs.length > 0 ? (
                  <>
                    <LatestJobs jobs={displayedJobs} />
                    <div className="w-full flex flex-col sm:flex-row justify-center lg:justify-end items-center gap-4 mt-6 mb-6 px-4 sm:px-6">
                      <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>← Previous</button>
                      <span className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 text-center whitespace-nowrap">
                        Page <span className="text-blue-600 dark:text-blue-400">{currentPage}</span> of <span className="text-blue-600 dark:text-blue-400">{totalPages}</span>
                      </span>
                      <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next →</button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center h-40 px-4">
                    <span className="text-gray-500 dark:text-gray-400 text-lg">No jobs found matching your criteria</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" onClick={() => setIsFilterOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 w-64 sm:w-72 h-full shadow-2xl transform transition-transform duration-300 translate-x-0 overflow-y-auto">
              <FilterCard filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} onClose={() => setIsFilterOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Jobs;
