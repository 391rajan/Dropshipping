const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
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
  .post(protect, admin, asyncHandler(createCoupon))
  .get(protect, admin, asyncHandler(getAllCoupons));

router.route('/:id')
  .get(protect, admin, asyncHandler(getCouponById))
  .put(protect, admin, asyncHandler(updateCoupon))
  .delete(protect, admin, asyncHandler(deleteCoupon));

// User route to apply a coupon
router.post('/apply', protect, asyncHandler(applyCoupon));

module.exports = router;
