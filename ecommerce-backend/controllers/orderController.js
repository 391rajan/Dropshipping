const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Product = require('../models/Product'); // Assuming you have a Product model

// Helper function for sending order confirmation email
const sendOrderConfirmationEmail = async (user, order) => {
  const { email, name } = user;
  const { _id, orderItems, totalPrice, status } = order;
  const userName = name || email;

  // Note: Ensure orderItems have product name and price available.
  // If not, you may need to populate them before calling this function.
  const orderItemsHtml = orderItems.map(item => `
    <li>${item.quantity} x ${item.name} - ${item.price}</li>
  `).join('');

  const orderIdShort = _id.toString().substring(0, 7);
  const emailSubject = `Order Confirmation #${orderIdShort}`;
  const emailText = `Dear ${userName},

Thank you for your order! Your order ID is ${orderIdShort}. Total: ${totalPrice}.

Items:
${orderItems.map(item => `${item.quantity} x ${item.name}`).join('\n')}

Status: ${status}

We will notify you when your order ships.

Best regards,
Your E-commerce Store`;
  const emailHtml = `
    <p>Dear ${userName},</p>
    <p>Thank you for your order! Your order ID is <strong>#${orderIdShort}</strong>.</p>
    <p><strong>Total:</strong> ${totalPrice}</p>
    <p><strong>Items:</strong></p>
    <ul>${orderItemsHtml}</ul>
    <p><strong>Status:</strong> ${status}</p>
    <p>We will notify you when your order ships.</p>
    <p>Best regards,<br>Your E-commerce Store</p>
  `;

  try {
    await sendEmail({
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });
    console.log(`Order confirmation email sent successfully to ${email}.`);
  } catch (emailError) {
    // Log the error, but don't block the user response.
    // In a production app, you might want to queue this for a retry.
    console.error(`Error sending order confirmation email to ${email}:`, emailError);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, items, totalPrice, paymentResult } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Validate shippingAddress ID format
  if (!mongoose.Types.ObjectId.isValid(shippingAddress)) {
    return res.status(400).json({ message: 'Invalid shipping address ID' });
  }

  // Fetch the full address object using the ID
  const fullShippingAddress = await Address.findById(shippingAddress);
  if (!fullShippingAddress) {
      return res.status(404).json({ message: 'Shipping address not found' });
  }

  // Create a snapshot of order items with price and details at the time of purchase
  const orderItems = await Promise.all(items.map(async (item) => {
    const product = await Product.findById(item.product);
    if (!product) {
      // This throws an error that should be caught by a global error handler
      throw new Error(`Product with ID ${item.product} not found`);
    }
    return {
      name: product.name,
      image: product.image,
      price: product.price, // Use the current price from the database
      quantity: item.quantity,
      product: item.product, // The original product ID
    };
  }));

  // You might want to recalculate the total price on the backend for security
  // instead of trusting the value from the client.
  // const calculatedTotalPrice = orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const order = new Order({
    user: req.user._id,
    orderItems: orderItems,
    shippingAddress: fullShippingAddress._id, // Store the ID
    paymentMethod,
    paymentResult,
    totalPrice, // Or use calculatedTotalPrice
  });

  const createdOrder = await order.save();

  // Clear user's cart after successful order
  await Cart.findOneAndUpdate(
    { user: req.user._id }, 
    { $set: { items: [], subtotal: 0, discount: 0, total: 0, appliedCoupon: null } }
  );

  // Send order confirmation email without waiting for it to complete
  sendOrderConfirmationEmail(req.user, createdOrder);

  res.status(201).json(createdOrder);
};

// @desc    Get all orders for a logged-in user
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product', 'name price image')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name price image');
    
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  // Optional: Check if user is an admin or the owner of the order
  // This requires req.user.role to be set by your auth middleware
  // if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
  //     return res.status(401).json({ message: 'Not authorized to view this order' });
  // }
  res.json(order);
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    // Add more status-related logic here if needed (e.g., setting delivery date)

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get total order count
// @route   GET /api/orders/count
// @access  Private/Admin
exports.getOrderCount = async (req, res) => {
  const count = await Order.countDocuments();
  res.json({ count });
};

// @desc    Get total revenue
// @route   GET /api/orders/revenue
// @access  Private/Admin
exports.getTotalRevenue = async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ]);

  res.json({ totalRevenue: result[0]?.totalRevenue || 0 });
};