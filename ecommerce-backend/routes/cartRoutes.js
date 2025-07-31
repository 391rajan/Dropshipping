// routes/cart.js
const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItems");

// GET all cart items
router.get("/", async (req, res) => {
  const items = await CartItem.find();
  res.json(items);
});

// ADD a new cart item
router.post("/", async (req, res) => {
  const newItem = new CartItem(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

// UPDATE quantity
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedItem = await CartItem.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedItem);
});

// DELETE an item
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await CartItem.findByIdAndDelete(id);
  res.json({ message: "Item deleted" });
});

module.exports = router;
