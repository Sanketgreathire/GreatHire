// Import React and useState hook for component state management
import React, { useState } from "react";  

// Import Redux hooks for dispatching actions and accessing state
import { useDispatch, useSelector } from "react-redux";  

// Import Axios for making API requests
import axios from "axios";  

// Import toast notifications for displaying success/error messages
import { toast } from "react-hot-toast";  

// Import Redux action to update the user state
import { setUser } from "@/redux/authSlice";   

// Import UI components for form elements and buttons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import icons for UI enhancement
import { Loader2, Pencil } from "lucide-react";  

// Import API endpoint for user-related requests
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";  



const UserUpdateProfile = ({ open, setOpen }) => {

  // State for managing loading state, resume URL, and previous resume name
  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [prevResumeName, setPrevResumeName] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  // Initialize state with user details, ensuring default values if user data is missing
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.emailId.email || "",
    phoneNumber: user?.phoneNumber.number || "",
    bio: user?.profile?.bio || "",
    experience: user?.profile?.experience?.duration || "",
    skills: user?.profile?.skills?.join(", ") || "",
    resume: user?.profile?.resume || "",
    currentCTC: user?.profile?.currentCTC || "",
    expectedCTC: user?.profile?.expectedCTC || "",
    jobProfile: user?.profile?.experience?.jobProfile || "",
    companyName: user?.profile?.experience?.companyName || "",
    experienceDetails: user?.profile?.experience?.experienceDetails || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    country: user?.address?.country || "",
    profilePhoto: user?.profile?.profilePhoto || "",
    resumeOriginalName: user?.profile?.resumeOriginalName || "",
  });

  // State for profile image preview
  const [previewImage, setPreviewImage] = useState(
    user?.profile?.profilePhoto || ""
  );

// Character limits for bio and experience details
  const maxBioChars = 500;
  const maxExperienceChars = 750;

  // Handles input changes, ensuring character limits for specific fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "bio" || name === "experienceDetails") {
      const charLimit = name === "bio" ? maxBioChars : maxExperienceChars;

      if (value.length <= charLimit) {
        setInput((prev) => ({ ...prev, [name]: value }));
      } else {
        // Optionally, show an error message or prevent further input
        toast.error(
          `${
            name === "bio" ? "Bio" : "Experience details"
          } cannot exceed ${charLimit} characters`
        );
      }
    } else {
      // Handle other fields as normal
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  };

   // Handles file input change for resume upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Resume size should be less than 10 MB.");
        return;
      }

      setInput((prevData) => ({
        ...prevData,
        resume: file,
        resumeOriginalName: file.name,
      }));
      setResumeUrl(file.name);
      setPrevResumeName(file.name); // Store last uploaded resume name
    }
    e.target.value = ""; // Reset input value to allow re-upload of the same file
  };

   // Removes the currently uploaded resume
  const removeResume = () => {
    setInput((prev) => ({
      ...prev,
      resume: "",
      resumeOriginalName: "",
    }));
    setResumeUrl("");
    setPrevResumeName(input.resumeOriginalName);
  };

  // Handles profile photo upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setInput((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  // Handles form submission to update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("city", input.city);
    formData.append("state", input.state);
    formData.append("country", input.country);
    formData.append("experience", input.experience || "");
    formData.append("jobProfile", input.jobProfile || "");
    formData.append("companyName", input.companyName || "");
    formData.append("currentCTC", input.currentCTC || "");
    formData.append("expectedCTC", input.expectedCTC);
    formData.append("experienceDetails", input.experienceDetails);
    formData.append("bio", input.bio) || "";
    formData.append("skills", input.skills || "");

    if (input.resume instanceof File) {
      formData.append("resume", input.resume);
    }

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);

        // API call to update the user profile
      const response = await axios.put(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success("Profile updated successfully!");
        setOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // If the modal is closed, return null to prevent rendering
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white sm:max-w-[850px] w-full p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

         {/* Close Button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          ✖
        </button>

          {/* Modal Heading */}
        <h2 className="text-2xl text-center font-semibold mb-4">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Personal Details</h3>
            <div className="grid sm:grid-cols-2 gap-4 items-start">
              <div className="flex items-start gap-6">
                {/* Profile Image with Pencil Icon */}
                <div className="relative w-32 h-32 mx-auto">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-full h-full rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full border">
                      <p>No Image</p>
                    </div>
                  )}

                  {/* Pencil Icon */}
                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-lg cursor-pointer"
                  >
                    <Pencil className="w-5 h-5 text-gray-700" />
                  </label>
                </div>

                {/* Hidden file input for image upload */}
                <input
                  type="file"
                  id="profilePhoto"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange} // Handle image selection
                />
              </div>

              {/* Name, Email and Phone Fields */}
              <div className="flex-1 grid gap-3 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                  <Label
                    htmlFor="fullname"
                    className="sm:w-20 w-full font-semibold"
                  >
                    Name
                  </Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={input.fullname}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                  <Label
                    htmlFor="email"
                    className="sm:w-20 w-full font-semibold"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                  <Label
                    htmlFor="phoneNumber"
                    className="sm:w-20 w-full font-semibold"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={input.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <Label htmlFor="city" className="sm:w-20 w-full font-semibold">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={input.city}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <Label htmlFor="state" className="sm:w-20 w-full font-semibold">
                  State
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={input.state}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <Label
                  htmlFor="country"
                  className="sm:w-20 w-full font-semibold"
                >
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={input.country}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Professional Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Professional / Experience Details
            </h3>
            <div className="space-y-4">
              <div className="w-full">
                <Label
                  htmlFor="jobProfile"
                  className="block mb-2 font-semibold"
                >
                  Job Profile
                </Label>
                <Input
                  id="jobProfile"
                  name="jobProfile"
                  value={input.jobProfile}
                  onChange={handleChange}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <Label
                    htmlFor="companyName"
                    className="block mb-2 font-semibold"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={input.companyName}
                    onChange={handleChange}
                  />
                </div>

                <div className="w-full">
                  <Label
                    htmlFor="experience"
                    className="block mb-2 font-semibold"
                  >
                    Experience in Years
                  </Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={input.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="w-full">
                <Label htmlFor="skills" className="block mb-2 font-semibold">
                  Skills
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={handleChange}
                  placeholder="Enter skills (comma separated)"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="w-full">
                  <Label
                    htmlFor="currentCTC"
                    className="block mb-2 font-semibold"
                  >
                    Current CTC
                  </Label>
                  <Input
                    id="currentCTC"
                    name="currentCTC"
                    value={input.currentCTC}
                    onChange={handleChange}
                    placeholder="Enter Current CTC (In LPA)"
                  />
                </div>

                <div className="w-full">
                  <Label
                    htmlFor="expectedCTC"
                    className="block mb-2 font-semibold"
                  >
                    Expected CTC
                  </Label>
                  <Input
                    id="expectedCTC"
                    name="expectedCTC"
                    value={input.expectedCTC}
                    onChange={handleChange}
                    placeholder="Enter Expected CTC (In LPA)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <Label
              htmlFor="experienceDetails"
              className="block mb-2 font-semibold pt-2"
            >
              Experience Details
            </Label>
            <textarea
              id="experienceDetails"
              name="experienceDetails"
              value={input.experienceDetails}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe your work experience in detail..."
            />
            <p className="text-sm text-gray-600 mt-1 self-end text-right">
              {input.experienceDetails.trim()
                ? input.experienceDetails.trim().length
                : 0}
              /{maxExperienceChars}
            </p>
          </div>

          <div className="w-full">
            <Label htmlFor="bio" className="block mb-2 font-semibold pt-2">
              Bio
            </Label>
            <textarea
              id="bio"
              name="bio"
              value={input.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter your bio..."
            />
            <p className="text-sm text-gray-600 mt-1 self-end text-right">
              {input.bio.trim() ? input.bio.trim().length : 0}/{maxBioChars}
            </p>
          </div>

          <div className="w-full">
            <Label htmlFor="resume" className="block mb-2 font-semibold">
              Resume
            </Label>

            <div className="relative w-full">
              {/* File Input */}
              <Input
                id="resume"
                name="resume"
                type="text"
                value={input.resumeOriginalName}
                placeholder="Upload your resume"
                readOnly
                className="pr-10"
              />
              <input
                type="file"
                id="resumeInput"
                accept=".pdf, .doc, .docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p><strong>Note:</strong> PDF (.pdf) or Word documents (.doc, .docx) are allowed.</p>

              {/* Display remove button inside input field */}
              {resumeUrl && (
                <button
                  type="button"
                  onClick={removeResume}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                >
                  ✖
                </button>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateProfile;
