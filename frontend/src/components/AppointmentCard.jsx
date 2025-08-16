import React from "react";
import { Calendar as CalIcon } from "lucide-react";
import { formatDate } from "../utils/helpers";
import { classNames } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../utils/mockData";

export default function AppointmentCard({ appt }) {
  const nav = useNavigate();

  // map statuses to color classes (simple demo mapping)
  const statusClass = () => {
    const s = (appt.status || "").toLowerCase();
    if (s.includes("submitted") || s.includes("booked")) {
      // outlined / neutral for newly booked
      return "bg-white border border-gray-200 text-gray-700";
    }
    if (s.includes("accepted") || s.includes("ready")) {
      return "bg-green-50 text-green-700";
    }
    if (s.includes("in progress")) {
      return "bg-yellow-50 text-yellow-700";
    }
    if (s.includes("success") || s.includes("completed")) {
      return "bg-green-50 text-green-700";
    }
    if (s.includes("fail") || s.includes("unsuccess")) {
      return "bg-red-50 text-red-700";
    }
    return "bg-gray-50 text-gray-700";
  };

  // resolve department/service names for display
  const dep = DEPARTMENTS.find((d) => d.id === appt.departmentId);
  const depName = dep ? dep.name : appt.departmentId || "";
  const svcName = dep
    ? (dep.services || []).find((s) => s.id === appt.serviceId)?.name ||
      appt.serviceId
    : appt.serviceId || "";

  return (
    <button
      onClick={() => nav(`/appointments/${appt._id || appt.id}`)}
      className="w-full text-left p-3 rounded-2xl bg-white border border-gray-100 flex items-center gap-3 hover:shadow-sm"
    >
      <div className="w-10 h-10 grid place-items-center rounded-full bg-gray-50">
        <CalIcon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1">
        {/* Service (strong) */}
        <div className="text-sm font-semibold text-gray-800">
          {appt.title || svcName}
        </div>
        {/* Department (medium) */}
        <div className="text-sm text-gray-600 mt-0.5">{depName}</div>
        {/* Date & time (small, muted) */}
        <div className="text-xs text-gray-500 mt-1">
          {formatDate(appt.datetime)}
        </div>
      </div>
      <div className="ml-2">
        <span
          className={classNames(
            "px-3 py-1 rounded-full font-medium text-xs inline-block",
            statusClass()
          )}
        >
          {appt.status}
        </span>
      </div>
    </button>
  );
}
