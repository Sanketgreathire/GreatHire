// import React, { useEffect, useState } from "react";



// const JobsFeed = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch(
//           "https://jsearch.p.rapidapi.com/search?query=remote&country=in&page=1&num_pages=1",
//           {
//             method: "GET",
//             headers: {
//               "X-RapidAPI-Key": "48351cbc58msh79a8400ddeb5ed6p18e0dejsn866ac6ac54a2",
//               "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
//             },
//           }
//         );

//         const data = await response.json();
//         console.log("Jobs fetched:", data);

//         if (response.ok && data.data && data.data.length > 0) {
//           setJobs(data.data.slice(0, 6)); // Limit to 6 jobs
//         } else {
//           console.error("API Error:", data);
//         }
//       } catch (error) {
//         console.error("Network Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   return  (
//     <div className="overflow-x-hidden">
//     <div className="flex w-max animate-loop-scroll pause-on-hover gap-4">
//       {/* Duplicate the job list to allow seamless looping */}
//       {[...jobs, ...jobs].map((job, index) => (
//         <div
//           key={index}
//           className="min-w-[300px] max-w-[300px] bg-white border rounded-lg shadow-md p-4 flex flex-col justify-between"
//         >
//           <div>
//             <h3 className="text-lg font-semibold line-clamp-2 h-14">{job.job_title}</h3>
//             <p className="text-sm text-gray-600 mt-1 line-clamp-1">
//               <strong>Employer:</strong> {job.employer_name || "Not provided"}
//             </p>
//             <p className="text-sm text-gray-600 line-clamp-1">
//               <strong>Location:</strong> {job.job_location || "Not specified"}
//             </p>
//             <p className="text-sm text-gray-600 line-clamp-1">
//               <strong>Type:</strong> {job.job_employment_type || "Not specified"}
//             </p>
//             <p className="text-sm text-gray-600 line-clamp-1">
//               <strong>Posted:</strong> {job.job_posted_at || "Unknown"}
//             </p>
//           </div>
//           <a
//             href={job.job_apply_link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="w-fit mt-4 inline-block px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
//           >
//             View Job
//           </a>
//         </div>
//       ))}
//     </div>
//   </div>
  
//       );
      
// };

// export default JobsFeed;


// // import React, { useEffect, useState } from "react";

// // const JobsFeed = () => {
// //   const [jobs, setJobs] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchJobs = async () => {
// //       try {
// //         const response = await fetch("https://jsearch.p.rapidapi.com/search", {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             "X-RapidAPI-Key": "48351cbc58msh79a8400ddeb5ed6p18e0dejsn866ac6ac54a2",
// //           },
// //           body: JSON.stringify({
// //             page: 1,
// //             limit: 6,
// //             country: "US",
// //             language: "en",
// //           }),
// //         });

// //         const data = await response.json();
// //         console.log("Jobs fetched:", data);

// //         if (response.ok && data.data) {
// //           setJobs(data.data);
// //         } else {
// //           console.error("API Error:", JSON.stringify(data, null, 2));
// //         }
// //       } catch (error) {
// //         console.error("Network Error:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchJobs();
// //   }, []);

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-xl font-bold mb-4">Latest Remote Job Openings</h2>
// //       {loading ? (
// //         <p>Loading jobs...</p>
// //       ) : (
// //         <ul className="space-y-4">
// //           {jobs.map((job, index) => (
// //             <li key={index} className="p-4 border rounded shadow">
// //               <h3 className="text-lg font-semibold">{job.job_title}</h3>
// //               <p className="text-sm text-gray-600">
// //                 <strong>Employer:</strong> {job.employer_name || "Not provided"}<br />
// //                 <strong>Location:</strong> {job.job_location || "Not specified"}<br />
// //                 <strong>Employment Type:</strong> {job.job_employment_type || "Not specified"}<br />
// //                 <strong>Posted:</strong> {job.job_posted_at || "Unknown"}<br />
// //               </p>
// //               <p className="mt-2">{job.job_description || "No job description available."}</p>
// //               <h4 className="mt-4 font-semibold">Job Highlights:</h4>
// //               {/* Check if job_highlights is an array before mapping */}
// //               <ul className="list-disc pl-5">
// //                 {Array.isArray(job.job_highlights) && job.job_highlights.length > 0 ? (
// //                   job.job_highlights.map((highlight, idx) => (
// //                     <li key={idx}>{highlight}</li>
// //                   ))
// //                 ) : (
// //                   <li>No highlights available</li>
// //                 )}
// //               </ul>
// //               {job.job_salary && (
// //                 <p className="mt-2">
// //                   <strong>Salary:</strong> {job.job_salary}
// //                 </p>
// //               )}
// //               <a
// //                 href={job.job_apply_link}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="text-blue-500 hover:underline mt-2 block"
// //               >
// //                 Apply Now
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default JobsFeed;










// // import React, { useEffect, useState } from "react";

// // const JobsFeed = () => {
// //   const [jobs, setJobs] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchJobs = async () => {
// //       try {
// //         const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2l6cXVyZXNoaTIwMDJAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMTFUMDc6Mjc6MDguMjUwMzQyKzAwOjAwIn0.bH-FWPrYhH4mnFIQqidOirhQMr0_KEfxvGnQi0nsihk", // replace with real token
// //           },
// //           body: JSON.stringify({
// //             page: 1,
// //             limit: 6,
// //             posted_at_gte: "2025-01-01", // Example filter: jobs posted after Jan 1, 2025
// //             "job_country_code_or": ["IN", "US"]
// //           })
// //         });
    
// //         const data = await response.json();
// //         console.log("Jobs fetched:", data);
    
// //         if (response.ok && data.data && data.data.length > 0) {
// //           setJobs(data.data); // Update with correct data structure
// //         } else {
// //           console.error("API Error:", JSON.stringify(data, null, 2));
// //         }
// //       } catch (error) {
// //         console.error("Network Error:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
    
    

// //     fetchJobs();
// //   },
// //    []);

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-xl font-bold mb-4">Latest Remote Job Openings</h2>
// //       {loading ? (
// //         <p>Loading jobs...</p>
// //       ) : (
// //         <ul className="space-y-4">
// //           {jobs.map((job, index) => (
// //             <li key={index} className="p-4 border rounded shadow">
// //               <h3 className="text-lg font-semibold">{job.job_title}</h3>
// //               <p className="text-sm text-gray-600">
// //                 {job.company_name} — {job.job_location || "Remote"}
// //               </p>
// //               <a
// //                 href={job.final_url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="text-blue-500 hover:underline"
// //               >
// //                 View Job
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default JobsFeed;

// // import React, { useEffect, useState } from "react";

// // const JobsFeed = () => {
// //   const [jobs, setJobs] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchJobs = async () => {
// //       try {
// //         const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2l6cXVyZXNoaTIwMDJAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMTFUMDc6Mjc6MDguMjUwMzQyKzAwOjAwIn0.bH-FWPrYhH4mnFIQqidOirhQMr0_KEfxvGnQi0nsihk", // replace with real token
// //           },
// //           body: JSON.stringify({
// //             page: 1,
// //             limit: 6,
// //             posted_at_gte: "2025-01-01", // Example filter: jobs posted after Jan 1, 2025
// //             "job_country_code_or": ["IN", "US"]
// //           })
// //         });

// //         const data = await response.json();
// //         console.log("Jobs fetched:", data);

// //         if (response.ok && data.data && data.data.length > 0) {
// //           // Filter out jobs with no valid final_url
// //           const validJobs = data.data.filter((job) => job.final_url);
// //           setJobs(validJobs); // Update with filtered jobs
// //         } else {
// //           console.error("API Error:", JSON.stringify(data, null, 2));
// //         }
// //       } catch (error) {
// //         console.error("Network Error:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchJobs();
// //   }, []);

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-xl font-bold mb-4">Latest Remote Job Openings</h2>
// //       {loading ? (
// //         <p>Loading jobs...</p>
// //       ) : (
// //         <ul className="space-y-4">
// //           {jobs.map((job, index) => (
// //             <li key={index} className="p-4 border rounded shadow">
// //               <h3 className="text-lg font-semibold">{job.job_title}</h3>
// //               <p className="text-sm text-gray-600">
// //                 {job.company_name} — {job.job_location || "Remote"}
// //               </p>
// //               <a
// //                 href={job.final_url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="text-blue-500 hover:underline"
// //               >
// //                 View Job
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default JobsFeed;


// // import React, { useEffect, useState } from "react";

// // const JobsFeed = () => {
// //   const [jobs, setJobs] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchJobs = async () => {
// //       try {
// //         const response = await fetch("https://api.theirstack.com/v1/jobs/search", {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2l6cXVyZXNoaTIwMDJAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOiJ1c2VyIiwiY3JlYXRlZF9hdCI6IjIwMjUtMDQtMTFUMDc6Mjc6MDguMjUwMzQyKzAwOjAwIn0.bH-FWPrYhH4mnFIQqidOirhQMr0_KEfxvGnQi0nsihk", // replace with real token
// //           },
// //           body: JSON.stringify({
// //             page: 1,
// //             limit: 6,
// //             posted_at_gte: "2025-01-01", // Example filter: jobs posted after Jan 1, 2025
// //             "job_country_code_or": ["IN"]
// //           })
// //         });

// //         const data = await response.json();
// //         console.log("Jobs fetched:", data);

// //         if (response.ok && data.data && data.data.length > 0) {
// //           // Filter out jobs with no valid final_url and take the first 6 valid jobs
// //           const validJobs = data.data.filter((job) => job.final_url).slice(0, 6);
// //           setJobs(validJobs); // Update with filtered jobs (only jobs with final_url)
// //         } else {
// //           console.error("API Error:", JSON.stringify(data, null, 2));
// //         }
// //       } catch (error) {
// //         console.error("Network Error:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchJobs();
// //   }, []);

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-xl font-bold mb-4">Latest Remote Job Openings</h2>
// //       {loading ? (
// //         <p>Loading jobs...</p>
// //       ) : (
// //         <ul className="space-y-4">
// //           {jobs.map((job, index) => (
// //             <li key={index} className="p-4 border rounded shadow">
// //               <h3 className="text-lg font-semibold">{job.job_title}</h3>
// //               <p className="text-sm text-gray-600">
// //                 {job.company_name} — {job.job_location || "Remote"}
// //               </p>
// //               <a
// //                 href={job.final_url}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="text-blue-500 hover:underline"
// //               >
// //                 View Job
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default JobsFeed;

// // import React, { useState, useEffect } from 'react';

// // const JobsFeed = () => {
// //   const [jobs, setJobs] = useState([]);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     // Fetch data from the backend endpoint
// //     fetch("http://localhost:8000/api/adzuna/jobs")
// //       .then((response) => response.json())
// //       .then((data) => {
// //         setJobs(data);  // Store the fetched data in state
// //       })
// //       .catch((error) => {
// //         console.error("Error:", error);
// //         setError("Failed to load job data.");
// //       });
// //   }, []); // Empty dependency array ensures it runs only once when the component mounts

// //   return (
// //     <div>
// //       <h1>Job Listings</h1>
// //       {error && <p>{error}</p>}
// //       <ul>
// //         {jobs.length > 0 ? (
// //           jobs.map((job, index) => (
// //             <li key={index}>
// //               <h3>{job.title}</h3>
// //               <p>{job.location}</p>
// //               <a href={job.url} target="_blank" rel="noopener noreferrer">View Job</a>
// //             </li>
// //           ))
// //         ) : (
// //           <p>Loading jobs...</p>
// //         )}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default JobsFeed;
