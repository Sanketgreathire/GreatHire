import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { toast } from "react-hot-toast";
import { addCompany } from "@/redux/companySlice";
import { cleanRecruiterRedux } from "@/redux/recruiterSlice";
import { removeCompany } from "@/redux/companySlice";
import { logOut } from "@/redux/authSlice";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

const CompanyDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false);
  const [dloading, dSetLoading] = useState(false);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    handleDeleteCompany();
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      {company && user?.isActive ? (
        <div className="max-w-6xl mx-auto p-8  mt-10  bg-white">
          <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Company Details
          </h1>

          {!isEditing ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">
                    Company Name
                  </p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {company?.companyName}
                  </p>
                </div>
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">
                    Company Address
                  </p>
                  <p className="text-xl text-gray-500 font-semibold">
                    Street Address:{" "}
                    <span className=" text-gray-800">
                      {company?.address.streetAddress}
                    </span>
                  </p>
                  <p className="text-xl text-gray-500 font-semibold">
                    City:{" "}
                    <span className="text-gray-800">
                      {company?.address.city}
                    </span>
                  </p>
                  <p className="text-xl text-gray-500 font-semibold">
                    Postal Code:{" "}
                    <span className=" text-gray-800">
                      {company?.address.postalCode}
                    </span>
                  </p>
                  <p className="text-xl text-gray-500 font-semibold">
                    State:{" "}
                    <span className="text-gray-800">
                      {company?.address.state}
                    </span>
                  </p>
                  <p className="text-xl text-gray-500 font-semibold">
                    Country:{" "}
                    <span className=" text-gray-800 ">
                      {company?.address.country}
                    </span>
                  </p>
                </div>
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">Website</p>
                  <a
                    href={company?.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-xl font-semibold"
                  >
                    {company?.companyWebsite}
                  </a>
                </div>
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">Industry</p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {company?.industry}
                  </p>
                </div>
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">
                    Business Email
                  </p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {company?.email}
                  </p>
                </div>
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">
                    Admin Email
                  </p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {company?.adminEmail}
                  </p>
                </div>
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {company?.phone}
                  </p>
                </div>
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">
                    CIN Number
                  </p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {company?.CIN}
                  </p>
                </div>
                <div className="info-card">
                  <p className="text-sm text-gray-500 font-medium">
                    Business File
                  </p>
                  <a
                    href={company?.businessFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-xl font-semibold"
                  >
                    View Business File
                  </a>
                </div>
              </div>

              {user?.emailId.email === company?.adminEmail && (
                <div className="flex justify-end space-x-6 mt-8">
                  <button
                    onClick={toggleEdit}
                    className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Edit Company Details
                  </button>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className={`px-6 py-3 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200 ${
                      dloading && "cursor-not-allowed"
                    }`}
                    disabled={dloading}
                  >
                    {dloading ? "Deleting..." : "Delete Company"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div className="flex justify-end space-x-6 mt-8">
                <button
                  type="submit"
                  className={`px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-200 ${
                    loading && "cursor-not-allowed"
                  }`}
                >
                  {loading ? "Changing..." : "Save Changes"}
                </button>

                <button
                  onClick={toggleEdit}
                  type="button"
                  className={`px-6 py-3 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition duration-200 ${
                    loading && "cursor-not-allowed"
                  }`}
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
