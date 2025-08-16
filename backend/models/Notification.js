const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  msg: { type: String, required: true },
  ts: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  target: { type: String, enum: ["user", "admin", "all"], default: "all" },
});

module.exports = mongoose.model("Notification", NotificationSchema);
