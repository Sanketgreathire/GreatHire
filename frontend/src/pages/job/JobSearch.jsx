// Import necessary modules and dependencies
import React from "react";

// Import search icon
import { IoIosSearch } from "react-icons/io";

// Component for location search
import LocationSearch from "@/pages/job/LocationSearch";

// Context for job filtering
import { useJobDetails } from "@/context/JobDetailsContext";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const JobSearch = ({ searchInfo, onSearchUpdate }) => {
  // Access filter and reset functions from job context
  const { filterJobs, resetFilter } = useJobDetails();

  // Function to update the title keyword
  const handleTitleChange = (value) => {
    onSearchUpdate({ titleKeyword: value });

    if (value === "") {
      resetFilter?.();
    } else {
      filterJobs(value, searchInfo.location);
    }
  };

  // Function to update the location when a user selects one
  const handleLocationSelect = (selectedLocation) => {
    onSearchUpdate({ location: selectedLocation });
    filterJobs(searchInfo.titleKeyword, selectedLocation);
  };

  // Function to filter jobs based on the provided title and location
  const handleSearchClick = () => {
    filterJobs(searchInfo.titleKeyword, searchInfo.location);
  };

  return (
    <>

      <Helmet>
        <title>Search Jobs by Title & Location | Fast Job Finder - GreatHire</title>
        <meta
          name="description"
          content="Jobs can now be searched instantly on GreatHire, a smart job-search engine, Hyderabad State, India. Candidates searching for jobs on a hiring portal are provided relevant job listings based on their job title, company name, skills, and desired location. The purpose behind designing GreatHire is to aid job-seeking individuals and employers in searching jobs accurately and smartly. The objectives are fulfilled by providing location-aware job searching facilities on GreatHire. It caters to professionals and employers by providing location-aware job searching facilities."
        />
      </Helmet>


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

          {/* Location Search */}
          <LocationSearch onSelectLocation={handleLocationSelect} />

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
    </>
  );
};

export default JobSearch;