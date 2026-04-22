// import React, { useState, useEffect } from "react";
// import { Users, Target, Briefcase, Menu, X, Search, ExternalLink, Star, TrendingUp, Zap, Shield, Moon, Sun } from 'lucide-react';
// import Footer from "@/components/shared/Footer";
// import { useNavigate, NavLink, Link } from "react-router-dom";
// import JobsHiringSlider from "./JobSlider";
// import Lottie from "lottie-react";
// import { Helmet } from "react-helmet-async";
// import service from "../../../assets/Animation/services.json";
// import about from "../../../assets/Animation/about-s.json";
// import blog from "../../../assets/Animation/blog.json";
// import contact from "../../../assets/Animation/contact-us.json";
// import RecruiterPlans from "@/pages/recruiter/RecruiterPlans";
// import CompactTestimonials from "@/components/ui/CompactTestimonials";
// import RoleActionBar from "@/components/shared/RoleActionBar";

// const GreatHireLanding = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const [index, setIndex] = useState(0);
//   const [darkMode, setDarkMode] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('theme') === 'dark' ||
//         (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
//     }
//     return false;
//   });

//   // Apply dark mode class to <html> element
//   useEffect(() => {
//     const root = document.documentElement;
//     if (darkMode) {
//       root.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       root.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [darkMode]);

//   const navLinks = [
//     { id: 'home', label: 'Home', path: '/' },
//     { id: 'services', label: 'Our Services', path: '/great-hire/services' },
//     { id: 'blogs', label: 'Blogs', path: '/Main_blog_page' },
//     { id: 'about', label: 'About Us', path: '/about' },
//     { id: 'contact', label: 'Contact Us', path: '/contact' },
//     { id: 'privacy', label: 'Privacy Policy', path: '/policy/privacy-policy' },
//     { id: 'packages', label: 'Recruiter Plans', path: '/packages' },
//   ];

//   const tabs = [
//     {
//       id: "service",
//       title: "Our Services",
//       animation: service,
//       path: "/great-hire/services",
//       content:
//         "We provide end-to-end business solutions to help you grow and succeed. Our services include job posting and staffing, accounts and payroll management, digital marketing, and web and mobile app development. We also offer BPO, cybersecurity, and cloud computing services to improve efficiency and security. With AI and machine learning solutions, we help automate processes and drive innovation for your business.",
//     },
//     {
//       id: "implementation",
//       title: "Blogs",
//       animation: blog,
//       path: "/Main_blog_page",
//       content:
//         "GreatHire is your all-in-one career hub designed to connect talent with the right opportunities. With AI-powered matching, expert career insights, and hiring guidance, we help job seekers grow and employers hire smarter. From resume building and interview preparation to industry trends and future skills, we support every stage of your career journey. Trusted by thousands of users, GreatHire makes career growth simple, smart, and accessible.",
//     },
//     {
//       id: "support",
//       title: "About Us",
//       animation: about,
//       path: "/about",
//       content:
//         "GreatHire Business Solutions is a technology-driven recruitment and workforce solutions company connecting top talent with growing businesses. We specialize in AI-powered hiring, IT staffing, and strategic workforce solutions focused on efficiency and cultural fit. With strong leadership and a people-first approach, we help companies build reliable teams and professionals grow their careers across India.",
//     },
//     {
//       id: "scalable",
//       title: "Contact Us",
//       animation: contact,
//       path: "/contact",
//       content:
//         "Have questions or want to collaborate with us? Reach out to GreatHire through our FAQs, support phone number, or email for quick assistance. You can also fill out the contact form, and our team will get back to you within 24 hours. We're here to help and look forward to",
//     },
//   ];

//   // Auto slide
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % tabs.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <Helmet>
//         <title>
//           GreatHire | Locate Jobs, Employ Talent, and Advance Your Career in India
//         </title>

//         <meta
//           name="description"
//           content="Learn about GreatHire, India's cutting-edge job search and hiring platform, which is based in the state of Hyderabad and was created to link talent and companies with safe and open hiring solutions. GreatHire uses AI-powered matching and intelligent recommendations to assist job seekers in exploring thousands of daily job openings across IT, non-IT, fresher, and experienced roles. Quick hiring processes, validated profiles, and effective workforce solutions are advantageous to recruiters. GreatHire helps with every step of the hiring process, from career counseling and resume creation to quick job applications and company branding. To guarantee a seamless experience on both desktop and mobile devices, our platform prioritizes security, transparency, and user-friendly design. GreatHire makes recruiting easy, dependable, and future-ready throughout India, whether you're starting a career or growing your company."
//         />
//       </Helmet>

//       <div className="[&_.hide-section]:hidden">
//         <div className="w-full min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">

//           {/* Fixed Navbar */}
//           <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
//             <div className="w-full px-6 py-3">
//               <div className="flex items-center justify-between w-full">
//                 <Link to="/" className="cursor-pointer">
//                   <div className="flex items-center">
//                     <h1 className="text-4xl font-bold text-black dark:text-white whitespace-nowrap">
//                       Great<span className="text-blue-600">Hire</span>
//                     </h1>
//                   </div>
//                 </Link>

//                 {/* RIGHT SIDE – NAV LINKS + LOGIN BUTTONS */}
//                 <div className="hidden lg:flex items-center gap-10">
//                   {/* Desktop Navigation */}
//                   <div className="flex items-center gap-6">
//                     {navLinks.map((link) => (
//                       <button
//                         key={link.id}
//                         onClick={() => { navigate(link.path); window.scrollTo(0, 0) }}
//                         className="text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg text-black dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
//                       >
//                         {link.label}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Dark Mode Toggle */}
//                   <button
//                     onClick={() => setDarkMode(!darkMode)}
//                     className="p-2 bg-transparent text-gray-700 dark:text-white hover:scale-110 transition-all"
//                     aria-label="Toggle dark mode"
//                   >
//                     {darkMode ? <Sun size={18} /> : <Moon size={18} />}
//                   </button>

//                   {/* Login Buttons */}
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => navigate("/recruiter-login")}
//                       className="px-5 py-2.5 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all text-sm font-semibold"
//                     >
//                       Recruiter Login
//                     </button>
//                     <button
//                       onClick={() => navigate("/jobseeker-login")}
//                       className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-xl transition-all text-sm font-semibold"
//                     >
//                       Jobseeker Login
//                     </button>
//                   </div>
//                 </div>

//                 {/* MOBILE: Dark toggle + Menu button */}
//                 <div className="lg:hidden flex items-center gap-2">
//                   <button
//                     onClick={() => setDarkMode(!darkMode)}
//                     className="p-2 bg-transparent text-gray-700 dark:text-white hover:scale-110 transition-all"
//                     aria-label="Toggle dark mode"
//                   >
//                     {darkMode ? <Sun size={16} /> : <Moon size={16} />}
//                   </button>
//                   <button
//                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                     className="p-2 text-gray-900 dark:text-white"
//                   >
//                     {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//                   </button>
//                 </div>
//               </div>

//               {/* MOBILE MENU */}
//               {mobileMenuOpen && (
//                 <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
//                   <div className="flex flex-col gap-3">
//                     {navLinks.map((link) => (
//                       <button
//                         key={link.id}
//                         onClick={() => {
//                           navigate(link.path);
//                           window.scrollTo(0, 0);
//                           setMobileMenuOpen(false);
//                         }}
//                         className="text-left py-2 px-3 rounded text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
//                       >
//                         {link.label}
//                       </button>
//                     ))}
//                     <button
//                       className="mt-3 px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg"
//                       onClick={() => navigate('/recruiter-login')}
//                     >
//                       Recruiter Login
//                     </button>
//                     <button
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
//                       onClick={() => navigate('/jobseeker-login')}
//                     >
//                       Jobseeker Login
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </nav>

//           {/* Role-Based Action Bar */}
//           <div className="fixed top-[61px] left-0 right-0 z-40">
//             <RoleActionBar />
//           </div>


//           {/* HOME SECTION */}
//           <section id="home" className="min-h-screen pt-28 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">
//             {/* Animated Background Elements */}
//             <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
//               <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
//               <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//               <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//             </div>

//             <div className="container mx-auto px-4 py-8 relative z-10">
//               {/* Hero Section with Two Columns */}
//               <div className="grid lg:grid-cols-2 gap-12 items-center mb-8">
//                 {/* Left Column - Text */}
//                 <div className="space-y-6 animate-fade-in-up">

//                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
//                     Find Your
//                     <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 animate-gradient">
//                       Dream Career
//                     </span>
//                   </h1>
//                   <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
//                     Join <span className="font-bold text-blue-600 dark:text-blue-400">6 Crore+</span> job seekers and explore <span className="font-bold text-purple-600 dark:text-purple-400">10,000+</span> new opportunities daily across India
//                   </p>

//                   {/* Two Cards - Mobile Only */}
//                   <div className="pt-4 grid grid-cols-2 gap-4 lg:hidden">
//                     {/* Candidate Card */}
//                     <button
//                       onClick={() => navigate('/signup')}
//                       className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6 hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3 group"
//                     >
//                       <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                       </div>
//                       <div className="text-center">
//                         <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">I'm a Candidate</h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Find Jobs</p>
//                       </div>
//                     </button>

//                     {/* Recruiter Card */}
//                     <button
//                       onClick={() => navigate('/recruiter/signup')}
//                       className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-6 hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3 group"
//                     >
//                       <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                         </svg>
//                       </div>
//                       <div className="text-center">
//                         <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">I'm a Recruiter</h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Post Jobs</p>
//                       </div>
//                     </button>
//                   </div>

//                   {/* Premium Stats */}
//                   <div className="flex gap-8 pt-6">
//                     <div className="group">
//                       <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">10K+</h3>
//                       <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Daily Jobs</p>
//                     </div>
//                     <div className="group">
//                       <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">6Cr+</h3>
//                       <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Job Seekers</p>
//                     </div>
//                     <div className="group">
//                       <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">900+</h3>
//                       <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Cities</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column - Enhanced Visual Element */}
//                 <div className="relative animate-fade-in-right">
//                   <div className="relative scale-90">
//                     {/* Main Card Container */}
//                     <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-1 shadow-2xl">
//                       <div className="bg-white dark:bg-gray-900 rounded-[2.3rem] p-6">
//                         {/* Floating Job Cards */}
//                         <div className="space-y-4">
//                           <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all animate-float border-2 border-blue-200 dark:border-blue-700">
//                             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                               <Briefcase className="w-6 h-6 text-white" />
//                             </div>
//                             <div className="flex-1">
//                               <p className="font-bold text-gray-900 dark:text-white text-base">Software Developer</p>
//                               <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">TCS • Bangalore</p>
//                               <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">₹12-18 LPA</p>
//                             </div>
//                             <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-bold">
//                               New
//                             </div>
//                           </div>

//                           <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl p-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all ml-6 animate-float-delay border-2 border-purple-200 dark:border-purple-700">
//                             <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                               <Users className="w-6 h-6 text-white" />
//                             </div>
//                             <div className="flex-1">
//                               <p className="font-bold text-gray-900 dark:text-white text-base">HR Manager</p>
//                               <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Infosys • Mumbai</p>
//                               <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">₹8-15 LPA</p>
//                             </div>
//                             <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-bold">
//                               Hot
//                             </div>
//                           </div>

//                           <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-2xl p-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all animate-float-slow border-2 border-pink-200 dark:border-pink-700">
//                             <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
//                               <Target className="w-6 h-6 text-white" />
//                             </div>
//                             <div className="flex-1">
//                               <p className="font-bold text-gray-900 dark:text-white text-base">Marketing Lead</p>
//                               <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Flipkart • Delhi</p>
//                               <p className="text-xs text-pink-600 dark:text-pink-400 font-semibold mt-1">₹15-25 LPA</p>
//                             </div>
//                             <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-bold">
//                               Apply
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Floating Badge */}
//                     <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-2xl border-4 border-yellow-400 animate-bounce-slow">
//                       <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
//                       <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">Verified</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Job Slider */}
//               <div className="mt-2 mb-0">
//                 <JobsHiringSlider />
//               </div>

//               {/* Premium Features Grid */}
//               <div className="mb-10">
//                 <div className="text-center mb-8 md:mb-16 px-4 md:px-0">
//                   <h2 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
//                     Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GreatHire</span>?
//                   </h2>
//                   <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//                     India's most trusted job platform with cutting-edge features
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
//                   {[
//                     { icon: <TrendingUp />, title: "Latest Jobs", desc: "10K+ fresh opportunities every day", gradient: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50", darkBg: "dark:from-blue-950 dark:to-cyan-950" },
//                     { icon: <Zap />, title: "Easy Apply", desc: "One-click instant applications", gradient: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50", darkBg: "dark:from-purple-950 dark:to-pink-950" },
//                     { icon: <Target />, title: "Smart Match", desc: "AI-powered job recommendations", gradient: "from-pink-500 to-red-500", bg: "from-pink-50 to-red-50", darkBg: "dark:from-pink-950 dark:to-red-950" },
//                     { icon: <Shield />, title: "Verified Companies", desc: "500+ trusted hiring partners", gradient: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50", darkBg: "dark:from-green-950 dark:to-emerald-950" }
//                   ].map((feature, i) => (
//                     <div key={i} className="group relative">
//                       <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>

//                       {/* CARD */}
//                       <div className={`relative bg-gradient-to-br ${feature.bg} ${feature.darkBg} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-white dark:group-hover:border-gray-700 hover:-translate-y-3`}>

//                         {/* MOBILE VIEW */}
//                         <div className="flex md:hidden items-start gap-4">
//                           <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
//                             <div className="text-white">{feature.icon}</div>
//                           </div>

//                           <div>
//                             <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
//                               {feature.title}
//                             </h3>
//                             <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
//                               {feature.desc}
//                             </p>
//                           </div>
//                         </div>

//                         {/* LAPTOP VIEW */}
//                         <div className="hidden md:block">
//                           <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
//                             <div className="text-white">{feature.icon}</div>
//                           </div>
//                           <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
//                             {feature.title}
//                           </h3>
//                           <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
//                             {feature.desc}
//                           </p>
//                         </div>

//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Tabs and Carousel */}
//               <div className="max-w-7xl mx-auto px-6 py-4 mt-4">
//                 {/* Tabs Header */}
//                 <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4 sm:mb-8">
//                   {tabs.map((tab, i) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setIndex(i)}
//                       className={`px-8 py-3 rounded-full font-semibold transition-all duration-300
//                         ${index === i
//                           ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
//                           : "text-gray-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white"
//                         }`}
//                     >
//                       {tab.title}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Carousel */}
//                 <div className="relative overflow-hidden py-8">
//                   <div
//                     className="flex transition-transform duration-700 ease-in-out"
//                     style={{ transform: `translateX(-${index * 100}%)` }}
//                   >
//                     {tabs.map((tab) => (
//                       <div key={tab.id} className="min-w-full px-6">
//                         {/* CARD */}
//                         <div className="relative bg-gradient-to-r from-purple-300 to-purple-350 dark:from-purple-900 dark:to-purple-800 rounded-3xl shadow-xl p-10 h-72 flex flex-col md:flex-row items-center gap-10">

//                           {/* Image */}
//                           <div className="flex-shrink-0">
//                             <Lottie
//                               animationData={tab.animation}
//                               loop
//                               autoplay
//                               className="w-64 h-64"
//                             />
//                           </div>

//                           {/* Text */}
//                           <div className="flex-1">
//                             <p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
//                               {tab.content}
//                             </p>
//                           </div>

//                           {/* Know More Button - Bottom Right */}
//                           <button
//                             onClick={() => {
//                               navigate(tab.path);
//                               window.scrollTo(0, 0);
//                             }}
//                             className="absolute bottom-6 right-6 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white 
//                             rounded-lg text-sm font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
//                             Know More
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Dots */}
//                 <div className="flex justify-center gap-3 mt-4 mb-4">
//                   {tabs.map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setIndex(i)}
//                       className={`w-3 h-3 rounded-full transition-all
//                         ${index === i ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"}`}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Compact Testimonials Section */}
//               <CompactTestimonials />

//               {/* CTA Section */}
//               <div className="mt-3">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] blur-2xl opacity-30"></div>
//                   <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-6 sm:p-10 md:p-16 shadow-2xl overflow-hidden">
//                     <div className="absolute top-0 right-0 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white rounded-full opacity-10 -mr-24 -mt-24 sm:-mr-36 sm:-mt-36 md:-mr-48 md:-mt-48"></div>
//                     <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white rounded-full opacity-10 -ml-24 -mb-24 sm:-ml-36 sm:-mb-36 md:-ml-48 md:-mb-48"></div>

//                     <div className="relative z-10 text-center">
//                       <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
//                         Ready to Start Your Journey?
//                       </h2>
//                       <p className="text-blue-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto font-light">
//                         Join 6 crore+ job seekers and discover your perfect career match with AI-powered recommendations
//                       </p>

//                       <div className="flex flex-col sm:flex-row gap-5 sm:gap-5 justify-center">
//                         <button
//                           onClick={() => {
//                             navigate("/signup-choice");
//                             window.scrollTo(0, 0);
//                           }}
//                           className="group px-6 py-4 sm:px-10 sm:py-5 bg-white text-blue-600 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
//                         >
//                           <span>Create Free Account</span>
//                           <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                         </button>

//                         <button
//                           onClick={() => {
//                             navigate("/jobs");
//                             window.scrollTo({ top: 0, behavior: "smooth" });
//                           }}
//                           className="px-10 py-5 bg-transparent text-white rounded-2xl font-bold border-2 border-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
//                         >
//                           <Search className="w-5 h-5" />
//                           <span>Browse Jobs</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <style jsx>{`
//           @keyframes float {
//             0%, 100% { transform: translateY(0px); }
//             50% { transform: translateY(-20px); }
//           }
//           @keyframes blob {
//             0%, 100% { transform: translate(0, 0) scale(1); }
//             33% { transform: translate(30px, -50px) scale(1.1); }
//             66% { transform: translate(-20px, 20px) scale(0.9); }
//           }
//           @keyframes gradient {
//             0%, 100% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//           }
//           @keyframes fade-in-up {
//             from { opacity: 0; transform: translateY(30px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//           @keyframes fade-in-right {
//             from { opacity: 0; transform: translateX(-30px); }
//             to { opacity: 1; transform: translateX(0); }
//           }
//           .animate-float { animation: float 3s ease-in-out infinite; }
//           .animate-float-delay { animation: float 3s ease-in-out infinite; animation-delay: 1s; }
//           .animate-float-slow { animation: float 4s ease-in-out infinite; animation-delay: 2s; }
//           .animate-blob { animation: blob 7s infinite; }
//           .animation-delay-2000 { animation-delay: 2s; }
//           .animation-delay-4000 { animation-delay: 4s; }
//           .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
//           .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
//           .animate-fade-in-right { animation: fade-in-right 1s ease-out; }
//           .animate-bounce-slow { animation: bounce 2s infinite; }
//         `}</style>
//           </section>
//           <Footer />
//         </div>
//       </div>
//     </>
//   );
// };

// export default GreatHireLanding;

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import {
  Users,
  Target,
  Briefcase,
  Search,
  ExternalLink,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Moon,
  Sun,
} from "lucide-react";
import Footer from "@/components/shared/Footer";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import InternshipMarquee from "@/components/shared/InternshipMarquee";
import { useJobDetails } from "@/context/JobDetailsContext";

const JobsHiringSlider = lazy(() => import("./JobSlider"));
const Lottie = lazy(() => import("lottie-react"));
const CompactTestimonials = lazy(() => import("@/components/ui/CompactTestimonials"));

// Lazy load heavy animation JSONs only when needed
const tabAnimations = {
  service: () => import("../../../assets/Animation/services.json"),
  implementation: () => import("../../../assets/Animation/blog.json"),
  support: () => import("../../../assets/Animation/about-s.json"),
  scalable: () => import("../../../assets/Animation/contact-us.json"),
};

const GreatHireLanding = () => {
  const { jobs } = useJobDetails();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [tabAnimData, setTabAnimData] = useState({});
  const [showBelow, setShowBelow] = useState(false);
  const moreRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const directNavLinks = [
    { id: "home", label: "Home", path: "/" },
    { id: "services", label: "Our Services", path: "/great-hire/services" },
    { id: "packages", label: "Recruiter Plans", path: "/packages" },
  ];

  const moreLinks = [
    { id: "blogs", label: "Blogs", path: "/Main_blog_page" },
    { id: "courses", label: "Courses", path: "/courses" },
    { id: "about", label: "About Us", path: "/about" },
    { id: "contact", label: "Contact Us", path: "/contact" },
    { id: "privacy", label: "Privacy Policy", path: "/policy/privacy-policy" },
  ];

  const allMobileLinks = [
    { id: "home", label: "Home", path: "/" },
    { id: "services", label: "Our Services", path: "/great-hire/services" },
    { id: "blogs", label: "Blogs", path: "/Main_blog_page" },
    { id: "courses", label: "Courses", path: "/courses" },
    { id: "about", label: "About Us", path: "/about" },
    { id: "contact", label: "Contact Us", path: "/contact" },
    { id: "privacy", label: "Privacy Policy", path: "/policy/privacy-policy" },
    { id: "packages", label: "Recruiter Plans", path: "/packages" },
    { id: "campus", label: "Campus Hiring", path: "/campus-hiring" },
    { id: "student", label: "Student Sign Up", path: "/signup" },
  ];

  const tabs = [
    { id: "service", title: "Our Services", path: "/great-hire/services", content: "We provide end-to-end business solutions to help you grow and succeed. Our services include job posting and staffing, accounts and payroll management, digital marketing, and web and mobile app development. We also offer BPO, cybersecurity, and cloud computing services to improve efficiency and security." },
    { id: "implementation", title: "Blogs", path: "/Main_blog_page", content: "GreatHire is your all-in-one career hub designed to connect talent with the right opportunities. With AI-powered matching, expert career insights, and hiring guidance, we help job seekers grow and employers hire smarter. From resume building and interview preparation to industry trends and future skills, we support every stage of your career journey." },
    { id: "support", title: "About Us", path: "/about", content: "GreatHire Business Solutions is a technology-driven recruitment and workforce solutions company connecting top talent with growing businesses. We specialize in AI-powered hiring, IT staffing, and strategic workforce solutions focused on efficiency and cultural fit." },
    { id: "scalable", title: "Contact Us", path: "/contact", content: "Have questions or want to collaborate with us? Reach out to GreatHire through our FAQs, support phone number, or email for quick assistance. You can also fill out the contact form, and our team will get back to you within 24 hours." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tabs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Defer below-fold content after initial paint
  useEffect(() => {
    const t = setTimeout(() => setShowBelow(true), 500);
    return () => clearTimeout(t);
  }, []);

  // Load animation for active tab on demand
  useEffect(() => {
    const id = tabs[index]?.id;
    if (id && !tabAnimData[id]) {
      tabAnimations[id]().then(mod => {
        setTabAnimData(prev => ({ ...prev, [id]: mod.default }));
      });
    }
  }, [index]);

  // Load below-fold content after initial paint
  useEffect(() => {
    const t = setTimeout(() => setShowBelow(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Load animation for current tab on demand
  useEffect(() => {
    const id = tabs[index]?.id;
    if (id && !tabAnimData[id]) {
      tabAnimations[id]().then(mod => {
        setTabAnimData(prev => ({ ...prev, [id]: mod.default }));
      });
    }
  }, [index]);

  return (
    <>
      <Helmet>
        <title>GreatHire | Locate Jobs, Employ Talent, and Advance Your Career in India</title>
        <meta
          name="description"
          content="India's cutting-edge job search and hiring platform connecting talent and companies with safe and open hiring solutions."
        />
      </Helmet>

      <div className="[&_.hide-section]:hidden">
        <div className="w-full min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">

          {/* ══════════════════════════════════════
              FIXED NAVBAR
          ══════════════════════════════════════ */}
          <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="w-full px-6 py-3">
              <div className="flex items-center justify-between w-full">

                {/* Logo */}
                <Link to="/" className="cursor-pointer flex-shrink-0">
                  <h1 className="text-4xl font-bold text-black dark:text-white whitespace-nowrap">
                    Great<span className="text-blue-600">Hire</span>
                  </h1>
                </Link>

                {/* ── DESKTOP RIGHT SIDE ── */}
                <div className="hidden lg:flex items-center gap-2 xl:gap-3">

                  {/* Nav Links + More dropdown */}
                  <div className="flex items-center gap-0.5 xl:gap-1">
                    {directNavLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => { navigate(link.path); window.scrollTo(0, 0); }}
                        className="text-xs xl:text-sm font-medium transition-all duration-300 px-2 xl:px-3 py-2 rounded-lg text-black dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 whitespace-nowrap"
                      >
                        {link.label}
                      </button>
                    ))}

                    {/* Explore 2-column dropdown */}
                    <div ref={moreRef} className="relative">
                      <button
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                        className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-300 ${isMoreOpen
                            ? "text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-400"
                            : "text-black dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          }`}
                        aria-expanded={isMoreOpen}
                        aria-haspopup="true"
                      >
                        Explore
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isMoreOpen && (
                        <div
                          className="absolute right-0 mt-2 z-50 rounded-2xl shadow-2xl border overflow-hidden bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                          style={{ width: "min(560px, calc(100vw - 2rem))", boxShadow: "..." }}
                        >
                          {/* Header strip */}
                          <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Explore everything</span>
                          </div>

                          {/* 2-column grid */}
                          <div className="grid grid-cols-2">

                            {/* LEFT — Pages */}
                            <div className="p-3 border-r border-gray-100 dark:border-gray-700">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-2 mb-2">Pages</p>
                              <div className="space-y-0.5">
                                {[{ label: "Blogs", icon: "✍️", path: "/Main_blog_page" }, { label: "Courses", icon: "🎓", path: "/courses" }, { label: "About Us", icon: "🏢", path: "/about" }, { label: "Contact Us", icon: "📬", path: "/contact" }, { label: "Privacy Policy", icon: "🔒", path: "/policy/privacy-policy" }].map((item) => (
                                  <button
                                    key={item.label}
                                    onClick={() => { navigate(item.path); window.scrollTo(0, 0); setIsMoreOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl group hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-all duration-150"
                                  >
                                    <span className="text-base leading-none w-6 text-center shrink-0">{item.icon}</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.label}</span>
                                    <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-blue-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.17 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* RIGHT — Quick Access */}
                            <div className="p-4 flex flex-col justify-between gap-3">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-1">Quick Access</p>

                              <div className="flex flex-col gap-2.5 flex-1 justify-center">
                                <button
                                  onClick={() => { navigate("/campus-hiring"); window.scrollTo(0, 0); setIsMoreOpen(false); }}
                                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                                >
                                  <span className="flex items-center gap-2"><span className="text-lg">🏛️</span>Campus Hiring</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25">Popular</span>
                                </button>

                                <button
                                  onClick={() => { navigate("/signup"); window.scrollTo(0, 0); setIsMoreOpen(false); }}
                                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                                >
                                  <span className="flex items-center gap-2"><span className="text-lg">🚀</span>Student Sign Up</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25">Free</span>
                                </button>
                              </div>

                              <p className="text-[10px] text-gray-400 dark:text-gray-500 px-1 pt-2 border-t border-gray-100 dark:border-gray-700">
                                Already have an account?{" "}
                                <button onClick={() => { navigate("/jobseeker-login"); setIsMoreOpen(false); }} className="text-blue-500 hover:underline font-medium">Sign in →</button>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 bg-transparent text-gray-700 dark:text-white hover:scale-110 transition-all flex-shrink-0"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </button>

                  {/* ── ALL ACTION BUTTONS ── */}
                  <div className="flex items-center gap-1.5 xl:gap-2">
                    <button
                      onClick={() => navigate("/recruiter-login")}
                      className="px-2.5 xl:px-4 py-2 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all text-xs xl:text-sm font-semibold whitespace-nowrap"
                    >
                      Recruiter Login
                    </button>
                    <button
                      onClick={() => navigate("/jobseeker-login")}
                      className="px-2.5 xl:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all text-xs xl:text-sm font-semibold whitespace-nowrap"
                    >
                      Jobseeker Login
                    </button>

                  </div>
                </div>

                {/* ── MOBILE RIGHT ICONS ── */}
                <div className="lg:hidden flex items-center gap-2">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 bg-transparent text-gray-700 dark:text-white hover:scale-110 transition-all"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </button>

                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </nav>

          {/* ══════════════════════════════════════
              INTERNSHIP MARQUEE — fixed below navbar
          ══════════════════════════════════════ */}
          <div className="fixed top-[61px] left-0 right-0 z-40 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <InternshipMarquee jobs={jobs} />
          </div>

          {/* ══════════════════════════════════════
              MOBILE SLIDE-IN OVERLAY MENU
          ══════════════════════════════════════ */}

          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in panel from right */}
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 h-full w-72 z-50 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                Great<span className="text-blue-600">Hire</span>
              </h1>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Welcome banner */}
            <div className="px-5 py-3 bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Welcome to GreatHire</p>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">Sign in to access all features</p>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto" style={{ height: "calc(100% - 130px)" }}>

              {/* Nav Links */}
              <div className="py-2">
                {allMobileLinks.map(({ id, label, path }) => (
                  <button
                    key={id}
                    onClick={() => { navigate(path); window.scrollTo(0, 0); setMobileMenuOpen(false); }}
                    className="w-full text-left flex items-center px-5 py-3 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-b-0"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Auth + Action Buttons */}
              <div className="px-5 pt-4 pb-6 space-y-3 border-t border-gray-200 dark:border-gray-700">

                {/* Recruiter Login — outline */}
                <button
                  onClick={() => { navigate("/recruiter-login"); setMobileMenuOpen(false); }}
                  className="w-full py-3 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm"
                >
                  Recruiter Login
                </button>

                {/* Jobseeker Login — solid blue */}
                <button
                  onClick={() => { navigate("/jobseeker-login"); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
                >
                  Jobseeker Login
                </button>

                {/* Campus Hiring — pink/red */}
                <button
                  onClick={() => { navigate("/campus-hiring"); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
                >
                  Campus Hiring
                </button>

                {/* Student Sign Up — purple/indigo */}
                <button
                  onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
                >
                  Student Sign Up
                </button>

              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════
              HOME SECTION
          ══════════════════════════════════════ */}
          <section
            id="home"
            className="min-h-screen pt-[117px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300"
          >
            {/* Animated bg blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
              <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
              <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
              {/* Hero */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
                {/* Left */}
                <div className="space-y-6 animate-fade-in-up">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                    Find Your
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 animate-gradient">
                      Dream Career
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Join <span className="font-bold text-blue-600 dark:text-blue-400">6 Crore+</span> job seekers and explore{" "}
                    <span className="font-bold text-purple-600 dark:text-purple-400">10,000+</span> new opportunities daily across India
                  </p>

                  {/* Mobile candidate/recruiter cards */}
                  <div className="pt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
                    <button
                      onClick={() => navigate("/signup")}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6 hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3 group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">I'm a Candidate</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Find Jobs</p>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate("/recruiter/signup")}
                      className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-6 hover:shadow-xl transition-all transform hover:scale-105 flex flex-col items-center gap-3 group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">I'm a Recruiter</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Post Jobs</p>
                      </div>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8 pt-6">
                    {[
                      { value: "10K+", label: "Daily Jobs", from: "from-blue-600", to: "to-purple-600" },
                      { value: "6Cr+", label: "Job Seekers", from: "from-purple-600", to: "to-pink-600" },
                      { value: "900+", label: "Cities", from: "from-pink-600", to: "to-red-600" },
                    ].map((stat) => (
                      <div key={stat.label} className="group">
                        <h3 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.from} ${stat.to} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                          {stat.value}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — floating job cards, hidden on mobile */}
                <div className="hidden lg:block relative animate-fade-in-right">
                  <div className="relative scale-90">
                    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-1 shadow-2xl">
                      <div className="bg-white dark:bg-gray-900 rounded-[2.3rem] p-6">
                        <div className="space-y-4">
                          {[
                            { icon: <Briefcase className="w-6 h-6 text-white" />, title: "Software Developer", company: "TCS • Bangalore", salary: "₹12-18 LPA", badge: "New", badgeBg: "bg-green-100 dark:bg-green-900", badgeText: "text-green-700 dark:text-green-300", cardBg: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900", border: "border-blue-200 dark:border-blue-700", iconBg: "from-blue-500 to-blue-600", salaryColor: "text-blue-600 dark:text-blue-400", anim: "animate-float", ml: "" },
                            { icon: <Users className="w-6 h-6 text-white" />, title: "HR Manager", company: "Infosys • Mumbai", salary: "₹8-15 LPA", badge: "Hot", badgeBg: "bg-yellow-100 dark:bg-yellow-900", badgeText: "text-yellow-700 dark:text-yellow-300", cardBg: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900", border: "border-purple-200 dark:border-purple-700", iconBg: "from-purple-500 to-purple-600", salaryColor: "text-purple-600 dark:text-purple-400", anim: "animate-float-delay", ml: "" },
                            { icon: <Target className="w-6 h-6 text-white" />, title: "Marketing Lead", company: "Flipkart • Delhi", salary: "₹15-25 LPA", badge: "Apply", badgeBg: "bg-blue-100 dark:bg-blue-900", badgeText: "text-blue-700 dark:text-blue-300", cardBg: "from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900", border: "border-pink-200 dark:border-pink-700", iconBg: "from-pink-500 to-pink-600", salaryColor: "text-pink-600 dark:text-pink-400", anim: "animate-float-slow", ml: "" },
                          ].map((job) => (
                            <div key={job.title} className={`bg-gradient-to-r ${job.cardBg} rounded-2xl p-4 flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all ${job.anim} border-2 ${job.border} ${job.ml}`}>
                              <div className={`w-12 h-12 bg-gradient-to-br ${job.iconBg} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                                {job.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-white text-base truncate">{job.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate">{job.company}</p>
                                <p className={`text-xs ${job.salaryColor} font-semibold mt-1`}>{job.salary}</p>
                              </div>
                              <div className={`${job.badgeBg} ${job.badgeText} px-2 py-1 rounded-full text-xs font-bold flex-shrink-0`}>{job.badge}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-2xl border-4 border-yellow-400 animate-bounce-slow">
                      <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                      <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">Verified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Slider */}
              <Suspense fallback={<div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse mt-2" />}>
                <JobsHiringSlider />
              </Suspense>

              {/* Why Choose GreatHire */}
              <div className="mb-10">
                <div className="text-center mb-8 md:mb-12 px-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3">
                    Why Choose{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GreatHire</span>?
                  </h2>
                  <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    India's most trusted job platform with cutting-edge features
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
                  {[
                    { icon: <TrendingUp />, title: "Latest Jobs", desc: "10K+ fresh opportunities every day", gradient: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50", darkBg: "dark:from-blue-950 dark:to-cyan-950" },
                    { icon: <Zap />, title: "Easy Apply", desc: "One-click instant applications", gradient: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50", darkBg: "dark:from-purple-950 dark:to-pink-950" },
                    { icon: <Target />, title: "Smart Match", desc: "AI-powered job recommendations", gradient: "from-pink-500 to-red-500", bg: "from-pink-50 to-red-50", darkBg: "dark:from-pink-950 dark:to-red-950" },
                    { icon: <Shield />, title: "Verified Companies", desc: "500+ trusted hiring partners", gradient: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50", darkBg: "dark:from-green-950 dark:to-emerald-950" },
                  ].map((feature, i) => (
                    <div key={i} className="group relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                      <div className={`relative bg-gradient-to-br ${feature.bg} ${feature.darkBg} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-white dark:group-hover:border-gray-700 hover:-translate-y-3`}>
                        <div className="flex md:hidden items-start gap-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <div className="text-white">{feature.icon}</div>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                          </div>
                        </div>
                        <div className="hidden md:block">
                          <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                            <div className="text-white">{feature.icon}</div>
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs and Carousel */}
              <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 mt-4">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-8 mb-4 sm:mb-8">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      onClick={() => setIndex(i)}
                      className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${index === i
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                <div className="relative overflow-hidden py-4 sm:py-8">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                  >
                    {tabs.map((tab) => (
                      <div key={tab.id} className="min-w-full px-1 sm:px-6">
                        <div className="relative bg-gradient-to-r from-purple-300 to-purple-350 dark:from-purple-900 dark:to-purple-800 rounded-3xl shadow-xl p-5 sm:p-10 flex flex-col md:flex-row items-center gap-4 sm:gap-10 min-h-[12rem] sm:min-h-[16rem]">
                          <div className="flex-shrink-0">
                            {tabAnimData[tab.id] ? (
                              <Suspense fallback={<div className="w-32 h-32 sm:w-64 sm:h-64" />}>
                                <Lottie animationData={tabAnimData[tab.id]} loop autoplay className="w-32 h-32 sm:w-64 sm:h-64" />
                              </Suspense>
                            ) : (
                              <div className="w-32 h-32 sm:w-64 sm:h-64 bg-purple-200 dark:bg-purple-800 rounded-2xl animate-pulse" />
                            )}
                          </div>
                          <div className="flex-1 pb-10 md:pb-0">
                            <p className="text-sm sm:text-lg text-gray-900 dark:text-gray-100 leading-relaxed">{tab.content}</p>
                          </div>
                          <button
                            onClick={() => { navigate(tab.path); window.scrollTo(0, 0); }}
                            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                          >
                            Know More
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-3 mt-4 mb-4">
                  {tabs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all ${index === i ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              {showBelow && (
                <Suspense fallback={null}>
                  <CompactTestimonials />
                </Suspense>
              )}

              {/* CTA */}
              <div className="mt-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] blur-2xl opacity-30" />
                  <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-6 sm:p-10 md:p-16 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-56 h-56 bg-white rounded-full opacity-10 -mr-24 -mt-24" />
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-full opacity-10 -ml-24 -mb-24" />
                    <div className="relative z-10 text-center">
                      <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6">
                        Ready to Start Your Journey?
                      </h2>
                      <p className="text-blue-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-3xl mx-auto font-light">
                        Join 6 crore+ job seekers and discover your perfect career match with AI-powered recommendations
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
                        <button
                          onClick={() => { navigate("/signup-choice"); window.scrollTo(0, 0); }}
                          className="group px-6 py-4 sm:px-10 sm:py-5 bg-white text-blue-600 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <span>Create Free Account</span>
                          <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={() => { navigate("/jobs"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="px-8 py-4 sm:px-10 sm:py-5 bg-transparent text-white rounded-2xl font-bold border-2 border-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
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

            <style>{`
              @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
              @keyframes blob { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-50px) scale(1.1); } 66% { transform: translate(-20px,20px) scale(0.9); } }
              @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
              @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes fade-in-right { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
              .animate-float { animation: float 3s ease-in-out infinite; }
              .animate-float-delay { animation: float 3s ease-in-out infinite; animation-delay: 1s; }
              .animate-float-slow { animation: float 4s ease-in-out infinite; animation-delay: 2s; }
              .animate-blob { animation: blob 7s infinite; }
              .animation-delay-2000 { animation-delay: 2s; }
              .animation-delay-4000 { animation-delay: 4s; }
              .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
              .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
              .animate-fade-in-right { animation: fade-in-right 1s ease-out; }
              .animate-bounce-slow { animation: bounce 2s infinite; }
            `}</style>
          </section>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default GreatHireLanding;
