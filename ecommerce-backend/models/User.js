const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Changed to false
  },
  googleId: {
    type: String,
    required: false, // Added googleId field
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  isVerified: { type: Boolean, default: true },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model("User", userSchema);
