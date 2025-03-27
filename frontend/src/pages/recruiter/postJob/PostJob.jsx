import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Stepper from "react-stepper-horizontal";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { toast } from "react-hot-toast";
import { decreaseMaxPostJobs } from "@/redux/companySlice";
import axios from "axios";
import { allLocations } from "@/utils/constant";

const PostJob = () => {
  const [step, setStep] = useState(0);
  const { company } = useSelector((state) => state.company);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const lines = e.target.value.split("\n");
  
    // Ensure each new line starts with a single bullet point, avoiding duplicate bullets
  //    formattedText = lines.map(line => {
  //     return line.startsWith("• ") ? line : `• ${line.trim()}`;
  //   }).join("\n");
  // const
  //   formik.setFieldValue("details", formattedText);
  };
  
  useEffect(() => {
    if (company && company?.maxJobPosts === 0)
      navigate("/recruiter/dashboard/your-plans");
  }, []);

  const formik = useFormik({
    initialValues: {
      companyName: company?.companyName,
      urgentHiring: "",
      title: "",
      details: "",

      skills: [],
      benefits: [],
      qualifications: [],
      responsibilities: [],

      experience: "",
      salary: "",
      jobType: "",
      workPlaceFlexibility: "",
      location: "",

      numberOfOpening: "",
      respondTime: "",
      duration: "",
      anyAmount:"",
    },
    validationSchema: Yup.object({
      urgentHiring: Yup.string().required("This field is required"),
      title: Yup.string().required("Job title is required"),
      details: Yup.string().required("Job details are required"),
      salary: Yup.string().required("Salary is required"),
      experience: Yup.string().required("Experience is required"),
      jobType: Yup.string().required("Job type is required"),
      workPlaceFlexibility: Yup.string().required("Work Place Flexibility is required"),
      location: Yup.string().required("Location is required"),
      companyName: Yup.string().required("Company name is required"),
      numberOfOpening: Yup.string().required("Number of openings is required"),
      respondTime: Yup.string().required("Response time is required"),
      duration: Yup.string().required("Duration is required"),
      skills: Yup.string().required("Skills are required"),
      benefits: Yup.string().required("Benefits are required"),
      qualifications: Yup.string().required("Qualification is required"),
      // responsibilities: Yup.string().required("Responsibility is required"),
      anyAmount: Yup.string().required("Yes or no is required"),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${JOB_API_END_POINT}/post-job`,
          {
            ...values,
            companyId: company?._id,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          if (company?.maxJobPosts !== null) dispatch(decreaseMaxPostJobs(1));
          toast.success("Job post successfully");
          // Redirect to the dashboard after 2 seconds
          setTimeout(() => {
            navigate("/recruiter/dashboard/home");
          }, 1000);
        } else {
          toast.error("Job post failed");
        }
      } catch (error) {
        console.error("Error posting job:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleNext = async () => {
    const currentStepFields = [
      ["companyName", "urgentHiring", "title", "details"], // Step 0
      ["skills", "benefits", "qualifications", "responsibilities"], // Step 1
      ["experience", "salary", "jobType","workPlaceFlexibility","location"], // Step 2
      ["numberOfOpening", "respondTime","duration","anyAmount"], // Step 3
    ][step];
    // Mark the current step fields as touched to trigger validation messages
    const touchedFields = {};
    currentStepFields.forEach((field) => {
      touchedFields[field] = true;
    });
    formik.setTouched(touchedFields);
    // Trigger validation and ensure required fields show error messages
    await formik.validateForm();
    // Check if there are any errors or blank fields in the current step's fields
    const hasErrors = currentStepFields.some(
      (field) => !!formik.errors[field] || !formik.values[field]
    );

    if (hasErrors) {
      console.log(
        "Validation failed. Please fill all required fields before proceeding."
      );
      return; // Block navigation if there are errors or blank fields
    }
    // Move to the next step if all fields are valid
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => setStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    { title: "Basic Info" },
    { title: "Job Details" },
    { title: "Requirements" },
    { title: "Additional Info" },
    { title: "Review & Submit" },
  ];

  return (
    <>
      {company && user?.isActive ? (
        <div className="px-2 py-4">
          <div className="w-full max-w-3xl mx-auto px-4 md:p-6 bg-white  shadow-lg rounded-lg">
            <h1>
              {/* Display only the title of the current step */}
              <h2 className="md:hidden font-bold text-2xl text-blue-700 py-7">
                {steps[step].title}
              </h2>
            </h1>
            <div className="mb-10 w-full hidden md:block">
              <Stepper
                steps={steps}
                activeStep={step}
                activeColor="blue"
                completeColor="green"
              />
            </div>

            <form onSubmit={formik.handleSubmit}>
              {step === 0 && (
                <div>
                  <div className="mb-6">
                    <Label className="block text-gray-700 mb-1">
                      Company Name<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <input
                      name="companyName"
                      type="text"
                      placeholder="Enter company name"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formik.values.companyName}
                      readOnly
                    />
                    {formik.touched.companyName &&
                      formik.errors.companyName && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.companyName}
                        </div>
                      )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-gray-700 mb-1">
                      Urgent Hiring<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <select
                      name="urgentHiring"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.urgentHiring}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {formik.touched.urgentHiring &&
                      formik.errors.urgentHiring && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.urgentHiring}
                        </div>
                      )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-gray-700  mb-1">
                      Job Title<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Enter job title"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.title}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.title}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-gray-700 mb-1">
                      Job Details<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <textarea
                      name="details"
                      placeholder="Enter job details"
                      className="w-full p-3 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.details}
                    />
                    {formik.touched.details && formik.errors.details && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.details}
                      </div>
                    )}
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={step === 0} // Disable button if step is 0
                      className={`p-2 rounded ${
                        step === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-700 text-white p-2 rounded"
                    >
                      Next
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 text-center mt-4">
                    Have feedback?{" "}
                    <Link
                      to="/contact"
                      className="text-blue-700 cursor-pointer"
                    >
                      Tell us more
                    </Link>
                  </p>
                </div>
              )}

              {step === 1 && (
                <div>
                  {/* Skills */}
                  <div className="mb-6">
                    <Label
                      htmlFor="skills"
                      className="block text-gray-700 mb-1"
                    >
                      Skills<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <textarea
                      id = "skills"
                      name="skills"
                      placeholder="Enter skills separated by commas (e.g., HTML, CSS, JavaScript)"
                      className="w-full p-3 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.skills}
                    />
                    {formik.touched.skills && formik.errors.skills && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.skills}
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                  <Label htmlFor="benefits" className="block text-gray-700 mb-1">
                  Benefits<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    "Health Insurance",
                    "Provident Fund",
                    "Cell Phone Reimbursement",
                    "Paid Sick Time",
                    "Work From Home",
                    "Paid time Off",
                    "Food Provided",
                    "Life Insurance",
                    "Internet Reimbursement",
                    "Commuter Assistance",
                    "Leave Encashment",
                    "Flexible Schedule",
                    "Others",
                  ].map((benefit) => {
                // Ensure benefits is always a string before splitting
                const selectedBenefits = String(formik.values.benefits || "").split("\n");

               return (
                 <label key={benefit} className="flex items-center space-x-2">
               <input
                  type="checkbox"
                  name="benefitsCheckbox"
                  value={benefit}
                  className="w-4 h-4"
                  checked={selectedBenefits.includes(benefit)}
                  onChange={(e) => {
                  let updatedBenefits = [...selectedBenefits].filter(Boolean); // Remove empty values

                  if (e.target.checked) {
                  updatedBenefits.push(benefit);
              } else {
                updatedBenefits = updatedBenefits.filter((b) => b !== benefit);
              }

                formik.setFieldValue("benefits", updatedBenefits.join("\n")); // Store as a string
              }}
             />
              <span className="text-gray-600">{benefit}</span>
               </label>
              );
             })}
           </div>

            <textarea
              id="benefits"
              name="benefits"
              placeholder="Enter additional benefits..."
              className="w-full p-2 border border-gray-300 rounded h-24"
              onChange={formik.handleChange}
              value={String(formik.values.benefits || "")} // Ensure it's always a string
            />
              {formik.touched.benefits && formik.errors.benefits && (
           <div className="text-red-500 text-sm">{formik.errors.benefits}</div>
             )}
          </div>
                  {/* Qualifications */}
                  <div className="mb-6">
                    <Label
                      htmlFor="qualifications"
                      className="block text-gray-700 mb-1"
                    >
                      Qualifications<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <textarea
                      id="qualifications"
                      name="qualifications"
                      placeholder="Enter qualifications separated by new lines (eg. Bechelor, Master or diploma)"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.qualifications}
                    />
                    {formik.touched.qualifications &&
                      formik.errors.qualifications && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.qualifications}
                        </div>
                      )}
                  </div>

                  {/* Responsibilities
                  <div className="mb-6">
                    <Label
                      htmlFor="responsibilities"
                      className="block text-gray-700 mb-1"
                    >
                      Responsibilities
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <textarea
                      id="responsibilities"
                      name="responsibilities"
                      placeholder="Enter responsibilities separated by new lines (eg. candidate role, or tasks perfom in job)"
                      className="w-full p-12 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.responsibilities}
                    />
                    {formik.touched.responsibilities &&
                      formik.errors.responsibilities && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.responsibilities}
                        </div>
                      )}
                  </div> */}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-500 text-white p-2 rounded"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-700 text-white p-2 rounded"
                    >
                      Next
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    Have feedback?{" "}
                    <Link
                      to="/contact"
                      className="text-blue-700 cursor-pointer"
                    >
                      Tell us more
                    </Link>
                  </p>
                </div>
              )}

              {step === 2 && (
                <div>
                  {/* Experience */}
                  <div className="mb-6">
                  <Label htmlFor="experience" className="block text-gray-700 mb-1">
                  Experience<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                   {[
                    "Fresher",
                    "6 months-1 year",
                    "1-2 years",
                    "2-3 years",
                    "3-4 years",
                    "More than 5 years",
                   ].map((option) => {
                  // Convert the current string value into an array for easier handling
                    const selectedOptions = formik.values.experience
                    ? formik.values.experience.split(", ")
                    : [];
                  return (
                    <label key={option} className="flex items-center space-x-2">
                    {/* Changed input type from radio to checkbox */}
                    <input
                      type="checkbox"
                      name="experience"
                      value={option}
                     // Updated to check if the option exists in the array derived from the string
                      checked={selectedOptions.includes(option)}
                      onChange={(e) => {
                    // Create a mutable copy of the current selections from the string value
                    let updatedOptions = [...selectedOptions];
                     if (e.target.checked) {
                    // Add the option if checked
                      updatedOptions.push(option);
                     } else {
                    // Remove the option if unchecked
                      updatedOptions = updatedOptions.filter((opt) => opt !== option);
                     }
                    // Join the array back into a string (comma separated) to meet the expected type
                      formik.setFieldValue("experience", updatedOptions.join(", "));
                     }}
                      className="peer hidden"
                    />
                  <div className="w-4 h-4 border border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                    {selectedOptions.includes(option) && (
                      <svg
                       className="w-4 h-4 text-white"
                       viewBox="0 0 24 24"
                       fill="none"
                       stroke="currentColor"
                       strokeWidth="4"
                       strokeLinecap="butt"
                       strokeLinejoin="miter"
                      >
                       <polyline points="4 12 10 18 20 5" />
                      </svg>
                    )}
                  </div>
                    <span className="text-gray-700">{option}</span>
                 </label>
                   );
                  })}
               </div>
                  {formik.touched.experience && formik.errors.experience && (
               <div className="text-red-500 text-sm">{formik.errors.experience}</div>
                 )}
             </div>

                  {/* Salary */}
                  <div className="mb-6">
                    <Label
                      htmlFor="salary"
                      className="block text-gray-700 mb-1"
                    >
                      Salary<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                    <input
                      id="salary"
                      name="salary"
                      type="text"
                      placeholder="Enter salary (e.g., 45000-50000)"
                      className="w-full p-2 border border-gray-300 rounded h-10"
                      onChange={formik.handleChange}
                      value={formik.values.salary}
                    />
                    <select
                      id="salaryType"
                      name="salaryType"
                      className="p-2 border border-gray-300 rounded bg-white h-10 w-32 text-gray-700"
                      onChange={formik.handleChange}
                      value={formik.values.salaryType || ""}
                    >
                      <option value="" disabled>Rate</option>
                      <option value="per year">per year</option>
                      <option value="per month">per month</option>
                      <option value="per week">per week</option>
                      <option value="per day">per day</option>
                      <option value="per hour">per hour</option>
                    </select>
                    </div>
                    {formik.touched.salary && formik.errors.salary && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.salary}
                      </div>
                    )}
                  </div>

                  {/* Job Type */}
                  <div className="mb-6">
                    <Label
                      htmlFor="jobType"
                      className="block text-gray-700 mb-1"
                    >
                      Job Type<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <select
                      id="jobType"
                      name="jobType"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.jobType}
                      >
                        <option value="">Select a job type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract/Temporary">Contract/Temporary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Fresher">Fresher</option>
                    </select>
                    {formik.touched.jobType && formik.errors.jobType && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.jobType}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <Label className="block text-gray-700 mb-1">
                      Work Place Flexibility <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <select
                      name="workPlaceFlexibility"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.workPlaceFlexibility}
                    >
                      <option value="">Select</option>
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {formik.touched.workPlaceFlexibility &&
                      formik.errors.workPlaceFlexibility && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.workPlaceFlexibility}
                        </div>
                      )}
                  </div>

                  {/* Location */}
                  <div className="mb-6 relative">
                  <Label htmlFor="location" className="block text-gray-700 mb-1">
                  Location<span className="text-red-500 ml-1">*</span>
                  </Label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                    placeholder="Enter location manually or select from dropdown"
                    value={formik.values.location}
                    onChange={(e) => {
                      formik.handleChange(e);
                      e.target.nextSibling.classList.remove("hidden");
                    }}
                      onFocus={(e) => e.target.nextSibling.classList.remove("hidden")}
                      onBlur={(e) => setTimeout(() => e.target.nextSibling.classList.add("hidden"), 200)}
                    />
                    <div className="absolute w-full bg-white border border-gray-300 rounded mt-1 shadow-md max-h-40 overflow-y-auto hidden">
                    {[
                      ...Object.values(allLocations)
                      .flat()
                      .filter((location) =>
                       location.toLowerCase().includes(formik.values.location.toLowerCase())
                     ),
                      ...Object.values(allLocations)
                      .flat()
                      .filter(
                     (location) =>
                      !location.toLowerCase().includes(formik.values.location.toLowerCase())
                     ),
                 ].map((location) => (
              <div
                 key={location}
                 className="p-2 hover:bg-gray-200 cursor-pointer"
                 onMouseDown={(e) => {
                 formik.setFieldValue("location", location);
                e.target.parentNode.classList.add("hidden");
               }}
                >
               {location}
             </div>
              ))}
           </div>
               {formik.touched.location && formik.errors.location && (
            <div className="text-red-500 text-sm">{formik.errors.location}</div>
               )}
          </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-500 text-white p-2 rounded"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-700 text-white p-2 rounded"
                    >
                      Next
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    Have feedback?{" "}
                    <Link
                      to="/contact"
                      className="text-blue-700 cursor-pointer"
                    >
                      Tell us more
                    </Link>
                  </p>
                </div>
              )}

              {step === 3 && (
                <div>
                  {/* Number of Openings */}
                  <div className="mb-6">
                    <Label className="block text-gray-700 mb-1">
                      Number of Openings
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <input
                      name="numberOfOpening"
                      type="number"
                      placeholder="Enter number of openings (e.g. 1, 2)"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.numberOfOpening}
                    />
                    {formik.touched.numberOfOpening &&
                      formik.errors.numberOfOpening && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.numberOfOpening}
                        </div>
                      )}
                  </div>

                  {/* Response Time */}
                  <div className="mb-6">
                    <Label className="block text-gray-700  mb-1">
                      Response Time<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <input
                      name="respondTime"
                      type="number"
                      placeholder="Enter response time (e.g. 1 day, 2 days)"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.respondTime}
                    />
                    {formik.touched.respondTime &&
                      formik.errors.respondTime && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.respondTime}
                        </div>
                      )}
                  </div>

                  {/* Duration */}
                  <div className="mb-6">
                    <Label className="block text-gray-700 mb-1">
                      Duration<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <input
                      name="duration"
                      type="text"
                      placeholder="Enter duration (e.g. Monday to Friday)"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.duration}
                    />
                    {formik.touched.duration && formik.errors.duration && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.duration}
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label className="block text-gray-700 mb-1">
                    Applicants need to  pay any charges?<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <select
                      name="anyAmount"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={formik.handleChange}
                      value={formik.values.anyAmount}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {formik.touched.activeColor &&
                      formik.errors.anyAmount && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.anyAmount}
                        </div>
                      )}

                      {/* Note about GreatHire policy */}
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Note:</strong> GreatHire does not support taking any amount from applicants.
                      </p>
                  </div>


                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-500 text-white p-2 rounded"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-700 text-white p-2 rounded"
                    >
                      Next
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    Have feedback?{" "}
                    <Link
                      to="/contact"
                      className="text-blue-700 cursor-pointer"
                    >
                      Tell us more
                    </Link>
                  </p>
                </div>
              )}

              {step === 4 && (
                <>
                  {/* <h2 className="text-xl font-bold mb-4">Review & Submit</h2> */}
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="mb-2">
                      <strong>Company Name:</strong>{" "}
                      {formik.values.companyName || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Urgent Hiring:</strong>{" "}
                      {formik.values.urgentHiring || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Job Title:</strong> {formik.values.title || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Job Details:</strong>{" "}
                      <div className="whitespace-pre-wrap">{formik.values.details || "N/A"}</div>
                    </div>
                    <div className="mb-2">
                      <strong>Skills:</strong>{" "}
                      {formik.values.skills.length > 0
                        ? formik.values.skills
                            .split(",")
                            .map((skill, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-2"
                              >
                                {skill.trim()}
                              </span>
                            ))
                        : "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Experience:</strong>{" "}
                      {formik.values.experience || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Benefits:</strong>{" "}
                      {formik.values.benefits
                        ? formik.values.benefits.split("\n").join(", "): "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Qualification:</strong>{" "}
                      {formik.values.qualifications || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Salary:</strong>{" "} 
                      {formik.values.salary ? `₹${formik.values.salary} ${formik.values.salaryType || ""}`.trim(): "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Job Type:</strong>{" "}
                      {formik.values.jobType || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Work Place Flexibility:</strong>{" "}
                      {formik.values.workPlaceFlexibility || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Location:</strong>{" "}
                      {formik.values.location || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Number of Openings:</strong>{" "}
                      {formik.values.numberOfOpening || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Response Time:</strong>{" "}
                      {formik.values.respondTime + " days" || "N/A"}
                    </div>
                    
                    <div className="mb-2">
                      <strong>Duration:</strong>{" "}
                      {formik.values.duration || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Applicants need to  pay any charges?:</strong>{" "}
                      {formik.values.anyAmount || "N/A"}
                    </div>

                    <p className="text-sm text-gray-500 mb-6">
                      If you notice an error in your job post, please <br />
                      <Link to="/contact" className="underline cursor-pointer">
                        contact Great Hire
                      </Link>
                    </p>

                    <small className="text-xs text-gray-500 block mb-6">
                      By pressing apply: 1) you agree to our{" "}
                      <Link
                        to="/policy/privacy-policy"
                        className="underline cursor-pointer"
                      >
                        Terms, Cookie & Privacy Policies
                      </Link>
                      ; 2) you consent to your jobs being transmitted to the
                      Students (Great Hire does not guarantee receipt), &
                      processed & analyzed in accordance with its & Great Hire's
                      terms & privacy policies; & 3) you acknowledge that when
                      you post to jobs outside your country it may involve you
                      sending your personal data to countries with lower levels
                      of data protection.
                    </small>

                    <p className="text-center text-sm text-gray-500">
                      Having an issue with this job?{" "}
                      <Link
                        to="/contact"
                        className="underline text-blue-700 cursor-pointer"
                      >
                        Tell us more
                      </Link>
                    </p>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-gray-500 text-white p-2 rounded"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className={`bg-blue-700 text-white p-2 rounded ${
                        loading && "cursor-not-allowed"
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Posting..." : "Post"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
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
    </>
  );
};

export default PostJob;
