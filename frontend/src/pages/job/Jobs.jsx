// import React, { useState, useEffect } from "react";
// import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
// import FilterCard from "./FilterCard";
// import Job from "./Job";
// import { useJobDetails } from "@/context/JobDetailsContext";

// const Jobs = () => {
//   const { jobs, error } = useJobDetails(); // Access jobs and error from the context
//   const [isLoading, setIsLoading] = useState(true); // State to track loading
//   const [currentPage, setCurrentPage] = useState(1); // Track current page
//   const jobsPerPage = 24; // Number of jobs to display per page

//   useEffect(() => {
//     if (jobs || error) {
//       // Set loading to false once jobs are fetched or if there's an error
//       setIsLoading(false);
//     }
//   }, [jobs, error]);

//   // Calculate indexes for pagination
//   const indexOfLastJob = currentPage * jobsPerPage;
//   const indexOfFirstJob = indexOfLastJob - jobsPerPage;
//   const currentJobs = jobs?.slice(indexOfFirstJob, indexOfLastJob);

//   const totalPages = Math.ceil(jobs?.length / jobsPerPage);

//   // Pagination handlers
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="w-full mx-auto bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100">
//         <div className="flex gap-2">
//           {/* Filter Section */}
//           <div className="w-1/6 px-4">
//             <div className="sticky top-20">
//               {" "}
//               {/* Makes the filter section sticky */}
//               <FilterCard />
//             </div>
//           </div>

//           {/* Jobs Section */}
//           <div className="flex-1 pb-5 mt-5 px-2">
//             {isLoading ? ( // Show spinner while loading
//               <div className="flex justify-center items-center h-40">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
//               </div>
//             ) : currentJobs?.length > 0 ? ( // Show jobs if available
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {currentJobs.map((job) => (
//                     <div key={job._id}>
//                       <Job job={job} />
//                     </div>
//                   ))}
//                 </div>
//                 {/* Pagination Controls */}
//                 <div className="flex justify-between items-center mt-6">
//                   <button
//                     onClick={handlePreviousPage}
//                     disabled={currentPage === 1}
//                     className={`px-4 py-2 rounded ${
//                       currentPage === 1
//                         ? "bg-gray-300 cursor-not-allowed"
//                         : "bg-blue-500 text-white hover:bg-blue-600"
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   <span className="text-gray-600 font-medium">
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <button
//                     onClick={handleNextPage}
//                     disabled={currentPage === totalPages}
//                     className={`px-4 py-2 rounded ${
//                       currentPage === totalPages
//                         ? "bg-gray-300 cursor-not-allowed"
//                         : "bg-blue-500 text-white hover:bg-blue-600"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </>
//             ) : (
//               // Show "Job not found" if no jobs
//               <div className="flex justify-center items-center h-40">
//                 <span className="text-gray-500">Job not found</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Jobs;

import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useJobDetails } from "@/context/JobDetailsContext";

const Jobs = () => {
  const { jobs, error } = useJobDetails();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 24;

  const [filters, setFilters] = useState({
    Location: "",
    Industry: "",
    Salary: 5000000, // Default maximum salary
  });

  useEffect(() => {
    if (jobs || error) {
      setIsLoading(false);
    }
  }, [jobs, error]);

  // Filter jobs based on selected filters
  const filteredJobs = jobs?.filter((job) => {
    return (
      (filters.Location ? job.location === filters.Location : true) &&
      (filters.Industry ? job.industry === filters.Industry : true) &&
      (filters.Salary ? job.salary <= filters.Salary : true)
    );
  });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs?.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs?.length / jobsPerPage);

  return (
    <div>
      <Navbar />
      <div className="w-full mx-auto bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100">
        <div className="flex gap-2">
          {/* Filter Section */}
          <div className="w-1/6 px-4">
            <div className="sticky top-20">
              <FilterCard filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* Jobs Section */}
          <div className="flex-1 pb-5 mt-5 px-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
              </div>
            ) : currentJobs?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentJobs.map((job) => (
                    <div key={job._id}>
                      <Job job={job} />
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-40">
                <span className="text-gray-500">Job not found</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;


