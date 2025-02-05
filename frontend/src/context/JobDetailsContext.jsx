import React, { createContext, useState, useContext, useEffect } from "react";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";

const JobDetailsContext = createContext();

export const useJobDetails = () => useContext(JobDetailsContext);

export const JobDetailsProvider = ({ children }) => {
  const [jobsList, setJobsList] = useState([]);
  const [originalJobsList, setOriginalJobsList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${JOB_API_END_POINT}/get`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const jobs = await response.json();
        setJobsList(jobs);
        setOriginalJobsList(jobs);
        setSelectedJob(jobs[0] || null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("An error occurred while fetching jobs.");
      }
    };

    fetchJobs();
  }, []);

  const toggleBookmarkStatus = (jobId, userId) => {
    setJobsList((prevJobs) =>
      prevJobs.map((job) => {
        if (job._id === jobId) {
          const isBookmarked = job.saveJob?.includes(userId);
          return {
            ...job,
            saveJob: isBookmarked
              ? job.saveJob.filter((id) => id !== userId) // Remove userId if exists
              : [...(job.saveJob || []), userId], // Add userId if not exists
          };
        }
        return job;
      })
    );
  
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
        error,
      }}
    >
      {children}
    </JobDetailsContext.Provider>
  );
};
