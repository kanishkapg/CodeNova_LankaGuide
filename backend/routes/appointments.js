const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const auth = require("../middleware/auth");

// List appointments, optional query ?userId=
router.get("/", async (req, res) => {
  const { userId } = req.query;
  const filter = {};
  if (userId) filter.userId = userId;
  try {
    const appts = await Appointment.find(filter).sort({ datetime: 1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create appointment (allow anonymous submissions). If request is authenticated,
// prefer attaching req.user._id; otherwise accept optional userId in body.
router.post("/", async (req, res) => {
  try {
    const body = { ...req.body };

    // if auth middleware was used earlier in pipeline, attach that user id
    if (req.user && req.user._id) body.userId = req.user._id;

    // otherwise allow userId to come from body (optional)
    const a = await Appointment.create(body);
    res.status(201).json(a);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const a = await Appointment.findById(req.params.id);
    if (!a) return res.status(404).json({ error: "not found" });
    res.json(a);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    // fetch existing first to inspect previous status
    const existing = await Appointment.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "not found" });

    const updates = { ...req.body };

    // if status is being changed to Accepted (case-insensitive) and there is no confirmation yet,
    // generate a confirmation (reference + QR code) and attach it.
    const newStatus = (updates.status || "").toString().toLowerCase();
    const prevStatus = (existing.status || "").toString().toLowerCase();
    if (
      newStatus === "accepted" &&
      prevStatus !== "accepted" &&
      !existing.confirmation?.ref
    ) {
      // lazy require to avoid top-level side effects
      const QRCode = require("qrcode");

      // generate a simple reference code: 8 uppercase alphanumeric
      const ref = Array.from(cryptoRandom(8)).join("");
      const payload = {
        appointmentId: req.params.id,
        ref,
      };
      // create a JSON payload and encode as QR data URL
      const qr = await QRCode.toDataURL(JSON.stringify(payload));
      updates.confirmation = { ref, qrDataUrl: qr, generatedAt: new Date() };
    }

    const a = await Appointment.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!a) return res.status(404).json({ error: "not found" });
    res.json(a);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// helper: generate crypto-random alphanumeric characters
function* cryptoRandom(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const buf = require("crypto").randomBytes(len);
  for (let i = 0; i < len; i++) yield chars[buf[i] % chars.length];
}

module.exports = router;
