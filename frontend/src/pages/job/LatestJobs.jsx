
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import JobsForYou from "./JobsForYou.jsx";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const LatestJobs = ({ jobs = [] }) => {
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true); // track initial load

  // Simulate a loading delay for a better user experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [jobs, firstLoad]);

  return (
    <>

      <Helmet>
        <title>Latest & Top Job Openings Today | Fresh Hiring Opportunities – GreatHire</title>
        <meta
          name="description"
          content="Explore the latest and top job openings on GreatHire and stay ahead in your job search with freshly updated opportunities from trusted employers. This page highlights active hiring roles, personalized job recommendations, and in-demand positions across multiple industries. Designed for speed and clarity, GreatHire helps job seekers quickly discover relevant openings, compare details, and apply with confidence. Operating from Hyderabad State, India, GreatHire is a fast-growing hiring platform connecting skilled professionals with verified companies across cities, roles, and experience levels through a modern recruitment system."
        />
      </Helmet>


      <div className="max-w-7xl mx-auto my-4 dark:text-gray-100 ">
        {/* Section Title */}
        <h1 className="ml-2 sm:ml-4 lg:ml-6 font-bold lg:tracking-wide text-2xl sm:text-3xl lg:text-4xl dark:text-gray-100">
          <span className="text-[#384ac2] lg:tracking-wider">
            Latest&nbsp;&amp;&nbsp;Top
          </span>
          &nbsp;Job&nbsp;Openings
        </h1>

        {/* <h1 className="ml-6 text-4xl font-bold dark:text-gray-100">
          <span className="text-[#384ac2] dark:text-gray-100">Latest  &  Top</span> Job Openings
        </h1> */}

        {/* Display loading animation while fetching jobs */}
        {loading ? (
          <div className="flex justify-center items-center h-40 dark:text-gray-100">
            <DotLottieReact
              src="https://lottie.host/09b5a31e-9d2e-474f-b6a6-a041c2bba007/uz23eyZvbM.lottie"
              loop
              autoplay
              style={{ width: "300px", height: "300px" }}
            />
          </div>
        ) : jobs.length === 0 ? (
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
// current code working fine, no changes made
// // Import required components and dependencies
// // Component to display job listings
// import JobsForYou from "./JobsForYou.jsx";

// // React hooks for state and effects
// import { useEffect, useState } from "react";

// // Context to access job data
// import { useJobDetails } from "@/context/JobDetailsContext.jsx";

// // Lottie animation for loading indicator
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// const LatestJobs = () => {
//   // Retrieve jobs from context
//   const { jobs } = useJobDetails();
//   // State to manage loading status
//   const [loading, setLoading] = useState(true);

//     // Simulate a loading delay for a better user experience
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//     return () => clearTimeout(timer); // Cleanup timeout to prevent memory leaks
//   }, [jobs]);  // Runs whenever `jobs` data changes

//   return (
//     <div className="max-w-7xl mx-auto my-4 dark:text-gray-100 ">
//       {/* Section Title */}
//       <h1 className="ml-6 text-4xl font-bold dark:text-gray-100">
//         <span className="text-[#384ac2] dark:text-gray-100">Latest & Top</span> Job Openings
//       </h1>
//         {/* Display loading animation while fetching jobs */}
//       {loading ? (
//         <div className="flex justify-center items-center h-40 dark:text-gray-100">
//           <DotLottieReact
//             src="https://lottie.host/09b5a31e-9d2e-474f-b6a6-a041c2bba007/uz23eyZvbM.lottie"
//             loop
//             autoplay
//             style={{ width: "300px", height: "300px" }}
//           />
//         </div>
//          // Display message if no jobs are available
//       ) : jobs.length === 0 ? (
//         <div className="text-center text-gray-500 mt-24 mb-20 dark:gray-100">
//           <p className="text-xl font-semibold text-gray-700  dark:gray-100">Uh Oh!</p>
//           <p className="text-lg  dark:gray-100">Currently No Jobs Available</p>
//         </div>
//       ) : (
//          // Render job listings when jobs are available
//         <JobsForYou jobs={jobs} />
//       )}
//     </div>
//   );
// };

// export default LatestJobs;

