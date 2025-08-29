const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./config");

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
app.use('/public', express.static('public'));

// MongoDB connection
mongoose.connect(config.MONGO_URI, {
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
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes')); // Added coupon routes
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);
app.use('/api/compare', compareRoutes);

// Start the server
app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
