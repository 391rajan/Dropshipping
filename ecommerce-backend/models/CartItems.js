// models/CartItem.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

module.exports = mongoose.model("CartItem", cartItemSchema);
