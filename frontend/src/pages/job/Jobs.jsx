// Import necessary modules and dependencies
import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// Component for filtering job listings
import FilterCard from "./FilterCard";

// Job component to display individual job listings
import Job from "./Job";

// Context for managing job details
import { useJobDetails } from "@/context/JobDetailsContext";

const Jobs = () => {
  // Retrieve jobs, error state, and resetFilter function from context
  const { jobs, resetFilter, error } = useJobDetails();

  // State to manage loading status
  const [isLoading, setIsLoading] = useState(true);

  // State to hold filtered job listings
  const [filteredJobs, setFilteredJobs] = useState([]);

  // State to track the current page number for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Number of jobs to display per page
  const jobsPerPage = 24;

  // Reset filters when the component mounts
  useEffect(() => {
    resetFilter();
  }, []);

  // Update filtered job listings when jobs data or an error occurs
  useEffect(() => {
    if (jobs || error) {
      setIsLoading(false); // Stop loading when data is available
      setFilteredJobs(jobs || []); // Set filtered jobs to available jobs or an empty array
    }
  }, [jobs, error]);

  // Function to handle job search with filters
  const handleSearch = (filters) => {
    setFilteredJobs(
      jobs.filter((job) => {
        return (
          // Filter by location if provided
          (!filters.Location ||
            (job?.jobDetails?.location || "")
              .toLowerCase()
              .includes(filters.Location.toLowerCase())) &&
          // Filter by job title if provided
          (!filters["Job Title"] ||
            (job?.jobDetails?.title || "")
              .toLowerCase()
              .includes(filters["Job Title"].toLowerCase())) &&
          // Filter by job type if provided
          (!filters["Job Type"] ||
            (job?.jobDetails?.jobType || "")
              .toLowerCase()
              .includes(filters["Job Type"].toLowerCase())) &&
          // Filter by salary range if provided
          (!filters.Salary ||
            (() => {
              const enteredSalary = parseInt(filters.Salary, 10);
              if (isNaN(enteredSalary)) return true; // Ignore if salary is not a valid number

              // Extract numerical values from salary string
              const salaryRange = job?.jobDetails?.salary?.match(/\d+/g);
              if (!salaryRange) return false; // Skip if no salary information is found

              const minSalary = parseInt(salaryRange[0], 10);
              const maxSalary = salaryRange[1]
                ? parseInt(salaryRange[1], 10)
                : minSalary;

              // Check if the entered salary falls within the job's salary range
              return enteredSalary >= minSalary && enteredSalary <= maxSalary;
            })())
        );
      })
    );
  };

  // Function to reset job filters and display all jobs
  const resetFilters = () => {
    setFilteredJobs(jobs || []); // Reset to all available jobs
  };

  // Calculate indices for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  // Slice the filtered jobs list for the current page
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow w-full mx-auto bg-gray-100">
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
