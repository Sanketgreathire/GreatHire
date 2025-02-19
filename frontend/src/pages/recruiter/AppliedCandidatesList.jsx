import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiSearch, FiEye } from "react-icons/fi";
import { APPLICATION_API_END_POINT } from "@/utils/ApiEndPoint";
import axios from "axios";
import ApplicantDetails from "./ApplicantDetails";
import Navbar from "@/components/admin/Navbar";
import { useSelector } from "react-redux";


const statusOptions = ["All", "Pending", "Shortlisted", "Rejected"];

const statusStyles = {
  Pending: "bg-yellow-200 text-yellow-700 hover:bg-yellow-100",
  Shortlisted: "bg-green-200 text-green-700 hover:bg-green-100",
  Rejected: "bg-red-200 text-red-700 hover:bg-red-100",
};

const AppliedCandidatesList = () => {
  const [applicants, setApplicants] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const jobId = useParams().id;
  const [applicantDetailsModal, setApplicantDetailsModal] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [applicantId, setApplicantId] = useState(null);

  const isValidHttpUrl = (string) => {
    try {
      let url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const response = await axios.get(
        `${APPLICATION_API_END_POINT}/${jobId}/applicants`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setApplicants(response.data.applicants);
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  useEffect(() => {
    if (jobId && !applicantDetailsModal) {
      fetchApplicants(jobId);
    }
  }, [jobId]);

  const filteredApplicants = applicants?.filter((data) => {
    const matchesSearch = data?.applicant?.fullname
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || data.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {user?.role !== "recruiter" && <Navbar linkName={"Applicants List"} />}
      <div
        className={`${
          user?.role !== "recruiter" ? "bg-white m-4" : ""
        } p-5 h-screen`}
      >
        {!applicantDetailsModal ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center underline">
              Applied Candidates List
            </h1>

            <div className="flex flex-wrap justify-between mb-4 gap-4">
              <div className="relative w-full md:w-1/3">
                <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name"
                  className="pl-10 p-2 border border-gray-300 rounded-md w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="p-2 border border-gray-300 rounded-md w-full md:w-1/6"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <Table className="w-full border-collapse border border-gray-300">
              <TableHeader className="bg-gray-300 text-center">
                <TableRow>
                  <TableHead className="text-center">Sr No.</TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Resume</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {filteredApplicants.length > 0 ? (
                  filteredApplicants.map((data, index) => (
                    <TableRow
                      key={data._id}
                      className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                      onClick={() => {
                        setApplicant(data);
                        setApplicantId(data._id);
                        setApplicantDetailsModal(true);
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.applicant.fullname}</TableCell>
                      <TableCell>{data.applicant.emailId.email}</TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          {isValidHttpUrl(data.applicant.profile.resume) ? (
                            <a
                              href={data.applicant.profile.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                              title="View Resume"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <FiEye size={20} />
                            </a>
                          ) : (
                            <span className="text-red-500">Invalid URL</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`px-3 py-1 rounded-md text-sm text-center ${
                            statusStyles[data.status]
                          }`}
                        >
                          {data.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="6"
                      className="text-center text-gray-500 py-4"
                    >
                      No applicants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        ) : (
          <ApplicantDetails
            app={applicant}
            applicantId={applicantId}
            jobId={jobId}
            setApplicantDetailsModal={setApplicantDetailsModal}
            user={user}
            setApplicants={setApplicants}
          />
        )}
      </div>
    </>
  );
};

export default AppliedCandidatesList;
