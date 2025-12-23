import React, { useEffect, useState } from "react";

const AfterLoginHome = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // API se jobs fetch karna (backend ka endpoint lagana)
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>

      {/* Search Bar */}
      <div className="mt-6 bg-white shadow p-4 rounded-xl flex items-center gap-4">
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full p-3 border rounded-lg"
        />
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
          Search
        </button>
      </div>

      {/* Jobs List */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 shadow rounded-xl hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600 mt-2">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>

              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
                Apply
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Loading jobs...</p>
        )}
      </div>
    </div>
  );
};

export default AfterLoginHome;
