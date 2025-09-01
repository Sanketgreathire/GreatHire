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
import GreatHire from '../../assets/GreatHireLogo.jpg'
import ReviewsSection from "../ui/ReviewsCarousel";
import Footer from "./Footer";
import joinBg from "@/assets/img121.jpeg";
import NotificationDropdown from "../notifications/NotificationDropdown.jsx";


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
      if (user.role === "recruiter") {
        // Check if the recruiter has created a company
        const checkRes = await axios.get(`${RECRUITER_API_END_POINT}/has-company`, {
          withCredentials: true,
        });
  
        if (!checkRes.data.companyExists) {
          toast.error("Please create a company before logging out.");
          return;
        }
      }
  
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
      <nav className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-300 z-30">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-2 ">
          {/* Logo */}
          <img src={GreatHire} alt="Greathirelogo" className="w-[180px] h-auto cursor-pointer "
            onClick={() => {
                {
                  user
                    ? user?.role === "student"
                      ? navigate("/")
                      : navigate("/recruiter/dashboard/home")
                    : navigate("/");
                }
              }}/>
          
          {/* Mobile Notifications - show only on mobile when user is logged in */}
          <div className="lg:hidden">
            {user && <NotificationDropdown />}
          </div>
          <div
            to={
              user
              ? user.role === "student"
              ? "/"
              : "/recruiter/dashboard/home"
              : "/"
            }
            className={`flex items-center w-full ${
              user && user.role === "recruiter" && "justify-center"
              } 
              lg:block lg:w-auto lg:justify-normal lg:items-start 
              text-2xl font-bold relative`}
          >
            <span
              onClick={() => {
                {
                  user
                  ? user?.role === "student"
                  ? navigate("/")
                  : navigate("/recruiter/dashboard/home")
                  : navigate("/");
                }
              }}
            >
             
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1">
            {/* Left side navigation */}
            <div className="flex items-center gap-6">
              <ul className="flex font-bold items-center gap-5">
                {primaryNavLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={
                        location.pathname === to
                          ? "text-blue-700 underline font-bold font-[Oswald]"
                          : "hover:text-blue-700 transition-colors"
                      }
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side navigation and user section */}
            <div className="flex items-center gap-6 justify-end">
              {/* Right side navigation links */}
              <div className="flex items-center gap-5">
                <ul className="flex font-bold items-center gap-5">
                  {rightNavLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className={
                          location.pathname === to
                            ? "text-blue-700 underline font-bold font-[Oswald]"
                            : "hover:text-blue-700 transition-colors"
                        }
                      >
                        {label}
                      </Link>
                    </li>
                  ))}

                  {/* Explore Menu Dropdown */}
                  <li ref={moreMenuRef} className="relative">
                    <button
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="hover:text-blue-700 transition-colors flex items-center gap-1"
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isMoreMenuOpen && (
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border p-1 z-20">
                        {secondaryNavLinks.map(({ to, label }) => (
                          <Link
                            key={to}
                            to={to}
                            className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMoreMenuOpen(false)}
                          >
                            {label}
                          </Link>
                        ))}
                        
                        {/* Policy submenu */}
                        <div className="border-t mt-2 pt-2">
                          <div className="px-4 py-1 text-sm font-medium text-gray-500">Policies</div>
                          {policyLinks.map(({ to, label }) => (
                            <Link
                              key={to}
                              to={to}
                              className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm"
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
                {user && (
                  <>
                    {/* Messages */}
                    <Link
                      to="/messages"
                      className="relative p-2 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                      title="Messages"
                    >
                      <div className="relative">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </Link>
                    
                    {/* Notifications */}
                    <NotificationDropdown />
                    
                    {/* Saved Jobs - only for students */}
                    {!isRecruiter && (
                      <Link
                        to="/saved-jobs"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Saved Jobs"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Login
                </Link>
              ) : (
                <div ref={profileMenuRef} className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <img
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      alt={`${user.fullname || "User"}'s avatar`}
                      className="h-10 w-10 rounded-full border object-cover"
                    />
                    <span className="font-bold">{user?.fullname}</span>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border p-1 z-20">
                      <Link
                        to={isRecruiter ? "/recruiter/profile" : "/profile"}
                        className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {isRecruiter ? "Recruiter" : "User"} Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
                      >
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
            className={`lg:hidden p-2  hover:bg-gray-100  rounded-lg transition-all fixed z-50 right-4 -top-1 `}
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
                  className=" h-10 w-10 rounded-full border object-cover"
                />
              ) : (
                <CiMenuBurger size={25} />
              )
            ) : (
              "X"
            )}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm  lg:hidden transition-opacity duration-300  ${
            isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Mobile Menu Panel */}
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full w-2/3 sm:w-80 z-20 shadow-lg transform transition-transform duration-300 ease-in-out bg-white  ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile User Section */}
            <div className="p-4 border-b">
              {
                user ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      alt="Profile"
                      className="h-12 w-12 rounded-full border object-cover"
                    />
                    <div>
                      <p className="font-bold">{user.fullname || "User"}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ) : null //remove the login and signup button from here and put that below policy
              }
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
              <div className="mt-4 border-t">
                <div className="px-4 py-2">
                  <p className="text-lg font-bold text-gray-500">Policies</p>
                </div>
                {policyLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="block px-4 py-2.5 hover:bg-gray-50 transition-colors font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Mobile User Actions updated with login and signup button */}
              {!user ? (
                <div className="mt-4 border-t p-4 space-y-3">
                  <Link
                    to="/login"
                    className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-800 transition-colors block font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup-choice"
                    className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-800 transition-colors block font-bold"
                  >
                    Signup
                  </Link>
                </div>
              ) : (
                <div className="mt-4 border-t p-4">
                  {/* Messages */}
                  <Link
                    to="/messages"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group relative"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="relative">
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                      </svg>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="group-hover:text-blue-600 transition-colors font-bold">Messages</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </Link>

                  {/* Saved Jobs - only for students */}
                  {!isRecruiter && (
                    <Link
                      to="/saved-jobs"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="font-bold">Saved Jobs</span>
                    </Link>
                  )}

                  {/* Dynamic profile link based on user role */}
                  <Link
                    to={
                      user.role === "student"
                        ? "/profile"
                        : "/recruiter/profile"
                    }
                    className="block px-4 py-2.5 hover:bg-gray-50 transition-colors font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50 transition-colors font-bold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

     
    </>
  );
};

export default Navbar;
