import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../utils/appContext";
import { formatDate } from "../utils/helpers";

export default function AppointmentDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const {
    appointments,
    updateAppointment,
    addFeedback,
    addNotification,
    addAdminNotification,
  } = useApp();
  const location = useLocation();
  const isAdminView = new URLSearchParams(location.search).get("admin") === "1";
  const appt = appointments.find((a) => a.id === id || a._id === id) || null;

  // If appointment not found locally and this is an admin view, try fetching from server
  React.useEffect(() => {
    let mounted = true;
    async function fetchIfMissing() {
      if (appt || !isAdminView) return;
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:4000"
          }/api/appointments/${id}`
        );
        if (!mounted) return;
        if (!res.ok) return;
        const data = await res.json();
        // add to local appointments so UI can render and future updates use it
        // use the app context setter imported here to avoid circular import at module top
        const { useApp } = await import("../utils/appContext");
        try {
          const setter = useApp().setAppointments;
          if (setter) setter((a) => [...a, data]);
        } catch (e) {
          // fallback: no-op
        }
      } catch (err) {
        // ignore fetch errors
      }
    }
    fetchIfMissing();
    return () => {
      mounted = false;
    };
  }, [appt, id, isAdminView]);

  if (!appt)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-xl font-semibold">Appointment not found</div>
        <button
          className="mt-4 px-4 py-2 border rounded-xl"
          onClick={() => nav(isAdminView ? "/admin" : "/dashboard")}
        >
          Back to dashboard
        </button>
      </div>
    );

  const meta = appt.meta || {};

  const FileItem = ({ file, label }) => {
    if (!file) return null;
    const href = file.url || file.dataUrl || null; // demo: ServiceDetail only stores name/size
    return (
      <div className="flex items-center justify-between p-2 border rounded-lg">
        <div className="text-sm">
          <div className="font-medium">{label}</div>
          <div className="text-xs text-gray-500">
            {file.name}{" "}
            {file.size ? `• ${Math.round(file.size / 1024)} KB` : ""}
          </div>
        </div>
        {href ? (
          <a
            href={href}
            download={file.name}
            className="text-blue-600 underline text-sm"
          >
            Download
          </a>
        ) : (
          <div className="text-xs text-gray-500">
            Preview not available in demo
          </div>
        )}
      </div>
    );
  };

  const isUpcoming = new Date(appt.datetime) > new Date();

  const statuses = isUpcoming
    ? ["Submitted", "Accepted", "In Progress", "Ready"]
    : [
        "Submitted",
        "Accepted",
        "In Progress",
        "Ready",
        "Successfully Completed",
        "Unsuccessfully Completed",
      ];

  // only admins can change appointment status in this demo
  const canAdvance = (() => {
    const cur = (appt.status || "Submitted").toLowerCase();
    // no next step for final completed states
    if (cur.includes("success") || cur.includes("unsuccess")) return false;
    // if upcoming and already 'ready', don't allow advancing to completed
    if (isUpcoming && cur === "ready") return false;
    // only admin view may advance statuses
    return isAdminView === true;
  })();

  const onAdvance = () => {
    const cur = appt.status || "Submitted";
    let next = cur;
    if (cur.toLowerCase() === "submitted") next = "Accepted";
    else if (cur.toLowerCase() === "accepted") next = "In Progress";
    else if (cur.toLowerCase() === "in progress") next = "Ready";
    else if (cur.toLowerCase() === "ready") {
      // only allow marking completed when appointment is not upcoming
      if (!isUpcoming) next = "Successfully Completed";
      else next = cur;
    }

    // if completed states, don't advance
    if (next !== cur) {
      updateAppointment(appt._id || appt.id, { status: next });
      addNotification(
        `Appointment ${next} — ${appt.title} on ${new Date(
          appt.datetime
        ).toLocaleString()}`
      );
      if (
        isAdminView &&
        cur.toLowerCase() === "submitted" &&
        next.toLowerCase() === "accepted"
      ) {
        addAdminNotification(
          `Appointment accepted — ${appt.title} on ${new Date(
            appt.datetime
          ).toLocaleString()}`
        );
        // after admin accepts, send them back to admin dashboard
        setTimeout(() => nav("/admin"), 150);
      }
    }
  };

  const statusBadge = (s) => {
    const cls = s.toLowerCase().includes("completed")
      ? "bg-green-50 text-green-700"
      : s.toLowerCase().includes("unsuccess")
      ? "bg-red-50 text-red-700"
      : s.toLowerCase().includes("ready")
      ? "bg-teal-50 text-teal-700"
      : s.toLowerCase().includes("in progress")
      ? "bg-yellow-50 text-yellow-700"
      : s.toLowerCase().includes("accepted")
      ? "bg-green-50 text-green-700"
      : "bg-blue-50 text-blue-700";
    return <span className={`text-sm px-2 py-1 rounded-full ${cls}`}>{s}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">{appt.title}</div>
          <h2 className="text-2xl font-bold">Appointment details</h2>
          <div className="text-sm text-gray-500 mt-1">
            {formatDate(appt.datetime)} • {appt.location}
          </div>
        </div>
        <div>{statusBadge(appt.status || "Submitted")}</div>
      </div>

      {appt.confirmation && (
        <div className="mt-6 bg-white border rounded-2xl p-4">
          <div className="font-medium mb-2">Appointment confirmation</div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm text-gray-500">Reference</div>
              <div className="font-semibold text-lg">
                {appt.confirmation.ref}
              </div>
              <div className="text-xs text-gray-500">
                Generated on{" "}
                {new Date(appt.confirmation.generatedAt).toLocaleString()}
              </div>
            </div>
            <div>
              {appt.confirmation.qrDataUrl ? (
                <img
                  src={appt.confirmation.qrDataUrl}
                  alt="QR code"
                  className="w-40 h-40"
                />
              ) : (
                <div className="text-sm text-gray-500">QR not available</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white border rounded-2xl p-4">
          <div className="font-medium mb-2">Submitted information</div>
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <span className="text-gray-500">Full name: </span>
              <span className="font-medium">{meta.fullName || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Passport No: </span>
              <span className="font-medium">{meta.passportNo || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Nationality: </span>
              <span className="font-medium">{meta.nationality || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Email: </span>
              <span className="font-medium">{meta.email || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Phone: </span>
              <span className="font-medium">{meta.phone || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Period: </span>
              <span className="font-medium">{meta.period || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500">Appointment Slot: </span>
              <span className="font-medium">
                {meta.date ? `${meta.date} ${meta.time || ""}` : "-"}
              </span>
            </div>
            <div className="mt-3">
              <div className="font-medium mb-2">Documents</div>
              <div className="space-y-2">
                {meta.photo || meta.employerLetter ? (
                  <>
                    {meta.photo && (
                      <FileItem file={meta.photo} label="Passport photo" />
                    )}
                    {meta.employerLetter && (
                      <FileItem
                        file={meta.employerLetter}
                        label="Employer letter"
                      />
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-500">
                    No documents uploaded.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4">
          <div className="font-medium mb-2">Status timeline</div>
          <div className="space-y-2 text-sm text-gray-700">
            {statuses.map((s) => (
              <div
                key={s}
                className={`p-3 rounded-xl border ${
                  s === appt.status
                    ? "border-green-300 bg-green-50"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>{s}</div>
                  {s === appt.status && (
                    <div className="text-xs text-gray-500">current</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isAdminView && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => nav(isAdminView ? "/admin" : "/dashboard")}
                className="px-3 py-2 rounded-xl border"
              >
                Back
              </button>
              <button
                onClick={onAdvance}
                className="px-3 py-2 rounded-xl bg-green-600 text-white"
                disabled={!canAdvance}
                title={
                  !canAdvance
                    ? "Only an admin can update appointment status"
                    : ""
                }
              >
                {isAdminView &&
                (appt.status || "").toLowerCase() === "submitted"
                  ? "Accept"
                  : "Advance status"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback section - only show for completed appointments (successfully or unsuccessfully) */}
      {(appt.status || "").toLowerCase().includes("completed") && (
        <div className="mt-6 bg-white border rounded-2xl p-4">
          <div className="font-medium mb-2">Rate your experience</div>
          <FeedbackForm
            existing={appt.feedback}
            onSave={(fb) => {
              // fb: { rating: number, comment: string }
              addFeedback(appt._id || appt.id, {
                ...fb,
                ts: Date.now(),
                by: meta.fullName || "Anonymous",
              });
            }}
          />
        </div>
      )}
    </div>
  );
}

function FeedbackForm({ existing, onSave }) {
  const [rating, setRating] = React.useState(existing?.rating || 5);
  const [comment, setComment] = React.useState(existing?.comment || "");
  const [saving, setSaving] = React.useState(false);

  const submit = () => {
    setSaving(true);
    try {
      onSave({ rating, comment });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className={`px-3 py-1 rounded-full ${
              n <= rating ? "bg-yellow-400 text-white" : "bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}
        <div className="text-sm text-gray-500">{rating} / 5</div>
      </div>
      <textarea
        className="w-full border rounded-lg p-2 h-24"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your experience (optional)"
      />
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={saving}
          className="px-3 py-2 bg-blue-600 text-white rounded-xl"
        >
          {existing ? "Update feedback" : "Submit feedback"}
        </button>
      </div>
    </div>
  );
}
