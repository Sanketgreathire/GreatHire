import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { JOB_API_END_POINT } from "@/utils/ApiEndPoint";
import { useNavigate } from "react-router-dom";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { fetchJobStats, fetchApplicationStats } from "@/redux/admin/statsSlice";
import { Helmet } from "react-helmet-async";

const RecruiterJobs = ({ recruiterId }) => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [jobId, setJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getJobsByRecruiter = async (recruiterId, page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${JOB_API_END_POINT}/jobs/${recruiterId}?page=${page}&limit=10`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setJobs(res.data.jobs);
        setTotalPages(res.data.totalPages);
      }
    } catch {
      toast.error("Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recruiterId) getJobsByRecruiter(recruiterId, currentPage);
  }, [recruiterId, currentPage]);

  const handleJobDetailsClick = (jobId) => {
    if (user?.role === "recruiter")
      navigate(`/recruiter/dashboard/job-details/${jobId}`);
    else navigate(`/admin/job/details/${jobId}`);
  };

  const toggleActive = async (jobId, isActive) => {
    try {
      setLoading((p) => ({ ...p, [jobId]: true }));
      const res = await axios.put(
        `${JOB_API_END_POINT}/toggle-active`,
        { jobId, isActive, companyId: company?._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        setJobs((jobs) =>
          jobs.map((j) =>
            j._id === jobId ? { ...j, jobDetails: { ...j.jobDetails, isActive } } : j
          )
        );
        if (user?.role !== "recruiter") dispatch(fetchJobStats());
        toast.success(res.data.message);
      }
    } catch {
      toast.error("Error updating job status");
    } finally {
      setLoading((p) => ({ ...p, [jobId]: false }));
    }
  };

  const deleteJob = async (jobId) => {
    try {
      dsetLoading((p) => ({ ...p, [jobId]: true }));
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        data: { companyId: company._id },
        withCredentials: true,
      });
      if (res.data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        dispatch(fetchJobStats());
        dispatch(fetchApplicationStats());
        toast.success(res.data.message);
      }
    } catch {
      toast.error("Failed to delete job");
    } finally {
      dsetLoading((p) => ({ ...p, [jobId]: false }));
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const t = searchTerm.toLowerCase();
    const match =
      job.jobDetails.title.toLowerCase().includes(t) ||
      job.jobDetails.companyName.toLowerCase().includes(t) ||
      job.jobDetails.jobType.toLowerCase().includes(t);

    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "active" && job.jobDetails.isActive) ||
      (filterStatus === "inactive" && !job.jobDetails.isActive);

    return match && statusMatch;
  });

  return (
    <>
      <Helmet>
        <title>
          Handle Job Postings & Hiring Activity | GreatHire Recruiter Dashboard
        </title>

        <meta
          name="description"
          content="All your job postings can be efficiently managed and controlled using the recruiter dashboard from GreatHire. This system has been developed to meet the needs of expanding hiring teams in Hyderabad State and allows hiring teams to control all job postings. There are features that enable you to view active and inactive jobs, monitor job details, manage locations, and react quickly to hiring needs. This facilitates recruiters to work in an organized manner, avoid hiring time constraints, and manage hiring operations effectively."
        />
      </Helmet>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Job Listings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">All jobs created by this recruiter</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by title or company…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-64 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-colors"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-colors"
          >
            <option value="all">All Jobs</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Corporate Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
              <tr>
                <th className="py-3 px-5 text-left font-semibold">Job Title</th>
                <th className="py-3 px-5 text-left font-semibold">Company</th>
                <th className="py-3 px-5 text-left font-semibold">Location</th>
                <th className="py-3 px-5 text-left font-semibold">Type</th>
                <th className="py-3 px-5 text-center font-semibold">Status</th>
                <th className="py-3 px-5 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-700 dark:text-gray-300">
              {filteredJobs.length ? (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-5 text-gray-900 dark:text-gray-100">{job.jobDetails.title}</td>
                    <td className="py-3 px-5">{job.jobDetails.companyName}</td>
                    <td className="py-3 px-5">{job.jobDetails.location}</td>
                    <td className="py-3 px-5">{job.jobDetails.jobType}</td>

                    <td className="py-3 px-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          job.jobDetails.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                        }`}
                        onClick={() =>
                          toggleActive(job._id, !job.jobDetails.isActive)
                        }
                      >
                        {job.jobDetails.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3 px-5 flex justify-center gap-4">
                      <Eye
                        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        onClick={() => handleJobDetailsClick(job._id)}
                      />
                      <Trash2
                        className="text-red-500 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        onClick={() => {
                          setJobId(job._id);
                          setShowDeleteModal(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-5 text-center text-gray-500 dark:text-gray-400" colSpan="6">
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <DeleteConfirmation
            isOpen={showDeleteModal}
            onConfirm={() => deleteJob(jobId)}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default RecruiterJobs;