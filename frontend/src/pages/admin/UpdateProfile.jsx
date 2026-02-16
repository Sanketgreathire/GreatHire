// Import necessary modules and dependencies
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { useSelector } from "react-redux";

// Component for updating user profile
const UpdateProfile = ({ open, setOpen }) => {
  // State to manage loading status
  const [loading, setLoading] = useState(false);

  // Retrieve user data from Redux store
  const { user } = useSelector((store) => store.auth);

  // State to manage input fields for profile update
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.emailId?.email || "",
    phoneNumber: user?.phoneNumber?.number || "",
    position: user?.role || "",
    profilePhoto: user?.profile?.profilePhoto || "",
  });

  // State to manage preview of the profile image
  const [previewImage, setPreviewImage] = useState(
    user?.profile?.profilePhoto || ""
  );

  // Handler for updating input fields when user types
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handler for updating profile image when user selects a file
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file size exceeds 10MB limit
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10 MB.");
        return;
      }
      // Read the file and set it as a preview
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setInput((prev) => ({ ...prev, profilePhoto: file }));
    }
  };
  
  // If the component is not open, return null (don't render anything)
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
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors text-xl"
          aria-label="Close"
        >
          ✖
        </button>
        <h2 className="text-xl text-center font-semibold text-gray-900 dark:text-gray-100">
          Update Profile
        </h2>

        {/* Profile Image on the top centre */}
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
                <p className="text-gray-600 dark:text-gray-400 text-sm">No Image</p>
              </div>
            )}

            {/* Pencil Icon */}
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-1 right-1 bg-white dark:bg-gray-700 p-1 rounded-full shadow-lg cursor-pointer border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Pencil className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </label>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            id="profilePhoto"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <form className="space-y-4 mt-6">
          <div className="flex flex-col">
            <Label htmlFor="fullname" className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
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

          <div className="flex flex-col">
            <Label htmlFor="email" className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
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

          <div className="flex flex-col">
            <Label htmlFor="phoneNumber" className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
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

          <div className="flex flex-col">
            <Label htmlFor="position" className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Position
            </Label>
            <Input
              id="position"
              name="position"
              value={input.position}
              onChange={changeEventHandler}
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter Your Position"
            />
          </div>

          {/* Submit Button */}
          <div>
            {loading ? (
              <Button 
                className="w-full my-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800" 
                disabled
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
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