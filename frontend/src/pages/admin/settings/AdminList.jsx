// Import necessary modules and dependencies
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
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

const AdminList = () => {
  // Retrieves the authenticated user details from the Redux store
  const { user } = useSelector((state) => state.auth);

  // State to store the list of admins
  const [admins, setAdminList] = useState([]);

  // State to store the search term for filtering admins
  const [searchTerm, setSearchTerm] = useState("");

  // State to manage the current page number for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Hook for navigation within the application
  const navigate = useNavigate();

  // Number of admins displayed per page
  const adminsPerPage = 10;

  // State to store the ID of the admin to be removed
  const [adminId, setAdminId] = useState(null);

  // State to control the visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to remove an admin by making an API call
  const removeAdmin = async (userId) => {
    try {
      const response = await axios.delete(
        `${ADMIN_API_END_POINT}/remove-admin/${userId}`,
        {
          withCredentials: true,
        }
      );

      // Display success message if admin removal is successful
      if (response?.data?.success) {
        setAdminList((prevList) =>
          prevList.filter((admin) => admin._id !== userId)
        );
        toast.success(response?.data?.message);
      }
    } catch (err) {
      // Logs error if the API call fails
      console.error("Error fetching admin list:", err);
    }
  };

  // Function to confirm admin deletion and trigger the removal process
  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    removeAdmin(adminId);
  };

  // Function to cancel admin deletion and close the modal
  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Function to admin list
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-4">
        <div className="bg-white dark:bg-gray-800 relative transition-colors rounded-lg shadow-lg p-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-lg z-10 transition-colors"
          >
            <FiArrowLeft size={30} className="mr-2" />
          </button>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            className="text-gray-900 dark:text-gray-100"
          >
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  '& fieldset': {
                    borderColor: 'rgb(209, 213, 219)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgb(156, 163, 175)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgb(59, 130, 246)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgb(107, 114, 128)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'rgb(17, 24, 39)',
                },
                '.dark &': {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgb(75, 85, 99)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgb(107, 114, 128)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgb(96, 165, 250)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgb(156, 163, 175)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'rgb(229, 231, 235)',
                  },
                },
              }}
            />
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Total Admins: <span className="text-gray-500 dark:text-gray-400">{totalAdmins}</span>
            </p>
          </Box>
          <TableContainer 
            component={Paper}
            elevation={0}
            sx={{
              backgroundColor: 'white',
              boxShadow: 'none',
              border: '1px solid rgb(229, 231, 235)',
              '.dark &': {
                backgroundColor: 'rgb(55, 65, 81)',
                border: '1px solid rgb(75, 85, 99)',
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow 
                  sx={{ 
                    backgroundColor: "#f5f5f5",
                    '.dark &': {
                      backgroundColor: 'rgb(31, 41, 55)',
                    },
                  }}
                >
                  <TableCell 
                    sx={{
                      color: 'rgb(17, 24, 39)',
                      '.dark &': {
                        color: 'rgb(229, 231, 235)',
                        borderColor: 'rgb(75, 85, 99)',
                      },
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell 
                    sx={{
                      color: 'rgb(17, 24, 39)',
                      '.dark &': {
                        color: 'rgb(229, 231, 235)',
                        borderColor: 'rgb(75, 85, 99)',
                      },
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell 
                    sx={{
                      color: 'rgb(17, 24, 39)',
                      '.dark &': {
                        color: 'rgb(229, 231, 235)',
                        borderColor: 'rgb(75, 85, 99)',
                      },
                    }}
                  >
                    Phone No.
                  </TableCell>
                  <TableCell 
                    sx={{
                      color: 'rgb(17, 24, 39)',
                      '.dark &': {
                        color: 'rgb(229, 231, 235)',
                        borderColor: 'rgb(75, 85, 99)',
                      },
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentAdmins.map((admin) => (
                  <TableRow 
                    key={admin._id} 
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      '.dark &:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <TableCell 
                      sx={{
                        color: 'rgb(17, 24, 39)',
                        '.dark &': {
                          color: 'rgb(209, 213, 219)',
                          borderColor: 'rgb(75, 85, 99)',
                        },
                      }}
                    >
                      {admin.fullname}
                    </TableCell>
                    <TableCell 
                      sx={{
                        color: 'rgb(17, 24, 39)',
                        '.dark &': {
                          color: 'rgb(209, 213, 219)',
                          borderColor: 'rgb(75, 85, 99)',
                        },
                      }}
                    >
                      {admin.emailId?.email}
                    </TableCell>
                    <TableCell 
                      sx={{
                        color: 'rgb(17, 24, 39)',
                        '.dark &': {
                          color: 'rgb(209, 213, 219)',
                          borderColor: 'rgb(75, 85, 99)',
                        },
                      }}
                    >
                      {admin.phoneNumber?.number}
                    </TableCell>
                    <TableCell
                      sx={{
                        '.dark &': {
                          borderColor: 'rgb(75, 85, 99)',
                        },
                      }}
                    >
                      {user?.role === "Owner" ? (
                        <Button variant="text" color="error">
                          <FaTrash
                            size={16}
                            onClick={() => {
                              setAdminId(admin?._id);
                              setShowDeleteModal(true);
                            }}
                          />
                        </Button>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">-------</span>
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
              sx={{
                backgroundColor: 'rgb(59, 130, 246)',
                '&:hover': {
                  backgroundColor: 'rgb(37, 99, 235)',
                },
                '&:disabled': {
                  backgroundColor: 'rgb(209, 213, 219)',
                  color: 'rgb(107, 114, 128)',
                },
                '.dark &': {
                  backgroundColor: 'rgb(37, 99, 235)',
                  '&:hover': {
                    backgroundColor: 'rgb(29, 78, 216)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgb(55, 65, 81)',
                    color: 'rgb(107, 114, 128)',
                  },
                },
              }}
            >
              Previous
            </Button>
            <Typography 
              variant="body1"
              className="text-gray-900 dark:text-gray-100"
            >
              Page {currentPage}
            </Typography>
            <Button
              variant="contained"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(totalAdmins / adminsPerPage) ||
                totalAdmins === 0
              }
              sx={{
                backgroundColor: 'rgb(59, 130, 246)',
                '&:hover': {
                  backgroundColor: 'rgb(37, 99, 235)',
                },
                '&:disabled': {
                  backgroundColor: 'rgb(209, 213, 219)',
                  color: 'rgb(107, 114, 128)',
                },
                '.dark &': {
                  backgroundColor: 'rgb(37, 99, 235)',
                  '&:hover': {
                    backgroundColor: 'rgb(29, 78, 216)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgb(55, 65, 81)',
                    color: 'rgb(107, 114, 128)',
                  },
                },
              }}
            >
              Next
            </Button>
          </Box>
        </div>
      </div>
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

export default AdminList;