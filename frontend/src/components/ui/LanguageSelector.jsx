import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

function LanguageSelector({ selectedLanguages, setSelectedLanguages }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showOtherDialog, setShowOtherDialog] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');
  const languageRef = useRef(null);
const dialogRef = useRef(null);

  const languages = [
    'English', 'Hindi', 'Urdu', 'Telugu', 'Marathi',
    'Tamil', 'Gujarati', 'Punjabi', 'Others'
  ];


  const handleCheckboxChange = (language) => {
    if (language === 'Others') {
      setShowOtherDialog(true);
      return;
    }

    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

const handleOtherSubmit = () => {
  const trimmed = customLanguage.trim();

  if (!trimmed) {
    alert('Please enter a language.');
    return;
  }

  // Auto-capitalize each word (e.g., "british english" => "British English")
  const formatted = trimmed
    .split(/\s+/)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');

  const words = formatted.split(' ');

  // ✅ Allow max 2 words: second can only be "English"
  const isValid =
    (words.length === 1 || (words.length === 2 && words[1] === 'English')) &&
    words.every((word) => /^[A-Z][a-z]+$/.test(word));

  if (!isValid) {
    alert(
      'Please enter only one valid language (e.g., "English" or "British English"). Do not combine multiple languages.'
    );
    return;
  }

  if (!selectedLanguages.includes(formatted)) {
    setSelectedLanguages([...selectedLanguages, formatted]);
  }

  setShowOtherDialog(false);
  setCustomLanguage('');
};





const handleClickOutside = (event) => {
  if (
    languageRef.current &&
    !languageRef.current.contains(event.target) &&
    (!dialogRef.current || !dialogRef.current.contains(event.target))
  ) {
    setIsVisible(false);
    setShowOtherDialog(false);
  }
};

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const closeComponent = () => {
    setIsVisible(false);
  };

  const customLanguagesCount = selectedLanguages.filter(
    (lang) => !languages.includes(lang)
  ).length;

  return (
    <div>
      <button
        onClick={(event) => {
          toggleVisibility();
          event.preventDefault();
        }}
        className="border border-blue-700 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 transition-colors duration-300"
      >
        Languages
      </button>

      {isVisible && (
        <div className="w-full h-[1500px] absolute top-0 left-0 z-30 flex justify-end items-center">
          <div className="w-full h-full bg-gray-500 absolute top-0 left-0 z-10 opacity-50" />

          <div
            ref={languageRef}
            className="w-[350px] h-full bg-white shadow-lg z-20 relative"
          >
            <div className="flex flex-col h-full p-4">
              <div className="relative">
                <h1 className="text-2xl py-4 text-center font-semibold border-b border-b-gray-300">
                  Languages
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
                  {languages.map((language) => (
                    <li
                      key={language}
                      className="text-lg font-semibold border-b border-b-gray-300"
                    >
                      <label
                        htmlFor={language}
                        className="flex items-center gap-2 cursor-pointer w-full"
                      >
                        <input
                          id={language}
                          type="checkbox"
                          checked={selectedLanguages.includes(language)}
                          onChange={() => handleCheckboxChange(language)}
                          className="mr-2"
                        />
                        {language}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Custom Language Dialog */}
          {showOtherDialog && (
            <div className="fixed inset-0 z-40 flex justify-center items-center bg-black bg-opacity-50">
              <div
              ref={dialogRef}
              className="bg-white p-6 rounded shadow-md w-80">
                  <h2 className="text-lg font-semibold mb-4 text-center">
                    Add a Language {customLanguagesCount > 0 && <span className="text-blue-600">+{customLanguagesCount}</span>}
                  </h2>

                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); // prevent form submit
                        handleOtherSubmit();
                      }
                    }}
                    className="w-full border px-3 py-2 rounded mb-4"
                    placeholder="Enter custom language"
                  />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowOtherDialog(false);
                      setCustomLanguage('');
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOtherSubmit}
                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
