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
import { Trash, Eye } from "lucide-react";
import { Briefcase, FileText, CheckCircle, XCircle } from "lucide-react";
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

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [jobList, setJobList] = useState([]);
  const jobStats = useSelector((state) => state.stats.jobStatsData);
  const applicationStats = useSelector(
    (state) => state.stats.applicationStatsData
  );
  const { user } = useSelector((state) => state.auth);

  const toggleActive = async (jobId, isActive, companyId) => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, [jobId]: true }));
      const response = await axios.put(
        `
        ${JOB_API_END_POINT}/toggle-active`,
        {
          jobId,
          isActive,
          companyId,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setJobList((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, isActive } : job
          )
        );

        // this one call when user admin
        if (user?.role !== "recruiter") {
          dispatch(fetchJobStats());
        }
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

  const deleteJob = async (jobId, companyId) => {
    try {
      dsetLoading((prevLoading) => ({ ...prevLoading, [jobId]: true }));
      const response = await axios.delete(
        `${JOB_API_END_POINT}/delete/${jobId}`,
        {
          data: { companyId }, // Send companyId in request body
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setJobList((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

        // this one call when user admin
        if (user?.role !== "recruiter") {
          dispatch(fetchJobStats());
          dispatch(fetchApplicationStats());
        }
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

  const fetchJobList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_JOB_DATA_API_END_POINT}/getAllJobs-stats`
      );
      if (response.data.success) {
        setJobList(response.data.jobs);
      }
    } catch (err) {
      console.log(`error in job fetching ${err}`);
    }
  };

  useEffect(() => {
    fetchJobList();
  }, []);

  const stats = [
    {
      title: "Total Jobs",
      count: jobStats.totalJobs || 0,
      icon: <CheckCircle size={30} className="text-green-500" />,
    },
    {
      title: "Active Jobs",
      count: jobStats.totalActiveJobs || 0,
      icon: <FileText size={30} className="text-yellow-500" />,
    },
    {
      title: "Deactive Jobs",
      count: jobStats.totalDeactiveJobs || 0,
      icon: <XCircle size={30} className="text-red-500" />,
    },
    {
      title: "Total Applications",
      count: applicationStats.totalApplications || 0,
      icon: <Briefcase size={30} className="text-blue-500" />,
    },
  ];

  const filteredJobs = jobList.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.companyName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All" || job.isActive === status;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Navbar linkName={"Jobs"} />
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-4 flex items-center justify-between shadow rounded-xl bg-white"
          >
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-2xl font-bold text-center">{stat.count}</p>
            </div>
            {stat.icon}
          </Card>
        ))}
      </div>

      <div className="m-4 p-4 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search jobs by title, company name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-1/6 h-10"
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Deactive</MenuItem>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Details</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-gray-500">
                    {job.jobType} • {job.location} •{" "}
                    {job?.salary
                      .replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, "$1,")
                      .split("-")
                      .map((part, index) => (
                        <span key={index}>
                          ₹{part.trim()}
                          {index === 0 ? " - " : ""}
                        </span>
                      ))}
                  </p>
                </TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>{job.postedDate}</TableCell>
                <TableCell>{job.numberOfApplications} applications</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      job.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {job.isActive ? "Active" : "Deactive"}
                  </span>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Eye
                    className="text-blue-500 cursor-pointer"
                    size={20}
                    onClick={() => navigate(`/admin/job/details/${job._id}`)}
                  />
                  {loading[job._id] ? (
                    "loading..."
                  ) : (
                    <Switch
                      checked={job.isActive}
                      onChange={(e) => {
                        toggleActive(job._id, !job.isActive, job.companyId);
                      }}
                      color="primary"
                      size="20"
                      inputProps={{
                        "aria-label": "Toggle Recruiter Active Status",
                      }}
                    />
                  )}

                  {dloading[job._id] ? (
                    "loading..."
                  ) : (
                    <Trash
                      className="text-red-500 cursor-pointer"
                      size={20}
                      onClick={() => deleteJob(job._id, job.companyId)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-end items-center mt-4 space-x-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Jobs;
