const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// User-specific routes
router.route('/my-orders').get(protect, getMyOrders);

// Admin routes
router.route('/').get(protect, admin, getAllOrders).post(protect, createOrder); // Added .post for createOrder
router.route('/:id/status').put(protect, admin, updateOrderStatus);

// User and Admin routes
router.route('/:id').get(protect, getOrderById);

module.exports = router;
