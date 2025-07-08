import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

function JobCategory({ selectedCategories, setSelectedCategories }) {
  const [isVisible, setIsVisible] = useState(false);
  const categoryRef = useRef(null);

  const categories = [
    'Software Development', 'Data Science', 'Design', 'Marketing', 'Sales',
    'Customer Support', 'Finance', 'Human Resources', 'Project Management',
    'Content Creation', 'Consulting', 'Legal', 'Education', 'Healthcare',
    'Engineering', 'Manufacturing', 'Logistics', 'Real Estate', 'Retail',
    'Hospitality', 'Non-Profit', 'Government', 'Telecommunications', 'Energy',
    'Agriculture', 'Construction', 'Transportation', 'Insurance', 'Pharmaceuticals',
    'Information Technology', 'Business Development', 'Public Relations'
  ];

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const closeComponent = () => {
    setIsVisible(false);
  };

  return (
    <div>
      <button
        onClick={(event) => {
          toggleVisibility();
          event.preventDefault();
        }}
        className="btn-open-categories border border-blue-600 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Categories
      </button>

      {isVisible && (
        <div className="w-full h-[1500px] absolute top-0 left-0 z-30 flex justify-end items-center">
          <div className="w-full h-full bg-gray-500 absolute top-0 left-0 z-10 opacity-50" />

          <div
            ref={categoryRef}
            className="w-[350px] h-full bg-white shadow-lg z-20 relative"
          >
            <div className="flex flex-col h-full p-4">
              <div className="relative">
                <h1 className="text-2xl py-4 text-center font-semibold border-b border-b-gray-300">
                  Categories
                </h1>
                <button
                  onClick={closeComponent}
                  className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="pt-4 overflow-y-auto flex-grow">
                <ul className="flex flex-col gap-3">
                  {categories.map((category) => (
                    <li
                      key={category}
                      className="text-lg font-semibold border-b border-b-gray-300"
                    >
                      <label
                        htmlFor={category}
                        className="flex items-center gap-2 cursor-pointer w-full"
                      >
                        <input
                          id={category}
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCheckboxChange(category)}
                          className="mr-2"
                        />
                        {category}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobCategory;
