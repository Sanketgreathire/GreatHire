import React, { useState, useEffect } from "react";
import { Users, Target, Award, Building2, Briefcase, Menu, X, ChevronDown, MapPin, Bell, Search, Newspaper, Calendar, Phone, Mail, ExternalLink, Star, TrendingUp, Zap, Shield } from 'lucide-react';
import OurService from "@/pages/services/OurService";
import About from "@/pages/services/About";
import Blogs from "@/pages/services/Blogs";
import Contact from "@/pages/services/Contact";
import Footer from "@/components/shared/Footer";
import { useNavigate } from "react-router-dom";

const GreatHireLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "about", "blogs", "contact"];

      let current = "home";

      for (let id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();

          // When section is in middle of screen → mark active
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = id;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const navLinks = [
    { id: 'home', label: 'Home'  },
    { id: 'services', label: 'Our Services' },
    { id: 'about', label: 'About Us' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <div className="[&_.hide-section]:hidden">
      <div className="w-full min-h-screen bg-white">
        {/* Fixed Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
          <div className="w-full px-6 py-3">
            <div className="flex items-center justify-between w-full">

              {/* LEFT SIDE – LOGO */}
              <div className="flex items-center">
                <h1 className="text-4xl font-bold text-black whitespace-nowrap">
                  Great<span className="text-blue-600">Hire</span>
                </h1>
              </div>

              {/* RIGHT SIDE – NAV LINKS + LOGIN BUTTONS */}
              <div className="hidden lg:flex items-center gap-10">

                {/* Desktop Navigation */}
                <div className="flex items-center gap-6">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg ${activeSection === link.id
                        ? "text-white bg-blue-600 shadow-lg"
                        : "text-black hover:text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                {/* Login Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.location.href = '/recruiter-login'}
                    className="px-5 py-2.5 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all text-sm font-semibold"
                  >
                    Recruiter Login
                  </button>
                  <button
                    onClick={() => window.location.href = '/jobseeker-login'}
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
                      onClick={() => scrollToSection(link.id)}
                      className={`text-left py-2 px-3 rounded ${activeSection === link.id
                        ? "text-blue-600 bg-blue-50 font-medium"
                        : "text-gray-700"
                        }`}
                    >
                      {link.label}
                    </button>
                  ))}
                  <button className="mt-3 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg" onClick={() => window.location.href = '/recruiter-login'}>
                    Recruiter Login
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold" onClick={() => window.location.href = '/jobseeker-login'}>
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
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
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

                {/* Premium Search Box */}
                <div className="bg-white rounded-3xl shadow-2xl p-4 flex flex-col lg:flex-row gap-4 border-2 border-blue-100 hover:border-blue-300 transition-all">
                  <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                    <Search className="w-6 h-6 text-blue-600" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company..."
                      className="bg-transparent outline-none w-full text-gray-700 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    <input
                      type="text"
                      placeholder="City or state"
                      className="bg-transparent outline-none w-full text-gray-700 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <button className="px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Jobs
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

            {/* Premium Features Grid */}
            <div className="mt-28 mb-20">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-gray-900 mb-4">
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
                    <div className={`relative bg-gradient-to-br ${feature.bg} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent group-hover:border-white hover:-translate-y-3`}>
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                        <div className="text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Trusted Companies */}
            <div className="mt-28 mb-20">
              <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border-2 border-gray-100">
                <div className="text-center mb-10">
                  <p className="text-gray-500 font-semibold text-lg mb-2">Trusted by India's leading companies</p>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-12">
                  {['HCL', 'BookMyShow', 'NYKAA', 'DECATHLON', 'Amazon'].map((company, i) => (
                    <div key={i} className="group">
                      <div className="text-3xl font-black text-gray-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 cursor-pointer transform group-hover:scale-125">
                        {company}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ultra Premium CTA Section */}
            <div className="mt-28">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] blur-2xl opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-16 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 -mr-48 -mt-48"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full opacity-10 -ml-48 -mb-48"></div>

                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                      Ready to Start Your Journey?
                    </h2>
                    <p className="text-blue-100 text-xl mb-10 max-w-3xl mx-auto font-light">
                      Join 6 crore+ job seekers and discover your perfect career match with AI-powered recommendations
                    </p>
                    {/* <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <button className="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                      <span>Create Free Account</span>
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-10 py-5 bg-transparent text-white rounded-2xl font-bold border-3 border-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                      <Search className="w-5 h-5" />
                      <span>Browse Jobs</span>
                    </button>
                  </div> */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                      <button
                        onClick={() => {
                          navigate("/signup-choice");
                          window.scrollTo(0, 0);
                        }}
                        className="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
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

            {/* Scroll Indicator */}
            <div className="mt-20 flex justify-center pb-20">
              <div className="animate-bounce bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full shadow-xl">
                <ChevronDown className="w-6 h-6 text-white" />
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

        {/* SERVICES SECTION */}
        <section id="services">
          <div className="[&_footer]:hidden">
            <OurService />
          </div>
        </section>


        {/* ABOUT US SECTION */}
        <section id="about">
          <div className="[&_footer]:hidden">
            <About />
          </div>
        </section>

        {/* BLOGS SECTION */}
        <section id="blogs">
          <div className="[&_footer]:hidden">
            <Blogs />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact">
          <div className="[&_footer]:hidden">
            <Contact />
          </div>
        </section>


        {/* Footer - Sirf end me */}
        <Footer />
      </div>
    </div>
  );
};

export default GreatHireLanding;