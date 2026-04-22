import React, { useCallback } from "react";
import { IoIosSearch } from "react-icons/io";
import LocationSearch from "@/pages/job/LocationSearch";
import { useJobDetails } from "@/context/JobDetailsContext";

const JobSearch = ({ searchInfo, onSearchUpdate }) => {
  const { filterJobs, resetFilter } = useJobDetails();

  const handleTitleChange = useCallback((value) => {
    onSearchUpdate({ titleKeyword: value });
    if (value === "") resetFilter?.();
    else filterJobs(value, searchInfo.location);
  }, [onSearchUpdate, resetFilter, filterJobs, searchInfo.location]);

  const handleLocationSelect = useCallback((selectedLocation) => {
    onSearchUpdate({ location: selectedLocation });
    filterJobs(searchInfo.titleKeyword, selectedLocation);
  }, [onSearchUpdate, filterJobs, searchInfo.titleKeyword]);

  const handleSearchClick = useCallback(() => {
    filterJobs(searchInfo.titleKeyword, searchInfo.location);
  }, [filterJobs, searchInfo.titleKeyword, searchInfo.location]);

  return (
      <div className="flex flex-col justify-center items-center w-full mt-5">
        {/* Search Bar Container */}
        <div className="relative flex flex-col sm:flex-row items-center w-full max-w-4xl border border-gray-300 dark:border-gray-700 rounded-lg gap-2 shadow-xl bg-white dark:bg-gray-900 p-2 transition-colors duration-300">
          {/* Job Title Search */}
          <div className="px-2 flex items-center flex-1 w-full">
            <IoIosSearch size={25} className="text-gray-500 dark:text-gray-400 transition-colors duration-300"/>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              className="py-3 px-2 outline-none flex-1 bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base w-full md:w-72"
              value={searchInfo.titleKeyword}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          {/* Location Search — value prop added so FilterCard changes reflect here */}
          <LocationSearch
            value={searchInfo.location}
            onSelectLocation={handleLocationSelect}
          />

          {/* Desktop Search Button */}
          <div className="hidden md:block">
            <button
              className="bg-blue-700 dark:bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-500 transition"
              onClick={handleSearchClick}
            >
              Find Jobs
            </button>
          </div>
        </div>

        {/* Mobile Search Button */}
        <div className="mt-4 w-full md:hidden">
          <button
            className="w-full bg-blue-700 dark:bg-blue-600 text-white py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-500 transition"
            onClick={handleSearchClick}
          >
            Find Jobs
          </button>
        </div>
      </div>
  );
};

export default JobSearch;