import React from "react";

const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm sm:w-96 text-center">
        <p className="text-lg font-semibold mb-4 text-gray-800">
          Are you sure you want to delete this?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-md"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-5 py-2 rounded-lg transition-all duration-200 shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
