import React, { useEffect, useState } from "react";

const JobsFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Fetching the jobs from the API
        const response = await fetch("https://www.arbeitnow.com/api/job-board-api?remote=true");
        const data = await response.json();

        // Manually limiting to 6 jobs from the fetched data
        const slicedJobs = data.data.slice(0, 6); // Limit to 6 jobs
        setJobs(slicedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Latest Job Openings</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li key={index} className="p-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600">
                {job.company_name} — {job.location}
              </p>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Job
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobsFeed;
