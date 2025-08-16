import React from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../../utils/appContext";
import AppointmentCard from "../../components/AppointmentCard";

export default function DayAppointments() {
  const { date } = useParams(); // date in YYYY-MM-DD
  const { appointments } = useApp();
  const dayStart = new Date(date + "T00:00:00");
  const dayEnd = new Date(date + "T23:59:59");
  const list = appointments.filter((a) => {
    const d = new Date(a.datetime);
    return d >= dayStart && d <= dayEnd;
  });

  return (
    <div>
      <div className="font-semibold text-lg mb-3">Appointments for {date}</div>
      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No appointments on this day.
          </div>
        ) : (
          list.map((a) => <AppointmentCard key={a.id} appt={a} />)
        )}
      </div>
    </div>
  );
}
