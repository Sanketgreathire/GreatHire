

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const JobDescription = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [isApplied, setApplied] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchJob = async () => {
  //     try {
  //       const res = await fetch(`/api/v1/job/get/${jobId}`);
  //       if (!res.ok) {
  //         setError(`HTTP ${res.status}`);
  //         return;
  //       }

  //       const text = await res.text();
  //       let data;
  //       try {
  //         data = JSON.parse(text);
  //       } catch (err) {
  //         setError("Response is not JSON");
  //         return;
  //       }

  //       console.log("Job data from backend:", data); // 👀 check structure
  //       setJob(data);

  //       // ✅ Check if user already applied
  //       if (user?._id) {
  //         const appliedRes = await fetch(
  //           `/api/v1/job/${jobId}/check-applied/${user._id}`
  //         );
  //         const appliedData = await appliedRes.json();
  //         setApplied(appliedData.applied);
  //       }
  //     } catch (err) {
  //       setError("Network error");
  //     }
  //   };

  //   fetchJob();
  // }, [jobId, user]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/v1/job/get/${jobId}`, {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Backend job response:", data);

        if (!data.success || !data.job) {
          setError("Job not found");
          return;
        }

        setJob(data.job); // ✅ sirf job set karo

        // check applied
        if (user?._id) {
          const appliedRes = await fetch(
            `/api/v1/job/${jobId}/check-applied/${user._id}`,
            { credentials: "include" }
          );
          const appliedData = await appliedRes.json();
          setApplied(appliedData.applied);
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Network error");
      }
    };

    fetchJob();
  }, [jobId, user]);


  if (!job) {
    return (
      <div>
        <Navbar />
        <div className="text-gray-800 min-h-screen flex items-center justify-center dark:text-gray-100">
          <p className="text-lg">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>

      <Helmet>
        <title>Job Description & Online Application | GreatHire's Verified Hiring Opportunities</title>
        <meta
          name="description"
          content="The entire job details are to be found on the GreatHire website, and application is to be made from there, Hyderabad State, India, with confidence. The entire details regarding job, skills required for that job, nature and pay scales, experience level, and application status are to be found on that particular website. Therefore, with the transparent recruitment system available on our website, it is sure that the job seekers will take correct decisions regarding their career, with no possibility of confusion among the seekers."
        />
      </Helmet>


      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-100">
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 dark:bg-gray-700">
            {/* Back Button */}
            <div className="mb-6">
              <IoIosArrowRoundBack
                size={35}
                className="text-gray-700 hover:text-gray-800 cursor-pointer dark:text-gray-100"
                onClick={() => navigate(-1)}
              />
            </div>

            {/* Job Title and Overview */}
            {/* <div className="border-b pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                {job?.jobDetails?.title || "Job Title Not Available"}
              </h1>
              <div className="mt-2 space-y-1">
                <h5 className="text-md text-gray-600 dark:text-gray-100">
                  {job?.jobDetails?.companyName || "Company Not Specified"}
                </h5>
                <h6 className="text-sm text-gray-500 dark:text-gray-100">
                  {job?.jobDetails?.location || "Location Not Available"}
                </h6>
                <h6 className="text-lg text-gray-700 font-medium dark:text-gray-100">
                  {job?.jobDetails?.salary || "Salary Not Specified"}
                </h6>
              </div>
            </div> */}


            <div className="border-b pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  {job?.jobDetails?.title || "Job Title Not Available"}
                </h1>
                <div className="mt-2 space-y-1">
                  <h5 className="text-md text-gray-600 dark:text-gray-100">
                    {job?.company?.companyName || "Company Not Specified"}
                  </h5>
                  <h6 className="text-sm text-gray-500 dark:text-gray-100">
                    {job?.jobDetails?.location || "Location Not Available"}
                  </h6>
                  <h6 className="text-lg text-gray-700 font-medium dark:text-gray-100">
                    {job?.jobDetails?.salary || "Salary Not Specified"}
                  </h6>
                </div>
              </div>



              {/* Apply Button */}
              <button
                onClick={() => {
                  if (!isApplied) navigate(`/apply/${job?._id}`);
                }}
                className={`${isApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-800"
                  } text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200`}
                disabled={isApplied}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>
            </div>

            {/* Job Description */}
            <div className="mb-8 ">
              <h2 className="text-xl font-bold text-gray-800 mb-3 dark:text-gray-100 ">
                Job Description:
              </h2>
              <p className="text-gray-700 leading-relaxed text-base text-justify dark:text-gray-100">
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

            {/* Benefits and Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-gray-100">
                  Benefits:
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-base space-y-1 dark:text-gray-100">
                  {job?.jobDetails?.benefits?.length > 0 ? (
                    job.jobDetails.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))
                  ) : (
                    <li>Not specified</li>
                  )}
                </ul>
              </div>
              <div className="md:col-span-2 ">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 dark:text-gray-100 ">
                  Job Details:
                </h3>
                <div className="space-y-2 text-base text-gray-600 dark:text-gray-100 ">
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
              <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100">
                Job Requirements:
              </h2>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 dark:text-gray-100">
                    Qualifications:
                  </h4>
                  <p className="text-gray-600 text-base dark:text-gray-100">
                    {job?.jobDetails?.qualifications?.join(", ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 dark:text-gray-100">
                    Experience:
                  </h4>
                  <p className="text-gray-600 text-base dark:text-gray-100">
                    {job?.jobDetails?.experience || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 dark:text-gray-100">
                    Skills:
                  </h4>
                  <p className="text-gray-600 text-base dark:text-gray-100">
                    {job?.jobDetails?.skills?.join(", ") || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default JobDescription;
