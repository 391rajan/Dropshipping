// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

/*
// @route   POST /api/payments/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', protect, asyncHandler(createRazorpayOrder));

// @route   POST /api/payments/verify-signature
// @desc    Verify a Razorpay payment
// @access  Private
router.post('/verify-signature', protect, asyncHandler(verifyRazorpaySignature));
*/

module.exports = router;
