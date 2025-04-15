  // -----------------------------------------------------------------------------------------------------------------
  import React, { useState, useRef, useEffect } from "react";
  import { AiOutlineThunderbolt } from "react-icons/ai";
  import { CiBookmark } from "react-icons/ci";
  import { FaBookmark, FaHeart } from "react-icons/fa";
  import { IoMdClose } from "react-icons/io";
  import JobMajorDetails from "./JobMajorDetails";
  import { useNavigate } from "react-router-dom";
  import { useJobDetails } from "@/context/JobDetailsContext";
  import { useSelector } from "react-redux";
  import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
  import toast from "react-hot-toast";
  import axios from "axios";
  
  const JobsForYou = () => {
    // Access functions from context
    const { jobs, selectedJob, setSelectedJob, toggleBookmarkStatus } =
      useJobDetails();
  
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
  
    // Added for small screen job details
    const [showJobDetails, setShowJobDetails] = useState(false);
  
    // Ref to track the scrollable container
    const jobContainerRef = useRef(null);
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setShowJobDetails(false);
        }
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
      // Reset scroll position when selected job changes
      if (jobContainerRef.current) {
        jobContainerRef.current.scrollTop = 0; // Reset scroll to the top
      }
    }, [selectedJob]); // Triggered whenever selectedJob changes
  
    const handleScroll = () => {
      // Track the scroll position
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
            >
              <div className="flex justify-between items-center">
                {job?.jobDetails?.urgentHiring === "Yes" && (
                  <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">
                    Urgent Hiring
                  </p>
                )}
              </div>
              <h3 className="text-lg font-semibold">{job.jobDetails?.title}</h3>
              <p className="text-sm text-gray-600">
                {job.jobDetails?.companyName}
              </p>
              <p className="text-sm text-gray-500">{job.jobDetails?.workPlaceFlexibility}   {job.jobDetails?.location}</p>
         
  
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
  
        {/* Job Details */}
        {selectedJob && (
          <div className="md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2 hidden">
            <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-2 flex flex-col space-y-1 w-full">
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
  
                {/* Hide bookmark button if the user has applied */}
                {!isApplied &&
                  user &&
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
  
        {/* SMALL SCREEN JOB DETAILS SECTION */}
        {showJobDetails && selectedJob && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out">
            {/* Button for closing small screen job details */}
            <button
              className="fixed top-[80px] right-4 bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300 transition duration-200 z-[100] flex items-center justify-center w-10 h-10"
              onClick={() => setShowJobDetails(false)}
            >
              <IoMdClose size={22} />
            </button>
  
            {/* Job title and other info's for small screen */}
            <div className="p-6 pt-20">
              <h3 className="text-xl font-semibold text-gray-900 pr-12">
                {selectedJob?.jobDetails?.title}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedJob?.jobDetails?.companyName}
              </p>
              <p className="text-sm text-gray-500">
                {selectedJob?.jobDetails?.location}
              </p>
              <p className="mt-2 px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
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
  
              <div className="mt-2 flex items-center text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-md w-fit">
                <AiOutlineThunderbolt className="mr-1" />
                Typically Responds in {selectedJob?.jobDetails?.respondTime} days
              </div>
            </div>
  
            <div className="p-2 flex items-center gap-8 border-b ml-4">
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
  
            {/* Job details for small screen*/}
            <div className="p-6 overflow-y-auto h-[calc(100vh-300px)] pb-20">
              <div className="mt-4 space-y-1">
                <p className="font-semibold text-gray-700">
                  Job Type :{" "}
                  <span className="text-sm text-gray-500">
                    {selectedJob?.jobDetails?.jobType}
                  </span>
                </p>
                <p className="font-semibold text-gray-700">
                  Duration :{" "}
                  <span className="text-sm text-gray-500">
                    {selectedJob?.jobDetails?.duration}
                  </span>
                </p>
              </div>
  
              {/* Job major details for small screen job details*/}
              <div className="mt-4">
                <JobMajorDetails selectedJob={selectedJob} />
              </div>
            </div>
  
            {/*Apply button for small screen job details*/}
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
    );
  };
  export default JobsForYou;


// import React, { useEffect, useState, useRef } from "react";
// import { AiOutlineThunderbolt } from "react-icons/ai";
// import { CiBookmark } from "react-icons/ci";
// import { FaBookmark, FaHeart } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import JobMajorDetails from "./JobMajorDetails";
// import { useNavigate } from "react-router-dom";
// import { useJobDetails } from "@/context/JobDetailsContext";
// import { useSelector } from "react-redux";

// const JobsForYou = () => {
//   const { jobs: portalJobs, selectedJob, setSelectedJob, toggleBookmarkStatus } = useJobDetails();
//   const [apiJobs, setApiJobs] = useState([]);
//   const [combinedJobs, setCombinedJobs] = useState([]);
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const [showJobDetails, setShowJobDetails] = useState(false);
//   const jobContainerRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setShowJobDetails(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (jobContainerRef.current) {
//       jobContainerRef.current.scrollTop = 0;
//     }
//   }, [selectedJob]);

//   // Fetch API Jobs
//   useEffect(() => {
//     const fetchApiJobs = async () => {
//       try {
//         const response = await fetch(
//           "https://jsearch.p.rapidapi.com/search?query=remote&country=in&page=1&num_pages=1",
//           {
//             method: "GET",
//             headers: {
//               "X-RapidAPI-Key": "48351cbc58msh79a8400ddeb5ed6p18e0dejsn866ac6ac54a2",
//               "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
//             },
//           }
//         );

//         const data = await response.json();

//         if (response.ok && data.data) {
//           setApiJobs(data.data.slice(0, 6)); // Limit to 6 jobs
//         }
//       } catch (error) {
//         console.error("Error fetching API jobs:", error);
//       }
//     };

//     fetchApiJobs();
//   }, []);

//   // Combine Portal and API Jobs
//   useEffect(() => {
//     setCombinedJobs([...portalJobs, ...apiJobs]);
//   }, [portalJobs, apiJobs]);

//   const handleJobClick = (job) => {
//     if (job.job_apply_link) {
//       // Redirect API job to its respective platform
//       window.open(job.job_apply_link, "_blank");
//     } else {
//       // Show portal job details
//       setSelectedJob(job);
//       if (window.innerWidth < 768) {
//         setShowJobDetails(true);
//       }
//     }
//   };

//   const calculateActiveDays = (createdAt) => {
//     const jobCreatedDate = new Date(createdAt);
//     const currentDate = new Date();
//     const timeDifference = currentDate - jobCreatedDate;
//     return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//   };

//   const isApplied =
//     selectedJob?.application?.some(
  

  

//       (application) => application.applicant === user?._id  
//     ) || false;

//   const isJobBookmarked = (userId) => selectedJob.saveJob.includes(userId);

//   return (
//     <div className="flex justify-center mt-4 gap-4 h-screen sticky top-10 md:px-6">  
//       {/* Job List */}
//       <div className="flex flex-col gap-4 w-full md:w-1/2 h-screen m-5 md:m-0 scrollbar-hide overflow-y-scroll">
//         {combinedJobs.map((job) => (
//           <div  
//             key={job._id || job.job_id}
//             className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg relative flex flex-col space-y-2 ${
//               selectedJob?._id === job._id ? "border-blue-600" : "border-gray-400"  
//             }`}
//             onClick={() => handleJobClick(job)}
//           >
//             <div className="flex justify-between items-center">
//               {job?.jobDetails?.urgentHiring === "Yes" && (
//                 <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">Urgent Hiring</p>  
//               )}
//             </div>
//             <h3 className="text-lg font-semibold">{job.jobDetails?.title || job.job_title}</h3>
//             <p className="text-sm text-gray-600">{job.jobDetails?.companyName || job.employer_name}</p>
//             <p className="text-sm text-gray-500">
//               {job.jobDetails?.workPlaceFlexibility || ""} {job.jobDetails?.location || job.job_location}
//             </p>
//             {job.jobDetails?.respondTime && (
//               <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">  
//                 <AiOutlineThunderbolt className="mr-1" />
//                 <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
//               </div>
//             )}
//             {job.jobDetails?.salary && (
//               <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">  
//                 {job.jobDetails?.salary
//                   .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//                   .split("-")
//                   .map((part, index) => (
//                     <span key={index}>  
//                       ₹{part.trim()}
//                       {index === 0 ? " - " : ""}
//                     </span>
//                   ))}
//               </p>
//             )}
//             <div>
//               <p className="text-sm text-gray-600">Active {calculateActiveDays(job?.createdAt)} days ago</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Job Details Section */}
//       {selectedJob && !selectedJob.job_apply_link && (
//         <div className="md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2 hidden">  
//           <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-2 flex flex-col space-y-1 w-full">
//             <h3 className="text-2xl font-semibold">{selectedJob?.jobDetails?.title}</h3>
//             <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
//             <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
//           </div>
//           <div ref={jobContainerRef} className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4">
//             <JobMajorDetails selectedJob={selectedJob} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobsForYou;



// import React, { useEffect, useState, useRef } from "react";
// import { AiOutlineThunderbolt } from "react-icons/ai";
// import { CiBookmark } from "react-icons/ci";
// import { FaBookmark, FaHeart } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import JobMajorDetails from "./JobMajorDetails";
// import { useNavigate } from "react-router-dom";
// import { useJobDetails } from "@/context/JobDetailsContext";
// import { useSelector } from "react-redux";

// const JobsForYou = () => {
//   const { jobs: portalJobs, selectedJob, setSelectedJob, toggleBookmarkStatus } = useJobDetails();  
//   const [apiJobs, setApiJobs] = useState([]);
//   const [combinedJobs, setCombinedJobs] = useState([]);
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const [showJobDetails, setShowJobDetails] = useState(false);
//   const jobContainerRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setShowJobDetails(false);  
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (jobContainerRef.current) {
//       jobContainerRef.current.scrollTop = 0;  
//     }
//   }, [selectedJob]);

//   // Fetch API Jobs
//   useEffect(() => {
//     const fetchApiJobs = async () => {
//       try {
//         const response = await fetch(
//           "https://jsearch.p.rapidapi.com/search?query=remote&country=in&page=1&num_pages=1",  
//           {
//             method: "GET",  
//             headers: {
//               "X-RapidAPI-Key": "a6ee64e1c4msh7baddc6ae46fbb0p19347fjsnfbfe8f3d9220",  
//               "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
//             },
//           }
//         );

//         const data = await response.json();

//         if (response.ok && data.data) {
//           setApiJobs(data.data.slice(0, 6)); // Limit to 6 jobs  
//         }
//       } catch (error) {
//         console.error("Error fetching API jobs:", error);  
//       }
//     };

//     fetchApiJobs();
//   }, []);

//   // Combine Portal and API Jobs
//   useEffect(() => {
//     setCombinedJobs([...portalJobs, ...apiJobs]);  
//   }, [portalJobs, apiJobs]);

//   const handleJobClick = (job) => {
//     if (job.job_apply_link) {
//       // Redirect API job to its respective platform  
//       window.open(job.job_apply_link, "_blank");
//     } else {
//       // Show portal job details  
//       setSelectedJob(job);
//       if (window.innerWidth < 768) {
//         setShowJobDetails(true);  
//       }
//     }
//   };

//   const calculateActiveDays = (createdAt) => {
//     const jobCreatedDate = new Date(createdAt);  
//     const currentDate = new Date();
//     const timeDifference = currentDate - jobCreatedDate;
//     return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//   };

//   const isApplied =
//     selectedJob?.application?.some(
//       (application) => application.applicant === user?._id  
//     ) || false;

//   const isJobBookmarked = (userId) => selectedJob?.saveJob?.includes(userId);

//   return (
//     <div className="flex justify-center mt-4 gap-4 h-screen sticky top-10 md:px-6">  
//       {/* Job List */}
//       <div className="flex flex-col gap-4 w-full md:w-1/2 h-screen m-5 md:m-0 scrollbar-hide overflow-y-scroll">
//         {combinedJobs.map((job) => (
//           <div  
//             key={job._id || job.job_id}
//             className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg relative flex flex-col space-y-2 ${
//               selectedJob?._id === job._id ? "border-blue-600" : "border-gray-400"  
//             }`}
//             onClick={() => handleJobClick(job)}
//           >
//             <div className="flex justify-between items-center">
//               {job?.jobDetails?.urgentHiring === "Yes" && (
//                 <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">Urgent Hiring</p>  
//               )}
//             </div>

//             {job.job_apply_link && (
//               <div className=" w-fit text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">  
//                 Urgent Hiring
//               </div>
              
              
//             )}


//             <h3 className="text-lg font-semibold">{job.jobDetails?.title || job.job_title}</h3>
//             <p className="text-sm text-gray-600">{job.jobDetails?.companyName || job.employer_name}</p>
//             <p className="text-sm text-gray-500">
//               {job.jobDetails?.workPlaceFlexibility || ""} {job.jobDetails?.location || job.job_location}
//             </p>
//             {job.jobDetails?.respondTime && (
//               <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">  
//                 <AiOutlineThunderbolt className="mr-1" />
//                 <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
//               </div>
//             )}
//                 {job.job_apply_link && (
//                   <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">  
//                     <AiOutlineThunderbolt className="mr-1" />
//                     <span>Typically Respond in 1-2 days</span>
//                   </div>
//                 )}
//             {job.jobDetails?.salary && (
//               <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">  
//                 {job.jobDetails?.salary
//                   .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//                   .split("-")
//                   .map((part, index) => (
//                     <span key={index}>  
//                       ₹{part.trim()}
//                       {index === 0 ? " - " : ""}
//                     </span>
//                   ))}
//               </p>
//             )}
//             {!job.job_apply_link && (
//               <div className="text-sm flex flex-col">  
//                 <div className="flex gap-2 items-center">
//                   <p className="p-1 font-semibold text-green-700 rounded-md bg-green-100 flex items-center gap-1">
//                     {job.jobDetails?.jobType || ""} <FaHeart /> +1
//                   </p>
//                 </div>
//                 <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200 w-fit mt-1">
//                   {job.jobDetails?.duration || ""}
//                 </p>
//               </div>
//             )}

//             {!job.job_apply_link && (
//               <div>  
//                 <p className="text-sm text-gray-600">
//                   Active {calculateActiveDays(job?.createdAt)} days ago
//                 </p>
//               </div>
//             )}

//               {job.job_apply_link && (
//                 <>  
//                   <p className="w-fit p-1 font-semibold text-green-700 rounded-md bg-green-100 flex items-center gap-1">
//                     {job.job_employment_type || "Not specified"}<FaHeart /> +1
//                   </p>
//                   <p className="text-sm text-gray-600 line-clamp-1">
//                    Active {job.job_posted_at || "Unknown"}
//                   </p>
//                 </>
//               )}

//           </div>
//         ))}
//       </div>
  
//       {/* Job Details Section */}
//       {selectedJob && !selectedJob.job_apply_link && (
//         <div className="md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2 hidden">  
//           <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-2 flex flex-col space-y-1 w-full">
//             <h3 className="text-2xl font-semibold">{selectedJob?.jobDetails?.title}</h3>
//             <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
//             <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
//             <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
//               {selectedJob?.jobDetails?.salary
//                 .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//                 .split("-")
//                 .map((part, index) => (
//                   <span key={index}>  
//                     ₹{part.trim()}
//                     {index === 0 ? " - " : ""}
//                   </span>
//                 ))}
//             </p>
//             <div className="p-1 flex items-center w-fit text-sm text-blue-800 bg-blue-200">
//               <AiOutlineThunderbolt className="mr-1" size={20} />
//               <span className="text-blue-800">Typically Responds in {selectedJob?.jobDetails?.respondTime} days.</span>
//             </div>
  
//             <div className="flex items-center gap-2">
//               <div
//                 className={`py-2 px-5 rounded-lg text-white ${
//                   isApplied ? "bg-green-600 hover:bg-green-700 " : "bg-blue-600 hover:bg-blue-700"  
//                 }`}
//               >
//                 {isApplied ? (
//                   <div className="flex items-center gap-1">Applied</div>  
//                 ) : (
//                   <button  
//                     className="flex items-center gap-1"
//                     onClick={() => {
//                       navigate(`/apply/${selectedJob?._id}`);  
//                     }}
//                   >
//                     Apply Now
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div ref={jobContainerRef} className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4">
//             <JobMajorDetails selectedJob={selectedJob} />
//           </div>
//         </div>
//       )}
  
//       {/* SMALL SCREEN JOB DETAILS SECTION */}
//       {showJobDetails && selectedJob && (
//         <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out">  
//           <button
//             className="fixed top-[80px] right-4 bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300 transition duration-200 z-[100] flex items-center justify-center w-10 h-10"
//             onClick={() => setShowJobDetails(false)}
//           >
//             <IoMdClose size={22} />
//           </button>
  
//           {/* Job title and other info for small screens */}
//           <div className="p-6 pt-20">
//             <h3 className="text-xl font-semibold text-gray-900 pr-12">{selectedJob?.jobDetails?.title}</h3>
//             <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
//             <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
//             <p className="mt-2 px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
//               {selectedJob?.jobDetails?.salary
//                 .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//                 .split("-")
//                 .map((part, index) => (
//                   <span key={index}>  
//                     ₹{part.trim()}
//                     {index === 0 ? " - " : ""}
//                   </span>
//                 ))}
//             </p>
//             <div className="mt-2 flex items-center text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-md w-fit">
//               <AiOutlineThunderbolt className="mr-1" />
//               Typically Responds in {selectedJob?.jobDetails?.respondTime} days
//             </div>
//           </div>
  
//           {/* Apply button for small screens */}
//           <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex justify-center">
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full max-w-md flex items-center justify-center gap-2"
//               onClick={() => navigate(`/apply/${selectedJob?._id}`)}
//             >
//               Apply Now
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
  
// }  

// export default JobsForYou;


