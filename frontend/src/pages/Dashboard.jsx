import React, { useState } from "react";
import AppointmentCard from "../components/AppointmentCard";
import { MiniCalendar } from "../components/Calendar";
import { useApp } from "../utils/appContext";

export default function Dashboard() {
  const { user, appointments, addFeedback } = useApp();
  const upcoming = appointments.filter(
    (a) => new Date(a.datetime) > new Date()
  );
  const completed = appointments.filter(
    (a) => new Date(a.datetime) <= new Date()
  );
  const Card = ({ title, children }) => (
    <div className="bg-white border rounded-3xl p-4 shadow-sm">
      <div className="font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
  const Empty = ({ text }) => (
    <div className="p-6 text-center text-gray-500 text-sm">{text}</div>
  );

  // helper to present a single completed status label
  const CompletedStatus = ({ status }) => {
    const s = (status || "").toLowerCase();
    const isSuccess =
      s.includes("success") ||
      s === "success" ||
      s === "successfully completed";
    return (
      <span
        className={`text-sm px-2 py-1 rounded-full ${
          isSuccess ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}
      >
        {isSuccess ? "Successfully Completed" : "Unsuccessfully Completed"}
      </span>
    );
  };

  // Feedback form per appointment (keeps local form state)
  const FeedbackBox = ({ appt }) => {
    const [rating, setRating] = useState(appt.feedback?.rating || 5);
    const [comment, setComment] = useState(appt.feedback?.comment || "");
    const [saving, setSaving] = useState(false);

    const submit = async () => {
      if (saving) return;
      // simple validation: rating required
      if (!rating) return;
      setSaving(true);
      const fb = {
        rating: Number(rating),
        comment: comment?.trim() || "",
        ts: Date.now(),
        by: (user && (user.name || user.username)) || "User",
      };
      try {
        addFeedback(appt.id, fb);
      } finally {
        setSaving(false);
      }
    };

    if (appt.feedback) {
      return (
        <div className="mt-3 p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Your feedback</div>
            <div className="text-sm font-semibold">
              {appt.feedback.rating} / 5
            </div>
          </div>
          {appt.feedback.comment && (
            <div className="mt-2 text-sm text-gray-700">
              {appt.feedback.comment}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-400">
            Submitted {new Date(appt.feedback.ts).toLocaleString()} by{" "}
            {appt.feedback.by || "User"}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 p-3 border rounded-lg">
        <div className="text-sm font-medium mb-2">Rate this service</div>
        <div className="flex items-center gap-2">
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Okay</option>
            <option value={2}>2 - Poor</option>
            <option value={1}>1 - Very poor</option>
          </select>
          <button
            onClick={submit}
            disabled={saving}
            className="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        </div>
        <div className="mt-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional feedback comment"
            className="w-full border rounded p-2 text-sm"
            rows={3}
          ></textarea>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">
        Hello{user ? `, ${user.name || user.username}` : ""}! 👋
      </h2>
      <p className="text-gray-600">Here are your appointments.</p>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Upcoming appointments">
            {upcoming.length === 0 ? (
              <Empty text="No upcoming appointments" />
            ) : (
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <AppointmentCard key={a.id} appt={a} />
                ))}
              </div>
            )}
          </Card>
          <Card title="Completed appointments">
            {completed.length === 0 ? (
              <Empty text="No completed appointments" />
            ) : (
              <div className="space-y-3">
                {completed.map((a) => (
                  <div key={a.id} className="p-3 rounded-2xl border">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(a.datetime).toLocaleString()} ️ {a.location}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {(() => {
                            // resolve department and service names from mock data if available
                            try {
                              const {
                                DEPARTMENTS,
                              } = require("../utils/mockData");
                              const dep = DEPARTMENTS.find(
                                (d) => d.id === a.departmentId
                              );
                              const depName = dep
                                ? dep.name
                                : a.departmentId || "";
                              const svcName = dep
                                ? (dep.services || []).find(
                                    (s) => s.id === a.serviceId
                                  )?.name || a.serviceId
                                : a.serviceId || "";
                              return `${svcName}${
                                svcName && depName ? " • " : ""
                              }${depName}`;
                            } catch (e) {
                              return "";
                            }
                          })()}
                        </div>
                        <div className="mt-2">
                          <CompletedStatus status={a.status} />
                        </div>
                      </div>
                      <div>
                        {/* keep original compact status shown on the right if desired */}
                      </div>
                    </div>
                    <FeedbackBox appt={a} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        <div>
          <Card title="Calendar">
            <MiniCalendar appointments={appointments} />
          </Card>
        </div>
      </div>
    </div>
  );
}
