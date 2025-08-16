import React from "react";
import { useApp } from "../../utils/appContext";
import AppointmentCard from "../../components/AppointmentCard";
import { AdminCalendar } from "../../components/Calendar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { appointments, updateAppointment } = useApp();
  const submitted = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "submitted"
  );
  const accepted = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "accepted"
  );
  const nav = useNavigate();

  const accept = (id) => {
    // kept for compatibility but admin should review instead of direct accept
    // prefer server-side id when available
    const serverId =
      (appointments.find((a) => a.id === id || a._id === id) || {})._id || id;
    updateAppointment(serverId, { status: "Accepted" });
  };

  const onDayClick = (dateStr) => {
    // navigate to day view: /admin/day/2025-08-16
    nav(`/admin/day/${dateStr}`);
  };

  const Card = ({ title, children }) => (
    <div className="bg-white border rounded-3xl p-4 shadow-sm">
      <div className="font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
  const Empty = ({ text }) => (
    <div className="p-6 text-center text-gray-500 text-sm">{text}</div>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Submitted Appointments">
          {submitted.length === 0 ? (
            <Empty text="No newly submitted appointments" />
          ) : (
            <div className="space-y-3">
              {submitted.map((a) => (
                <div key={a._id || a.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <AppointmentCard appt={a} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        nav(`/appointments/${a._id || a.id}?admin=1`)
                      }
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Accepted Appointments">
          {accepted.length === 0 ? (
            <Empty text="No accepted appointments" />
          ) : (
            <div className="space-y-3">
              {accepted.map((a) => (
                <div key={a._id || a.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <AppointmentCard appt={a} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        nav(`/appointments/${a._id || a.id}?admin=1`)
                      }
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <div>
        <Card title="Calendar">
          <AdminCalendar appointments={appointments} onDayClick={onDayClick} />
        </Card>
      </div>
    </div>
  );
}
