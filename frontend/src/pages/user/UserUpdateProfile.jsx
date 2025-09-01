// Import React and useState hook for component state management
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SelectedCategoryPreview from "@/components/ui/SelectedCategoryPreview";
import SelectedLanguagePreview from "@/components/ui/SelectedLanguagePreview";
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
import JobCategory from "@/components/ui/JobCategory";
import LanguageSelector from "@/components/ui/LanguageSelector";
// Import country, state, city
import { Country, State, City } from "country-state-city";

// Import icons for UI enhancement
import { Loader2, Pencil } from "lucide-react";

// Import API endpoint for user-related requests
import { USER_API_END_POINT } from "@/utils/ApiEndPoint";
import Job from "../job/Job";

// Add & Delete Experience
import { Trash2, Plus } from "lucide-react"; // Dustbin & Add icons


const UserUpdateProfile = ({ open, setOpen }) => {
  // State for managing loading state, resume URL, and previous resume name

  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [prevResumeName, setPrevResumeName] = useState("");
  const [isCategoryVisible, setCategoryVisible] = useState(false);
  const [isLanguageVisible, setLanguageVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [hasExperience, setHasExperience] = useState(
    Array.isArray(user?.profile?.experiences) && user.profile.experiences.length > 0
  );
  const [gender, setGender] = useState(""); // State to hold selected value

  // ✅ New state for ID/Document selection
  const [selectedDocs, setSelectedDocs] = useState(
    Array.isArray(user?.profile?.documents) ? user.profile.documents : []
  );

  const toggleDocSelection = (doc) => {
    if (doc === "None of these") {
      setSelectedDocs(["None of these"]);
    } else {
      setSelectedDocs((prev) =>
        prev.includes(doc)
          ? prev.filter((d) => d !== doc)
          : [...prev.filter((d) => d !== "None of these"), doc]
      );
    }
  };

  // seed categories from user so the UI starts with existing values
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(user?.profile?.category) ? user.profile.category : []
  );
  const [selectedLanguages, setSelectedLanguages] = useState(
    Array.isArray(user?.profile?.language) ? user.profile.language : []
  );

  //country,state,city
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // ✅ keep local categories in sync when Redux user updates
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    setSelectedCategories(
      Array.isArray(user?.profile?.category) ? user.profile.category : []
    );
    setSelectedLanguages(
      Array.isArray(user?.profile?.language) ? user.profile.language : []
    );
    setSelectedDocs(
      Array.isArray(user?.profile?.documents) ? user.profile.documents : []
    );

    // --- Restore saved Country, State, City ---
    if (user?.address?.country) {
      const countryObj = allCountries.find(
        (c) => c.name === user.address.country
      );

      if (countryObj) {
        const statesData = State.getStatesOfCountry(countryObj.isoCode);
        setStates(statesData);

        if (user?.address?.state) {
          const stateObj = statesData.find((s) => s.name === user.address.state);

          if (stateObj) {
            const citiesData = City.getCitiesOfState(
              countryObj.isoCode,
              stateObj.isoCode
            );
            setCities(citiesData);
          }
        }
      }
    }
  }, [user?.address?.country, user?.address?.state,
  user?.address?.city, user?.profile?.documents,
  user?.profile?.category, user?.profile?.language]);

  const toggleCategoryVisibility = (event) => {
    event.preventDefault();
    setCategoryVisible(!isCategoryVisible);
  };
  const toggleLanguageVisibility = (event) => {
    event.preventDefault();
    setLanguageVisible(!isLanguageVisible);
  };

  // Country, State, City handlers
  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const countryObj = Country.getAllCountries().find(c => c.name === countryName);

    setInput((prev) => ({ ...prev, country: countryName, state: "", city: "" }));

    if (countryObj) {
      setStates(State.getStatesOfCountry(countryObj.isoCode));
    } else {
      setStates([]);
    }
    setCities([]);
  };


  const handleStateChange = (e) => {
    const stateName = e.target.value;
    const stateObj = states.find(s => s.name === stateName);

    setInput((prev) => ({ ...prev, state: stateName, city: "" }));

    if (stateObj) {
      const countryObj = countries.find(c => c.name === input.country);
      if (countryObj) {
        setCities(City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode));
      }
    } else {
      setCities([]);
    }
  };


  const handleCityChange = (e) => {
    setInput((prev) => ({ ...prev, city: e.target.value }));
  };


  // Initialize state with user details, ensuring default values if user data is missing
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.emailId.email || "",
    phoneNumber: user?.phoneNumber.number || "",
    alternatePhone: user?.alternatePhone?.number || "",

    bio: user?.profile?.bio || "",
    category: user?.profile?.category || [],
    language: user?.profile?.language || [],
    // experience: user?.profile?.experience?.duration || "",
    skills: user?.profile?.skills?.join(", ") || "",
    resume: user?.profile?.resume || "",

    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    country: user?.address?.country || "",
    profilePhoto: user?.profile?.profilePhoto || "",
    resumeOriginalName: user?.profile?.resumeOriginalName || "",
    gender: user?.profile?.gender || "",
    qualification: user?.profile?.qualification || "",
    otherQualification: user?.profile?.otherQualification || "",
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

    setGender(e.target.value);

    if (name === "bio" || name === "experienceDetails") {
      const charLimit = name === "bio" ? maxBioChars : maxExperienceChars;

      if (value.length <= charLimit) {
        setInput((prev) => ({ ...prev, [name]: value }));
      } else {
        // Optionally, show an error message or prevent further input
        toast.error(
          `${name === "bio" ? "Bio" : "Experience details"
          } cannot exceed ${charLimit} characters`
        );
      }
    } else {
      // Handle other fields as normal
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Initialize experiences correctly
  const [experiences, setExperiences] = useState(
    Array.isArray(user?.profile?.experiences) ? user.profile.experiences : []
  );

  // Handle experience field change
  const handleExperienceChange = (index, field, value) => {
    const updated = experiences.map((exp, i) =>
      i === index
        ? {
          ...exp,
          [field]: value,
          ...(field === "currentlyWorking" && !value
            ? { currentCTC: "", noticePeriod: "" }
            : {}),
        }
        : exp
    );
    setExperiences(updated);
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        companyName: "",
        jobProfile: "",
        duration: "",
        currentlyWorking: false,
        currentCTC: "",
        noticePeriod: "",
        experienceDetails: "",
      },
    ]);
  };

  // Delete an experience block
  const handleDeleteExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
    if (updated.length === 0) {
      setHasExperience(false); // auto-switch to Fresher
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
    // Check if resume is uploaded
    if (!input.resume && !user?.profile?.resume) {
      toast.error("Resume is required! Please upload your resume before updating.");
      return;
    }
    if (selectedDocs.length === 0) {
      alert("⚠️ Please select at least one ID/Document.");
      return;
    }
    // Normalize experiences
    const normalizedExperiences = hasExperience
      ? experiences.map((exp) => ({
        companyName: exp.companyName?.trim() || "",
        jobProfile: exp.jobProfile?.trim() || "",
        duration: exp.duration?.trim() || "",
        currentlyWorking: !!exp.currentlyWorking,
        currentCTC: exp.currentlyWorking ? (exp.currentCTC?.trim() || "") : "",
        noticePeriod: exp.currentlyWorking ? (exp.noticePeriod?.trim() || "") : "",
        experienceDetails: exp.experienceDetails?.trim() || "",
      }))
      : [];

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("alternatePhone", input.alternatePhone);
    formData.append("gender", input.gender || "");
    formData.append("city", input.city);
    formData.append("state", input.state);
    formData.append("country", input.country);
    formData.append("pincode", input.pincode || "");
    // ✅ send categories in a way both parsers understand
    (Array.isArray(selectedCategories) ? selectedCategories : []).forEach((cat) => {
      formData.append("profile[category][]", cat); // nested
      formData.append("category[]", cat);          // flat fallback
    });
    (Array.isArray(selectedLanguages) ? selectedLanguages : []).forEach((lang) => {
      formData.append("profile[language][]", lang); // nested
      formData.append("language[]", lang);          // flat fallback
    });
    (Array.isArray(selectedDocs) ? selectedDocs : []).forEach((doc) => {
      formData.append("profile[documents][]", doc);  // nested
      formData.append("documents[]", doc);           // flat fallback
    });
    formData.append("bio", input.bio || "");
    formData.append("skills", input.skills || "");
    formData.append("qualification", input.qualification || "");
    if (input.qualification === "Others") {
      formData.append("otherQualification", input.otherQualification || "");
    }

    // ✅ Always append experiences (array only)
    formData.append("experiences", JSON.stringify(normalizedExperiences));

    if (input.resume instanceof File) {
      formData.append("resume", input.resume);
    } else if (input.resume && typeof input.resume === "string") {
      formData.append("resume", input.resume); // preserve old resume URL
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
        // ✅ make sure Redux user has the latest categories even if server omits them
        const updatedUser =
          response.data.user
            ? {
              ...response.data.user,
              profile: {
                ...response.data.user.profile,
                category: response.data.user.profile?.category ?? selectedCategories,
                language: response.data.user.profile?.language ?? selectedLanguages,
                documents: response.data.user.profile?.documents ?? selectedDocs,
              },
            } : {
              ...user,
              profile: {
                ...user.profile,
                category: selectedCategories,
                language: selectedLanguages,
                documents: selectedDocs,
              },
            };
        // dispatch(setUser(response.data.user));
        dispatch(setUser(updatedUser));
        setSelectedCategories(
          Array.isArray(updatedUser.profile?.category)
            ? updatedUser.profile.category
            : [],
        );
        setSelectedLanguages(
          Array.isArray(updatedUser.profile?.language)
            ? updatedUser.profile.language
            : []
        );
        setSelectedDocs(updatedUser.profile.documents || []);

        toast.success("Profile updated successfully!");
        setOpen(false);
        
        // If this was the first login, redirect to home page after profile completion
        if (user?.isFirstLogin) {
          setTimeout(() => {
            navigate("/");
            toast.success("Welcome to GreatHire! Your profile is now complete.");
          }, 1000);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLanguageCheckbox = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((c) => c !== language)
        : [...prev, language]
    );
  };

  // If the modal is closed, return null to prevent rendering
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white sm:max-w-[850px] w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        > ✖
        </button>

        {/* Modal Heading */}
        <h2 className="text-2xl text-center font-semibold mb-4"> Update Profile </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Personal Details</h3>
            <div className="grid sm:grid-cols-2 gap-4 items-start">
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:min-h-[300px]">
                {/* Profile Image with Pencil Icon */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0">
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
                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer"
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
                    className="sm:w-24 w-full font-semibold"
                  >
                    Name
                  </Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={input.fullname}
                    onChange={handleChange}
                    className="flex-1"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="flex sm:flex-row flex-col items-center gap-2 w-full">
                  <Label
                    htmlFor="email"
                    className="sm:w-24 w-full font-semibold"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={input.email}
                    onChange={handleChange}
                    className="flex-1"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>

                <div className="flex sm:flex-row flex-col items-center gap-2 w-full">
                  <Label
                    htmlFor="phoneNumber"
                    className="sm:w-24 w-full font-semibold"
                  >
                    Phone
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={input.phoneNumber}
                    onChange={handleChange}
                    className="flex-1"
                    placeholder="Phone Number"
                    maxLength={10}
                    required
                  />
                </div>
                <div className="flex sm:flex-row flex-col items-center gap-2 w-full">
                  <Label
                    htmlFor="alternatePhone"
                    className="sm:w-24 w-full font-semibold"
                  >
                    Alt. Phone
                  </Label>
                  <Input
                    id="alternatePhone"
                    name="alternatePhone"
                    value={input.alternatePhone}
                    onChange={handleChange}
                    className="flex-1"
                    placeholder="Alt. Phone"
                    maxLength={10}
                  //required
                  />
                </div>
                <div className="flex sm:flex-row flex-col items-center gap-2 w-full">
                  <Label htmlFor="gender" className="sm:w-24 w-full font-semibold">
                    Gender
                  </Label>
                  <select
                    id="gender"
                    name="gender"
                    value={input.gender} // empty string shows placeholder
                    onChange={handleChange}
                    className="flex-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex sm:flex-row flex-col items-center gap-2 w-full">
                  <Label htmlFor="qualification" className="sm:w-24 w-full font-semibold">
                    Qualification
                  </Label>
                  <select
                    id="qualification"
                    name="qualification"
                    value={input.qualification}
                    onChange={handleChange}
                    className="w-full sm:flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    //defaultValue={"Select Qualification"}
                    placeholder="Select"
                    required
                  >
                    <option value="" disabled>Select Qualification</option>
                    <option value="Post Graduation">Post Graduation</option>
                    <option value="Under Graduation">Under Graduation</option>
                    <option value="M.Sc. Computer Science">M.Sc. Computer Science</option>
                    <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                    <option value="M.Sc. Information Technology">M.Sc. Information Technology</option>
                    <option value="B.Sc. Information Technology">B.Sc. Information Technology</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="B.Com">B.Com</option>
                    <option value="M.Com">M.Com</option>
                    <option value="Diploma">Diploma</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                {/* If "Others" is selected */}
                {input.qualification === "Others" && (
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full mt-2">
                    <Label htmlFor="otherQualification" className="sm:w-24 w-full font-semibold">
                      Specify
                    </Label>
                    <Input
                      id="otherQualification"
                      name="otherQualification"
                      value={input.otherQualification}
                      onChange={handleChange}
                      required
                      className="w-full sm:flex-1"
                      placeholder="Enter your qualification"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <Label
                  htmlFor="country"
                  className="sm:w-20 w-full font-semibold"
                >
                  Country
                </Label>
                <select
                  id="country"
                  name="country"
                  value={input.country}
                  onChange={handleCountryChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <Label htmlFor="state" className="sm:w-20 w-full font-semibold">
                  State
                </Label>
                <select
                  id="state"
                  name="state"
                  value={input.state}
                  onChange={handleStateChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <Label htmlFor="city" className="sm:w-20 w-full font-semibold">
                  City
                </Label>
                <select
                  id="city"
                  name="city"
                  value={input.city}
                  onChange={handleCityChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <Label htmlFor="pincode" className="sm:w-20 w-full font-semibold">
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={input.pincode}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter Pincode"
                  required
                />
              </div>
              {/* Language Selection Dropdown */}
              <LanguageSelector
                selectedLanguages={selectedLanguages}
                setSelectedLanguages={setSelectedLanguages}
              />
            </div>
            {/* Selected Language Preview */}
            <div>
              <SelectedLanguagePreview
                selectedLanguages={selectedLanguages}
                setSelectedLanguages={setSelectedLanguages}
              />
            </div>
          </div>

          {/* Professional Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Professional / Experience Details
            </h3>
            <div className="flex items-center gap-6 mb-4">
              <p className="font-medium">Do you have any professional experience?</p>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="experienceRadio"
                  value="yes"
                  checked={hasExperience}
                  onChange={() => {
                    setHasExperience(true);
                    if (experiences.length === 0) {
                      handleAddExperience();
                    }
                  }}
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="experienceRadio"
                  value="no"
                  checked={!hasExperience}
                  onChange={() => {
                    if (experiences.length > 0) {
                      toast.error("Please delete all experience details before selecting Fresher.");
                      return;
                    }
                    setHasExperience(false);
                  }}
                />
                No
              </label>
            </div>
            {/* Experience Section */}
            <div className="space-y-4">
              {/* Experience Section (only if Yes selected) */}
              {hasExperience && (
                <div className="relative border rounded-xl p-4 bg-gray-50">
                  {/* Add New button */}
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="absolute -top-12 right-0 flex items-center gap-2 px-3 py-1 bg-sky-600 text-white text-sm rounded-lg shadow hover:bg-sky-700"
                  >
                    <Plus size={16} /> Add New
                  </button>

                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg p-4 bg-white shadow mb-4"
                    >
                      {/* Dustbin icon */}
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* Two-column layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left side - Job Profile, Company, Duration */}
                        <div>
                          {/* Job Profile */}
                          <div className="mb-3">
                            <label className="block font-medium">Job Profile</label>
                            <input
                              type="text"
                              value={exp.jobProfile || ""}
                              onChange={(e) =>
                                handleExperienceChange(index, "jobProfile", e.target.value)
                              }
                              placeholder="e.g., Software Developer, Data Analyst"
                              className="w-full border rounded p-2"
                              required
                            />
                          </div>

                          {/* Company Name */}
                          <div className="mb-3">
                            <label className="block font-medium">Company Name</label>
                            <input
                              type="text"
                              value={exp.companyName || ""}
                              onChange={(e) =>
                                handleExperienceChange(index, "companyName", e.target.value)
                              }
                              placeholder="e.g., Infosys, Google"
                              className="w-full border rounded p-2"
                              required
                            />
                          </div>

                          {/* Duration */}
                          <div className="mb-3">
                            <label className="block font-medium">Duration (in years)</label>
                            <input
                              type="text"
                              value={exp.duration || ""}
                              onChange={(e) =>
                                handleExperienceChange(index, "duration", e.target.value)
                              }
                              placeholder="e.g., 2 (in years only)"
                              className="w-full border rounded p-2"
                              required
                            />
                          </div>
                        </div>

                        {/* Right side - Experience Details */}
                        <div>
                          <div className="mb-3">
                            <label className="block font-medium">Experience Details</label>
                            <textarea
                              value={exp.experienceDetails || ""}
                              onChange={(e) => {
                                const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                                if (words.length <= 10) {
                                  handleExperienceChange(index, "experienceDetails", e.target.value);
                                }
                              }}
                              placeholder="Describe your work experience in detail... Just in few words (500 - 600)"
                              className="w-full border rounded p-2 h-32 md:h-40 lg:h-48"
                              required
                            />
                            {/* Word Counter */}
                            <div className="text-right text-sm text-gray-600 mt-1">
                              {
                                (exp.experienceDetails?.trim().split(/\s+/).filter(Boolean).length) || 0
                              }{" "}
                              / 600 words
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Currently Working (full width row) */}
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          checked={!!exp.currentlyWorking}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "currentlyWorking",
                              e.target.checked
                            )
                          }
                        />
                        <label className="font-medium">Currently Working</label>
                      </div>

                      {/* Current CTC + Notice Period (row with 2 columns) */}
                      {exp.currentlyWorking && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {/* Current CTC */}
                          <div>
                            <label className="block font-medium">Current CTC</label>
                            <input
                              type="text"
                              value={exp.currentCTC || ""}
                              onChange={(e) => handleExperienceChange(index, "currentCTC", e.target.value)}
                              className="w-full border rounded p-2"
                              placeholder="e.g. 10 LPA"
                              required
                            />
                          </div>

                          {/* Notice Period */}
                          <div>
                            <label className="block font-medium">Notice Period</label>
                            <input
                              type="text"
                              value={exp.noticePeriod || ""}
                              onChange={(e) =>
                                handleExperienceChange(index, "noticePeriod", e.target.value)
                              }
                              className="w-full border rounded p-2"
                              placeholder="e.g. 15 days"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <JobCategory
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
              <SelectedCategoryPreview
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
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
                  required
                />
                <p className="text-sm text-gray-600 mt-1 self-end text-right">
                  {input.bio.trim() ? input.bio.trim().length : 0}/{maxBioChars}
                </p>
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
                  required
                />
              </div>
            </div>
          </div>

          {/* ✅ New Document Section */}
          <div className="border-b pb-4 pt-4 mt-2">
            <Label htmlFor="skills" className="block mb-2 font-semibold">ID's / Documents</Label>
            <p className="mb-2">Which of these IDs / documents do you have?</p>
            <div className="flex flex-wrap gap-3">
              {["PAN Card", "Aadhar Card", "Passport", "None of these"].map(
                (doc) => (
                  <button
                    type="button"
                    key={doc}
                    onClick={() => toggleDocSelection(doc)}
                    className={`px-4 py-1 rounded-full border ${selectedDocs.includes(doc)
                        ? "bg-blue-100 border-blue-400 text-black"
                        : "bg-white border-gray-300 text-gray-700"
                      }`}
                  >
                    {doc}
                    {selectedDocs.includes(doc) && " ✓"}
                  </button>
                )
              )}
            </div>
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
              <p><strong>Note:</strong> PDF or DOCX  (.pdf , .docx)  are allowed.</p>

              {/* Display remove button inside input field */}
              {resumeUrl && (
                <button
                  type="button"
                  onClick={removeResume}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                >   ✖
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