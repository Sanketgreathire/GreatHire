//   // -----------------------------------------------------------------------------------------------------------------

// import React, { useState, useRef, useEffect } from "react";
// import { AiOutlineThunderbolt } from "react-icons/ai";
// import { CiBookmark } from "react-icons/ci";
// import { FaBookmark, FaHeart } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import JobMajorDetails from "./JobMajorDetails";
// import { useNavigate } from "react-router-dom";
// import { useJobDetails } from "@/context/JobDetailsContext";
// import { useSelector } from "react-redux";
// import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
// import toast from "react-hot-toast";
// import axios from "axios";



// const JobsForYou = () => {
//   const [applyingJobId, setApplyingJobId] = useState(null);
//   const [showJobDetails, setShowJobDetails] = useState(false);
//   const [scrollPosition, setScrollPosition] = useState(0);



//   // Access context & redux
//   const { jobs, selectedJob, setSelectedJob, toggleBookmarkStatus } = useJobDetails();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   const jobContainerRef = useRef(null);

//   // Reset scroll when job changes
//   useEffect(() => {
//     if (jobContainerRef.current) {
//       jobContainerRef.current.scrollTop = 0;
//     }
//   }, [selectedJob]);

//   // Handle resize
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setShowJobDetails(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleScroll = () => {
//     if (jobContainerRef.current) {
//       setScrollPosition(jobContainerRef.current.scrollTop);
//     }
//   };

//   // ✅ Helper to check applied jobs
//   const hasAppliedToJob = (jobId) =>
//     jobs.some(
//       (job) =>
//         job._id === jobId &&
//         job?.application?.some((application) => application.applicant === user?._id)
//     );

//   const isApplied =
//     selectedJob?.application?.some(
//       (application) => application.applicant === user?._id
//     ) || false;

//   const isJobBookmarked = (userId) => selectedJob?.saveJob?.includes(userId);

//   // ✅ Apply handler
// //    const handleApply = async (jobId) => {
// //   if (!user) {
// //     toast.error("Please login to apply");
// //     navigate("/login");
// //     return;
// //   }

// //   if (hasAppliedToJob(jobId)) {
// //     toast.error("Already applied");
// //     return;
// //   }

// //   try {
// //     setApplyingJobId(jobId);

// //     const payload = {
// //       applicant: user?._id,
// //       applicantProfile: user?.profile,
// //     };

// //    const response = await axios.post(
// //   `${JOB_API_END_POINT}/${jobId}/apply`,
// //   {},  //  empty body
// //   { withCredentials: true }
// // );


// //     if (response.data?.success) {
// //       const newApplication = { applicant: user._id };
 
// //       setSelectedJob((prev) => {
// //   if (!prev) return prev;
// //   return {
// //     ...prev,
// //     application: [...(prev.application || []), newApplication],
// //   };
// // });

// //       toast.success("Applied successfully!");
// //     } else {
// //       toast.error(response.data?.message || "Failed to apply");
// //     }
// //   } catch (err) {
// //     toast.error("Error while applying");
// //     console.error(err);
// //   } finally {
// //     setApplyingJobId(null);
// //   }
// // };

// // ✅ Apply handler (Corrected Version)




//   // ✅ Bookmark handler
//   const handleBookmark = async (jobId) => {
//     try {
//       const response = await axios.get(
//         `${JOB_API_END_POINT}/bookmark-job/${jobId}`,
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         toggleBookmarkStatus(jobId, user?._id);
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error bookmarking job:", error.response?.data?.message || error.message);
//     }
//   };

//   // Days calculator
//   const calculateActiveDays = (createdAt) => {
//     const jobCreatedDate = new Date(createdAt);
//     const currentDate = new Date();
//     const timeDifference = currentDate - jobCreatedDate;
//     return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//   };

//   const handleJobClick = (job) => {
//     setSelectedJob(job);
//     if (window.innerWidth < 768) {
//       setShowJobDetails(true);
//     }
//   };

//   return (
//     <div className="flex justify-center mt-4 gap-4 top-10 md:px-6 text-gray-800 ">
//       {/* Job List */}
//       <div className="flex flex-col gap-4 w-full md:w-1/2 m-5 md:m-0 scrollbar-hide ">
//         {jobs?.map((job) => (
//           <div
//             key={job._id}
//             className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg relative flex flex-col space-y-2  ${
//               selectedJob?._id === job._id ? "border-blue-600" : "border-gray-400 dark:text-white"
//             }`}
//             onClick={() => handleJobClick(job)}
//           >
//             {job?.jobDetails?.urgentHiring === "Yes" && (
//               <p className=" inline-block text-sm bg-violet-200 rounded-md px-2 p-1 text-violet-800 font-bold w-fit">
//                 Urgent Hiring
//               </p>
//             )}
//             <h3 className="text-lg font-semibold dark:text-white">{job.jobDetails?.title}</h3>
//             <p className="text-sm text-gray-600 dark:text-white">{job.jobDetails?.companyName}</p>
//             <p className="text-sm text-gray-500 dark:text-white">
//               {job.jobDetails?.workPlaceFlexibility} {job.jobDetails?.location}
//             </p>

//             <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md ">
//               <AiOutlineThunderbolt className="mr-1" />
//               Typically Respond in {job.jobDetails?.respondTime} days
//             </div>

//             <div className="text-sm flex flex-col ">
//               <div className="flex gap-2 items-center">
//                 <p className="p-1 font-semibold bg-gray-200 rounded-md  dark:text-gray-700">
//                   {job?.jobDetails?.salary
//                     .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//                     .split("-")
//                     .map((part, i) => (
//                       <span key={i}>
//                         ₹{part.trim()}
//                         {i === 0 ? " - " : ""}
//                       </span>
//                     ))}
//                 </p>
//                 <p className="p-1 font-semibold text-green-700 bg-green-100 rounded-md flex items-center gap-1">
//                   {job.jobDetails?.jobType} <FaHeart /> +1
//                 </p>
//               </div>
//               <p className="p-1 font-semibold bg-gray-200 rounded-md w-fit mt-1 dark:text-gray-700 ">
//                 {job.jobDetails?.duration} +1
//               </p>
//             </div>

//             <div className="flex items-center text-sm ">
//               {hasAppliedToJob(job._id) && <span className="text-green-600 ">Applied</span>}
//             </div>

//             <div className="text-sm flex flex-col font-semibold dark:text-gray-200" style={{ listStyleType: "circle" }}>
//               <span>{job.jobDetails?.benefits[0]}</span>
//               <span>{job.jobDetails?.responsibilities[0]}</span>
//               <span>{job.jobDetails?.qualifications[0]}</span>
//             </div>

//             <p className="text-sm text-gray-600 dark:text-white">Active {calculateActiveDays(job?.createdAt)} days ago</p>
//           </div>
//         ))}
//       </div>

//       {/* Job Details */}
//       {selectedJob && (
//         <div className="sticky top-[60px] md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2 hidden h-fit ">
//           <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-2 flex flex-col space-y-1">
//             <h3 className="text-2xl font-semibold ">{selectedJob?.jobDetails?.title}</h3>
//             <p className="text-sm">{selectedJob?.jobDetails?.companyName}</p>
//             <p className="text-sm">{selectedJob?.jobDetails?.location}</p>

//             <p className="px-3 py-1 font-semibold rounded-md w-fit text-gray-700 dark:bg-gray-300 ">
//               {selectedJob?.jobDetails?.salary
//                 .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//                 .split("-")
//                 .map((part, i) => (
//                   <span key={i}>
//                     ₹{part.trim()}
//                     {i === 0 ? " - " : ""}
//                   </span>
//                 ))}
//             </p>

//             <div className="p-1 flex items-center w-fit text-sm text-blue-800 bg-blue-200 ">
//               <AiOutlineThunderbolt className="mr-1" size={20} />
//               Typically Responds in {selectedJob?.jobDetails?.respondTime} days.
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 className={`py-2 px-5 rounded-lg text-white ${
//                   isApplied
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-blue-600 hover:bg-blue-700 "
//                 }`}
//                 onClick={(e) => {
//         e.stopPropagation();
//         handleApply(selectedJob?._id);
//     }}
//     // Ye 'hasAppliedToJob' ab state update hone ke kaaran hamesha sahi value dega
//     disabled={applyingJobId === selectedJob?._id || hasAppliedToJob(selectedJob?._id)}
// >
//     {/* Ye 'isApplied' bhi ab sahi kaam karega */}
//     {isApplied ? "Applied" : (applyingJobId === selectedJob?._id ? "Applying..." : "Apply Now")}
//               </button>

//               {!isApplied &&
//                 user &&
//                 (isJobBookmarked(user?._id) ? (
//                   <FaBookmark
//                     size={25}
//                     onClick={() => handleBookmark(selectedJob._id)}
//                     className="text-green-700 cursor-pointer"
//                   />
//                 ) : (
//                   <CiBookmark
//                     size={25}
//                     onClick={() => handleBookmark(selectedJob._id)}
//                     className="cursor-pointer"
//                   />
//                 ))}
//             </div>
//           </div>

//           <div
//             ref={jobContainerRef}
//             onScroll={handleScroll}
//             className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4 "
//           >
//             <JobMajorDetails selectedJob={selectedJob} />
//           </div>
//         </div>
//       )}

//       {/* Small screen job details */}
//       {showJobDetails && selectedJob && (
//         <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl">
//           <button
//             className="fixed top-[80px] right-4 bg-gray-100 p-2 rounded-md "
//             onClick={() => setShowJobDetails(false)}
//           >
//             <IoMdClose size={22} />
//           </button>

//           <div className="p-6 pt-20">
//             <h3 className="text-xl font-semibold">{selectedJob?.jobDetails?.title}</h3>
//             <p className="text-sm">{selectedJob?.jobDetails?.companyName}</p>
//             <p className="text-sm">{selectedJob?.jobDetails?.location}</p>
//           </div>

//           <div className="p-2 flex items-center gap-8 border-b ml-4">
//             {user &&
//               (isJobBookmarked(user?._id) ? (
//                 <FaBookmark
//                   size={25}
//                   onClick={() => handleBookmark(selectedJob._id)}
//                   className="text-green-700 cursor-pointer"
//                 />
//               ) : (
//                 <CiBookmark
//                   size={25}
//                   onClick={() => handleBookmark(selectedJob._id)}
//                   className="cursor-pointer"
//                 />
//               ))}
//           </div>

//           <div className="p-6 overflow-y-auto h-[calc(100vh-300px)] pb-20">
//             <JobMajorDetails selectedJob={selectedJob} />
//           </div>

//           <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex justify-center">
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full max-w-md"
//               onClick={() => handleApply(selectedJob?._id)}
//               disabled={applyingJobId === selectedJob?._id || hasAppliedToJob(selectedJob?._id)}
//             >
//               {isApplied
//                 ? "Applied"
//                 : applyingJobId === selectedJob?._id
//                 ? "Applying..."
//                 : "Apply Now"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobsForYou;











// // import React, { useEffect, useState, useRef } from "react";
// // import { AiOutlineThunderbolt } from "react-icons/ai";
// // import { CiBookmark } from "react-icons/ci";
// // import { FaBookmark, FaHeart } from "react-icons/fa";
// // import { IoMdClose } from "react-icons/io";
// // import JobMajorDetails from "./JobMajorDetails";
// // import { useNavigate } from "react-router-dom";
// // import { useJobDetails } from "@/context/JobDetailsContext";
// // import { useSelector } from "react-redux";

// // const JobsForYou = () => {
// //   const { jobs: portalJobs, selectedJob, setSelectedJob, toggleBookmarkStatus } = useJobDetails();
// //   const [apiJobs, setApiJobs] = useState([]);
// //   const [combinedJobs, setCombinedJobs] = useState([]);
// //   const navigate = useNavigate();
// //   const { user } = useSelector((state) => state.auth);

// //   const [showJobDetails, setShowJobDetails] = useState(false);
// //   const jobContainerRef = useRef(null);

// //   useEffect(() => {
// //     const handleResize = () => {
// //       if (window.innerWidth >= 768) {
// //         setShowJobDetails(false);
// //       }
// //     };

// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   useEffect(() => {
// //     if (jobContainerRef.current) {
// //       jobContainerRef.current.scrollTop = 0;
// //     }
// //   }, [selectedJob]);

// //   // Fetch API Jobs
// //   useEffect(() => {
// //     const fetchApiJobs = async () => {
// //       try {
// //         const response = await fetch(
// //           "https://jsearch.p.rapidapi.com/search?query=remote&country=in&page=1&num_pages=1",
// //           {
// //             method: "GET",
// //             headers: {
// //               "X-RapidAPI-Key": "48351cbc58msh79a8400ddeb5ed6p18e0dejsn866ac6ac54a2",
// //               "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
// //             },
// //           }
// //         );

// //         const data = await response.json();

// //         if (response.ok && data.data) {
// //           setApiJobs(data.data.slice(0, 6)); // Limit to 6 jobs
// //         }
// //       } catch (error) {
// //         console.error("Error fetching API jobs:", error);
// //       }
// //     };

// //     fetchApiJobs();
// //   }, []);

// //   // Combine Portal and API Jobs
// //   useEffect(() => {
// //     setCombinedJobs([...portalJobs, ...apiJobs]);
// //   }, [portalJobs, apiJobs]);

// //   const handleJobClick = (job) => {
// //     if (job.job_apply_link) {
// //       // Redirect API job to its respective platform
// //       window.open(job.job_apply_link, "_blank");
// //     } else {
// //       // Show portal job details
// //       setSelectedJob(job);
// //       if (window.innerWidth < 768) {
// //         setShowJobDetails(true);
// //       }
// //     }
// //   };

// //   const calculateActiveDays = (createdAt) => {
// //     const jobCreatedDate = new Date(createdAt);
// //     const currentDate = new Date();
// //     const timeDifference = currentDate - jobCreatedDate;
// //     return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
// //   };

// //   const isApplied =
// //     selectedJob?.application?.some(
  

  

// //       (application) => application.applicant === user?._id  
// //     ) || false;

// //   const isJobBookmarked = (userId) => selectedJob.saveJob.includes(userId);

// //   return (
// //     <div className="flex justify-center mt-4 gap-4 h-screen sticky top-10 md:px-6">  
// //       {/* Job List */}
// //       <div className="flex flex-col gap-4 w-full md:w-1/2 h-screen m-5 md:m-0 scrollbar-hide overflow-y-scroll">
// //         {combinedJobs.map((job) => (
// //           <div  
// //             key={job._id || job.job_id}
// //             className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg relative flex flex-col space-y-2 ${
// //               selectedJob?._id === job._id ? "border-blue-600" : "border-gray-400"  
// //             }`}
// //             onClick={() => handleJobClick(job)}
// //           >
// //             <div className="flex justify-between items-center">
// //               {job?.jobDetails?.urgentHiring === "Yes" && (
// //                 <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">Urgent Hiring</p>  
// //               )}
// //             </div>
// //             <h3 className="text-lg font-semibold">{job.jobDetails?.title || job.job_title}</h3>
// //             <p className="text-sm text-gray-600">{job.jobDetails?.companyName || job.employer_name}</p>
// //             <p className="text-sm text-gray-500">
// //               {job.jobDetails?.workPlaceFlexibility || ""} {job.jobDetails?.location || job.job_location}
// //             </p>
// //             {job.jobDetails?.respondTime && (
// //               <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">  
// //                 <AiOutlineThunderbolt className="mr-1" />
// //                 <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
// //               </div>
// //             )}
// //             {job.jobDetails?.salary && (
// //               <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">  
// //                 {job.jobDetails?.salary
// //                   .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
// //                   .split("-")
// //                   .map((part, index) => (
// //                     <span key={index}>  
// //                       ₹{part.trim()}
// //                       {index === 0 ? " - " : ""}
// //                     </span>
// //                   ))}
// //               </p>
// //             )}
// //             <div>
// //               <p className="text-sm text-gray-600">Active {calculateActiveDays(job?.createdAt)} days ago</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Job Details Section */}
// //       {selectedJob && !selectedJob.job_apply_link && (
// //         <div className="md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2 hidden">  
// //           <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-2 flex flex-col space-y-1 w-full">
// //             <h3 className="text-2xl font-semibold">{selectedJob?.jobDetails?.title}</h3>
// //             <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
// //             <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
// //           </div>
// //           <div ref={jobContainerRef} className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4">
// //             <JobMajorDetails selectedJob={selectedJob} />
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default JobsForYou;



// // import React, { useEffect, useState, useRef } from "react";
// // import { AiOutlineThunderbolt } from "react-icons/ai";
// // import { CiBookmark } from "react-icons/ci";
// // import { FaBookmark, FaHeart } from "react-icons/fa";
// // import { IoMdClose } from "react-icons/io";
// // import JobMajorDetails from "./JobMajorDetails";
// // import { useNavigate } from "react-router-dom";
// // import { useJobDetails } from "@/context/JobDetailsContext";
// // import { useSelector } from "react-redux";

// // const JobsForYou = () => {
// //   const { jobs: portalJobs, selectedJob, setSelectedJob, toggleBookmarkStatus } = useJobDetails();  
// //   const [apiJobs, setApiJobs] = useState([]);
// //   const [combinedJobs, setCombinedJobs] = useState([]);
// //   const navigate = useNavigate();
// //   const { user } = useSelector((state) => state.auth);

// //   const [showJobDetails, setShowJobDetails] = useState(false);
// //   const jobContainerRef = useRef(null);

// //   useEffect(() => {
// //     const handleResize = () => {
// //       if (window.innerWidth >= 768) {
// //         setShowJobDetails(false);  
// //       }
// //     };

// //     window.addEventListener("resize", handleResize);
// //     return () => window.removeEventListener("resize", handleResize);
// //   }, []);

// //   useEffect(() => {
// //     if (jobContainerRef.current) {
// //       jobContainerRef.current.scrollTop = 0;  
// //     }
// //   }, [selectedJob]);

// //   // Fetch API Jobs
// //   useEffect(() => {
// //     const fetchApiJobs = async () => {
// //       try {
// //         const response = await fetch(
// //           "https://jsearch.p.rapidapi.com/search?query=remote&country=in&page=1&num_pages=1",  
// //           {
// //             method: "GET",  
// //             headers: {
// //               "X-RapidAPI-Key": "a6ee64e1c4msh7baddc6ae46fbb0p19347fjsnfbfe8f3d9220",  
// //               "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
// //             },
// //           }
// //         );

// //         const data = await response.json();

// //         if (response.ok && data.data) {
// //           setApiJobs(data.data.slice(0, 6)); // Limit to 6 jobs  
// //         }
// //       } catch (error) {
// //         console.error("Error fetching API jobs:", error);  
// //       }
// //     };

// //     fetchApiJobs();
// //   }, []);

// //   // Combine Portal and API Jobs
// //   useEffect(() => {
// //     setCombinedJobs([...portalJobs, ...apiJobs]);  
// //   }, [portalJobs, apiJobs]);

// //   const handleJobClick = (job) => {
// //     if (job.job_apply_link) {
// //       // Redirect API job to its respective platform  
// //       window.open(job.job_apply_link, "_blank");
// //     } else {
// //       // Show portal job details  
// //       setSelectedJob(job);
// //       if (window.innerWidth < 768) {
// //         setShowJobDetails(true);  
// //       }
// //     }
// //   };

// //   const calculateActiveDays = (createdAt) => {
// //     const jobCreatedDate = new Date(createdAt);  
// //     const currentDate = new Date();
// //     const timeDifference = currentDate - jobCreatedDate;
// //     return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
// //   };

// //   const isApplied =
// //     selectedJob?.application?.some(
// //       (application) => application.applicant === user?._id  
// //     ) || false;

// //   const isJobBookmarked = (userId) => selectedJob?.saveJob?.includes(userId);

// //   return (
// //     <div className="flex justify-center mt-4 gap-4 h-screen sticky top-10 md:px-6">  
// //       {/* Job List */}
// //       <div className="flex flex-col gap-4 w-full md:w-1/2 h-screen m-5 md:m-0 scrollbar-hide overflow-y-scroll">
// //         {combinedJobs.map((job) => (
// //           <div  
// //             key={job._id || job.job_id}
// //             className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg relative flex flex-col space-y-2 ${
// //               selectedJob?._id === job._id ? "border-blue-600" : "border-gray-400"  
// //             }`}
// //             onClick={() => handleJobClick(job)}
// //           >
// //             <div className="flex justify-between items-center">
// //               {job?.jobDetails?.urgentHiring === "Yes" && (
// //                 <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">Urgent Hiring</p>  
// //               )}
// //             </div>

// //             {job.job_apply_link && (
// //               <div className=" w-fit text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">  
// //                 Urgent Hiring
// //               </div>
              
              
// //             )}


// //             <h3 className="text-lg font-semibold">{job.jobDetails?.title || job.job_title}</h3>
// //             <p className="text-sm text-gray-600">{job.jobDetails?.companyName || job.employer_name}</p>
// //             <p className="text-sm text-gray-500">
// //               {job.jobDetails?.workPlaceFlexibility || ""} {job.jobDetails?.location || job.job_location}
// //             </p>
// //             {job.jobDetails?.respondTime && (
// //               <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">  
// //                 <AiOutlineThunderbolt className="mr-1" />
// //                 <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
// //               </div>
// //             )}
// //                 {job.job_apply_link && (
// //                   <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">  
// //                     <AiOutlineThunderbolt className="mr-1" />
// //                     <span>Typically Respond in 1-2 days</span>
// //                   </div>
// //                 )}
// //             {job.jobDetails?.salary && (
// //               <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">  
// //                 {job.jobDetails?.salary
// //                   .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
// //                   .split("-")
// //                   .map((part, index) => (
// //                     <span key={index}>  
// //                       ₹{part.trim()}
// //                       {index === 0 ? " - " : ""}
// //                     </span>
// //                   ))}
// //               </p>
// //             )}
// //             {!job.job_apply_link && (
// //               <div className="text-sm flex flex-col">  
// //                 <div className="flex gap-2 items-center">
// //                   <p className="p-1 font-semibold text-green-700 rounded-md bg-green-100 flex items-center gap-1">
// //                     {job.jobDetails?.jobType || ""} <FaHeart /> +1
// //                   </p>
// //                 </div>
// //                 <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200 w-fit mt-1">
// //                   {job.jobDetails?.duration || ""}
// //                 </p>
// //               </div>
// //             )}

// //             {!job.job_apply_link && (
// //               <div>  
// //                 <p className="text-sm text-gray-600">
// //                   Active {calculateActiveDays(job?.createdAt)} days ago
// //                 </p>
// //               </div>
// //             )}

// //               {job.job_apply_link && (
// //                 <>  
// //                   <p className="w-fit p-1 font-semibold text-green-700 rounded-md bg-green-100 flex items-center gap-1">
// //                     {job.job_employment_type || "Not specified"}<FaHeart /> +1
// //                   </p>
// //                   <p className="text-sm text-gray-600 line-clamp-1">
// //                    Active {job.job_posted_at || "Unknown"}
// //                   </p>
// //                 </>
// //               )}

// //           </div>
// //         ))}
// //       </div>
  
// //       {/* Job Details Section */}
// //       {selectedJob && !selectedJob.job_apply_link && (
// //         <div className="md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-1/2 hidden">  
// //           <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-2 flex flex-col space-y-1 w-full">
// //             <h3 className="text-2xl font-semibold">{selectedJob?.jobDetails?.title}</h3>
// //             <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
// //             <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
// //             <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
// //               {selectedJob?.jobDetails?.salary
// //                 .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
// //                 .split("-")
// //                 .map((part, index) => (
// //                   <span key={index}>  
// //                     ₹{part.trim()}
// //                     {index === 0 ? " - " : ""}
// //                   </span>
// //                 ))}
// //             </p>
// //             <div className="p-1 flex items-center w-fit text-sm text-blue-800 bg-blue-200">
// //               <AiOutlineThunderbolt className="mr-1" size={20} />
// //               <span className="text-blue-800">Typically Responds in {selectedJob?.jobDetails?.respondTime} days.</span>
// //             </div>
  
// //             <div className="flex items-center gap-2">
// //               <div
// //                 className={`py-2 px-5 rounded-lg text-white ${
// //                   isApplied ? "bg-green-600 hover:bg-green-700 " : "bg-blue-600 hover:bg-blue-700"  
// //                 }`}
// //               >
// //                 {isApplied ? (
// //                   <div className="flex items-center gap-1">Applied</div>  
// //                 ) : (
// //                   <button  
// //                     className="flex items-center gap-1"
// //                     onClick={() => {
// //                       navigate(`/apply/${selectedJob?._id}`);  
// //                     }}
// //                   >
// //                     Apply Now
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //           <div ref={jobContainerRef} className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4">
// //             <JobMajorDetails selectedJob={selectedJob} />
// //           </div>
// //         </div>
// //       )}
  
// //       {/* SMALL SCREEN JOB DETAILS SECTION */}
// //       {showJobDetails && selectedJob && (
// //         <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out">  
// //           <button
// //             className="fixed top-[80px] right-4 bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300 transition duration-200 z-[100] flex items-center justify-center w-10 h-10"
// //             onClick={() => setShowJobDetails(false)}
// //           >
// //             <IoMdClose size={22} />
// //           </button>
  
// //           {/* Job title and other info for small screens */}
// //           <div className="p-6 pt-20">
// //             <h3 className="text-xl font-semibold text-gray-900 pr-12">{selectedJob?.jobDetails?.title}</h3>
// //             <p className="text-sm text-gray-600">{selectedJob?.jobDetails?.companyName}</p>
// //             <p className="text-sm text-gray-500">{selectedJob?.jobDetails?.location}</p>
// //             <p className="mt-2 px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200">
// //               {selectedJob?.jobDetails?.salary
// //                 .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
// //                 .split("-")
// //                 .map((part, index) => (
// //                   <span key={index}>  
// //                     ₹{part.trim()}
// //                     {index === 0 ? " - " : ""}
// //                   </span>
// //                 ))}
// //             </p>
// //             <div className="mt-2 flex items-center text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-md w-fit">
// //               <AiOutlineThunderbolt className="mr-1" />
// //               Typically Responds in {selectedJob?.jobDetails?.respondTime} days
// //             </div>
// //           </div>
  
// //           {/* Apply button for small screens */}
// //           <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex justify-center">
// //             <button
// //               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full max-w-md flex items-center justify-center gap-2"
// //               onClick={() => navigate(`/apply/${selectedJob?._id}`)}
// //             >
// //               Apply Now
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
  
// // }  

// // export default JobsForYou;







  // -----------------------------------------------------------------------------------------------------------------
//   import React, { useState, useRef, useEffect } from "react";
// import { AiOutlineThunderbolt } from "react-icons/ai";
// import { CiBookmark } from "react-icons/ci";
// import { FaBookmark, FaHeart } from "react-icons/fa";
// import { IoMdClose } from "react-icons/io";
// import JobMajorDetails from "./JobMajorDetails";
// import { useJobDetails } from "@/context/JobDetailsContext";
// import { useSelector } from "react-redux";
// import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
// import toast from "react-hot-toast";
// import axios from "axios";

// const JobsForYou = () => {
//   // Access functions from context
//   const { jobs, selectedJob, setSelectedJob, toggleBookmarkStatus, filters } =
//   useJobDetails();

//   const { user } = useSelector((state) => state.auth);

//   // Added for small screen job details
//   const [showJobDetails, setShowJobDetails] = useState(false);

//   // Ref to track the scrollable container
//   const jobContainerRef = useRef(null);
//   const [filteredJobs, setFilteredJobs] = useState([]);

//   // Pagination State
// const [currentPage, setCurrentPage] = useState(1);
// const jobsPerPage = 5;

// // Pagination must be based on FILTERED JOBS:
// const indexOfLastJob = currentPage * jobsPerPage;
// const indexOfFirstJob = indexOfLastJob - jobsPerPage;

// const paginatedJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

// // Total pages
// const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);


//   // Pagination State
// // const [currentPage, setCurrentPage] = useState(1);
// // const jobsPerPage = 5; // change number as you like

// // // Calculate paginated jobs
// // const indexOfLastJob = currentPage * jobsPerPage;
// // const indexOfFirstJob = indexOfLastJob - jobsPerPage;
// // const paginatedJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

// // // Total pages
// // const totalPages = Math.ceil(jobs.length / jobsPerPage);

// // Change page
// const handlePageChange = (pageNumber) => {
//   setCurrentPage(pageNumber);
//   window.scrollTo({ top: 0, behavior: "smooth" });
// };


//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setShowJobDetails(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const [scrollPosition, setScrollPosition] = useState(0);
//   useEffect(() => {
//     if (jobContainerRef.current) {
//       jobContainerRef.current.scrollTop = 0;
//     }
//   }, [selectedJob]);

//   const handleScroll = () => {
//     if (jobContainerRef.current) {
//       setScrollPosition(jobContainerRef.current.scrollTop);
//     }
//   };

//   // check for current selected job
//   const isApplied =
//     selectedJob?.application?.some(
//       (application) => application.applicant === user?._id
//     ) || false;

//   // check is job applied or not in job list
//   const hasAppliedToJob = (jobId) =>
//     jobs.some(
//       (job) =>
//         job._id === jobId &&
//         job?.application?.some(
//           (application) => application.applicant === user?._id
//         )
//     );

//   const isJobBookmarked = (userId) =>
//     selectedJob?.saveJob?.includes(userId);

//   // for bookmark job for particular user
//   const handleBookmark = async (jobId) => {
//     try {
//       const response = await axios.get(
//         `${JOB_API_END_POINT}/bookmark-job/${jobId}`,
//         {
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         toggleBookmarkStatus(jobId, user?._id);
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       console.error(
//         "Error bookmarking job:",
//         error.response?.data?.message || error.message
//       );
//     }
//   };

//   const calculateActiveDays = (createdAt) => {
//     const jobCreatedDate = new Date(createdAt);
//     const currentDate = new Date();
//     const timeDifference = currentDate - jobCreatedDate;
//     return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//   };

//   // Function for handling the job card clicks
//   const handleJobClick = (job) => {
//     setSelectedJob(job);
//     if (window.innerWidth < 768) {
//       setShowJobDetails(true);
//     }
//   };

//   // -------- APPLY JOB FUNCTION ----------
// const handleApply = async (jobId) => {
//   if (!user) {
//     toast.error("Please login to apply");
//     return;
//   }

//   // ✅ Check already applied before hitting backend
//   if (hasAppliedToJob(jobId)) {
//     toast.error("Already applied");
//     return;
//   }

//   try {
//     const payload = {
//       applicant: user._id,
//       applicantName: user.fullname || user.name,
//       applicantEmail: user.email,
//       applicantPhone: user.phoneNumber,
//       applicantProfile: user.profile,
//     };

//     const response = await axios.post(
//       `${JOB_API_END_POINT}/apply-job/${jobId}`,
//       payload,
//       { withCredentials: true }
//     );

//     if (response.data.success) {
//       toast.success("Applied Successfully");

//       // ✅ Update selected job state
//       setSelectedJob((prev) => ({
//         ...prev,
//         application: [...(prev.application || []), { applicant: user._id }],
//       }));
//     }
//   } catch (error) {
//     console.error("Error applying job:", error.response?.data || error.message);
//     toast.error(error.response?.data?.message || "Something went wrong!");
//   }
// };
// useEffect(() => {
//   setFilteredJobs(jobs);     // update filteredJobs
//   setCurrentPage(1);         // reset pagination on filter change
// }, [jobs]);

// // useEffect(() => {
// //   setCurrentPage(1);   // Reset page whenever jobs change
// // }, [jobs]);
// useEffect(() => {
//   if (currentPage > totalPages) {
//     setCurrentPage(totalPages || 1);
//   }
// }, [totalPages]);

//   return (
//    <div className="w-full mt-4 md:px-6">
//       {/* Job List */}
//       <div className="flex justify-center gap-4">

//       <div className={`flex flex-col gap-4 w-full md:w-2/3 m-5 md:m-0 scrollbar-hide`}>
//        {paginatedJobs?.map((job) => (
//           <div
//             key={job._id}
//             className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-lg relative flex flex-col space-y-2 ${
//               selectedJob?._id === job._id
//                 ? "border-blue-600"
//                 : "border-gray-400"
//             }`}
//             onClick={() => handleJobClick(job)}
//           >
//             <div className="flex justify-between items-center">
//               {job?.jobDetails?.urgentHiring === "Yes" && (
//                 <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">
//                   Urgent Hiring
//                 </p>
//               )}
//             </div> 

            
//             <h3 className="text-lg font-semibold">{job.jobDetails?.title}</h3>
//             <p className="text-sm text-gray-600">
//               {job.jobDetails?.companyName}
//             </p>
//             <p className="text-sm text-gray-500">
//               {job.jobDetails?.workPlaceFlexibility} {job.jobDetails?.location}
//             </p>

//             <div className="p-1 flex items-center w-fit text-sm bg-blue-100 text-blue-800 rounded-md">
//               <AiOutlineThunderbolt className="mr-1" />
//               <span>
//                 Typically Respond in {job.jobDetails?.respondTime} days
//               </span>
//             </div>

//             <div className="text-sm flex flex-col">
//               <div className="flex gap-2 items-center">
//                 <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200 ">
//                   {job?.jobDetails?.salary
//                     .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//                     .split("-")
//                     .map((part, index) => (
//                       <span key={index}>
//                         ₹{part.trim()}
//                         {index === 0 ? " - " : ""}
//                       </span>
//                     ))}
//                 </p>
//                 <p className="p-1 font-semibold text-green-700 rounded-md bg-green-100 flex items-center gap-1 ">
//                   {job.jobDetails?.jobType} <FaHeart /> +1
//                 </p>
//               </div>
//               <p className="p-1 font-semibold text-gray-700 rounded-md bg-gray-200 w-fit mt-1">
//                 {job.jobDetails?.duration} +1
//               </p>
//             </div>

//             <div className="flex items-center text-sm text-blue-700">
//               {hasAppliedToJob(job._id) && (
//                 <span className="text-green-600">Applied</span>
//               )}
//             </div>

//             <div
//               className="text-sm text-gray-400 flex flex-col font-semibold"
//               style={{ listStyleType: "circle" }}
//             >
//               <span>{job.jobDetails?.benefits[0]}</span>
//               <span>{job.jobDetails?.responsibilities[0]}</span>
//               <span>{job.jobDetails?.qualifications[0]}</span>
//             </div>

//             <div>
//               <p className="text-sm text-gray-600">
//                 Active {calculateActiveDays(job?.createdAt)} days ago
//               </p>
//             </div>
//           </div>
          
//         ))}
//       </div>

//       {/* Job Details */}
//       {selectedJob && (
//         <div className="sticky top-[60px] md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-3/4 hidden h-fit dark:text-pink-800">
//           <div className="sticky top-[60px] bg-white z-10 shadow-md border-b px-4 py-2 flex flex-col space-y-1 w-full">
//             <h3 className="text-2xl font-semibold dark: text-gray-800">
//               {selectedJob?.jobDetails?.title}
//             </h3>
//             <p className="text-sm text-gray-600">
//               {selectedJob?.jobDetails?.companyName}
//             </p>
//             <p className="text-sm text-gray-500">
//               {selectedJob?.jobDetails?.location}
//             </p>
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
//               <span className="text-blue-800">
//                 Typically Responds in {selectedJob?.jobDetails?.respondTime} days.
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               <div
//                 className={`py-2 px-5 rounded-lg text-white ${
//                   isApplied
//                     ? "bg-green-600 hover:bg-green-700 "
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {isApplied ? (
//                   <div className="flex items-center gap-1">Applied</div>
//                 ) : (
//                   <button
//                     className="flex items-center gap-1"
//                     onClick={() => handleApply(selectedJob._id)}
//                   >
//                     Apply Now
//                   </button>
//                 )}
//               </div>

//               {!isApplied &&
//                 user &&
//                 (isJobBookmarked(user?._id) ? (
//                   <FaBookmark
//                     size={25}
//                     onClick={() => handleBookmark(selectedJob._id)}
//                     className="text-green-700 cursor-pointer"
//                   />
//                 ) : (
//                   <CiBookmark
//                     size={25}
//                     onClick={() => handleBookmark(selectedJob._id)}
//                     className="cursor-pointer"
//                   />
//                 ))}
//             </div>
//           </div>

//           <div
//             ref={jobContainerRef}
//             onScroll={handleScroll}
//             className="overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 py-4"
//           >
//             <JobMajorDetails selectedJob={selectedJob} />
//           </div>
//         </div>
//       )}
//       </div>
//           {/* Pagination (now correctly below) */}
//     <div className="w-full flex justify-center items-center gap-4 mt-6 mb-10">

//       <button
//         className="px-4 py-2 border rounded disabled:opacity-40"
//         disabled={currentPage === 1}
//         onClick={() => handlePageChange(currentPage - 1)}
//       >
//         Prev
//       </button>

//       <span className="text-lg font-semibold">
//         Page {currentPage} of {totalPages}
//       </span>

//       <button
//         className="px-4 py-2 border rounded disabled:opacity-40"
//         disabled={currentPage === totalPages}
//         onClick={() => handlePageChange(currentPage + 1)}
//       >
//         Next
//       </button>

//     </div>

 

//       {/* SMALL SCREEN JOB DETAILS SECTION */}
//       {showJobDetails && selectedJob && (
//         <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out">
//           <button
//             className="fixed top-[80px] right-4 bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300 transition duration-200 z-[100] flex items-center justify-center w-10 h-10"
//             onClick={() => setShowJobDetails(false)}
//           >
//             <IoMdClose size={22} />
//           </button>

//           <div className="p-6 pt-20">
//             <h3 className="text-xl font-semibold text-gray-900 pr-12">
//               {selectedJob?.jobDetails?.title}
//             </h3>
//             <p className="text-sm text-gray-600">
//               {selectedJob?.jobDetails?.companyName}
//             </p>
//             <p className="text-sm text-gray-500">
//               {selectedJob?.jobDetails?.location}
//             </p>
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

//           <div className="p-2 flex items-center gap-8 border-b ml-4">
//             {user &&
//               (isJobBookmarked(user?._id) ? (
//                 <FaBookmark
//                   size={25}
//                   onClick={() => handleBookmark(selectedJob._id)}
//                   className="text-green-700 cursor-pointer"
//                 />
//               ) : (
//                 <CiBookmark
//                   size={25}
//                   onClick={() => handleBookmark(selectedJob._id)}
//                   className="cursor-pointer"
//                 />
//               ))}
//           </div>

//           <div className="p-6 overflow-y-auto h-[calc(100vh-300px)] pb-20">
//             <div className="mt-4 space-y-1">
//               <p className="font-semibold text-gray-700">
//                 Job Type :{" "}
//                 <span className="text-sm text-gray-500">
//                   {selectedJob?.jobDetails?.jobType}
//                 </span>
//               </p>
//               <p className="font-semibold text-gray-700">
//                 Duration :{" "}
//                 <span className="text-sm text-gray-500">
//                   {selectedJob?.jobDetails?.duration}
//                 </span>
//               </p>
//             </div>

//             <div className="mt-4">
//               <JobMajorDetails selectedJob={selectedJob} />
//             </div>
            
//           </div>
          

//           <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex justify-center">
//             {isApplied ? (
//               <button className="bg-green-600 text-white px-6 py-3 rounded-lg w-full max-w-md">
//                 Applied
//               </button>
//             ) : (
//               <button
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full max-w-md flex items-center justify-center gap-2"
//                 onClick={() => handleApply(selectedJob._id)}
//               >
//                 Apply Now
//               </button>
//             )}
//           </div>
//         </div>
        
//       )}
    
//   </div>
// );
// };
// export default JobsForYou;


// old upper working  & below trying filtering and pagination
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark, FaHeart, FaShareAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import JobMajorDetails from "./JobMajorDetails";
import ShareCard from "./ShareJob";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import toast from "react-hot-toast";
import axios from "axios";

const JobsForYou = ({ jobs = [] }) => {
  // Access functions from context
  const { selectedJob, setSelectedJob, toggleBookmarkStatus } = useJobDetails();
  const { user } = useSelector((state) => state.auth);

  // State for small screen job details
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [shareJobId, setShareJobId] = useState(null);

  // Ref to track the scrollable container & share card container
  const jobContainerRef = useRef(null);
  const shareCardRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // ========== CLICK OUTSIDE HANDLER FOR SHARE CARD ==========
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareCardRef.current && !shareCardRef.current.contains(e.target)) {
        setShareJobId(null);
      }
    };

    if (shareJobId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareJobId]);

  // ========== RESPONSIVE HANDLER ==========
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowJobDetails(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ========== SCROLL MANAGEMENT ==========
  useEffect(() => {
    if (jobContainerRef.current) {
      jobContainerRef.current.scrollTop = 0;
    }
  }, [selectedJob]);

  const handleScroll = () => {
    if (jobContainerRef.current) {
      setScrollPosition(jobContainerRef.current.scrollTop);
    }
  };

  // ========== UTILITY FUNCTIONS ==========
  
  const isApplied =
    selectedJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const hasAppliedToJob = (jobId) =>
    jobs.some(
      (job) =>
        job._id === jobId &&
        job?.application?.some(
          (application) => application.applicant === user?._id
        )
    );

  const isJobBookmarked = (userId) =>
    selectedJob?.saveJob?.includes(userId);

  const calculateActiveDays = (createdAt) => {
    const jobCreatedDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - jobCreatedDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  // ========== BOOKMARK HANDLER ==========
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

  // ========== JOB CLICK HANDLER ==========
  const handleJobClick = (job) => {
    setSelectedJob(job);
    if (window.innerWidth < 768) {
      setShowJobDetails(true);
    }
  };

  // ========== APPLY JOB HANDLER ==========
  const handleApply = async (jobId) => {
    if (!user) {
      toast.error("Please login to apply");
      return;
    }

    if (hasAppliedToJob(jobId)) {
      toast.error("Already applied");
      return;
    }

    try {
      const payload = {
        applicant: user._id,
        applicantName: user.fullname || user.name,
        applicantEmail: user.email,
        applicantPhone: user.phoneNumber,
        applicantProfile: user.profile,
      };

      const response = await axios.post(
        `${JOB_API_END_POINT}/apply-job/${jobId}`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Applied Successfully");

        setSelectedJob((prev) => ({
          ...prev,
          application: [...(prev.application || []), { applicant: user._id }],
        }));
      }
    } catch (error) {
      console.error("Error applying job:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  // ========== RENDER ==========
  return (
    <div className="w-full mt-4 md:px-6 overflow-hidden">
      {/* Job List Container - FIXED OVERFLOW */}
      <div className="flex justify-center gap-4 overflow-hidden">
        
        {/* Left: Job Cards List - FIXED WIDTH & OVERFLOW */}
        <div className="flex flex-col gap-2 w-full md:w-1/3 md:max-w-[600px] m-2 md:m-0 overflow-y-auto scrollbar-hide max-h-[calc(100vh-80px)]">
          {jobs?.map((job) => (
            <div
              key={job._id}
              className={`p-5 border rounded-lg cursor-pointer transition-all shadow-md hover:shadow-lg flex-shrink-0 relative ${
                selectedJob?._id === job._id
                  ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
              onClick={() => handleJobClick(job)}
            >
              {/* Top Row: Title, Company & Urgent Badge + Share Icon */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 leading-tight truncate">
                    {job.jobDetails?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {job.jobDetails?.companyName}
                  </p>
                </div>
                
                {/* Right side: Urgent Badge + Share Icon */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Urgent Hiring Badge */}
                  {job?.jobDetails?.urgentHiring === "Yes" && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded whitespace-nowrap">
                      Urgent Hiring
                    </span>
                  )}
                  
                  {/* Share Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareJobId(shareJobId === job._id ? null : job._id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Share Job"
                  >
                    <FaShareAlt size={16} className="text-gray-600 hover:text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Share Card - WRAPPED IN REF */}
              {shareJobId === job._id && (
                <div ref={shareCardRef} onClick={(e) => e.stopPropagation()} className="relative">
                  <ShareCard
                    urlToShare={`${window.location.origin}/job/${job._id}`}
                    jobTitle={job.jobDetails?.title}
                    jobLocation={job.jobDetails?.location}
                    jobSalary={job.jobDetails?.salary}
                    jobDuration={job.jobDetails?.duration}
                    jobType={job.jobDetails?.jobType}
                    onClose={() => setShareJobId(null)}
                  />
                </div>
              )}

              {/* Benefits, Responsibilities, Qualifications Preview */}
              <div className="mb-2 pb-2 border-b border-gray-100">
                <div className="text-xs text-gray-600 space-y-1">
                  {job.jobDetails?.benefits?.[0] && (
                    <p className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                      <span className="truncate">{job.jobDetails.benefits[0]}</span>
                    </p>
                  )}
                  {job.jobDetails?.responsibilities?.[0] && (
                    <p className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                      <span className="truncate">{job.jobDetails.responsibilities[0]}</span>
                    </p>
                  )}
                  {job.jobDetails?.qualifications?.[0] && (
                    <p className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                      <span className="truncate">{job.jobDetails.qualifications[0]}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Middle Row: Location, Flexibility & Job Type */}
              <div className="flex flex-wrap gap-2 items-center mb-2">
                {/* Location */}
                <span className="text-xs text-gray-700 bg-gray-50 border border-gray-200 px-2 py-1 rounded truncate max-w-[150px]">
                  {job.jobDetails?.location}
                </span>

                {/* Workplace Flexibility */}
                <span className="text-xs text-gray-700 bg-gray-50 border border-gray-200 px-2 py-1 rounded truncate max-w-[120px]">
                  {job.jobDetails?.workPlaceFlexibility}
                </span>

                {/* Job Type */}
                <span className="text-xs text-gray-700 bg-gray-50 border border-gray-200 px-2 py-1 rounded truncate max-w-[100px]">
                  {job.jobDetails?.jobType}
                </span>

                {/* Applied Status Badge */}
                {hasAppliedToJob(job._id) && (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded ml-auto flex-shrink-0">
                    ✓ Applied
                  </span>
                )}
              </div>

              {/* Bottom Row: Salary, Duration, Active Days & Response Time */}
              <div className="flex flex-wrap justify-between items-center gap-3 text-xs border-t border-gray-100 pt-2">
                {/* Left Side - Salary & Duration */}
                <div className="flex gap-2 items-center min-w-0 flex-1">
                  {/* Salary */}
                  <span className="font-semibold text-gray-900 truncate">
                    {job?.jobDetails?.salary
                      .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                      .split("-")
                      .map((part, index) => (
                        <span key={index}>
                          ₹{part.trim()}
                          {index === 0 ? " - " : ""}
                        </span>
                      ))}
                  </span>

                  {/* Duration */}
                  <span className="text-gray-600 truncate">
                    • {job.jobDetails?.duration}
                  </span>
                </div>

                {/* Right Side - Active Days & Response Time */}
                <div className="flex gap-3 items-center text-gray-600 flex-shrink-0">
                  {/* Active Days */}
                  <span className="whitespace-nowrap">
                    {calculateActiveDays(job?.createdAt)}d ago
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Job Details Panel (Desktop only) - FIXED WIDTH & OVERFLOW */}
        {selectedJob && (
          <div className="sticky top-[60px] md:flex flex-col border-2 border-gray-300 rounded-lg w-full md:w-2/3 md:max-w-[700px] hidden h-[calc(100vh-80px)] dark:text-pink-800 overflow-hidden">
            
            {/* Header (Sticky) */}
            <div className="flex-shrink-0 bg-white z-10 shadow-md border-b px-4 py-2 space-y-1 w-full">
              <h3 className="text-2xl font-semibold text-gray-800 truncate">
                {selectedJob?.jobDetails?.title}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {selectedJob?.jobDetails?.companyName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {selectedJob?.jobDetails?.location}
              </p>

              {/* Salary */}
              <p className="px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200 truncate max-w-full">
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

              {/* Response Time */}
              <div className="p-1 flex items-center w-fit text-sm text-blue-800 bg-blue-200 rounded max-w-full">
                <AiOutlineThunderbolt className="mr-1 flex-shrink-0" size={20} />
                <span className="text-blue-800 truncate">
                  Responds in {selectedJob?.jobDetails?.respondTime} days
                </span>
              </div>

              {/* Apply & Bookmark Buttons */}
              <div className="flex items-center gap-2">
                <div
                  className={`py-2 px-5 rounded-lg text-white flex-shrink-0 ${
                    isApplied
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  {isApplied ? (
                    <div className="flex items-center gap-1 whitespace-nowrap">✓ Applied</div>
                  ) : (
                    <button
                      className="flex items-center gap-1 whitespace-nowrap"
                      onClick={() => handleApply(selectedJob._id)}
                    >
                      Apply Now
                    </button>
                  )}
                </div>

                {!isApplied && user && (
                  isJobBookmarked(user?._id) ? (
                    <FaBookmark
                      size={25}
                      onClick={() => handleBookmark(selectedJob._id)}
                      className="text-green-700 cursor-pointer hover:text-green-800 flex-shrink-0"
                    />
                  ) : (
                    <CiBookmark
                      size={25}
                      onClick={() => handleBookmark(selectedJob._id)}
                      className="cursor-pointer hover:text-blue-600 flex-shrink-0"
                    />
                  )
                )}
              </div>
            </div>

            {/* Scrollable Details */}
            <div
              ref={jobContainerRef}
              onScroll={handleScroll}
              className="overflow-y-auto scrollbar-hide flex-1 px-4 py-4"
            >
              <JobMajorDetails selectedJob={selectedJob} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Full-Screen Job Details */}
      {showJobDetails && selectedJob && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto">
          
          {/* Close Button */}
          <button
            className="fixed top-[80px] right-4 bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300 transition duration-200 z-[100] flex items-center justify-center w-10 h-10"
            onClick={() => setShowJobDetails(false)}
          >
            <IoMdClose size={22} />
          </button>

          {/* Content */}
          <div className="p-6 pt-20 pb-24">
            <h3 className="text-xl font-semibold text-gray-900 pr-12">
              {selectedJob?.jobDetails?.title}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {selectedJob?.jobDetails?.companyName}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {selectedJob?.jobDetails?.location}
            </p>

            {/* Salary */}
            <p className="mt-2 px-3 py-1 font-semibold text-gray-700 rounded-md w-fit bg-gray-200 max-w-full break-words">
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

            {/* Response Time */}
            <div className="mt-2 flex items-center text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-md w-fit max-w-full">
              <AiOutlineThunderbolt className="mr-1 flex-shrink-0" />
              <span className="truncate">Responds in {selectedJob?.jobDetails?.respondTime} days</span>
            </div>

            {/* Bookmark Button */}
            <div className="p-2 flex items-center gap-8 border-b ml-4 mt-4">
              {user && (
                isJobBookmarked(user?._id) ? (
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
                )
              )}
            </div>

            {/* Job Details */}
            <div className="mt-4 space-y-1 overflow-hidden">
              <p className="font-semibold text-gray-700">
                Job Type:{" "}
                <span className="text-sm text-gray-500 break-words">
                  {selectedJob?.jobDetails?.jobType}
                </span>
              </p>
              <p className="font-semibold text-gray-700">
                Duration:{" "}
                <span className="text-sm text-gray-500 break-words">
                  {selectedJob?.jobDetails?.duration}
                </span>
              </p>
            </div>

            <div className="mt-4 overflow-hidden">
              <JobMajorDetails selectedJob={selectedJob} />
            </div>
          </div>

          {/* Apply Button (Fixed at Bottom) */}
          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t flex justify-center">
            {isApplied ? (
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg w-full max-w-md">
                ✓ Applied
              </button>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full max-w-md"
                onClick={() => handleApply(selectedJob._id)}
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsForYou;