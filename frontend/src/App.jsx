import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/user/Signup.jsx";
import RecruiterSignup from "./components/auth/recruiter/Signup.jsx";
import Contact from "./pages/services/Contact";
import Home from "./pages/Home";
import JobDescription from "./pages/job/JobDescription";
import Jobs from "./pages/job/Jobs";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import RefundAndReturnPolicy from "./pages/policies/RefundAndReturnPolicy";
import TermsAndConditions from "./pages/policies/TermsAndConditions";
import UserProfile from "./pages/user/UserProfile";
import OurService from "./pages/services/OurService";
import { JobDetailsProvider } from "./context/JobDetailsContext";

import MainApply from "./components/ApplyJobs/MainApply";
import ReportJob from "./pages/job/ReportJob";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Success from "./pages/Success";
import PageNotFound from "./pages/PageNotFound";
import JobServicePlans from "./pages/services/JobServicePlans";

// Recruiter Routes
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/postJob/PostJob";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import AddRecruiter from "./pages/recruiter/AddRecruiter";
import CompanyDetails from "./pages/recruiter/CompanyDetails";
import CreateCompany from "./pages/recruiter/CreateCompany";
import PostedJobList from "./pages/recruiter/PostedJobList";
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import RecruiterPlans from "./pages/recruiter/RecruiterPlans";
import JobDetail from "./pages/recruiter/JobDetail";
import RecruiterList from "./pages/recruiter/RecruiterList";
import AppliedCandidatesList from "./pages/recruiter/AppliedCandidatesList";
import RecruitersDetails from "./pages/recruiter/rec_job_details/RecruitersDetails";
import CurrentPlans from "./pages/recruiter/CurrentPlans";
import RecruiterSuccess from "./pages/recruiter/RecruiterSuccess";
import CandidateList from "./pages/recruiter/candidate/CandidateList";
import CandidatePlans from "./pages/recruiter/candidate/CandidatePlans";
import AllApplicantsList from "./pages/recruiter/AllApplicantsList";

// Admin Routes
import AdminSignup from "./components/auth/admin/AdminSignup";
import AdminLogin from "./components/auth/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AddAdmin from "./pages/admin/AddAdmin";
import AdminList  from "./pages/admin/AdminList"
import ReportedJobList from "./pages/admin/ReportedJobList";

import { useEffect } from "react";
import { logOut } from "./redux/authSlice.js";
import { useDispatch } from "react-redux";

import VerifyEmail from "./components/VerifyEmail";
import VerifyNumber from "./components/VerifyNumber";
import DeleteAccount from "./pages/recruiter/DeleteAccount";
import { Worker } from "@react-pdf-viewer/core";
import SavedJobs from "./pages/job/SavedJob";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/verify-number",
    element: <VerifyNumber />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description",
    element: <JobDescription />,
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />,
  },
  {
    path: "/apply/:jobId",
    element: <MainApply />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },
  {
    path: "/policy/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/policy/refund-policy",
    element: <RefundAndReturnPolicy />,
  },
  {
    path: "/policy/terms-and-conditions",
    element: <TermsAndConditions />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/report-job/:id",
    element: <ReportJob />,
  },
  {
    path: "/success",
    element: <Success />,
  },
  {
    path: "/great-hire/services",
    element: <OurService />,
  },
  {
    path: "/job-service/plans",
    element: <JobServicePlans />,
  },
  {
    path: "/recruiter/signup",
    element: <RecruiterSignup />,
  },

  // Recruiter dashboard navlink
  {
    path: "/recruiter/dashboard",
    element: <RecruiterDashboard />,
    children: [
      { path: "home", element: <RecruiterHome /> },
      { path: "create-company", element: <CreateCompany /> },
      { path: "add-recruiter", element: <AddRecruiter /> },
      { path: "post-job", element: <PostJob /> },
      { path: "jobs", element: <PostedJobList /> },
      { path: "company-details", element: <CompanyDetails /> },
      { path: "applicants-list", element: <AllApplicantsList /> },
      { path: "candidate-list", element: <CandidateList /> },
      { path: "candidate-plans", element: <CandidatePlans /> },
      { path: "your-plans", element: <CurrentPlans /> },
      { path: "upgrade-plans", element: <RecruiterPlans /> },
      { path: "delete-account", element: <DeleteAccount /> },
      { path: "recruiter-list", element: <RecruiterList /> },
      {
        path: "recruiter-details/:recruiterId",
        element: <RecruitersDetails />,
      },
      { path: "job-details/:id", element: <JobDetail /> },
      { path: "applicants-details/:id", element: <AppliedCandidatesList /> },
      { index: true, element: <RecruiterHome /> },
    ],
  },
  {
    path: "/recruiter/profile",
    element: <RecruiterProfile />,
  },
  {
    path: "/recruiter/add-user",
    element: <AddRecruiter />,
  },

  {
    path: "/recruiter/success",
    element: <RecruiterSuccess />,
  },

  {
    path: "/admin/signup",
    element: <AdminSignup />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/add-admin",
    element: <AddAdmin />,
  },
  {
    path: "/admin/admin-list",
    element: <AdminList />,
  },
  {
    path: "/admin/reported-job-list",
    element: <ReportedJobList />, 
  },
  {
    path: "/admin/*",
    element: <AdminLayout />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },

]);

function App() {
  const dispatch = useDispatch();

  // this code run for check token in cookies
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop().split(";").shift();
      }
      return null; // Return null if cookie does not exist
    };
    const token = getCookie("token");

    if (!token) {
      dispatch(logOut());
    }
  }, []);

  return (
    <div>
      <JobDetailsProvider>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
          <RouterProvider router={appRouter} />
        </Worker>
      </JobDetailsProvider>
    </div>
  );
}

export default App;
