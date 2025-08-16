const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const compareController = require('../controllers/compareController');

// Get comparison list
router.get('/', protect, compareController.getCompareList);

// Add product to comparison
router.post('/add/:productId', protect, compareController.addToCompare);

// Remove product from comparison
router.delete('/remove/:productId', protect, compareController.removeFromCompare);

// Clear comparison list
router.delete('/clear', protect, compareController.clearCompareList);

// Get comparison details for specific products
router.post('/details', protect, compareController.getComparisonDetails);

module.exports = router;
