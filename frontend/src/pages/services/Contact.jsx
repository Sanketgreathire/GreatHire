import React, { useState } from "react";
import { FaQuestionCircle, FaPhoneAlt, FaRegEnvelope } from "react-icons/fa";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const maxChars = 500;

  const [formData, setFormData] = useState({
    fullname: user ? user?.fullname : "",
    email: user ? user?.emailId?.email : "",
    phoneNumber: user ? user?.phoneNumber?.number : "",
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
      const { data } = await axios.post(`${USER_API_END_POINT}/sendMessage`, {
        ...formData,
      });
      if (data.success) {
        toast.success(data.message);
        setFormData({
          fullname: user ? user.fullname : "",
          email: user ? user.emailId?.email : "",
          phoneNumber: user ? user.phoneNumber?.number : "",
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
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <section className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 py-16 px-6 flex-1">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-4xl font-semibold mb-6 text-indigo-700">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                We are here to assist you with anything you need. Reach out to
                us for inquiries, support, or just to say hi!
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
                    <h4 className="text-xl font-medium text-gray-800">
                      Support
                    </h4>
                    <p className="text-sm text-gray-500">
                      Get in touch with our support team for personalized
                      assistance.
                      <br />
                      Contact No:{" "}
                      <a
                        href="tel:+91-8328192093"
                        className="text-blue-600 hover:underline"
                      >
                        +91-8328192093
                      </a>
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
                      Send us an email, and we will get back to you shortly.
                      <br />
                      Email:{" "}
                      <a
                        href="mailto:Hr@greathire.in"
                        className="text-blue-600 hover:underline"
                      >
                        Hr@greathire.in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-4xl font-semibold mb-6 text-indigo-700">
                Send a Message
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Your Name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    name="message"
                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <p className="text-right text-sm text-gray-500">
                    {formData.message.length}/{maxChars} characters
                  </p>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
                    loading && "bg-blue-300 cursor-not-allowed"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default ContactSection;
