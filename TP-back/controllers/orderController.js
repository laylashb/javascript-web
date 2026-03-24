const Order = require("../models/Order");

// CREATE order
const createOrder = async (req, res) => {
  try {
    const order = new Order({
      user: req.user.id,
      products: req.body.products,
      totalPrice: req.body.totalPrice
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET user orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getAllOrders
};