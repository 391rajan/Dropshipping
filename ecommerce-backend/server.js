const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/cartdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection failed:", err));

// API Routes
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);  // NEW: auth routes

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
