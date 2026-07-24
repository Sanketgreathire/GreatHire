import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { COMPANY_API_END_POINT, RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { toast } from "react-hot-toast";
import { addCompany } from "@/redux/companySlice";
import { cleanRecruiterRedux } from "@/redux/recruiterSlice";
import { removeCompany } from "@/redux/companySlice";
import { logOut } from "@/redux/authSlice";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Helmet } from "react-helmet-async";
import {
  Building2, Globe, Phone, Mail, MapPin, FileText, Hash,
  Pencil, Trash2, CheckCircle, Clock, X, Save, ExternalLink,
  Briefcase, CreditCard, Users
} from "lucide-react";

const InfoCard = ({ icon: Icon, label, value, isLink, href, iconBg }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg || "bg-blue-50 dark:bg-blue-900/30"}`}>
      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      {isLink && href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all">
          {value} <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      ) : (
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 break-all">{value || "—"}</p>
      )}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

const CompanyDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false);
  const [dloading, dSetLoading] = useState(false);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyWebsite: company?.companyWebsite || "",
    address: {
      streetAddress: company?.address?.streetAddress || "",
      city: company?.address?.city || "",
      postalCode: company?.address?.postalCode || "",
      state: company?.address?.state || "",
      country: company?.address?.country || "",
    },
    industry: company?.industry || "",
    email: company?.email || "",
    phone: company?.phone || "",
  });

  const toggleEdit = useCallback(() => setIsEditing((v) => !v), []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAddressChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
  }, []);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${COMPANY_API_END_POINT}/update/${company?._id}`,
        { ...formData },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(addCompany(response.data.company));
        toast.success("Company details updated successfully!");
        setIsEditing(false);
      }
    } catch {
      toast.error("Failed to update company details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, company?._id, dispatch]);

  const handleDeleteCompany = useCallback(async () => {
    try {
      dSetLoading(true);
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: { userEmail: user?.emailId.email, companyId: company?._id },
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(cleanRecruiterRedux());
        dispatch(removeCompany());
        dispatch(logOut());
        toast.success(response.data.message);
        window.location.href = "/";
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("There was an error deleting the company. Please try again later.");
    } finally {
      dSetLoading(false);
    }
  }, [user?.emailId.email, company?._id, dispatch]);

  const onConfirmDelete = useCallback(() => { setShowDeleteModal(false); handleDeleteCompany(); }, [handleDeleteCompany]);
  const onCancelDelete = useCallback(() => setShowDeleteModal(false), []);

  const isAdmin = user?.emailId?.email === company?.adminEmail;
  const isVerified = company?.isActive;
  const planColors = {
    FREE: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    STANDARD: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    PREMIUM: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    PRO: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    ENTERPRISE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  };

  return (
    <>
      <Helmet>
        <title>Company Information | GreatHire</title>
        <meta name="description" content="View and manage your company profile on GreatHire." />
      </Helmet>

      {company && user?.isActive ? (
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 shadow-lg overflow-hidden">
              {/* decorative circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Company Initial Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-3xl font-bold shadow-inner flex-shrink-0">
                  {(company?.companyName || "C")[0].toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{company?.companyName}</h1>
                    {isVerified ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-400/20 text-green-200 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-200 text-xs font-medium">
                        <Clock className="w-3 h-3" /> Pending Verification
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${planColors[company?.plan] || planColors.FREE}`}>
                      {company?.plan || "FREE"} Plan
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> {company?.industry || "Industry not set"}
                  </p>
                  <p className="text-blue-200 text-xs mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {[company?.address?.city, company?.address?.state, company?.address?.country].filter(Boolean).join(", ") || "Location not set"}
                  </p>
                </div>

                {isAdmin && !isEditing && (
                  <button
                    onClick={toggleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition backdrop-blur"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              {/* Stats Row */}
              <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <p className="text-white/70 text-xs mb-0.5">Job Credits</p>
                  <p className="text-white font-bold text-lg">{company?.creditedForJobs ?? 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <p className="text-white/70 text-xs mb-0.5">Candidate Views</p>
                  <p className="text-white font-bold text-lg">{company?.creditedForCandidates ?? 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center col-span-2 sm:col-span-1">
                  <p className="text-white/70 text-xs mb-0.5">Free Jobs Posted</p>
                  <p className="text-white font-bold text-lg">{company?.freeJobsPosted ?? 0}</p>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <>
                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard icon={Phone} label="Phone" value={company?.phone} iconBg="bg-green-50 dark:bg-green-900/20" />
                  <InfoCard icon={Mail} label="Business Email" value={company?.email} iconBg="bg-blue-50 dark:bg-blue-900/20" />
                  <InfoCard icon={Mail} label="Admin Email" value={company?.adminEmail} iconBg="bg-indigo-50 dark:bg-indigo-900/20" />
                  <InfoCard icon={Globe} label="Website" value={company?.companyWebsite} isLink href={company?.companyWebsite} iconBg="bg-purple-50 dark:bg-purple-900/20" />
                  <InfoCard icon={Hash} label="CIN Number" value={company?.CIN || "Not Provided"} iconBg="bg-orange-50 dark:bg-orange-900/20" />
                  <InfoCard icon={MapPin} label="Full Address" value={[company?.address?.streetAddress, company?.address?.city, company?.address?.state, company?.address?.postalCode, company?.address?.country].filter(Boolean).join(", ")} iconBg="bg-red-50 dark:bg-red-900/20" />
                </div>

                {/* Business File */}
                {company?.businessFile && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Business Registration File</p>
                        <p className="text-xs text-gray-400">{company?.bussinessFileName || "Business document"}</p>
                      </div>
                    </div>
                    <a
                      href={company?.businessFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
                    >
                      <ExternalLink className="w-4 h-4" /> View File
                    </a>
                  </div>
                )}

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <button
                      onClick={toggleEdit}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow transition"
                    >
                      <Pencil className="w-4 h-4" /> Edit Company Details
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      disabled={dloading}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium rounded-xl shadow transition"
                    >
                      <Trash2 className="w-4 h-4" /> {dloading ? "Deleting..." : "Delete Company"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Edit Form */
              <form onSubmit={handleFormSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Company Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Field label="Website">
                    <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} className={inputCls} />
                  </Field>
                  <Field label="Industry">
                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className={inputCls} />
                  </Field>
                  <Field label="Business Email">
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputCls} />
                  </Field>
                  <Field label="Phone">
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={inputCls} />
                  </Field>
                  <Field label="Street Address">
                    <input type="text" name="streetAddress" value={formData.address.streetAddress} onChange={handleAddressChange} className={inputCls} />
                  </Field>
                  <Field label="City">
                    <input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} className={inputCls} />
                  </Field>
                  <Field label="State">
                    <input type="text" name="state" value={formData.address.state} onChange={handleAddressChange} className={inputCls} />
                  </Field>
                  <Field label="Postal Code">
                    <input type="text" name="postalCode" value={formData.address.postalCode} onChange={handleAddressChange} className={inputCls} />
                  </Field>
                  <Field label="Country">
                    <input type="text" name="country" value={formData.address.country} onChange={handleAddressChange} className={inputCls} />
                  </Field>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-xl transition"
                  >
                    <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={toggleEdit}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : !company ? (
        <div className="h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
          <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          <p className="text-2xl font-semibold text-gray-400 dark:text-gray-500">No company created yet</p>
        </div>
      ) : (
        <div className="h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
          <Clock className="w-16 h-16 text-yellow-400" />
          <p className="text-2xl font-semibold text-gray-500 dark:text-gray-400">GreatHire will verify your company soon.</p>
          <p className="text-sm text-gray-400">We'll notify you once the verification is complete.</p>
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmation isOpen={showDeleteModal} onConfirm={onConfirmDelete} onCancel={onCancelDelete} />
      )}
    </>
  );
};

export default CompanyDetails;
