import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types"; 

const ProtectedChatRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const allowedRoles = ["student", "candidate", "recruiter"];
      
      if (!user) {
        navigate("/jobseeker-login", {
          state: { from: location.pathname },
          replace: true,
        });
      } else if (!allowedRoles.includes(user?.role)) {
        // Admin, digital marketer, etc. — not allowed
        navigate("/page/not/found");
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, navigate, location]);

  if (isChecking) return null;
  return <>{children}</>;
};

ProtectedChatRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedChatRoute;