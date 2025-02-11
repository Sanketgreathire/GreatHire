import JobsForYou from "./JobsForYou.jsx";


const LatestJobs = () => {
  return (
    <div className="max-w-7xl mx-auto my-4 ">
      <h1 className="ml-6 text-4xl font-bold">
        <span className="text-[#384ac2]">Latest & Top</span> Job Openings
      </h1>
      <JobsForYou />
    </div>
  );
};

export default LatestJobs;
