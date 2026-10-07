import React, { useState, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { setUser } from "@/redux/authSlice";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import CompanyPhoneInput from "@/components/CompanyPhoneInput";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const RecruiterUpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // Track if image was explicitly removed by the user
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  // Initialize state with user details
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    dialCode: "+91",
    countryIso: "IN",
    position: "",
    profilePhoto: null,
  });

  const [phoneError, setPhoneError] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const dispatch = useDispatch();

  // Reset/sync local state whenever user prop updates or modal opens
  useEffect(() => {
    if (open && user) {
      setInput({
        fullname: user?.fullname || "",
        email: user?.emailId?.email || "",
        phoneNumber: user?.phoneNumber?.number || "",
        dialCode: "+91",
        countryIso: "IN",
        position: user?.position || "",
        profilePhoto: null,
      });
      setPreviewImage(user?.profile?.profilePhoto || "");
      setIsImageRemoved(false);
      setPhoneError("");
    }
  }, [open, user]);

  const changeEventHandler = useCallback((e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 100 * 1024;
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("Only JPG, JPEG, PNG, and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG, and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size should not be more than 100 KB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    setInput((prev) => ({
      ...prev,
      profilePhoto: file,
    }));
    setIsImageRemoved(false);
  };

  // Image remove handler function
  const handleRemoveImage = () => {
    setPreviewImage("");
    setInput((prev) => ({
      ...prev,
      profilePhoto: null,
    }));
    setIsImageRemoved(true);
  };

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      let phoneValid = true;
      if (!input.phoneNumber) {
        setPhoneError("Phone number is required");
        phoneValid = false;
      } else {
        try {
          const phone = input.phoneNumber.replace(/[\s-]/g, "");
          const parsed = parsePhoneNumberFromString(phone);
          if (!parsed || !parsed.isValid()) {
            setPhoneError("Enter a valid phone number");
            phoneValid = false;
          } else {
            setPhoneError("");
          }
        } catch {
          setPhoneError("Enter a valid phone number");
          phoneValid = false;
        }
      }
      if (!phoneValid) return;

      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("position", input.position);

      // Explicit removal logic for backend sync
      if (isImageRemoved) {
        formData.append("removeProfilePhoto", "true");
        formData.append("profilePhoto", "");
      } else if (input.profilePhoto) {
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
          // If profilePhoto was removed, ensure Redux state updates properly
          const updatedUser = res.data.user;
          if (isImageRemoved && updatedUser?.profile) {
            updatedUser.profile.profilePhoto = "";
          }

          dispatch(setUser(updatedUser));
          setOpen(false);
          toast.success(res.data.message || "Profile updated successfully!");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    [input, isImageRemoved, dispatch, setOpen]
  );

  if (!open) return null;

  return (
    <>
      <Helmet>
        <title>
          Update Your Profile | Manage Your Personal and Professional Information at GreatHire
        </title>
        <meta
          name="description"
          content="The Recruiter Update Profile Page on GreatHire enables professionals to safely and easily update personal and professional information."
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

          {/* Profile Image View */}
          <div className="relative flex flex-col items-center mt-4">
            <div className="relative w-28 h-28">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium">
                  No Image
                </div>
              )}

              {/* Delete Icon (Bottom Left) */}
              {previewImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  title="Remove Photo"
                  className="absolute bottom-1 left-1 bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-lg cursor-pointer text-white border-2 border-white dark:border-gray-900 transition-transform active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Edit Icon (Bottom Right) */}
              <label
                htmlFor="profilePhoto"
                title="Upload Photo"
                className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg cursor-pointer border-2 border-white dark:border-gray-900 text-gray-800 dark:text-gray-100 transition-transform active:scale-95"
              >
                <Pencil className="w-4 h-4" />
              </label>
            </div>

            <input
              type="file"
              id="profilePhoto"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp"
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
                <div className="gh-phone-profile">
                  <CompanyPhoneInput
                    value={input.phoneNumber}
                    onChange={(e164, dialCode, countryIso) => {
                      setInput((prev) => ({
                        ...prev,
                        phoneNumber: e164,
                        dialCode,
                        countryIso,
                      }));
                      setPhoneError("");
                    }}
                  />
                </div>
                {phoneError && (
                  <p className="mt-1 text-sm text-red-500">{phoneError}</p>
                )}
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