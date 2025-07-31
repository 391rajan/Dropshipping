const CartItem = require("../models/CartItems");

exports.getCart = async (req, res) => {
  const items = await CartItem.find();
  res.json(items);
};

exports.addToCart = async (req, res) => {
  const { name, price, quantity, image } = req.body;
  const item = new CartItem({ name, price, quantity, image });
  await item.save();
  res.status(201).json(item);
};

exports.updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const updated = await CartItem.findByIdAndUpdate(id, { quantity }, { new: true });
  res.json(updated);
};

exports.deleteItem = async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Item removed" });
};
