import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../store/index.js";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const {
    state: { session },
  } = useStore();

  if (!session.user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
