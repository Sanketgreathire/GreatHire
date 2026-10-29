
import React, { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { useSelector, useDispatch } from "react-redux";
import { addRecruiter } from "@/redux/recruiterSlice";
import { Helmet } from "react-helmet-async";

const USER_LIMITS = {
  FREE: 1,
  STANDARD: 1,
  PREMIUM: 3,
  PRO: 5,
  ENTERPRISE: Infinity,
};

const INITIAL_FORM_DATA = {
  fullname: "",
  email: "",
  phoneNumber: "",
  position: "",
  password: "",
};

const AddRecruiter = () => {
  const dispatch = useDispatch();

  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);

  const planType = company?.plan || "FREE";

  const userLimit =
    planType === "ENTERPRISE" && company?.teamUserLimit
      ? Number(company.teamUserLimit)
      : USER_LIMITS[planType] ?? 1;

  const atLimit =
    userLimit !== Infinity &&
    (company?.userId?.length ?? 0) >= userLimit;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    const fullname = formData.fullname.trim();
    const email = formData.email.trim();
    const phoneNumber = formData.phoneNumber.trim();
    const position = formData.position.trim();
    const password = formData.password;

    // Full name validation
    if (!fullname) {
      newErrors.fullname = "Full name is required.";
    } else if (fullname.length < 2 || fullname.length > 80) {
      newErrors.fullname =
        "Full name must contain 2 to 80 characters.";
    } else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(fullname)) {
      newErrors.fullname =
        "Full name can contain letters, spaces, apostrophes, dots and hyphens only.";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Work email is required.";
    } else if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone number validation
    const normalizedPhone = phoneNumber.replace(/[\s().-]/g, "");

    const validIndianPhone = /^(?:[6-9]\d{9}|0[6-9]\d{9})$/.test(
      normalizedPhone
    );

    const validInternationalPhone =
      /^\+[1-9]\d{7,14}$/.test(normalizedPhone) ||
      /^00[1-9]\d{6,13}$/.test(normalizedPhone);

    if (!phoneNumber) {
      newErrors.phoneNumber = "Mobile number is required.";
    } else if (
      !validIndianPhone &&
      !validInternationalPhone
    ) {
      newErrors.phoneNumber =
        "Enter a valid 10-digit Indian number or an international number with country code.";
    }

    // Position validation
    if (!position) {
      newErrors.position = "Position is required.";
    } else if (position.length < 2 || position.length > 80) {
      newErrors.position =
        "Position must contain 2 to 80 characters.";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    } else if (password.length > 64) {
      newErrors.password =
        "Password cannot exceed 64 characters.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    } else if (!/\d/.test(password)) {
      newErrors.password =
        "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9\s]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    } else if (/\s/.test(password)) {
      newErrors.password =
        "Password cannot contain spaces.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct the highlighted fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (loading) return;

      if (!company?._id) {
        toast.error(
          "Company details are still loading. Please try again."
        );
        return;
      }

      if (!validateForm()) return;

      setLoading(true);

      try {
        const response = await axios.post(
          `${RECRUITER_API_END_POINT}/add-recruiter`,
          {
            ...formData,
            fullname: formData.fullname.trim(),
            email: formData.email.trim().toLowerCase(),
            phoneNumber: formData.phoneNumber.trim(),
            position: formData.position.trim(),
            companyId: company._id,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(addRecruiter(response.data.recruiter));

          toast.success(
            response.data.message || "Recruiter added successfully."
          );

          setFormData({ ...INITIAL_FORM_DATA });
          setErrors({});
        } else {
          toast.error(
            response.data.message || "Unable to add recruiter."
          );
        }
      } catch (err) {
        console.error(
          "ADD RECRUITER STATUS:",
          err.response?.status
        );
        console.error(
          "ADD RECRUITER RESPONSE:",
          err.response?.data
        );

        const validationErrors = err.response?.data?.errors;

        if (
          Array.isArray(validationErrors) &&
          validationErrors.length > 0
        ) {
          const backendErrors = {};

          validationErrors.forEach((error) => {
            const field = error.path || error.param;

            if (field && field in INITIAL_FORM_DATA) {
              backendErrors[field] = error.msg;
            }

            toast.error(
              `${field || "Validation"}: ${error.msg}`
            );
          });

          setErrors((prev) => ({
            ...prev,
            ...backendErrors,
          }));
        } else {
          toast.error(
            err.response?.data?.message ||
              err.response?.data?.error ||
              "Something went wrong. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, company?._id, dispatch, loading]
  );

  const inputClass =
    "px-4 py-2 rounded-lg border bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400";

  const labelClass =
    "font-bold text-gray-700 dark:text-gray-300";

  const errorClass = "text-sm text-red-600 dark:text-red-400";

  return (
    <>
      <Helmet>
        <title>
          Add Recruiter | GreatHire
        </title>

        <meta
          name="description"
          content="Add and manage recruiters securely on GreatHire. Build your hiring team by adding recruiter details."
        />
      </Helmet>

      {company && user?.isActive ? (
        <div className="flex items-center justify-center pt-20 min-h-screen bg-gray-100 dark:bg-gray-950">
          {atLimit ? (
            <div className="w-full md:w-1/2 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                User Limit Reached
              </p>

              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Your <strong>{planType}</strong> plan allows a
                maximum of <strong>{userLimit}</strong> user
                {userLimit > 1 ? "s" : ""}. Upgrade your plan
                to add more recruiters.
              </p>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/packages";
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Upgrade Plan
              </button>
            </div>
          ) : (
            <form
              noValidate
              className="w-full p-4 md:w-1/2 space-y-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
              onSubmit={handleSubmit}
            >
              <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400">
                {company.companyName}
              </h1>

              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
                Give Recruiter Details
              </h2>

              <p className="text-md font-semibold text-gray-500 text-center dark:text-gray-400">
                Build your smart and powerful recruiter team
              </p>

              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="fullname" className={labelClass}>
                  Full Name
                </label>

                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  className={inputClass}
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(errors.fullname)}
                />

                {errors.fullname && (
                  <p className={errorClass}>{errors.fullname}</p>
                )}
              </div>

              {/* Work Email */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className={labelClass}>
                  Work Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="mail@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={254}
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(errors.email)}
                />

                {errors.email && (
                  <p className={errorClass}>{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="phoneNumber" className={labelClass}>
                  Mobile Number
                </label>

                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="+91 9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="tel"
                  maxLength={20}
                  required
                  aria-invalid={Boolean(errors.phoneNumber)}
                />

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Example: 9876543210 or +91 9876543210
                </p>

                {errors.phoneNumber && (
                  <p className={errorClass}>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Position */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="position" className={labelClass}>
                  Position In Company
                </label>

                <input
                  id="position"
                  type="text"
                  name="position"
                  placeholder="Hiring manager, consultant..."
                  value={formData.position}
                  onChange={handleChange}
                  className={inputClass}
                  minLength={2}
                  maxLength={80}
                  required
                  aria-invalid={Boolean(errors.position)}
                />

                {errors.position && (
                  <p className={errorClass}>{errors.position}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  minLength={8}
                  maxLength={64}
                  autoComplete="new-password"
                  required
                  aria-invalid={Boolean(errors.password)}
                />

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use uppercase and lowercase letters, a number,
                  and a special character. Do not use spaces.
                </p>

                {errors.password && (
                  <p className={errorClass}>{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  loading
                    ? "cursor-not-allowed opacity-70"
                    : ""
                }`}
              >
                {loading ? "Adding..." : "Add Recruiter"}
              </button>
            </form>
          )}
        </div>
      ) : !company ? (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400 dark:text-gray-500">
            Company not created
          </span>
        </p>
      ) : (
        <p className="h-screen flex items-center justify-center">
          <span className="text-4xl text-gray-400">
            GreatHire will verify your company soon.
          </span>
        </p>
      )}
    </>
  );
};

export default AddRecruiter;
