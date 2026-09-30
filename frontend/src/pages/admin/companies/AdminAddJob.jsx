import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import Navbar from "@/components/admin/Navbar";
import PostJob from "@/pages/recruiter/postJob/PostJob";

const AdminAddJob = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
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
          toast.error(response.data.message || "Failed to load company");
        }
      } catch (err) {
        console.error("Error loading company:", err);
        toast.error("Failed to load company. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <>
        <Navbar linkName="Add Job" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100" />
        </div>
      </>
    );
  }

  if (!company) {
    return (
      <>
        <Navbar linkName="Add Job" />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
          <p className="text-xl text-gray-600 dark:text-gray-400">Company not found</p>
          <button
            onClick={() => navigate("/admin/companies")}
            className="px-6 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800"
          >
            Back to Companies
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar linkName="Add Job" />
      <PostJob
        adminMode
        adminCompany={company}
        onSuccess={() => navigate(`/admin/for-admin/company-details/${companyId}`)}
      />
    </>
  );
};

export default AdminAddJob;