
const Order = require('../models/Order');

// @desc    Process a dummy payment
// @route   POST /api/payments/process-dummy-payment
// @access  Private
exports.processDummyPayment = async (req, res) => {
  const { orderId, amount } = req.body;

  console.log(`Starting DUMMY payment process for Order ID: ${orderId}`);

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: `Order ${orderId} not found.` });
    }

    const isSuccess = true; // Math.random() < 0.8;

    if (isSuccess) {
      console.log(`DUMMY payment SUCCEEDED for Order ID: ${orderId}`);
      order.paymentResult = {
        id: 'dummy_payment_' + new Date().getTime(),
        status: 'succeeded',
        updateTime: new Date().toISOString(),
        emailAddress: req.user.email,
      };
      order.status = 'Processing';
      const updatedOrder = await order.save();
      
      res.status(200).json({ success: true, message: 'Dummy payment successful!', order: updatedOrder });

    } else {
      console.log(`DUMMY payment FAILED for Order ID: ${orderId}`);
      order.status = 'Cancelled';
      const updatedOrder = await order.save();

      res.status(400).json({ success: false, message: 'Dummy payment failed.', order: updatedOrder });
    }
  } catch (error) {
    console.error(`Error in DUMMY payment for Order ID: ${orderId}`, error);
    res.status(500).json({ message: 'An error occurred during the dummy payment process.' });
  }
};
