import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../utils/appContext";

export default function AuthRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
