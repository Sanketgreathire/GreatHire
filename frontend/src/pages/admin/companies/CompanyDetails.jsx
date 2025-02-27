// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";

// Redux hooks for state management
import { useSelector, useDispatch } from "react-redux"; 

// Axios for making API requests
import axios from "axios"; 
import {
  COMPANY_API_END_POINT,
  RECRUITER_API_END_POINT,
} from "@/utils/ApiEndPoint"; // API endpoints

// Toast notifications for user feedback
import { toast } from "react-hot-toast"; 

// React Router hooks for navigation and parameters
import { useParams, useNavigate } from "react-router-dom"; 
import Navbar from "@/components/admin/Navbar"; // Navbar component

// Importing actions to fetch updated statistics
import {
  fetchCompanyStats,
  fetchRecruiterStats,
  fetchJobStats,
  fetchApplicationStats,
} from "@/redux/admin/statsSlice";

// Delete confirmation modal component
import DeleteConfirmation from "@/components/shared/DeleteConfirmation"; 

// CompanyDetails Component - Displays and manages a company's details
const CompanyDetails = () => {

  // Get authenticated user details from Redux store
  const { user } = useSelector((state) => state.auth); 

  // Get company ID from the route parameters
  const { companyId } = useParams(); 

  // Hook for programmatic navigation
  const navigate = useNavigate(); 

  // Hook to dispatch Redux actions
  const dispatch = useDispatch(); 

  // Loading state for deletion process
  const [dloading, dSetLoading] = useState(false);
  
  // State to store company details
  const [company, setCompany] = useState(null); 

  // State to manage delete confirmation modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); 

  // Function to fetch company details from the backend
  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.post(
        `${COMPANY_API_END_POINT}/company-by-id`,
        { companyId },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Store retrieved company details in state
        setCompany(response.data.company); 
      }
    } catch (err) {
      console.log(`Error in fetching company details: ${err}`);
    }
  };

  // Fetch company details when the component mounts
  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  // Function to handle company deletion
  const handleDeleteCompany = async () => {
    try {
      // Set loading state to true while processing deletion
      dSetLoading(true); 

      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: {
          userEmail: user?.emailId?.email, // User email for authentication
          companyId, // Company ID to be deleted
        },
        withCredentials: true,
      });

      if (response.data.success) {
        // Update company, recruiter, job, and application stats in Redux store
        dispatch(fetchCompanyStats());
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());
        dispatch(fetchApplicationStats());

        toast.success(response.data.message); // Show success message
        navigate("/admin/companies"); // Redirect to company listing page after deletion
      } else {
        toast.error(response.data.message); // Show error message if deletion fails
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error(
        "There was an error deleting the company. Please try again later."
      );
    } finally {
      dSetLoading(false); // Reset loading state after process completion
    }
  };

  // Function to confirm deletion after modal confirmation
  const onConfirmDelete = () => {
    setShowDeleteModal(false); // Close delete confirmation modal
    handleDeleteCompany(); // Proceed with deletion
  };

  // Function to cancel deletion and close the modal
  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };


  // Function to validate and sanitize URL
  const getSafeUrl = (url) => {
    if (!url) return "#"; // Default to prevent invalid URLs

    try {
      const safeUrl = new URL(url, window.location.origin);
      if (["http:", "https:"].includes(safeUrl.protocol)) {
        return encodeURI(safeUrl.href); // Encoding to prevent XSS
      }
    } catch (error) {
      return "#"; // Return safe default if URL parsing fails
    }
  };

  return (
    <>
      <Navbar linkName={"Company Details"} />
      <div className="max-w-6xl mx-auto p-8 m-4 bg-white rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Company Details
        </h1>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="info-card">
              <p className="text-sm text-gray-500 font-medium">Company Name</p>
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
                <span className="text-gray-800">
                  {company?.address.streetAddress}
                </span>
              </p>
              <p className="text-xl text-gray-500 font-semibold">
                City:{" "}
                <span className="text-gray-800">{company?.address.city}</span>
              </p>
              <p className="text-xl text-gray-500 font-semibold">
                Postal Code:{" "}
                <span className="text-gray-800">
                  {company?.address.postalCode}
                </span>
              </p>
              <p className="text-xl text-gray-500 font-semibold">
                State:{" "}
                <span className="text-gray-800">{company?.address.state}</span>
              </p>
              <p className="text-xl text-gray-500 font-semibold">
                Country:{" "}
                <span className="text-gray-800">
                  {company?.address.country}
                </span>
              </p>
            </div>
            <div className="info-card">
              <p className="text-sm text-gray-500 font-medium">Website</p>
              {company?.companyWebsite && (
                <a
                  href={getSafeUrl(company.companyWebsite)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xl font-semibold"
                >
                  {company.companyWebsite}
                </a>
              )}
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
              <p className="text-sm text-gray-500 font-medium">Admin Email</p>
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
              <p className="text-sm text-gray-500 font-medium">CIN Number</p>
              <p className="text-xl text-gray-800 font-semibold">
                {company?.CIN}
              </p>
            </div>
            <div className="info-card">
              <p className="text-sm text-gray-500 font-medium">Business File</p>
              {company?.businessFile && (
                <a
                  href={getSafeUrl(company.businessFile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xl font-semibold"
                >
                  View Business File
                </a>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-6 mt-8">
            <button
              onClick={() => navigate(`/admin/recruiters/${companyId}`)}
              className="px-6 py-3 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition"
            >
              Recruiters List
            </button>
            <button
              onClick={onConfirmDelete}
              className={`px-6 py-3 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200 ${
                dloading && "cursor-not-allowed"
              }`}
              disabled={dloading}
            >
              {dloading ? "Deleting..." : "Delete Company"}
            </button>
          </div>
        </div>
      </div>

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
