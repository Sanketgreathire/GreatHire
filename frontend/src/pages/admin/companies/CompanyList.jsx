import  { useEffect, useState, useMemo } from "react";
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
import PropTypes from "prop-types";


const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </TableCell>

    <TableCell>
      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </TableCell>

    <TableCell>
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </TableCell>

    <TableCell>
      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </TableCell>

    <TableCell>
      <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </TableCell>

    <TableCell>
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-6 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    </TableCell>
  </TableRow>
);


const CompactPagination = ({ page, setPage, totalPages }) => {
  const pageNumbers = useMemo(() => {
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages]);

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Previous
      </Button>

      {pageNumbers[0] > 1 && (
        <>
          <Button
            size="sm"
            onClick={() => setPage(1)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            1
          </Button>
          {pageNumbers[0] > 2 && <span className="px-2 text-gray-500 dark:text-gray-400">…</span>}
        </>
      )}

      {pageNumbers.map((p) => (
        <Button
          key={p}
          size="sm"
          onClick={() => setPage(p)}
          className={page === p
            ? "bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }
        >
          {p}
        </Button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500 dark:text-gray-400">…</span>
          )}
          <Button
            size="sm"
            onClick={() => setPage(totalPages)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="ghost"
        disabled={page === totalPages || totalPages === 0}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
};

CompactPagination.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

const CompanyList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [, setDeletedCompanyList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  //const [deletedPage, setDeletedPage] = useState(1);
  const itemsPerPage = 20;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const companyStats = useSelector((state) => state.stats.companyStatsData);
  const recruiterStats = useSelector((state) => state.stats.recruiterStatsData);

  // Track dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Fetch company data
  // const fetchCompanyList = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${ADMIN_COMPANY_DATA_API_END_POINT}/company-list`,
  //       { withCredentials: true }
  //     );
  //     if (response.data.success) setCompanyList(response.data.companies);
  //   } catch (err) {
  //     console.log(`error in recruiter fetching ${err}`);
  //   }
  // };

  
const fetchCompanyList = async () => {
  setIsLoadingCompanies(true);

  try {
    const response = await axios.get(
      `${ADMIN_COMPANY_DATA_API_END_POINT}/company-list`,
      { withCredentials: true }
    );

    if (response.data.success) {
      setCompanyList(response.data.companies);
    }
  } catch (err) {
    console.log(`error in company fetching ${err}`);
  } finally {
    setIsLoadingCompanies(false);
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
    } catch {
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

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / itemsPerPage));

  const paginatedCompanies = filteredCompanies.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const stats = [
    {
      title: "Total Companies",
      count: companyStats?.totalCompanies || 0,
      icon: <Building2 className="text-indigo-600 dark:text-indigo-400" size={24} />,
    },
    {
      title: "Active Companies",
      count: companyStats?.totalActiveCompanies || 0,
      icon: <CheckCircle className="text-green-600 dark:text-green-400" size={24} />,
    },
    {
      title: "Deactive Companies",
      count: companyStats?.totalDeactiveCompanies || 0,
      icon: <XCircle className="text-red-600 dark:text-red-400" size={24} />,
    },
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0,
      icon: <UserCheck className="text-yellow-500 dark:text-yellow-400" size={24} />,
    },
  ];

  return (
    <>
      <Navbar linkName="Companies" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Stats Section */}
        <div className="px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-600 dark:text-gray-400 font-semibold text-sm">
                    {stat.title}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.count}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-full flex-shrink-0">
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Company Table */}
        <div className="mx-4 sm:mx-6 mb-10 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 gap-4">
            <Input
              placeholder="🔍 Search by name, email, or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-1/5 h-10"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? '#3b82f6' : '#2563eb',
                },
                '& .MuiSelect-select': {
                  color: isDarkMode ? '#f3f4f6' : '#111827',
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                },
                '& .MuiSvgIcon-root': {
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                },
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                borderRadius: '0.5rem',
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: isDarkMode ? '#374151' : '#ffffff',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        bgcolor: isDarkMode ? '#4b5563' : '#f3f4f6',
                      },
                      '&.Mui-selected': {
                        bgcolor: isDarkMode ? '#4b5563' : '#e5e7eb',
                        '&:hover': {
                          bgcolor: isDarkMode ? '#6b7280' : '#d1d5db',
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Deactive</MenuItem>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader className="bg-gray-100 dark:bg-gray-700/50">
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
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
                      className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              {/* <TableBody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company) => (
                    <TableRow
                      key={company._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                        {company.companyName}
                      </TableCell>

                      <TableCell className="break-all text-gray-700 dark:text-gray-300">
                        {company.email?.trim() || "N/A"}
                      </TableCell>

                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {company.phone?.toString().trim() || "N/A"}
                      </TableCell>

                      <TableCell className="break-all text-gray-700 dark:text-gray-300">
                        {company.adminEmail?.trim() || "N/A"}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${company.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }`}
                        >
                          {company.isActive ? "Active" : "Deactive"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Eye
                            className="text-blue-500 dark:text-blue-400 cursor-pointer hover:scale-110 transition"
                            size={20}
                            onClick={() =>
                              navigate(
                                `/admin/for-admin/company-details/${company._id}`
                              )
                            }
                          />

                          {loading[company._id] ? (
                            <span className="text-gray-400 dark:text-gray-500">...</span>
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
                            <span className="text-gray-400 dark:text-gray-500">...</span>
                          ) : (
                            <Trash
                              className="text-red-500 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300 transition"
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No companies found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody> */}

              
<TableBody>
  {isLoadingCompanies ? (
    Array.from({ length: 6 }).map((_, i) => (
      <SkeletonRow key={i} />
    ))
  ) : paginatedCompanies.length > 0 ? (
    paginatedCompanies.map((company) => (
      <TableRow
        key={company._id}
        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
      >
        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
          {company.companyName}
        </TableCell>

        <TableCell className="break-all text-gray-700 dark:text-gray-300">
          {company.email?.trim() || "N/A"}
        </TableCell>

        <TableCell className="text-gray-700 dark:text-gray-300">
          {company.phone?.toString().trim() || "N/A"}
        </TableCell>

        <TableCell className="break-all text-gray-700 dark:text-gray-300">
          {company.adminEmail?.trim() || "N/A"}
        </TableCell>

        <TableCell>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              company.isActive
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {company.isActive ? "Active" : "Deactive"}
          </span>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-3">
            <Eye
              className="text-blue-500 dark:text-blue-400 cursor-pointer hover:scale-110 transition"
              size={20}
              onClick={() =>
                navigate(
                  `/admin/for-admin/company-details/${company._id}`
                )
              }
            />

            {loading[company._id] ? (
              <span className="text-gray-400 dark:text-gray-500">
                ...
              </span>
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
              <span className="text-gray-400 dark:text-gray-500">
                ...
              </span>
            ) : (
              <Trash
                className="text-red-500 dark:text-red-400 cursor-pointer hover:text-red-700 dark:hover:text-red-300 transition"
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
    ))
  ) : (
    <TableRow>
      <TableCell
        colSpan={6}
        className="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        No companies found
      </TableCell>
    </TableRow>
  )}
</TableBody>
 
            </Table>
          </div>


          {/* Pagination */}
          <div className="flex justify-center items-center mt-4">
            <CompactPagination
              page={activePage}
              setPage={setActivePage}
              totalPages={totalPages}
            />
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