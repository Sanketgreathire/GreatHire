// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
// import { Button } from "@/components/ui/button";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { Pencil } from "lucide-react";
// import { toast } from "react-hot-toast";
// import Navbar from "@/components/admin/Navbar";
// import DeleteConfirmation from "@/components/shared/DeleteConfirmation"; // Importing DeleteConfirmation modal
// import { useJobDetails } from "@/context/JobDetailsContext";

// //UI
// import {
//   Pencil,
//   Briefcase,
//   MapPin,
//   DollarSign,
//   Users,
//   CalendarDays,
//   Sparkles,
//   CheckCircle2,
//   GraduationCap,
//   Award,
//   Wrench,
//   ArrowLeft,
//   Building2,
//   Hourglass, // Assuming 'duration' means working days/hours
// } from "lucide-react";


// // this will use when user is admin
// import { fetchJobStats, fetchApplicationStats } from "@/redux/admin/statsSlice";

// const JobDetail = () => {
//   const { id } = useParams();
//   const { user } = useSelector((state) => state.auth);
//   const { company } = useSelector((state) => state.company);
//   const [jobDetails, setJobDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [editedJob, setEditedJob] = useState({});
//   const [jobOwner, setJobOwner] = useState(null);
//   const [dloading, dsetLoading] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const { selectedJob } = useJobDetails();

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
// //     const fetchJobDetails = async () => {
// //       try {
// //         setLoading(true);
// //         const response = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
// //           withCredentials: true,
// //         });
// //           console.log("Job API Response:", response.data); //  Debug dekhne ke liye

// //           if (!selectedJob) return <p>No job details found.</p>;
// // const jobDetails = selectedJob;


// //         if (!response.data.success) {
// //           setError(response.data.message || "Job details not found.");
// //           setJobDetails(null);
// //           return;
// //         }
// //         setJobOwner(response?.data.job.created_by);
// //         // setJobDetails(response.data.job.jobDetails);
// //          setJobDetails(response.data.job.jobDetails || response.data.job);
// //       } catch (err) {
// //         // setError(err.message || "An unexpected error occurred.");
// //          setError("Failed to load job details.");
// //     console.error("Error fetching job details:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };


//  const fetchJobDetails = async () => {
//       try {
//         const response = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
//           withCredentials: true,
//         });
//         if (response.data.success) {
//           setJobDetails(response.data.job.jobDetails || response.data.job);
//         } else {
//           setError(response.data.message || "Job details not found.");
//         }
//       } catch (err) {
//         setError("Failed to load job details.");
//         console.error("Error fetching job details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id && !jobDetails) {
//       fetchJobDetails();
//     }
//   }, [id]);



//   const deleteJob = async (jobId) => {
//     try {
//       dsetLoading(true);
//       const response = await axios.delete(
//         `${JOB_API_END_POINT}/delete/${jobId}`,
//         {
//           data: { companyId: company?._id || null }, // Send companyId in request body
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         // this one call when user admin
//         if (user?.role !== "recruiter") {
//           dispatch(fetchJobStats());
//           dispatch(fetchApplicationStats());
//         }
//         toast.success(response.data.message);
//         navigate(-1);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error deleting job:", error);
//       toast.error(
//         "There was an error deleting the job. Please try again later."
//       );
//     } finally {
//       dsetLoading(false);
//     }
//   };

//   const onConfirmDelete = () => {
//     setShowDeleteModal(false);
//     deleteJob(id);
//   };

//   const onCancelDelete = () => {
//     setShowDeleteModal(false);
//   };

//   // Function to handle changes in input fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditedJob({ ...editedJob, [name]: value });
//   };

//   // Function to save edited job details
//   const handleSave = async () => {
//     try {
//       setSaveLoading(true);
//       const response = await axios.put(
//         `${JOB_API_END_POINT}/update/${id}`,
//         { editedJob, companyId: company?._id },
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setJobDetails(response.data.updatedJob.jobDetails);
//         setEditMode(false);
//         toast.success("Job updated successfully 😊");
//       }
//     } catch (error) {
//       console.error("Error updating job:", error);
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   // Function to cancel edit mode and reset state
//   const handleCancel = () => {
//     setEditMode(false);
//   };

//   const handleEdit = () => {
//     setEditedJob(jobDetails); // Populate editedJob with jobDetails
//     setEditMode(true);
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-slate-50">
//         <p className="text-xl font-semibold text-slate-600 animate-pulse">
//           Loading Job Details...
//         </p>
//       </div>
//     );
//    if (error)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-slate-50">
//         <p className="text-xl font-medium text-red-600">{error}</p>
//       </div>
//     );


//   return (
//     <>
//       {user?.role !== "recruiter" && <Navbar linkName={"Job Details"} />}
//       <div
//         className={`flex flex-col space-y-4 p-6 md:p-10 min-h-screen  ${
//           user?.role !== "recruiter" && "bg-white m-4"
//         }`}
//       >
//         {/* Job Header */}
//         <div
//           className={`${
//             user?.role !== "recruiter"
//               ? "bg-blue-700 text-white"
//               : "bg-blue-200"
//           } p-6 rounded-lg shadow-md relative`}
//         >
//           {/* Back Button */}
//           <button
//             onClick={() => navigate(-1)}
//             className="mb-2 flex items-center hover:underline text-2xl p-2"
//           >
//             ←
//           </button>
//           {user?.role === "recruiter" && (
//             <button onClick={handleEdit} className="absolute right-4">
//               <Pencil className="h-5 w-5 text-black cursor-pointer" />
//             </button>
//           )}
//           <h1 className="text-3xl font-bold">{jobDetails?.title}</h1>
//           <p className="text-lg">
//             {jobDetails?.companyName || "Company not specified"}
//           </p>
//           <p className="text-sm mb-2">
//             {jobDetails?.location || "Location Not Available"}
//           </p>
//           {editMode ? (
//             <input
//               type="text"
//               name="salary"
//               value={editedJob.salary || ""}
//               onChange={handleInputChange}
//               className="w-full p-2 rounded"
//             />
//           ) : (
//             // <p className="text-lg font-semibold">
//             //   {jobDetails?.salary
//             //   .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//             //     // .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//             //     .split("-")
//             //     .map((part, index) => (
//             //       <span key={index}>
//             //         ₹{part.trim()}
//             //         {index === 0 ? " - " : ""}
//             //       </span>
//             //     ))}{" "}
//             //   monthly
//             // </p>
//             <p className="text-lg font-semibold">
//   {jobDetails?.salary
//     ? jobDetails.salary
//         .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
//         .split("-")
//         .map((part, index) => (
//           <span key={index}>
//             ₹{part.trim()}
//             {index === 0 ? " - " : ""}
//           </span>
//         ))
//     : "Salary Not Specified"}
//   {jobDetails?.salary ? " monthly" : ""}
// </p>

//           )}
//         </div>

//         {/* Job Description */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             Job Description
//           </h2>
//           {editMode ? (
//             <textarea
//               name="details"
//               value={editedJob.details || ""}
//               onChange={handleInputChange}
//               className="w-full p-2 rounded border"
//               rows={3}
//             />
//           ) : (
//             <p className="text-gray-600 text-lg">
//               {jobDetails?.details 
//                 ? jobDetails.details.split("\n").map((line, index) => (
//                 <span key={index}>
//                   {line}
//                   <br />
//               </span>
//       )) 
//     : "No description provided."}
//             </p>
//           )}
//         </div>

//         {/* Benefits and Responsibilities */}
//         <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
//           {/* Benefits Section */}
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Benefits</h3>
//             {editMode ? (
//               <textarea
//                 name="benefits"
//                 value={editedJob.benefits ? editedJob.benefits.join("\n") : ""}
//                 onChange={(e) =>
//                   setEditedJob({
//                     ...editedJob,
//                     benefits: e.target.value.split("\n"),
//                   })
//                 }
//                 className="w-full p-2 rounded border"
//                 rows={3} // Adjusted for better visibility
//               />
//             ) : (
//               <ul className="list-disc list-inside text-gray-600">
//                 {jobDetails?.benefits?.length > 0 ? (
//                   jobDetails.benefits.map((benefit, index) => (
//                     <li key={index}>{benefit}</li>
//                   ))
//                 ) : (
//                   <li>Not specified</li>
//                 )}
//               </ul>
//             )}
//           </div>
          
//           <div>
//               <h4 className="font-semibold text-gray-700">Work Place Flexibility</h4>
//               {editMode ? (
//                 <input
//                   type="text"
//                   name="workPlaceFelxibility"
//                   value={editedJob.workPlaceFlexibility || ""}
//                   onChange={handleInputChange}
//                   className="w-full p-2 rounded border"
//                 />
//               ) : (
//                 <p className="text-gray-600">
//                   {jobDetails?.workPlaceFlexibility || "Not specified"}
//                 </p>
//               )}
//             </div>
//           {/* Responsibilities Section */}
//           {/* <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               Responsibilities
//             </h3>
//             {editMode ? (
//               <textarea
//                 name="responsibilities"
//                 value={
//                   editedJob.responsibilities
//                     ? editedJob.responsibilities.join("\n")
//                     : ""
//                 }
//                 onChange={(e) =>
//                   setEditedJob({
//                     ...editedJob,
//                     responsibilities: e.target.value.split("\n"),
//                   })
//                 }
//                 className="w-full p-2 rounded border"
//                 rows={3} // Adjusted for better visibility
//               />
//             ) : (
//               <ul className="list-disc list-inside text-gray-600">
//                 {jobDetails?.responsibilities?.length > 0 ? (
//                   jobDetails.responsibilities.map((responsibility, index) => (
//                     <li key={index}>{responsibility}</li>
//                   ))
//                 ) : (
//                   <li>Not specified</li>
//                 )}
//               </ul>
//             )}
//           </div> */}
//         </div>

//         {/* Additional Details */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             Additional Details
//           </h2>
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <h4 className="font-semibold text-gray-700">Job Type</h4>
//               {editMode ? (
//                 <input
//                   type="text"
//                   name="jobType"
//                   value={editedJob.jobType || ""}
//                   onChange={handleInputChange}
//                   className="w-full p-2 rounded border"
//                 />
//               ) : (
//                 <p className="text-gray-600">
//                   {jobDetails?.jobType || "Not specified"}
//                 </p>
//               )}
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-700">No. of Openings</h4>
//               {editMode ? (
//                 <input
//                   type="number"
//                   name="numberOfOpening"
//                   value={editedJob.numberOfOpening || ""}
//                   onChange={handleInputChange}
//                   className="w-full p-2 rounded border"
//                 />
//               ) : (
//                 <p className="text-gray-600">
//                   {jobDetails?.numberOfOpening || "Not specified"}
//                 </p>
//               )}
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-700">Working Days</h4>
//               {editMode ? (
//                 <input
//                   type="text"
//                   name="duration"
//                   value={editedJob.duration || ""}
//                   onChange={handleInputChange}
//                   className="w-full p-2 rounded border"
//                 />
//               ) : (
//                 <p className="text-gray-600">
//                   {jobDetails?.duration || "Not specified"}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Job Requirements */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             Job Requirements
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
//             <div>
//               <h4 className="font-semibold text-gray-700">Qualifications</h4>
//               {editMode ? (
//                 <input
//                   type="text"
//                   name="qualifications"
//                   value={editedJob.qualifications || ""}
//                   onChange={handleInputChange}
//                   className="w-full p-2 rounded border"
//                 />
//               ) : (
//                 <p className="text-gray-600">
//                   {jobDetails?.qualifications?.join(", ") || "Not specified"}
//                 </p>
//               )}
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-700">Experience</h4>
//               {editMode ? (
//                 <input
//                   type="text"
//                   name="experience"
//                   value={editedJob.experience || ""}
//                   onChange={handleInputChange}
//                   className="w-full p-2 rounded border"
//                 />
//               ) : (
//                 <p className="text-gray-600">
//                   {jobDetails?.experience || "Not specified"} 
//                 </p>
//               )}
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-700">Skills</h4>
//               {editMode ? (
//                 <textarea
//                  name = "skills"
//                  value={
//                   editedJob.skills
//                     ? editedJob.skills.join("\n")
//                     : ""
//                 }
//                 onChange={(e) =>
//                   setEditedJob({
//                     ...editedJob,
//                     skills: e.target.value.split("\n"),
//                   })
//                 }
//                 className="w-full p-2 rounded border"
//                 rows={3} // Adjusted for better visibility
//               />
//               ) : (
//                 <p className="text-gray-600">
//                   {jobDetails?.skills?.join(", ") || "Not specified"}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="flex w-full justify-end space-x-2">
//           {!editMode ? (
//             <>
//               <Button
//                 className="bg-green-600 hover:bg-green-700"
//                 onClick={() => {
//                   if (user.role === "recruiter")
//                     navigate(`/recruiter/dashboard/applicants-details/${id}`);
//                   else navigate(`/admin/applicants-list/${id}`);
//                 }}
//               >
//                 Applicants List
//               </Button>
//               {(user?._id === jobOwner ||
//                 user?.emailId?.email === company?.adminEmail ||
//                 user?.role === "admin" ||
//                 user?.role === "Owner") && (
//                 <Button
//                   className={`bg-red-600 hover:bg-red-700 ${
//                     dloading ? "cursor-not-allowed" : ""
//                   }`}
//                   onClick={() => {
//                     setShowDeleteModal(true);
//                   }}
//                   disabled={dloading}
//                 >
//                   {dloading ? "Deleting..." : "Delete"}
//                 </Button>
//               )}
//             </>
//           ) : (
//             // Save & Cancel Buttons in Edit Mode
//             <div className="flex space-x-4">
//               <Button
//                 className="bg-green-600 hover:bg-green-700"
//                 onClick={() => {
//                   handleSave();
//                   handleCancel();
//                 }}
//                 disabled={saveLoading}
//               >
//                 {saveLoading ? "Saving...." : "Save"}
//               </Button>
//               <Button
//                 className="bg-gray-600 hover:bg-gray-700"
//                 onClick={handleCancel}
//               >
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {showDeleteModal && (
//         <DeleteConfirmation
//           isOpen={showDeleteModal}
//           onConfirm={onConfirmDelete}
//           onCancel={onCancelDelete}
//         />
//       )}
//     </>
//   );
// };

// export default JobDetail;











import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Navbar from "@/components/admin/Navbar";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { useJobDetails } from "@/context/JobDetailsContext";
// import jobbackg from "../../assets/jobbackg.svg";
import jobbackg from '../../assets/jobbackg.svg?url';





// UI CHANGE: Professional icons add kiye hain for better visuals
import {
  Pencil,
  Briefcase,
  MapPin,
  // DollarSign,
  Users,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Award,
  Wrench,
  ArrowLeft,
  Building2,
  Hourglass, // Assuming 'duration' means working days/hours
} from "lucide-react";

// this will use when user is admin
import { fetchJobStats, fetchApplicationStats } from "@/redux/admin/statsSlice";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedJob, setEditedJob] = useState({});
  const [jobOwner, setJobOwner] = useState(null);
  const [dloading, dsetLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { selectedJob } = useJobDetails();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true); // Set loading true at the start
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          const jobData = response.data.job.jobDetails || response.data.job;
          setJobDetails(jobData);
          setJobOwner(response?.data.job.created_by);
        } else {
          setError(response.data.message || "Job details not found.");
        }
      } catch (err) {
        setError("Failed to load job details.");
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // Baaki saare functions (deleteJob, handleSave, etc.) waise hi rahenge, unme koi change nahi hai.
  const deleteJob = async (jobId) => {
    try {
      dsetLoading(true);
      const response = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobId}`,
        {
          data: { companyId: company?._id || null },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        if (user?.role !== "recruiter") {
          dispatch(fetchJobStats());
          dispatch(fetchApplicationStats());
        }
        toast.success(response.data.message);
        navigate(-1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(
        "There was an error deleting the job. Please try again later."
      );
    } finally {
      dsetLoading(false);
    }
  };

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    deleteJob(id);
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJob({ ...editedJob, [name]: value });
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const response = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        { editedJob, companyId: company?._id },
        { withCredentials: true }
      );
      if (response.data.success) {
        setJobDetails(response.data.updatedJob.jobDetails);
        setEditMode(false);
        toast.success("Job updated successfully 😊");
      }
    } catch (error) {
      console.error("Error updating job:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditedJob(jobDetails);
    setEditMode(true);
  };
  
  // --- UI CHANGE START: Loading, Error, and No Data states ko better banaya hai ---
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-xl font-semibold text-slate-600 animate-pulse">
          Loading Job Details...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-xl font-medium text-red-600">{error}</p>
      </div>
    );
  if (!jobDetails)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-xl font-medium text-slate-700">No job details found.</p>
      </div>
    );
  // --- UI CHANGE END ---

  return (
    <>
      {/* {user?.role !== "recruiter" && <Navbar linkName={"Job Details"} />} */}
      
      {/* --- UI CHANGE START: Main page container with a professional background color and centered layout --- */}
      <div className=" bg-[#404] min-h-screen font-sans "
      style={{ backgroundImage: `url(${jobbackg})`,
      backgroundSize: "cover" ,
      backgroundRepeat:"no-repeat",
      backgroundPosition:"center" }}>
        <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 ">
          
          {/* Back Button and action buttons header */}
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className=" bg-green-500 text-slate-700 hover:bg-green-800 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {user?.role === "recruiter" && !editMode && (
              <Button variant="outline" onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
            )}
          </div>

          {/* --- UI CHANGE: Main Job Header Card --- */}
          <div className="bg-gray-100 dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8 mb-8 ">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
              {jobDetails?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-500" />
                <span>{jobDetails?.companyName || "Company not specified"}</span>
              </div>
              <div className="items-center">
                <MapPin className="h-5 w-5 text-slate-500" />
                <span>{jobDetails?.location || "Location Not Available"}</span>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
               {editMode ? (
                 <div className="flex items-center gap-2">
                    {/* <DollarSign className="h-5 w-5 text-slate-500" /> */}
                    <input
                      type="text"
                      name="salary"
                      value={editedJob.salary || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded border border-slate-300"
                      placeholder="e.g., 50000 - 70000"
                    />
                 </div>
                ) : (
                  <p className="text-xl font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                    {/* <DollarSign className="h-6 w-6"/> */}
                    <span>
                    {jobDetails?.salary
                      ? `₹${jobDetails.salary.replace(/\s/g, "")} monthly`
                      : "Salary Not Specified"}
                    </span>
                  </p>
                )}
            </div>
          </div>

          {/* --- UI CHANGE: Two-column layout for main content --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Job Description Card */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8 font-geometric">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Job Description</h2>
                {editMode ? (
                  <textarea
                    name="details"
                    value={editedJob.details || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-slate-300 text-slate-600"
                    rows={5}
                  />
                ) : (
                  <div className="prose prose-slate max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 text-base leading-relaxed font-">
                    {jobDetails?.details 
                      ? jobDetails.details.split("\n").map((line, index) => (
                          <p key={index}>{line}</p>
                        )) 
                      : <p>No description provided.</p>}
                  </div>
                )}
              </div>

              {/* Benefits Card */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Benefits</h2>
                {editMode ? (
                  <textarea
                    name="benefits"
                    value={editedJob.benefits ? editedJob.benefits.join("\n") : ""}
                    onChange={(e) => setEditedJob({ ...editedJob, benefits: e.target.value.split("\n") })}
                    className="w-full p-2 rounded border border-slate-300"
                    rows={4}
                    placeholder="Enter each benefit on a new line"
                  />
                ) : (
                  <ul className="space-y-3">
                    {jobDetails?.benefits?.length > 0 ? (
                      jobDetails.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          <span className="text-slate-600 dark:text-slate-300">{benefit}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">Not specified</li>
                    )}
                  </ul>
                )}
              </div>
              
               {/* Job Requirements Card */}
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Job Requirements</h2>
                <div className="space-y-6">
                  {/* Qualifications */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                       <GraduationCap className="h-6 w-6 text-slate-600 dark:text-slate-300"/>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Qualifications</h4>
                        {editMode ? <input type="text" name="qualifications" value={editedJob.qualifications || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300"/>
                        : <p className="text-slate-600 dark:text-slate-300">{jobDetails?.qualifications?.join(", ") || "Not specified"}</p>}
                    </div>
                  </div>
                   {/* Experience */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                       <Award className="h-6 w-6 text-slate-600 dark:text-slate-300"/>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Experience</h4>
                        {editMode ? <input type="text" name="experience" value={editedJob.experience || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300"/>
                        : <p className="text-slate-600 dark:text-slate-300">{jobDetails?.experience || "Not specified"}</p>}
                    </div>
                  </div>
                  {/* Skills */}
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                       <Wrench className="h-6 w-6 text-slate-600 dark:text-slate-300"/>
                    </div>
                    <div className="w-full">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Skills Required</h4>
                        {editMode ? <textarea name="skills" value={editedJob.skills ? editedJob.skills.join("\n") : ""} onChange={(e) => setEditedJob({...editedJob, skills: e.target.value.split('\n')})} className="w-full p-2 mt-1 rounded border border-slate-300" rows={3}/>
                        : <div className="flex flex-wrap gap-2 mt-2">
                          {jobDetails?.skills?.length > 0 ? jobDetails.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
                          )) : <p className="text-slate-500">Not specified</p>}
                        </div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1">
              <div className=" bg-gray-100  dark:bg-slate-800 shadow-lg rounded-xl p-6 md:p-8 sticky top-10">
                <h3 className=" text-xl font-bold text-slate-800 dark:text-white mb-6">Job Overview</h3>
                <ul className="space-y-5">
                    {/* Job Type */}
                    <li className="flex items-center gap-4">
                        <Briefcase className="h-6 w-6 text-slate-500"/>
                        <div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Job Type</span>
                            {editMode ? <input type="text" name="jobType" value={editedJob.jobType || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300"/>
                            : <p className="font-semibold text-slate-700 dark:text-slate-200">{jobDetails?.jobType || "Not specified"}</p>}
                        </div>
                    </li>
                     {/* Openings */}
                    <li className="flex items-center gap-4">
                        <Users className="h-6 w-6 text-slate-500"/>
                        <div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">No. of Openings</span>
                            {editMode ? <input type="number" name="numberOfOpening" value={editedJob.numberOfOpening || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300"/>
                            : <p className="font-semibold text-slate-700 dark:text-slate-200">{jobDetails?.numberOfOpening || "Not specified"}</p>}
                        </div>
                    </li>
                     {/* Working Days */}
                    <li className="flex items-center gap-4">
                        <Hourglass className="h-6 w-6 text-slate-500"/>
                        <div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Working Days</span>
                            {editMode ? <input type="text" name="duration" value={editedJob.duration || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300"/>
                            : <p className="font-semibold text-slate-700 dark:text-slate-200">{jobDetails?.duration || "Not specified"}</p>}
                        </div>
                    </li>
                     {/* Flexibility */}
                    <li className="flex items-center gap-4">
                        <Sparkles className="h-6 w-6 text-slate-500"/>
                        <div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Work Place Flexibility</span>
                             {editMode ? <input type="text" name="workPlaceFlexibility" value={editedJob.workPlaceFlexibility || ""} onChange={handleInputChange} className="w-full p-2 mt-1 rounded border border-slate-300"/>
                            : <p className="font-semibold text-slate-700 dark:text-slate-200">{jobDetails?.workPlaceFlexibility || "Not specified"}</p>}
                        </div>
                    </li>
                </ul>
                
                {/* --- UI CHANGE: Action buttons yahan move kar diye for better access --- */}
                <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                 {!editMode ? (
                  <div className="space-y-3">
                    {/* <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        if (user.role === "recruiter")
                          navigate(`/recruiter/dashboard/applicants-details/${id}`);
                        else navigate(`/admin/applicants-list/${id}`);
                      }}
                    >
                      View Applicants List
                    </Button> */}
                    {(user?._id === jobOwner ||
                      user?.emailId?.email === company?.adminEmail ||
                      user?.role === "admin" ||
                      user?.role === "Owner") && (
                        <Button
                          size="lg"
                          variant="destructive"
                          className="w-full"
                          onClick={() => setShowDeleteModal(true)}
                          disabled={dloading}
                        >
                          {dloading ? "Deleting..." : "Delete Job"}
                        </Button>
                    )}
                  </div>
                  ) : (
                    <div className="flex space-x-4">
                      <Button
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleSave}
                        disabled={saveLoading}
                      >
                        {saveLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* --- UI CHANGE END --- */}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}
    </>
  );
};

export default JobDetail;