import React from "react";
import { Link, useParams } from "react-router-dom";
import { DEPARTMENTS } from "../utils/mockData";
import { ChevronDown } from "lucide-react";

export default function DepartmentDetail() {
  const { id } = useParams();
  const dep = DEPARTMENTS.find((d) => d.id === id);
  if (!dep)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">Department not found.</div>
    );

  // map known service ids to images in public/images
  const serviceImages = {
    "working-visa-extension": "/images/Working_Visa_Extension.jpg",
    "tourist-visa-extension": "/images/Tourist_Visa_Extension.jpg",
    "driving-license-renewal": "/images/Driving_License_Renewal.jpg",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">{dep.name}</h2>
      <p className="text-gray-600 max-w-3xl">{dep.description}</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {dep.services.map((s) => {
          const imgSrc = serviceImages[s.id] || "/images/Meet_Guidey.png"; // fallback image
          return (
            <Link
              key={s.id}
              to={`/service/${s.id}`}
              className="bg-white border rounded-3xl hover:shadow-md overflow-hidden block"
            >
              {/* image on top */}
              <img
                src={imgSrc}
                alt={s.name}
                className="w-full h-40 md:h-44 object-cover"
              />

              <div className="p-4">
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-600 mt-1">{s.short}</div>
                <div className="mt-3 text-green-700 text-sm inline-flex items-center gap-1">
                  Open <ChevronDown className="rotate-[-90deg] w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
