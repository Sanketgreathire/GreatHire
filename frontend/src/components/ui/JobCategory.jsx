import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

function JobCategory({ selectedCategories, setSelectedCategories}) {
  // Define a state to manage the selected checkboxes
  // const [selectedCategories, setSelectedCategories] = useState({});
  const [isVisible, setIsVisible] = useState(false); // State for visibility of the categories

  const categoryRef = useRef(null);

 const handleCheckboxChange = (category) => {
  setSelectedCategories((prev) =>
    prev.includes(category)
      ? prev.filter((c) => c !== category) // remove if already selected
      : [...prev, category] // add if not selected
  );
};

  

  const categories = [
    'Software Development', 'Data Science', 'Design', 'Marketing', 'Sales',
    'Customer Support', 'Finance', 'Human Resources', 'Project Management',
    'Content Creation', 'Consulting', 'Legal', 'Education', 'Healthcare',
    'Engineering', 'Manufacturing', 'Logistics', 'Real Estate', 'Retail',
    'Hospitality', 'Non-Profit', 'Government', 'Telecommunications', 'Energy',
    'Agriculture', 'Construction', 'Transportation', 'Insurance', 'Pharmaceuticals',
    'Information Technology', 'Business Development', 'Public Relations'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsVisible(false); // Close the categories if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible); // Toggle the visibility of the category list
  };

  const closeComponent = () => {
    setIsVisible(false); // Close the component when the close button is clicked
  };

  return (
    <div>
      {/* Button to toggle the categories */}
      <button onClick={(event)=>{toggleVisibility(),event.preventDefault()}} className="btn-open-categories border border-blue-600 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
        Categories
      </button>

      {/* Show the category list only if isVisible is true */}
      {isVisible && (
        <div className="w-[100%] h-[1500px] absolute top-0 left-0 z-30 flex flex-grow justify-end items-center">
          {/* Overlay only when component is visible */}
          <div className="w-[100%] h-[100%] bg-gray-500 absolute top-0 left-0 z-10 opacity-50" />

          <div
            ref={categoryRef}
            className="flex w-[350px] h-[100%] right-0 bg-white flex-grow shadow-lg absolute z-20 transition-all duration-300 ease-in-out transform translate-x-0"
          >
            <div className="w-[100%] h-[100%] flex flex-col justify-between items-center p-4">
              <div className="w-[100%] relative">
                <h1 className="text-2xl py-4 text-center font-semibold font-poppins border-b border-b-gray-300">
                  Categories
                </h1>

                {/* Close Icon */}
                <button
                  onClick={closeComponent}
                  className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>

                <div className="w-[100%] h-[100%] pt-4 flex overflow-y-auto">
                  <ul className="flex flex-col  gap-3">
                    {categories.map((category) => (
                      <li key={category} className="text-lg font-semibold border-b border-b-gray-300 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCheckboxChange(category)}
                          className="mr-2"
                        />
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobCategory;
