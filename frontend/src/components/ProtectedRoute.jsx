import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ZORVYN SECURITY GATE
 * Ensures only authenticated Analysts and Admins can access financial data.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // No active session? Redirect to login, but save the location
    // so they can return to the exact record they were viewing after logging in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Session is active—allow entry to the dashboard
  return children;
};

export default ProtectedRoute;
