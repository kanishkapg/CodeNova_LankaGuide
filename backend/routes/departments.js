const express = require("express");
const router = express.Router();
const DEPARTMENTS = require("../data/departments");

router.get("/", (req, res) => {
  res.json(DEPARTMENTS);
});

module.exports = router;
