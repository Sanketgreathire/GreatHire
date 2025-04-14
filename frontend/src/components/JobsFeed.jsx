// import React, { useEffect, useState } from "react";

// const JobsFeed = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2l6cXVyZXNoaTIwMDJAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMTFUMDc6Mjc6MDguMjUwMzQyKzAwOjAwIn0.bH-FWPrYhH4mnFIQqidOirhQMr0_KEfxvGnQi0nsihk", // replace with real token
//           },
//           body: JSON.stringify({
//             page: 1,
//             limit: 6,
//             posted_at_gte: "2025-01-01", // Example filter: jobs posted after Jan 1, 2025
//             "job_country_code_or": ["IN", "US"]
//           })
//         });
    
//         const data = await response.json();
//         console.log("Jobs fetched:", data);
    
//         if (response.ok && data.data && data.data.length > 0) {
//           setJobs(data.data); // Update with correct data structure
//         } else {
//           console.error("API Error:", JSON.stringify(data, null, 2));
//         }
//       } catch (error) {
//         console.error("Network Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
    

//     fetchJobs();
//   },
//    []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Latest Remote Job Openings</h2>
//       {loading ? (
//         <p>Loading jobs...</p>
//       ) : (
//         <ul className="space-y-4">
//           {jobs.map((job, index) => (
//             <li key={index} className="p-4 border rounded shadow">
//               <h3 className="text-lg font-semibold">{job.job_title}</h3>
//               <p className="text-sm text-gray-600">
//                 {job.company_name} — {job.job_location || "Remote"}
//               </p>
//               <a
//                 href={job.final_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:underline"
//               >
//                 View Job
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default JobsFeed;

// import React, { useEffect, useState } from "react";

// const JobsFeed = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2l6cXVyZXNoaTIwMDJAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMTFUMDc6Mjc6MDguMjUwMzQyKzAwOjAwIn0.bH-FWPrYhH4mnFIQqidOirhQMr0_KEfxvGnQi0nsihk", // replace with real token
//           },
//           body: JSON.stringify({
//             page: 1,
//             limit: 6,
//             posted_at_gte: "2025-01-01", // Example filter: jobs posted after Jan 1, 2025
//             "job_country_code_or": ["IN", "US"]
//           })
//         });

//         const data = await response.json();
//         console.log("Jobs fetched:", data);

//         if (response.ok && data.data && data.data.length > 0) {
//           // Filter out jobs with no valid final_url
//           const validJobs = data.data.filter((job) => job.final_url);
//           setJobs(validJobs); // Update with filtered jobs
//         } else {
//           console.error("API Error:", JSON.stringify(data, null, 2));
//         }
//       } catch (error) {
//         console.error("Network Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Latest Remote Job Openings</h2>
//       {loading ? (
//         <p>Loading jobs...</p>
//       ) : (
//         <ul className="space-y-4">
//           {jobs.map((job, index) => (
//             <li key={index} className="p-4 border rounded shadow">
//               <h3 className="text-lg font-semibold">{job.job_title}</h3>
//               <p className="text-sm text-gray-600">
//                 {job.company_name} — {job.job_location || "Remote"}
//               </p>
//               <a
//                 href={job.final_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:underline"
//               >
//                 View Job
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default JobsFeed;


// import React, { useEffect, useState } from "react";

// const JobsFeed = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2l6cXVyZXNoaTIwMDJAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMTFUMDc6Mjc6MDguMjUwMzQyKzAwOjAwIn0.bH-FWPrYhH4mnFIQqidOirhQMr0_KEfxvGnQi0nsihk", // replace with real token
//           },
//           body: JSON.stringify({
//             page: 1,
//             limit: 6,
//             posted_at_gte: "2025-01-01", // Example filter: jobs posted after Jan 1, 2025
//             "job_country_code_or": ["IN"]
//           })
//         });

//         const data = await response.json();
//         console.log("Jobs fetched:", data);

//         if (response.ok && data.data && data.data.length > 0) {
//           // Filter out jobs with no valid final_url and take the first 6 valid jobs
//           const validJobs = data.data.filter((job) => job.final_url).slice(0, 6);
//           setJobs(validJobs); // Update with filtered jobs (only jobs with final_url)
//         } else {
//           console.error("API Error:", JSON.stringify(data, null, 2));
//         }
//       } catch (error) {
//         console.error("Network Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Latest Remote Job Openings</h2>
//       {loading ? (
//         <p>Loading jobs...</p>
//       ) : (
//         <ul className="space-y-4">
//           {jobs.map((job, index) => (
//             <li key={index} className="p-4 border rounded shadow">
//               <h3 className="text-lg font-semibold">{job.job_title}</h3>
//               <p className="text-sm text-gray-600">
//                 {job.company_name} — {job.job_location || "Remote"}
//               </p>
//               <a
//                 href={job.final_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:underline"
//               >
//                 View Job
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default JobsFeed;

// import React, { useState, useEffect } from 'react';

// const JobsFeed = () => {
//   const [jobs, setJobs] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch data from the backend endpoint
//     fetch("http://localhost:8000/api/adzuna/jobs")
//       .then((response) => response.json())
//       .then((data) => {
//         setJobs(data);  // Store the fetched data in state
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setError("Failed to load job data.");
//       });
//   }, []); // Empty dependency array ensures it runs only once when the component mounts

//   return (
//     <div>
//       <h1>Job Listings</h1>
//       {error && <p>{error}</p>}
//       <ul>
//         {jobs.length > 0 ? (
//           jobs.map((job, index) => (
//             <li key={index}>
//               <h3>{job.title}</h3>
//               <p>{job.location}</p>
//               <a href={job.url} target="_blank" rel="noopener noreferrer">View Job</a>
//             </li>
//           ))
//         ) : (
//           <p>Loading jobs...</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default JobsFeed;
