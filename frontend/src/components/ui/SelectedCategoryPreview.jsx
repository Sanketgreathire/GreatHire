import React from 'react';

function SelectedCategoryPreview({ selectedCategories }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Selected Categories:</h2>
      {selectedCategories.length === 0 ? (
        <p className="text-gray-500">No categories selected.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {category}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectedCategoryPreview;
