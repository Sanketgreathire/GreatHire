import React, { useState } from "react";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { changeAdminUser } from "@/redux/companySlice";
import { logOut } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { cleanRecruiterRedux } from "@/redux/recruiterSlice";
import { removeCompany } from "@/redux/companySlice";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recruiters } = useSelector((state) => state.recruiters);
  const { company } = useSelector((state) => state.company);
  const [deleteTooltip, setDeleteTooltip] = useState(false);
  const [promoteTooltip, setPromoteTooltip] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [ploading, pSetLoading] = useState(false);
  const [dloading, dSetLoading] = useState(false);

  const changeAdmin = async () => {
    try {
      pSetLoading(true);
      const response = await axios.put(
        `${COMPANY_API_END_POINT}/change-admin`,
        {
          email: user?.emailId.email,
          companyId: company?._id,
          adminEmail: selectedEmail,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(changeAdminUser(selectedEmail));
        navigate("/recruiter/dashboard/home");
        toast.success("Admin change 😊");
      } else {
        toast.error("error in changing admin");
      }
    } catch (err) {
      console.error("Error changing admin:", err);
      toast.error("An error occurred while changing admin. Please try again.");
    } finally {
      pSetLoading(false);
    }
  };

  const deleteAccount = async () => {
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
      console.error("Error deleting account:", err);
      toast.error(
        "There was an error deleting the recruiter. Please try again later."
      );
    } finally {
      dSetLoading(false);
    }
  };

  return (
    <>
      {company && user?.isActive ? (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 via-blue-100 to-gray-100">
          <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-4 sm:mx-0">
            <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
              Delete Account
            </h1>
            <p className="text-sm text-gray-700 text-center mb-6">
              Before leaving, assign a recruiter as the new admin. Remember, you
              will lose all admin rights.
            </p>

            {/* Dropdown */}
            <div className="mb-6">
              <label
                htmlFor="recruiter"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Select a Recruiter
              </label>
              <select
                id="recruiter"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Choose a recruiter</option>
                {recruiters?.map(
                  (recruiter) =>
                    company?.adminEmail !== recruiter?.emailId.email && (
                      <option
                        key={recruiter.emailId.email}
                        value={recruiter.emailId.email}
                      >
                        {recruiter.emailId.email}
                      </option>
                    )
                )}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4">
              <button
                onMouseEnter={() => setPromoteTooltip(true)}
                onMouseLeave={() => setPromoteTooltip(false)}
                onClick={changeAdmin}
                className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all ease-in-out ${
                  ploading && "cursor-not-allowed"
                }`}
              >
                {ploading
                  ? "Promoting..."
                  : promoteTooltip
                  ? " You will lose admin rights"
                  : "Promote to Admin"}
              </button>

              <button
                onMouseEnter={() => setDeleteTooltip(true)}
                onMouseLeave={() => setDeleteTooltip(false)}
                onClick={deleteAccount}
                className={`w-full bg-red-600 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:bg-red-500 transition-all ease-in-out ${
                  dloading && "cursor-not-allowed"
                }`}
              >
                {dloading
                  ? "Deleting..."
                  : deleteTooltip
                  ? " Account Deletion will lose company and job!"
                  : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">
            You are not verified by GreatHire
          </span>
        </p>
      )}
    </>
  );
};

export default DeleteAccount;
