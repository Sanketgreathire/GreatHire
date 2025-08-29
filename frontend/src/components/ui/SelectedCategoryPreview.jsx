import React from "react";

const SelectedCategoryPreview = ({ selectedCategories = [], setSelectedCategories }) => {
  if (!selectedCategories.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {selectedCategories.map((category) => (
        <span
          key={category}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
        >
          {category}
          <button
            type="button"
            onClick={() =>
              setSelectedCategories((prev) => prev.filter((c) => c !== category))
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

export default SelectedCategoryPreview;
