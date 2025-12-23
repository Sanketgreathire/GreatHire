// Import necessary modules and dependencies
import React, { useState, useEffect } from "react";

// Axios for making API requests
import axios from "axios";

// Button component for UI
import { Button } from "@/components/ui/button";

// Hook for navigation
import { useNavigate } from "react-router-dom";

// Icon for job application
import { AiOutlineThunderbolt } from "react-icons/ai";

// Redux hook to access global state
import { useSelector } from "react-redux";

// Unbookmarked icon
import { CiBookmark } from "react-icons/ci";

// Bookmarked icon
import { FaBookmark } from "react-icons/fa";

// API endpoint for job-related actions
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";

// Toast notifications for user feedback
import toast from "react-hot-toast";

// Context for managing job details
import { useJobDetails } from "@/context/JobDetailsContext";

// Share Job using ShareJob.jsx
import ShareCard from "./ShareJob";
import { FiShare2 } from "react-icons/fi";


// Job Component - Displays job details and handles bookmarking functionality
const Job = ({ job }) => {

  // Hook for programmatic navigation
  const navigate = useNavigate();


  // Share Jobs
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    const handleCloseAll = (e) => {
      if (e.detail !== job._id) {
        setShowShareCard(false);
      }
    };

    window.addEventListener("close-all-share-cards", handleCloseAll);
    return () => {
      window.removeEventListener("close-all-share-cards", handleCloseAll);
    };
  }, [job._id]);

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Close others first
    window.dispatchEvent(new CustomEvent("close-all-share-cards", { detail: job._id }));
    // Toggle current
    setShowShareCard((prev) => !prev);
  };



  // Functions to manage job bookmarks and selection
  const { toggleBookmarkStatus, setSelectedJob } = useJobDetails();

  // Get authenticated user details from Redux store
  const { user } = useSelector((state) => state.auth);

  // Check if the job is bookmarked by the user
  const isBookmarked = job?.saveJob?.includes(user?._id) || false;

  // Function to calculate the number of active days since job posting
  const calculateActiveDays = (createdAt) => {
    const jobCreatedDate = new Date(createdAt);
    const currentDate = new Date();

    // Time difference in milliseconds
    const timeDifference = currentDate - jobCreatedDate;

    // Convert milliseconds to days
    const activeDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return activeDays;
  };

  // Check if the user has already applied for this job
  const isApplied =
    job?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  // Function to handle bookmarking a job
  const handleBookmark = async (jobId) => {
    try {
      const response = await axios.get(
        `${JOB_API_END_POINT}/bookmark-job/${jobId}`,
        {
          withCredentials: true, // Include credentials for authentication
        }
      );

      // If the request is successful, update the bookmark status and show success message
      if (response.data.success) {
        toggleBookmarkStatus(jobId, user?._id); // Toggle bookmark status in context
        toast.success(response.data.message); // Display success notification
      }
    } catch (error) {
      console.error(
        "Error bookmarking job:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to bookmark the job. Please try again."); // Show error message
    }
  };


  return (
    <div className=" flex flex-col space-y-2 p-5 rounded-md bg-white border-grey-100 dark:text-white border-gray-100 dark:bg-[#2a2f3d] ">
      <div className="flex justify-between items-center mb-2 min-h-[28px]">

        {/* Urgent Hiring Label */}
        {job?.jobDetails?.urgentHiring === "Yes" && (
          <p className=" inline-block text-sm bg-violet-100 rounded-md px-2 p-1 text-violet-800 font-bold dark:text-gray-800 border-white ">
            Urgent Hiring
          </p>
        )}

        {/* Right side icons */}
        <div className="flex items-center gap-3 ml-auto ">

          {/* Share Icon (always visible) */}
          <div className="relative inline-block">
            <div onClick={handleShareClick} className="cursor-pointer">
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
              className="cursor-pointer"
            >
              {isBookmarked ? (
                <FaBookmark size={25} className="text-green-700" />
              ) : (
                <CiBookmark size={25} />
              )}
            </div>
          )}
        </div>
      </div>


      <h3 className="text-lg font-semibold line-clamp-2 h-[48px] ">{job?.jobDetails?.title}</h3>
      <div className="flex items-center justify-between gap-2 my-2 ">
        <div>{job?.jobDetails?.companyName}</div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-100">{job?.jobDetails?.workPlaceFlexibility}</p>
          <p className="text-sm text-gray-500 dark:text-gray-100">{job?.jobDetails?.location}</p>
        </div>
      </div>
      <div className="p-1 flex items-center w-full text-sm bg-blue-100 justify-center text-blue-800 rounded-md ">
        <div className="flex items-center gap-1 ">
          <AiOutlineThunderbolt />
          <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
        </div>
      </div>
      <div className="text-sm flex flex-col space-y-2 ">
        <div className="flex gap-2 justify-between items-center ">
          <div className="flex w-1/2">
            <p className="p-1 text-center w-full font-semibold text-gray-700 rounded-md bg-gray-200 ">
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
          <div className="flex w-1/2 ">
            <p className="p-1 w-full font-semibold text-green-700 rounded-md bg-green-100 flex items-center justify-center gap-1 ">
              {job.jobDetails?.jobType}
            </p>
          </div>
        </div>
        <div className="w-full ">
          <p className="p-1 text-center font-semibold text-gray-700 rounded-md bg-gray-200 ">
            {job.jobDetails?.duration}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-100 ">
            Active {calculateActiveDays(job?.createdAt)} days ago
          </p>
        </div>
        <div className="flex items-center text-sm text-blue-700 gap-2">
          {isApplied && <span className="text-green-600">Applied</span>}
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <Button
          onClick={() => {
            navigate(`/jobs/${job._id}`);
          }}
          variant="outline"
          className="w-full text-white bg-blue-700 hover:bg-blue-600 hover:text-white"
        >
          Details
        </Button>

      </div>

    </div>
  );
};

export default Job;