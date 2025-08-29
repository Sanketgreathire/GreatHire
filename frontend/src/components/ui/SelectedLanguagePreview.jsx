import React from "react";

const SelectedLanguagePreview = ({ selectedLanguages = [], setSelectedLanguages }) => {
  if (!selectedLanguages.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {selectedLanguages.map((language) => (
        <span
          key={language}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
        >
          {language}
          <button
            type="button"
            onClick={() =>
              setSelectedLanguages((prev) => prev.filter((l) => l !== language))
            }
            className="text-blue-700 hover:text-red-600 transition-colors"
          >
            &times;
          </button>
        </span>
      ))}
    </div>
  );
};

export default SelectedLanguagePreview;
