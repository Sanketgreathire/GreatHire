// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";

// Hook for navigation
import { useNavigate } from "react-router-dom"; 

// Importing the Navbar component
import Navbar from "@/components/shared/Navbar"; 

// Importing the Footer component
import Footer from "@/components/shared/Footer"; 

// Hook for accessing Redux state
import { useSelector } from "react-redux"; 

// Context to access selected job details
import { useJobDetails } from "@/context/JobDetailsContext"; 

// Importing back arrow icon
import { IoIosArrowRoundBack } from "react-icons/io"; 

const JobDescription = () => {
  const { selectedJob } = useJobDetails(); // Getting selected job details from context
  const { user } = useSelector((state) => state.auth); // Fetching the authenticated user from Redux store
  const navigate = useNavigate(); // Hook to handle navigation
  const [isApplied, setApplied] = useState(false); // State to track if the user has applied for the job

  useEffect(() => {
    // Check if the user has applied for the job
    let isApply =
      selectedJob?.application?.some(
        (application) => application.applicant === user?._id
      ) || // Check if the user is in the job's application list
      selectedJob?.applicant === user?._id || // Check if the user is the applicant
      false;

    if (isApply) setApplied(isApply); // Update the state if the user has applied
  }, []); // Runs only once when the component mounts


  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
          {/* Back Button */}
          <div className="mb-6">
            <IoIosArrowRoundBack
              size={35}
              className="text-gray-700 hover:text-gray-800 transition-colors cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>

          {/* Job Title and Overview */}
          <div className="border-b pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            {/* Left Section */}
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {selectedJob?.jobDetails.title || "Job Title Not Available"}
              </h1>
              <div className="mt-2 space-y-1">
                <h5 className="text-md text-gray-600">
                  {selectedJob?.jobDetails.companyName ||
                    "Company Not Specified"}
                </h5>
                <h6 className="text-sm text-gray-500">
                  {selectedJob?.jobDetails.location || "Location Not Available"}
                </h6>
                <h6 className="text-xl text-gray-700 font-medium">
                  {selectedJob?.jobDetails?.salary
                    .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                    .split("-")
                    .map((part, index) => (
                      <span key={index}>
                        ₹{part.trim()}
                        {index === 0 ? " - " : ""}
                      </span>
                    ))}
                </h6>
              </div>
            </div>

            {/* Right Section - Apply Now Button */}
            <button
              onClick={() => navigate(`/apply/${selectedJob?._id}`)}
              className={`${
                isApplied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-700 hover:bg-blue-800"
              } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              disabled={isApplied}
            >
              {isApplied ? "Applied" : "Apply Now"}
            </button>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Job Description:
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">
            {selectedJob?.jobDetails?.details 
            ? selectedJob.jobDetails.details.split("\n").map((line, index) => (
              <span key={index}>
              {line}
              <br />
              </span>
          )) 
          : "No description provided."}
            </p>
          </div>

          {/* Benefits, Responsibilities, and Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Benefits:
              </h3>
              <ul className="list-disc list-inside text-gray-600 text-base space-y-1">
                {selectedJob?.jobDetails.benefits?.length > 0 ? (
                  selectedJob?.jobDetails.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))
                ) : (
                  <li>Not specified</li>
                )}
              </ul>
            </div>

            {/* <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Responsibilities:
              </h3>
              <ul className="list-disc list-outside pl-5 text-gray-600 text-base space-y-1">
                {selectedJob?.jobDetails.responsibilities?.length > 0 ? (
                  selectedJob?.jobDetails.responsibilities.map(
                    (responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    )
                  )
                ) : (
                  <li>Not specified</li>
                )}
              </ul>
            </div> */}

            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Job Details:
              </h3>
              <div className="space-y-2 text-base text-gray-600">
                <p>
                  <strong>Job Type:</strong>{" "}
                  {selectedJob?.jobDetails.jobType || "Not specified"}
                </p>
                <p>
                  <strong>Working Days:</strong>{" "}
                  {selectedJob?.jobDetails.duration || "Not specified"}
                </p>
                <p>
                  <strong>No. of Openings:</strong>{" "}
                  {selectedJob?.jobDetails.numberOfOpening || "Not specified"}
                </p>
                <p>
                  <strong>Posted Date:</strong>{" "}
                  {selectedJob?.createdAt
                    ? (() => {
                        const date = new Date(selectedJob.createdAt);
                        return `${date.getDate()}-${
                          date.getMonth() + 1
                        }-${date.getFullYear()}`;
                      })()
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Job Requirements */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Job Requirements:
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">
                  Qualifications:
                </h4>
                <p className="text-gray-600 text-base">
                  {selectedJob?.jobDetails.qualifications?.join(", ") ||
                    "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">
                  Experience:
                </h4>
                <p className="text-gray-600 text-base">
                  {selectedJob?.jobDetails.experience || "Not specified"}{" "}
                  {selectedJob?.jobDetails?.experience !== "Fresher" &&
                    selectedJob?.jobDetails?.experience !== "fresher" &&
                    " "}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Skills:</h4>
                <p className="text-gray-600 text-base">
                  {selectedJob?.jobDetails.skills?.join(", ") ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDescription;
