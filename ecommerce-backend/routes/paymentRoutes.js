const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/process-dummy-payment', protect, asyncHandler(paymentController.processDummyPayment));

// router.post('/create-order', protect, asyncHandler(paymentController.createRazorpayOrder));
// router.post('/verify-signature', protect, asyncHandler(paymentController.verifyRazorpaySignature));

module.exports = router;