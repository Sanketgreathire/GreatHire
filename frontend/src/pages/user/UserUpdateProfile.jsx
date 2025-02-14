import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setUser } from "@/redux/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import { number } from "yup";

const UserUpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.emailId.email || "",
    phoneNumber: user?.phoneNumber.number || "",
    bio: user?.profile?.bio || "",
    experience: user?.profile?.experience?.duration || "",
    skills: user?.profile?.skills?.join(", ") || "",
    resume: user?.profile?.resume || "",
    profilePhoto: user?.profile?.profilePhoto || "",
    currentCTC: user?.profile?.currentCTC || "",
    expectedCTC: user?.profile?.expectedCTC || "",
    jobProfile: user?.profile?.experience?.jobProfile || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    country: user?.address?.country || "",
  });

  const [previewImage, setPreviewImage] = useState(
    user?.profile?.profilePhoto || ""
  );

  const maxBioChars = 500;
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "bio") {
      // Count the number of characters in the bio field
      const charCount = value.length;

      if (charCount <= maxBioChars) {
        setInput((prev) => ({ ...prev, [name]: value }));
      } else {
        // Optionally, show an error message or prevent further input
        toast.error("Bio cannot exceed 500 characters");
      }
    } else {
      // Handle other fields as normal
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Resume size should be less than 10 MB.");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setInput((prevData) => ({
        ...prevData,
        resume: file,
      }));
      setResumeUrl(file.name);
    }
  };

  const removeResume = () => {
    setInput({ resume: null });
    setResumeUrl("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Image size should be less than 10 MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);

      setInput((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("number", input.number);
    formData.append("city", input.city);
    formData.append("state", input.state);
    formData.append("country", input.country);
    formData.append("experience", input.experience || "");
    formData.append("jobProfile", input.jobProfile || "");
    formData.append("currentCTC", input.currentCTC || "");
    formData.append("expectedCTC", input.expectedCTC);
    formData.append("bio", input.bio) || "";
    formData.append("skills", input.skills || "");
    if (input.resume instanceof File) {
      formData.append("resume", input.resume);
    }

    console.log(formData);
    console.log(input);

    try {
      setLoading(true);
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white sm:max-w-[850px] w-full p-6 rounded-lg shadow-lg h-screen sm:h-auto overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          ✖
        </button>

        <h2 className="text-xl text-center font-semibold mb-4">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image and Name-Email Grid */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 items-center">
            {/* Profile Image */}
            <div className="relative flex flex-col items-center">
              {/* Profile Image with Pencil Icon */}
              <div className="relative w-24 h-24">
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

            {/* Name and Email Fields */}
            <div className="w-full sm:col-span-2 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <Label htmlFor="fullname" className="sm:w-20 w-full font-semibold">
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
                <Label htmlFor="email" className="sm:w-20 w-full font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Remaining Fields in Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Label htmlFor="phoneNumber" className="sm:w-20 w-full font-semibold">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Label htmlFor="jobProfile" className="sm:w-20 w-full font-semibold">
                Job Profile
              </Label>
              <Input
                id="jobProfile"
                name="jobProfile"
                value={input.jobProfile}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Label htmlFor="experience" className="sm:w-20 w-full font-semibold">
                Experience
              </Label>
              <Input
                id="experience"
                name="experience"
                value={input.experience}
                onChange={handleChange}
              />
            </div>

            {/* Skills */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Label htmlFor="skills" className="sm:w-20 w-full font-semibold">
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Label htmlFor="currentCTC" className="sm:w-20 w-full font-semibold">
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Label htmlFor="expectedCTC" className="sm:w-20 w-full font-semibold">
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

          {/* Bio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
            <Label htmlFor="bio" className="sm:w-20 w-full font-semibold pt-2">
              Profile Summary
            </Label>
            <textarea
              id="bio"
              name="bio"
              value={input.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Enter your bio..."
            />
            <p className="text-sm text-gray-600 mt-1 self-end text-right">
              {input.bio.trim() ? input.bio.trim().length : 0}/{maxBioChars}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
              <Label htmlFor="country" className="sm:w-20 w-full font-semibold">
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
            <Label htmlFor="resume" className="sm:w-20 w-full font-semibold">
              Resume
            </Label>

            <div className="relative w-full">
              {/* File Input */}
              <Input
                id="resume"
                name="resume"
                type="text"
                value={resumeUrl}
                placeholder="Upload your resume"
                readOnly
                className="pr-10"
              />
              <input
                type="file"
                id="resume-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

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
