const express = require('express');
const router = express.Router();
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
  .get(protect, getCart)
  .post(protect, addToCart);

router.route('/:productId')
  .delete(protect, removeFromCart)
  .put(protect, updateCartItemQuantity);

router.route('/apply-coupon').post(protect, applyCouponToCart);
router.route('/remove-coupon').delete(protect, removeCouponFromCart);
router.route('/clear').delete(protect, clearCart);

module.exports = router;
