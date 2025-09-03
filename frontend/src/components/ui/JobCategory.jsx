import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

function JobCategory({ selectedCategories, setSelectedCategories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    'Software Development', 'Data Science', 'Design', 'Marketing', 'Sales',
    'Customer Support', 'Finance', 'Human Resources', 'Project Management',
    'Content Creation', 'Consulting', 'Legal', 'Education', 'Healthcare',
    'Engineering', 'Manufacturing', 'Logistics', 'Real Estate', 'Retail',
    'Hospitality', 'Non-Profit', 'Government', 'Telecommunications', 'Energy',
    'Agriculture', 'Construction', 'Transportation', 'Insurance', 'Pharmaceuticals',
    'Information Technology', 'Business Development', 'Public Relations',
    'Other'
  ];

  const handleCheckboxChange = (category) => {
    if (category === 'Other') {
      setShowCustomInput((prev) => !prev);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (trimmed && !selectedCategories.includes(trimmed)) {
      setSelectedCategories((prev) => [...prev, trimmed]);
    }
    setCustomCategory('');
    setShowCustomInput(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-80 " ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
        <label className="block font-semibold">Job Categories</label>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="mt-2 sm:mt-0 flex justify-between items-center border border-gray-300 px-3 py-2 rounded-lg bg-white shadow-sm hover:border-blue-500 w-full sm:w-[200px]"
        >
          {selectedCategories.length > 0
            ? `${selectedCategories.length} selected`
            : "Select categories"}
          <FaChevronDown
            className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
          <div className="relative mb-6 pr-10 mr-2">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              ✖
            </button>
          </div>
          <ul className="p-2 space-y-1">
            {categories.map((category) => (
              <li key={category}>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      category === 'Other'
                        ? showCustomInput
                        : selectedCategories.includes(category)
                    }
                    onChange={() => handleCheckboxChange(category)}
                  />
                  <span>{category}</span>
                </label>
              </li>
            ))}
          </ul>

          {showCustomInput && (
            <div className="p-2 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter category"
                className="flex-1 border border-gray-300 px-2 py-1 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddCustomCategory}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobCategory;
