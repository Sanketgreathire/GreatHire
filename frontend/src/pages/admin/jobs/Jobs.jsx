// Jobs.jsx — Clean White & Professional Dashboard UI
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, FileText, CheckCircle, XCircle, Trash, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, MenuItem, Switch } from "@mui/material";
import Navbar from "@/components/admin/Navbar";
import { useSelector, useDispatch } from "react-redux";
import {
  ADMIN_JOB_DATA_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/ApiEndPoint";
import axios from "axios";
import { fetchJobStats, fetchApplicationStats } from "@/redux/admin/statsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});
  const [page, setPage] = useState(1);
  const [jobList, setJobList] = useState([]);
  const itemsPerPage = 8;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobStats = useSelector((state) => state.stats.jobStatsData);
  const applicationStats = useSelector((state) => state.stats.applicationStatsData);
  const { user } = useSelector((state) => state.auth);

  const toggleActive = async (jobId, isActive, companyId) => {
    try {
      setLoading((prev) => ({ ...prev, [jobId]: true }));
      const response = await axios.put(
        `${JOB_API_END_POINT}/toggle-active`,
        { jobId, isActive, companyId },
        { withCredentials: true }
      );
      if (response.data.success) {
        setJobList((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isActive } : job
          )
        );
        if (user?.role !== "recruiter") dispatch(fetchJobStats());
        toast.success(response.data.message);
      } else toast.error(response.data.message);
    } catch {
      toast.error("Error toggling job status.");
    } finally {
      setLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const deleteJob = async (jobId, companyId) => {
    try {
      dsetLoading((prev) => ({ ...prev, [jobId]: true }));
      const response = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        data: { companyId },
        withCredentials: true,
      });
      if (response.data.success) {
        setJobList((prev) => prev.filter((job) => job._id !== jobId));
        if (user?.role !== "recruiter") {
          dispatch(fetchJobStats());
          dispatch(fetchApplicationStats());
        }
        toast.success(response.data.message);
      } else toast.error(response.data.message);
    } catch {
      toast.error("Error deleting job.");
    } finally {
      dsetLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const fetchJobList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_JOB_DATA_API_END_POINT}/getAllJobs-stats`,
        { withCredentials: true }
      );
      if (response.data.success) setJobList(response.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  useEffect(() => {
    if (user) fetchJobList();
  }, [user]);

  const stats = [
    {
      title: "Total Jobs",
      count: jobStats.totalJobs || 0,
      icon: <CheckCircle className="text-blue-500" size={24} />,
    },
    {
      title: "Active Jobs",
      count: jobStats.totalActiveJobs || 0,
      icon: <FileText className="text-green-500" size={24} />,
    },
    {
      title: "Deactive Jobs",
      count: jobStats.totalDeactiveJobs || 0,
      icon: <XCircle className="text-yellow-500" size={24} />,
    },
    {
      title: "Total Applications",
      count: applicationStats.totalApplications || 0,
      icon: <Briefcase className="text-purple-500" size={24} />,
    },
  ];

  const filteredJobs = jobList.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All" || job.isActive === status;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / itemsPerPage));
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
  <>
    <Navbar linkName="Jobs" />

    {/* Stats Section */}
    <div className="px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm text-gray-500 font-medium">
                {stat.title}
              </h3>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {stat.count}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Search & Filter */}
    <div className="mx-4 sm:mx-6 mt-2 mb-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <Input
        placeholder="Search jobs by title or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full lg:w-1/3 border-gray-300"
      />

      <Select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full sm:w-1/3 lg:w-1/5 bg-white rounded-md"
      >
        <MenuItem value="All">All Status</MenuItem>
        <MenuItem value={true}>Active</MenuItem>
        <MenuItem value={false}>Deactive</MenuItem>
      </Select>
    </div>

    {/* Jobs Table */}
    <div className="mx-4 sm:mx-6 mb-10 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b">
              <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                Job Details
              </TableHead>
              <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                Company
              </TableHead>
              <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                Posted Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                Applications
              </TableHead>
              <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center whitespace-nowrap">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan="6"
                  className="text-center py-10 text-gray-400"
                >
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              paginatedJobs.map((job) => (
                <TableRow
                  key={job._id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="min-w-[260px]">
                    <p className="font-medium text-gray-800 break-words">
                      {job.title}
                    </p>
                    <p className="text-sm text-gray-500 break-words">
                      {job.jobType} • {job.location} • ₹
                      {job.salary.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {job.companyName}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {job.postedDate}
                  </TableCell>

                  <TableCell className="text-center">
                    {job.numberOfApplications}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {job.isActive ? "Active" : "Deactive"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap justify-center items-center gap-3 min-w-[160px]">
                      <Eye
                        className="text-blue-500 cursor-pointer hover:scale-110 transition"
                        size={20}
                        onClick={() =>
                          navigate(`/admin/job/details/${job._id}`)
                        }
                      />

                      {loading[job._id] ? (
                        <span className="text-gray-400 text-sm">...</span>
                      ) : (
                        <Switch
                          checked={job.isActive}
                          onChange={() =>
                            toggleActive(
                              job._id,
                              !job.isActive,
                              job.companyId
                            )
                          }
                          color="primary"
                        />
                      )}

                      {dloading[job._id] ? (
                        <span className="text-gray-400 text-sm">...</span>
                      ) : (
                        <Trash
                          className="text-red-500 cursor-pointer hover:scale-110 transition"
                          size={20}
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDeleteModal(true);
                          }}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-3 p-4 border-t bg-gray-50">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>

        <span className="text-gray-600 font-medium">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>

    {showDeleteModal && (
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onConfirm={() => {
          setShowDeleteModal(false);
          deleteJob(selectedJob._id, selectedJob.companyId);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    )}
  </>
);

};

export default Jobs;
