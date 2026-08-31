import React, { useEffect, useCallback, useMemo, useState } from "react";
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

  const isBookmarked = useMemo(
    () => job?.saveJob?.includes(user?._id) || false,
    [job?.saveJob, user?._id]
  );

  const isApplied = useMemo(
    () =>
      job?.application?.some(
        (a) =>
          String(a.applicant?._id || a.applicant) === String(user?._id)
      ) || false,
    [job?.application, user?._id]
  );

  const activeDays = useMemo(
    () =>
      Math.floor(
        (Date.now() - new Date(job?.createdAt)) / 86400000
      ),
    [job?.createdAt]
  );

  useEffect(() => {
    const handleCloseAll = (event) => {
      if (event.detail !== job?._id) {
        setShowShareCard(false);
      }
    };

    window.addEventListener("close-all-share-cards", handleCloseAll);

    return () =>
      window.removeEventListener("close-all-share-cards", handleCloseAll);
  }, [job?._id]);

  const handleShareClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      window.dispatchEvent(
        new CustomEvent("close-all-share-cards", {
          detail: job?._id,
        })
      );

      setShowShareCard((prev) => !prev);
    },
    [job?._id]
  );

  const handleBookmark = useCallback(
    async (jobId) => {
      if (!user?._id) return;

      try {
        const response = await axios.get(
          `${JOB_API_END_POINT}/bookmark-job/${jobId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          toggleBookmarkStatus(jobId, user._id);
          toast.success(response.data.message);
        }
      } catch {
        toast.error("Failed to bookmark the job. Please try again.");
      }
    },
    [user?._id, toggleBookmarkStatus]
  );

  const handleView = useCallback(() => {
    user ? navigate(`/jobs/${job?._id}`) : navigate("/signup");
  }, [user, navigate, job?._id]);

  const formattedSalary = String(job?.jobDetails?.salary || "")
    .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
    .split("-");

  return (
    <div className="flex flex-col space-y-2 rounded-md border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
      <div className="flex min-h-[28px] items-center justify-between">
        {job?.jobDetails?.urgentHiring === "Yes" ? (
          <p className="inline-block rounded-md border border-violet-200 bg-violet-100 px-2 p-1 text-sm font-bold text-violet-800 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
            Urgent Hiring
          </p>
        ) : (
          <span />
        )}

        <div className="ml-auto flex items-center gap-3">
          <div className="relative inline-block">
            <div
              onClick={handleShareClick}
              className="cursor-pointer text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiShare2 size={22} />
            </div>

            {showShareCard && (
              <ShareCard
                urlToShare={`${window.location.origin}/jobs/${job?._id}`}
                jobTitle={job?.jobDetails?.title}
                jobLocation={job?.jobDetails?.location}
                jobSalary={job?.jobDetails?.salary}
                jobType={job?.jobDetails?.jobType}
                jobDuration={job?.jobDetails?.duration}
                onClose={() => setShowShareCard(false)}
              />
            )}
          </div>

          {user && !isApplied && (
            <div
              onClick={() => handleBookmark(job?._id)}
              className="cursor-pointer transition-colors"
            >
              {isBookmarked ? (
                <FaBookmark
                  size={25}
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                />
              ) : (
                <CiBookmark
                  size={25}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <h3 className="line-clamp-2 min-h-[48px] text-lg font-semibold text-gray-900 dark:text-white">
        {job?.jobDetails?.title}
      </h3>

      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="truncate font-medium text-gray-700 dark:text-gray-300">
          {job?.jobDetails?.companyName}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {job?.jobDetails?.workPlaceFlexibility}
          </p>
          <p className="max-w-[120px] truncate text-sm text-gray-600 dark:text-gray-400 sm:max-w-none">
            {job?.jobDetails?.location}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center rounded-md border border-blue-200 bg-blue-100 p-1 text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
        <div className="flex items-center gap-1">
          <AiOutlineThunderbolt size={16} />
          <span>
            Typically Respond in {job?.jobDetails?.respondTime ?? "—"} days
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex min-w-0 w-full sm:w-1/2">
            <p className="w-full rounded-md border border-gray-300 bg-gray-200 p-1 text-center font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {formattedSalary.map((part, index) => (
                <span key={index}>
                  ₹{part.trim()}
                  {index === 0 ? " - " : ""}
                </span>
              ))}
            </p>
          </div>

          <div className="flex min-w-0 w-full sm:w-1/2">
            <p className="flex w-full items-center justify-center gap-1 truncate rounded-md border border-green-200 bg-green-100 p-1 text-xs font-semibold text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-400 sm:text-sm">
              {job?.jobDetails?.jobType}
            </p>
          </div>
        </div>

        <div className="w-full">
          <p className="rounded-md border border-gray-300 bg-gray-200 p-1 text-center font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {job?.jobDetails?.duration}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Active {Number.isFinite(activeDays) ? activeDays : 0} days ago
        </p>

        {isApplied && (
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            ✓ Applied
          </span>
        )}
      </div>

      <div className="flex w-full items-center justify-between gap-4">
        <Button
          onClick={handleView}
          variant="outline"
          className="w-full border-blue-600 bg-blue-700 text-white transition-colors hover:bg-blue-600 dark:border-blue-600 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600"
        >
          View
        </Button>
      </div>
    </div>
  );
};

export default Job;