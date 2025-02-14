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
import { Briefcase, UserCheck, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, MenuItem, Switch } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import Navbar from "@/components/admin/Navbar";
import { useSelector, useDispatch } from "react-redux";
import {
  ADMIN_COMPANY_DATA_API_END_POINT,
  RECRUITER_API_END_POINT,
  VERIFICATION_API_END_POINT,
} from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  fetchCompanyStats,
  fetchRecruiterStats,
  fetchJobStats,
  fetchApplicationStats,
} from "@/redux/admin/statsSlice";

const CompanyList = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const companyStats = useSelector((state) => state.stats.companyStatsData);
  const recruiterStats = useSelector((state) => state.stats.recruiterStatsData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyList, setCompanyList] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      title: "Total Companies",
      count: companyStats?.totalCompanies || 0,
      change: "+10%",
      icon: <HiOutlineBuildingOffice2 size={30} />,
      color: "text-indigo-500",
      bg: "bg-indigo-100",
    },
    {
      title: "Active Company",
      count: companyStats?.totalActiveCompanies || 0,
      change: "+10%",
      icon: <CheckCircle size={30} />,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Deactive Company",
      count: companyStats?.totalDeactiveCompanies || 0,
      change: "+5.2%",
      icon: <XCircle size={30} />,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0,
      change: "+8%",
      icon: <UserCheck size={30} />,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
  ];

  const toggleActive = async (email, adminEmail, companyId, isActive) => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, [companyId]: true }));
      const response = await axios.put(
        `${VERIFICATION_API_END_POINT}/send-verification-status`,
        {
          email,
          adminEmail,
          companyId,
          isActive,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the recruiterList state to reflect the new isActive value
        setCompanyList((prevList) =>
          prevList.map((company) =>
            company._id === companyId ? { ...company, isActive } : company
          )
        );
        dispatch(fetchCompanyStats());
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());

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
      setLoading((prevLoading) => ({ ...prevLoading, [companyId]: false }));
    }
  };

  const deleteCompany = async (userEmail, companyId) => {
    try {
      dsetLoading((prevLoading) => ({ ...prevLoading, [companyId]: true }));
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: { userEmail, companyId },
        withCredentials: true,
      });

      if (response.data.success) {
        // Update the recruiterList state by removing the deleted recruiter
        setCompanyList((prevList) =>
          prevList.filter((company) => company._id !== companyId)
        );
        dispatch(fetchCompanyStats());
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());
        dispatch(fetchApplicationStats());
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
      dsetLoading((prevLoading) => ({ ...prevLoading, [companyId]: false }));
    }
  };

  const fetchCompanyList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_COMPANY_DATA_API_END_POINT}/company-list`
      );
      if (response.data.success) {
        setCompanyList(response.data.companies);
      }
    } catch (err) {
      console.log(`error in recruiter fetching ${err}`);
    }
  };

  useEffect(() => {
    fetchCompanyList();
  }, []);

  const filteredCompanies = companyList?.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(search.toLowerCase()) ||
      company.email.toLowerCase().includes(search.toLowerCase()) ||
      company.phone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All" || company.isActive === status;

    return matchesSearch && matchesStatus;
  });

  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Navbar linkName={"Companies"} />
      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            placeholder="Search company by name, email, contact"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          {/* Status select */}
          <Select
            value={status}
            onChange={(e) => {
              const value = e.target.value;
              setStatus(value);
            }}
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
              <TableHead>Company Name</TableHead>
              <TableHead>Company Email</TableHead>
              <TableHead>Company Contact</TableHead>
              <TableHead>Admin Email</TableHead>
              <TableHead>Company Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow key={company._id}>
                <TableCell>{company.companyName}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>{company.adminEmail}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      company.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {company.isActive ? "Active" : "Deactive"}
                  </span>
                </TableCell>

                <TableCell className="flex items-center gap-3">
                  <Eye
                    className="text-blue-500 cursor-pointer"
                    size={20}
                    onClick={() =>
                      navigate(
                        `/admin/for-admin/company-details/${company._id}`
                      )
                    }
                  />
                  {/* Toggle for recruiter activeness */}
                  {loading[company._id] ? (
                    "loading..."
                  ) : (
                    <Switch
                      checked={company.isActive}
                      onChange={(e) =>
                        toggleActive(
                          company.email,
                          company.adminEmail,
                          company._id,
                          !company.isActive
                        )
                      }
                      color="primary"
                      size="20"
                      inputProps={{
                        "aria-label": "Toggle Recruiter Active Status",
                      }}
                    />
                  )}
                  {dloading[company._id] ? (
                    "loading..."
                  ) : (
                    <Trash
                      className="text-red-500 cursor-pointer"
                      size={20}
                      onClick={() =>
                        deleteCompany(user?.emailId.email, company._id)
                      }
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
            {Math.min((page - 1) * itemsPerPage + 1, filteredCompanies.length)}{" "}
            to {Math.min(page * itemsPerPage, filteredCompanies.length)} of{" "}
            {filteredCompanies.length} results
          </span>
          <div className="flex gap-2">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            {[...Array(Math.ceil(filteredCompanies.length / itemsPerPage))].map(
              (_, i) => (
                <Button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={page === i + 1 ? "bg-blue-700 text-white" : ""}
                >
                  {i + 1}
                </Button>
              )
            )}
            <Button
              disabled={
                page === Math.ceil(filteredCompanies.length / itemsPerPage)
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

export default CompanyList;
