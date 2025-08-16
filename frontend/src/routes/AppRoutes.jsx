import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminRoute from "../components/AdminRoute";
import AuthRoute from "../components/AuthRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminFeedbacks from "../pages/admin/AdminFeedbacks";
import DayAppointments from "../pages/admin/DayAppointments";
import DepartmentsIndex from "../pages/Departments";
import DepartmentDetail from "../pages/DepartmentDetail";
import WorkingVisaExtension from "../pages/ServiceDetail";
import AppointmentDetail from "../pages/AppointmentDetail";
import PaymentsPage from "../pages/Payment";
import ProfilePage from "../pages/Profile";
import ContactPage from "../pages/Contact";

const NotFound = () => (
  <div className="max-w-3xl mx-auto px-4 py-16 text-center">
    <div className="text-6xl">😕</div>
    <div className="text-2xl font-bold mt-2">Page not found</div>
    <a href="/" className="mt-3 inline-block underline">
      Back to home
    </a>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="feedbacks" element={<AdminFeedbacks />} />
        <Route path="day/:date" element={<DayAppointments />} />
      </Route>
      <Route path="/departments" element={<DepartmentsIndex />} />
      <Route path="/departments/:id" element={<DepartmentDetail />} />
      <Route path="/appointments/:id" element={<AppointmentDetail />} />
      <Route
        path="/service/working-visa-extension"
        element={
          <AuthRoute>
            <WorkingVisaExtension />
          </AuthRoute>
        }
      />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
