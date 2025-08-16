const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// List notifications (optional target)
router.get("/", async (req, res) => {
  const { target } = req.query;
  const filter = {};
  if (target) filter.target = { $in: [target, "all"] };
  try {
    const n = await Notification.find(filter).sort({ ts: -1 });
    res.json(n);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const n = await Notification.create(req.body);
    res.status(201).json(n);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// mark read
router.put("/:id/read", async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!n) return res.status(404).json({ error: "not found" });
    res.json(n);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
