// Import necessary modules and dependencies
import React from "react";

// Import search icon
import { IoIosSearch } from "react-icons/io"; 

// Component for location search
import LocationSearch from "@/pages/job/LocationSearch";

// Context for job filtering
import { useJobDetails } from "@/context/JobDetailsContext"; 

const JobSearch = ({ searchInfo }) => {
  // Access filter and reset functions from job context
  const { filterJobs, resetFilter } = useJobDetails();

  // Function to update the location when a user selects one
  const handleLocationSelect = (selectedLocation) => {
    searchInfo.setLocation(selectedLocation);
  };

  // Function to filter jobs based on the provided title and location
  const handleSearchClick = () => {
    filterJobs(searchInfo.titleKeyword, searchInfo.location);
  };

  return (
    <div className="flex flex-col justify-center items-center  w-full mt-5">
      {/* Search Bar Container */}
      <div className="relative flex flex-col sm:flex-row items-center w-full max-w-4xl border border-gray-300 rounded-lg  gap-2 shadow-xl bg-white p-2">
        {/* Job Title Search */}
        <div className="px-2 flex items-center flex-1 w-full ">
          <IoIosSearch size={25} className="text-gray-500" />
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            className="py-3 px-2 outline-none flex-1 bg-transparent text-sm sm:text-base w-full md:w-72"
            value={searchInfo.titleKeyword}
            onChange={(e) => {
              searchInfo.setTitleKeyword(e.target.value);

              if (e.target.value === "") {
                resetFilter();
              } else {
                filterJobs(e.target.value, searchInfo.location);
              }
            }}
          />
        </div>

        {/* Location Search */}
        <LocationSearch onSelectLocation={handleLocationSelect} />

        {/* Desktop Search Button */}
        <div className="hidden md:block">
          <button
            className="bg-blue-700 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition"
            onClick={handleSearchClick}
          >
            Find Jobs
          </button>
        </div>
      </div>

      {/* Mobile Search Button */}
      <div className="mt-4 w-full md:hidden">
        <button
          className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleSearchClick}
        >
          Find Jobs
        </button>
      </div>
    </div>
  );
};

export default JobSearch;
