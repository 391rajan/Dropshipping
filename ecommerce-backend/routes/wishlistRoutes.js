const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlistController');

// Get user's wishlist
router.get('/', protect, wishlistController.getWishlist);

// Add product to wishlist
router.post('/add/:productId', protect, wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', protect, wishlistController.removeFromWishlist);

// Clear wishlist
router.delete('/clear', protect, wishlistController.clearWishlist);

module.exports = router;
