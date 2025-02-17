import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRecruiterRoute = ({ children }) => {
  // Access the user from your Redux store (adjust the state path as needed)
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user exists and if the role is "recruiter"
    if (!user) navigate("/login");
    else {
      if (user?.role !== "recruiter") navigate("/page/not/found");
    }
  }, [user]);

  // If the user is authorized, render the children components (the protected route)
  return <>{children}</>;
};

export default ProtectedRecruiterRoute;
