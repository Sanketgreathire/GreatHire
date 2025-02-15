import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRecruiterRoute = ({ children }) => {
  // Access the user from your Redux store (adjust the state path as needed)
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user exists and if the role is "recruiter"
    if (!user || user.role !== "recruiter") {
      // Optionally, you can redirect to a login page or an "Unauthorized" page
      return <Navigate to="/page/not/found" replace />;
    }
  }, [user]);

  // If the user is authorized, render the children components (the protected route)
  return children;
};

export default ProtectedRecruiterRoute;
