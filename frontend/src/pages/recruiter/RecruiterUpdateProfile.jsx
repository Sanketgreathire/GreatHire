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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white sm:max-w-[500px] w-full p-6 rounded-lg shadow-lg"
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
        <h2 className="text-lg text-center font-semibold">Update Profile</h2>

        {/* Profile Image on the Right */}
        <div className="relative flex flex-col items-center">
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

                {/* Hidden file input */}
                <input
                  type="file"
                  id="profilePhoto"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

        <form onSubmit={submitHandler} className="space-y-4 mt-4">
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
              {/* Name and Email Fields*/}
              <div className="col-span-2 grid gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="fullname" className="w-16">
                    Name
                  </Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={input.fullname}
                    onChange={changeEventHandler}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="email" className="w-16">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Phone and Position Fields in a Single Row */}
            <div className="grid grid-cols-1 gap-4 items-center">
              {/* Phone Field */}
              <div className="flex items-center gap-6">
                <Label htmlFor="phoneNumber" className="whitespace-nowrap">
                  Phone
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="w-full"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Position Field */}
              <div className="flex items-center gap-4">
                <Label htmlFor="position" className="whitespace-nowrap">
                  Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={input.position}
                  onChange={changeEventHandler}
                  className="w-full"
                  placeholder="Enter Your Position"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Update
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterUpdateProfile;
