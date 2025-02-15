import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import JobDetail from "@/pages/recruiter/JobDetail";

// Import page components
import AdminProtectWrapper from "./AdminProtectWrapper";
import Dashboard from "../../pages/admin/Dashboard";
import Users from "../../pages/admin/users/Users";
import RecruitersList from "@/pages/admin/recruiters/RecruitersList";
import Recruiters from "../../pages/admin/recruiters/Recruiters";
import Jobs from "../../pages/admin/jobs/Jobs";
import Reports from "../../pages/admin/reports/Reports";
import Settings from "../../pages/admin/settings/Settings";
import Profile from "../../pages/admin/Profile";
import UserDetails from "@/pages/admin/users/UserDetails";
import AppliedCandidatesList from "@/pages/recruiter/AppliedCandidatesList";
import RecruitersDetails from "@/pages/recruiter/rec_job_details/RecruitersDetails";
import CompanyDetails from "@/pages/admin/companies/CompanyDetails";
import CompanyList from "@/pages/admin/companies/CompanyList";
import AddAdmin from "@/pages/admin/settings/AddAdmin";
import AdminList from "@/pages/admin/settings/AdminList";
import ReportedJobList from "@/pages/admin/settings/ReportedJobList";

const AdminLayout = () => {
  return (
    <AdminProtectWrapper>
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

            <Route path="companies" element={<CompanyList />} />
            <Route path="recruiters-list" element={<RecruitersList />} />
            <Route path="recruiters/:companyId" element={<Recruiters />} />
            <Route
              path="recruiter/details/:recruiterId"
              element={<RecruitersDetails />}
            />
            <Route
              path="for-admin/company-details/:companyId"
              element={<CompanyDetails />}
            />

            <Route path="jobs" element={<Jobs />} />
            <Route path="job/details/:id" element={<JobDetail />} />
            <Route
              path="applicants-list/:id"
              element={<AppliedCandidatesList />}
            />

            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/add-admin" element={<AddAdmin />} />
            <Route path="settings/admin-list" element={<AdminList />} />
            <Route path="settings/reported-job-list" element={<ReportedJobList />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </AdminProtectWrapper>
  );
};

export default AdminLayout;
