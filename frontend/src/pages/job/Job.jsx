// Import necessary modules and dependencies
import React from "react";

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

// Job Component - Displays job details and handles bookmarking functionality
const Job = ({ job }) => {

  // Hook for programmatic navigation
  const navigate = useNavigate(); 

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
    <div className="flex flex-col space-y-2 p-5 rounded-md bg-white border border-grey-100">
      <div className="flex justify-between items-center mb-2 min-h-[28px]">
        {job?.jobDetails?.urgentHiring === "Yes" && (
          <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">
            Urgent Hiring
          </p>
        )}
          {user &&
            !isApplied && ( // Hides the bookmark button if the user has applied
              <div
                onClick={() => handleBookmark(job._id)}
                className="cursor-pointer ml-auto"
              >
                {isBookmarked ? (
                  <FaBookmark size={25} className="text-green-700" />
                ) : (
                  <CiBookmark size={25} />
                )}
              </div>
            )}
      </div>
      <h3 className="text-lg font-semibold line-clamp-2 h-[48px]">{job?.jobDetails?.title}</h3>
      <div className="flex items-center justify-between gap-2 my-2">
        <div>{job?.jobDetails?.companyName}</div>
        <div>
          <p className="text-sm text-gray-500">{job?.jobDetails?.workPlaceFlexibility}</p>
          <p className="text-sm text-gray-500">{job?.jobDetails?.location}</p>
        </div>
      </div>
      <div className="p-1 flex items-center w-full text-sm bg-blue-100 justify-center text-blue-800 rounded-md">
        <div className="flex items-center gap-1">
          <AiOutlineThunderbolt />
          <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
        </div>
      </div>
      <div className="text-sm flex flex-col space-y-2">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex w-1/2">
            <p className="p-1 text-center w-full font-semibold text-gray-700 rounded-md bg-gray-200">
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
          <div className="flex w-1/2">
            <p className="p-1 w-full font-semibold text-green-700 rounded-md bg-green-100 flex items-center justify-center gap-1">
              {job.jobDetails?.jobType}
            </p>
          </div>
        </div>
        <div className="w-full">
          <p className="p-1 text-center font-semibold text-gray-700 rounded-md bg-gray-200">
            {job.jobDetails?.duration}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
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
            setSelectedJob(job);
            navigate(`/description`);
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