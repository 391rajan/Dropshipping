const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./config");

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  // Replace with your frontend's URL in production.
  // It's good practice to use an environment variable for this.
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Default for Vite dev server, change to 3000 for CRA
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Passport middleware
const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());

// Body Parsers - should be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory.
// This means a request to '/uploads/image.jpg' will serve the file from 'public/uploads/image.jpg'.
app.use(express.static('public'));

// API Routes
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use("/api/products", require("./routes/productRoutes"));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes')); // Added coupon routes
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/recently-viewed', require('./routes/recentlyViewedRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/compare', require('./routes/compareRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/stock-notifications', require('./routes/stockNotificationRoutes'));

// Global Error Handler - MUST be the last middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const startServer = async () => {
  try {
    // Connect to MongoDB (deprecated options removed)
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected");

    // Start the server only after the database connection is successful
    app.listen(config.PORT, () => {
      console.log(`Server running on http://localhost:${config.PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit process with failure
  }
};

startServer();
