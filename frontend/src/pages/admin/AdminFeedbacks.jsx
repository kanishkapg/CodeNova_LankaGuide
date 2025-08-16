import React from "react";
import { useApp } from "../../utils/appContext";
import { formatDate } from "../../utils/helpers";

export default function AdminFeedbacks() {
  const { appointments } = useApp();

  const feedbacks = (appointments || [])
    .filter((a) => a.feedback)
    .map((a) => ({
      id: a.id,
      title: a.title,
      datetime: a.datetime,
      feedback: a.feedback,
    }))
    .sort((x, y) => (y.feedback.ts || 0) - (x.feedback.ts || 0));

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm">
      <div className="font-semibold mb-3">Feedbacks</div>
      {feedbacks.length === 0 ? (
        <div className="text-sm text-gray-500">No feedbacks yet.</div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <div key={f.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{f.title}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(f.datetime)}
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {f.feedback.rating} / 5
                </div>
              </div>
              {f.feedback.comment && (
                <div className="mt-2 text-sm text-gray-700">
                  {f.feedback.comment}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-400">
                By {f.feedback.by || "User"} • {formatDate(f.feedback.ts)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
