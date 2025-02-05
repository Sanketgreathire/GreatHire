import React, { useEffect, useState, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { IoMdSend,IoMdArrowBack } from "react-icons/io";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { MdBlock } from "react-icons/md";
import { IoMdLink } from "react-icons/io";
import JobMajorDetails from "./JobMajorDetails";
import { useNavigate } from "react-router-dom";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import Navbar from "@/components/shared/Navbar";
//import { selectIsJobApplied } from "@/redux/appliedJobSlice";

const JobsForYou = () => {
  const {
    jobs,
    selectedJob,
    setSelectedJob,
    changeBookmarkStatus,
    changeBlockStatus,
  } = useJobDetails(); // Access functions from context

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [showJobDetails, setShowJobDetails] = useState(false); // Added for small screen job details
  const jobDetailsRef = useRef(null);


  const isApplied =
    selectedJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const hasAppliedToJob = (jobId) =>
    jobs.some(
      (job) =>
        job._id === jobId && // Check if the job ID matches
        job?.application?.some(
          (application) => application.applicant === user?._id // Check if the user has applied
        )
    );

  // for bookmark job for particular user
  const handleBookmark = () => {};

  // for hide job for particular user
  const handleHiddenJob = () => {};


  useEffect(() => {
    if (jobDetailsRef.current) {
      jobDetailsRef.current.scrollTop = 0; // For reset the scroll position to the top whenever the selectedJob changes
    }
  }, [selectedJob]);

  const calculateActiveDays = (createdAt) => {
    const jobCreatedDate = new Date(createdAt); // Convert the 'createdAt' timestamp to a Date object
    const currentDate = new Date(); // Get the current date

    // Calculate the difference in time (in milliseconds)
    const timeDifference = currentDate - jobCreatedDate;

    // Convert time difference from milliseconds to days
    const activeDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Divide by the number of milliseconds in a day

    return activeDays;
  };

  const checkIfJobApplied = (jobId) => {
    return false;
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
      {/* Passing this state to navbar to hide "GREATHIRE" logo for small screen job details */}
      <Navbar showJobDetails={showJobDetails} setShowJobDetails={setShowJobDetails} />

    <div className="flex justify-center mt-4 gap-4 h-screen sticky top-10 md:px-6">
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
            <h3 className="text-lg font-semibold">{job.jobDetails?.title}</h3>
            <p className="text-sm text-gray-600">
              {job.jobDetails?.companyName}
            </p>
            <p className="text-sm text-gray-500">{job.jobDetails?.location}</p>

            <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">
              <AiOutlineThunderbolt className="mr-1" />
              <span>
                Typically Respond in {job.jobDetails?.respondTime} days
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
                  {job.jobDetails?.jobType} <FaHeart /> +1
                </p>
              </div>
              <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200 w-fit mt-1">
                {job.jobDetails?.duration} +1
              </p>
            </div>

            { /*Removed easy apply option and its icon from job list's card*/}
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

      {/* Job Details */}
      {selectedJob && (
        <div className="md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2 hidden">
          <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-4 flex flex-col space-y-2 w-full">
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
              <span className="text-blue-800">
                Typically Responds in {selectedJob?.jobDetails?.respondTime}{" "}
                days.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`py-2 px-5 rounded-lg text-white ${
                  isApplied
                    ? "bg-green-600 hover:bg-green-700 "
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isApplied ? (
                  <div className="flex items-center gap-1 ">Applied</div>
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
              <div
                className={`p-2 ${
                  selectedJob?.isBookmark ? "bg-green-200 " : "bg-gray-300 "
                } rounded-lg text-gray-800 cursor-pointer`}
              >
                <CiBookmark size={25} onClick={() => changeBookmarkStatus()} />
              </div>
              <div
                className={`p-2 ${
                  selectedJob?.isBlock ? "bg-red-200 " : "bg-gray-300 "
                } rounded-lg text-gray-800 cursor-pointer `}
              >
                <MdBlock size={25} onClick={() => changeBlockStatus()} />
              </div>
              <div className="p-2 bg-gray-300 rounded-lg text-gray-800 cursor-pointer">
                <IoMdLink size={25} />
              </div>
            </div>
          </div>

          <div ref={jobDetailsRef}
           className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4">
            <JobMajorDetails selectedJob={selectedJob} />
          </div>
        </div>
      )}

      {/* Job details section for small screens */}
      {showJobDetails && selectedJob && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out">
            {/* Modified in navbar - Back button replacing the "GREATHIRE" logo */}
            <div className="p-4 flex items-center justify-between border-b shadow-sm bg-white sticky top-0 z-10">
              <button
                className="text-blue-700 flex items-center gap-2"
                onClick={() => setShowJobDetails(false)}
              >
                <IoMdArrowBack size={24} />
                <span>Back</span>
              </button>
            </div>

      {/* Job title and info's for small screen */}
    <div className="p-6 pt-6">
      <h3 className="text-xl font-semibold text-gray-900">{selectedJob?.jobDetails?.title}</h3>
      <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
      <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
      <p className="mt-2 px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
     {selectedJob?.jobDetails?.salary}
    </p>

    <div className="mt-2 flex items-center text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-md w-fit">
      <AiOutlineThunderbolt className="mr-1" />
       Typically Responds in {selectedJob?.jobDetails?.respondTime} days
    </div>
  </div>

    <div className="p-2 flex items-center gap-4 border-b ml-4">
        <div
          className={`p-2 ${selectedJob?.isBookmark ? "bg-green-200" : "bg-gray-300"} rounded-lg text-gray-800 cursor-pointer -mt-6`}
          onClick={() => changeBookmarkStatus()}
        >
          <CiBookmark size={25} />
        </div>

        <div
          className={`p-2 ${selectedJob?.isBlock ? "bg-red-200" : "bg-gray-300"} rounded-lg text-gray-800 cursor-pointer -mt-6`}
          onClick={() => changeBlockStatus()}
        >
          <MdBlock size={25} />
        </div>

        <div className="p-2 bg-gray-300 rounded-lg text-gray-800 cursor-pointer -mt-6">
          <IoMdLink size={25} />
        </div>
      </div>

    {/* Job details for small screen*/}
        <div className="p-6 overflow-y-auto h-[calc(100vh-300px)] pb-20">
        <div className="mt-4">
        <p className="font-semibold text-gray-700">Job Type:</p>
        <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.jobType}</p>
        <p className="font-semibold text-gray-700">Duration:</p>
        <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.duration}</p>
      </div>

      {/* Job major details for small screen*/}
      <div className="mt-4">
        <JobMajorDetails selectedJob={selectedJob} />
      </div>
    </div>

      {/*Apply button for small screen*/}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex justify-center">
       <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full max-w-md flex items-center justify-center gap-2"
        onClick={() => navigate(`/apply/${selectedJob?._id}`)}
       >
         Apply Now
       </button>
      </div>
  </div>
  )}
  </div>
  </>
  );
};
export default JobsForYou;
