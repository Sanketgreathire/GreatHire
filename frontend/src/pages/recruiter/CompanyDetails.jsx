import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BACKEND_URL, COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { toast } from "react-hot-toast";
import { addCompany } from "@/redux/companySlice";
import { cleanRecruiterRedux } from "@/redux/recruiterSlice";
import { removeCompany } from "@/redux/companySlice";
import { logOut } from "@/redux/authSlice";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Helmet } from "react-helmet-async";

const CompanyDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  // Local states for handling loading, edit mode, and delete confirmation modal
  const [loading, setLoading] = useState(false);
  const [dloading, dSetLoading] = useState(false);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  // Initialize form data with company details
  const [formData, setFormData] = useState({
    companyWebsite: company?.companyWebsite,
    address: {
      streetAddress: company?.address.streetAddress,
      city: company?.address.city,
      postalCode: company?.address.postalCode,
      state: company?.address.state,
      country: company?.address.country,
    },
    industry: company?.industry,
    email: company?.email,
    phone: company?.phone,
  });

  // Toggle between edit and view mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes for regular form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input changes for address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };
  // Submit updated company details
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${COMPANY_API_END_POINT}/update/${company?._id}`,
        {
          ...formData,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(addCompany(response.data.company));
        toast.success("Company details updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update company details. Please try again.");
      console.error("Error updating company details", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete company and log out the user
  const handleDeleteCompany = async () => {
    try {
      dSetLoading(true);
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: {
          userEmail: user?.emailId.email,
          companyId: company?._id,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(cleanRecruiterRedux()); // Ensure this action is defined
        dispatch(removeCompany()); // Ensure this action is defined
        dispatch(logOut());
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error(
        "There was an error deleting the company. Please try again later."
      );
    } finally {
      dSetLoading(false);
    }
  };

  // Confirm and proceed with company deletion
  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    handleDeleteCompany();
  };

  // Cancel company deletion
  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <Helmet>
        <title>Company Information | View & Manage Company Profile - GreatHire</title>
        <meta
          name="description"
          content="GreatHire offers a safe and holistic experience for management of company details. Trusted and used by companies based out of Hyderabad State, India, this page enables company administrators to easily check, modify, and manage their official company details, addresses, industry information, and contact details. GreatHire is designed to ensure a transparent and manageable experience related to accurate company profiling and processing of verification. Boost your corporate identity and ensure you are in compliance while you power up your hiring process with a safe and scalable company management system."
        />
      </Helmet>

      {company && user?.isActive ? (
        <div className="max-w-6xl mx-auto p-10 mt-20 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Company Details
          </h1>

          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Company Info */}
              <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="text-sm text-gray-500 font-medium mb-1">Company Name</p>
                <p className="text-lg text-gray-900 font-semibold">{company?.companyName}</p>

                <p className="text-sm text-gray-500 font-medium mb-1 mt-6">Industry</p>
                <p className="text-lg text-gray-900 font-semibold">{company?.industry}</p>
              </div>

              {/* Address */}
              <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors col-span-full lg:col-span-2">
                <p className="text-sm text-gray-500 font-medium mb-4">Company Address</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Street Address</p>
                    <p className="text-gray-900 font-semibold">{company?.address?.streetAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">City</p>
                    <p className="text-gray-900 font-semibold">{company?.address?.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">State</p>
                    <p className="text-gray-900 font-semibold">{company?.address?.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Postal Code</p>
                    <p className="text-gray-900 font-semibold">{company?.address?.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Country</p>
                    <p className="text-gray-900 font-semibold">{company?.address?.country}</p>
                  </div>
                </div>
              </div>

              {/* Other Info */}
              <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="text-sm text-gray-500 font-medium mb-1">Phone</p>
                <p className="text-lg text-gray-900 font-semibold">{company?.phone}</p>
              </div>

              <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="text-sm text-gray-500 font-medium mb-1">Business Email</p>
                <p className="text-lg text-gray-900 font-semibold break-all">{company?.email}</p>
              </div>

              <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="text-sm text-gray-500 font-medium mb-1">Admin Email</p>
                <p className="text-lg text-gray-900 font-semibold break-all">{company?.adminEmail}</p>
              </div>

              <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="text-sm text-gray-500 font-medium mb-1">Website</p>
                <a
                  href={company?.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold break-all"
                >
                  {company?.companyWebsite}
                </a>
              </div>

              <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="text-sm text-gray-500 font-medium mb-1">CIN Number</p>
                <p className="text-md text-gray-900 font-semibold">{company?.CIN}</p>
              </div>

              <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="text-sm text-gray-500 font-medium mb-1">Business File</p>
                <a
                  href={company?.businessFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View Business File
                </a>
              </div>

              {/* Buttons (col-span-full for alignment) */}
              <div className="col-span-full">
                {user?.emailId.email === company?.adminEmail && (
                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                    <button
                      onClick={toggleEdit}
                      //className="px-8 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
                      className="px-8 py-3 text-white font-semibold rounded-xl shadow-md bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                      transition-all duration-300 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 
                      hover:shadow-blue-500/40 hover:scale-105"
                    >
                      Edit Company Details
                    </button>

                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className={`px-8 py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-300 
                        ${dloading
                          ? "bg-gradient-to-r from-red-300 to-red-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 hover:shadow-red-500/40 hover:scale-105"
                        }`}
                      disabled={dloading}
                    >
                      {dloading ? "Deleting..." : "Delete Company"}
                    </button>
                  </div>
                )}
              </div>
            </div>

          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData?.companyWebsite}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.address.streetAddress}
                    onChange={handleAddressChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData?.address.postalCode}
                    onChange={handleAddressChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData?.address.state}
                    onChange={handleAddressChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData?.address.country}
                    onChange={handleAddressChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="input-card">
                  <label className="text-sm text-gray-600 font-medium">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:justify-end gap-4 mt-8 w-full">
                <button
                  type="submit"
                  className={`w-full md:w-auto px-6 py-3 font-semibold text-white bg-green-600 rounded-md border border-transparent 
      transition-all duration-300 hover:bg-white hover:text-green-600 hover:border-green-600 
      ${loading && "cursor-not-allowed"}`}
                >
                  {loading ? "Changing..." : "Save Changes"}
                </button>

                <button
                  onClick={toggleEdit}
                  type="button"
                  className={`w-full md:w-auto px-6 py-3 font-semibold text-white bg-gray-600 rounded-md border border-transparent 
      transition-all duration-300 hover:bg-white hover:text-gray-600 hover:border-gray-600 
      ${loading && "cursor-not-allowed"}`}
                >
                  Cancel
                </button>
              </div>

            </form>
          )}
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">
            GreatHire will verify your company soon.
          </span>
        </p>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
    </>
  );
};

export default CompanyDetails;
