import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
 
  const fetchJobs = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
 
    try {
      const qs = new URLSearchParams();
 
      if (params.query) qs.set("query", params.query);
      if (params.location) qs.set("location", params.location);
      if (params.workPlaceFlexibility) {
        qs.set("workPlaceFlexibility", params.workPlaceFlexibility);
      }
      if (params.jobType) qs.set("jobType", params.jobType);
      if (params.experience) qs.set("experience", params.experience);
      qs.set("limit", String(params.limit || 50));
 
      const response = await fetch(
        `${JOB_API_END_POINT}/search?${qs.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
 
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }
 
      const payload = await response.json();
 
      const jobs = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.jobs)
          ? payload.jobs
          : [];
 
      const total = Array.isArray(payload)
        ? jobs.length
        : Number(payload?.total ?? jobs.length);
 
      const query = Array.isArray(payload)
        ? params.query || null
        : payload?.query ?? params.query ?? null;
 
      setJobsList(jobs);
      setOriginalJobsList(jobs);
      setSelectedJob(jobs[0] || null);
      setSearchMeta({ total, query });
    } catch (err) {
      console.error("[JobDetailsContext] fetch error:", err);
      setError("An error occurred while fetching jobs.");
      setJobsList([]);
      setOriginalJobsList([]);
      setSelectedJob(null);
      setSearchMeta({ total: 0, query: null });
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);
 
  const filterJobs = useCallback(
    (
      titleKeyword,
      location,
      jobType,
      workPlaceFlexibility,
      experience
    ) => {
      fetchJobs({
        query: titleKeyword || undefined,
        location: Array.isArray(location) ? location[0] : location || undefined,
        jobType: Array.isArray(jobType) ? jobType[0] : jobType || undefined,
        workPlaceFlexibility: Array.isArray(workPlaceFlexibility)
          ? workPlaceFlexibility[0]
          : workPlaceFlexibility || undefined,
        experience: experience || undefined,
      });
    },
    [fetchJobs]
  );
 
  const resetFilter = useCallback(() => {
    fetchJobs();
  }, [fetchJobs]);
 
  const toggleBookmarkStatus = useCallback((jobId, userId) => {
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
  }, []);
 
  const getSaveJobs = useCallback((userId) => {
    if (!userId) {
      setSaveJobsList([]);
      return;
    }
 
    setSaveJobsList(
      originalJobsList.filter((job) => job.saveJob?.includes(userId))
    );
  }, [originalJobsList]);
 
  const addApplicationToJob = useCallback((jobId, newApplication) => {
    const add = (jobs) =>
      jobs.map((job) =>
        job._id === jobId
          ? {
              ...job,
              application: [...(job.application || []), newApplication],
            }
          : job
      );
 
    setJobsList(add);
    setOriginalJobsList(add);
 
    setSelectedJob((prev) =>
      prev && prev._id === jobId
        ? {
            ...prev,
            application: [...(prev.application || []), newApplication],
          }
        : prev
    );
  }, []);
 
  const contextValue = useMemo(
    () => ({
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
      user,
    }),
    [
      jobsList,
      selectedJob,
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
      user,
    ]
  );
 
  return (
    <JobDetailsContext.Provider value={contextValue}>
      {children}
    </JobDetailsContext.Provider>
  );
};
 
export default JobDetailsProvider;
 

