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
  const [loading, setLoading] = useState(true);

  // State to manage delete confirmation modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to fetch company details from the backend
  // const fetchCompanyDetails = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${COMPANY_API_END_POINT}/company-by-id`,
  //       { companyId },
  //       { withCredentials: true }
  //     );

  //     if (response.data.success) {
  //       // Store retrieved company details in state
  //       setCompany(response.data.company); 
  //     }
  //   } catch (err) {
  //     console.log(`Error in fetching company details: ${err}`);
  //   }
  // };

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${COMPANY_API_END_POINT}/company-by-id`,
        { companyId },
        { withCredentials: true }
      );

      if (response.data.success) {
        setCompany(response.data.company);
      } else {
        toast.error(response.data.message || "Failed to fetch company details");
      }
    } catch (err) {
      console.error(`Error in fetching company details:`, err);
      toast.error("Failed to load company details. Please try again.");
    } finally {
      setLoading(false);
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
  // Add loading and error checks here, before the main return
  if (loading) {
    return (
      <>
        <Navbar linkName={"Company Details"} />
        <div className="max-w-6xl mx-auto p-8 m-4 bg-white rounded-lg">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading company details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!company) {
    return (
      <><Navbar linkName={"Company Details"} />
        <div className="max-w-6xl mx-auto p-8 m-4 bg-white rounded-lg">
          <div className="text-center p-8">
            <p className="text-xl text-gray-600">Company not found</p>
            <button
              onClick={() => navigate("/admin/companies")}
              className="mt-4 px-6 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition"
            >
              Back to Companies
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
  <>
    <Navbar linkName={"Company Details"} />

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 mt-20">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 text-center">
          Company Details
        </h1>

        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Company Info */}
            <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
              <p className="text-sm text-gray-500 font-medium mb-1">
                Company Name
              </p>
              <p className="text-lg text-gray-900 font-semibold break-words">
                {company?.companyName}
              </p>

              <p className="text-sm text-gray-500 font-medium mb-1 mt-6">
                Industry
              </p>
              <p className="text-lg text-gray-900 font-semibold break-words">
                {company?.industry}
              </p>
            </div>

            {/* Address */}
            <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors col-span-full lg:col-span-2">
              <p className="text-sm text-gray-500 font-medium mb-4">
                Company Address
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Street Address
                  </p>
                  <p className="text-gray-900 font-semibold break-words">
                    {company?.address?.streetAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">City</p>
                  <p className="text-gray-900 font-semibold">
                    {company?.address?.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">State</p>
                  <p className="text-gray-900 font-semibold">
                    {company?.address?.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Postal Code
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {company?.address?.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Country</p>
                  <p className="text-gray-900 font-semibold">
                    {company?.address?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Other Info */}
            <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
              <p className="text-sm text-gray-500 font-medium mb-1">Phone</p>
              <p className="text-lg text-gray-900 font-semibold break-words">
                {company?.phone}
              </p>
            </div>

            <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
              <p className="text-sm text-gray-500 font-medium mb-1">
                Business Email
              </p>
              <p className="text-lg text-gray-900 font-semibold break-all">
                {company?.email}
              </p>
            </div>

            <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
              <p className="text-sm text-gray-500 font-medium mb-1">
                Admin Email
              </p>
              <p className="text-lg text-gray-900 font-semibold break-all">
                {company?.adminEmail}
              </p>
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
              <p className="text-sm text-gray-500 font-medium mb-1">
                CIN Number
              </p>
              <p className="text-md text-gray-900 font-semibold break-words">
                {company?.CIN || "Not Provided"}
              </p>
            </div>

            <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
              <p className="text-sm text-gray-500 font-medium mb-1">
                Business File
              </p>
              <a
                href={company?.businessFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View Business File
              </a>
            </div>

            {/* Buttons */}
            <div className="col-span-full">
              <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 mt-8">
                <button
                  onClick={() =>
                    navigate(`/admin/recruiters/${companyId}`)
                  }
                  className="w-full sm:w-auto px-6 py-3 text-white bg-blue-700 border-2 border-transparent rounded-md hover:bg-gray-100 hover:text-blue-700 hover:border-blue-700 hover:font-bold transition-all duration-200"
                >
                  Recruiters List
                </button>

                <button
                  onClick={onConfirmDelete}
                  className={`w-full sm:w-auto px-6 py-3 text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200 ${
                    dloading && "cursor-not-allowed"
                  }`}
                  disabled={dloading}
                >
                  {dloading ? "Deleting..." : "Delete Company"}
                </button>
              </div>
            </div>
          </div>
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
