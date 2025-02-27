// Import necessary modules and dependencies
// React and useState for component state management
import React, { useState } from "react"; 

// Icons for UI
import { FaQuestionCircle, FaPhoneAlt, FaRegEnvelope } from "react-icons/fa"; 
import Navbar from "@/components/shared/Navbar"; 
import Footer from "@/components/shared/Footer";

// Redux hook to access global state
import { useSelector } from "react-redux"; 

// Toast notifications for user feedback
import { toast } from "react-hot-toast"; 

// Axios for making API requests
import axios from "axios"; 

// API endpoint for user-related actions
import { USER_API_END_POINT } from "@/utils/ApiEndPoint"; 

// Contact Section Component
const ContactSection = () => {
  const [loading, setLoading] = useState(false); // State to manage loading status
  const { user } = useSelector((state) => state.auth); // Get user details from Redux state
  const maxChars = 500; // Maximum character limit for the message input

  // Form state management
  const [formData, setFormData] = useState({
    fullname: user ? user?.fullname : "", // Pre-fill user details if logged in
    email: user ? user?.emailId?.email : "",
    phoneNumber: user ? user?.phoneNumber?.number : "",
    message: "",
  });

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict message length to maxChars
    if (name === "message" && value.length > maxChars) {
      toast.error("Message cannot exceed 500 characters");
      return;
    }

    // Update form state
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading to true while request is in progress

    try {
      // Send contact form data to backend API
      const { data } = await axios.post(`${USER_API_END_POINT}/sendMessage`, {
        ...formData,
      });

      // Handle success response
      if (data.success) {
        toast.success(data.message); // Show success message
        setFormData({
          fullname: user ? user.fullname : "", // Reset form fields after submission
          email: user ? user.emailId?.email : "",
          phoneNumber: user ? user.phoneNumber?.number : "",
          message: "",
        });
      } else {
        toast.error(data.message); // Show error message if request fails
      }
    } catch (err) {
      console.error(`Error in sending message: ${err}`); // Log error
      toast.error("Failed to send message. Please try again."); // Show error toast
    } finally {
      setLoading(false); // Reset loading state after request completes
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
