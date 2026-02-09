// Import necessary modules and dependencies
import React from "react";
import { Link } from "react-router-dom";
import { UserPlus, List, AlertTriangle } from "lucide-react";
import Navbar from "@/components/admin/Navbar";

const Settings = () => {
  return (
  <>
    <Navbar linkName="Settings" />

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Add Admin Card */}
          <Link
            to="/admin/settings/add-admin"
            className="group relative bg-white rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-blue-500 group-hover:animate-bounce transition duration-300">
              <UserPlus size={48} />
            </div>
            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-700">
              Add Admin
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              Create new admin users.
            </p>
          </Link>

          {/* Admin List Card */}
          <Link
            to="/admin/settings/admin-list"
            className="group relative bg-white rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-green-500 group-hover:animate-bounce transition duration-300">
              <List size={48} />
            </div>
            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-700">
              Admin List
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              View and manage admins.
            </p>
          </Link>

          {/* Reported Jobs Card */}
          <Link
            to="/admin/settings/reported-job-list"
            className="group relative bg-white rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-red-500 group-hover:animate-bounce transition duration-300">
              <AlertTriangle size={48} />
            </div>
            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-700">
              Reported Jobs
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              Review reported job posts.
            </p>
          </Link>
        </div>
      </div>
    </div>
  </>
);

};

export default Settings;
