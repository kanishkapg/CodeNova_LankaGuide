import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Globe,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { DEPARTMENTS } from "../utils/mockData";
import { useApp } from "../utils/appContext";

const NotificationsBell = ({ isAdmin }) => {
  const {
    notifications,
    setNotifications,
    adminNotifications,
    setAdminNotifications,
  } = useApp();
  const [open, setOpen] = useState(false);
  const items = isAdmin ? adminNotifications : notifications;
  const setItems = isAdmin ? setAdminNotifications : setNotifications;
  const unread = items.filter((n) => !n.read).length;
  const markAll = () => setItems((ns) => ns.map((n) => ({ ...n, read: true })));
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full hover:bg-gray-100 relative"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded">
            {unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute right-0 mt-2 w-80 bg-white border rounded-2xl shadow-xl p-2 z-20"
          >
            <div className="px-2 py-1 flex items-center justify-between">
              <div className="font-medium">Notifications</div>
              <button onClick={markAll} className="text-xs underline">
                Mark all read
              </button>
            </div>
            <div className="max-h-64 overflow-auto space-y-1">
              {items.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No notifications yet.
                </div>
              ) : (
                items.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-xl hover:bg-gray-50 text-sm flex gap-2"
                  >
                    <span>•</span>
                    <span>{n.msg}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileMenu = () => {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <User className="w-5 h-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute right-0 mt-2 w-60 bg-white border rounded-2xl shadow-xl p-2 z-20"
          >
            {user ? (
              <>
                <div className="px-3 py-2 text-sm">
                  Signed in as{" "}
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="border-t my-1" />
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    nav("/");
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    nav("/login");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  <LogIn className="w-4 h-4" /> Sign in
                </button>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  <User className="w-4 h-4" /> Create account
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const [depOpen, setDepOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img
            src="/images/Lanka_Guide_Logo.png"
            alt="Lanka Guide Logo"
            className="w-9 h-9 rounded-md object-cover"
          />
          <span>LankaGuide</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {isAdmin ? (
            <>
              <Link to="/admin" className="hover:opacity-70">
                Dashboard
              </Link>
              <Link to="/admin/analytics" className="hover:opacity-70">
                Analytics
              </Link>
              <Link to="/admin/feedbacks" className="hover:opacity-70">
                Feedbacks
              </Link>
            </>
          ) : (
            <>
              <div className="relative">
                <button
                  onClick={() => setDepOpen((v) => !v)}
                  className="inline-flex items-center gap-1"
                >
                  Departments <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {depOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute mt-2 w-[28rem] bg-white border rounded-2xl shadow-xl p-3 grid grid-cols-1 z-20"
                    >
                      {DEPARTMENTS.map((d) => (
                        <Link
                          key={d.id}
                          to={`/departments/${d.id}`}
                          onClick={() => setDepOpen(false)}
                          className="px-3 py-2 rounded-xl hover:bg-gray-50"
                        >
                          <div className="font-medium">{d.name}</div>
                          <div className="text-sm text-gray-500">
                            {d.description}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact Us removed on admin pages per request */}
              <Link to="/contact" className="hover:opacity-70">
                Contact Us
              </Link>
              <Link to="/payments" className="hover:opacity-70">
                Payments
              </Link>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <NotificationsBell isAdmin={isAdmin} />
          <ProfileMenu />
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 ml-1"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4">
              {isAdmin ? (
                <div className="space-y-2">
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/admin"
                    className="block px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/admin/analytics"
                    className="block px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Analytics
                  </Link>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/admin/feedbacks"
                    className="block px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Feedbacks
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="font-medium">Departments</div>
                  <div className="space-y-1 mt-1">
                    {DEPARTMENTS.map((d) => (
                      <Link
                        key={d.id}
                        onClick={() => setMobileOpen(false)}
                        to={`/departments/${d.id}`}
                        className="block px-3 py-2 rounded hover:bg-gray-50"
                      >
                        {d.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/contact"
                    className="block px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Contact Us
                  </Link>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/payments"
                    className="block px-3 py-2 rounded hover:bg-gray-50"
                  >
                    Payments
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
