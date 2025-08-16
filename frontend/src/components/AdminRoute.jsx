import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../utils/appContext";

export default function AdminRoute({ children }) {
  const { user, isAdmin } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
