import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaPhoneAlt,
  FaRegEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-40 pb-20 px-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Let's{" "}
            <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have a question or want to collaborate? We'd love to hear from you.
            Get in touch with us today!
          </p>
        </div>

        {/* Contact Grid */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Info Card 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-800 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 hover:border-purple-500 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FaQuestionCircle className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">FAQ</h3>
                <p className="text-gray-400 mb-4">
                  Find quick answers to frequently asked questions about our
                  services and features.
                </p>
              </div>
              <div className="text-left">
                <a href="#faq" className="text-sm text-blue-300 hover:underline">
                  Browse FAQs →
                </a>
              </div>
            </div>
          </div>

          {/* Info Card 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-800 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FaPhoneAlt className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Support
                </h3>
                <p className="text-gray-400 mb-4">
                  Get in touch with our support team for personalized
                  assistance.
                </p>
              </div>
              <div className="text-left">
                <a
                  href="tel:+91-8328192093"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-2"
                >
                  +91-8328192093 →
                </a>
              </div>
            </div>
          </div>

          {/* Info Card 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-slate-800 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 hover:border-pink-500 transition-all duration-300 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FaRegEnvelope className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Email</h3>
                <p className="text-gray-400 mb-4">
                  Send us an email and we'll get back to you shortly.
                </p>
              </div>
              <div className="text-left">
                <a
                  href="mailto:hr@babde.tech"
                  className="text-pink-400 hover:text-pink-300 font-semibold transition-colors inline-flex items-center gap-2"
                >
                  hr@babde.tech →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-pink-300 to-red-300 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-10 md:p-14">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <FaPaperPlane className="text-blue-600" />
                Send a Message
              </h2>
              <p className="text-gray-600 mb-10">
                Fill out the form below and we'll respond within 24 hours.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all group-hover:border-slate-300"
                      placeholder="John Doe"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all group-hover:border-slate-300"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all group-hover:border-slate-300"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Message
                  </label>
                  <textarea
                    rows="6"
                    name="message"
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none group-hover:border-slate-300"
                    placeholder="Tell us about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      Maximum{" "}
                      <span className="font-semibold text-slate-700">
                        {maxChars}
                      </span>{" "}
                      characters
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        formData.message.length > maxChars * 0.9
                          ? "text-red-500"
                          : "text-purple-600"
                      }`}
                    >
                      {formData.message.length}/{maxChars}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-900 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
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
      `}</style>
    </div>
  );
};

export default ContactSection;