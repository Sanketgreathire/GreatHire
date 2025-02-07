import React, { useState, useRef, useEffect } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { IoMdLink } from "react-icons/io";
import JobMajorDetails from "./JobMajorDetails";
import { useNavigate } from "react-router-dom";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import Navbar from "@/components/shared/Navbar";
//import { selectIsJobApplied } from "@/redux/appliedJobSlice";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import toast from "react-hot-toast";
import axios from "axios";

const JobsForYou = () => {
  const { jobs, selectedJob, setSelectedJob, toggleBookmarkStatus } =
    useJobDetails(); // Access functions from context
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showJobDetails, setShowJobDetails] = useState(false); // Added for small screen job details
  const jobContainerRef = useRef(null); // Ref to track the scrollable container

  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    // Reset scroll position when selected job changes
    if (jobContainerRef.current) {
      jobContainerRef.current.scrollTop = 0; // Reset scroll to the top
    }
  }, [selectedJob]); // Triggered whenever selectedJob changes

  const handleScroll = () => {
    // Track the scroll position
    console.log(jobContainerRef.current.scrollTop);
    if (jobContainerRef.current) {
      setScrollPosition(jobContainerRef.current.scrollTop);
    }
  };

  // check for current selected job
  const isApplied =
    selectedJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  // check is job applied or not in job list
  const hasAppliedToJob = (jobId) =>
    jobs.some(
      (job) =>
        job._id === jobId && // Check if the job ID matches
        job?.application?.some(
          (application) => application.applicant === user?._id // Check if the user has applied
        )
    );

  const isJobBookmarked = (userId) => selectedJob.saveJob.includes(userId);

  // for bookmark job for particular user
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

  const calculateActiveDays = (createdAt) => {
    const jobCreatedDate = new Date(createdAt); // Convert the 'createdAt' timestamp to a Date object
    const currentDate = new Date(); // Get the current date

    // Calculate the difference in time (in milliseconds)
    const timeDifference = currentDate - jobCreatedDate;

    // Convert time difference from milliseconds to days
    const activeDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Divide by the number of milliseconds in a day

    return activeDays;
  };

  // Function for handling the job card clicks
  const handleJobClick = (job) => {
    setSelectedJob(job);
    if (window.innerWidth < 768) {
      setShowJobDetails(true); // For showing job details on small screens
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center mt-4 gap-4 h-screen  md:px-6 sticky top-20">
        {/* Job List */}
        <div
          className={`flex flex-col gap-4  w-full md:w-1/2 h-screen m-5 md:m-0 scrollbar-hide overflow-y-scroll`}
        >
          {jobs?.map((job) => (
            <div
              key={job._id}
              className={`p-4 border-2  rounded-lg cursor-pointer hover:shadow-lg relative flex flex-col space-y-2 ${
                selectedJob?._id === job._id
                  ? "border-blue-600"
                  : "border-gray-400"
              }`}
              onClick={() => handleJobClick(job)} // Clicking on job card will show the details

              // onClick={() => {
              //   setSelectedJob(job);

              //   // Navigate to JobView for small screens
              //   if (window.innerWidth < 768) {
              //     navigate("/jobview");
              //   }
              // }}
            >
              <div className="flex justify-between items-center">
                {job?.jobDetails?.urgentHiring && (
                  <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">
                    Urgent Hiring
                  </p>
                )}
              </div>
              <h3 className="text-lg font-semibold">
                {job?.jobDetails?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {job.jobDetails?.companyName}
              </p>
              <p className="text-sm text-gray-500">
                {job?.jobDetails?.location}
              </p>

              <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">
                <AiOutlineThunderbolt className="mr-1" />
                <span>
                  Typically Respond in {job?.jobDetails?.respondTime} days
                </span>
              </div>

              <div className="text-sm flex flex-col">
                <div className="flex gap-2 items-center">
                  <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200 ">
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
                  <p className="p-1 font-semibold text-green-700 rounded-md bg-green-100 flex items-center gap-1 ">
                    {job?.jobDetails?.jobType}
                  </p>
                </div>
                <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200 w-fit mt-1">
                  {job?.jobDetails?.duration}
                </p>
              </div>

              {/*Removed easy apply option and its icon from job list's card*/}
              <div className="flex items-center text-sm text-blue-700">
                {hasAppliedToJob(job._id) && (
                  <span className="text-green-600">Applied</span>
                )}
              </div>

              {/* Job details in circle bullets */}
              <div
                className=" text-sm text-gray-400 flex flex-col font-semibold"
                style={{ listStyleType: "circle" }}
              >
                <span>{job.jobDetails?.benefits[0]},</span>
                <span>{job.jobDetails?.responsibilities[0]},</span>
                <span>{job.jobDetails?.qualifications[0]}</span>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Active {calculateActiveDays(job?.createdAt)} days ago
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedJob && (
          <div className="hidden md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2  h-screen ">
            <div className="bg-white shadow-md border-b px-4 py-4 flex flex-col space-y-2 w-full ">
              <h3 className="text-2xl font-semibold">
                {selectedJob?.jobDetails?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedJob?.jobDetails?.companyName}
              </p>
              <p className="text-sm text-gray-500">
                {selectedJob?.jobDetails?.location}
              </p>
              <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
                {selectedJob?.jobDetails?.salary
                  .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                  .split("-")
                  .map((part, index) => (
                    <span key={index}>
                      ₹{part.trim()}
                      {index === 0 ? " - " : ""}
                    </span>
                  ))}
              </p>

              <div className="p-1 flex items-center w-fit text-sm text-blue-800 bg-blue-200">
                <AiOutlineThunderbolt className="mr-1" size={20} />
                <span>
                  Typically Responds in {selectedJob?.jobDetails?.respondTime}{" "}
                  days.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`py-2 px-5 rounded-lg text-white ${
                    isApplied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {isApplied ? (
                    <div className="flex items-center gap-1">Applied</div>
                  ) : (
                    <button
                      className="flex items-center gap-1"
                      onClick={() => {
                        navigate(`/apply/${selectedJob?._id}`);
                      }}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
                {user &&
                  (isJobBookmarked(user?._id) ? (
                    <FaBookmark
                      size={25}
                      onClick={() => handleBookmark(selectedJob._id)}
                      className="text-green-700 cursor-pointer"
                    />
                  ) : (
                    <CiBookmark
                      size={25}
                      onClick={() => handleBookmark(selectedJob._id)}
                      className="cursor-pointer"
                    />
                  ))}
              </div>
            </div>

            <div
              ref={jobContainerRef}
              onScroll={handleScroll}
              className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4"
            >
              <JobMajorDetails selectedJob={selectedJob} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default JobsForYou;
