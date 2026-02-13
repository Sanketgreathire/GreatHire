import React, { useState, useEffect } from "react";
import { Users, Target, Briefcase, Menu, X, Search, ExternalLink, Star, TrendingUp, Zap, Shield } from 'lucide-react';
import Footer from "@/components/shared/Footer";
// import RecruiterPlansHome from "@/components/RecruiterPlansHome";
import { useNavigate, NavLink, Link } from "react-router-dom";
import JobsHiringSlider from "./JobSlider";
import Lottie from "lottie-react";
import { Helmet } from "react-helmet-async";
import service from "../../../assets/Animation/services.json";
import about from "../../../assets/Animation/about-s.json";
import blog from "../../../assets/Animation/blog.json";
import contact from "../../../assets/Animation/contact-us.json";
import RecruiterPlans from "@/pages/recruiter/RecruiterPlans";

const GreatHireLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const navLinks = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'services', label: 'Our Services', path: '/great-hire/services' },
    { id: 'blogs', label: 'Blogs', path: '/Main_blog_page' },
    { id: 'about', label: 'About Us', path: '/about' },
    { id: 'contact', label: 'Contact Us', path: '/contact' },
    { id: 'packages', label: 'Recruiter Plans', path: '/packages' },
  ];

  const tabs = [
    {
      id: "service",
      title: "Our Services",
      animation: service,
      path: "/great-hire/services",
      content:
        "We provide end-to-end business solutions to help you grow and succeed. Our services include job posting and staffing, accounts and payroll management, digital marketing, and web and mobile app development. We also offer BPO, cybersecurity, and cloud computing services to improve efficiency and security. With AI and machine learning solutions, we help automate processes and drive innovation for your business.",
    },
    {
      id: "implementation",
      title: "Blogs",
      animation: blog,
      path: "/Main_blog_page",
      content:
        "GreatHire is your all-in-one career hub designed to connect talent with the right opportunities. With AI-powered matching, expert career insights, and hiring guidance, we help job seekers grow and employers hire smarter. From resume building and interview preparation to industry trends and future skills, we support every stage of your career journey. Trusted by thousands of users, GreatHire makes career growth simple, smart, and accessible.",
    },
    {
      id: "support",
      title: "About Us",
      animation: about,
      path: "/about",
      content:
        "GreatHire Business Solutions is a technology-driven recruitment and workforce solutions company connecting top talent with growing businesses. We specialize in AI-powered hiring, IT staffing, and strategic workforce solutions focused on efficiency and cultural fit. With strong leadership and a people-first approach, we help companies build reliable teams and professionals grow their careers across India.",
    },
    {
      id: "scalable",
      title: "Contact Us",
      animation: contact,
      path: "/contact",
      content:
        "Have questions or want to collaborate with us? Reach out to GreatHire through our FAQs, support phone number, or email for quick assistance. You can also fill out the contact form, and our team will get back to you within 24 hours. We’re here to help and look forward to",
    },
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tabs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>
          GreatHire | Locate Jobs, Employ Talent, and Advance Your Career in India
        </title>

        <meta
          name="description"
          content="Learn about GreatHire, India's cutting-edge job search and hiring platform, which is based in the state of Hyderabad and was created to link talent and companies with safe and open hiring solutions. GreatHire uses AI-powered matching and intelligent recommendations to assist job seekers in exploring thousands of daily job openings across IT, non-IT, fresher, and experienced roles. Quick hiring processes, validated profiles, and effective workforce solutions are advantageous to recruiters. GreatHire helps with every step of the hiring process, from career counseling and resume creation to quick job applications and company branding. To guarantee a seamless experience on both desktop and mobile devices, our platform prioritizes security, transparency, and user-friendly design. GreatHire makes recruiting easy, dependable, and future-ready throughout India, whether you're starting a career or growing your company."
        />
      </Helmet>

      <div className="[&_.hide-section]:hidden">
        <div className="w-full min-h-screen bg-white">
          {/* Fixed Navbar */}
          <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
            <div className="w-full px-6 py-3">
              <div className="flex items-center justify-between w-full">
                <Link to="/" className="cursor-pointer">
                  <div className="flex items-center">
                    <h1 className="text-4xl font-bold text-black whitespace-nowrap">
                      Great<span className="text-blue-600">Hire</span>
                    </h1>
                  </div>
                </Link>

                {/* RIGHT SIDE – NAV LINKS + LOGIN BUTTONS */}
                <div className="hidden lg:flex items-center gap-10">
                  {/* Desktop Navigation */}
                  <div className="flex items-center gap-6">
                    {navLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => { navigate(link.path); window.scrollTo(0, 0) }}
                        className="text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg text-black hover:text-blue-600 hover:bg-blue-50"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>

                  {/* Login Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate("/recruiter-login")}
                      className="px-5 py-2.5 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-semibold"
                    >
                      Recruiter Login
                    </button>
                    <button
                      onClick={() => navigate("/jobseeker-login")}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-xl transition-all text-sm font-semibold"
                    >
                      Jobseeker Login
                    </button>
                  </div>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-900"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

              </div>

              {/* MOBILE MENU */}
              {mobileMenuOpen && (
                <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                  <div className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => {
                          navigate(link.path);
                          window.scrollTo(0, 0);
                        }}
                        className="text-left py-2 px-3 rounded text-gray-700 hover:text-blue-600"
                      >
                        {link.label}
                      </button>
                    ))}
                    <button className="mt-3 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg" onClick={() => navigate('/recruiter-login')}>
                      Recruiter Login
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold" onClick={() => navigate('/jobseeker-login')}>
                      Jobseeker Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>


          {/* HOME SECTION - Ultra Modern Design */}
          <section id="home" className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
              {/* Hero Section with Two Columns */}
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-8">
                {/* Left Column - Text */}
                <div className="space-y-6 animate-fade-in-up">

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Find Your
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 animate-gradient">
                      Dream Career
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    Join <span className="font-bold text-blue-600">6 Crore+</span> job seekers and explore <span className="font-bold text-purple-600">10,000+</span> new opportunities daily across India
                  </p>

                  {/* Two Cards - Mobile Only */}
                  <div className="pt-4 grid grid-cols-2 gap-4 lg:hidden">
                    {/* Candidate Card */}
                    <button
                      onClick={() => navigate('/signup')}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3 group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-gray-800">I'm a Candidate</h3>
                        <p className="text-sm text-gray-600 mt-1">Find Jobs</p>
                      </div>
                    </button>

                    {/* Recruiter Card */}
                    <button
                      onClick={() => navigate('/recruiter/signup')}
                      className="bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3 group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-gray-800">I'm a Recruiter</h3>
                        <p className="text-sm text-gray-600 mt-1">Post Jobs</p>
                      </div>
                    </button>
                  </div>

                  {/* Premium Stats */}
                  <div className="flex gap-8 pt-6">
                    <div className="group">
                      <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">10K+</h3>
                      <p className="text-gray-600 text-sm font-medium mt-1">Daily Jobs</p>
                    </div>
                    <div className="group">
                      <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">6Cr+</h3>
                      <p className="text-gray-600 text-sm font-medium mt-1">Job Seekers</p>
                    </div>
                    <div className="group">
                      <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">900+</h3>
                      <p className="text-gray-600 text-sm font-medium mt-1">Cities</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Enhanced Visual Element */}
                <div className="relative animate-fade-in-right">
                  <div className="relative scale-90">
                    {/* Main Card Container */}
                    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-1 shadow-2xl">
                      <div className="bg-white rounded-[2.3rem] p-6">
                        {/* Floating Job Cards */}
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all animate-float border-2 border-blue-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-base">Software Developer</p>
                              <p className="text-sm text-gray-600 font-medium">TCS • Bangalore</p>
                              <p className="text-xs text-blue-600 font-semibold mt-1">₹12-18 LPA</p>
                            </div>
                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                              New
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all ml-6 animate-float-delay border-2 border-purple-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-base">HR Manager</p>
                              <p className="text-sm text-gray-600 font-medium">Infosys • Mumbai</p>
                              <p className="text-xs text-purple-600 font-semibold mt-1">₹8-15 LPA</p>
                            </div>
                            <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                              Hot
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all animate-float-slow border-2 border-pink-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Target className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-base">Marketing Lead</p>
                              <p className="text-sm text-gray-600 font-medium">Flipkart • Delhi</p>
                              <p className="text-xs text-pink-600 font-semibold mt-1">₹15-25 LPA</p>
                            </div>
                            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                              Apply
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-2xl border-4 border-yellow-400 animate-bounce-slow">
                      <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                      <p className="text-xs font-bold text-gray-900 mt-1">Verified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Slider */}
              <div className="mt-2 mb-0">
                <JobsHiringSlider />
              </div>

              {/* Premium Features Grid */}
              <div className="mb-10">
                <div className="text-center mb-8 md:mb-16 px-4 md:px-0">
                  <h2 className="text-3xl lg:text-5xl font-black text-gray-900 mb-4">
                    Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GreatHire</span>?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    India's most trusted job platform with cutting-edge features
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {[
                    { icon: <TrendingUp />, title: "Latest Jobs", desc: "10K+ fresh opportunities every day", gradient: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50" },
                    { icon: <Zap />, title: "Easy Apply", desc: "One-click instant applications", gradient: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50" },
                    { icon: <Target />, title: "Smart Match", desc: "AI-powered job recommendations", gradient: "from-pink-500 to-red-500", bg: "from-pink-50 to-red-50" },
                    { icon: <Shield />, title: "Verified Companies", desc: "500+ trusted hiring partners", gradient: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50" }
                  ].map((feature, i) => (
                    <div key={i} className="group relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>

                      {/* CARD */}
                      <div className={`relative bg-gradient-to-br ${feature.bg} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-white hover:-translate-y-3`}>

                        {/* MOBILE VIEW */}
                        <div className="flex md:hidden items-start gap-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <div className="text-white">{feature.icon}</div>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {feature.desc}
                            </p>
                          </div>
                        </div>

                        {/* LAPTOP VIEW (UNCHANGED) */}
                        <div className="hidden md:block">
                          <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                            <div className="text-white">{feature.icon}</div>
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-gray-900">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* the cards and carousel */}
              <div className="max-w-7xl mx-auto px-6 py-4 mt-4">
                {/* Tabs Header */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4 sm:mb-8">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      onClick={() => setIndex(i)}
                      className={`px-8 py-3 rounded-full font-semibold transition-all duration-300
          ${index === i
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-700 hover:text-slate-900"
                        }`}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {/* Carousel */}
                <div className="relative overflow-hidden py-8">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                  >
                    {tabs.map((tab) => (
                      <div key={tab.id} className="min-w-full px-6">
                        {/* CARD */}
                        <div className="relative bg-gradient-to-r from-purple-300 to-purple-350 rounded-3xl shadow-xl p-10 h-72 flex flex-col md:flex-row items-center gap-10">

                          {/* Image */}
                          <div className="flex-shrink-0">
                            <Lottie
                              animationData={tab.animation}
                              loop
                              autoplay
                              className="w-64 h-64"
                            />
                          </div>

                          {/* Text */}
                          <div className="flex-1">
                            <p className="text-lg text-black-900 leading-relaxed">
                              {tab.content}
                            </p>
                          </div>

                          {/* Know More Button - Bottom Right */}
                          <button
                            onClick={() => {
                              navigate(tab.path);
                              window.scrollTo(0, 0);
                            }}
                            className="absolute bottom-6 right-6 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white 
                            rounded-lg text-sm font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            Know More
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-3 mt-4 mb-4">
                  {tabs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all
                        ${index === i ? "bg-blue-600" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Recruiter Plans Section */}
              {/* <RecruiterPlansHome /> */}

              {/* Ultra Premium CTA Section */}
              <div className="mt-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] blur-2xl opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-6 sm:p-10 md:p-16 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0  w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white rounded-full opacity-10 -mr-24 -mt-24 sm:-mr-36 sm:-mt-36 md:-mr-48 md:-mt-48"></div>
                    <div className="absolute bottom-0 left-0  w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white rounded-full opacity-10  -ml-24 -mb-24 sm:-ml-36 sm:-mb-36 md:-ml-48 md:-mb-48"></div>

                    <div className="relative z-10 text-center">
                      <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
                        Ready to Start Your Journey?
                      </h2>
                      <p className="text-blue-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto font-light">
                        Join 6 crore+ job seekers and discover your perfect career match with AI-powered recommendations
                      </p>

                      <div className="flex flex-col sm:flex-row gap-5 sm:gap-5 justify-center">
                        <button
                          onClick={() => {
                            navigate("/signup-choice");
                            window.scrollTo(0, 0);
                          }}
                          className="group px-6 py-4 sm:px-10 sm:py-5  bg-white text-blue-600 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <span>Create Free Account</span>
                          <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          onClick={() => {
                            navigate("/jobs");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="px-10 py-5 bg-transparent text-white rounded-2xl font-bold border-2 border-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Search className="w-5 h-5" />
                          <span>Browse Jobs</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in-right {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-float-delay {
            animation: float 3s ease-in-out infinite;
            animation-delay: 1s;
          }
          .animate-float-slow {
            animation: float 4s ease-in-out infinite;
            animation-delay: 2s;
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out;
          }
          .animate-fade-in-right {
            animation: fade-in-right 1s ease-out;
          }
          .animate-bounce-slow {
            animation: bounce 2s infinite;
          }
        `}</style>
          </section>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default GreatHireLanding;