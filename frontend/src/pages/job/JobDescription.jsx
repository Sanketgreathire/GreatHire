import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const JobDescription = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [isApplied, setApplied] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/job/get/${jobId}`);


        // Log raw response
        console.log("Raw response:", res);

        // Check if response is not OK
        if (!res.ok) {
          setError(`HTTP ${res.status}`);
          return;
        }

        const text = await res.text();
        console.log("Raw response text:", text); // 👀 check if it's HTML

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("JSON parse failed:", err);
          setError("Response is not JSON");
          return;
        }

        console.log("Parsed job data:", data);
        setJob(data);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError("Network error");
      }
    };

    fetchJob();
  }, [jobId]);

  if (!job) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-700">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

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
                {job?.jobDetails?.title || "Job Title Not Available"}
              </h1>
              <div className="mt-2 space-y-1">
                <h5 className="text-md text-gray-600">
                  {job?.jobDetails?.companyName || "Company Not Specified"}
                </h5>
                <h6 className="text-sm text-gray-500">
                  {job?.jobDetails?.location || "Location Not Available"}
                </h6>
                <h6 className="text-xl text-gray-700 font-medium">
                  {job?.jobDetails?.salary
                    ?.replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
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
              onClick={() => navigate(`/apply/${job?._id}`)}
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
            <p className="text-gray-700 leading-relaxed text-base text-justify">
              {job?.jobDetails?.details
                ? job.jobDetails.details.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))
                : "No description provided."}
            </p>
          </div>

          {/* Benefits and Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Benefits:
              </h3>
              <ul className="list-disc list-inside text-gray-600 text-base space-y-1">
                {job?.jobDetails?.benefits?.length > 0 ? (
                  job.jobDetails.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))
                ) : (
                  <li>Not specified</li>
                )}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Job Details:
              </h3>
              <div className="space-y-2 text-base text-gray-600">
                <p>
                  <strong>Job Type:</strong>{" "}
                  {job?.jobDetails?.jobType || "Not specified"}
                </p>
                <p>
                  <strong>Working Days:</strong>{" "}
                  {job?.jobDetails?.duration || "Not specified"}
                </p>
                <p>
                  <strong>No. of Openings:</strong>{" "}
                  {job?.jobDetails?.numberOfOpening || "Not specified"}
                </p>
                <p>
                  <strong>Posted Date:</strong>{" "}
                  {job?.createdAt
                    ? new Date(job.createdAt).toLocaleDateString("en-GB")
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
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
                  {job?.jobDetails?.qualifications?.join(", ") ||
                    "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">
                  Experience:
                </h4>
                <p className="text-gray-600 text-base">
                  {job?.jobDetails?.experience || "Not specified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Skills:</h4>
                <p className="text-gray-600 text-base">
                  {job?.jobDetails?.skills?.join(", ") || "Not specified"}
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
