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

// Define status styles for different job application statuses
const statusStyles = {
  Shortlisted: "bg-green-200 text-green-700 hover:bg-green-100",
  Pending: "bg-yellow-200 text-yellow-700 hover:bg-yellow-100",
  Rejected: "bg-red-200 text-red-700 hover:bg-red-100",
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
    return <p className="text-center text-gray-600">Loading applied jobs...</p>;
  }

  // Pagination logic
  const totalJobs = appliedJobs.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage) || 1;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = appliedJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Handle table row click to navigate to job description
  const handleRowClick = (applicant, job) => {
    if (job) {
      // Store selected job details in context
      setSelectedJob({ ...job, applicant });
      navigate(`/description`);
    } else {
      console.error("Job ID not found for this application.");
    }
  };

  return (
    <div className="p-5 bg-gray-50 shadow-md rounded-lg">
      {/* Job Applications Table */}
      <Table className="w-full border-collapse border border-gray-200">
        {/* Table Header */}
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {currentJobs.length > 0 ? (
            currentJobs.map((job, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                onClick={() => handleRowClick(job.applicant, job.job)}
              >
                <TableCell className="text-gray-700">
                  {new Date(job.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-gray-800 font-medium">
                  {job.job?.jobDetails?.title || "N/A"}
                </TableCell>
                <TableCell className="text-gray-800 font-medium">
                  {job.job?.company?.companyName || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`px-2 py-1 rounded-md ${
                      statusStyles[job.status] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {job.status || "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AppliedJobTable;
