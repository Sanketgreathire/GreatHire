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
import {
  UserCheck,
  CheckCircle,
  XCircle,
  Trash,
  Eye,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, MenuItem, Switch } from "@mui/material";
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
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

const CompanyList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [deletedcompanyList, setDeletedCompanyList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [deletedPage, setDeletedPage] = useState(1);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const companyStats = useSelector((state) => state.stats.companyStatsData);
  const recruiterStats = useSelector((state) => state.stats.recruiterStatsData);

  // Fetch company data
  const fetchCompanyList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_COMPANY_DATA_API_END_POINT}/company-list`,
        { withCredentials: true }
      );
      if (response.data.success) setCompanyList(response.data.companies);
    } catch (err) {
      console.log(`error in recruiter fetching ${err}`);
    }
  };

  const fetchDeletedCompanyList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_COMPANY_DATA_API_END_POINT}/deleted-company-list`,
        { withCredentials: true }
      );
      if (response.data.success) setDeletedCompanyList(response.data.companies);
    } catch (err) {
      console.log(`error in recruiter fetching ${err}`);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCompanyList();
      fetchDeletedCompanyList();
    }
  }, [user]);

  // Toggle active
  const toggleActive = async (email, adminEmail, companyId, isActive) => {
    try {
      setLoading((prev) => ({ ...prev, [companyId]: true }));
      const response = await axios.put(
        `${VERIFICATION_API_END_POINT}/send-verification-status`,
        { email, adminEmail, companyId, isActive },
        { withCredentials: true }
      );
      if (response.data.success) {
        setCompanyList((prev) =>
          prev.map((c) =>
            c._id === companyId ? { ...c, isActive } : c
          )
        );
        dispatch(fetchCompanyStats());
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());
        toast.success(response.data.message);
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error("Error toggling recruiter status");
    } finally {
      setLoading((prev) => ({ ...prev, [companyId]: false }));
    }
  };

  // Delete company
  const deleteCompany = async (userEmail, companyId) => {
    try {
      dsetLoading((prev) => ({ ...prev, [companyId]: true }));
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: { userEmail, companyId },
        withCredentials: true,
      });
      if (response.data.success) {
        setCompanyList((prev) => prev.filter((c) => c._id !== companyId));
        dispatch(fetchCompanyStats());
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());
        dispatch(fetchApplicationStats());
        toast.success(response.data.message);
      } else toast.error(response.data.message);
    } catch {
      toast.error("Error deleting recruiter");
    } finally {
      dsetLoading((prev) => ({ ...prev, [companyId]: false }));
    }
  };

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    deleteCompany(user?.emailId?.email, companyId);
  };

  const filteredCompanies = companyList.filter((company) => {
    const name = company?.companyName?.toLowerCase() || "";
    const email = company?.email?.toLowerCase() || "";
    const phone = company?.phone?.toLowerCase() || "";
    const searchTerm = search?.toLowerCase() || "";
    const matchesSearch =
      name.includes(searchTerm) ||
      email.includes(searchTerm) ||
      phone.includes(searchTerm);
    const matchesStatus =
      status === "All" || company.isActive === status;
    return matchesSearch && matchesStatus;
  });

  const paginatedCompanies = filteredCompanies.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const stats = [
    {
      title: "Total Companies",
      count: companyStats?.totalCompanies || 0,
      icon: <Building2 className="text-indigo-600" size={28} />,
    },
    {
      title: "Active Companies",
      count: companyStats?.totalActiveCompanies || 0,
      icon: <CheckCircle className="text-green-600" size={28} />,
    },
    {
      title: "Deactive Companies",
      count: companyStats?.totalDeactiveCompanies || 0,
      icon: <XCircle className="text-red-600" size={28} />,
    },
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0,
      icon: <UserCheck className="text-yellow-500" size={28} />,
    },
  ];

  return (
  <>
    <Navbar linkName="Companies" />

    {/* Stats Section */}
    <div className="px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 font-semibold text-sm sm:text-base">
                {stat.title}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {stat.count}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full flex-shrink-0">
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Main Company Table */}
    <div className="mx-4 sm:mx-6 mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 gap-4">
        <Input
          placeholder="🔍 Search by name, email, or contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 rounded-lg border-gray-300"
        />

        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full md:w-1/5 h-10"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value={true}>Active</MenuItem>
          <MenuItem value={false}>Deactive</MenuItem>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              {[
                "Company Name",
                "Email",
                "Contact",
                "Admin Email",
                "Status",
                "Actions",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="font-semibold text-gray-700 text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedCompanies.map((company) => (
              <TableRow
                key={company._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium">
                  {company.companyName}
                </TableCell>

                <TableCell className="break-all">
                  {company.email}
                </TableCell>

                <TableCell>{company.phone}</TableCell>

                <TableCell className="break-all">
                  {company.adminEmail}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      company.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {company.isActive ? "Active" : "Deactive"}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Eye
                      className="text-blue-500 cursor-pointer hover:scale-110 transition"
                      size={20}
                      onClick={() =>
                        navigate(
                          `/admin/for-admin/company-details/${company._id}`
                        )
                      }
                    />

                    {loading[company._id] ? (
                      "..."
                    ) : (
                      <Switch
                        checked={company.isActive}
                        onChange={() =>
                          toggleActive(
                            company.email,
                            company.adminEmail,
                            company._id,
                            !company.isActive
                          )
                        }
                        color="primary"
                      />
                    )}

                    {dloading[company._id] ? (
                      "..."
                    ) : (
                      <Trash
                        className="text-red-500 cursor-pointer hover:text-red-700 transition"
                        size={20}
                        onClick={() => {
                          setCompanyId(company._id);
                          setShowDeleteModal(true);
                        }}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm text-gray-600">
        <span className="text-center sm:text-left">
          Showing{" "}
          {Math.min(
            (activePage - 1) * itemsPerPage + 1,
            filteredCompanies.length
          )}{" "}
          to{" "}
          {Math.min(
            activePage * itemsPerPage,
            filteredCompanies.length
          )}{" "}
          of {filteredCompanies.length} entries
        </span>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            disabled={activePage === 1}
            onClick={() => setActivePage(activePage - 1)}
            className="px-4"
          >
            Previous
          </Button>

          {[...Array(Math.ceil(filteredCompanies.length / itemsPerPage))].map(
            (_, i) => (
              <Button
                key={i}
                onClick={() => setActivePage(i + 1)}
                className={`px-4 ${
                  activePage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </Button>
            )
          )}

          <Button
            disabled={
              activePage ===
              Math.ceil(filteredCompanies.length / itemsPerPage)
            }
            onClick={() => setActivePage(activePage + 1)}
            className="px-4"
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    {showDeleteModal && (
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onConfirm={onConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    )}
  </>
);

};

export default CompanyList;
