/*
const Razorpay = require('razorpay');
const crypto = require('crypto');

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.error('FATAL ERROR: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not defined in the environment variables.');
  console.error('Please add them to your .env file and restart the server.');
  process.exit(1); // Exit the process with a failure code
}

const instance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body; // amount is in the smallest currency unit (e.g., paise)

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const order = await instance.orders.create({
    amount,
    currency,
    receipt: receipt || `receipt_order_${new Date().getTime()}`,
  });
  res.json(order);
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify-signature
// @access  Private
exports.verifyRazorpaySignature = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing required payment verification details.' });
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto.createHmac('sha256', keySecret).update(body.toString()).digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid payment signature' });
  }
};
*/
