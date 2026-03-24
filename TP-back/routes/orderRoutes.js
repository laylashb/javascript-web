const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
  createOrder,
  getOrders,
  getAllOrders
} = require("../controllers/orderController");

// User
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getOrders);

// Admin
router.get("/", protect, isAdmin, getAllOrders);

module.exports = router;