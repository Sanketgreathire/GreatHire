import React, { useState } from "react";
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

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { toggleBookmarkStatus, updateSaveJobs } = useJobDetails();
  const { user } = useSelector((state) => state.auth);
  const isBookmarked = job?.saveJob?.includes(user?._id) || false;

  const calculateActiveDays = (createdAt) => {
    const jobCreatedDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - jobCreatedDate;
    const activeDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return activeDays;
  };

  const isApplied =
    job?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const handleBookmark = async (jobId) => {
    try {
      const response = await axios.get(
        `${JOB_API_END_POINT}/bookmark-job/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toggleBookmarkStatus(jobId, user?._id);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error bookmarking job:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-5 rounded-md bg-white border border-grey-100">
      <div className="flex justify-between items-center mb-2">
        {job?.jobDetails?.urgentHiring && (
          <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">
            Urgent Hiring
          </p>
        )}
        <div className="flex items-center justify-between">
          {user && (
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
      <h3 className="text-lg font-semibold">{job?.jobDetails?.title}</h3>
      <div className="flex items-center justify-between gap-2 my-2">
        <div>{job?.jobDetails?.companyName}</div>
        <div>
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
