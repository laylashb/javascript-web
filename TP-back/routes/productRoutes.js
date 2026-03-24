const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/products.controller");
const isadmin = require("../middleware/isAdmin");

// CREATE
router.post("/", protect, isadmin, createProduct);

// UPDATE
router.put("/:id", protect, isadmin, updateProduct);

// DELETE
router.delete("/:id", protect, isadmin, deleteProduct);

// GET
router.get("/", protect, getProducts);

// getProductById
router.get("/:id", protect, getProductById);


module.exports = router;