import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, X, PenSquare, Briefcase, PlusSquare,
  Building2, GraduationCap, TrendingUp, Trash2, UserPlus,
    Users, Gift,   FileText, Bot, MessageCircle, Calendar
} from "lucide-react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

/* eslint-disable react/prop-types */ 

const DashboardNavigations = ({ isOpen, onOpenChange }) => {
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  // State for sidebar toggle
  const [isCreateNewOpen, setCreateNewOpen] = useState(false);

  // Sidebar open state — driven entirely by parent via isOpen/onOpenChange
  const isSidebarOpen = !!isOpen;
  const setSidebarOpen = (open) => onOpenChange?.(open);
  //const closeSidebar = () => onOpenChange?.(false);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);



  // hasCompany: dual source of truth — user flag (login-time) OR live fetched company object
  const hasCompany = !!user?.isCompanyCreated || !!company;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg w-full text-sm font-medium transition ${isActive
      ? "bg-blue-600 text-white"
      : "text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white active:bg-gray-100 dark:active:bg-white/10 active:text-gray-900 dark:active:text-white"
    }`;

  const disabledLinkClass =
    "flex items-center gap-2 px-3 py-2 rounded-lg w-full text-sm opacity-40 cursor-not-allowed pointer-events-none text-slate-500 dark:text-slate-500";

  const iconClass = (isActive) =>
    isActive ? "text-white" : "text-blue-500 dark:text-blue-400";

  // Check if active status belongs to applicants main page or any detail sub-path
  const isApplicantsActive = location.pathname.startsWith(
    "/recruiter/dashboard/applicants-list"
  );

  const handleApplicantsClick = (e) => {
    e.preventDefault();
    if (!hasCompany) return;
    setSidebarOpen(false);
    window.location.href = "/recruiter/dashboard/applicants-list";
  };



  return (
    <>
      <Helmet>
        <title>
          Dashboard Navigation | GreatHires Hiring, Jobs, and Teams Management
        </title>
        <meta
          name="description"
          content="This intuitive dashboard by GreatHire allows modern companies to manage recruitment effectively from a single centralized platform."
        />
      </Helmet>

      


      {/* Mobile backdrop overlay — only when sidebar open on mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[55] bg-black/50"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      {/* Sidebar — full-height product rail */}
      <div
        className={`fixed top-0 left-0 z-[60] lg:z-40 h-screen w-64 transform bg-white dark:bg-[#0b1730] text-slate-700 dark:text-slate-200
            shadow-[4px_0_24px_rgba(2,6,23,.12)] dark:shadow-[4px_0_24px_rgba(2,6,23,.35)] border-r border-gray-200 dark:border-white/10 transition-transform duration-300 ease-in-out overflow-y-auto
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:w-52  `}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-gray-200 dark:border-white/10 px-3  ">
          <NavLink
            to="/recruiter/dashboard/home"
            className="flex min-w-0 items-center gap-2.5"
            onClick={() => setSidebarOpen(false)}
            aria-label="GreatHire dashboard home"
          >
            <img src="/greathire-navbar-logo.png" alt="GreatHire" className="h-9 w-[58px] shrink-0 object-contain rounded-md bg-white p-0.5" />
            <span className="truncate text-[1.05rem] font-extrabold tracking-tight text-gray-800 dark:text-white">
              Great<span style={{ color: "#2B53B4" }}>Hire</span>
            </span>
          </NavLink>
          <button
            type="button"
            className="lg:hidden relative z-[60] rounded-md p-1 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>


        <div className="flex flex-col gap-3 p-1.5">
          {/* Main Navigation */}
          <section>
            <p className="mb-2 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Workspace
            </p>
            <ul className="w-full flex flex-col gap-0.5 ">
              <NavLink
                to="/recruiter/dashboard/home"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Home size={25} className={iconClass(isActive)} />
                    <span>Home</span>
                  </>
                )}
              </NavLink>

              <li className="relative">
                <button
                  type="button"
                  onClick={() => setCreateNewOpen((prev) => !prev)}
                  className="flex items-center justify-between px-2 py-2 rounded-lg w-full text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white active:bg-gray-100 dark:active:bg-white/10 active:text-gray-900 dark:active:text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <PenSquare size={25} className="text-blue-500 dark:text-blue-400" />
                    <span>Create New</span>
                  </div>
                  <span className={`text-xs transition-transform duration-200 ${isCreateNewOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {isCreateNewOpen && (
                  <div className="mt-1 ml-4 pl-2 border-l-2 border-gray-200 dark:border-white/10 flex flex-col gap-1 sm:absolute sm:left-0 sm:top-full sm:w-44 sm:z-50 sm:bg-white dark:sm:bg-[#15233f] sm:border sm:border-gray-200 dark:sm:border-white/10 sm:shadow-xl sm:rounded-xl sm:py-2">
                    {!hasCompany && (
                      <NavLink
                        to="/recruiter/dashboard/create-company"
                        className={navLinkClass}
                        onClick={() => {
                          setSidebarOpen(false);
                          setCreateNewOpen(false);
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <Building2 size={25} className={iconClass(isActive)} />
                            <span>Company</span>
                          </>
                        )}
                      </NavLink>
                    )}

                    {hasCompany && user?.isActive && user?.emailId?.email === company?.adminEmail && (
                      <NavLink
                        to="/recruiter/dashboard/add-recruiter"
                        className={navLinkClass}
                        onClick={() => {
                          setSidebarOpen(false);
                          setCreateNewOpen(false);
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <UserPlus size={25} className={iconClass(isActive)} />
                            <span>Add Recruiter</span>
                          </>
                        )}
                      </NavLink>
                    )}

                    {hasCompany ? (
                      <NavLink
                        to="/recruiter/dashboard/post-job"
                        className={navLinkClass}
                        onClick={() => {
                          setSidebarOpen(false);
                          setCreateNewOpen(false);
                        }}
                      >
                        {({ isActive }) => (
                          <>
                            <PlusSquare size={25} className={iconClass(isActive)} />
                            <span>Post Job</span>
                          </>
                        )}
                      </NavLink>
                    ) : (
                      <span className={disabledLinkClass}>
                        <PlusSquare size={25} className="text-gray-400" />
                        <span>Post Job</span>
                      </span>
                    )}
                  </div>
                )}
              </li>

              <NavLink
                to="/recruiter/dashboard/jobs"
                className={hasCompany ? navLinkClass : () => disabledLinkClass}
                onClick={() => hasCompany && setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Briefcase size={25} className={hasCompany ? iconClass(isActive) : "text-gray-400"} />
                    <span>Jobs</span>
                  </>
                )}
              </NavLink>

              {/* Applicants */}
              <a
                href="/recruiter/dashboard/applicants-list"
                className={
                  hasCompany
                    ? navLinkClass({ isActive: isApplicantsActive })
                    : disabledLinkClass
                }
                onClick={handleApplicantsClick}
              >
                <Users
                  size={25}
                  className={
                    hasCompany ? iconClass(isApplicantsActive) : "text-gray-400"
                  }
                />
                <span>Applicants</span>
              </a>

              <NavLink
                to="/recruiter/dashboard/company-details"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Building2 size={25} className={iconClass(isActive)} />
                    <span>Company Details</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/recruiter/dashboard/candidate-list"
                className={hasCompany ? navLinkClass : () => disabledLinkClass}
                onClick={() => hasCompany && setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <GraduationCap size={25} className={hasCompany ? iconClass(isActive) : "text-gray-400"} />
                    <span>Find Candidates</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/recruiter/dashboard/resume-analyzer"
                className={hasCompany ? navLinkClass : () => disabledLinkClass}
                onClick={() => hasCompany && setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <FileText size={25} className={iconClass(isActive)} />
                    <span>Resume Analyzer</span>
                  </>
                )}
              </NavLink>
              {/* ✅ Messages */}
              <NavLink
                to="/messages"
                className={navLinkClass}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <MessageCircle size={25} className={iconClass(isActive)} />
                    <span>Messages</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/recruiter/dashboard/calendar"
                className={hasCompany ? navLinkClass : () => disabledLinkClass}
                onClick={() => hasCompany && setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Calendar size={25} className={hasCompany ? iconClass(isActive) : "text-gray-400"} />
                    <span>Calendar</span>
                  </>
                )}
              </NavLink>
            </ul>
          </section>


          {/* Footer: AI Copilot */}
          <NavLink
            to="/recruiter/dashboard/copilot"
            className={(state) =>
              `border-2 border-blue-600 dark:border-blue-500 ring-1 ring-blue-500/40 hover:ring-2 hover:ring-blue-500/60 ${navLinkClass(state)}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            {({ isActive }) => (
              <>
                <Bot size={25} className={iconClass(isActive)} />
                <span>AI Copilot</span>
              </>
            )}
          </NavLink>

          {/* Settings Section */}
          <section>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
              Settings
            </p>
            <ul className="flex flex-col gap-1">
              <NavLink
                to="/recruiter/dashboard/invite-and-earn"
                className={hasCompany ? navLinkClass : () => disabledLinkClass}
                onClick={() => hasCompany && setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Gift size={25} className={hasCompany ? iconClass(isActive) : "text-gray-400"} />
                    <span>Invite &amp; Earn</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/recruiter/dashboard/recruiter-list"
                className={hasCompany ? navLinkClass : () => disabledLinkClass}
                onClick={() => hasCompany && setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <Users size={25} className={hasCompany ? iconClass(isActive) : "text-gray-400"} />
                    <span>Recruiters</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to={
                  hasCompany
                    ? (company?.maxPostJobs === 0 ? "/recruiter/dashboard/packages" : "/recruiter/dashboard/your-plans")
                    : "/recruiter/dashboard/create-company"
                }
                className={hasCompany ? navLinkClass : () => disabledLinkClass}
                onClick={() => hasCompany && setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <TrendingUp size={25} className={hasCompany ? iconClass(isActive) : "text-gray-400"} />
                    <span>
                      {hasCompany
                        ? (company?.maxPostJobs === 0 ? "Upgrade Plans" : "Current Plan")
                        : "Current Plan"}
                    </span>
                  </>
                )}
              </NavLink>

              {hasCompany && user?.emailId?.email === company?.adminEmail && (
                <NavLink
                  to="/recruiter/dashboard/delete-account"
                  className={navLinkClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <Trash2 size={25} className={iconClass(isActive)} />
                      <span>Delete Account</span>
                    </>
                  )}
                </NavLink>
              )}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default DashboardNavigations;