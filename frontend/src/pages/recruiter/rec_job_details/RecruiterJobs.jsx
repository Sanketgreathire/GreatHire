import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Trash, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { useNavigate } from "react-router-dom";

const RecruiterJob = ({ recruiterId }) => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user?.role === "student") navigate("/login");
  }, [user]);

  const getJobsByRecruiter = async (recruiterId, page = 1) => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: true }));
      const response = await axios.get(
        `${JOB_API_END_POINT}/jobs/${recruiterId}?page=${page}&limit=10`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(
        "There was an error fetching the jobs. Please try again later."
      );
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: false }));
    }
  };

  useEffect(() => {
    if (recruiterId && jobs.length === 0) {
      getJobsByRecruiter(recruiterId, currentPage);
    }
  }, [recruiterId, currentPage]);

  const toggleActive = async (event, jobId, isActive) => {
    event.stopPropagation();
    try {
      setLoading((prevLoading) => ({ ...prevLoading, [jobId]: true }));
      const response = await axios.put(
        `
        ${JOB_API_END_POINT}/toggle-active`,
        {
          jobId,
          isActive,
          companyId: company?._id,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId
              ? { ...job, jobDetails: { ...job.jobDetails, isActive } }
              : job
          )
        );

        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast.error(
        "There was an error toggling the job status. Please try again later."
      );
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [jobId]: false }));
    }
  };

  const deleteJob = async (event, jobId) => {
    event.stopPropagation();
    try {
      dsetLoading((prevLoading) => ({ ...prevLoading, [jobId]: true }));
      const response = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobId}`,
        {
          data: { companyId: company._id }, // Send companyId in request body
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(
        "There was an error deleting the job. Please try again later."
      );
    } finally {
      dsetLoading((prevLoading) => ({ ...prevLoading, [jobId]: false }));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getJobsByRecruiter(recruiterId, page);
  };

  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.jobDetails.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobDetails.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.jobDetails.jobType.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "active" && job.jobDetails.isActive) ||
      (filterStatus === "inactive" && !job.jobDetails.isActive);

    return searchMatch && statusMatch;
  });

  const handleJobDetailsClick = (jobId) => {
    if (user?.role === "recruiter")
      navigate(`/recruiter/dashboard/job-details/${jobId}`);
    else navigate(`/admin/job/details/${jobId}`);
  };

  return (
    <div className="container min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Jobs Created By You</h2>
      <div className="mb-4 flex justify-between px-2">
        <input
          type="text"
          placeholder="Search by title, company or job type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-72 border border-gray-400 rounded-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-400 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table displaying jobs */}
      <div className="w-72 flex overflow-x-scroll md:w-full">
        <table className="bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Job Title
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Job Type
              </th>
              {(recruiterId === user?._id ||
                user?.emailId.email === company?.adminEmail ||
                user?.role === "admin" ||
                user?.role === "Owner") && (
                <>
                  <th className="py-3 px-6 bg-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-center text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job._id} className="border-b">
                  <td className="py-3 px-6">{job.jobDetails.title}</td>
                  <td className="py-3 px-6">{job.jobDetails.companyName}</td>
                  <td className="py-3 px-6">{job.jobDetails.location}</td>
                  <td className="py-3 px-6">{job.jobDetails.jobType}</td>
                  {(recruiterId === user?._id ||
                    user?.emailId.email === company?.adminEmail ||
                    user?.role === "admin" ||
                    user?.role === "Owner") && (
                    <>
                      <td className="py-3 px-6 place-items-center">
                        {loading[job._id] ? (
                          "loading..."
                        ) : job.jobDetails.isActive ? (
                          <FaToggleOn
                            className="text-green-500 cursor-pointer"
                            onClick={(event) =>
                              toggleActive(
                                event,
                                job._id,
                                !job.jobDetails.isActive
                              )
                            }
                            size={30}
                          />
                        ) : (
                          <FaToggleOff
                            className="text-red-500 cursor-pointer"
                            onClick={(event) =>
                              toggleActive(
                                event,
                                job._id,
                                !job.jobDetails.isActive
                              )
                            }
                            size={30}
                          />
                        )}
                      </td>
                      <td className="py-3 px-6 flex gap-4 items-center">
                        <Eye
                          className="text-blue-500 cursor-pointer"
                          size={20}
                          onClick={() => handleJobDetailsClick(job?._id)}
                        />
                        {dloading[job._id] ? (
                          "deleting..."
                        ) : (
                          <Trash
                            size={20}
                            onClick={(event) => deleteJob(event, job._id)}
                            className="text-red-500 hover:text-red-700"
                          />
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex w-72 md:w-full justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-700 text-white"
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-700 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecruiterJob;
