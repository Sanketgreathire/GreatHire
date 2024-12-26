import React, { useState } from "react";
import { FaQuestionCircle, FaPhoneAlt, FaRegEnvelope } from "react-icons/fa";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";

const ContactSection = () => {
  const [disable, setDisable] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullname: user ? user.fullname : "",
    email: user ? user.email : "",
    phoneNumber: user ? user.phoneNumber : "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/user/sendMessage",
        {
          formData,
        }
      );
      // use data.message
      if (data.success) {
        toast.success(data.message);
        setFormData({
          fullname: user ? user.fullname : "",
          email: user ? user.email : "",
          phoneNumber: user ? user.phoneNumber : "",
          message: "",
        });
      } else {
        toast.error(data.message);
      }
      setDisable(false);
    } catch (err) {
      console.log(`error in sending message ${err}`);
      setDisable(false);
    }
  };
  return (
    <>
      <Navbar />
      <section className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Get in Touch Section */}
          <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h2 className="text-4xl font-semibold mb-6 text-indigo-700">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              We're here to assist you with anything you need. Reach out to us
              for inquiries, support, or just to say hi!
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <FaQuestionCircle className="text-3xl text-indigo-600" />
                <div>
                  <h4 className="text-xl font-medium text-gray-800">FAQ</h4>
                  <p className="text-sm text-gray-500">
                    Find quick answers to frequently asked questions.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FaPhoneAlt className="text-3xl text-green-600" />
                <div>
                  <h4 className="text-xl font-medium text-gray-800">Support</h4>
                  <p className="text-sm text-gray-500">
                    Get in touch with our support team for personalized
                    assistance.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FaRegEnvelope className="text-3xl text-purple-600" />
                <div>
                  <h4 className="text-xl font-medium text-gray-800">
                    Email Us
                  </h4>
                  <p className="text-sm text-gray-500">
                    Send us an email, and we'll get back to you shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Send Message Section */}
          <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            <h2 className="text-4xl font-semibold mb-6 text-indigo-700">
              Send a Message
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="fullname"
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Your Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="email"
                  name="phoneNumber"
                  id="email"
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  name="message"
                  className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Your Message"
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                  disable && "bg-blue-300"
                }`}
                disabled={disable}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactSection;
