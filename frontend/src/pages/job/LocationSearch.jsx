import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdClear } from "react-icons/md";
import { useJobDetails } from "@/context/JobDetailsContext";
import { allLocations } from "@/utils/constant";

const Locations = ({ locations, onSelectLocation }) => {
  return (
    <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-64 overflow-auto z-20">
      {locations.length > 0 ? (
        locations.map((location, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-50 cursor-pointer"
            onClick={() => onSelectLocation(location)}
          >
            <FaLocationDot size={18} className="text-blue-500" />
            <span className="text-gray-700 text-sm md:text-base">
              {location}
            </span>
          </div>
        ))
      ) : (
        <div className="px-4 py-2 text-gray-500">No locations found</div>
      )}
    </div>
  );
};

const LocationSearch = ({ onSelectLocation }) => {
  const [inputValue, setInputValue] = useState("");
  const [showLocations, setShowLocations] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const { resetFilter } = useJobDetails();

  const handleFocus = () => {
    setShowLocations(true);
    setFilteredLocations(Object.values(allLocations).flat());
  };

  const handleBlur = (e) => {
    // Prevent closing the dropdown if clicking inside it
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setTimeout(() => setShowLocations(false), 150);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const allLocationsArray = Object.values(allLocations).flat();
    const filtered = allLocationsArray.filter((location) =>
      location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLocations(filtered);
    setShowLocations(true);
  };

  const handleLocationSelect = (location) => {
    setInputValue(location); // Update the input with the selected location
    setShowLocations(false); // Close the dropdown
    onSelectLocation(location); // Notify the parent
  };

  const clearInput = () => {
    setInputValue("");
    setFilteredLocations(Object.values(allLocations).flat());
    onSelectLocation("");
    resetFilter();
  };

  return (
    <div
      className="relative flex flex-col items-center w-full md:w-96 mx-auto"
      onBlur={handleBlur}
    >
      <div className="relative flex items-center w-full border-l-0 md:border-l-2 border-t-2 md:border-t-0 border-gray-300 overflow-hidden bg-white">
        <FaLocationDot size={25} className="text-gray-500 ml-3" />
        <input
          type="text"
          placeholder="Enter a location (e.g., Noida, Hyderabad)"
          className="py-3 px-4 outline-none flex-1 text-sm sm:text-base text-gray-700 bg-transparent"
          value={inputValue}
          onFocus={handleFocus}
          onChange={handleInputChange}
        />
        {inputValue && (
          <button
            type="button"
            className="mr-3 text-gray-500 hover:text-red-500"
            onClick={clearInput}
          >
            <MdClear size={20} />
          </button>
        )}
      </div>
      {showLocations && (
        <div
          className="absolute top-16 left-0 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-64 overflow-auto z-50"
          tabIndex="-1" // Allow focus for onBlur handling
        >
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleLocationSelect(location)}
              >
                <FaLocationDot size={18} className="text-blue-500" />
                <span className="text-gray-700 text-sm md:text-base">
                  {location}
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No locations found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
