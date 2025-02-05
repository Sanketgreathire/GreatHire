import React, { useState } from "react";
import { BsPersonWorkspace } from "react-icons/bs";
import { HiLightBulb } from "react-icons/hi";
import { PiMoneyWavyFill } from "react-icons/pi";
import { FaToolbox } from "react-icons/fa";
import { BsFlagFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const JobMajorDetails = ({ selectedJob }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      {/* profile insight */}
      <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200 ">
        <div>
          <h1 className="text-xl font-bold">Profile Insight</h1>
        </div>

        {/* Skills Section */}
        <div className="mt-2">
          <h3 className="text-xl text-gray-500 flex items-center gap-2">
            <HiLightBulb />
            <span className="text-xl font-bold text-black">Skills</span>
          </h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {selectedJob?.jobDetails?.skills.map((skill, index) => (
              <div
                key={index}
                className={`flex items-center w-fit px-4 py-2 rounded-lg bg-slate-200 gap-1 text-sm text-gray-800`}
              >
                <span className="font-bold">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job details */}
      <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200">
        <div>
          <h1 className="text-xl font-bold">Job details</h1>
        </div>

        {/* Pay Section */}
        <div className="mt-2">
          <h3 className="text-xl text-gray-500 flex items-center gap-2">
            <PiMoneyWavyFill />
            <span className="text-xl font-bold text-black">Pay</span>
          </h3>
          <div className="flex items-center w-fit px-4 py-2 rounded-lg  bg-slate-200 gap-1 text-sm text-gray-800 font-semibold">
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

        {/* Experience Section */}
        <div className="mt-2">
          <h3 className="text-xl text-gray-500 flex items-center gap-2">
            <BsPersonWorkspace />
            <span className="text-xl font-bold text-black">Experience</span>
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex items-center w-fit px-4 py-2 rounded-lg bg-slate-200 gap-1 text-sm text-gray-800">
              <span className="font-bold">
                {selectedJob?.jobDetails?.experience} Years
              </span>
            </div>
          </div>
        </div>

        {/* Job Type section */}
        <div className="mt-4">
          <h3 className="text-xl text-gray-500 flex items-center gap-2">
            <FaToolbox />
            <span className="text-xl font-bold text-black">Job type</span>
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <div
              className={`flex items-center w-fit px-4 py-2 rounded-lg bg-slate-200 gap-1 text-sm text-gray-800`}
            >
              <span className="font-bold">
                {selectedJob?.jobDetails?.jobType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Job Description */}
      <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200">
        <h1 className="text-xl font-bold">Full Job Description</h1>
        <p className="font-semibold">
                {selectedJob?.jobDetails?.details}
              </p>
      </div>

      {/* Benifits */}
      <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200">
        <h1 className="text-xl font-bold">Benifits</h1>
        <ul
          className="ml-6 text-sm text-gray-600 mt-2"
          style={{ listStyleType: "circle" }}
        >
          {selectedJob?.jobDetails?.benefits?.map((benifit, index) => (
            <li key={index}>{benifit}</li>
          ))}
        </ul>
      </div>

      {/* Responsibilities */}
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
      </div>

      {/* qualifications */}
      <div className="p-4 flex flex-col justify-center gap-4 border-b-2 border-gray-200">
        <h1 className="text-xl font-bold">Qualifications</h1>
        <ul
          className="ml-6 text-sm text-gray-600 mt-2"
          style={{ listStyleType: "circle" }}
        >
          {selectedJob?.jobDetails?.qualifications?.map(
            (qualification, index) => (
              <li key={index}>{qualification}</li>
            )
          )}
        </ul>
      </div>

      <div className="p-4">
        <button
          className="flex items-center gap-2 bg-gray-400 p-2 rounded-lg cursor-pointer"
          onClick={() => navigate(`/report-job/${selectedJob?.jobDetails?.id}`)}
          disabled={!user}
        >
          <BsFlagFill /> <span className="font-semibold">Report Job</span>
        </button>
      </div>
    </div>
  );
};

export default JobMajorDetails;
