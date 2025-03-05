// Import necessary modules and dependencies
import React, { createContext, useState, useContext, useEffect } from "react";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";

// Creating a context to manage job details globally
const JobDetailsContext = createContext();

// Custom hook to use JobDetailsContext in other components
export const useJobDetails = () => useContext(JobDetailsContext);

const JobDetailsProvider = ({ children }) => {
  // State to store the list of jobs
  const [jobsList, setJobsList] = useState([]);

  // State to keep a copy of the original job list (useful for filtering or searching)
  const [originalJobsList, setOriginalJobsList] = useState([]);

  // State to store saved jobs for a user
  const [saveJobsList, setSaveJobsList] = useState([]);

  // State to store the currently selected job
  const [selectedJob, setSelectedJob] = useState(null);

  // State to manage errors during API calls
  const [error, setError] = useState(null);

  // Fetch job listings from the API when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${JOB_API_END_POINT}/get`);

        // If API call fails, throw an error
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const jobs = await response.json();

        // Store the fetched jobs in state
        setJobsList(jobs);
        setOriginalJobsList(jobs);

        // Set the first job as the default selected job (if available)
        setSelectedJob(jobs[0] || null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("An error occurred while fetching jobs.");
      }
    };

    fetchJobs();
  }, []);

  // Function to toggle bookmark status of a job
  const toggleBookmarkStatus = (jobId, userId) => {
    setJobsList((prevJobs) =>
      prevJobs.map((job) => {
        if (job._id === jobId) {
          const isBookmarked = job.saveJob?.includes(userId);
          return {
            ...job,
            saveJob: isBookmarked
              ? job.saveJob.filter((id) => id !== userId) // Remove bookmark
              : [...(job.saveJob || []), userId], // Add bookmark
          };
        }
        return job;
      })
    );

    // Update the original job list to ensure state consistency
    setOriginalJobsList((prevJobs) =>
      prevJobs.map((job) => {
        if (job._id === jobId) {
          const isBookmarked = job.saveJob?.includes(userId);
          return {
            ...job,
            saveJob: isBookmarked
              ? job.saveJob.filter((id) => id !== userId)
              : [...(job.saveJob || []), userId],
          };
        }
        return job;
      })
    );

    // Update the selected job if it matches the toggled job
    setSelectedJob((prevJob) => {
      if (!prevJob || prevJob._id !== jobId) return prevJob;

      const isBookmarked = prevJob.saveJob?.includes(userId);
      return {
        ...prevJob,
        saveJob: isBookmarked
          ? prevJob.saveJob.filter((id) => id !== userId)
          : [...(prevJob.saveJob || []), userId],
      };
    });
  };

  // Function to get saved jobs based on userId
  const getSaveJobs = (userId) => {
    if (!userId) return;

    const savedJobs = originalJobsList.filter((job) => {
      return job.saveJob && job.saveJob.includes(userId); // Check if job is saved by the user
    });

    // Update the saveJobsList state with the saved jobs for the user
    setSaveJobsList(savedJobs);
  };

  const filterJobs = (titleKeyword, location) => {
    const filteredJobs = originalJobsList.filter((job) => {
      const { jobDetails } = job;

      if (!jobDetails) {
        return false;
      }

      const isTitleMatch = titleKeyword
        ? [jobDetails.title, jobDetails.companyName]
            .map((field) => (field ? field.toLowerCase().trim() : ""))
            .some((field) => field.includes(titleKeyword.toLowerCase().trim()))
        : true;

      const isLocationMatch = location
        ? jobDetails.location
            .toLowerCase()
            .trim()
            .includes(location.toLowerCase().trim()) ||
          location
            .toLowerCase()
            .trim()
            .includes(jobDetails.location.toLowerCase().trim())
        : true;

      return isTitleMatch && isLocationMatch;
    });

    setJobsList(filteredJobs);
    setSelectedJob(filteredJobs[0] || null);
  };

  const resetFilter = () => {
    setJobsList(originalJobsList);
    setSelectedJob(originalJobsList[0] || null);
  };

  // New function to add an application to a job
  const addApplicationToJob = (jobId, newApplication) => {
    setJobsList((prevJobsList) =>
      prevJobsList.map((job) => {
        if (job._id === jobId) {
          return {
            ...job,
            application: [...(job.application || []), newApplication],
          };
        }
        return job;
      })
    );

    setOriginalJobsList((prevOriginalJobsList) =>
      prevOriginalJobsList.map((job) => {
        if (job._id === jobId) {
          return {
            ...job,
            application: [...(job.application || []), newApplication],
          };
        }
        return job;
      })
    );

    // Update the selected job if it's the one being modified
    setSelectedJob((prevSelectedJob) => {
      if (prevSelectedJob && prevSelectedJob._id === jobId) {
        return {
          ...prevSelectedJob,
          application: [...(prevSelectedJob.application || []), newApplication],
        };
      }
      return prevSelectedJob;
    });
  };

  return (
    <JobDetailsContext.Provider
      value={{
        jobs: jobsList,
        selectedJob,
        setSelectedJob,
        filterJobs,
        resetFilter,
        toggleBookmarkStatus,
        addApplicationToJob,
        getSaveJobs,
        saveJobsList,
        error,
      }}
    >
      {children}
    </JobDetailsContext.Provider>
  );
};

export default JobDetailsProvider;
