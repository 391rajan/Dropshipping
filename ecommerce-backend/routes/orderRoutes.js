const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderCount,
  getTotalRevenue,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Admin routes for analytics. Must be before '/:id'
router.get('/count', protect, admin, asyncHandler(getOrderCount));
router.get('/revenue', protect, admin, asyncHandler(getTotalRevenue));

// User-specific route. Must be before '/:id'
router.route('/my-orders').get(protect, asyncHandler(getMyOrders));

// Admin routes
router.route('/')
  .get(protect, admin, asyncHandler(getAllOrders))
  .post(protect, asyncHandler(createOrder));

// User and Admin routes
router.route('/:id')
  .get(protect, asyncHandler(getOrderById));

router.route('/:id/status').put(protect, admin, asyncHandler(updateOrderStatus));

module.exports = router;
