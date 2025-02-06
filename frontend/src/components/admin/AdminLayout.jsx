import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

// Import your page components
import Dashboard from "../../pages/admin/Dashboard";
import Users from "../../pages/admin/Users";
import Recruiters from "../../pages/admin/Recruiters";
import Jobs from "../../pages/admin/Jobs";
import Reports from "../../pages/admin/Reports";
import Settings from "../../pages/admin/Settings";
import Profile from "../../pages/admin/Profile";

const AdminLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-16 md:ml-52 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="recruiters" element={<Recruiters />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
