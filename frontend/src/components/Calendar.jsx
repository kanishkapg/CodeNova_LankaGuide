import React, { useState } from "react";
import { classNames } from "../utils/helpers";

export function MiniCalendar({ appointments = [], onDayClick = () => {} }) {
  const [cur, setCur] = useState(new Date());
  const year = cur.getFullYear(),
    month = cur.getMonth();
  const start = new Date(year, month, 1);
  const startDay = start.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: startDay })
    .map(() => "")
    .concat(Array.from({ length: daysInMonth }).map((_, i) => i + 1));
  // build a set of day numbers that have appointments in this month
  const apptDays = new Set(
    appointments
      .map((a) => new Date(a.datetime))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate())
  );

  const goto = (d) => setCur(new Date(year, month + d, 1));
  const today = new Date();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => goto(-1)}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          ‹
        </button>
        <div className="font-medium">
          {cur.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          onClick={() => goto(1)}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-xs text-center text-gray-500">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {days.map((d, i) => {
          const isToday =
            d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasAppt = apptDays.has(d);
          return (
            <button
              key={i}
              onClick={() => {
                if (!d) return;
                const ds = `${year}-${String(month + 1).padStart(
                  2,
                  "0"
                )}-${String(d).padStart(2, "0")}`;
                onDayClick(ds);
              }}
              className={classNames(
                "aspect-square grid place-items-center text-sm rounded-xl",
                isToday
                  ? "bg-green-600 text-white"
                  : hasAppt
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-50"
              )}
            >
              {d || ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// AdminCalendar: shows a month grid, highlights days that have appointments
// props: appointments (array), onDayClick(dateString)
export function AdminCalendar({ appointments = [], onDayClick = () => {} }) {
  const [cur, setCur] = React.useState(new Date());
  const year = cur.getFullYear(),
    month = cur.getMonth();
  const start = new Date(year, month, 1);
  const startDay = start.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: startDay })
    .map(() => "")
    .concat(Array.from({ length: daysInMonth }).map((_, i) => i + 1));

  // build a set of day numbers that have appointments in this month
  const apptDays = new Set(
    appointments
      .map((a) => new Date(a.datetime))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate())
  );

  const goto = (d) => setCur(new Date(year, month + d, 1));
  const today = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => goto(-1)}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          ‹
        </button>
        <div className="font-medium">
          {cur.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button
          onClick={() => goto(1)}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-xs text-center text-gray-500">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {days.map((d, i) => {
          const isToday =
            d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasAppt = apptDays.has(d);
          return (
            <button
              key={i}
              onClick={() => {
                if (!d || !onDayClick) return;
                const ds = `${year}-${String(month + 1).padStart(
                  2,
                  "0"
                )}-${String(d).padStart(2, "0")}`;
                onDayClick(ds);
              }}
              className={classNames(
                "aspect-square grid place-items-center text-sm rounded-xl",
                isToday
                  ? "bg-green-600 text-white"
                  : hasAppt
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-50"
              )}
            >
              {d || ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
