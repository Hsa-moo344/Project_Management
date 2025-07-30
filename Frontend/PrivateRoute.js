import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const getUserRole = () => localStorage.getItem("role");
const isLoggedIn = () => Boolean(localStorage.getItem("token"));

const PrivateRoute = ({ children, requiredRole }) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = getUserRole();

  if (userRole === "admin") {
    return children;
  }

  if (requiredRole && userRole === requiredRole.toLowerCase()) {
    return children;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
