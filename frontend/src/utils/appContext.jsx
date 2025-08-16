import React from "react";
import { useLocalStore } from "./helpers";
import * as api from "./api";
import Toaster from "../components/Toaster";

export const AppContext = React.createContext(null);
export const useApp = () => React.useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUserRaw] = useLocalStore("lg_user", null);
  const setUser = (u, token) => {
    // store token if provided, clear if null
    try {
      if (token) localStorage.setItem("lg_token", token);
      if (u === null) localStorage.removeItem("lg_token");
    } catch {}
    setUserRaw(u);
  };

  const [toasts, setToasts] = React.useState([]);
  const addToast = (msg, timeout = 3000) => {
    const id = crypto.randomUUID();
    setToasts((t) => [{ id, msg }, ...t]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), timeout);
  };

  const logout = () => {
    setUser(null);
    addToast("Logged out");
  };

  const isAdmin = !!(user && user.role === "admin");
  const [appointments, setAppointments] = useLocalStore("lg_appointments", []);
  const [notifications, setNotifications] = useLocalStore(
    "lg_notifications",
    []
  );
  const [adminNotifications, setAdminNotifications] = useLocalStore(
    "lg_admin_notifications",
    []
  );

  // when user changes, try to sync from backend
  React.useEffect(() => {
    let mounted = true;
    async function sync() {
      if (!user) return;
      try {
        // Admins should see all appointments (no userId filter).
        // Regular users only get their own appointments.
        const isAdminUser = user && user.role === "admin";
        const apptPromise = isAdminUser
          ? api.listAppointments()
          : api.listAppointments(user._id || user.id);
        const notifTarget = isAdminUser ? "admin" : "user";

        const [appts, notifs] = await Promise.all([
          apptPromise,
          api.listNotifications(notifTarget),
        ]);
        if (!mounted) return;
        setAppointments(appts);
        // put notifications into the appropriate store
        if (isAdminUser) setAdminNotifications(notifs);
        else setNotifications(notifs);
      } catch (err) {
        // silent fallback to local storage if offline
        console.warn("Failed to sync with backend:", err.message);
      }
    }
    sync();
    return () => {
      mounted = false;
    };
  }, [user]);

  const addNotification = (msg) =>
    setNotifications((n) => [
      { id: crypto.randomUUID(), msg, ts: Date.now(), read: false },
      ...n,
    ]);
  const addAdminNotification = (msg) =>
    setAdminNotifications((n) => [
      { id: crypto.randomUUID(), msg, ts: Date.now(), read: false },
      ...n,
    ]);
  const addAppointment = async (appt) => {
    // allow attaching a form snapshot to the appointment for detail view
    const withMeta = { ...appt, meta: appt.meta || null };
    // optimistic local add with a temporary id so UI updates immediately
    const tempId = crypto.randomUUID();
    const temp = { ...withMeta, id: tempId };
    setAppointments((a) => [...a, temp]);
    addNotification(
      `Appointment booked for ${new Date(appt.datetime).toLocaleString()}`
    );
    // notify admin of new submission
    addAdminNotification(
      `New appointment submitted for ${new Date(
        appt.datetime
      ).toLocaleString()}`
    );

    // try to persist to server; if it succeeds, replace the temp entry with server result
    try {
      const created = await api.createAppointment(withMeta);
      setAppointments((a) => a.map((x) => (x.id === tempId ? created : x)));
    } catch (err) {
      // keep optimistic entry when offline; server will be retried on next sync
      console.warn("Failed to persist appointment to server:", err.message);
    }
  };

  const updateAppointment = (id, changes) => {
    // optimistic local update
    setAppointments((a) =>
      a.map((x) => (x.id === id || x._id === id ? { ...x, ...changes } : x))
    );
    // try syncing to server if appointment looks persisted
    (async () => {
      try {
        const appt = appointments.find((x) => x.id === id || x._id === id);
        const serverId = (appt && (appt._id || appt.id)) || id;
        if (serverId && serverId.length > 8) {
          const updated = await api.updateAppointment(serverId, changes);
          // replace local with server result (to capture confirmation, timestamps, etc.)
          setAppointments((a) =>
            a.map((x) =>
              x.id === id || x._id === id || x._id === updated._id ? updated : x
            )
          );
        }
      } catch (err) {
        // ignore / keep optimistic state
        console.warn("Failed to sync appointment update:", err.message);
      }
    })();
  };

  // add or update feedback for an appointment
  const addFeedback = (id, feedback) => {
    setAppointments((a) =>
      a.map((x) => (x.id === id ? { ...x, feedback } : x))
    );
    // try to persist feedback on server
    try {
      const appt = appointments.find((x) => x.id === id || x._id === id);
      if (appt && (appt._id || appt.id)) {
        const serverId = appt._id || appt.id;
        import("./api")
          .then((m) => m.updateAppointment(serverId, { feedback }))
          .catch(() => {});
      }
    } catch {}
    addNotification(`Thanks for your feedback`);
    addAdminNotification(`New feedback submitted for appointment ${id}`);
  };

  const value = {
    user,
    setUser,
    logout,
    addToast,
    isAdmin,
    appointments,
    setAppointments,
    notifications,
    setNotifications,
    adminNotifications,
    setAdminNotifications,
    addNotification,
    addAppointment,
    updateAppointment,
    addFeedback,
    addAdminNotification,
  };
  return (
    <AppContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} />
    </AppContext.Provider>
  );
};
