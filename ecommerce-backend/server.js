const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require('./routes/wishlistRoutes');
const recentlyViewedRoutes = require('./routes/recentlyViewedRoutes');
const compareRoutes = require('./routes/compareRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection failed:", err));

// API Routes
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);  
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use("/api/products", productRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/compare', compareRoutes);

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
