import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "../api/session.js";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const session = getSession();

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
