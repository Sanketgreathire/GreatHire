import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Navbar from "@/components/shared/Navbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector, useDispatch } from "react-redux";
import { COMPANY_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { addCompany } from "@/redux/companySlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setRecruiterIsCompanyCreated } from "@/redux/authSlice";
import { Helmet } from "react-helmet-async";
import { Building2, MapPin, Phone, ShieldCheck, User, CheckCircle } from "lucide-react";
import s from "./CreateCompany.module.css";

const CreateCompany = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.isCompanyCreated) navigate("/recruiter/dashboard/post-job");
  }, [user]);

  const [formData, setFormData] = useState({
    companyName: "",
    companyWebsite: "",
    industry: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    email: "",
    phone: "",
    recruiterPosition: user?.position || "",
    recruiterPhone: user?.phoneNumber?.number || "",
    CIN: "",
    businessFile: null,
    isAgree: false,
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckboxChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.checked });

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const allowed = [
      "image/jpeg", "image/png", "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, PDF, or Word documents are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB.");
      return;
    }
    setFormData({ ...formData, businessFile: file });
    setFileUploaded(false);
    setUploadProgress(0);
    const sim = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) { clearInterval(sim); setFileUploaded(true); return 100; }
        return prev + 10;
      });
    }, 200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== "" && v !== null) fd.append(k, v);
      });
      fd.append("userEmail", user?.emailId.email);
      const res = await axios.post(`${COMPANY_API_END_POINT}/register`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setRecruiterIsCompanyCreated(true));
        toast.success("Company created! GreatHire will activate it soon.");
        navigate("/recruiter/dashboard/post-job");
      } else {
        toast.error(res.data.message || "Error creating company");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user?.isCompanyCreated) return null;

  return (
    <>
      <Helmet>
        <title>Make a Company Profile | Sign Up & Confirm Your Enterprise with GreatHire</title>
        <meta
          name="description"
          content="Register your company profile smoothly on GreatHire, a trusted recruitment platform Hyderabad, India."
        />
      </Helmet>

      <Navbar />

      <div className="min-h-screen pt-20 pb-8 px-4 bg-gray-100 dark:bg-gray-900 flex items-start justify-center">
        <div className={s["register-wrapper"]}>

          {/* LEFT PANEL */}
          <div className={s["left-panel"]}>
            <div className={s["icon-box"]}>
              <Building2 size={34} color="#fff" />
            </div>
            <h1>Set Up Your Company</h1>
            <p>Complete your company profile to start posting jobs and finding great candidates on GreatHire.</p>

            <div className={s.stats}>
              <h2>Step 2 of 3</h2>
              <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Company Details</p>
            </div>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Post jobs immediately",
                "Access candidate database",
                "Manage your team",
              ].map((t) => (
                <div key={t} className={s.badge}>
                  <CheckCircle size={14} color="#a5f3fc" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className={s["form-container"]}>
            <h2>Company Details</h2>
            <p className={s.subtitle}>Fill in your company information to complete registration.</p>

            <form onSubmit={handleSubmit}>

              {/* Company Information */}
              <div className={s.section}>
                <h3><Building2 size={13} style={{ display: "inline", marginRight: 6 }} />Company Information</h3>
                <div className={s["form-grid"]}>
                  <div className={s.field}>
                    <label>Company Name *</label>
                    <input name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Acme Corp" />
                  </div>
                  <div className={s.field}>
                    <label>Company Website *</label>
                    <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} required placeholder="https://example.com" />
                  </div>
                  <div className={s.field}>
                    <label>Industry *</label>
                    <input name="industry" value={formData.industry} onChange={handleChange} required placeholder="e.g. Technology" />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className={s.section}>
                <h3><MapPin size={13} style={{ display: "inline", marginRight: 6 }} />Address Details</h3>
                <div className={s["form-grid"]}>
                  <div className={s.field}>
                    <label>Street Address *</label>
                    <input name="streetAddress" value={formData.streetAddress} onChange={handleChange} required />
                  </div>
                  <div className={s.field}>
                    <label>City *</label>
                    <input name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className={s.field}>
                    <label>State *</label>
                    <input name="state" value={formData.state} onChange={handleChange} required />
                  </div>
                  <div className={s.field}>
                    <label>Postal Code *</label>
                    <input name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                  </div>
                  <div className={s.field}>
                    <label>Country *</label>
                    <input name="country" value={formData.country} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={s.section}>
                <h3><Phone size={13} style={{ display: "inline", marginRight: 6 }} />Contact Information</h3>
                <div className={s["form-grid"]}>
                  <div className={s.field}>
                    <label>Business Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className={s.field}>
                    <label>Phone Number *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Verification Details */}
              <div className={s.section}>
                <h3><ShieldCheck size={13} style={{ display: "inline", marginRight: 6 }} />Verification Details</h3>
                <div className={s.field} style={{ marginBottom: 10 }}>
                  <label>CIN / EAN <span style={{ fontWeight: 400, color: "#9ca3af" }}>(Optional)</span></label>
                  <input name="CIN" value={formData.CIN} onChange={handleChange} placeholder="Corporate Identification Number" />
                </div>
                <div className={s.field}>
                  <label>Business Registration Certificate</label>
                  <div
                    {...getRootProps()}
                    className={`${s["upload-box"]} ${isDragActive ? s["drag-active"] : ""}`}
                  >
                    <input {...getInputProps({ accept: "image/jpeg,image/png,application/pdf" })} />
                    {uploadProgress > 0 ? (
                      <div style={{ width: 48 }}>
                        <CircularProgressbar
                          value={uploadProgress}
                          text={`${uploadProgress}%`}
                          styles={buildStyles({ textColor: "#2458f5", pathColor: "#2458f5", trailColor: "#d1d5db" })}
                        />
                      </div>
                    ) : (
                      <span>{isDragActive ? "Drop here…" : "Drag & drop or click to upload"}</span>
                    )}
                  </div>
                  {formData.businessFile && (
                    <p style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>
                      ✓ {formData.businessFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Recruiter Details */}
              <div className={s.section}>
                <h3><User size={13} style={{ display: "inline", marginRight: 6 }} />Recruiter Details</h3>
                <div className={s["form-grid"]}>
                  <div className={s.field}>
                    <label>Your Position *</label>
                    <input name="recruiterPosition" value={formData.recruiterPosition} onChange={handleChange} required />
                  </div>
                  <div className={s.field}>
                    <label>Your Mobile Number</label>
                    <input name="recruiterPhone" value={formData.recruiterPhone} onChange={handleChange} readOnly />
                  </div>
                </div>
              </div>

              {/* Agreement + Submit */}
              <div className={s.actions}>
                <label className={s["checkbox-row"]}>
                  <input type="checkbox" name="isAgree" required onChange={handleCheckboxChange} />
                  I agree to provide accurate company details.
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${s.btn} ${s["btn-primary"]}`}
                  style={{ width: "100%", marginTop: 12 }}
                >
                  {loading ? "Creating…" : "Create Company"}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default CreateCompany;
