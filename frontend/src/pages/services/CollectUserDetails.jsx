import React, { useState } from "react";
import axios from "axios";
import { razorpay_key_id } from "@/utils/RazorpayCredentials";
import { toast } from "react-hot-toast";
import {
  VERIFICATION_API_END_POINT,
  ORDER_API_END_POINT,
  REVENUE_API_END_POINT,
} from "@/utils/ApiEndPoint";
import GreatHireLogo from "../../assets/Great.png";

const CollectUserDetails = ({ selectedPlan }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "" };

    if (!formData.name) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const initiatePayment = async (userDetails, selectedPlan) => {
    try {
      const response = await axios.post(
        `${ORDER_API_END_POINT}/create-order-for-service`,
        {
          userDetails,
          planDetails: {
            planId: selectedPlan.planId,
            planHead: selectedPlan.headline,
            planSubHead: selectedPlan.subHeading,
            amount: selectedPlan.price,
          },
        }
      );

      const { orderId, amount, currency } = response.data;

      const options = {
        key: razorpay_key_id,
        amount,
        currency,
        name: "GreatHire",
        description: selectedPlan?.headline,
        image: { GreatHireLogo },
        order_id: orderId,
        handler: async (response) => {
          const verificationResponse = await axios.post(
            `${VERIFICATION_API_END_POINT}/verify-payment-for-service`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verificationResponse.data.success) {
            toast.success("Payment Successful!");
            // Call revenue API to store details
            await axios.post(`${REVENUE_API_END_POINT}/store-revenue`, {
              itemDetails: {
                itemType: "Job Service Plan",
                itemName: selectedPlan.headline,
                price: selectedPlan.price,
              },
              companyName: "",
              userDetails: {
                userName: userDetails.name,
                email: userDetails.email,
                phoneNumber: userDetails.phone,
              },
            });
          } else {
            toast.error("Payment Verification Failed!");
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: { color: "#528FF0" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Error initiating payment. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      initiatePayment(formData, selectedPlan);
      setFormData({ name: "", email: "", phone: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center">
          Great<span className="text-blue-700">Hire</span>
          <p className="text-xl text-gray-400">
            Give details to process payment.
          </p>
        </h1>
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CollectUserDetails;
