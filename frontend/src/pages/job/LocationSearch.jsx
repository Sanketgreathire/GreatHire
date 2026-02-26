// Importing React state management
import { useState, useEffect } from "react";

// Importing location icon
import { FaLocationDot } from "react-icons/fa6";
// Importing clear icon
import { MdClear } from "react-icons/md";
// Importing job details context
import { useJobDetails } from "@/context/JobDetailsContext";
// Importing predefined list of locations
import { allLocations } from "@/utils/constant";

// imported helmet to apply customized meta tags
import { Helmet } from "react-helmet-async";

// Main location search component
// `value` prop keeps this in sync with external filter changes (e.g. FilterCard dropdown)
const LocationSearch = ({ onSelectLocation, value = "" }) => {
  const [inputValue, setInputValue] = useState(value);
  const [showLocations, setShowLocations] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const { resetFilter } = useJobDetails();

  // ✅ Sync inputValue when external `value` prop changes
  // (e.g. FilterCard location dropdown changed, or Reset was clicked)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle focus on input field to show the dropdown with all locations
  const handleFocus = () => {
    setShowLocations(true);
    setFilteredLocations(Object.values(allLocations).flat());
  };

  // Handle blur to close dropdown when clicking outside
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setTimeout(() => setShowLocations(false), 150);
    }
  };

  // Handle input change and filter locations based on search input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    const allLocationsArray = Object.values(allLocations).flat();
    const filtered = allLocationsArray.filter((location) =>
      location.toLowerCase().includes(val.toLowerCase())
    );

    setFilteredLocations(filtered);
    setShowLocations(true);

    // Trigger job filtering on every keystroke
    onSelectLocation(val);
  };

  // Handle selecting a location from the dropdown
  const handleLocationSelect = (location) => {
    setInputValue(location);
    setShowLocations(false);
    onSelectLocation(location);
  };

  // Clear input and reset filters
  const clearInput = () => {
    setInputValue("");
    setFilteredLocations(Object.values(allLocations).flat());
    onSelectLocation("");
    resetFilter();
  };

  return (
    <>
      <Helmet>
        <title>Search Jobs by Location | Locate Jobs in Your Area - GreatHire</title>
        <meta
          name="description"
          content="Find a job quickly using the location search functionality that is too good to miss and available on GreatHire's platform, named Hyderabad State, India. Search for a job immediately by selecting your desired job location even without searching. Employing the location search functionality on the job search platform enables job seekers to limit job search results immediately and quickly find a job. GreatHire is a reliable job portal that helps link job seekers with employers on the job platform."
        />
      </Helmet>

      <div
        className="relative flex flex-col items-center w-full md:w-96 mx-auto"
        onBlur={handleBlur}
      >
        {/* Input field with location icon and clear button */}
        <div className="relative flex items-center w-full border-l-0 md:border-l-2 border-t-2 md:border-t-0 border-gray-300 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
          <FaLocationDot size={25} className="text-gray-500 ml-3" />
          <input
            type="text"
            placeholder="Enter a location (e.g., Noida, Hyderabad)"
            className="py-3 px-4 outline-none flex-1 text-sm sm:text-base text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent"
            value={inputValue}
            onFocus={handleFocus}
            onChange={handleInputChange}
          />
          {inputValue && (
            <button
              type="button"
              className="mr-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
              onClick={clearInput}
            >
              <MdClear size={20} />
            </button>
          )}
        </div>

        {/* Dropdown displaying filtered locations */}
        {showLocations && (
          <div
            className="absolute top-16 left-0 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-2xl w-full max-h-64 overflow-auto z-50 transition-colors duration-300"
            tabIndex="-1"
          >
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                  onClick={() => handleLocationSelect(location)}
                >
                  <FaLocationDot size={18} className="text-blue-500 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                    {location}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                No locations found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default LocationSearch;