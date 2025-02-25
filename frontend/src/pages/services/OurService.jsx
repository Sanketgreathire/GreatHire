import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useNavigate } from "react-router-dom";

const OurService = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Job Posting & Candidate Database Services",
      description:
        "Publish job for your organization or find best candidate that fits with you goal .",
      icon: "🔍",
      url: "/recruiter/signup",
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
      url: "/contact",
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
      <Navbar />
      <div className="bg-gray-50">
        {/* Hero Section */}
        <header className="bg-gradient-to-tr from-indigo-400 to-purple-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">
              Our Services Tailored for Your Success
            </h1>
            <p className="mt-4 text-lg md:text-xl">
              Explore our diverse range of services designed to meet your
              business needs.
            </p>
          </div>
        </header>

        {/* Services Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 text-blue-600 animate-bounce ">
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
        <section className="bg-gradient-to-tr from-teal-500 to-blue-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
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
        </section>
      </div>
      <Footer />
    </>
  );
};

export default OurService;
