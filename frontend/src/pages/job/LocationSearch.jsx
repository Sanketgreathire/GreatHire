// Importing React state management
import { useState } from "react"; 

// Importing location icon
import { FaLocationDot } from "react-icons/fa6"; 
// Importing clear icon
import { MdClear } from "react-icons/md"; 
// Importing job details context
import { useJobDetails } from "@/context/JobDetailsContext"; 
 // Importing predefined list of locations
import { allLocations } from "@/utils/constant";

// Component for displaying the location dropdown
const Locations = ({ locations, onSelectLocation }) => {
  return (
    <div className="absolute top-16 left-0 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-64 overflow-auto z-20">
      {/* Check if there are available locations */}
      {locations.length > 0 ? (
        locations.map((location, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-50 cursor-pointer"
            onClick={() => onSelectLocation(location)} // Handle location selection
          >
            <FaLocationDot size={18} className="text-blue-500" />
            <span className="text-gray-700 text-sm md:text-base">
              {location}
            </span>
          </div>
        ))
      ) : (
        // Display when no locations are found
        <div className="px-4 py-2 text-gray-500">No locations found</div>
      )}
    </div>
  );
};


// Main location search component
const LocationSearch = ({ onSelectLocation }) => {
  const [inputValue, setInputValue] = useState(""); // State to store user input
  const [showLocations, setShowLocations] = useState(false); // State to toggle location dropdown visibility
  const [filteredLocations, setFilteredLocations] = useState([]); // State to store filtered locations
  const { resetFilter } = useJobDetails(); // Accessing reset function from context

  // Handle focus on input field to show the dropdown with all locations
  const handleFocus = () => {
    setShowLocations(true);
    setFilteredLocations(Object.values(allLocations).flat()); // Flatten the locations object into an array
  };

  // Handle blur to close dropdown when clicking outside
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setTimeout(() => setShowLocations(false), 150); // Delay closing to allow selection
    }
  };

  // Handle input change and filter locations based on search input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Convert location values into an array and filter based on user input
    const allLocationsArray = Object.values(allLocations).flat();
    const filtered = allLocationsArray.filter((location) =>
      location.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredLocations(filtered);
    setShowLocations(true);
  };

  // Handle selecting a location from the dropdown
  const handleLocationSelect = (location) => {
    setInputValue(location); // Update input field with selected location
    setShowLocations(false); // Close dropdown
    onSelectLocation(location); // Pass selected location to parent component
  };

  // Clear input and reset filters
  const clearInput = () => {
    setInputValue("");
    setFilteredLocations(Object.values(allLocations).flat()); // Reset to all locations
    onSelectLocation("");
    resetFilter(); // Reset job filters
  };

  return (
    <div
      className="relative flex flex-col items-center w-full md:w-96 mx-auto"
      onBlur={handleBlur} // Handle blur event for dropdown close
    >
      {/* Input field with location icon and clear button */}
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
            onClick={clearInput} // Clear input on button click
          >
            <MdClear size={20} />
          </button>
        )}
      </div>

      {/* Dropdown displaying filtered locations */}
      {showLocations && (
        <div
          className="absolute top-16 left-0 bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-64 overflow-auto z-50"
          tabIndex="-1" // Allows focus for blur handling
        >
          {/* Check if there are filtered locations */}
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 px-4 py-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleLocationSelect(location)} // Handle selection
              >
                <FaLocationDot size={18} className="text-blue-500" />
                <span className="text-gray-700 text-sm md:text-base">
                  {location}
                </span>
              </div>
            ))
          ) : (
            // Display message when no matches are found
            <div className="px-4 py-2 text-gray-500">No locations found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;

