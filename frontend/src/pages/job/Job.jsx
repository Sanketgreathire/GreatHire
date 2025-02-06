import React from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { useJobDetails } from "@/context/JobDetailsContext";
import { useSelector } from "react-redux";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { setSelectedJob } = useJobDetails();
  const { user } = useSelector((state) => state.auth);

  const calculateActiveDays = (createdAt) => {
    const jobCreatedDate = new Date(createdAt); // Convert the 'createdAt' timestamp to a Date object
    const currentDate = new Date(); // Get the current date

    // Calculate the difference in time (in milliseconds)
    const timeDifference = currentDate - jobCreatedDate;

    // Convert time difference from milliseconds to days
    const activeDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Divide by the number of milliseconds in a day

    return activeDays;
  };

  const isApplied =
    job?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;

  return (
    <div className="flex flex-col space-y-2 p-5 rounded-md bg-white border border-grey-100">
      <div className="flex justify-between items-center mb-2 ">
        {job?.jobDetails?.urgentHiring && (
          <p className="text-sm bg-violet-100 rounded-md p-1 text-violet-800 font-bold">
            Urgent Hiring
          </p>
        )}
        <div className="flex items-center justify-between">
          <Button variant="outline" className="rounded-full" size="icon">
            <Bookmark />
          </Button>
        </div>
      </div>
      <h3 className="text-lg font-semibold">{job?.jobDetails?.title}</h3>
      <div className="flex items-center justify-between gap-2 my-2">
        <div>
          {job?.jobDetails?.companyName} 
        </div>
        <div>
          <p className="text-sm text-gray-500">{job?.jobDetails?.location}</p>
        </div>
      </div>
      <div className="p-1 flex items-center w-full text-sm bg-blue-100 justify-center text-blue-800 rounded-md">
        <div className="flex items-center gap-1">
          <AiOutlineThunderbolt />
          <span>Typically Respond in {job.jobDetails?.respondTime} days</span>
        </div>
      </div>
      <div className="text-sm flex flex-col space-y-2">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex w-1/2">
            <p className="p-1 text-center w-full font-semibold text-gray-700 rounded-md bg-gray-200 ">
              {job?.jobDetails?.salary}
            </p>
          </div>
          <div className="flex w-1/2">
            <p className="p-1 w-full font-semibold text-green-700 rounded-md bg-green-100 flex items-center justify-center gap-1 ">
              {job.jobDetails?.jobType}
            </p>
          </div>
        </div>
        <div className="w-full">
          <p className="p-1 text-center font-semibold text-gray-700 rounded-md bg-gray-200">
            {job.jobDetails?.duration}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Active {calculateActiveDays(job?.createdAt)} days ago
          </p>
        </div>
        <div className="flex items-center text-sm text-blue-700 gap-2">
          {isApplied && <span className="text-green-600">Applied</span>}
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-4 ">
        <Button
          onClick={() => {
            setSelectedJob(job);
            navigate(`/description`);
          }}
          variant="outline"
          className="w-full text-white bg-blue-700 hover:bg-blue-600 hover:text-white"
        >
          Details
        </Button>
      </div>
    </div>
  );
};

export default Job;
