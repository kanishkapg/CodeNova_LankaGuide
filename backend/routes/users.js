const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "not found" });
    res.json(user.toSafeObject());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
