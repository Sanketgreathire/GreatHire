import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/admin/Navbar";

const CompanyDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [dloading, dSetLoading] = useState(false);
  const [company, setCompany] = useState(null);

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.post(
        `${COMPANY_API_END_POINT}/company-by-id`,
        { companyId },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setCompany(response.data.company);
      }
    } catch (err) {
      console.log(`error in company fetching ${err}`);
    }
  };
  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const handleDeleteCompany = async () => {
    try {
      dSetLoading(true);
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: {
          userEmail: user?.emailId?.email,
          companyId,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
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

  return (
    <>
      <Navbar linkName={"Company Details"} />
      <div className="max-w-6xl mx-auto p-8  m-4  bg-white rounded-lg">
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
                <span className=" text-gray-800">
                  {company?.address.streetAddress}
                </span>
              </p>
              <p className="text-xl text-gray-500 font-semibold">
                City:{" "}
                <span className="text-gray-800">{company?.address.city}</span>
              </p>
              <p className="text-xl text-gray-500 font-semibold">
                Postal Code:{" "}
                <span className=" text-gray-800">
                  {company?.address.postalCode}
                </span>
              </p>
              <p className="text-xl text-gray-500 font-semibold">
                State:{" "}
                <span className="text-gray-800">{company?.address.state}</span>
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

          <div className="flex justify-end space-x-6 mt-8">
            <button
              onClick={()=>navigate(`/admin/recruiters/${companyId}`)}
              className={`px-6 py-3 text-white bg-blue-700 rounded-md hover:bg-blue-800 transition`}
            >
              Recruiters List
            </button>
            <button
              onClick={handleDeleteCompany}
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
    </>
  );
};

export default CompanyDetails;
