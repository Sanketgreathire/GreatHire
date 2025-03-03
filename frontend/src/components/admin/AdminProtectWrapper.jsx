import React, { useEffect } from "react";
// Hook for programmatic navigation
import { useNavigate } from "react-router-dom"; 
// Hook to access Redux state
import { useSelector } from "react-redux"; 

// Component to protect admin routes and restrict access based on user roles
const AdminProtectWrapper = ({ children }) => {
  const navigate = useNavigate(); // Initialize navigation
  // Get the authenticated user from Redux store
  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    // Redirect to admin login page if user is not authenticated
    if (!user) navigate("/admin/login");
    else {
      // Redirect to "Page Not Found" if the user is not an Owner or Admin
      if (user?.role !== "Owner" && user?.role !== "admin") {
        navigate("/page/not/found");
      }
    }
  }, [user]); // Re-run effect when the user state changes

  return <>{children}</>; // Render the protected content if the user has access
};

export default AdminProtectWrapper;
