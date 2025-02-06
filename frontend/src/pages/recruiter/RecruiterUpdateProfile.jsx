import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RECRUITER_API_END_POINT } from "@/utils/ApiEndPoint";
import { setUser } from "@/redux/authSlice";
import { toast } from "react-hot-toast";

const RecruiterUpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.emailId.email || "",
    phoneNumber: user?.phoneNumber.number || "",
    position: user?.position || "",
    profilePhoto: user?.profile?.profilePhoto || "",
  });

  const [previewImage, setPreviewImage] = useState(
    user?.profile?.profilePhoto || ""
  );

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10 MB limit
        toast.error("Image size should be less than 10 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setInput((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

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
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(res.data.user);
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setOpen(false);
      }
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
    setOpen(false);
  };

  if (!open) return null; // Return null if the modal is not open

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpen(false)} // Close modal on background click
    >
      <div
        className="bg-white sm:max-w-[500px] w-full p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Update Profile</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            ✖
          </button>
        </div>
        <form onSubmit={submitHandler} className="space-y-4 mt-4">
          <div className="grid gap-2 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profilePhoto" className="text-right">
                Profile Image
              </Label>
              <div className="col-span-3 space-y-2">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                ) : (
                  <p>No image uploaded</p>
                )}
                <Input
                  id="profilePhoto"
                  name="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-right">
                Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                value={input.fullname}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your email"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Enter Your Position"
              />
            </div>
          </div>
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
