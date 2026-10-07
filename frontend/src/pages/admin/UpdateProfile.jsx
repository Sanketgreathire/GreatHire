// Import necessary modules and dependencies
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { setUser } from "@/redux/authSlice";

// Component for updating admin profile
const UpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);

  // Redux
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // Input state
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.emailId?.email || "",
    phoneNumber: user?.phoneNumber?.number || "",
    position: user?.role || "",
    profilePhoto: user?.profile?.profilePhoto || "",
  });

  // Image preview
  const [previewImage, setPreviewImage] = useState(
    user?.profile?.profilePhoto || ""
  );

  // Track image deletion
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      // Basic profile fields
      formData.append("fullname", input.fullname);
      formData.append("phoneNumber", input.phoneNumber);

      // Profile image
      if (isImageRemoved) {
        formData.append("removeProfilePhoto", "true");
        formData.append("profilePhoto", "");
      } else if (input.profilePhoto instanceof File) {
        formData.append("profilePhoto", input.profilePhoto);
      }

      const res = await axios.put(
        "/api/v1/admin/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // Get updated admin from backend
        const updatedAdmin = res.data.user;

        // Update Redux
        dispatch(setUser(updatedAdmin));

        // Update local preview
        setPreviewImage(updatedAdmin?.profile?.profilePhoto || "");

        // Reset image state
        setInput((prev) => ({
          ...prev,
          fullname: updatedAdmin?.fullname || "",
          email: updatedAdmin?.emailId?.email || "",
          phoneNumber: updatedAdmin?.phoneNumber?.number || "",
          position: updatedAdmin?.role || "",
          profilePhoto: updatedAdmin?.profile?.profilePhoto || "",
        }));

        setIsImageRemoved(false);

        toast.success(
          res.data.message || "Profile updated successfully"
        );

        // Close modal
        setOpen(false);
      }
    } catch (error) {
      console.error(
        "Error updating admin profile:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler for updating input fields
  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for updating profile image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Maximum file size: 100 KB
    const MAX_FILE_SIZE = 100 * 1024;

    // Allowed image types
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG, and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "Image size should not be more than 100 KB."
      );

      e.target.value = "";
      return;
    }

    // Preview image
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);

    // Image is not removed
    setIsImageRemoved(false);

    // Store File object
    setInput((prev) => ({
      ...prev,
      profilePhoto: file,
    }));
  };

  // If component is not open
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 transition-colors px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white dark:bg-gray-800 sm:max-w-[500px] w-full p-6 rounded-lg shadow-lg dark:shadow-2xl dark:shadow-gray-900/50 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors text-xl"
          aria-label="Close"
        >
          ✖
        </button>

        {/* Heading */}
        <h2 className="text-xl text-center font-semibold text-gray-900 dark:text-gray-100">
          Update Profile
        </h2>

        {/* Profile Image */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-24 h-24 mt-8">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No Image
                </p>
              </div>
            )}

            {/* Pencil Icon */}
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-1 right-1 bg-white dark:bg-gray-700 p-1 rounded-full shadow-lg cursor-pointer border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Pencil className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </label>

            {/* Delete Icon */}
            {previewImage && (
              <button
                type="button"
                onClick={() => {
                  setPreviewImage("");

                  setInput((prev) => ({
                    ...prev,
                    profilePhoto: null,
                  }));

                  setIsImageRemoved(true);
                }}
                className="absolute bottom-1 left-1 bg-white dark:bg-gray-700 p-1 rounded-full shadow-lg cursor-pointer border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                aria-label="Remove profile photo"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            id="profilePhoto"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageChange}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-6"
        >
          {/* Name */}
          <div className="flex flex-col">
            <Label
              htmlFor="fullname"
              className="font-semibold text-gray-700 dark:text-gray-300 mb-1"
            >
              Name
            </Label>

            <Input
              id="fullname"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <Label
              htmlFor="email"
              className="font-semibold text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </Label>

            <Input
              id="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              readOnly
              className="bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <Label
              htmlFor="phoneNumber"
              className="font-semibold text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone
            </Label>

            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Position / Role */}
          <div className="flex flex-col">
            <Label
              htmlFor="position"
              className="font-semibold text-gray-700 dark:text-gray-300 mb-1"
            >
              Position
            </Label>

            <Input
              id="position"
              name="position"
              value={input.position}
              readOnly
              className="w-full bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <div>
            {loading ? (
              <Button
                type="button"
                className="w-full my-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
                disabled
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full my-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                Update
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;