import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaPhoneAlt,
  FaRegEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaThreads,
  FaRocket,
  FaUsers,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const maxChars = 500;

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "message" && value.length > maxChars) {
      toast.error("Message cannot exceed 500 characters");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/sendMessage", {
        ...formData,
      });

      if (data.success) {
        toast.success(data.message);
        setFormData({
          fullname: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(`Error in sending message: ${err}`);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact GreatHire | Get in Touch with Our Skilled Staff</title>
        <meta
          name="description"
          content="Get in touch with Great Hire in the Hyderabad State for expert recruitment and collaboration. Our expert staff is all set to answer your queries and provide extraordinary guidance so that the best and the brightest are found for you."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />

        {/* Enhanced Hero Section with Light Mode Optimized Colors */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
          {/* Animated background with geometric shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating orbs */}
            <div className="absolute -top-40 -right-40 w-72 sm:w-96 h-72 sm:h-96 bg-blue-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-10 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-purple-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-4000"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-3"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Centered Header Content */}
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-indigo-200 dark:border-white/10 rounded-full px-5 sm:px-7 py-2.5 mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-300 shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm sm:text-base font-semibold text-indigo-900 dark:text-white">We're Here to Help</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Let's Start a{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Conversation
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 2 100 2 150 5C200 8 250 10 298 5" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="50%" stopColor="#A78BFA" />
                        <stop offset="100%" stopColor="#F472B6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                Your next great hire is just a message away. Connect with our expert team
                and discover how we can transform your recruitment journey.
              </p>
            </div>

            {/* Contact Method Cards - Better Aligned Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* FAQ Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-purple-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col shadow-lg">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl">
                      <FaQuestionCircle className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Quick Answers</h3>
                    <p className="text-base text-slate-600 dark:text-gray-400 leading-relaxed">
                      Browse our comprehensive FAQ section for instant answers to common questions.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <a
                      href="#faq"
                      className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-white font-semibold transition-colors group/link"
                    >
                      Browse FAQs
                      <span className="group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Support Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-blue-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col shadow-lg">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl">
                      <FaPhoneAlt className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Call Us</h3>
                    <p className="text-base text-slate-600 dark:text-gray-400 leading-relaxed">
                      Speak directly with our expert team for personalized assistance.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <a
                      href="tel:+918328192093"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-white font-semibold transition-colors group/link"
                    >
                      +91-8328192093
                      <span className="group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-50 transition-all duration-500"></div>
                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-pink-200 dark:border-white/10 hover:border-pink-400 dark:hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col shadow-lg">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl">
                      <FaRegEnvelope className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Email Us</h3>
                    <p className="text-base text-slate-600 dark:text-gray-400 leading-relaxed">
                      Drop us an email and expect a response within 24 hours.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <a
                      href="mailto:hr@babde.tech"
                      className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-300 hover:text-pink-700 dark:hover:text-white font-semibold transition-colors group/link break-all"
                    >
                      hr@babde.tech
                      <span className="group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section with Enhanced Layout and Dark Mode */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 dark:via-purple-600 to-transparent"></div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

              {/* Left Side - Info Cards (2 columns) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Why Choose Us Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-slate-950/50 p-8 border border-slate-200 dark:border-slate-700 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FaStar className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Why Connect With Us?</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FaRocket className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Lightning Fast</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">24-hour response guarantee during business days</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FaUsers className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Expert Team</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Professional advisors with 15+ years experience</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FaShieldAlt className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">100% Secure</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your data is encrypted and never shared</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-3xl shadow-2xl py-4 px-8 text-white relative overflow-hidden border border-slate-700 dark:border-slate-800">

                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl"></div>

                  <div className="relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-6">Get in Touch</h3>

                    <div className="space-y-5">
                      <div className="flex items-start gap-4 group cursor-pointer hover:bg-white/5 dark:hover:bg-white/3 p-4 rounded-xl transition-all">
                        <div className="flex-shrink-0 w-12 h-12 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 dark:group-hover:bg-white/10 transition-all">
                          <FaMapMarkerAlt className="text-blue-400 text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1 text-lg">Office</h4>
                          <p className="text-slate-300 dark:text-slate-400">Hyderabad, Telangana, India</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 group cursor-pointer hover:bg-white/5 dark:hover:bg-white/3 p-4 rounded-xl transition-all">
                        <div className="flex-shrink-0 w-12 h-12 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 dark:group-hover:bg-white/10 transition-all">
                          <FaClock className="text-green-400 text-xl" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1 text-lg">Hours</h4>
                          <p className="text-slate-300 dark:text-slate-400">Mon–Fri: 9:00 AM – 6:00 PM</p>
                          <p className="text-slate-300 dark:text-slate-400">Sat: 10:00 AM – 4:00 PM</p>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="mt-6 pt-6 border-t border-white/10 dark:border-white/5">
                      <h4 className="font-semibold mb-4 text-lg">Connect With Us</h4>
                      <div className="flex gap-4">
                        <a
                          href="https://www.linkedin.com/company/greathire/"
                          className="w-12 h-12 bg-white/10 dark:bg-white/5 hover:bg-blue-600 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110 group"
                        >
                          <FaLinkedin className="text-blue-400 group-hover:text-white text-xl transition-colors" />
                        </a>

                        <a
                          href="https://www.instagram.com/great_hire?igsh=YnQ1a3g2a3Bhc25p"
                          className="w-12 h-12 bg-white/10 dark:bg-white/5 hover:bg-pink-500 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110 group"
                        >
                          <FaInstagram className="text-pink-400 group-hover:text-white text-xl transition-colors" />
                        </a>

                        <a
                          href="https://www.facebook.com/share/15WGT743qv/"
                          className="w-12 h-12 bg-white/10 dark:bg-white/5 hover:bg-blue-700 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110 group"
                        >
                          <FaFacebook className="text-blue-500 group-hover:text-white text-xl transition-colors" />
                        </a>

                        <a
                          href="https://www.threads.net/@great_hire"
                          className="w-12 h-12 bg-white/10 dark:bg-white/5 hover:bg-black backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110 group"
                        >
                          <FaThreads className="text-gray-300 group-hover:text-white text-xl transition-colors" />
                        </a>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form (3 columns) */}
              <div className="lg:col-span-3">
                <div className="relative">
                  {/* Glowing effect behind form */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 rounded-3xl blur-3xl opacity-20 dark:opacity-10"></div>

                  <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-slate-950/50 p-8 sm:p-10 lg:p-12 border border-slate-200 dark:border-slate-700">
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                          <FaPaperPlane className="text-white text-2xl" />
                        </div>
                        <div>
                          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                            Send a Message
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">We'll respond within 24 hours</p>
                        </div>
                      </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="relative group">
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            Full Name
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="fullname"
                            className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 outline-none transition-all group-hover:border-slate-300 dark:group-hover:border-slate-500 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="John Doe"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="relative group">
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            Email Address
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 outline-none transition-all group-hover:border-slate-300 dark:group-hover:border-slate-500 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="relative group">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                          Phone Number
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 outline-none transition-all group-hover:border-slate-300 dark:group-hover:border-slate-500 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="relative group">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                          Your Message
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows="6"
                          name="message"
                          className="w-full px-5 py-4 border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 outline-none transition-all resize-none group-hover:border-slate-300 dark:group-hover:border-slate-500 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          placeholder="Tell us about your requirements, questions, or how we can help you..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Maximum {maxChars} characters
                          </span>
                          <span
                            className={`text-sm font-bold ${formData.message.length > maxChars * 0.9
                              ? "text-red-500"
                              : "text-purple-600 dark:text-purple-400"
                              }`}
                          >
                            {formData.message.length}/{maxChars}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 transform ${loading
                          ? "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/50 dark:hover:shadow-purple-500/30 hover:-translate-y-1 active:translate-y-0 hover:scale-105"
                          }`}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Your Message...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="text-xl" />
                            Send Message
                            <span className="text-2xl">→</span>
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-8 flex items-start gap-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-2xl p-5">
                      <FaCheckCircle className="text-green-600 dark:text-green-500 text-2xl flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed">
                          <strong className="text-base">Your privacy matters.</strong> All information is encrypted and will only be used to respond to your inquiry. We typically respond within 24 hours during business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Common for Both Recruiters & Job Seekers */}
        <section id="faq" className="relative bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-500/5 dark:to-pink-500/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-blue-200 dark:border-white/10 rounded-full px-5 py-2 mb-6">
                <FaQuestionCircle className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Frequently Asked Questions
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Got Questions? We've Got Answers
              </h2>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Everything you need to know about our platform, whether you're hiring or looking for your next opportunity
              </p>
            </div>

            {/* FAQ Grid */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">

              {/* For Job Seekers - FAQ 1 */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      How do I apply for jobs?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Simply create your profile, browse available jobs, and click "Apply Now" on positions that interest you. You can track all your applications from your dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* For Recruiters - FAQ 1 */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      How quickly can I start receiving applications?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Most job postings start receiving applications within 24 hours. Our platform has 50,000+ active job seekers ready to apply.
                    </p>
                  </div>
                </div>
              </div>

              {/* For Job Seekers - FAQ 2 */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      Is the platform free for job seekers?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Yes! Creating an account, browsing jobs, and applying to positions is completely free for all job seekers. No hidden charges.
                    </p>
                  </div>
                </div>
              </div>

              {/* For Recruiters - FAQ 2 */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      What makes your platform different?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      We offer verified candidate profiles, smart matching algorithms, and dedicated support to ensure quality hires faster than traditional job boards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Common - FAQ 1 */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      How is my data protected?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      We use industry-standard encryption and never share your personal information without consent. Your privacy and security are our top priorities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Common - FAQ 2 */}
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      How can I get support if I need help?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Our support team is available Mon-Fri, 9 AM - 6 PM. Contact us via email at hr@babde.tech or call +91-8328192093 for immediate assistance.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Still Have Questions?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
                  Our friendly team is here to help. Reach out and we'll get back to you within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#contact-form"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <FaPaperPlane />
                    Send Us a Message
                  </a>
                  <a
                    href="tel:+918328192093"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all transform hover:-translate-y-1"
                  >
                    <FaPhoneAlt />
                    Call Us Now
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Trusted by 50,000+ Professionals Across India
                  </span>
                  <span className="text-xl">🇮🇳</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <Footer />

        {/* Enhanced Animation CSS */}
        <style jsx>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(40px, -60px) scale(1.15);
            }
            66% {
              transform: translate(-30px, 30px) scale(0.95);
            }
          }
          .animate-blob {
            animation: blob 8s infinite ease-in-out;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
          }
          .shadow-3xl {
            box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default ContactSection;