import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRecruiterRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  const isAllowed = !!user && user.role === "recruiter";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
      } else if (!isAllowed) {
        navigate("/", { replace: true });
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [user, isAllowed, navigate, location]);

  if (isChecking || !isAllowed) return null;

  return <>{children}</>;
};

ProtectedRecruiterRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRecruiterRoute;