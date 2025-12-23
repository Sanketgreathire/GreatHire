// Import necessary modules and dependencies
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "@/redux/authSlice";
import { removeCompany } from "@/redux/companySlice";
import { removeJobPlan } from "@/redux/jobPlanSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RECRUITER_API_END_POINT, USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { cleanRecruiterRedux } from "@/redux/recruiterSlice";
// import GreatHire from '../../assets/GreatHireLogo.jpg'
import ReviewsSection from "../ui/ReviewsCarousel";
import Footer from "./Footer";
import joinBg from "@/assets/img121.jpeg";
import NotificationDropdown from "../notifications/NotificationDropdown.jsx";

import ThemeToggle from "../ThemeToggle";





// Accept showJobDetails and setShowJobDetails props
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const isRecruiter = user?.role?.includes("recruiter");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPolicyMenuOpen, setIsPolicyMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Refs for click outside detection
  const mobileMenuRef = useRef(null);
  const policyMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
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

  // Handle click outside for menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        policyMenuRef.current &&
        !policyMenuRef.current.contains(event.target)
      ) {
        setIsPolicyMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target)
      ) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // if (user.role === "recruiter") {
      //   // Check if the recruiter has created a company
      //   const checkRes = await axios.get(`${RECRUITER_API_END_POINT}/has-company`, {
      //     withCredentials: true,
      //   });
  
      //   if (!checkRes.data.companyExists) {
      //     toast.error("Please create a company before logging out.");
      //     return;
      //   }
      // }
  
      const response = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(logOut());
        if (user.role === "recruiter") {
          dispatch(removeCompany());
          dispatch(cleanRecruiterRedux());
          dispatch(removeJobPlan());
        }

        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error("error in logout");
      }
    } catch (err) {
      toast.error(`error in logout ${err}`);
    }
  };

  const handleSignupOption = (type) => {
    navigate(
      type === "job" ? navigate("/signup") : navigate("/recruiter/signup")
    );
    setIsSignupModalOpen(false);
    setIsMenuOpen(false);
  };

  // Primary navigation links (always visible)
  const primaryNavLinks = [
    ...(isRecruiter
      ? [{ to: "/recruiter/dashboard/home", label: "Dashboard" }]
      : []),
  ];

  // Right side navigation links
  const rightNavLinks = [
    ...(!isRecruiter ? [{ to: "/", label: "Home" }] : []),
    ...(!isRecruiter ? [{ to: "/jobs", label: "Jobs" }] : []),
  ];

  // Secondary navigation links (in dropdown)
  const secondaryNavLinks = [
    { to: "/great-hire/services", label: "Our Services" },
    { to: "/blogs", label: "Blogs" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  // All nav links for mobile menu
  const navLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const policyLinks = [
    { to: "/policy/privacy-policy", label: "Privacy Policy" },
    // { to: "/policy/refund-policy", label: "Refund and Return Policy" },
    // { to: "/policy/terms-and-conditions", label: "Terms and Conditions" },
  ];

  

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-300 dark:border-gray-400 z-30 dark:bg-gray-800 dark:text-white transition-colors duration-300">

        <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-2 ">
          {/* Logo */}
          {/* <img src={GreatHire} alt="Greathirelogo" className="w-[180px] h-auto cursor-pointer "
            onClick={() => {
                {
                  user
                    ? user?.role === "student"
                      ? navigate("/")
                      : navigate("/recruiter/dashboard/home")
                    : navigate("/");
                }
              }}/> */}


               {/* Logo and Text */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold mb-1 hover:text-blue-600 transition duration-300 ease-in-out">
            <span className="text-black dark:text-white">Great</span>
            <span className="text-blue-600">Hire</span>
          </h2>
          
        </div>
          <div>
       
          
          {/* Mobile Notifications */}
          <div className="lg:hidden">
            {user && <NotificationDropdown />}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:ml-8">
            {/* Left side navigation */}
            <div className="flex items-center gap-6">
              <ul className="flex items-center gap-6 ">
                {primaryNavLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors  ${
                        location.pathname === to
                          ? "text-blue-600 bg-blue-50 "
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 "
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side navigation and user section */}
            <div className="flex items-center gap-4 justify-end">
              {/* Right side navigation links */}
              <div className="flex items-center gap-4">
                <ul className="flex items-center gap-4">
                  {rightNavLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          location.pathname === to
                            ? "text-blue-600 bg-blue-50 "
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-white"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}

                  {/* Explore Menu Dropdown */}
                  <li ref={moreMenuRef} className="relative">
                    <button
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors dark:text-white"
                      aria-expanded={isMoreMenuOpen}
                      aria-haspopup="true"
                    >
                      Explore
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isMoreMenuOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isMoreMenuOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 p-1 z-20 dark:text-gray-800 dark:absolute right-0 mt-2 w-60 bg-gray/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/40 p-1">
                        {secondaryNavLinks.map(({ to, label }) => (
                          <Link
                            key={to}
                            to={to}
                            className="block px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                            onClick={() => setIsMoreMenuOpen(false)}
                          >
                            {label}
                          </Link>
                        ))}
                        
                        {/* Policy submenu */}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Policies</div>
                          {policyLinks.map(({ to, label }) => (
                            <Link
                              key={to}
                              to={to}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                              onClick={() => setIsMoreMenuOpen(false)}
                            >
                              {label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              </div>

              {/* User actions section */}
              <div className="flex items-center gap-4">
               <ThemeToggle />
                {user && (
                  <>
                    {/* Messages
                    <MessageButton /> */}
                    
                    {/* Notifications */}
                    <NotificationDropdown />
                    
                    {/* Saved Jobs - only for students */}
                    {!isRecruiter && (
                      <Link
                        to="/saved-jobs"
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        title="Saved Jobs"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </Link>
                    )}
                  </>
                )}
              </div>
              
              {!user ? (
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              ) : (
                <div ref={profileMenuRef} className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <img
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      alt={`${user.fullname || "User"}'s avatar`}
                      className="h-8 w-8 rounded-md border border-gray-300 object-cover"
                    />
                    <span className="font-medium text-gray-700 text-sm hidden xl:block">{user?.fullname}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                      <Link
                        to={isRecruiter ? "/recruiter/profile" : "/profile"}
                        className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors dark:text-gray-800"
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
                          className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors dark:text-gray-800"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Saved Jobs
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {!isMenuOpen ? (
              user ? (
                <img
                  src={
                    user?.profile?.profilePhoto ||
                    "https://github.com/shadcn.png"
                  }
                  alt={`${user?.fullname || "User"}'s avatar`}
                  className="h-6 w-6 rounded-md border border-gray-300 object-cover"
                />
              ) : (
                <CiMenuBurger size={20} className="text-gray-700" />
              )
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 lg:hidden transition-opacity ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          
          {/* Mobile Menu Panel */}
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full w-72 z-20 bg-white shadow-lg transform transition-transform ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile User Section */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              {user ? (
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                    alt="Profile"
                    className="h-12 w-12 rounded-md border border-gray-300 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{user.fullname || "User"}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Welcome to GreatHire</h3>
                  <p className="text-gray-600 text-sm">Sign in to access all features</p>
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div>
              <div className="px-4 py-2"></div>
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block px-4 py-2.5 hover:bg-gray-50 transition-colors font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              {/* Mobile Policy Section */}
              <div className="mt-4 border-t dark:text-gray-800">
                <div className="px-4 py-2dark:text-gray-800 ">
                  <p className="text-lg font-medium dark:text-gray-800 ">Policies</p>
                </div>
                {policyLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="block px-4 py-2.5 hover:bg-gray-50 transition-colors dark:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Mobile Policy Section */}
              <div className="border-t border-gray-200">
                <div className="py-2">
                  <p className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Policies</p>
                  {policyLinks.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile User Actions */}
              {!user ? (
                <div className="border-t border-gray-200 p-4 space-y-3">
                  <Link
                    to="/login"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center font-medium transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup-choice"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-center font-medium transition-colors block"
                  >
                    Sign Up
                  </Link>
                  <div className="pt-2">
      <ThemeToggle />
    </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 py-2">
                  {/* Messages */}
                  {/* <MobileMessageButton /> */}

                  {/* Saved Jobs - only for students */}
                  {!isRecruiter && (
                    <Link
                      to="/saved-jobs"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-gray-700">Saved Jobs</span>
                    </Link>
                  )}

                  {/* Profile link */}
                  <Link
                    to={user.role === "student" ? "/profile" : "/recruiter/profile"}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700">View Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
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
    </>
  );
};

export default Navbar;
