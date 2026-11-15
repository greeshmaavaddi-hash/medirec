import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Wrap a page in this so logged-out visitors are sent to the login page.
export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}
