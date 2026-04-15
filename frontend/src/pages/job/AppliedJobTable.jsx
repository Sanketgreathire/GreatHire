// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";


// Import UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Import API endpoint and context
import { APPLICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import { useJobDetails } from "@/context/JobDetailsContext";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";


// Define status styles for different job application statuses
const statusStyles = {
  Shortlisted: "bg-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800",
  Pending: "bg-yellow-200 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800",
  Rejected: "bg-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800",
};

const AppliedJobTable = () => {
  // State to store applied jobs
  const [appliedJobs, setAppliedJobs] = useState([]);

  // State to handle loading state
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Navigation hook
  const navigate = useNavigate();

  // Access job details context
  const { selectedJob, setSelectedJob } = useJobDetails();

  // Fetch applied jobs from API when the component mounts
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);
      try {
        // Fetch job applications with authentication
        const response = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });

        // Check if API call was successful
        if (response.data.success) {
          setAppliedJobs(response.data.application);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Display loading message while data is being fetched
  if (loading) {
    return <p className="text-center text-gray-600 dark:text-gray-300">Loading applied jobs...</p>;
  }

  // Pagination logic
  const totalJobs = appliedJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage) || 1;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = appliedJobs.slice(indexOfFirstJob, indexOfLastJob);

  // const handleRowClick = (applicant, job) => {
  //   if (job) {
  //     // Store selected job details in context
  //     setSelectedJob({ ...job, applicant });
  //     // navigate(`/description`);
  //      navigate(`/description/${job._id}`);

  //   } else {
  //     console.error("Job ID not found for this application.");
  //   }
  // };


  const handleRowClick = (applicant, job) => {
    if (job?._id) {
      navigate(`/description/${job._id}`);   // ✅ id ke saath bhejo
    } else {
      console.error("Job ID not found for this application.");
    }
  };


  return (
    // <div className="p-5 bg-gray-50 shadow-md rounded-lg text-black  ">
    //   {/* Job Applications Table */}
    //   <Table className="w-full border-collapse border border-gray-200 ">
    //     {/* Table Header */}
    //     <TableHeader className="bg-gray-50 ">
    //       currentJobs.map((job, index) => ( 

    //       <TableRow  >
    //         <TableHead>Date</TableHead>
    //         <TableHead>Job Role</TableHead>
    //         <TableHead>Company</TableHead>
    //         <TableHead className="text-right">Status</TableHead>
    //       </TableRow>
    //     </TableHeader>

    //     {/* Table Body */}
    //     <TableBody>
    //       {currentJobs.length > 0 ? (
    //         currentJobs.map((job, index) => (
    //           <TableRow
    //             key={index}
    //             className="transition duration-150 cursor-pointer  "
    //             onClick={() => handleRowClick(job.applicant, job.job)}
    //           >
    //             <TableCell className="text-gray-700 ">
    //               {new Date(job.createdAt).toLocaleDateString()}
    //             </TableCell>
    //             <TableCell className="text-gray-800 font-medium  " >
    //               {job.job?.jobDetails?.title || "N/A"}
    //             </TableCell>
    //             <TableCell className="text-gray-800 font-medium">
    //               {job.job?.company?.companyName || "N/A"}
    //             </TableCell>
    //             <TableCell className="text-right">
    //               <Badge
    //                 className={`px-2 py-1 rounded-md ${
    //                   statusStyles[job.status] || "bg-gray-200 text-gray-300"
    //                 }`}
    //               >
    //                 {job.status || "Pending"}
    //               </Badge>
    //             </TableCell>
    //           </TableRow>
    //         ))
    //       ) : (
    //         <TableRow>
    //           <TableCell colSpan={4} className="text-center text-gray-500  ">
    //             No applications found.
    //           </TableCell>
    //         </TableRow>
    //       )}
    //     </TableBody>
    //   </Table> 

   <>
    {/* <Helmet>
      <title>Applied Jobs Dashboard | Monitor the Status of Your Job Applications - GreatHire</title>
      <meta
        name="description"
        content="Track and manage all your applications in a single, intelligent, and tailored dashboard. This page provides an opportunity to the candidates to manage their application dates, roles, companies, and statuses with utmost clarity. Designed for the candidates who are in the search of various opportunities in the state of Hyderabad, it provides you the opportunity to manage everything in a single place. If you are awaiting the response, already short-listed, or even analyzing the results, you are always ready with the required information in the challenging recruitment scenario of the current era."
      />
    </Helmet> */}

    <Helmet>
      <title>User Profile & Applied Jobs Dashboard | Monitor Resumes, Skills, and Applications - GreatHire</title>
      <meta
        name="description"
        content="Create and organize your professional profile on GreatHire, a respectable job site with its headquarters located in Hyderabad, India. To create a profile that is appealing to recruiters, users can upload resumes, highlight talents, add work experience, confirm contact details, and maintain crucial documents using the single profile dashboard. Candidates can use a single, sophisticated dashboard to monitor and manage all job applications in addition to managing their profiles. Easily keep track of jobs you've applied for, firms you've applied to, application dates, and current statuses like pending or shortlisted. This all-in-one platform keeps candidates informed, organized, and confident in today's competitive and quickly changing recruitment scene, whether they are actively applying, waiting for responses, or assessing results."
      />
    </Helmet>

    <div className="p-5 bg-gray-50 dark:bg-gray-950 text-black dark:text-white transition-colors duration-300 shadow-md rounded-lg">
      {/* Job Applications Table */}
      <Table className="w-full border-collapse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-black/40 transition-colors duration-300">

        {/* Table Header */}
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow className="border-b border-gray-200 dark:border-gray-700">
            <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Job Role</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Company</TableHead>
            <TableHead className="text-right text-gray-700 dark:text-gray-300">Status</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {currentJobs.length > 0 ? (
            currentJobs.map((job, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                onClick={() => handleRowClick(job.applicant, job.job)}
              >
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {new Date(job.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-white font-medium">
                  {job.job?.jobDetails?.title || "N/A"}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-white font-medium">
                  {job.job?.company?.companyName || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`px-2 py-1 rounded-md ${statusStyles[job.status] || "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                  >
                    {job.status || "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                No applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>


      {/* Pagination Controls */}
      <div className="flex justify-between mt-4 p-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded transition-colors duration-200 ${currentPage === 1
              ? "bg-gray-300 text-gray-500 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
            }`}
        >
          Previous
        </button>
        <span className="text-gray-600 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded transition-colors duration-200 ${currentPage === totalPages
              ? "bg-gray-300 text-gray-500 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
            }`}
        >
          Next
        </button>
      </div>
    </div>
    </>
  );
};

export default AppliedJobTable;
