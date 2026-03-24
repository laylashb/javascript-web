const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// route test protégée
router.get("/", protect, (req, res) => {
  res.json({ message: "Bienvenue sur ton compte", user: req.user });
});

module.exports = router;