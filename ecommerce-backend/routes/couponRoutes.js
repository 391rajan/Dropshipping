const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/auth');

// Admin routes for coupon management
router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getAllCoupons);

router.route('/:id')
  .get(protect, admin, getCouponById)
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

// User route to apply a coupon
router.post('/apply', protect, applyCoupon);

module.exports = router;
