import JobsForYou from "./JobsForYou.jsx";
import { useEffect, useState } from "react";
import { useJobDetails } from "@/context/JobDetailsContext.jsx";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LatestJobs = () => {
  const { jobs } = useJobDetails();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [jobs]);

  return (
    <div className="max-w-7xl mx-auto my-4 ">
      <h1 className="ml-6 text-4xl font-bold">
        <span className="text-[#384ac2]">Latest & Top</span> Job Openings
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <DotLottieReact
            src="https://lottie.host/09b5a31e-9d2e-474f-b6a6-a041c2bba007/uz23eyZvbM.lottie"
            loop
            autoplay
            style={{ width: "300px", height: "300px" }}
          />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-gray-500 mt-24 mb-20">
          <p className="text-xl font-semibold text-gray-700">Uh Oh!</p>
          <p className="text-lg">Currently No Jobs Available</p>
        </div>
      ) : (
        <JobsForYou jobs={jobs} />
      )}
    </div>
  );
};

export default LatestJobs;
