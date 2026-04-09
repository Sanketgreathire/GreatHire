import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "@/redux/authSlice";
import { removeCompany } from "@/redux/companySlice";
import { removeJobPlan } from "@/redux/jobPlanSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { cleanRecruiterRedux } from "@/redux/recruiterSlice";
import NotificationDropdown from "../notifications/NotificationDropdown.jsx";
import ThemeToggle from "../ThemeToggle";
import InternshipMarquee from "./InternshipMarquee";
import { useJobDetails } from "@/context/JobDetailsContext";

// ─────────────────────────────────────────────────────────────
// Reusable 2-column Explore Dropdown Panel
// Left  → nav links with icons + descriptions
// Right → Campus Hiring & Student Sign Up action cards
// ─────────────────────────────────────────────────────────────
const ExploreDropdownPanel = ({ links, location, onLinkClick, onCampusClick, onStudentClick, dark = false }) => {
  const linkIcons = {
    Blogs: "✍️",
    Courses: "🎓",
    "About Us": "🏢",
    "Contact Us": "📬",
    "Privacy Policy": "🔒",
    "Our Services": "⚡",
  };

  return (
    // Panel container — wide enough for 2 columns
    <div
      className="absolute right-0 mt-2 z-50 rounded-2xl shadow-2xl border overflow-hidden bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
      style={{
        width: "min(560px, 92vw)",
        boxShadow: "0 20px 60px rgba(99,102,241,0.13), 0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      {/* Top label strip */}
      <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Explore everything
        </span>
      </div>

      {/* ── 2-column grid ── */}
      <div className="grid grid-cols-2">

        {/* ── LEFT: Nav Links ── */}
        <div className="p-3 border-r border-gray-100 dark:border-gray-700">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-2 mb-2">
            Pages
          </p>
          <div className="space-y-0.5">
            {links.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onLinkClick}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl group transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/40"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/60"
                  }`}
                >
                  <span className="text-base leading-none w-6 text-center shrink-0">
                    {linkIcons[label] || "🔗"}
                  </span>
                  <span
                    className={`text-sm font-medium leading-tight transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}
                  >
                    {label}
                  </span>
                  {/* Hover arrow */}
                  <svg
                    className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-blue-400 shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.17 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Login Buttons ── */}
        <div className="p-4 flex flex-col justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1">
            Quick Access
          </p>

          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            {/* Campus Hiring */}
            <button
              onClick={onCampusClick}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🏛️</span>
                Campus Hiring
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25">Popular</span>
            </button>

            {/* Student Sign Up */}
            <button
              onClick={onStudentClick}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                Student Sign Up
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25">Free</span>
            </button>
          </div>

          {/* Footer hint */}
          <p className="text-[10px] text-gray-400 dark:text-gray-500 px-1 pt-2 border-t border-gray-100 dark:border-gray-700">
            Already have an account?{" "}
            <Link
              to="/jobseeker-login"
              onClick={onLinkClick}
              className="text-blue-500 hover:underline font-medium"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Navbar
// ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const { jobs } = useJobDetails();
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role?.includes("recruiter");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const moreMenuRef = useRef(null);
  const exploreMenuRef = useRef(null);

  const logoRedirectPath = !user
    ? "/"
    : user?.role === "recruiter"
    ? "/recruiter/dashboard/home"
    : "/jobs";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target)) {
        setIsExploreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
        timeout: 10000,
      });

      if (response.data.success) {
        dispatch(logOut());
        if (user?.role === "recruiter") {
          dispatch(removeCompany());
          dispatch(cleanRecruiterRedux());
          dispatch(removeJobPlan());
        }
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error("Error in logout");
      }
    } catch (err) {
      console.error("Logout error:", err);
      dispatch(logOut());
      if (user?.role === "recruiter") {
        dispatch(removeCompany());
        dispatch(cleanRecruiterRedux());
        dispatch(removeJobPlan());
      }
      setIsProfileMenuOpen(false);
      setIsMenuOpen(false);
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const primaryNavLinks = [
    ...(isRecruiter ? [{ to: "/recruiter/dashboard/home", label: "Dashboard" }] : []),
  ];

  const rightNavLinks = user
    ? [
        ...(!isRecruiter ? [{ to: "/jobs", label: "Jobs" }] : []),
        ...(user && !isRecruiter ? [{ to: "/ResumeAnalyzer", label: "Resume Analyzer" }] : []),
        ...(!isRecruiter ? [{ to: "/refer-and-boost", label: "Refer & Boost" }] : []),
        ...(isRecruiter ? [{ to: "/packages", label: "Recruiter Plans" }] : []),
        ...(isRecruiter ? [{ to: "/recruiter/dashboard/resume-analyzer", label: "Resume Analyzer" }] : []),
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/great-hire/services", label: "Our Services" },
        { to: "/packages", label: "Recruiter Plans" },
      ];

  // Links shown inside the Explore dropdown
  const moreDropdownLinks = [
    { to: "/Main_blog_page",        label: "Blogs" },
    { to: "/courses",               label: "Courses" },
    { to: "/about",                 label: "About Us" },
    { to: "/contact",               label: "Contact Us" },
    { to: "/policy/privacy-policy", label: "Privacy Policy" },
  ];

  const mobileNavLinks = [
    ...primaryNavLinks,
    ...(user && !isRecruiter ? [{ to: "/jobs", label: "Jobs" }] : []),
    ...(user && !isRecruiter ? [{ to: "/resume-analyzer", label: "Resume Analyzer" }] : []),
    ...(!user || isRecruiter ? [{ to: "/packages", label: "Recruiter Plans" }] : []),
    ...(isRecruiter ? [{ to: "/recruiter/dashboard/resume-analyzer", label: "Resume Analyzer" }] : []),
    { to: "/great-hire/services", label: "Our Services" },
    { to: "/Main_blog_page",      label: "Blogs" },
    { to: "/courses",             label: "Courses" },
    { to: "/about",               label: "About Us" },
    { to: "/contact",             label: "Contact Us" },
  ];


  const policyLinks = [
    { to: "/policy/privacy-policy", label: "Privacy Policy" },

  ];

 

  const activeClass = "text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300";
  const inactiveClass =
    "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-700";

  // Shared handler to close all dropdowns + navigate
  const closePanelAndNavigate = (path) => {
    setIsMoreMenuOpen(false);
    setIsExploreMenuOpen(false);
    setIsMenuOpen(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className="pl-8 fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-300 dark:border-gray-400 z-30 dark:bg-gray-800 dark:text-white transition-colors duration-300 px-4 py-3">
        <div className="flex items-center justify-between w-full">

          {/* Logo */}
          <Link to={logoRedirectPath} className="cursor-pointer pl-2">
            <h2 className="text-3xl sm:text-6xl lg:text-4xl font-bold hover:text-blue-600 transition duration-300 ease-in-out">
              <span className="text-black dark:text-white">Great</span>
              <span className="text-blue-600">Hire</span>
            </h2>
          </Link>

          <div>
            {/* ── DESKTOP NAVIGATION ── */}
            <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:ml-8">

              {/* Left: primary nav */}
              <div className="flex items-center gap-6">
                <ul className="flex items-center gap-6">
                  {primaryNavLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          location.pathname === to ? activeClass : inactiveClass
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: main links + Explore dropdown + user actions */}
              <div className="flex items-center gap-4 justify-end">
                <div className="flex items-center gap-4">
                  <ul className="flex items-center gap-4">

                    {/* Direct right nav links */}
                    {rightNavLinks.map(({ to, label }) => (
                      <li key={to}>
                        <Link
                          to={to}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            location.pathname === to ? activeClass : inactiveClass
                          }`}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}

                    {/* ── "Explore" 2-column dropdown — LOGGED-IN users ── */}
                    {user && (
                      <li ref={exploreMenuRef} className="relative">
                        <button
                          onClick={() => setIsExploreMenuOpen(!isExploreMenuOpen)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isExploreMenuOpen
                              ? "text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300"
                              : inactiveClass
                          }`}
                          aria-expanded={isExploreMenuOpen}
                          aria-haspopup="true"
                        >
                          Explore
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExploreMenuOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isExploreMenuOpen && (
                          <ExploreDropdownPanel
                            links={moreDropdownLinks}
                            location={location}
                            onLinkClick={() => setIsExploreMenuOpen(false)}
                            onCampusClick={() => closePanelAndNavigate("/campus-hiring")}
                            onStudentClick={() => closePanelAndNavigate("/signup")}
                          />
                        )}
                      </li>
                    )}

                    {/* ── "Explore" 2-column dropdown — LOGGED-OUT users ── */}
                    {!user && (
                      <li ref={moreMenuRef} className="relative">
                        <button
                          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isMoreMenuOpen
                              ? "text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300"
                              : inactiveClass
                          }`}
                          aria-expanded={isMoreMenuOpen}
                          aria-haspopup="true"
                        >
                          Explore
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isMoreMenuOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isMoreMenuOpen && (
                          <ExploreDropdownPanel
                            links={moreDropdownLinks}
                            location={location}
                            onLinkClick={() => setIsMoreMenuOpen(false)}
                            onCampusClick={() => closePanelAndNavigate("/campus-hiring")}
                            onStudentClick={() => closePanelAndNavigate("/signup")}
                          />
                        )}
                      </li>
                    )}
                  </ul>
                </div>

                {/* User action icons */}
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  {user && (
                    <>
                      <NotificationDropdown />
                      {!isRecruiter && (
                        <Link
                          to="/saved-jobs"
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          title="Saved Jobs"
                        >
                          <svg
                            className="w-5 h-5 text-gray-600 dark:text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                        </Link>
                      )}
                    </>
                  )}
                </div>

                {/* ── AUTH BUTTONS (logged out) / PROFILE (logged in) ── */}
                {!user ? (
                  <div className="flex items-center gap-2">

                    {/* Recruiter Login — outline */}
                    <button
                      onClick={() => navigate("/recruiter-login")}
                      className="px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-semibold whitespace-nowrap"
                    >
                      Recruiter Login
                    </button>

                    {/* Jobseeker Login — solid blue */}
                    <button
                      onClick={() => navigate("/jobseeker-login")}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm font-semibold whitespace-nowrap"
                    >
                      Jobseeker Login
                    </button>


                  </div>
                ) : (
                  <div ref={profileMenuRef} className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-expanded={isProfileMenuOpen}
                      aria-haspopup="true"
                    >
                      <img
                        src={user?.profile?.profilePhoto && !user.profile.profilePhoto.includes('github.com') ? user.profile.profilePhoto : "/src/assets/noprofile.webp"}
                        alt={`${user.fullname || "User"}'s avatar`}
                        className="h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 object-cover"
                      />
                      <span className="font-medium text-gray-700 dark:text-gray-200 text-sm hidden xl:block">
                        {user?.fullname}
                      </span>
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-20">
                        <Link
                          to={isRecruiter ? "/recruiter/profile" : "/profile"}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {isRecruiter ? "Recruiter" : "User"} Profile
                        </Link>

                        {!isRecruiter && (
                          <Link
                            to="/saved-jobs"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-200"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Saved Jobs
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── MOBILE RIGHT ICONS ── */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              {user && <NotificationDropdown />}
              <button

              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {!isMenuOpen ? (
                user ? (
                  <img
                    src={user?.profile?.profilePhoto && !user.profile.profilePhoto.includes('github.com') ? user.profile.profilePhoto : "/src/assets/noprofile.webp"}
                    alt={`${user?.fullname || "User"}'s avatar`}
                    className="h-6 w-6 rounded-md border border-gray-300 dark:border-gray-600 object-cover"
                  />
                ) : (
                  <CiMenuBurger size={20} className="text-gray-700 dark:text-gray-300" />
                )
              ) : (
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              </button>
            </div>
          </div>

          {/* ── MOBILE NAVIGATION OVERLAY ── */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 lg:hidden transition-opacity ${
              isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {/* Mobile Menu Panel */}
            <div
              ref={mobileMenuRef}
              className={`fixed top-0 right-0 h-full w-72 z-20 bg-white dark:bg-gray-800 shadow-lg transform transition-transform ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile User Section */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                {user ? (
                  <div className="flex items-center gap-3">
                    <img

                      src={user?.profile?.profilePhoto && !user.profile.profilePhoto.includes('github.com') ? user.profile.profilePhoto : "/src/assets/noprofile.webp"}

                      alt="Profile"
                      className="h-12 w-12 rounded-md border border-gray-300 dark:border-gray-600 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{user.fullname || "User"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Welcome to GreatHire</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Sign in to access all features</p>
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="overflow-y-auto h-full pb-32">
                <div className="px-4 py-2" />

                {mobileNavLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`block px-4 py-2.5 transition-colors font-medium ${
                      location.pathname === to
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}

                {/* Mobile Policy Section */}
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Policies
                    </p>
                  </div>
                  {policyLinks.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="block px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth / Action Buttons */}
                {!user ? (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">

                    <button
                      onClick={() => { navigate("/recruiter-login"); setIsMenuOpen(false); }}
                      className="w-full text-blue-600 border-2 border-blue-600 px-4 py-2.5 rounded-xl text-center font-semibold transition-colors block hover:bg-blue-50 text-sm"
                    >
                      Recruiter Login
                    </button>

                    <button
                      onClick={() => { navigate("/jobseeker-login"); setIsMenuOpen(false); }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl text-center font-semibold transition-colors block hover:shadow-xl text-sm"
                    >
                      Jobseeker Login
                    </button>

                    {/* Campus Hiring — pink/red */}
                    {/* <button
                      onClick={() => { navigate("/campus-hiring"); setIsMenuOpen(false); }}
                      className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2.5 rounded-xl text-center font-semibold transition-colors block hover:shadow-xl text-sm"
                    >
                      Campus Hiring
                    </button> */}

                    {/* Student Sign Up — purple/indigo */}
                    {/* <button
                      onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-center font-semibold transition-colors block hover:shadow-xl text-sm"
                    >
                      Student Sign Up
                    </button> */}
                  </div>
                ) : (
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    {!isRecruiter && (
                      <Link
                        to="/saved-jobs"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-200">Saved Jobs</span>
                      </Link>
                    )}

                    <Link
                      to={user.role === "student" ? "/profile" : "/recruiter/profile"}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-200">View Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Internship Marquee — fixed below navbar */}
      <div className="fixed top-[61px] left-0 right-0 z-20 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <InternshipMarquee jobs={jobs} />
      </div>

      {/* Spacer — pushes page content below fixed navbar + marquee */}
      <div className="h-[117px]" />
    </>
  );
};

export default Navbar;