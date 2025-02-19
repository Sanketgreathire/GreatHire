import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import Navbar from "@/components/admin/Navbar";
import { ADMIN_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// MUI Components
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  TextField,
} from "@mui/material";

const AdminList = () => {
  const { user } = useSelector((state) => state.auth);
  const [admins, setAdminList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const adminsPerPage = 10;

  const removeAdmin = async (userId) => {
    try {
      const response = await axios.get(
        `${ADMIN_API_END_POINT}/remove-admin/${userId}`,
        {
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (err) {
      console.error("Error fetching admin list:", err);
    }
  };

  const fetchAdminList = async () => {
    try {
      const response = await axios.get(`${ADMIN_API_END_POINT}/getAdmin-list`, {
        withCredentials: true,
      });
      if (response.data.success) {
        // Assuming the returned data key is "admins"
        setAdminList(response.data.admins);
      }
    } catch (err) {
      console.error("Error fetching admin list:", err);
    }
  };

  useEffect(() => {
    fetchAdminList();
  }, [user]);

  // Filter admins based on searchTerm (by name, email, or phone)
  const filteredAdmins = admins.filter((admin) => {
    const search = searchTerm.toLowerCase();
    const fullname = admin.fullname?.toLowerCase() || "";
    const email = admin.emailId?.email?.toLowerCase() || "";
    const phone = admin.phoneNumber?.number?.toString().toLowerCase() || "";
    return (
      fullname.includes(search) ||
      email.includes(search) ||
      phone.includes(search)
    );
  });

  const totalAdmins = filteredAdmins.length;
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Adjust current page if search filtering changes the total pages available
  useEffect(() => {
    if (currentPage > Math.ceil(totalAdmins / adminsPerPage)) {
      setCurrentPage(1);
    }
  }, [totalAdmins, currentPage]);

  return (
    <>
      <Navbar linkName="Admin List" />
      <Box p={3} className="bg-white m-4 p-4 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800 text-lg z-10"
        >
          <FiArrowLeft size={30} className="mr-2" />
        </button>
        <Typography variant="h4" align="center" gutterBottom>
          Admin List
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <TextField
            label="Search Admin"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone"
            className="w-72"
          />
          <p className="text-xl font-semibold">
            Total Admins: <span className="text-gray-500">{totalAdmins}</span>
          </p>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone No.</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAdmins.map((admin) => (
                <TableRow key={admin._id} hover>
                  <TableCell>{admin.fullname}</TableCell>
                  <TableCell>{admin.emailId?.email}</TableCell>
                  <TableCell>{admin.phoneNumber?.number}</TableCell>
                  <TableCell>
                    {user?.role === "Owner" ? (
                      <Button variant="text" color="error">
                        <FaTrash
                          size={16}
                          onClick={() => removeAdmin(admin?._id)}
                        />
                      </Button>
                    ) : (
                      "-------"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination Controls */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Button
            variant="contained"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Typography variant="body1">Page {currentPage}</Typography>
          <Button
            variant="contained"
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(totalAdmins / adminsPerPage) ||
              totalAdmins === 0
            }
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AdminList;
