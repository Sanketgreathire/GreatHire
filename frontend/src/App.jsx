import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/user/Signup.jsx";
import RecrutierSignup from "./components/auth/recruiter/Signup.jsx";
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
import VerifyRecruiter from "./pages/recruiter/VerifyRecruiter";

// Recruiter Routes
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/PostJob";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import AddRecruiter from "./pages/recruiter/AddRecruiter";
import CompanyDetails from "./pages/recruiter/CompanyDetails";
import CreateCompany from "./pages/recruiter/CreateCompany";
import JobList from "./pages/recruiter/JobList";
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import RecruiterPlans from "./pages/recruiter/RecruiterPlans";

import { useEffect } from "react";
import { logOut } from "./redux/authSlice.js";
import { useDispatch } from "react-redux";

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
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/apply",
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
    element: <RecrutierSignup />,
  },

  {
    path: "/recruiter/dashboard",
    element: <RecruiterDashboard />,
    children: [
      { path: "home", element: <RecruiterHome /> },
      { path: "create-company", element: <CreateCompany /> },
      { path: "add-recruiter", element: <AddRecruiter /> },
      { path: "post-job", element: <PostJob /> },
      { path: "jobs", element: <JobList /> },
      { path: "company-details", element: <CompanyDetails /> },
      { path: "your-plans", element: <RecruiterPlans /> },
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
    path: "/verify-recruiter/:token",
    element: <VerifyRecruiter />,
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
        <RouterProvider router={appRouter} />
      </JobDetailsProvider>
    </div>
  );
}

export default App;
