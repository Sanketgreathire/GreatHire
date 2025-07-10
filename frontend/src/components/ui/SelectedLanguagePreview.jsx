import React from 'react';

function SelectedLanguagePreview({ selectedLanguages }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Selected Languages:</h2>
      {selectedLanguages.length === 0 ? (
        <p className="text-gray-500">No languages selected.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedLanguages.map((language) => (
            <span
              key={language}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-3xl font-medium"
            >
              {language}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectedLanguagePreview;
