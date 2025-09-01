const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Public routes - specific routes must come before dynamic routes like /:id
router.get('/search/suggestions', asyncHandler(productController.getSearchSuggestions));

// Admin-only route
router.get('/count', protect, admin, asyncHandler(productController.getProductCount));

router.route('/')
  .get(asyncHandler(productController.getProducts))
  // Admin-only route
  .post(protect, admin, asyncHandler(productController.createProduct));

router.post('/:id/recently-viewed', protect, asyncHandler(productController.addToRecentlyViewed));

router.route('/:id')
  .get(asyncHandler(productController.getProductById))
  // Admin-only routes
  .put(protect, admin, asyncHandler(productController.updateProduct))
  .delete(protect, admin, asyncHandler(productController.deleteProduct));

module.exports = router;
