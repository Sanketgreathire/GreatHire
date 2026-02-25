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
  const [originalJobsList, setOriginalJobsList] = useState([]);
  const [saveJobsList, setSaveJobsList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);

  // Define the qualification categories for filtering
  const qualificationCategories = {
    bachelors: ["B.Tech", "BE", "B.Sc", "BCA", "BBA", "B.Com", "Bachelor’s Degree", "Any Graduate"],
    masters: ["MCA", "MBA", "M.Sc", "M.Tech", "Master’s Degree", "Post Graduate", "MRCEM"],
    diploma: ["Diploma", "Polytechnic"],
    twelfth: ["12th Pass", "Intermediate"],
    tenth: ["10th Pass", "Matriculation"],
  };

  // Fetch job listings from the API when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // const response = await fetch(`${JOB_API_END_POINT}/get`);
  
        // If API call fails, throw an error
        const response = await fetch(`${JOB_API_END_POINT}/jobs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
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

  // Function to toggle bookmark status of a job
  const toggleBookmarkStatus = (jobId, userId) => {
    setJobsList((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId
          ? {
              ...job,
              saveJob: job.saveJob?.includes(userId)
                ? job.saveJob.filter((id) => id !== userId)
                : [...(job.saveJob || []), userId],
            }
          : job
      )
    );

    setOriginalJobsList((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId
          ? {
              ...job,
              saveJob: job.saveJob?.includes(userId)
                ? job.saveJob.filter((id) => id !== userId)
                : [...(job.saveJob || []), userId],
            }
          : job
      )
    );

    setSelectedJob((prevJob) =>
      prevJob && prevJob._id === jobId
        ? {
            ...prevJob,
            saveJob: prevJob.saveJob?.includes(userId)
              ? prevJob.saveJob.filter((id) => id !== userId)
              : [...(prevJob.saveJob || []), userId],
          }
        : prevJob
    );
  };

  // Function to get saved jobs based on userId
  const getSaveJobs = (userId) => {
    if (!userId) return;
    const savedJobs = originalJobsList.filter(
      (job) => job.saveJob && job.saveJob.includes(userId)
    );
    setSaveJobsList(savedJobs);
  };

  const parseExperience = (experience) => {
    experience = experience.toLowerCase().trim();
    if (experience.includes("fresher")) return { min: 0, max: 0 };
    if (experience.includes("more than")) {
      return { min: parseInt(experience.split(" ")[2]), max: Infinity };
    }
    if (experience.includes("months")) {
      const [minStr, maxStr] = experience.split("-").map((str) => str.trim());
      let min = minStr.includes("month") ? parseInt(minStr) / 12 : parseInt(minStr);
      let max = maxStr.includes("month")
        ? parseInt(maxStr) / 12
        : maxStr.includes("year")
        ? parseInt(maxStr)
        : 0;
      return { min, max };
    }
    if (experience.includes("-")) {
      const [min, max] = experience.split("-").map((str) => parseInt(str.trim()));
      return { min, max };
    }
    const years = parseInt(experience);
    return { min: years, max: years };
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
        ? jobDetails.location.toLowerCase().trim().includes(location.toLowerCase().trim()) ||
          location.toLowerCase().trim().includes(jobDetails.location.toLowerCase().trim())
        : true;

      const isJobTypeMatch = jobType
        ? jobDetails.jobType?.toLowerCase() === jobType.toLowerCase()
        : true;

      const isWorkPlaceFlexibilityMatch = workPlaceFlexibility
        ? jobDetails.workPlaceFlexibility?.toLowerCase() === workPlaceFlexibility.toLowerCase()
        : true;

      const isExperienceMatch = experience
        ? (() => {
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
          ).some(
            (q) =>
              q &&
              typeof q === "string" &&
              q.toLowerCase().trim().includes(qualifications.toLowerCase().trim())
          )
        : true;

      const isDatePostedMatch = datePosted
        ? (() => {
            if (!job.createdAt) return false;
            const diffInDays = calculateActiveDays(job.createdAt);
            const dateFilters = {
              "Last 24 hours": 1,
              "Last 3 days": 3,
              "Last 7 days": 7,
              "Last 14 days": 14,
            };
            const daysThreshold = dateFilters[datePosted];
            return daysThreshold ? diffInDays <= daysThreshold : true;
          })()
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

  const addApplicationToJob = (jobId, newApplication) => {
    setJobsList((prevJobsList) =>
      prevJobsList.map((job) =>
        job._id === jobId
          ? { ...job, application: [...(job.application || []), newApplication] }
          : job
      )
    );

    setOriginalJobsList((prevOriginalJobsList) =>
      prevOriginalJobsList.map((job) =>
        job._id === jobId
          ? { ...job, application: [...(job.application || []), newApplication] }
          : job
      )
    );

    setSelectedJob((prevSelectedJob) =>
      prevSelectedJob && prevSelectedJob._id === jobId
        ? {
            ...prevSelectedJob,
            application: [...(prevSelectedJob.application || []), newApplication],
          }
        : prevSelectedJob
    );
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