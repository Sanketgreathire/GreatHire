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

  // Define the qualification categories for filtering
const qualificationCategories = {
  bachelors: ["B.Tech", "BE", "B.Sc", "BCA", "BBA", "B.Com", "Bachelor’s Degree","Any Graduate"],
  masters: ["MCA", "MBA", "M.Sc", "M.Tech", "Master’s Degree", "Post Graduate", "MRCEM"],
  diploma: ["Diploma", "Polytechnic"],
  twelfth: ["12th Pass", "Intermediate"],
  tenth: ["10th Pass", "Matriculation"],
};

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

  const parseExperience = (experience) => {
    experience = experience.toLowerCase().trim(); // Always normalize input first
  
    if (experience.includes("fresher")) {
      return { min: 0, max: 0 }; // Freshers = 0 years experience
    } else if (experience.includes("more than")) {
      return { min: parseInt(experience.split(" ")[2]), max: Infinity }; // "More than X years"
    } else if (experience.includes("months")) {
      // Handle "6 months - 1 year" type
      const [minStr, maxStr] = experience.split("-").map(str => str.trim());
      let min = 0;
      let max = 0;
  
      if (minStr.includes("month")) {
        min = parseInt(minStr) / 12; // months to years
      } else {
        min = parseInt(minStr);
      }
  
      if (maxStr.includes("month")) {
        max = parseInt(maxStr) / 12;
      } else if (maxStr.includes("year")) {
        max = parseInt(maxStr);
      }
  
      return { min, max };
    } else if (experience.includes("-")) {
      const [min, max] = experience.split("-").map(str => parseInt(str.trim())); // "2-3 years"
      return { min, max };
    } else {
      const years = parseInt(experience);
      return { min: years, max: years }; // Single year "2 years"
    }
  };
  
const calculateActiveDays = (createdAt) => {
  if (!createdAt) return 0;
  const postedDate = new Date(createdAt);
  if (isNaN(postedDate.getTime())) return 0;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  postedDate.setUTCHours(0, 0, 0, 0);
  const diffInMs = today - postedDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays >= 0 ? diffInDays : 0;
};


  const filterJobs = (
    titleKeyword,
    location,
    jobType,
    workPlaceFlexibility,
    experience,
    qualifications,
    datePosted
  ) => {


    const filteredJobs = originalJobsList.filter((job) => {
      const { jobDetails } = job;
      if (!jobDetails) return false;
  
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
  
      const isJobTypeMatch = jobType
        ? jobDetails.jobType?.toLowerCase() === jobType.toLowerCase()
        : true;
  
      const isWorkPlaceFlexibilityMatch = workPlaceFlexibility
        ? jobDetails.workPlaceFlexibility?.toLowerCase() === workPlaceFlexibility.toLowerCase()
        : true;
  
      const isExperienceMatch = experience
        ? (() => {
            const parseExperience = (exp) => {
              exp = exp.toLowerCase().trim();
              if (exp.includes("fresher")) return { min: 0, max: 0 };
              if (exp.includes("more than")) {
                return { min: parseInt(exp.split(" ")[2]), max: Infinity };
              }
              if (exp.includes("months")) {
                const [minStr, maxStr] = exp.split("-").map((str) => str.trim());
                let min = minStr.includes("month")
                  ? parseInt(minStr) / 12
                  : parseInt(minStr);
                let max = maxStr.includes("month")
                  ? parseInt(maxStr) / 12
                  : parseInt(maxStr);
                return { min, max };
              }
              if (exp.includes("-")) {
                const [min, max] = exp
                  .split("-")
                  .map((str) => parseInt(str.trim()));
                return { min, max };
              }
              const years = parseInt(exp);
              return { min: years, max: years };
            };
  
            const jobExperience = parseExperience(jobDetails.experience || "");
            const filterExperience = parseExperience(experience);
            return (
              jobExperience.min <= filterExperience.max &&
              jobExperience.max >= filterExperience.min
            );
          })()
        : true;
  
      const isQualificationsMatch = qualifications
        ? (Array.isArray(jobDetails.qualifications)
            ? jobDetails.qualifications
            : [jobDetails.qualifications]
          ).some((q) => {
            console.log('hi')
            if (!q || typeof q !== "string") return false;
            return q.toLowerCase().trim().includes(qualifications.toLowerCase().trim());
          })()
        : true;


        const isDatePostedMatch = datePosted
        ? ((job) => {

            if (!job.createdAt) {
              console.warn(`Job ${job._id} has no createdAt field`);
              return false;
            }
            const diffInDays = calculateActiveDays(job.createdAt);
            if (diffInDays === 0 && job.createdAt) {
              console.warn(`Job ${job._id} has invalid createdAt: ${job.createdAt}`);
              return false;
            }
            const dateFilters = {
              "Last 24 hours": 1,
              "Last 3 days": 3,
              "Last 7 days": 7,
              "Last 14 days": 14,
            };
            const daysThreshold = dateFilters[datePosted];
            if (!daysThreshold) {
              console.warn(`Invalid datePosted value: ${datePosted}`);
              return true;
            }
            // console.log(`Job ${job._id}: diffInDays = ${diffInDays}, threshold = ${daysThreshold}`);
            return diffInDays <= daysThreshold;
          })(job)
        : true;
  
      return (
        isTitleMatch &&
        isLocationMatch &&
        isJobTypeMatch &&
        isWorkPlaceFlexibilityMatch &&
        isExperienceMatch &&
        isQualificationsMatch &&
        isDatePostedMatch
      );
    });
  
    setJobsList(filteredJobs);
    setSelectedJob(filteredJobs[0] || null);
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
  const resetFilter = () => {
    setJobsList(originalJobsList);
    setSelectedJob(originalJobsList[0] || null);
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
