import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "./redux/authSlice.js";
import { USER_API_END_POINT } from "./utils/ApiEndPoint";

import JobDetailsProvider from "./context/JobDetailsContext";
import { NotificationProvider } from './context/NotificationContext';
import { MessageProvider } from './context/MessageContext';

import ProtectedUserRoute from "./components/user/ProtectedUserRoute";
import ProtectedRecruiterRoute from "./components/recruiter/ProtectedRecruiterRoute";

// ── Auth ──
const Home                   = lazy(() => import("./pages/Home"));
const AuthPage               = lazy(() => import('./components/auth/user/AuthPage'));
const JobseekerLogin         = lazy(() => import('@/components/auth/user/JobseekerLogin'));
const RecruiterLogin         = lazy(() => import('@/components/auth/recruiter/RecruiterLogin'));
const SignupPage              = lazy(() => import("./components/shared/SignupPage"));
const JobSeekerSignup         = lazy(() => import("./components/auth/user/Signup"));
const RecruiterSignup         = lazy(() => import("./components/auth/recruiter/Signup.jsx"));
const VerifyEmail             = lazy(() => import("./components/VerifyEmail"));
const VerifyNumber            = lazy(() => import("./components/VerifyNumber"));
const ForgotPassword          = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword           = lazy(() => import("./pages/ResetPassword"));
const PageNotFound            = lazy(() => import("./pages/PageNotFound"));

// ── User pages ──
const Jobs                   = lazy(() => import("./pages/job/Jobs"));
const JobDescription         = lazy(() => import("./pages/job/JobDescription"));
const SavedJobs              = lazy(() => import("./pages/job/SavedJob"));
const MainApply              = lazy(() => import("./components/ApplyJobs/MainApply"));
const ReportJob              = lazy(() => import("./pages/job/ReportJob"));
const Success                = lazy(() => import("./pages/job/Success"));
const UserProfile            = lazy(() => import("./pages/user/UserProfile"));
const ResumeAnalyzer         = lazy(() => import("./components/ResumeAnalyzer"));
const ReferAndBoost          = lazy(() => import("./pages/ReferAndBoost"));
const NotificationPage       = lazy(() => import("./components/notifications/NotificationPage"));
const MessagingPage          = lazy(() => import("./components/messaging/MessagingPage"));

// ── Service / info pages ──
const About                  = lazy(() => import("./pages/services/About"));
const Contact                = lazy(() => import("./pages/services/Contact"));
const OurService             = lazy(() => import("./pages/services/OurService"));
const Blogs                  = lazy(() => import("./components/Main_blog_page"));
const BlogDetail             = lazy(() => import("./pages/services/BlogDetail"));
const PrivacyPolicy          = lazy(() => import("./pages/policies/PrivacyPolicy"));
const RefundAndReturnPolicy  = lazy(() => import("./pages/policies/RefundAndReturnPolicy"));
const TermsAndConditions     = lazy(() => import("./pages/policies/TermsAndConditions"));
const HowWeHire              = lazy(() => import("./components/HowWeHire"));
const TheFutureTechnology    = lazy(() => import("./components/TheFutureTechnology"));
const HiringInsights         = lazy(() => import("./pages/HiringInsights"));
const InsightDetail          = lazy(() => import("./pages/InsightDetail"));
const InsightsDashboard      = lazy(() => import("./pages/InsightsDashboard"));
const InsightApproval        = lazy(() => import("./pages/InsightApproval"));
const CareerAdvice           = lazy(() => import("./components/CareerAdvice"));
const TheFuture              = lazy(() => import("./components/TheFuture"));
const ProductDetailPage      = lazy(() => import("./components/ProductDetailPage"));

// ── Recruiter pages ──
const RecruiterDashboard     = lazy(() => import("./pages/recruiter/RecruiterDashboard"));
const RecruiterHome          = lazy(() => import("./pages/recruiter/RecruiterHome"));
const PostJob                = lazy(() => import("./pages/recruiter/postJob/PostJob"));
const RecruiterProfile       = lazy(() => import("./pages/recruiter/RecruiterProfile"));
const AddRecruiter           = lazy(() => import("./pages/recruiter/AddRecruiter"));
const CompanyDetails         = lazy(() => import("./pages/recruiter/CompanyDetails"));
const CreateCompany          = lazy(() => import("./pages/recruiter/CreateCompany"));
const PostedJobList          = lazy(() => import("./pages/recruiter/PostedJobList"));
const RecruiterPlans         = lazy(() => import("./pages/recruiter/RecruiterPlans"));
const JobDetail              = lazy(() => import("./pages/recruiter/JobDetail"));
const RecruiterList          = lazy(() => import("./pages/recruiter/RecruiterList"));
const AppliedCandidatesList  = lazy(() => import("./pages/recruiter/AppliedCandidatesList"));
const RecruitersDetails      = lazy(() => import("./pages/recruiter/rec_job_details/RecruitersDetails"));
const CurrentPlans           = lazy(() => import("./pages/recruiter/CurrentPlans"));
const CandidateList          = lazy(() => import("./pages/recruiter/candidate/CandidateList"));
const CandidateInformation   = lazy(() => import("./pages/recruiter/candidate/CandidateInformation"));
const CandidatePlans         = lazy(() => import("./pages/recruiter/candidate/CandidatePlans"));
const CandidateDatabase      = lazy(() => import("./pages/recruiter/candidate/CandidateDatabase"));
const AllApplicantsList      = lazy(() => import("./pages/recruiter/AllApplicantsList"));
const DeleteAccount          = lazy(() => import("./pages/recruiter/DeleteAccount"));
const InviteAndEarn          = lazy(() => import("./pages/recruiter/InviteAndEarn"));
const RecruiterResumeAnalyzer = lazy(() => import("./pages/recruiter/ResumeAnalyzer"));

// ── Admin / DigitalMarketer ──
const AdminLogin             = lazy(() => import("./components/auth/admin/AdminLogin"));
const AdminLayout            = lazy(() => import("./components/admin/AdminLayout"));
const DigitalMarketerLogin   = lazy(() => import("./components/auth/digitalmarketer/DigitalMarketerLogin"));

// ── Campus ──
const CampusPlacementDashboard = lazy(() => import('@/components/Campus/campusDashboard'));
const CollegeDetails           = lazy(() => import('@/components/Campus/CollegeDetails'));
const CollegeLogin             = lazy(() => import('@/components/Campus/CollegeLogin'));
const CollegeSignup            = lazy(() => import('@/components/Campus/CollegeSignup'));
const StudentSignup            = lazy(() => import('@/components/Campus/StudentSignup'));

// ── Courses ──
const TrainingCoursesPage      = lazy(() => import('./pages/course/CourseMain'));
const PythonCoursePage         = lazy(() => import('./pages/course/python'));
const JavaCoursePage           = lazy(() => import('./pages/course/java'));
const DataSciencePage          = lazy(() => import('./pages/course/DataScience'));
const DigitalMarketingPage     = lazy(() => import('./pages/course/DigitalMarketing'));
const DataAnalyticsPage        = lazy(() => import('./pages/course/DataAnalytics'));
const SalesforcePage           = lazy(() => import('./pages/course/saleforcePage'));
const AWSDevOpsCoursePage      = lazy(() => import('./pages/course/AWSDevOpsCoursePage'));
const BIMCoursePage            = lazy(() => import('./pages/course/BIMCoursePage'));
const MedicalCodingCoursePage  = lazy(() => import('./pages/course/MedicalCodingCoursePage'));
const SAPFICOCoursePage        = lazy(() => import('./pages/course/SAPFICOCoursePage'));
const TestingToolsCoursePage   = lazy(() => import('./pages/course/TestingToolsCoursePage'));
const VLSICoursePage           = lazy(() => import('./pages/course/VLSICoursePage'));
const MultimediaCoursePage     = lazy(() => import('./pages/course/MultimediaCoursePage'));
const AdvancedExcelCoursePage  = lazy(() => import('./pages/course/AdvancedExcelCoursePage'));
const AutoCADCoursePage        = lazy(() => import('./pages/course/AutoCADCoursePage'));
const RevitMEPCoursePage       = lazy(() => import('./pages/course/RevitMEPCoursePage'));
const BusinessAnalystPage      = lazy(() => import('./pages/course/BusinessAnalystPage'));
const GenerativeAIPage         = lazy(() => import('./pages/course/GenerativeAIPage'));
const SAPMMPage                = lazy(() => import('./pages/course/SAPMMPage'));
const CyberSecurityPage        = lazy(() => import('./pages/course/CyberSecurityPage'));
const PMPPage                  = lazy(() => import('./pages/course/PMPPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/Main_blog_page", element: <Blogs /> },
  { path: "/blogs/:slug", element: <Blogs /> },
  { path: "/blog/:id", element: <BlogDetail /> },
  { path: "/about", element: <About /> },
  { path: "/auth", element: <AuthPage /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/signup", element: <AuthPage /> },
  { path: "/great-hire/services", element: <OurService /> },
  { path: "/contact", element: <Contact /> },
  { path: "/HowWeHire", element: <HowWeHire /> },
  { path: "/TheFutureTechnology", element: <TheFutureTechnology /> },
  { path: "/HiringInsights", element: <HiringInsights /> },
  { path: "/InsightDetail/:id", element: <InsightDetail /> },
  { path: "/InsightsDashboard", element: <InsightsDashboard /> },
  { path: "/InsightApproval", element: <InsightApproval /> },
  { path: "/hiring-insights/:id", element: <InsightDetail /> },
  { path: "/CareerAdvice", element: <CareerAdvice /> },
  { path: "/CareerAdvice/:id", element: <CareerAdvice /> },
  { path: "/TheFuture", element: <TheFuture /> },
  { path: "/TheFuture/:id", element: <TheFuture /> },
  { path: "/ResumeAnalyzer", element: <ProtectedUserRoute><ResumeAnalyzer /></ProtectedUserRoute> },
  { path: "/recruiter/resume-analyzer", element: <ProtectedRecruiterRoute><Navigate to="/recruiter/dashboard/resume-analyzer" replace /></ProtectedRecruiterRoute> },
  { path: "/refer-and-boost", element: <ProtectedUserRoute><ReferAndBoost /></ProtectedUserRoute> },
  { path: "/jobseeker-login", element: <JobseekerLogin /> },
  { path: "/recruiter-login", element: <RecruiterLogin /> },
  { path: "/signup-choice", element: <SignupPage /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  { path: "/verify-number", element: <VerifyNumber /> },
  { path: "/jobs", element: <ProtectedUserRoute><Jobs /></ProtectedUserRoute> },
  { path: "/jobs/:jobId", element: <JobDescription /> },
  { path: "/description", element: <JobDescription /> },
  { path: "/saved-jobs", element: <ProtectedUserRoute><SavedJobs /></ProtectedUserRoute> },
  { path: "/apply/:jobId", element: <ProtectedUserRoute><MainApply /></ProtectedUserRoute> },
  { path: "/profile", element: <ProtectedUserRoute><UserProfile /></ProtectedUserRoute> },
  { path: "/report-job", element: <ProtectedUserRoute><ReportJob /></ProtectedUserRoute> },
  { path: "/success", element: <ProtectedUserRoute><Success /></ProtectedUserRoute> },
  { path: "/policy/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/policy/refund-policy", element: <RefundAndReturnPolicy /> },
  { path: "/policy/terms-and-conditions", element: <TermsAndConditions /> },
  { path: "/packages", element: <RecruiterPlans /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/notifications", element: <NotificationPage /> },
  { path: "/messages", element: <ProtectedUserRoute><MessagingPage /></ProtectedUserRoute> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/recruiter/signup", element: <RecruiterSignup /> },
  { path: "/description/:id", element: <JobDetail /> },
  { path: "/ProductDetailPage/:id", element: <ProductDetailPage /> },
  {
    path: "/recruiter/dashboard",
    element: <ProtectedRecruiterRoute><RecruiterDashboard /></ProtectedRecruiterRoute>,
    children: [
      { index: true, element: <RecruiterHome /> },
      { path: "home", element: <RecruiterHome /> },
      { path: "create-company", element: <CreateCompany /> },
      { path: "add-recruiter", element: <AddRecruiter /> },
      { path: "post-job", element: <PostJob /> },
      { path: "jobs", element: <PostedJobList /> },
      { path: "company-details", element: <CompanyDetails /> },
      { path: "applicants-list", element: <AllApplicantsList /> },
      { path: "candidate-list", element: <CandidateList /> },
      { path: "candidate-information/:id", element: <CandidateInformation /> },
      { path: "candidate-database", element: <CandidateDatabase /> },
      { path: "candidate-plans", element: <CandidatePlans /> },
      { path: "your-plans", element: <CurrentPlans /> },
      { path: "upgrade-plans", element: <RecruiterPlans /> },
      { path: "delete-account", element: <DeleteAccount /> },
      { path: "invite-and-earn", element: <InviteAndEarn /> },
      { path: "recruiter-list", element: <RecruiterList /> },
      { path: "recruiter-details/:recruiterId", element: <RecruitersDetails /> },
      { path: "job-details/:id", element: <JobDetail /> },
      { path: "applicants-details/:id", element: <AppliedCandidatesList /> },
      { path: "resume-analyzer", element: <RecruiterResumeAnalyzer /> },
      { path: "applications/:jobId/:candidateId", element: <CandidateInformation /> },
    ],
  },
  { path: "/recruiter/profile", element: <ProtectedRecruiterRoute><RecruiterProfile /></ProtectedRecruiterRoute> },
  { path: "/recruiter/add-user", element: <ProtectedRecruiterRoute><AddRecruiter /></ProtectedRecruiterRoute> },
  { path: "/digitalmarketer/login", element: <DigitalMarketerLogin /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/*", element: <AdminLayout /> },
  { path: "/campus-hiring", element: <CollegeLogin /> },
  { path: "/campus-dashboard", element: <CampusPlacementDashboard /> },
  { path: "/college/login", element: <CollegeLogin /> },
  { path: "/college/signup", element: <CollegeSignup /> },
  { path: "/student/signup", element: <StudentSignup /> },
  { path: "/college-details", element: <CollegeDetails /> },
  { path: "/courses", element: <TrainingCoursesPage /> },
  { path: "/courses/python-training", element: <PythonCoursePage /> },
  { path: "/courses/java-training", element: <JavaCoursePage /> },
  { path: "/courses/data-science-training", element: <DataSciencePage /> },
  { path: "/courses/digital-marketing-training", element: <DigitalMarketingPage /> },
  { path: "/courses/data-analytics-training", element: <DataAnalyticsPage /> },
  { path: "/courses/saleforce-training", element: <SalesforcePage /> },
  { path: "/courses/aws-devops-training", element: <AWSDevOpsCoursePage /> },
  { path: "/courses/bim-training", element: <BIMCoursePage /> },
  { path: "/courses/medical-training", element: <MedicalCodingCoursePage /> },
  { path: "/courses/sap-fico-training", element: <SAPFICOCoursePage /> },
  { path: "/courses/testing-tools-training", element: <TestingToolsCoursePage /> },
  { path: "/courses/vlsi-training", element: <VLSICoursePage /> },
  { path: "/courses/multimedia-training", element: <MultimediaCoursePage /> },
  { path: "/courses/advanced-excel-training", element: <AdvancedExcelCoursePage /> },
  { path: "/courses/autocad-training", element: <AutoCADCoursePage /> },
  { path: "/courses/revit-mep-training", element: <RevitMEPCoursePage /> },
  { path: "/courses/business-analytics-training", element: <BusinessAnalystPage /> },
  { path: "/courses/generative-AI-training", element: <GenerativeAIPage /> },
  { path: "/courses/sap-mm-training", element: <SAPMMPage /> },
  { path: "/courses/cyber-security-training", element: <CyberSecurityPage /> },
  { path: "/courses/pmp-training", element: <PMPPage /> },
  { path: "*", element: <PageNotFound /> },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${USER_API_END_POINT}/me`, { withCredentials: true })
      .then((res) => { if (res.data.success) dispatch(setUser(res.data.user)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister());
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <JobDetailsProvider>
        <NotificationProvider>
          <MessageProvider>
            <Suspense fallback={<PageLoader />}>
              <RouterProvider router={appRouter} />
            </Suspense>
          </MessageProvider>
        </NotificationProvider>
      </JobDetailsProvider>
    </div>
  );
}

export default App;
