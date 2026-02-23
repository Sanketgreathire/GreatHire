import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { setUser } from "@/redux/authSlice";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const RecruiterUpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  //Initialize state with user details
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.emailId.email || "",
    phoneNumber: user?.phoneNumber.number || "",
    position: user?.position || "",
    profilePhoto: user?.profile?.profilePhoto || "",
  });

  // Profile image preview state
  const [previewImage, setPreviewImage] = useState(
    user?.profile?.profilePhoto || ""
  );

  const dispatch = useDispatch();

  // Handles input field changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handles profile image selection and preview
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

  // Handles form submission to update recruiter profile
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("position", input.position);

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${RECRUITER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setOpen(false); // Close modal after successful update
      }
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Return null if modal is not open
  if (!open) return null;

  return (
    <>
      <Helmet>
        <title>
          Update Your Profile | Manage Your Personal and Professional Information at GreatHire
        </title>

        <meta
          name="description"
          content="The Recruiter Update Profile Page on GreatHire enables professionals to safely and easily update personal and professional information as well as the images displayed on the profile page. Designed to meet the requirements of the current hiring and recruitment process, our system runs from the state of Hyderabad, India, providing trusted recruitment solutions to businesses and start-ups expanding rapidly. Thus, maintain your recruiters’ presence on the platform as a trusted and professional entity and enhance trust between your recruiters and job candidates."
        />
      </Helmet>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm transition-colors"
        onClick={() => setOpen(false)}
      >
        <div
          className="relative bg-white dark:bg-gray-900 w-full max-w-[500px] mx-4 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            ✖
          </button>

          <h2 className="text-lg text-center font-semibold text-gray-800 dark:text-gray-100">
            Update Profile
          </h2>

          {/* Profile Image */}
          <div className="relative flex flex-col items-center mt-4">
            <div className="relative w-24 h-24">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm">
                  No Image
                </div>
              )}

              <label
                htmlFor="profilePhoto"
                className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md cursor-pointer border border-gray-200 dark:border-gray-600"
              >
                <Pencil className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </label>
            </div>

            <input
              type="file"
              id="profilePhoto"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <form onSubmit={submitHandler} className="space-y-4 mt-6">
            <div className="space-y-4">

              {/* Name */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="fullname" className="text-gray-700 dark:text-gray-300">
                  Name
                </Label>
                <Input
                  id="fullname"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={input.email}
                  readOnly
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">
                  Phone
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  placeholder="Enter your phone number"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Position */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="position" className="text-gray-700 dark:text-gray-300">
                  Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  placeholder="Enter your position"
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

            </div>

            {/* Submit */}
            {loading ? (
              <Button className="w-full mt-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full mt-4">
                Update
              </Button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default RecruiterUpdateProfile;
