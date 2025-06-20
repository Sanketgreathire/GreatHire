// Import necessary modules and dependencies
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
  Trash,
  Eye,
  Briefcase,
  UserCheck,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, MenuItem, Switch } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import Navbar from "@/components/admin/Navbar";
import { useSelector, useDispatch } from "react-redux";
import {
  ADMIN_RECRUITER_DATA_API_END_POINT,
  RECRUITER_API_END_POINT,
} from "@/utils/ApiEndPoint";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchRecruiterStats, fetchJobStats } from "@/redux/admin/statsSlice";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import { Ban } from "lucide-react"; // Import Block Icon

const RecruitersList = () => {
  // State to manage the search input value
  const [search, setSearch] = useState("");

  const [toLowerCase, setToLowerCase] = useState(false);

  // State to manage loading status for various operations
  const [loading, setLoading] = useState({});
  const [dloading, dsetLoading] = useState({});

  // State to manage the selected recruiter status (e.g., Active, Inactive, All)
  const [status, setStatus] = useState("All");

  // State to manage pagination (current page number)
  const [page, setPage] = useState(1);

  // Number of items displayed per page
  const itemsPerPage = 20;

  // Hook for navigation within the application
  const navigate = useNavigate();

  // Hook to dispatch actions to the Redux store
  const dispatch = useDispatch();

  // State to control the visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State to store the list of recruiters
  const [recruiterList, setRecruiterList] = useState([]);

  // Retrieves recruiter statistics from the Redux store
  const recruiterStats = useSelector((state) => state.stats.recruiterStatsData);

  // Retrieves job statistics from the Redux store
  const jobStats = useSelector((state) => state.stats.jobStatsData);

  // Retrieves authenticated user details from the Redux store
  const { user } = useSelector((state) => state.auth);

  // State to store the recruiter selected for deletion or other operations
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  const [blocking, setBlocking] = useState({});  //for blocking recruiter

  //send message to the Recruiter
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedMessageRecruiter, setSelectedMessageRecruiter] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);



  const stats = [
    {
      title: "Total Recruiters",
      count: recruiterStats?.totalRecruiters || 0,
      change: "+10%",
      icon: <FaRegUser size={30} />,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },

    {
      title: "Active Recruiters",
      count: recruiterStats?.totalActiveRecruiters || 0,
      change: "+8%",
      icon: <UserCheck size={30} />,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      title: "Deactive Recruiter",
      count: recruiterStats?.totalDeactiveRecruiters || 0,
      change: "+5.2%",
      icon: <XCircle size={30} />,
      color: "text-red-500",
      bg: "bg-red-100",
    },
    {
      title: "Posted Jobs",
      count: jobStats?.totalJobs || 0,
      change: "+5.2%",
      icon: <Briefcase size={30} />,
      color: "text-green-500",
      bg: "bg-green-100",
    },
  ];

  const toggleActive = async (companyId, recruiterId, isActive, isAdmin) => {
    try {
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: true }));
      const response = await axios.put(
        `${RECRUITER_API_END_POINT}/toggle-active`,
        {
          recruiterId,
          companyId,
          isActive,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (isAdmin) {
          // If toggled by admin, update all recruiters in the list with matching companyId.
          setRecruiterList((prevList) =>
            prevList.map((recruiter) =>
              recruiter.companyId === companyId
                ? { ...recruiter, isActive }
                : recruiter
            )
          );
        } else {
          // For a non-admin toggle, update only the specific recruiter.
          setRecruiterList((prevList) =>
            prevList.map((recruiter) =>
              recruiter._id === recruiterId
                ? { ...recruiter, isActive }
                : recruiter
            )
          );
        }
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
      setLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: false }));
    }
  };

  const toggleBlock = async (recruiterId, companyId, isBlocked) => {
    try {
      setBlocking((prev) => ({ ...prev, [recruiterId]: true }));
  
      // ✅ Toggle isBlocked before sending to backend
      const updatedBlockStatus = !isBlocked;
      console.log(`${RECRUITER_API_END_POINT}/toggle-block`);
      console.log("📢 Sending request to toggle block:", { recruiterId, companyId, isBlocked: updatedBlockStatus });
      console.log(`${RECRUITER_API_END_POINT}/toggle-block`);
      const response = await axios.put(
        `${RECRUITER_API_END_POINT}/toggle-block`,
        { recruiterId, companyId, isBlocked: updatedBlockStatus }, // ✅ Using recruiterId instead of email
        { withCredentials: true }
      );
  
      if (response.data.success) {
        setRecruiterList((prevList) =>
          prevList.map((recruiter) =>
            recruiter._id === recruiterId
              ? { ...recruiter, isBlocked: updatedBlockStatus, isActive: !updatedBlockStatus } // ✅ Sync frontend state
              : recruiter
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error toggling recruiter block status:", error);
      toast.error("Error toggling recruiter block status. Try again later.");
    } finally {
      setBlocking((prev) => ({ ...prev, [recruiterId]: false }));
    }
  };

  const sendMessageToRecruiter = async () => {
    try {
      if (!messageText.trim()) {
        toast.error("Message cannot be empty");
        return;
      }

      setSendingMessage(true); // Start loading
      // Replace with your actual API
      const response = await axios.post(
        `${ADMIN_RECRUITER_DATA_API_END_POINT}/send-message`,
        {
          recruiterId: selectedMessageRecruiter._id,
          message: messageText,
        },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        toast.success("Message sent successfully");
        setShowMessageModal(false);
        setMessageText("");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Try again later.");
    } finally {
    setSendingMessage(false); // End loading
    }
  };
  
  

  const deleteRecruiter = async (
    recruiterId,
    userEmail,
    companyId,
    isAdmin
  ) => {
    try {
      dsetLoading((prevLoading) => ({ ...prevLoading, [recruiterId]: true }));
      const response = await axios.delete(`${RECRUITER_API_END_POINT}/delete`, {
        data: { userEmail, companyId },
        withCredentials: true,
      });

      if (response.data.success) {
        if (isAdmin) {
          // if deleted recruiter is admin of company then remove all recruiter of that company
          setRecruiterList((prevList) =>
            prevList.filter((recruiter) => recruiter.companyId !== companyId)
          );
        } else {
          // Update the recruiterList state by removing the deleted recruiter
          setRecruiterList((prevList) =>
            prevList.filter((recruiter) => recruiter._id !== recruiterId)
          );
        }
        dispatch(fetchRecruiterStats());
        dispatch(fetchJobStats());
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

  const onConfirmDelete = () => {
    setShowDeleteModal(false);
    deleteRecruiter(
      selectedRecruiter?._id,
      selectedRecruiter?.email,
      selectedRecruiter?.companyId,
      selectedRecruiter?.isAdmin
    );
  };

  const onCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const fetchRecruiterList = async () => {
    try {
      const response = await axios.get(
        `${ADMIN_RECRUITER_DATA_API_END_POINT}/getAllRecruiter-stats`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setRecruiterList(response.data.recruiters);
      }
    } catch (err) {
      console.log(`error in recruiter fetching ${err}`);
    }
  };

  useEffect(() => {
    if (user) fetchRecruiterList();
  }, [user]);

const filteredRecruiters = recruiterList?.filter((recruiter) => {
  const matchesSearch =
    (recruiter.fullname || "").toLowerCase().includes(search.toLowerCase()) ||
    (recruiter.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
    (recruiter.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (recruiter.phone || "").toLowerCase().includes(search.toLowerCase());

  const matchesStatus = status === "All" || recruiter.isActive === status;

  return matchesSearch && matchesStatus;
});

  const paginatedRecruiters = filteredRecruiters.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Navbar linkName={"Recruiters List"} />
      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-4 flex items-center justify-between bg-white shadow rounded-xl"
          >
            <div>
              <h3 className="text-lg font-semibold mt-2">{stat.title}</h3>
              <p className="text-2xl font-bold text-left">{stat.count}</p>
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
            placeholder="Search by name, email, contact, company "
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
              <TableHead className="whitespace-nowrap text-2xl text-blue-700 font-bold font-[Oswald]">Recruiter Name</TableHead>
              <TableHead className="whitespace-nowrap text-2xl text-blue-700 font-bold font-[Oswald]">Company Name</TableHead>
              <TableHead className="whitespace-nowrap text-2xl text-blue-700 font-bold font-[Oswald]">Recruiter Contact</TableHead>
              <TableHead className="whitespace-nowrap text-2xl text-blue-700 font-bold font-[Oswald]">Recruiter Position</TableHead>
              <TableHead className="whitespace-nowrap text-2xl text-blue-700 font-bold font-[Oswald]">Posted Jobs</TableHead>
              <TableHead className="whitespace-nowrap text-2xl text-blue-700 font-bold font-[Oswald]">Recruiter Status</TableHead>
              <TableHead className="whitespace-nowrap text-2xl text-blue-700 font-bold font-[Oswald]">Join Date</TableHead>
              <TableHead className="whitespace-nowrap text-2xl text-blue-700 font-bold font-[Oswald]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecruiters.map((recruiter) => (
              <TableRow key={recruiter._id}>
                <TableCell>
                  {recruiter.fullname + " "}{" "}
                  {recruiter.isAdmin && (
                    <span className="text-green-600 font-bold">Admin</span>
                  )}
                  <br />
                  {recruiter.email}
                </TableCell>
                <TableCell>{recruiter.companyName}</TableCell>
                <TableCell>{recruiter.phone}</TableCell>
                <TableCell>{recruiter.position}</TableCell>
                <TableCell>{recruiter.postedJobs}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      recruiter.isActive
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                      }`}
                      >
                    {recruiter.isActive ? "Active" : "Deactive"}
                  </span>
                </TableCell>

                  <TableCell>{recruiter.joined}</TableCell>

                  
                <TableCell className="flex items-center gap-3">
                  <Eye
                    className="text-blue-500 cursor-pointer"
                    size={20}
                    onClick={() =>
                      navigate(`/admin/recruiter/details/${recruiter._id}`)
                    }
                    />
                  {/* Toggle for recruiter activeness */}
                  {loading[recruiter._id] ? (
                    "loading..."
                  ) : (
                    <Switch
                    checked={recruiter.isActive}
                    onChange={(e) =>
                      toggleActive(
                        recruiter.companyId,
                        recruiter._id,
                        !recruiter.isActive,
                        recruiter.isAdmin
                      )
                    }
                    color="primary"
                    size="20"
                    inputProps={{
                      "aria-label": "Toggle Recruiter Active Status",
                    }}
                    />
                  )}
                  {blocking[recruiter._id] ? (
                    "loading..."
                  ) : (
                    <Ban
                      className={`cursor-pointer ${
                      recruiter.isBlocked ? "text-gray-500" : "text-orange-500"
                      }`}
                      size={20}
                      onClick={() => toggleBlock(recruiter._id,recruiter.companyId,recruiter.isBlocked)}
                    />
                  )}

                  {dloading[recruiter._id] ? (
                    "loading..."
                  ) : (
                    <Trash
                      className="text-red-500 cursor-pointer"
                      size={20}
                      onClick={() => {
                        setSelectedRecruiter(recruiter);
                        setShowDeleteModal(true);
                      }}
                    />
                  )}
                  <MessageSquare
                    className="text-blue-600 cursor-pointer"
                    size={20}
                    onClick={() => {
                      setSelectedMessageRecruiter(recruiter);
                      setShowMessageModal(true);
                    }}
                  />
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

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}

      {showMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Message to {selectedMessageRecruiter?.fullname}
            </h2>
            <textarea
              className="w-full border rounded-lg p-2 h-32 resize-none"
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
                Cancel
              </Button>
              {/* <Button onClick={sendMessageToRecruiter}>Send</Button> */}
              <Button onClick={sendMessageToRecruiter} disabled={sendingMessage}>
                {sendingMessage ? "Sending..." : "Send"}
              </Button>

            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default RecruitersList;
