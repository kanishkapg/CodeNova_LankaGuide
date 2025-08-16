import React, { useMemo, useEffect, useState } from "react";
import { useApp } from "../../utils/appContext";
import * as api from "../../utils/api";

const Histogram = ({ buckets, labels = [], width = 360, height = 120 }) => {
  const max = Math.max(1, ...buckets);
  const barW = width / buckets.length;
  return (
    <svg width={width} height={height} className="block">
      {buckets.map((v, i) => {
        const h = (v / max) * (height - 24);
        return (
          <g key={i} transform={`translate(${i * barW}, ${height - h - 20})`}>
            <rect
              width={barW - 6}
              height={h}
              x={3}
              y={0}
              rx={4}
              fill="#2563EB"
            />
            <text
              x={barW / 2}
              y={h + 14}
              fontSize={10}
              textAnchor="middle"
              fill="#374151"
            >
              {labels[i] ?? i}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const HBar = ({ items = [], width = 360 }) => {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.key} className="text-sm">
          <div className="flex justify-between mb-1">
            <div className="text-gray-700">{it.key}</div>
            <div className="text-gray-500">{it.value}</div>
          </div>
          <div className="bg-gray-100 h-3 rounded-full">
            <div
              className="h-3 rounded-full bg-green-500"
              style={{ width: `${(it.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const { appointments } = useApp();
  const [serverAppointments, setServerAppointments] = useState(null);
  const [loading, setLoading] = useState(false);
  const mountedRef = React.useRef(true);
  const now = new Date();

  const loadAppts = React.useCallback(async () => {
    setLoading(true);
    try {
      const appts = await api.listAppointments();
      if (mountedRef.current) setServerAppointments(appts);
    } catch (err) {
      console.warn("Failed to fetch appointments for analytics:", err.message);
      if (mountedRef.current) setServerAppointments(appointments);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [appointments]);

  useEffect(() => {
    mountedRef.current = true;
    loadAppts();
    return () => {
      mountedRef.current = false;
    };
  }, [loadAppts]);

  const peakHours = useMemo(() => {
  const data = serverAppointments || appointments || [];
  const buckets = Array.from({ length: 24 }).map(() => 0);
  data.forEach((a) => {
      const d = new Date(a.datetime);
      if (isNaN(d)) return;
      buckets[d.getHours()]++;
    });
    return buckets;
  }, [appointments]);

  const deptLoad = useMemo(() => {
    // group by appointment title (proxy for department/service)
  const map = new Map();
  (serverAppointments || appointments || []).forEach((a) => {
      const key = a.title || "Unknown";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([key, value]) => ({ key, value }))
      .sort((x, y) => y.value - x.value);
  }, [appointments]);

  const noShowRate = useMemo(() => {
    // define no-show: appointment datetime in past and status is still 'submitted' or 'accepted'
  const past = (serverAppointments || appointments || []).filter((a) => new Date(a.datetime) < now);
    if (past.length === 0) return { rate: 0, total: 0, noShows: 0 };
    const noShows = past.filter((a) => {
      const s = (a.status || "").toLowerCase();
      return s === "submitted" || s === "accepted";
    }).length;
    return {
      rate: Math.round((noShows / past.length) * 100),
      total: past.length,
      noShows,
    };
  }, [appointments, now]);

  // Average processing time cannot be computed reliably without status timestamps.
  // We'll show N/A and include a note with suggested improvement.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Analytics</div>
        <div>
          <button
            onClick={loadAppts}
            className="px-3 py-1 rounded-xl bg-blue-600 text-white text-sm"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-4 shadow-sm">
          <div className="font-semibold mb-3">Peak booking hours</div>
          <div className="text-sm text-gray-500 mb-3">
            Bookings by hour of day (local)
          </div>
          <Histogram
            buckets={peakHours}
            labels={Array.from({ length: 24 }).map((_, i) => String(i))}
          />
        </div>

        <div className="bg-white border rounded-3xl p-4 shadow-sm lg:col-span-1">
          <div className="font-semibold mb-3">Departmental load</div>
          <div className="text-sm text-gray-500 mb-3">
            Appointments per service/department
          </div>
          <HBar items={deptLoad.slice(0, 6)} />
        </div>

        <div className="bg-white border rounded-3xl p-4 shadow-sm">
          <div className="font-semibold mb-3">No-show rate</div>
          <div className="text-sm text-gray-500 mb-4">
            Past appointments where status still pending
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-gray-700">
              {noShowRate.rate}%
            </div>
            <div className="text-sm text-gray-500">
              {noShowRate.noShows} of {noShowRate.total} past appts
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-3xl p-4 shadow-sm">
        <div className="font-semibold mb-3">Average processing times</div>
        <div className="text-sm text-gray-500">
          Not available — this demo does not store timestamps for status
          changes. To compute average processing times (submission → acceptance
          → completion) we need to record timestamps when the admin accepts and
          when the appointment is completed. Suggested next steps: add status
          history with timestamps when updating appointments.
        </div>
      </div>
    </div>
  );
}
