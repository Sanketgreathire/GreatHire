// Import necessary modules and dependencies
import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const OurService = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Job Posting & Candidate Database Services",
      description:
        "Publish job for your organization or find best candidate that fits with you goal .",
      icon: "🔍",
      url: "/packages",
    },
    {
      title: "Accounts and Payroll",
      description:
        "Streamline your financial operations and payroll management with precision.",
      icon: "💼",
      url: "/contact",
    },
    {
      title: "Digital Marketing",
      description:
        "Enhance your online presence and connect with your audience effectively.",
      icon: "📈",
      url: "/Blogs",
    },
    {
      title: "Staffing",
      description:
        "Find the right talent for your organization with our expert staffing solutions.",
      icon: "🤝",
      url: "/contact",
    },
    {
      title: "Web & Mobile App Development",
      description:
        "Develop and maintain high-quality web and mobile applications tailored to your needs.",
      icon: "📱",
      url: "/contact",
    },
    {
      title: "BPO",
      description:
        "Optimize business processes and reduce operational costs with our BPO services.",
      icon: "📞",
      url: "/contact",
    },
    {
      title: "Cybersecurity Services",
      description:
        "Protect your business with advanced cybersecurity solutions.",
      icon: "🔒",
      url: "/contact",
    },
    {
      title: "Cloud Computing Services",
      description:
        "Leverage cloud technologies to improve scalability and flexibility.",
      icon: "☁️",
      url: "/contact",
    },
    {
      title: "AI & Machine Learning",
      description:
        "Integrate AI and ML to automate processes and drive innovation.",
      icon: "🤖",
      url: "/contact",
    },
  ];

  return (
    <>

      <Helmet>
        <title>Our Services | Expert Staffing, IT, and Business Solutions in Hyderabad State</title>
        <meta
          name="description"
          content="Discover our comprehensive services in Hyderabad State designed to boost your business success. From job posting, staffing, and payroll management to web & mobile app development, digital marketing, AI & machine learning, cybersecurity, BPO, and cloud computing, we deliver tailored solutions for organizations of all sizes. Our expert team ensures your operations are streamlined, your online presence thrives, and your workforce performs at its best. Partner with us in Hyderabad State to transform your business processes, enhance efficiency, and stay ahead in a competitive market."
        />
      </Helmet>


      <Navbar />
      <div className="bg-blue-50 dark:bg-gray-800">
        {/* Hero Section */}
        {/* <header className="bg-gradient-to-tr from-blue-900 via-indigo-800 to-blue-500 text-white py-16"> */}
        {/* <header className="bg-gradient-to-b from-indigo-800 from-[50%] to-blue-500 to-[100%] text-white py-16">




          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
            <h1 className="text-3xl md:text-5xl font-bold font-[Oswald]">
              Our Services Tailored for Your Success
            </h1>
            <p className="mt-4 text-lg md:text-xl font-serif">
              Explore our diverse range of services designed to meet your
              business needs.
            </p>
          </div>
        </header> */}
        <header className="text-white py-10 flex justify-center mt-6">
          {/* Small card container */}
          <div className="w-full relative bg-gradient-to-b from-blue-300 to-blue-600 shadow-2xl text-center px-80 py-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Our Services</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-black">
              Our Services Tailored for Your Success
            </h1>
            <p className="mt-3 text-base md:text-lg font-serif">
              Explore our diverse range of services designed to meet your
              business needs.
            </p>
          </div>
        </header>

        {/* Services Section */}
        <section className="py-10 bg-blue-50 dark:bg-gray-800 "> {/* changed padding from 16 to 10*/}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <h2 className="text-4xl md:text-5xl font-bold font-[Oswald] bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center mb-16"> {/* Removed animation-bounce*/}
              What We Offer
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3
             gap-6 lg:gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className=" bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-95 cursor-pointer"
                  onClick={() =>
                    navigate(service.url)
                  }
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-gray-600 text-sm md:text-base">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        {/* <section className="bg-gradient-to-b from-blue-500 from-[0%] to-indigo-900 to-[80%] text-white py-16"> */}
        {/* <section className="bg-gradient-to-tr from-pink-600 via-purple-600 to-blue-600 text-white py-16 rounded-3xl  shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
            <h2 className="text-3xl md:text-4xl font-bold font-[Oswald]">
              Let's Work Together
            </h2>
            <p className="mt-4 text-lg">
              Ready to take your business to the next level? Get in touch with
              us today.
            </p>
            <button
              className="mt-8 bg-white text-blue-500 py-3 px-8 rounded-lg shadow-lg font-medium hover:bg-gray-100 transition duration-300"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </button>
          </div>
        </section> */}
      </div>
      <Footer />
    </>
  );
};

export default OurService;