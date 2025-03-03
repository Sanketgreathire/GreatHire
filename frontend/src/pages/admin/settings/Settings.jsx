// Import necessary modules and dependencies
import React from "react";
import { Link } from "react-router-dom";
import { UserPlus, List, AlertTriangle } from "lucide-react";
import Navbar from "@/components/admin/Navbar";

const Settings = () => {
  return (
    <>
      <Navbar linkName="Settings" />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Add Admin Card */}
          <Link
            to="/admin/settings/add-admin"
            className="group relative bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center justify-center transition transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-blue-500 group-hover:animate-bounce transition duration-300">
              <UserPlus size={48} />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">
              Add Admin
            </h2>
            <p className="mt-2 text-gray-500 text-center">
              Create new admin users.
            </p>
          </Link>

          {/* Admin List Card */}
          <Link
            to="/admin/settings/admin-list"
            className="group relative bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center justify-center transition transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-green-500 group-hover:animate-bounce transition duration-300">
              <List size={48} />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">
              Admin List
            </h2>
            <p className="mt-2 text-gray-500 text-center">
              View and manage admins.
            </p>
          </Link>

          {/* Reported Jobs Card */}
          <Link
            to="/admin/settings/reported-job-list"
            className="group relative bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center justify-center text-center transition transform hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="text-red-500 group-hover:animate-bounce transition duration-300">
              <AlertTriangle size={48} />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">
              Reported Jobs
            </h2>
            <p className="mt-2 text-gray-500 text-center">
              Review reported job posts.
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Settings;
