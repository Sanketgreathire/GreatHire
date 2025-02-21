import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { useSelector } from "react-redux";

const UpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.emailId?.email || "",
    phoneNumber: user?.phoneNumber?.number || "",
    position: user?.role || "",
    profilePhoto: user?.profile?.profilePhoto || "",
  });

  const [previewImage, setPreviewImage] = useState(
    user?.profile?.profilePhoto || ""
  );

  //const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

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
        <h2 className="text-xl text-center font-semibold">Update Profile</h2>

        {/* Profile Image on the top centre */}
        <div className="relative flex flex-col items-center">
                <div className="relative w-24 h-24 mt-8">
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

        <form className="space-y-4">
              <div className="flx flex-col">
                  <Label htmlFor="fullname" className="font-semibold">
                    Name
                  </Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={input.fullname}
                    onChange={changeEventHandler}
                  />
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="email" className="font-semibold">
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

              <div className="flex flex-col">
                <Label htmlFor="phoneNumber" className="font-semibold">
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

              <div className="flex flex-col">
                <Label htmlFor="position" className="font-semibold">
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

export default UpdateProfile;
