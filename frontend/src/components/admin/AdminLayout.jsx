import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminProtectWrapper from "./AdminProtectWrapper";

const Dashboard         = lazy(() => import("../../pages/admin/Dashboard"));
const Users             = lazy(() => import("../../pages/admin/users/Users"));
const UserDetails       = lazy(() => import("@/pages/admin/users/UserDetails"));
const CompanyList       = lazy(() => import("@/pages/admin/companies/CompanyList"));
const CompanyDetails    = lazy(() => import("@/pages/admin/companies/CompanyDetails"));
const RecruitersList    = lazy(() => import("@/pages/admin/recruiters/RecruitersList"));
const Recruiters        = lazy(() => import("../../pages/admin/recruiters/Recruiters.jsx"));
const RecruitersDetails = lazy(() => import("@/pages/recruiter/rec_job_details/RecruitersDetails"));
const Jobs              = lazy(() => import("../../pages/admin/jobs/Jobs"));
const JobDetail         = lazy(() => import("@/pages/recruiter/JobDetail"));
const AppliedCandidatesList = lazy(() => import("@/pages/recruiter/AppliedCandidatesList"));
const Reports           = lazy(() => import("../../pages/admin/reports/Reports"));
const Settings          = lazy(() => import("../../pages/admin/settings/Settings"));
const AddAdmin          = lazy(() => import("@/pages/admin/settings/AddAdmin"));
const AdminList         = lazy(() => import("@/pages/admin/settings/AdminList"));
const ReportedJobList   = lazy(() => import("@/pages/admin/settings/ReportedJobList"));
const MessageList       = lazy(() => import("@/pages/admin/MessageList"));
const Profile           = lazy(() => import("../../pages/admin/Profile"));
const CampusDashboard   = lazy(() => import("@/components/Campus/campusDashboard"));
const Courses           = lazy(() => import("@/pages/admin/courses/Courses"));

const Loader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
  </div>
);

const AdminLayout = () => {
  return (
    <AdminProtectWrapper>
      <div className="flex w-full overflow-hidden">

        <Sidebar />

        <div className="flex-1 mt-16 md:ml-52 bg-gray-100 dark:bg-gray-900 min-h-screen w-full overflow-x-hidden px-3 sm:px-4 md:px-6 transition-all duration-300">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/"                                    element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"                            element={<Dashboard />} />
              <Route path="users"                                element={<Users />} />
              <Route path="users/details/:userId"                element={<UserDetails />} />
              <Route path="user-details/:userId"                 element={<UserDetails />} />
              <Route path="companies"                            element={<CompanyList />} />
              <Route path="for-admin/company-details/:companyId" element={<CompanyDetails />} />
              <Route path="recruiters-list"                      element={<RecruitersList />} />
              <Route path="recruiters/:companyId"                element={<Recruiters />} />
              <Route path="recruiter/details/:recruiterId"       element={<RecruitersDetails />} />
              <Route path="jobs"                                 element={<Jobs />} />
              <Route path="job/details/:id"                      element={<JobDetail />} />
              <Route path="applicants-list/:id"                  element={<AppliedCandidatesList />} />
              <Route path="reports"                              element={<Reports />} />
              <Route path="settings"                             element={<Settings />} />
              <Route path="settings/add-admin"                   element={<AddAdmin />} />
              <Route path="settings/admin-list"                  element={<AdminList />} />
              <Route path="settings/reported-job-list"           element={<ReportedJobList />} />
              <Route path="messages"                             element={<MessageList />} />
              <Route path="profile"                              element={<Profile />} />
              <Route path="campus-dashboard"                     element={<CampusDashboard />} />
              <Route path="courses"                              element={<Courses />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </AdminProtectWrapper>
  );
};

export default AdminLayout;
