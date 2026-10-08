import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const allowedRoles = ["student", "candidate", "recruiter"];

const ProtectedChatRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  const isAllowed = !!user && allowedRoles.includes(user.role);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate("/jobseeker-login", {
          state: { from: location.pathname },
          replace: true,
        });
      } else if (!isAllowed) {
        // Admin, digital marketer, etc. are not allowed in chat
        navigate("/", { replace: true });
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isAllowed, navigate, location]);

  if (isChecking || !isAllowed) return null;

  return <>{children}</>;
};

ProtectedChatRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedChatRoute;