import React from "react";

export default function Toaster({ toasts = [] }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-black text-white px-4 py-2 rounded shadow"
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
