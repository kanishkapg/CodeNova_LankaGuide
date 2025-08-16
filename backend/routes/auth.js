const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name)
      return res
        .status(400)
        .json({ error: "name, email and password required" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "email already in use" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash });
    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) return res.status(401).json({ error: "invalid credentials" });
    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
