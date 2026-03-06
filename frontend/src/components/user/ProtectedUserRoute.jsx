// Import necessary modules and dependencies
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
  // Access the user from your Redux store (adjust the state path as needed)
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Delay to allow Redux persist to rehydrate
    const timer = setTimeout(() => {
      if (!user) {
        navigate("/login", { state: { from: location.pathname }, replace: true });
      } else if (user?.role !== "student") {
        navigate("/page/not/found");
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, navigate, location]);

  // Show nothing while checking
  if (isChecking) return null;

  // If the user is authorized, render the children components (the protected route)
  return <>{children}</>;
};

export default ProtectedUserRoute;