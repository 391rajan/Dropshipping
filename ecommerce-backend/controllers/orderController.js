const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const Cart = require('../models/Cart');
const Address = require('../models/Address');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod, items, totalPrice, paymentResult } = req.body;

  try {
    if (items && items.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Fetch the full address object using the ID
    const fullShippingAddress = await Address.findById(shippingAddress);
    if (!fullShippingAddress) {
        res.status(404).json({ message: 'Shipping address not found' });
        return;
    }

    const order = new Order({
      user: req.user._id,
      orderItems: items,
      shippingAddress: fullShippingAddress._id, // Store the ID
      paymentMethod,
      paymentResult,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], subtotal: 0, discount: 0, total: 0, appliedCoupon: undefined });


    // Send order confirmation email
    const userEmail = req.user.email; // Assuming req.user has email
    const userName = req.user.name || req.user.email; // Assuming req.user has name

    const orderItemsHtml = items.map(item => `
      <li>${item.quantity} x ${item.product.name} - ${item.price}</li>
    `).join('');

    const emailSubject = `Order Confirmation #${createdOrder._id.toString().substring(0, 7)}`;
    const emailText = `Dear ${userName},

Thank you for your order! Your order ID is ${createdOrder._id.toString().substring(0, 7)}. Total: ${totalPrice}.

Items:
${items.map(item => `${item.quantity} x ${item.product.name}`).join('\n')}

Status: ${createdOrder.status}

We will notify you when your order ships.

Best regards,
Your E-commerce Store`;
    const emailHtml = `
      <p>Dear ${userName},</p>
      <p>Thank you for your order! Your order ID is <strong>#${createdOrder._id.toString().substring(0, 7)}</strong>.</p>
      <p><strong>Total:</strong> ${totalPrice}</p>
      <p><strong>Items:</strong></p>
      <ul>${orderItemsHtml}</ul>
      <p><strong>Status:</strong> ${createdOrder.status}</p>
      <p>We will notify you when your order ships.</p>
      <p>Best regards,<br>Your E-commerce Store</p>
    `;

    try {
      await sendEmail({
        to: userEmail,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
      console.log('Order confirmation email sent successfully.');
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// @desc    Get all orders for a logged-in user
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      // Add more status-related logic here if needed (e.g., setting delivery date)

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};