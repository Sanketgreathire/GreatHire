// Import necessary modules and dependencies
import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";


import ServicesHeroBg from "./ServicesHeroBg.png";

const OurService = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Job Posting & Candidate Database Services",
      description:
        "Publish job for your organization or find best candidate that fits with you goal .",
      icon: "🔍",
      url: "/packages",
      gradient: "from-blue-500 to-cyan-500",
      darkGradient: "from-blue-600 to-cyan-600",
    },
    {
      title: "Accounts and Payroll",
      description:
        "Streamline your financial operations and payroll management with precision.",
      icon: "💼",
      url: "/contact",
      gradient: "from-green-500 to-emerald-500",
      darkGradient: "from-green-600 to-emerald-600",
    },
    {
      title: "Digital Marketing",
      description:
        "Enhance your online presence and connect with your audience effectively.",
      icon: "📈",
      url: "/Main_blog_page",
      gradient: "from-purple-500 to-pink-500",
      darkGradient: "from-purple-600 to-pink-600",
    },
    {
      title: "Staffing",
      description:
        "Find the right talent for your organization with our expert staffing solutions.",
      icon: "🤝",
      url: "/contact",
      gradient: "from-orange-500 to-red-500",
      darkGradient: "from-orange-600 to-red-600",
    },
    {
      title: "Web & Mobile App Development",
      description:
        "Develop and maintain high-quality web and mobile applications tailored to your needs.",
      icon: "📱",
      url: "/contact",
      gradient: "from-indigo-500 to-blue-500",
      darkGradient: "from-indigo-600 to-blue-600",
    },
    {
      title: "BPO",
      description:
        "Optimize business processes and reduce operational costs with our BPO services.",
      icon: "📞",
      url: "/contact",
      gradient: "from-cyan-500 to-blue-500",
      darkGradient: "from-cyan-600 to-blue-600",
    },
    {
      title: "Cybersecurity Services",
      description:
        "Protect your business with advanced cybersecurity solutions.",
      icon: "🔒",
      url: "/contact",
      gradient: "from-red-500 to-pink-500",
      darkGradient: "from-red-600 to-pink-600",
    },
    {
      title: "Cloud Computing Services",
      description:
        "Leverage cloud technologies to improve scalability and flexibility.",
      icon: "☁️",
      url: "/contact",
      gradient: "from-sky-500 to-cyan-500",
      darkGradient: "from-sky-600 to-cyan-600",
    },
    {
      title: "AI & Machine Learning",
      description:
        "Integrate AI and ML to automate processes and drive innovation.",
      icon: "🤖",
      url: "/Main_blog_page",
      gradient: "from-violet-500 to-purple-500",
      darkGradient: "from-violet-600 to-purple-600",
    },
  ];

  return (
    <>
      <Helmet>
        <title>GreatHire Services | Professional IT, Business Solutions, and Staffing</title>
        <meta
          name="description"
          content="Find the array of services offered by our company in the state of Hyderabad to optimize your business achievements. Starting from the posting of jobs and the development of websites and mobile applications to the development of AI & machine learning and cybersecurity services, each and every service offered by our company has the ability to optimize your business processes and enable your employees to work at optimal levels. Allow us to assist your business in the state of Hyderabad and stay ahead of the tough competition."
        />
      </Helmet>

      <Navbar />
      <div className="bg-blue-50 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
        {/* Dark mode ambient background */}
        <div className="hidden dark:block fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <header className="text-white py-8 md:py-10 flex justify-center mt-6 relative z-10">
          {/* Hero Card - Light Mode */}
          <div
            className="
              w-full
              relative
              shadow-2xl
              text-center
              px-4 sm:px-8 md:px-16 lg:px-32 xl:px-80
              py-8 md:py-10
              rounded-none md:rounded-xl
              bg-cover bg-center
              overflow-hidden
              dark:hidden
            "
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(96,165,250,0.85),
                  rgba(92, 68, 165, 0.85),
                  rgba(173, 24, 101, 0.85)
                ),
                url(${ServicesHeroBg})
              `
            }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-5 md:mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Our Services</span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight">
              Our Services Tailored for Your Success
            </h1>

            {/* Description */}
            <p className="mt-3 text-sm sm:text-base md:text-lg font-serif max-w-3xl mx-auto">
              Explore our diverse range of services designed to meet your business needs.
            </p>
          </div>

          {/* Hero Card - Dark Mode */}
          <div
            className="
              w-full
              relative
              hidden
              dark:flex
              dark:flex-col
              dark:justify-center
              dark:items-center
              shadow-2xl
              text-center
              px-4 sm:px-8 md:px-16 lg:px-32 xl:px-80
              py-8 md:py-10
              rounded-none md:rounded-xl
              bg-gradient-to-br
              dark:from-slate-800/80
              dark:via-slate-800/60
              dark:to-blue-900/40
              dark:backdrop-blur-xl
              dark:border
              dark:border-blue-500/30
              dark:shadow-2xl
              dark:shadow-blue-500/20
              overflow-hidden
            "
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-500/20 dark:border dark:border-blue-400/50 backdrop-blur-md px-4 py-2 rounded-full mb-5 md:mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 dark:text-blue-300" />
                <span className="text-sm font-medium dark:text-blue-200">Our Services</span>
              </div>

              {/* Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight dark:text-white dark:drop-shadow-lg">
                Our Services Tailored for Your Success
              </h1>

              {/* Description */}
              <p className="mt-3 text-sm sm:text-base md:text-lg font-serif max-w-3xl mx-auto dark:text-gray-300">
                Explore our diverse range of services designed to meet your business needs.
              </p>
            </div>
          </div>
        </header>

        {/* Services Section */}
        <section className="py-8 md:py-12 bg-blue-50 dark:bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-[Oswald] bg-gradient-to-r from-purple-600 to-blue-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                What We Offer
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-blue-400 dark:to-cyan-400 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="
                    group
                    relative
                    bg-white 
                    dark:bg-slate-800/50
                    dark:backdrop-blur-lg
                    dark:border dark:border-slate-700/50
                    dark:hover:border-slate-600
                    px-6 md:px-8 py-3 md:py-4
                    rounded-2xl
                    shadow-lg 
                    dark:shadow-xl
                    dark:shadow-slate-900/50
                    hover:shadow-2xl 
                    dark:hover:shadow-slate-900/80
                    transition-all 
                    duration-500
                    hover:scale-105
                    dark:hover:scale-105
                    cursor-pointer
                    overflow-hidden
                  "
                  onClick={() => navigate(service.url)}
                >
                  {/* Gradient background overlay for dark mode */}
                  <div className={`hidden dark:block absolute inset-0 bg-gradient-to-br ${service.darkGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>

                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.darkGradient} dark:opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <div className="relative z-10">
                    <div className="text-3xl md:text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>

                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white group-hover:dark:text-transparent group-hover:dark:bg-gradient-to-r group-hover:dark:from-blue-400 group-hover:dark:to-cyan-400 group-hover:dark:bg-clip-text transition-all duration-300">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-gray-600 dark:text-gray-400 group-hover:dark:text-gray-200 text-sm md:text-base leading-relaxed transition-colors duration-300">
                      {service.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Corner accent for dark mode */}
                  <div className={`hidden dark:block absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl ${service.darkGradient} opacity-0 group-hover:opacity-10 rounded-tl-3xl transition-opacity duration-500`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default OurService;