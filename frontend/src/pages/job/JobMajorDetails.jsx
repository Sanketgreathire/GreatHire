// Import necessary modules and dependencies
import React from "react";
import { BsPersonWorkspace } from "react-icons/bs";
import { HiLightBulb } from "react-icons/hi";
import { PiMoneyWavyFill } from "react-icons/pi";
import { FaToolbox } from "react-icons/fa";
import { BsFlagFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const JobMajorDetails = ({ selectedJob }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  return (
    <>

      <Helmet>
        <title>Detailed Job Overview | Salary, Skills & Requirements – GreatHire</title>
        <meta
          name="description"
          content="Get a complete job overview on GreatHire with clear insights into salary, experience level, job type, required skills, qualifications, benefits, and full role description. This page helps job seekers quickly understand whether a position matches their profile before applying. Designed for clarity and transparency, GreatHire ensures every job listing provides meaningful details that support informed career decisions. Based in Hyderabad State, India, GreatHire serves as a trusted hiring platform connecting professionals with verified employers across multiple industries and roles."
        />
      </Helmet>


      <div>
        {/* Job details */}
        <div className="p-4  flex flex-col justify-center gap-4 border-b-2 border-gray-200">
          <div>
            <h1 className="text-xl font-bold dark:text-gray-300">Job details</h1>
          </div>

          {/* Pay Section */}
          <div className="mt-2  ">
            <h3 className="text-xl text-gray-500 flex items-center gap-2 dark:text-gray-100">
              <PiMoneyWavyFill />
              <span className="text-xl font-bold text-black dark:text-gray-100">Pay</span>
            </h3>
            <div className="flex items-center w-fit px-4 py-2 rounded-lg  bg-slate-200 gap-1 text-sm text-gray-800 ">
              {selectedJob?.jobDetails?.salary
                .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                .split("-")
                .map((part, index) => (
                  <span key={index}>
                    ₹{part.trim()}
                    {index === 0 ? " - " : ""}
                  </span>
                ))}
            </div>
          </div>
          {/* ---------------------------------------------------------------------------------------------------- */}
          {/* ------------------------------------------------------------------------------------------------------------ */}
          {/* Experience Section */}
          <div className="mt-2">
            <h3 className="text-xl text-gray-500 flex items-center gap-2 dark:text-gray-100">
              <BsPersonWorkspace />
              <span className="text-xl font-bold text-black dark:text-gray-100">Experience</span>
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="flex items-center w-fit px-4 py-2 rounded-lg bg-slate-200 gap-1 text-sm text-gray-800">
                <span className="">
                  {selectedJob?.jobDetails?.experience}{" "}
                  {selectedJob?.jobDetails?.experience !== "Fresher" &&
                    selectedJob?.jobDetails?.experience !== "fresher" &&
                    ""}
                </span>
              </div>
            </div>
          </div>

          {/* Job Type section */}
          <div className="mt-4">
            <h3 className="text-xl text-gray-500 flex items-center gap-2 dark:text-gray-100">
              <FaToolbox />
              <span className="text-xl font-bold text-black dark:text-gray-100">Job type</span>
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <div
                className={`flex items-center w-fit px-4 py-2 rounded-lg bg-slate-200 gap-1 text-sm text-gray-800`}
              >
                <span className="">
                  {selectedJob?.jobDetails?.jobType}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* -------------------------------------------------------------------------------------------------------------- */}
        {/* profile insight */}
        <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200 text-gray-800 dark:text-gray-800 dark:text-gray-100 ">
          <div>
            <h1 className="text-xl font-bold text-gray-800  dark:text-gray-100  ">Profile Insight</h1>
          </div>

          {/* Skills Section */}
          <div className="mt-2">
            <h3 className="text-xl text-gray-500 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <HiLightBulb />
              <span className="text-xl font-bold text-black text-gray-800 dark:text-gray-100">Skills</span>
            </h3>

            <div className="flex flex-wrap gap-2 mt-2 text-gray-800 dark:text-gray-800">
              {selectedJob?.jobDetails?.skills.map((skill, index) => (
                <div
                  key={index}
                  className={`flex items-center w-fit px-4 py-2 rounded-lg bg-slate-200 gap-1 text-sm text-gray-800 text-gray-800 dark:text-gray-800`}
                >
                  <span className="">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Job Description */}
        <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200 dark:text-gray-100">
          <h1 className="text-xl font-bold dark:text-gray-100">Full Job Description</h1>
          <p className=" text-justify dark:text-gray-100">
            {selectedJob?.jobDetails?.details
              ? selectedJob.jobDetails.details.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))
              : "No description provided ."}
          </p>
        </div>


        {/* Benifits */}
        <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200 dark:text-gray-100">
          <h1 className="text-xl font-bold">Benifits</h1>
          <ul
            className="ml-6 text-sm text-gray-600 mt-2 dark:text-gray-100"
            style={{ listStyleType: "circle" }}
          >
            {selectedJob?.jobDetails?.benefits?.map((benifit, index) => (
              <li key={index}>{benifit}</li>
            ))}
          </ul>
        </div>

        {/* Responsibilities
      <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200">
        <h1 className="text-xl font-bold">Responsibilities</h1>
        <ul
          className="ml-6 text-sm text-gray-600 mt-2"
          style={{ listStyleType: "circle" }}
        >
          {selectedJob?.jobDetails?.responsibilities?.map(
            (responsibilitie, index) => (
              <li key={index}>{responsibilitie}</li>
            )
          )}
        </ul>
      </div> */}

        {/* qualifications */}
        <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200">
          <h1 className="text-xl font-bold dark:text-gray-200">Qualifications</h1>
          <ul
            className="ml-6 text-sm text-gray-600 mt-2 dark:text-gray-100"
            style={{ listStyleType: "circle" }}
          >
            {selectedJob?.jobDetails?.qualifications?.map(
              (qualification, index) => (
                <li key={index}>{qualification}</li>
              )
            )}
          </ul>
        </div>

        <div className="p-4 mb-14 flex">
          <button
            className="flex items-center gap-2 bg-gray-400 p-2 rounded-lg cursor-pointer"
            onClick={() => navigate(`/report-job`)}
            disabled={!user}
          >
            <BsFlagFill /> <span className="font-semibold">Report Job</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default JobMajorDetails;
