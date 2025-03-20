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
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { cleanRecruiterRedux } from "@/redux/recruiterSlice";
import ReviewsSection from "../ui/ReviewsCarousel";

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
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Refs for click outside detection
  const mobileMenuRef = useRef(null);
  const policyMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
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

  const navLinks = [
    ...(!isRecruiter ? [{ to: "/", label: "Home" }] : []),

    // Add Dashboard for recruiters, Jobs for others
    ...(isRecruiter
      ? [{ to: "/recruiter/dashboard/home", label: "Dashboard" }]
      : [{ to: "/jobs", label: "Jobs" }]),

    // Common links
    { to: "/great-hire/services", label: "Our Services" },
    { to: "/contact", label: "Contact Us" },
  ];

  const policyLinks = [
    { to: "/policy/privacy-policy", label: "Privacy Policy" },
    { to: "/policy/refund-policy", label: "Refund and Return Policy" },
    { to: "/policy/terms-and-conditions", label: "Terms and Conditions" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-300 z-30">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-2 ">
          {/* Logo */}
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
              Great<span className="text-blue-700">Hire</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-12">
            <ul className="flex font-medium items-center gap-5">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-blue-700 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}

              {/* Policy Menu */}
              <li ref={policyMenuRef} className="relative">
                <button
                  onClick={() => setIsPolicyMenuOpen(!isPolicyMenuOpen)}
                  className="hover:text-blue-700 transition-colors flex items-center gap-1"
                  aria-expanded={isPolicyMenuOpen}
                  aria-haspopup="true"
                >
                  Policies
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isPolicyMenuOpen ? "rotate-180" : ""
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
                {isPolicyMenuOpen && (
                  <div className="absolute left-0 mt-2 w-60 bg-white rounded-xl shadow-lg border p-1 z-20">
                    {policyLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setIsPolicyMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>

            {/* Desktop User Section */}
            <div className="flex items-center gap-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => setIsSignupModalOpen(true)}
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Signup
                  </button>
                </>
              ) : (
                <div ref={profileMenuRef} className="relative ">
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
                    <span className="font-medium">{user?.fullname}</span>
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

                      {!isRecruiter && (
                        <Link
                          to="/saved-jobs"
                          className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Saved Jobs
                        </Link>
                      )}

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
            className={`lg:hidden p-2  hover:bg-gray-100  rounded-lg transition-all fixed z-50 right-4 top-2 `}
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
                      <p className="font-medium">{user.fullname || "User"}</p>
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
                  className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              {/* Mobile Policy Section */}
              <div className="mt-4 border-t">
                <div className="px-4 py-2">
                  <p className="text-lg font-medium text-gray-500">Policies</p>
                </div>
                {policyLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Mobile User Actions updated with login and signup button */}
              {!user ? (
                <div className="mt-4 border-t p-4">
                  <Link
                    to="/login"
                    className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-800 transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => {
                      setIsSignupModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors block mt-2"
                  >
                    Signup
                  </button>
                </div>
              ) : (
                <div className="mt-4 border-t p-4">
                  {/* Dynamic profile link based on user role */}
                  <Link
                    to={
                      user.role === "student"
                        ? "/profile"
                        : "/recruiter/profile"
                    }
                    className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Profile
                  </Link>

                  {/* Show "My Jobs" only if user role is "student" */}
                  {user.role === "student" && (
                    <Link
                      to="/saved-jobs"
                      className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Saved Jobs
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Signup Modal */}
      {isSignupModalOpen && (
  <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-start p-6 space-y-6 w-full h-screen overflow-y-auto">
    <h2 className="text-2xl font-semibold mt-10">Join Great<span className="text-blue-700">Hire</span></h2>
    
    <div className="w-full max-w-sm space-y-4">
      <button onClick={() => handleSignupOption("job")} className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors">
        I'm looking for a Job
      </button>
      <button onClick={() => handleSignupOption("recruiter")} className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
        I'm looking for Candidates
      </button>
      <button onClick={() => setIsSignupModalOpen(false)} className="w-full py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
        Go Back
      </button>
    </div>

    {/* Hiring Process Section */}
    <div className="mt-10 w-full max-w-3xl text-center">
      <h3 className="text-3xl font-bold mb-16">How to hire in less than 48 hours</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
            <span className="text-4xl">📢</span> {/* Job Posting */}
          </div>
          <p className="text-lg font-medium">Post a free job in <br /> few minutes</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
            <span className="text-4xl">📞</span> {/* Phone Call */}
          </div>
          <p className="text-lg font-medium">Get direct phone calls <br /> from HR</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
            <span className="text-4xl">👔</span> {/* Interview & Hire */}
          </div>
          <p className="text-lg font-medium">Interview and hire the <br /> right staff</p>
        </div>
      </div>
      <p className="mt-14 text-3xl font-bold">1000+ employers found success on GreatHire 🌟</p>
    </div>

    {/* Reviews Section */}
    <div className="w-full mt-20">
      <ReviewsSection />
    </div>
  </div>
)}




      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
