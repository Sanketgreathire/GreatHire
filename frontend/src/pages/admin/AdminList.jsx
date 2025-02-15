import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Navbar from "@/components/admin/Navbar";

const AdminList = () => {
  const admins = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "8765432109",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "7654321098",
      status: "Active",
    },
    {
      id: 4,
      name: "Michael Green",
      email: "michael@example.com",
      phone: "6543210987",
      status: "Active",
    },
    {
      id: 5,
      name: "Emily White",
      email: "emily@example.com",
      phone: "5432109876",
      status: "Inactive",
    },
    {
      id: 6,
      name: "Chris Blue",
      email: "chris@example.com",
      phone: "4321098765",
      status: "Active",
    },
    {
      id: 7,
      name: "Sarah Black",
      email: "sarah@example.com",
      phone: "3210987654",
      status: "Inactive",
    },
  ];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 10;

  // Calculate total, active, and inactive admins
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(
    (admin) => admin.status === "Active"
  ).length;
  const inactiveAdmins = admins.filter(
    (admin) => admin.status === "Inactive"
  ).length;

  // Get current admins for the page
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar linkName="Admin List" />

      <div className="p-6">
        {/* Admin List Table */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl text-center underline font-semibold mb-4">
            Admin List
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3">Name</th>
                <th className="border border-gray-300 p-3">Email</th>
                <th className="border border-gray-300 p-3">Phone No.</th>
                <th className="border border-gray-300 p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAdmins.map((admin) => (
                <tr key={admin.id} className="text-center hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{admin.name}</td>
                  <td className="border border-gray-300 p-3">{admin.email}</td>
                  <td className="border border-gray-300 p-3">{admin.phone}</td>
                  <td className="border border-gray-300 p-3">
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}

          <div className="flex justify-between items-center mt-4">
            {/* Previous Button (Left Corner) */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            {/* Current Page Index (Centered) */}
            <span className="text-lg font-semibold">{`Page ${currentPage}`}</span>

            {/* Next Button (Right Corner) */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalAdmins / adminsPerPage)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === Math.ceil(totalAdmins / adminsPerPage)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminList;
