import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { useSelector } from "react-redux";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import toast from "react-hot-toast";
import { useJobDetails } from "@/context/JobDetailsContext";
import ShareCard from "./ShareJob";
import { FiShare2 } from "react-icons/fi";


const Job = ({ job }) => {
  const navigate = useNavigate();
  const [showShareCard, setShowShareCard] = useState(false);
  const { toggleBookmarkStatus } = useJobDetails();
  const { user } = useSelector((state) => state.auth);

  const isBookmarked = useMemo(() => job?.saveJob?.includes(user?._id) || false, [job?.saveJob, user?._id]);
  const isApplied = useMemo(() => job?.application?.some((a) => a.applicant === user?._id) || false, [job?.application, user?._id]);
  const activeDays = useMemo(() => Math.floor((Date.now() - new Date(job?.createdAt)) / 86400000), [job?.createdAt]);

  useEffect(() => {
    const handleCloseAll = (e) => { if (e.detail !== job._id) setShowShareCard(false); };
    window.addEventListener("close-all-share-cards", handleCloseAll);
    return () => window.removeEventListener("close-all-share-cards", handleCloseAll);
  }, [job._id]);

  const handleShareClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("close-all-share-cards", { detail: job._id }));
    setShowShareCard((prev) => !prev);
  }, [job._id]);

  const handleBookmark = useCallback(async (jobId) => {
    try {
      const response = await axios.get(`${JOB_API_END_POINT}/bookmark-job/${jobId}`, { withCredentials: true });
      if (response.data.success) {
        toggleBookmarkStatus(jobId, user?._id);
        toast.success(response.data.message);
      }
    } catch {
      toast.error("Failed to bookmark the job. Please try again.");
    }
  }, [user?._id, toggleBookmarkStatus]);

  const handleView = useCallback(() => {
    user ? navigate(`/jobs/${job._id}`) : navigate("/signup");
  }, [user, navigate, job._id]);


  return (
    <div className="flex flex-col space-y-2 p-5 rounded-md bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 border">
        
        {/* Header Section with Badge and Icons */}
        <div className="flex justify-between items-center mb-2 min-h-[28px]">

          {/* Urgent Hiring Label */}
          {job?.jobDetails?.urgentHiring === "Yes" && (
            <p className="inline-block text-sm bg-violet-100 rounded-md px-2 p-1 text-violet-800 font-bold border border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700">
              Urgent Hiring
            </p>
          )}

          {/* Right side icons */}
          <div className="flex items-center gap-3 ml-auto">

            {/* Share Icon (always visible) */}
            <div className="relative inline-block">
              <div onClick={handleShareClick} className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                <FiShare2 size={22} />
              </div>
              {showShareCard && (
                <ShareCard
                  urlToShare={`${window.location.origin}/jobs/${job._id}`}
                  jobTitle={job?.jobDetails?.title}
                  jobLocation={job?.jobDetails?.location}
                  jobSalary={job?.jobDetails?.salary}
                  jobType={job?.jobDetails?.jobType}
                  jobDuration={job?.jobDetails?.duration}
                  onClose={() => setShowShareCard(false)}
                />
              )}
            </div>

            {/* Bookmark Icon (only if logged in & not applied) */}
            {user && !isApplied && (
              <div
                onClick={() => handleBookmark(job._id)}
                className="cursor-pointer transition-colors"
              >
                {isBookmarked ? (<FaBookmark size={25} className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"/>
                ) : (
                  <CiBookmark size={25} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"/>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Title */}
        <h3 className="text-lg font-semibold line-clamp-2 h-[48px] text-gray-900 dark:text-white">{job?.jobDetails?.title}</h3>

        {/* Company Name and Location Section */}
        <div className="flex items-center justify-between gap-2 my-2">
          <div className="text-gray-700 dark:text-gray-300 font-medium">{job?.jobDetails?.companyName}</div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">{job?.jobDetails?.workPlaceFlexibility}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{job?.jobDetails?.location}</p>
          </div>
        </div>

        {/* Response Time Badge */}
        <div className="p-1 flex items-center w-full text-sm bg-blue-100 dark:bg-blue-900/30 justify-center text-blue-800 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-1">
            <AiOutlineThunderbolt size={16} />
            <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
          </div>
        </div>

        {/* Salary, Job Type, and Duration Section */}
        <div className="text-sm flex flex-col space-y-2">
          <div className="flex gap-2 justify-between items-center">
            {/* Salary */}
            <div className="flex w-1/2">
              <p className="p-1 text-center w-full font-semibold text-gray-700 dark:text-gray-300 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                {job?.jobDetails?.salary
                  .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                  .split("-")
                  .map((part, index) => (
                    <span key={index}>
                      ₹{part.trim()}
                      {index === 0 ? " - " : ""}
                    </span>
                  ))}
              </p>
            </div>
            
            {/* Job Type */}
            <div className="flex w-1/2">
              <p className="p-1 w-full font-semibold text-green-700 dark:text-green-400 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center gap-1 border border-green-200 dark:border-green-700">
                {job.jobDetails?.jobType}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="w-full">
            <p className="p-1 text-center font-semibold text-gray-700 dark:text-gray-300 rounded-md bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
              {job.jobDetails?.duration}
            </p>
          </div>
        </div>

        {/* Active Days and Applied Status Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active {activeDays} days ago
            </p>
          </div>
          <div className="flex items-center text-sm text-blue-700 dark:text-blue-400 gap-2">
            {isApplied && <span className="text-green-600 dark:text-green-400 font-semibold">✓ Applied</span>}
          </div>
        </div>

        {/* Details Button */}
        <div className="flex w-full items-center justify-between gap-4">
          <Button onClick={handleView} variant="outline" className="w-full text-white bg-blue-700 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white dark:border-blue-600 transition-colors">
            View
          </Button>
        </div>
      </div>
  );
};

export default Job;