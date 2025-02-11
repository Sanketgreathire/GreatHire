import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useDispatch } from "react-redux";
import JobDetail from "@/pages/recruiter/JobDetail";

// Import your page components
import Dashboard from "../../pages/admin/Dashboard";
import Users from "../../pages/admin/users/Users";
import Recruiters from "../../pages/admin/recruiters/Recruiters";
import Jobs from "../../pages/admin/Jobs";
import Reports from "../../pages/admin/Reports";
import Settings from "../../pages/admin/Settings";
import Profile from "../../pages/admin/Profile";
import UserDetails from "@/pages/admin/users/UserDetails";
import AppliedCandidatesList from "@/pages/recruiter/AppliedCandidatesList";
import { fetchStats } from "@/redux/admin/statsSlice";
import RecruitersDetails from "@/pages/recruiter/rec_job_details/RecruitersDetails";

const AdminLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStats());
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 mt-16 ml-16 md:ml-52 bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/details/:userId" element={<UserDetails />} />

          <Route path="recruiters" element={<Recruiters />} />
          <Route path="recruiter/details/:recruiterId" element={<RecruitersDetails />} />

          <Route path="jobs" element={<Jobs />} />
          <Route path="job/details/:id" element={<JobDetail />} />
          <Route path="applicants-details/:id" element={<AppliedCandidatesList />} />

          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;
