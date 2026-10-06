import { useEffect } from "react";
import JobsForYou from "./JobsForYou.jsx";
import { useJobDetails } from "@/context/JobDetailsContext";
import { Helmet } from "react-helmet-async";

const LatestJobs = ({ jobs = [] }) => {
  console.log("LatestJobs jobs:", jobs);
  console.log("LatestJobs jobs count:", jobs.length);
  
  const { setSelectedJob } = useJobDetails();

  // ✅ FIX: Initial load par auto-selection ko null set kar rahe hain taaki grid view render ho
  useEffect(() => {
    setSelectedJob(null);
  }, [jobs, setSelectedJob]);

  return (
    <>
      <Helmet>
        <title>Latest Job Openings and New Hiring Opportunities | GreatHire</title>
        <meta
          name="description"
          content="Check out the current and trending job listings on GreatHire and get the edge on other job seekers today, Hyderabad State, India, with the very latest job listings offered by trusted employers."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto my-4 dark:text-gray-100 ">
        {/* Section Title */}
        <h1 id="job-openings-heading" className="ml-2 sm:ml-4 lg:ml-14 font-bold lg:tracking-wide text-2xl sm:text-3xl lg:text-4xl dark:text-gray-100">
          <span className="text-[#384ac2] lg:tracking-wider">
            Latest&nbsp;&amp;&nbsp;Top
          </span>
          &nbsp;Job&nbsp;Openings
        </h1>

        {jobs.length === 0 ? (
          /* Display message if no jobs are available */
          <div className="text-center text-gray-500 mt-24 mb-20 dark:gray-100">
            <p className="text-xl font-semibold text-gray-700 dark:gray-100">Uh Oh!</p>
            <p className="text-lg dark:gray-100">Currently No Jobs Available</p>
          </div>
        ) : (
          /* Render job listings when jobs are available */
          <JobsForYou jobs={jobs} />
        )}
      </div>
    </>
  );
};

export default LatestJobs;