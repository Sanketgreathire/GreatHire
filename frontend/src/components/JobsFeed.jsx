import React, { useEffect, useState } from "react";

const JobsFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2l6cXVyZXNoaTIwMDJAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMTFUMDc6Mjc6MDguMjUwMzQyKzAwOjAwIn0.bH-FWPrYhH4mnFIQqidOirhQMr0_KEfxvGnQi0nsihk", // replace with real token
          },
          body: JSON.stringify({
            // query: "developer",
            page: 1,
            limit: 6,
          })
          
        });
    
        const data = await response.json();
        console.log("Jobs fetched:", data);
    
        if (response.ok && data.jobs) {
          setJobs(data.jobs); // ✅ sets jobs to be shown
        } else {
          console.error("API Error:", data);
        }
      } catch (error) {
        console.error("Network Error:", error);
      } finally {
        setLoading(false); // ✅ ensures loading message disappears
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Latest Remote Job Openings</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li key={index} className="p-4 border rounded shadow">
              <h3 className="text-lg font-semibold">{job.job_title}</h3>
              <p className="text-sm text-gray-600">
                {job.company_name} — {job.job_location || "Remote"}
              </p>
              <a
                href={job.final_url}
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
