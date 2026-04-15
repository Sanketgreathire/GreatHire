// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRecruiterRoute = ({ children }) => {
  // Access the user from your Redux store (adjust the state path as needed)
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Delay to allow Redux persist to rehydrate
    const timer = setTimeout(() => {
      if (!user) {
        navigate("/login");
      } else if (user?.role !== "recruiter") {
        navigate("/page/not/found");
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Show nothing while checking
  if (isChecking) return null;

  // If the user is authorized, render the children components (the protected route)
  return <>{children}</>;
};

export default ProtectedRecruiterRoute;
