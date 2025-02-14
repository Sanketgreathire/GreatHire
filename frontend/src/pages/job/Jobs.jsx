import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useJobDetails } from "@/context/JobDetailsContext";

const Jobs = () => {
  const { jobs, resetFilter, error } = useJobDetails();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 24;

  useEffect(()=>{
    resetFilter();
  }, [])

  useEffect(() => {
    if (jobs || error) {
      setIsLoading(false);
      setFilteredJobs(jobs || []);
    }
  }, [jobs, error]);

  const handleSearch = (filters) => {
    setFilteredJobs(
      jobs.filter((job) => {
        return (
          (!filters.Location ||
            (job?.jobDetails?.location || "")
              .toLowerCase()
              .includes(filters.Location.toLowerCase())) &&
          (!filters["Job Title"] ||
            (job?.jobDetails?.title || "")
              .toLowerCase()
              .includes(filters["Job Title"].toLowerCase())) &&
          (!filters["Job Type"] ||
            (job?.jobDetails?.jobType || "")
              .toLowerCase()
              .includes(filters["Job Type"].toLowerCase())) &&
          (!filters.Qualifications ||
            (job?.jobDetails?.qualifications || "")
              .toLowerCase()
              .includes(filters.Qualifications.toLowerCase())) &&
          (!filters.Salary ||
            (() => {
              const enteredSalary = parseInt(filters.Salary, 10);
              if (isNaN(enteredSalary)) return true; // Ignore if not a valid number

              const salaryRange = job?.jobDetails?.salary?.match(/\d+/g);
              if (!salaryRange) return false; // No salary range found in the job

              const minSalary = parseInt(salaryRange[0], 10);
              const maxSalary = salaryRange[1] ? parseInt(salaryRange[1], 10) : minSalary;

              return enteredSalary >= minSalary && enteredSalary <= maxSalary;
            })())
        );
      })
    );
  };

  const resetFilters = () => {
    setFilteredJobs(jobs || []); // Reset to all jobs
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow w-full mx-auto bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100">
        <div className="w-full px-4 py-4">
        <FilterCard onSearch={handleSearch} resetFilters={resetFilters} />

        </div>
        <div className="px-4 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
            </div>
          ) : currentJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {currentJobs.map((job) => (
                  <div key={job._id}>
                    <Job job={job} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
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
      <Footer />
    </div>
  );
};

export default Jobs;

