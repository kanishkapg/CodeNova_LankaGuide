import React from "react";
import { Link } from "react-router-dom";
import { DEPARTMENTS } from "../utils/mockData";

export default function DepartmentsIndex() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Departments</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {DEPARTMENTS.map((d) => (
          <Link
            key={d.id}
            to={`/departments/${d.id}`}
            className="bg-white border rounded-3xl p-4 hover:shadow-md"
          >
            <div className="font-semibold">{d.name}</div>
            <div className="text-sm text-gray-600 mt-1">{d.description}</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {d.services.slice(0, 3).map((s, idx) => {
                const src =
                  s.id === "working-visa-extension"
                    ? "/images/Working_Visa_Extension.jpg"
                    : s.id === "tourist-visa-extension"
                    ? "/images/Tourist_Visa_Extension.jpg"
                    : "/images/Hero Image.png"; // fallback to an existing image in public/images
                return (
                  <div
                    key={s.id}
                    className="bg-gray-50 rounded-xl overflow-hidden"
                  >
                    <img
                      src={src}
                      className="rounded-xl w-full h-36 object-cover"
                      alt={s.name}
                    />
                    <div className="p-2 text-xs font-medium">{s.name}</div>
                  </div>
                );
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
