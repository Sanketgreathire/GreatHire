import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireCompany = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  // Use live fetched company object as authoritative check
  const hasCompany = !!user?.isCompanyCreated || !!company;

  if (!hasCompany) {
    return <Navigate to="/recruiter/dashboard/create-company" replace />;
  }

  return <>{children}</>;
};

export default RequireCompany;
