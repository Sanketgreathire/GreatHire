import React, { useState } from "react";
import axios from "axios";
import { FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { removeRecruiter, toggleActiveStatus } from "@/redux/recruiterSlice.js";
import { removeUserFromCompany } from "@/redux/companySlice";
import { toast } from "react-hot-toast";
import { RECRUITER_API_END_POINT, EMAIL_API_END_POINT } from "@/utils/ApiEndPoint";
import { useNavigate } from "react-router-dom";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Helmet } from "react-helmet-async";
const RecruiterList = () => {
  const { recruiters } = useSelector((state) => state.recruiters);
  const navigate = useNavigate();
  const [loading, setLoading] = useState({});
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { company } = useSelector((state) => state.company);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Email state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [emailModal, setEmailModal] = useState(false);
  const [emailTarget, setEmailTarget] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openEmailModal = (singleEmail = null) => {
    setEmailTarget(singleEmail);
    setEmailSubject("Message from GreatHire Recruitment Team");
    setEmailMessage(
      `Dear Recruiter,\n\nWe wanted to reach out to you regarding your account on GreatHire.\n\nPlease feel free to contact us if you have any questions.\n\nBest regards,\nThe GreatHire Team`
    );
    setEmailModal(true);
  };

  const handleSendEmail = async () => {
    const emails = emailTarget
      ? [emailTarget]
      : filteredRecruiters
          .filter((r) => selectedIds.has(r._id))
          .map((r) => r.emailId?.email)
          .filter(Boolean);

    if (emails.length === 0) return toast.error("No valid email addresses found.");

    setSendingEmail(true);
    try {
      const res = await axios.post(
        `${EMAIL_API_END_POINT}/send`,
        { emails, subject: emailSubject, message: emailMessage },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setEmailModal(false);
        setSelectedIds(new Set());
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send email.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Function to toggle the active status of a recruiter
  const toggleActive = async (event, recruiterId, isActive) => {
    event.stopPropagation(); // Prevents event bubbling
    try {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: true }));
      const response = await axios.put(
        `${RECRUITER_API_END_POINT}/toggle-active`,
        {
          recruiterId,
          companyId: company?._id,
          isActive,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(toggleActiveStatus({ recruiterId, isActive }));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling recruiter:", error);
      toast.error(
        "There was an error toggling the recruiter. Please try again later."
      );
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: false }));
    }
  };

  // Function to delete a recruiter
  const deleteRecruiter = async (recruiterId, userEmail, companyId) => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: true }));
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: { userEmail, companyId },
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(removeUserFromCompany(recruiterId));
        dispatch(removeRecruiter(recruiterId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting recruiter:", error);
      toast.error(
        "There was an error deleting the recruiter. Please try again later."
      );
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: false }));
    }
  };

  // Confirm deletion of recruiter
  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    deleteRecruiter(
      selectedRecruiter._id,
      selectedRecruiter.emailId.email,
      company._id
    );
  };

  // Cancel deletion of recruiter
  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Filtering recruiters based on search term and status
  const filteredRecruiters = (recruiters || []).filter((recruiter) => {
    // Ensure recruiter is a valid object before accessing its properties
    if (!recruiter || typeof recruiter !== "object" || !recruiter.fullname) {
      return false;
    }
    console.log("recruiter", recruiter);
    const searchMatch =
      recruiter.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.emailId.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (recruiter.phoneNumber?.number || "").includes(searchTerm);

    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "active" && recruiter.isActive) ||
      (filterStatus === "inactive" && !recruiter.isActive);

    return searchMatch && statusMatch;
  });

  return (
    <>
      <Helmet>
        <title>
          GreatHire's Recruiter List | Hiring Team Management & Access Controls
        </title>

        <meta
          name="description"
          content="The GreatHire Recruiter List page enables companies to manage recruitment teams efficiently with total control and insight. Designed specifically to meet contemporary business needs, this tool is, with pride, longingly running from Hyderabad State, India, serving its purpose to technology, staffing, startup, and enterprise companies. Using this page, administrators have the ability to check recruiter details, search through names or contact information, activate/deactivate recruitment privileges, or delete recruiters if necessary with total security. GreatHire allows companies to manage recruitment personnel efficiently, keeping them well-organized, accountable, and highly productive with total ease."
        />
      </Helmet>

      {company && user?.isActive ? (
        <div className="container mx-auto p-4 min-h-screen pt-20 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
          <h2 className="text-2xl text-center underline font-semibold mb-4  text-gray-800 dark:text-gray-100">Recruiter List</h2>
          {/* Bulk Email Button */}
          {selectedIds.size > 0 && (
            <div className="flex justify-end mb-3">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition"
                onClick={() => openEmailModal(null)}
              >
                <FiMail size={15} /> Send Email to Selected ({selectedIds.size})
              </button>
            </div>
          )}

          <div className="mb-4 flex justify-between px-2">
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 w-64 rounded-sm border border-gray-400 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 rounded border border-gray-400 bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <table className="min-w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
            <thead className="text-center">
              <tr>
                <th className="py-3 px-3 bg-gray-200 dark:bg-gray-700"></th>
                <th className="py-3 px-6 text-sm font-medium uppercase tracking-wider bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  Full Name
                </th>
                <th className="py-3 px-6 text-sm font-medium uppercase tracking-wider bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  Email
                </th>
                <th className="py-3 px-6 text-sm font-medium uppercase tracking-wider bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  Phone
                </th>
                <th className="py-3 px-6 text-sm font-medium uppercase tracking-wider bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  Position
                </th>
                {user?.emailId.email === company?.adminEmail && (
                  <>
                    <th className="py-3 px-6 text-sm font-medium uppercase tracking-wider bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                      Active
                    </th>
                    <th className="py-3 px-6 text-sm font-medium uppercase tracking-wider bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="text-center">
              {filteredRecruiters.length !== 0 ? (
                filteredRecruiters.map((recruiter) => (
                  <tr
                    key={recruiter?._id}
                    className="border-b cursor-pointer border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                    onClick={() =>
                      navigate(
                        `/recruiter/dashboard/recruiter-details/${recruiter?._id}`
                      )
                    }
                  >
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(recruiter._id)}
                        onChange={() => toggleSelect(recruiter._id)}
                        className="cursor-pointer accent-blue-600"
                      />
                    </td>
                    <td className="py-3 px-6 text-gray-800 dark:text-gray-100">{recruiter?.fullname || " "}</td>
                    <td className="py-3 px-6 text-gray-800 dark:text-gray-100">{recruiter.emailId.email}</td>
                    <td className="py-3 px-6 text-gray-800 dark:text-gray-100">{recruiter.phoneNumber?.number || "N/A"}</td>
                    <td className="py-3 px-6 text-gray-800 dark:text-gray-100">{recruiter.position}</td>
                    {user?.emailId.email === company?.adminEmail && (
                      <>
                        {recruiter?.emailId.email === company?.adminEmail ? (
                          <>
                            <td className="py-3 px-6 text-gray-800 dark:text-gray-100">-----</td>
                            <td className="py-3 px-6 text-gray-800 dark:text-gray-100">-----</td>
                          </>
                        ) : (
                          <>
                            <td className="flex justify-center py-3 px-6 text-gray-800 dark:text-gray-100">
                              {loading[recruiter._id] ? (
                                "loading..."
                              ) : recruiter.isActive ? (
                                <FaToggleOn
                                  className="text-green-500 dark:text-green-400 cursor-pointer"
                                  onClick={(event) =>
                                    toggleActive(
                                      event,
                                      recruiter._id,
                                      !recruiter.isActive
                                    )
                                  }
                                  size={30}
                                />
                              ) : (
                                <FaToggleOff
                                  className="text-red-500 dark:text-red-400 cursor-pointer"
                                  onClick={(event) =>
                                    toggleActive(
                                      event,
                                      recruiter._id,
                                      !recruiter.isActive
                                    )
                                  }
                                  size={30}
                                />
                              )}
                            </td>

                            <td className="py-3 px-6 text-gray-800 dark:text-gray-100">
                              {loading[recruiter._id] ? (
                                "loading..."
                              ) : (
                                <div className="flex items-center justify-center gap-3">
                                  <button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openEmailModal(recruiter.emailId?.email);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    title="Send Email"
                                  >
                                    <FiMail size={18} />
                                  </button>
                                  <button
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedRecruiter(recruiter);
                                      setShowDeleteModal(true);
                                    }}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <FaTrash size={18} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </>
                        )}
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-3 px-6 text-center text-gray-500 dark:text-gray-400">
                    No Recruiter Data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span className="text-4xl text-gray-400">Company not created</span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center text-gray-400 dark:text-gray-500">
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

      {/* Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              {emailTarget ? "Send Email to Recruiter" : `Send Email to ${selectedIds.size} Recruiter(s)`}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Subject</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Message</label>
                <textarea
                  rows={6}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setEmailModal(false)}
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailSubject.trim() || !emailMessage.trim()}
              >
                {sendingEmail ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecruiterList;
