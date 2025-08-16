const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const recentlyViewedController = require('../controllers/recentlyViewedController');

// Get user's recently viewed products
router.get('/', protect, recentlyViewedController.getRecentlyViewed);

// Add product to recently viewed
router.post('/:productId', protect, recentlyViewedController.addToRecentlyViewed);

// Clear recently viewed products
router.delete('/clear', protect, recentlyViewedController.clearRecentlyViewed);

module.exports = router;
