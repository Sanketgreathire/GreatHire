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
import { Briefcase, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, MenuItem, Switch } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import Navbar from "@/components/admin/Navbar";
import { useSelector } from "react-redux";
import {
  ADMIN_RECRUITER_DATA_API_END_POINT,
  RECRUITER_API_END_POINT,
} from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Recruiters = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { statsData } = useSelector((state) => state.stats);
  const navigate = useNavigate();
  const [recruiterList, setRecruiterList] = useState([]);

  const stats = [
    {
      title: "Total Recruiters",
      count: statsData.totalRecruiters,
      change: "+10%",
      icon: <FaRegUser size={30} />,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Posted Jobs",
      count: statsData.totalJobs,
      change: "+5.2%",
      icon: <Briefcase size={30} />,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Verified Recruiters",
      count: statsData.verifiedRecruiters,
      change: "+8%",
      icon: <UserCheck size={30} />,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
  ];

  const toggleActive = async (recruiterId, isActive) => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: true }));
      const response = await axios.put(
        `${RECRUITER_API_END_POINT}/toggle-active`,
        {
          recruiterId,
          isActive,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the recruiterList state to reflect the new isActive value
        setRecruiterList((prevList) =>
          prevList.map((recruiter) =>
            recruiter._id === recruiterId
              ? { ...recruiter, isActive }
              : recruiter
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling recruiter:", error);
      toast.error(
        "There was an error toggling the recruiter. Please try again later."
      );
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: false }));
    }
  };

  const deleteRecruiter = async (recruiterId, userEmail, companyId) => {
    try {
      dsetLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: true }));
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: { userEmail, companyId },
        withCredentials: true,
      });

      if (response.data.success) {
        // Update the recruiterList state by removing the deleted recruiter
        setRecruiterList((prevList) =>
          prevList.filter((recruiter) => recruiter._id !== recruiterId)
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting recruiter:", error);
      toast.error(
        "There was an error deleting the recruiter. Please try again later."
      );
    } finally {
      dsetLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: false }));
    }
  };

  const fetchRecruiterList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_RECRUITER_DATA_API_END_POINT}/recruiter-stats`
      );
      if (response.data.success) {
        console.log(response.data.recruiters);
        setRecruiterList(response.data.recruiters);
      }
    } catch (err) {
      console.log(`error in recruiter fetching ${err}`);
    }
  };

  useEffect(() => {
    fetchRecruiterList();
  }, []);

  const filteredRecruiters = recruiterList?.filter((recruiter) => {
    const matchesSearch =
      recruiter.fullname.toLowerCase().includes(search.toLowerCase()) ||
      recruiter.email.toLowerCase().includes(search.toLowerCase()) ||
      recruiter.phoneNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || recruiter.status === Number(status);

    return matchesSearch && matchesStatus;
  });

  const paginatedRecruiters = filteredRecruiters.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Navbar linkName={"Recruiters"} />
      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-4 flex items-center justify-between bg-white shadow rounded-xl"
          >
            <div>
              <h3 className="text-lg font-semibold mt-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-center">{stat.count}</p>
              {/* <span className="text-sm text-gray-500">{stat.change} from last month</span> */}
            </div>
            <div className={`p-2 rounded-full ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>
      <div className="m-4 p-4 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search recruiters by company, contact person"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          {/* Status select */}
          <Select
            value={status}
            onChange={(e) => {
              // If the selected value is "All", keep it as a string;
              // Otherwise, convert to a number.
              const value = e.target.value;
              setStatus(value === "All" ? "All" : Number(value));
            }}
            className="w-1/6 h-10"
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value={1}>Verified</MenuItem>
            <MenuItem value={0}>Pending</MenuItem>
            <MenuItem value={-1}>Rejected</MenuItem>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recruiter Name</TableHead>
              <TableHead>Recruiter Contact</TableHead>
              <TableHead>Recruiter Position</TableHead>
              <TableHead>Posted Jobs</TableHead>
              <TableHead>Recruiter Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecruiters.map((recruiter) => (
              <TableRow key={recruiter._id}>
                <TableCell>
                  {recruiter.fullname} <br />
                  {recruiter.email}
                </TableCell>
                <TableCell>{recruiter.phoneNumber}</TableCell>
                <TableCell>{recruiter.position}</TableCell>
                <TableCell>{recruiter.postedJobs}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      recruiter.isVerify === 1
                        ? "bg-green-200 text-green-800"
                        : recruiter.isVerify === 0
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {recruiter.isVerify === 1
                      ? "Verified"
                      : recruiter.isVerify === 0
                      ? "Pending"
                      : "Rejected"}
                  </span>
                </TableCell>

                <TableCell className="flex items-center gap-3">
                  <Eye
                    className="text-blue-500 cursor-pointer"
                    size={20}
                    onClick={() =>
                      navigate(`/admin/recruiter/details/${recruiter._id}`)
                    }
                  />
                  {dloading[recruiter._id] ? (
                    "loading..."
                  ) : (
                    <Trash
                      className="text-red-500 cursor-pointer"
                      size={20}
                      onClick={() =>
                        deleteRecruiter(
                          recruiter._id,
                          recruiter.email,
                          recruiter.companyId
                        )
                      }
                    />
                  )}

                  {/* Toggle for recruiter activeness */}
                  {loading[recruiter._id] ? (
                    "loading..."
                  ) : (
                    <Switch
                      checked={recruiter.isActive}
                      onChange={(e) =>
                        toggleActive(recruiter._id, !recruiter.isActive)
                      }
                      color="primary"
                      size="20"
                      inputProps={{
                        "aria-label": "Toggle Recruiter Active Status",
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <span>
            Showing{" "}
            {Math.min((page - 1) * itemsPerPage + 1, filteredRecruiters.length)}{" "}
            to {Math.min(page * itemsPerPage, filteredRecruiters.length)} of{" "}
            {filteredRecruiters.length} results
          </span>
          <div className="flex gap-2">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            {[
              ...Array(Math.ceil(filteredRecruiters.length / itemsPerPage)),
            ].map((_, i) => (
              <Button
                key={i}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? "bg-blue-700 text-white" : ""}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              disabled={
                page === Math.ceil(filteredRecruiters.length / itemsPerPage)
              }
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recruiters;
