import React from "react";

const DeleteConfirmation = ({ isOpen, onConfirm, onCancel }) =>
  isOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:w-96 text-center">
        <p className="text-lg font-semibold mb-4">Do you really want to delete it?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded">
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-blue-600 text-white px-4 py-2 rounded">
            No
          </button>
        </div>
      </div>
    </div>
  );

export default DeleteConfirmation;
