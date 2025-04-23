import { createBrowserRouter, RouterProvider } from "react-router-dom";
import JobDetailsProvider from "./context/JobDetailsContext";

// Auth
import ProtectedUserRoute from "./components/user/ProtectedUserRoute";
import ProtectedRecruiterRoute from "./components/recruiter/ProtectedRecruiterRoute";
import Login from "./components/auth/Login";
import Signup from "./components/auth/user/Signup.jsx";

// Pages
import Home from "./pages/Home";
import UserProfile from "./pages/user/UserProfile";
import JobDescription from "./pages/job/JobDescription";
import Jobs from "./pages/job/Jobs";
import MainApply from "./components/ApplyJobs/MainApply";
import ReportJob from "./pages/job/ReportJob";
import Success from "./pages/job/Success";
import SavedJobs from "./pages/job/SavedJob";
import Contact from "./pages/services/Contact";
import OurService from "./pages/services/OurService";
import Blogs from "./pages/services/Blogs";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import RefundAndReturnPolicy from "./pages/policies/RefundAndReturnPolicy";
import TermsAndConditions from "./pages/policies/TermsAndConditions";
import About from "./pages/services/About";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";

// Recruiter Pages
import RecruiterSignup from "./components/auth/recruiter/Signup.jsx";
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
import CandidateList from "./pages/recruiter/candidate/CandidateList";
import CandidatePlans from "./pages/recruiter/candidate/CandidatePlans";
import AllApplicantsList from "./pages/recruiter/AllApplicantsList";
import DeleteAccount from "./pages/recruiter/DeleteAccount";

// Other Roles
import DigitalMarketerLogin from "./components/auth/digitalmarketer/DigitalMarketerLogin";
import AdminLogin from "./components/auth/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";

// Redux
import { useEffect } from "react";
import { logOut } from "./redux/authSlice.js";
import { useDispatch } from "react-redux";

// Verification
import VerifyEmail from "./components/VerifyEmail";
import VerifyNumber from "./components/VerifyNumber";

// PDF
import { Worker } from "@react-pdf-viewer/core";

// ✅ Chatbot Widget
import ChatbotWidget from "./components/ChatbotWidget";

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/about", element: <About /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/verify-number", element: <VerifyNumber /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/description", element: <JobDescription /> },
  { path: "/saved-jobs", element: <ProtectedUserRoute><SavedJobs /></ProtectedUserRoute> },
  { path: "/apply/:jobId", element: <ProtectedUserRoute><MainApply /></ProtectedUserRoute> },
  { path: "/profile", element: <ProtectedUserRoute><UserProfile /></ProtectedUserRoute> },
  { path: "/report-job", element: <ProtectedUserRoute><ReportJob /></ProtectedUserRoute> },
  { path: "/success", element: <ProtectedUserRoute><Success /></ProtectedUserRoute> },
  { path: "/policy/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/policy/refund-policy", element: <RefundAndReturnPolicy /> },
  { path: "/policy/terms-and-conditions", element: <TermsAndConditions /> },
  { path: "/contact", element: <Contact /> },
  { path: "/great-hire/services", element: <OurService /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/recruiter/signup", element: <RecruiterSignup /> },
  {
    path: "/recruiter/dashboard",
    element: <ProtectedRecruiterRoute><RecruiterDashboard /></ProtectedRecruiterRoute>,
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
      { path: "recruiter-details/:recruiterId", element: <RecruitersDetails /> },
      { path: "job-details/:id", element: <JobDetail /> },
      { path: "applicants-details/:id", element: <AppliedCandidatesList /> },
      { index: true, element: <RecruiterHome /> },
    ]
  },
  { path: "/recruiter/profile", element: <ProtectedRecruiterRoute><RecruiterProfile /></ProtectedRecruiterRoute> },
  { path: "/recruiter/add-user", element: <ProtectedRecruiterRoute><AddRecruiter /></ProtectedRecruiterRoute> },
  { path: "/digitalmarketer/login", element: <DigitalMarketerLogin /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/*", element: <AdminLayout /> },
  { path: "*", element: <PageNotFound /> }
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };
    const token = getCookie("token");
    if (!token) dispatch(logOut());
  }, []);

  // Optional: unregister previous service workers
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }

  return (
    <div>
      <JobDetailsProvider>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
          <RouterProvider router={appRouter} />
          {/* ✅ Include floating chatbot widget globally */}
          <ChatbotWidget />
        </Worker>
      </JobDetailsProvider>
    </div>
  );
}

export default App;
