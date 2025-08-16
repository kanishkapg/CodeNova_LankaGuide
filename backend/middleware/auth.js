const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

async function authMiddleware(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "invalid token" });
    req.user = user.toSafeObject();
    next();
  } catch (err) {
    res.status(401).json({ error: "invalid token" });
  }
}

module.exports = authMiddleware;
