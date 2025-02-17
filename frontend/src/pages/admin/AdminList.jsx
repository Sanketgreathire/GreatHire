import React from "react";
import { FaTrash } from "react-icons/fa";
import Navbar from "@/components/admin/Navbar";

const AdminList = () => {
  // Sample admin data
  const admins = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "9876543210", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "8765432109", status: "Inactive" },
    { id: 3, name: "Alice Brown", email: "alice@example.com", phone: "7654321098", status: "Active" },
  ];

  // Calculate total, active, and inactive admins
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(admin => admin.status === "Active").length;
  const inactiveAdmins = admins.filter(admin => admin.status === "Inactive").length;

  return (
    <>
      <Navbar linkName="Admin List" />

      <div className="p-6">
        {/* Admin List Table */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Admin List</h2>
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
              {admins.map((admin) => (
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
        </div>
      </div>
    </>
  );
};

export default AdminList;
