import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import learnersTrackNavLogo from "@/assets/learnerstracknavogo.png";

// Explore Dropdown Panel
const ExploreDropdownPanel = memo(({ links, location, onLinkClick }) => {
  const linkIcons = {
    Blogs: "✍️",
    Courses: "🎓",
    "About Us": "🏢",
    "Contact Us": "📬",
    "Privacy Policy": "🔒",
    "Our Services": "⚡",
  };

  return (
    <div
      className="absolute right-0 mt-2 z-50 rounded-2xl shadow-2xl border overflow-hidden bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
      style={{
        width: "min(560px, 92vw)",
        boxShadow: "0 20px 60px rgba(99,102,241,0.13), 0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Explore everything
        </span>
      </div>

      <div className="grid grid-cols-2">
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
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 flex flex-col justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1">
            Quick Access
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 px-1 pt-2 border-t border-gray-100 dark:border-gray-700">
            Exclusive LearnersTrack Portal powered by GreatHire
          </p>
        </div>
      </div>
    </div>
  );
});

const LearnersTrackNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null);
  const exploreMenuRef = useRef(null);

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
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target)) {
        setIsExploreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rightNavLinks = [
    { to: "/", label: "Home" },
    { to: "/great-hire/services", label: "Our Services" },
    { to: "/packages", label: "Recruiter Plans" },
  ];

  const exploreLinks = [
    { to: "/Main_blog_page", label: "Blogs" },
    { to: "/courses", label: "Courses" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "/policy/privacy-policy", label: "Privacy Policy" },
  ];

  const mobileNavLinks = [
    ...rightNavLinks,
    ...exploreLinks,
  ];

  const activeClass = "text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300";
  const inactiveClass =
    "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-700";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-300 dark:border-gray-400 z-30 dark:bg-gray-800 dark:text-white transition-colors duration-300 py-3">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-8">

          {/* Logo with LearnersTrack */}
          <Link to="/" className="cursor-pointer flex items-center gap-2 sm:gap-3" aria-label="GreatHire home">
            <h2 className="text-xl sm:text-2xl font-bold hover:text-blue-600 transition duration-300 ease-in-out">
              <span className="text-black dark:text-white">Great</span>
              <span className="text-blue-600">Hire</span>
            </h2>
            <span className="text-lg font-bold text-gray-300 dark:text-gray-600">×</span>
            <img src={learnersTrackNavLogo} alt="LearnersTrack" className="h-10 sm:h-12" />
          </Link>

          <div className="flex-1" />

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            <ul className="flex items-center gap-4">
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
                    links={exploreLinks}
                    location={location}
                    onLinkClick={() => setIsExploreMenuOpen(false)}
                  />
                )}
              </li>
            </ul>

            <ThemeToggle />

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/learnerstrack-signup")}
                className="px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-semibold whitespace-nowrap"
              >
                Sign Up
              </button>

              <button
                onClick={() => navigate("/learnerstrack-login")}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm font-semibold whitespace-nowrap"
              >
                Login
              </button>
            </div>
          </div>

          {/* MOBILE RIGHT ICONS */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {!isMenuOpen ? (
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* MOBILE NAVIGATION OVERLAY */}
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
              {/* Mobile Header Section */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">LearnersTrack Portal</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Powered by GreatHire</p>
                </div>
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

                {/* Mobile Auth Buttons */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3 mt-4">
                  <button
                    onClick={() => { navigate("/learnerstrack-signup"); setIsMenuOpen(false); }}
                    className="w-full text-blue-600 border-2 border-blue-600 px-4 py-2.5 rounded-xl text-center font-semibold transition-colors block hover:bg-blue-50 text-sm"
                  >
                    Sign Up
                  </button>

                  <button
                    onClick={() => { navigate("/learnerstrack-login"); setIsMenuOpen(false); }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl text-center font-semibold transition-colors block hover:shadow-xl text-sm"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer — pushes page content below fixed navbar */}
      <div className="h-[61px]" />
    </>
  );
};

export default LearnersTrackNavbar;
