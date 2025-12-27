import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
import { FiFilter } from "react-icons/fi";

import FilterCard from "@/pages/job/FilterCard";
import LatestJobs from "./LatestJobs";
import JobSearch from "@/pages/job/JobSearch";
import { useJobDetails } from "@/context/JobDetailsContext";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const Jobs = () => {
  const { jobs, resetFilter, error } = useJobDetails();

  // ========== STATE MANAGEMENT ==========
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter & Search state
  const [filters, setFilters] = useState({
    jobTitle: "",
    location: "",
    jobType: [],
    workPlace: [],
    company: "",
    datePosted: [],
  });

  const [searchInfo, setSearchInfo] = useState({
    titleKeyword: "",
    location: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // ========== INITIALIZATION ==========
  useEffect(() => {
    resetFilter?.();
  }, []);

  // ========== SEARCH UPDATE HANDLER ==========
  const handleSearchUpdate = (updates) => {
    setSearchInfo((prev) => ({
      ...prev,
      ...updates,
    }));

    // filter update by search
    setFilters((prev) => ({
      ...prev,
      jobTitle: updates.titleKeyword !== undefined ? updates.titleKeyword : prev.jobTitle,
      location: updates.location !== undefined ? updates.location : prev.location,
    }));

    setCurrentPage(1); // Page reset 
  };

  // ========== MAIN FILTERING LOGIC ==========
  // when jobs or filters change → apply filtering
  useEffect(() => {
    if (!jobs) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    // ✅ STEP 1: Apply all filters
    const filteredJobs = jobs.filter((job) => {

      // Filter 1: Location
      if (filters.location) {
        const jobLocation = (job?.jobDetails?.location || job?.location || "").toLowerCase();
        if (!jobLocation.includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Filter 2: Job Title
      if (filters.jobTitle) {
        const jobTitle = (job?.jobDetails?.title || job?.job_title || "").toLowerCase();
        if (!jobTitle.includes(filters.jobTitle.toLowerCase())) {
          return false;
        }
      }

      // Filter 3: Job Type (checkbox - multiple selection)
      if (Array.isArray(filters.jobType) && filters.jobType.length > 0) {
        const jobType = (job?.jobDetails?.jobType || "").toLowerCase();
        const matchesType = filters.jobType.some((type) =>
          jobType.includes(type.toLowerCase())
        );
        if (!matchesType) {
          return false;
        }
      }

      // Filter 4: Workplace Flexibility (checkbox - multiple selection)
      if (Array.isArray(filters.workPlace) && filters.workPlace.length > 0) {
        const workPlace = (job?.jobDetails?.workPlaceFlexibility || "").toLowerCase();
        const matchesWorkPlace = filters.workPlace.some((wp) =>
          workPlace.includes(wp.toLowerCase())
        );
        if (!matchesWorkPlace) {
          return false;
        }
      }

      // Filter 5: Company
      if (filters.company) {
        const company = (
          job?.jobDetails?.companyName ||
          job?.jobDetails?.company ||
          job?.employer_name ||
          job?.company ||
          ""
        ).toLowerCase();
        if (!company.includes(filters.company.toLowerCase())) {
          return false;
        }
      }

      // Filter 6: Date Posted (checkbox - multiple selection)
      if (Array.isArray(filters.datePosted) && filters.datePosted.length > 0) {
        const dateStr =
          job?.jobDetails?.datePosted ||
          job?.createdAt ||
          job?.jobDetails?.createdAt ||
          job?.postedAt ||
          job?.job_posted_at ||
          null;

        const jobDate = dateStr ? new Date(dateStr) : null;
        if (!jobDate || isNaN(jobDate)) {
          return false;
        }

        const today = new Date();
        const matchesDateFilter = filters.datePosted.some((selectedDate) => {
          let daysLimit = 0;

          switch (selectedDate) {
            case "Last 24 hours":
              daysLimit = 1;
              break;
            case "Last 7 days":
              daysLimit = 7;
              break;
            case "Last 15 days":
              daysLimit = 15;
              break;
            case "Past Month":
              daysLimit = 30;
              break;
            default:
              daysLimit = 0;
          }

          const diffDays = (today - jobDate) / (1000 * 60 * 60 * 24);
          return diffDays <= daysLimit;
        });

        if (!matchesDateFilter) {
          return false;
        }
      }

      return true; // all filters pass 
    });

    // ✅ STEP 2: Reset page when filter apply
    setCurrentPage(1);

  }, [jobs, filters, error]);

  // ========== PAGINATION CALCULATION ==========
  // Filtered jobs - paginate after filtering
  const getDisplayedJobs = () => {
    if (!jobs) return [];

    // Apply filters again to get the filtered jobs
    const filteredJobs = jobs.filter((job) => {
      if (filters.location) {
        const jobLocation = (job?.jobDetails?.location || job?.location || "").toLowerCase();
        if (!jobLocation.includes(filters.location.toLowerCase())) return false;
      }

      if (filters.jobTitle) {
        const jobTitle = (job?.jobDetails?.title || job?.job_title || "").toLowerCase();
        if (!jobTitle.includes(filters.jobTitle.toLowerCase())) return false;
      }

      if (Array.isArray(filters.jobType) && filters.jobType.length > 0) {
        const jobType = (job?.jobDetails?.jobType || "").toLowerCase();
        const matchesType = filters.jobType.some((type) =>
          jobType.includes(type.toLowerCase())
        );
        if (!matchesType) return false;
      }

      if (Array.isArray(filters.workPlace) && filters.workPlace.length > 0) {
        const workPlace = (job?.jobDetails?.workPlaceFlexibility || "").toLowerCase();
        const matchesWorkPlace = filters.workPlace.some((wp) =>
          workPlace.includes(wp.toLowerCase())
        );
        if (!matchesWorkPlace) return false;
      }

      if (filters.company) {
        const company = (
          job?.jobDetails?.companyName ||
          job?.jobDetails?.company ||
          job?.employer_name ||
          job?.company ||
          ""
        ).toLowerCase();
        if (!company.includes(filters.company.toLowerCase())) return false;
      }

      if (Array.isArray(filters.datePosted) && filters.datePosted.length > 0) {
        const dateStr =
          job?.jobDetails?.datePosted ||
          job?.createdAt ||
          job?.jobDetails?.createdAt ||
          job?.postedAt ||
          job?.job_posted_at ||
          null;

        const jobDate = dateStr ? new Date(dateStr) : null;
        if (!jobDate || isNaN(jobDate)) return false;

        const today = new Date();
        const matchesDateFilter = filters.datePosted.some((selectedDate) => {
          let daysLimit = 0;
          switch (selectedDate) {
            case "Last 24 hours":
              daysLimit = 1;
              break;
            case "Last 7 days":
              daysLimit = 7;
              break;
            case "Last 15 days":
              daysLimit = 15;
              break;
            case "Past Month":
              daysLimit = 30;
              break;
            default:
              daysLimit = 0;
          }
          const diffDays = (today - jobDate) / (1000 * 60 * 60 * 24);
          return diffDays <= daysLimit;
        });

        if (!matchesDateFilter) return false;
      }

      return true;
    });

    // Paginate the filtered jobs
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;

    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  };

  const getTotalFilteredCount = () => {
    if (!jobs) return 0;

    return jobs.filter((job) => {
      if (filters.location) {
        const jobLocation = (job?.jobDetails?.location || job?.location || "").toLowerCase();
        if (!jobLocation.includes(filters.location.toLowerCase())) return false;
      }

      if (filters.jobTitle) {
        const jobTitle = (job?.jobDetails?.title || job?.job_title || "").toLowerCase();
        if (!jobTitle.includes(filters.jobTitle.toLowerCase())) return false;
      }

      if (Array.isArray(filters.jobType) && filters.jobType.length > 0) {
        const jobType = (job?.jobDetails?.jobType || "").toLowerCase();
        const matchesType = filters.jobType.some((type) =>
          jobType.includes(type.toLowerCase())
        );
        if (!matchesType) return false;
      }

      if (Array.isArray(filters.workPlace) && filters.workPlace.length > 0) {
        const workPlace = (job?.jobDetails?.workPlaceFlexibility || "").toLowerCase();
        const matchesWorkPlace = filters.workPlace.some((wp) =>
          workPlace.includes(wp.toLowerCase())
        );
        if (!matchesWorkPlace) return false;
      }

      if (filters.company) {
        const company = (
          job?.jobDetails?.companyName ||
          job?.jobDetails?.company ||
          job?.employer_name ||
          job?.company ||
          ""
        ).toLowerCase();
        if (!company.includes(filters.company.toLowerCase())) return false;
      }

      if (Array.isArray(filters.datePosted) && filters.datePosted.length > 0) {
        const dateStr =
          job?.jobDetails?.datePosted ||
          job?.createdAt ||
          job?.jobDetails?.createdAt ||
          job?.postedAt ||
          job?.job_posted_at ||
          null;

        const jobDate = dateStr ? new Date(dateStr) : null;
        if (!jobDate || isNaN(jobDate)) return false;

        const today = new Date();
        const matchesDateFilter = filters.datePosted.some((selectedDate) => {
          let daysLimit = 0;
          switch (selectedDate) {
            case "Last 24 hours":
              daysLimit = 1;
              break;
            case "Last 7 days":
              daysLimit = 7;
              break;
            case "Last 15 days":
              daysLimit = 15;
              break;
            case "Past Month":
              daysLimit = 30;
              break;
            default:
              daysLimit = 0;
          }
          const diffDays = (today - jobDate) / (1000 * 60 * 60 * 24);
          return diffDays <= daysLimit;
        });

        if (!matchesDateFilter) return false;
      }

      return true;
    }).length;
  };

  const displayedJobs = getDisplayedJobs();
  const totalFilteredJobs = getTotalFilteredCount();
  const totalPages = Math.max(1, Math.ceil(totalFilteredJobs / jobsPerPage));

  // ========== HANDLERS ==========
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      jobTitle: "",
      location: "",
      jobType: [],
      workPlace: [],
      company: "",
      datePosted: [],
    });
    setSearchInfo({
      titleKeyword: "",
      location: "",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ========== RENDER ==========
  return (

    <>

      <Helmet>
        <title>Find Latest Jobs & Hire Talent Faster | Smart Job Search – GreatHire</title>
        <meta
          name="description"
          content="Search and apply for the latest verified job openings on GreatHire using powerful filters for job title, location, company, job type, workplace flexibility, and date posted. Our advanced job search helps candidates find relevant opportunities faster while enabling employers to hire smarter and risk-free. With real-time filtering, pagination, and clean job listings, GreatHire delivers a smooth hiring experience. Based in Hyderabad State, India, GreatHire operates as a modern recruitment platform supporting job seekers and recruiters across multiple industries, cities, and career levels."
        />
      </Helmet>



      <div className="min-h-screen flex flex-col pb-4">
        <Navbar />

        {/* Hero Section */}
        <div className="pt-24 pb-3 text-center px-4 sm:px-6 lg:px-12 bg-white dark:bg-gray-800">
          <div className="flex flex-col gap-5 my-10">
            <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#0233f8] font-medium animate-bounce">
              No. 1 Job Hunt Website
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold dark:text-white">
              <span className="block">Search Job</span>
              <span className="block mt-4">
                Or Hire Staff{" "}
                <span className="text-blue-700 dark:text-blue-500">Smarter, Faster, Risk Free</span>
              </span>
            </h1>

            <div className="flex items-center justify-center gap-2">
              <div className="w-full max-w-[900px]">
                <JobSearch
                  searchInfo={searchInfo}
                  onSearchUpdate={handleSearchUpdate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Listing Section - FIXED CONTAINER */}
        <div className="w-full px-0 lg:px-0 dark:bg-gray-900">
          <div className="
  flex-grow w-full max-w-[1600px] mx-auto pt-6
  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
  dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
">

          {/* <div className="flex-grow w-full max-w-[1600px] mx-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-6 dark:bg-gray-100"> */}
          {/* <div className="flex-grow w-full max-w-full bg-gray-100 pt-6 px-0 dark:bg-gray-800"> */}
            <div className="flex">
              {/* Sidebar (Desktop only) */}
              <div className="hidden lg:block lg:w-72 lg:flex-shrink-0 lg:pl-4 dark:bg-gray-800 pb-4">
                <FilterCard
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Main area - FIXED WIDTH */}
              <div className="flex-1 min-w-0 ">
                {/* Mobile toggle */}
                <div className="flex items-center justify-between mb-4 lg:hidden px-2">
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md"
                  >
                    <FiFilter /> Filters
                  </button>
                  <div className="text-sm text-gray-600">
                    {totalFilteredJobs} jobs
                  </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                  </div>
                ) : displayedJobs.length > 0 ? (
                  <>
                    {/* ✅ Pass ONLY paginated & filtered jobs to LatestJobs */}
                    <LatestJobs jobs={displayedJobs} />

                    {/* Pagination Controls */}
                    <div className="w-full flex justify-center lg:justify-end items-center gap-4 mt-0 mb-0 px-4">
                      <button
                        className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-200 transition"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Prev
                      </button>

                      <span className="text-base sm:text-lg font-semibold text-center">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        className="px-4 py-2 border rounded disabled:opacity-40 hover:bg-gray-200 transition"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </button>
                    </div>

                  </>
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <span className="text-gray-500 text-lg">Job not found</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsFilterOpen(false)}
            ></div>

            <div className="relative bg-white w-64 sm:w-72 h-full shadow-lg transform transition-transform duration-300 translate-x-0 overflow-y-auto">
              <FilterCard
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* <Footer /> */}
      </div>
    </>
  );
};
export default Jobs;

// old code - without - search bar, latest job section with details and improved filtering & pagination
// // src/pages/job/Jobs.jsx
// import React, { useState, useEffect } from "react";
// import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
// import { Link } from "react-router-dom";
// import { FiFilter } from "react-icons/fi";

// import FilterCard from "@/pages/job/FilterCard";
// import Job from "@/pages/job/Job";
// import { useJobDetails } from "@/context/JobDetailsContext";

// const Jobs = () => {
//   const { jobs, resetFilter, error } = useJobDetails();

//   const [isLoading, setIsLoading] = useState(true);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filters, setFilters] = useState({}); // keep filter state here
//   const [isFilterOpen, setIsFilterOpen] = useState(true);

//   const jobsPerPage = 24;

//   // reset filters on mount
//   useEffect(() => {
//     resetFilter?.();
//   }, []);

//   // when jobs or filters change → apply filtering
//   useEffect(() => {
//     if (!jobs) return;

//     setIsLoading(false);

//     const parseJobSalary = (salaryStr) => {
//       if (!salaryStr) return null;
//       const nums = salaryStr.match(/\d+/g);
//       if (!nums) return null;
//       const min = parseInt(nums[0], 10);
//       const max = nums[1] ? parseInt(nums[1], 10) : min;
//       return [min, max];
//     };

//     const filtered = jobs.filter((job) => {
//       // location
//       if (filters.location) {
//         const jobLoc =
//           (job?.jobDetails?.location || job?.location || "").toLowerCase();
//         if (!jobLoc.includes(filters.location.toLowerCase())) return false;
//       }

//       // job title
//       if (filters.jobTitle) {
//         const title =
//           (job?.jobDetails?.title || job?.job_title || "").toLowerCase();
//         if (!title.includes(filters.jobTitle.toLowerCase())) return false;
//       }

//       // job type
//       if (Array.isArray(filters.jobType) && filters.jobType.length) {
//         const jobType = (job?.jobDetails?.jobType || "").toLowerCase();
//         const matchesType = filters.jobType.some((t) =>
//           jobType.includes(t.toLowerCase())
//         );
//         if (!matchesType) return false;
//       }

//       // company
//       if (filters.company) {
//         const company =
//           (job?.jobDetails?.companyName ||
//             job?.jobDetails?.company ||
//             job?.employer_name ||
//             job?.company ||
//             ""
//           ).toLowerCase();
//         if (!company.includes(filters.company.toLowerCase())) return false;
//       }

//       // workplace
//       if (Array.isArray(filters.workPlace) && filters.workPlace.length) {
//         const wp = (job?.jobDetails?.workPlaceFlexibility || "").toLowerCase();
//         const matchesWP = filters.workPlace.some((p) =>
//           wp.includes(p.toLowerCase())
//         );
//         if (!matchesWP) return false;
//       }

//       // qualification
//       if (filters.qualification) {
//         const qual =
//           (job?.jobDetails?.qualification ||
//             (Array.isArray(job?.jobDetails?.qualifications)
//               ? job.jobDetails.qualifications.join(" ")
//               : "") ||
//             ""
//           ).toLowerCase();
//         if (!qual.includes(filters.qualification.toLowerCase())) return false;
//       }

//       // date posted
//       if (Array.isArray(filters.datePosted) && filters.datePosted.length) {
//         const dateStr =
//           job?.jobDetails?.datePosted ||
//           job?.createdAt ||
//           job?.jobDetails?.createdAt ||
//           job?.postedAt ||
//           job?.job_posted_at ||
//           null;

//         const jobDate = dateStr ? new Date(dateStr) : null;
//         if (!jobDate || isNaN(jobDate)) return false;

//         const today = new Date();
//         const matchesAny = filters.datePosted.some((sel) => {
//           let daysLimit = 0;
//           switch (sel) {
//             case "Last 24 hours":
//               daysLimit = 1;
//               break;
//             case "Last 7 days":
//               daysLimit = 7;
//               break;
//             case "Last 14 days":
//               daysLimit = 14;
//               break;
//             case "Last 30 days":
//               daysLimit = 30;
//               break;
//             default:
//               daysLimit = 0;
//           }
//           const diffDays = (today - jobDate) / (1000 * 60 * 60 * 24);
//           return diffDays <= daysLimit;
//         });
//         if (!matchesAny) return false;
//       }

//       // salary
//       if (Array.isArray(filters.salary) && filters.salary.length) {
//         const jobSalaryRange = parseJobSalary(job?.jobDetails?.salary);
//         if (!jobSalaryRange) return false;
//         const [jobMin, jobMax] = jobSalaryRange;

//         const matchesSalary = filters.salary.some((selRange) => {
//           if (selRange.includes("+")) {
//             const min = parseInt(selRange.replace(/[^\d]/g, ""), 10);
//             return jobMax >= min;
//           }
//           const [minStr, maxStr] = selRange.split("-");
//           const min = parseInt(minStr, 10);
//           const max = parseInt(maxStr, 10);
//           return jobMax >= min && jobMin <= max;
//         });
//         if (!matchesSalary) return false;
//       }

//       return true;
//     });

//     setFilteredJobs(filtered);
//     setCurrentPage(1);
//   }, [jobs, filters, error]);

//   // Reset all filters
//   const resetFilters = () => {
//     setFilters({});
//   };

//   // Pagination
//   const indexOfLastJob = currentPage * jobsPerPage;
//   const indexOfFirstJob = indexOfLastJob - jobsPerPage;
//   const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
//   const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));

//   return (
//     <div className="min-h-screen flex flex-col ">
//       <Navbar />
//         <div className="w-full px-2 lg:px-4 dark:bg-gray-700">
//       <div className="flex-grow w-full mx-auto bg-gray-100 pt-20  dark:bg-gray-800 ">
//           <div className="flex gap-6 ">
//             {/* Sidebar (Desktop only) */}
//             <div className="hidden lg:block lg:w-72 dark:bg-gray-700">
//               <FilterCard
//                 onFilterChange={setFilters}
//                 onReset={resetFilters}
//               />
//             </div>

//             {/* Main area */}
//             <div className="flex-1">
//               {/* Mobile toggle */}
//               <div className="flex items-center justify-between mb-4 lg:hidden">
//                 <button
//                   onClick={() => setIsFilterOpen(true)}
//                   className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md"
//                 >
//                   <FiFilter /> Filters
//                 </button>
//                 <div className="text-sm text-gray-600">
//                   {filteredJobs.length} jobs
//                 </div>
//               </div>

//               {isLoading ? (
//                 <div className="flex justify-center items-center h-40">
//                   <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
//                 </div>
//               ) : currentJobs.length > 0 ? (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {currentJobs.map((job) => (
//                       <div key={job._id}>
//                         <Link to={`/jobs/${job._id}`}>
//                           <Job job={job} />
//                         </Link>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Pagination */}
//                   <div className="flex justify-between items-center mt-6">
//                     <button
//                       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className={`px-4 py-2 rounded ${currentPage === 1
//                           ? "bg-gray-300 cursor-not-allowed"
//                           : "bg-blue-500 text-white hover:bg-blue-600"
//                         }`}
//                     >
//                       Previous
//                     </button>
//                     <span className="text-gray-600 font-medium">
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <button
//                       onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className={`px-4 py-2 rounded ${currentPage === totalPages
//                           ? "bg-gray-300 cursor-not-allowed"
//                           : "bg-blue-500 text-white hover:bg-blue-600"
//                         }`}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex justify-center items-center h-40">
//                   <span className="text-gray-500">Job not found</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {isFilterOpen && (
//         <div className="fixed inset-0 z-50 flex lg:hidden">
//           {/* Overlay background */}
//           <div
//             className="absolute inset-0 bg-black bg-opacity-50"
//             onClick={() => setIsFilterOpen(false)}
//           ></div>

//           {/* Sidebar content */}
//           <div className="relative bg-white w-72 h-full shadow-lg transform transition-transform duration-300 translate-x-0">
//             <FilterCard
//               onFilterChange={setFilters}
//               onReset={resetFilters}
//               onClose={() => setIsFilterOpen(false)}
//             />
//           </div>
//         </div>
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default Jobs;