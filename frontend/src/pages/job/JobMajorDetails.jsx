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

// import dompurify to display the formatted description
import DOMPurify from "dompurify";

const JobMajorDetails = ({ selectedJob }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  return (
    <>

      <Helmet>
        <title>Current Job Openings & Job Descriptions | View Requirements, Save, Share, and Apply - GreatHire</title>
        <meta
          name="description"
          content="Manage your job search with simplicity by finding the most recent and genuine job ads on GreatHire. Viewing thorough job descriptions, applying with confidence, saving positions for later, and instantaneously sharing ads are all available to candidates. GreatHire, a quickly expanding job platform with its headquarters in Hyderabad, India, links qualified professionals with certified employers in a variety of industries. Every job posting provides a comprehensive summary that includes the salary, location, experience level, job kind, necessary skills, credentials, perks, and full position details. GreatHire, which was created with openness and clarity in mind, assists job searchers in swiftly assessing prospects and making well-informed career decisions while confidently navigating the competitive recruitment landscape of today."
        />
      </Helmet>


      <div className="max-w-5xl mx-auto space-y-6">
        {/* Job details */}
        <div className="p-6 flex flex-col gap-6 border-b border-gray-200">
          <h1 className="text-xl font-bold dark:text-gray-300">
            Job details
          </h1>

          {/* Pay Section */}
          <div className="space-y-2">
            <h3 className="text-lg flex items-center gap-2 text-gray-500 dark:text-gray-100">
              <PiMoneyWavyFill />
              <span className="font-bold text-black dark:text-gray-100">Pay</span>
            </h3>

            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-200 text-sm text-gray-800">
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
          <div className="space-y-2">
            <h3 className="text-lg flex items-center gap-2 text-gray-500 dark:text-gray-100">
              <BsPersonWorkspace />
              <span className="font-bold text-black dark:text-gray-100">
                Experience
              </span>
            </h3>

            <div className="inline-flex px-4 py-2 rounded-lg bg-slate-200 text-sm text-gray-800">
              {selectedJob?.jobDetails?.experience}
            </div>
          </div>

          {/* Job Type Section */}
          <div className="space-y-2">
            <h3 className="text-lg flex items-center gap-2 text-gray-500 dark:text-gray-100">
              <FaToolbox />
              <span className="font-bold text-black dark:text-gray-100">
                Job type
              </span>
            </h3>

            <div className="inline-flex px-4 py-2 rounded-lg bg-slate-200 text-sm text-gray-800">
              {selectedJob?.jobDetails?.jobType}
            </div>
          </div>
        </div>

        {/* Profile Insight */}
        <div className="p-6 flex flex-col gap-6 border-b border-gray-200">
          <h1 className="text-xl font-bold dark:text-gray-100">
            Profile Insight
          </h1>

          {/* Skills Section */}
          <div className="space-y-3">
            <h3 className="text-lg flex items-center gap-2 text-gray-500 dark:text-gray-100">
              <HiLightBulb />
              <span className="font-bold text-black dark:text-gray-100">
                Skills
              </span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {(() => {
                const rawSkills = selectedJob?.jobDetails?.skills || [];

                const similarity = (a, b) => {
                  a = a.toLowerCase();
                  b = b.toLowerCase();
                  if (a === b) return 1;

                  const dp = Array.from({ length: b.length + 1 }, () =>
                    Array(a.length + 1).fill(0)
                  );

                  for (let i = 0; i <= b.length; i++) dp[i][0] = i;
                  for (let j = 0; j <= a.length; j++) dp[0][j] = j;

                  for (let i = 1; i <= b.length; i++) {
                    for (let j = 1; j <= a.length; j++) {
                      dp[i][j] =
                        b[i - 1] === a[j - 1]
                          ? dp[i - 1][j - 1]
                          : Math.min(
                            dp[i - 1][j - 1] + 1,
                            dp[i][j - 1] + 1,
                            dp[i - 1][j] + 1
                          );
                    }
                  }

                  return 1 - dp[b.length][a.length] / Math.max(a.length, b.length);
                };

                const splitSkills = rawSkills.flatMap((skill) => {
                  return skill
                    .split(/\n+/) // ✅ NEW: split by new lines
                    .flatMap((line) => {
                      const cleaned = line
                        .replace(/proficient in/i, "")
                        .replace(/architecture/i, "")
                        .replace(/concepts?/i, "concepts")
                        .trim();

                      let depth = 0;
                      let buffer = "";
                      const result = [];

                      for (const char of cleaned) {
                        if (char === "(") depth++;
                        if (char === ")") depth--;

                        if ((char === "," || char === "&") && depth === 0) {
                          result.push(buffer.trim());
                          buffer = "";
                        } else {
                          buffer += char;
                        }
                      }
                      if (buffer) result.push(buffer.trim());

                      return result
                        .flatMap((r) => r.split(/\s*(?:\band\b|\bor\b)\s*/i))
                        .map((r) => r.trim())
                        .filter(Boolean);
                    });
                });

                let unique = [];

                splitSkills.forEach((skill) => {
                  const idx = unique.findIndex(
                    (u) => similarity(u, skill) >= 0.85
                  );

                  if (idx === -1) unique.push(skill);
                  else if (skill.length > unique[idx].length) unique[idx] = skill;
                });

                unique = unique.filter((skill, i) =>
                  !unique.some(
                    (other, j) =>
                      i !== j &&
                      other.toLowerCase().includes(skill.toLowerCase()) &&
                      other.length > skill.length
                  )
                );

                return unique.map((skill, index) => (
                  <span
                    key={index}
                    className="
            px-3 py-1 text-sm rounded-full
            bg-gradient-to-r from-slate-200 to-slate-300
            border border-slate-300 text-gray-800
            shadow-sm transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-md
            dark:from-slate-700 dark:to-slate-600
            dark:text-gray-100 dark:border-slate-600
          "
                  >
                    {skill}
                  </span>
                ));
              })()}
            </div>
          </div>

        </div>

        {/* Full Job Description (✅ FIXED) */}
        <div className="p-6 flex flex-col gap-4 border-b border-gray-200">
          <h1 className="text-xl font-bold dark:text-gray-100">
            Full Job Description
          </h1>

          <div
            className="
    prose prose-sm max-w-none
    dark:prose-invert
    text-gray-800
    dark:text-gray-200
    prose-headings:text-gray-900
    dark:prose-headings:text-gray-100
    prose-p:text-gray-700
    dark:prose-p:text-gray-200
    [&_ul]:list-disc [&_ul]:ml-6
    [&_ol]:list-decimal [&_ol]:ml-6
    [&_li]:ml-1 [&_li]:mb-1
    prose-li:text-gray-700
    dark:prose-li:text-gray-200
    [&_*]:dark:!text-gray-200
    [&_strong]:dark:!text-gray-100
    [&_h1]:dark:!text-gray-100
    [&_h2]:dark:!text-gray-100
    [&_h3]:dark:!text-gray-100
    [&_h4]:dark:!text-gray-100
    [&_a]:dark:!text-blue-400
    [&_ul_ul]:list-[circle]
    [&_ul_ul_ul]:list-[square]
    [&_ol_ol]:list-[lower-alpha]
    [&_ol_ol_ol]:list-[lower-roman]
    [&_ol[type='a']]:list-[lower-alpha]
    [&_ol[type='A']]:list-[upper-alpha]
    [&_ol[type='i']]:list-[lower-roman]
    [&_ol[type='I']]:list-[upper-roman]
  "
            dangerouslySetInnerHTML={{
              __html: selectedJob?.jobDetails?.details
                ? DOMPurify.sanitize(selectedJob.jobDetails.details)
                : "<p>No description provided.</p>",
            }}
          />
        </div>


        {/* Benefits */}
        <div className="p-6 flex flex-col gap-3 border-b border-gray-200">
          <h1 className="text-xl font-bold dark:text-gray-100">
            Benifits
          </h1>

          <ul className="ml-6 list-disc text-sm text-gray-600 dark:text-gray-100 space-y-1">
            {selectedJob?.jobDetails?.benefits?.map((benifit, index) => (
              <li key={index}>{benifit}</li>
            ))}
          </ul>
        </div>

        {/* Qualifications */}
        <div className="p-6 flex flex-col gap-3 border-b border-gray-200">
          <h1 className="text-xl font-bold dark:text-gray-200">
            Qualifications
          </h1>

          <ul className="ml-6 list-disc text-sm text-gray-600 dark:text-gray-100 space-y-1">
            {selectedJob?.jobDetails?.qualifications?.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>
        </div>

        {/* Report Button */}
        <div className="p-6 flex justify-end">
          <button
            className="flex items-center gap-2 bg-gray-400 px-4 py-2 rounded-lg font-semibold cursor-pointer dark:bg-white dark:text-gray-900 disabled:opacity-50"
            onClick={() => navigate(`/report-job`)}
            disabled={!user}
          >
            <BsFlagFill />
            Report Job
          </button>
        </div>
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
    </>
  );
};

export default JobMajorDetails;