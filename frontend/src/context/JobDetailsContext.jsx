import React, { createContext, useState, useContext, useEffect, useMemo, useCallback, useRef } from "react";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector } from "react-redux";

const JobDetailsContext = createContext();

export const useJobDetails = () => useContext(JobDetailsContext);

const JobDetailsProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  const [jobsList, setJobsList] = useState([]);
  const [originalJobsList, setOriginalJobsList] = useState([]);
  const [saveJobsList, setSaveJobsList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchMeta, setSearchMeta] = useState({ total: 0, query: null });

  // Fetch jobs from backend /search endpoint with optional filter params
  const fetchJobs = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const qs = new URLSearchParams();
      if (params.query) qs.set("query", params.query);
      if (params.location) qs.set("location", params.location);
      if (params.workPlaceFlexibility) qs.set("workPlaceFlexibility", params.workPlaceFlexibility);
      if (params.jobType) qs.set("jobType", params.jobType);
      if (params.experience) qs.set("experience", params.experience);
      qs.set("limit", params.limit || 50);

      const response = await fetch(`${JOB_API_END_POINT}/search?${qs.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.status}`);
      const data = await response.json();
      if (!data.success) throw new Error("Invalid response");
      const jobs = data.jobs || [];
      setJobsList(jobs);
      setOriginalJobsList(jobs);
      setSelectedJob(jobs[0] || null);
      setSearchMeta({ total: data.total || jobs.length, query: data.query || null });
    } catch (err) {
      console.error("[JobDetailsContext] fetch error:", err.message);
      setError("An error occurred while fetching jobs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load — fetch all jobs
  useEffect(() => {
    const t = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(t);
  }, [fetchJobs]);

  // filterJobs now calls the backend instead of filtering client-side
  const filterJobs = useCallback((
    titleKeyword,
    location,
    jobType,
    workPlaceFlexibility,
    experience,
    _qualifications,
    _datePosted
  ) => {
    fetchJobs({
      query: titleKeyword || undefined,
      location: Array.isArray(location) ? location[0] : location || undefined,
      jobType: Array.isArray(jobType) ? jobType[0] : jobType || undefined,
      workPlaceFlexibility: Array.isArray(workPlaceFlexibility) ? workPlaceFlexibility[0] : workPlaceFlexibility || undefined,
      experience: experience || undefined,
    });
  }, [fetchJobs]);

  const resetFilter = useCallback(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Toggle bookmark status locally (no re-fetch needed)
  const toggleBookmarkStatus = (jobId, userId) => {
    const toggle = (jobs) =>
      jobs.map((job) =>
        job._id === jobId
          ? {
              ...job,
              saveJob: job.saveJob?.includes(userId)
                ? job.saveJob.filter((id) => id !== userId)
                : [...(job.saveJob || []), userId],
            }
          : job
      );
    setJobsList(toggle);
    setOriginalJobsList(toggle);
    setSelectedJob((prev) =>
      prev && prev._id === jobId
        ? {
            ...prev,
            saveJob: prev.saveJob?.includes(userId)
              ? prev.saveJob.filter((id) => id !== userId)
              : [...(prev.saveJob || []), userId],
          }
        : prev
    );
  };

  const getSaveJobs = (userId) => {
    if (!userId) return;
    setSaveJobsList(originalJobsList.filter((job) => job.saveJob?.includes(userId)));
  };

  const addApplicationToJob = (jobId, newApplication) => {
    const add = (jobs) =>
      jobs.map((job) =>
        job._id === jobId
          ? { ...job, application: [...(job.application || []), newApplication] }
          : job
      );
    setJobsList(add);
    setOriginalJobsList(add);
    setSelectedJob((prev) =>
      prev && prev._id === jobId
        ? { ...prev, application: [...(prev.application || []), newApplication] }
        : prev
    );
  };

  const contextValue = useMemo(() => ({
    jobs: jobsList,
    selectedJob,
    setSelectedJob,
    filterJobs,
    resetFilter,
    fetchJobs,
    toggleBookmarkStatus,
    addApplicationToJob,
    getSaveJobs,
    saveJobsList,
    searchMeta,
    error,
    isLoading,
  }), [jobsList, selectedJob, saveJobsList, searchMeta, error, isLoading]);

  return (
    <JobDetailsContext.Provider value={contextValue}>
      {children}
    </JobDetailsContext.Provider>
  );
};

export default JobDetailsProvider;
