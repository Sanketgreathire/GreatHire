import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/admin/Navbar";

const Settings = () => {
  return (
    <>
      <Navbar linkName={"Settings"} />
      <div className="p-6">
        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Admin Card */}
          <Link
            to="/admin/settings/add-admin"
            className="block bg-white shadow-lg rounded-lg p-6 text-center hover:bg-gray-100 transition"
          >
            <div className="text-3xl">➕</div>
            <h2 className="text-lg font-semibold mt-2">Add Admin</h2>
          </Link>

          {/* Admin List Card */}
          <Link
            to="/admin/settings/admin-list"
            className="block bg-white shadow-lg rounded-lg p-6 text-center hover:bg-gray-100 transition"
          >
            <div className="text-3xl">📋</div>
            <h2 className="text-lg font-semibold mt-2">Admin List</h2>
          </Link>

          {/* Reported Jobs Card */}
          <Link
            to="/admin/settings/reported-job-list"
            className="block bg-white shadow-lg rounded-lg p-6 text-center hover:bg-gray-100 transition"
          >
            <div className="text-3xl">🚨</div>
            <h2 className="text-lg font-semibold mt-2">Reported Jobs</h2>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Settings;
