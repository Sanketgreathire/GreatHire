import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

function LanguageSelector({ selectedLanguages, setSelectedLanguages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    'English', 'Hindi', 'Urdu', 'Telugu', 'Marathi',
    'Tamil', 'Gujarati', 'Punjabi', 'Other'
  ];

  const handleCheckboxChange = (language) => {
    if (language === 'Other') {
      setShowCustomInput((prev) => !prev);
      return;
    }
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const handleAddCustomlanguage = () => {
    const trimmed = customLanguage.trim();
    if (trimmed && !selectedLanguages.includes(trimmed)) {
      setSelectedLanguages((prev) => [...prev, trimmed]);
    }
    setCustomLanguage('');
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
    <div className="relative w-full sm:w-80" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
        <label className="block font-semibold text-black dark:text-white">
          Job Languages
        </label>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="mt-2 sm:mt-0 flex justify-between items-center border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm hover:border-blue-500 w-full sm:w-[200px]"
        >
          {selectedLanguages.length > 0
            ? `${selectedLanguages.length} selected`
            : "Select languages"}
          <FaChevronDown
            className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
          <div className="relative mb-6 pr-10 mr-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
              aria-label="Close"
            >
              ✖
            </button>
          </div>

          <ul className="p-2 space-y-1">
            {languages.map((language) => (
              <li key={language}>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={
                      language === 'Other'
                        ? showCustomInput
                        : selectedLanguages.includes(language)
                    }
                    onChange={() => handleCheckboxChange(language)}
                  />
                  <span className="text-black dark:text-white">
                    {language}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {showCustomInput && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <input
                type="text"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                placeholder="Enter language"
                className="flex-1 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddCustomlanguage}
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

export default LanguageSelector;
