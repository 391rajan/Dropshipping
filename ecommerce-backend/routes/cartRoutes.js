const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  applyCouponToCart,
  removeCouponFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.route('/')
  .get(protect, asyncHandler(getCart))
  .post(protect, asyncHandler(addToCart));

router.route('/:productId')
  .delete(protect, asyncHandler(removeFromCart))
  .put(protect, asyncHandler(updateCartItemQuantity));

router.route('/apply-coupon').post(protect, asyncHandler(applyCouponToCart));
router.route('/remove-coupon').delete(protect, asyncHandler(removeCouponFromCart));
router.route('/clear').delete(protect, asyncHandler(clearCart));

module.exports = router;
