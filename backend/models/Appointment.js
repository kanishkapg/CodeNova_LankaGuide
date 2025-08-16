const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  // userId is optional now to allow anonymous appointment creation (stored server-side)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  departmentId: { type: String, required: true },
  serviceId: { type: String, required: true },
  datetime: { type: Date, required: true },
  // status is free-form string to match frontend states (Submitted, Accepted, ...)
  status: { type: String, default: "Submitted" },
  meta: { type: mongoose.Schema.Types.Mixed, default: null },
  feedback: { type: String, default: null },
  confirmation: {
    ref: { type: String },
    qrDataUrl: { type: String },
    generatedAt: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
