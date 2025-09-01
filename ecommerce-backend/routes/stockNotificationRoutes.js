const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { createStockNotification, sendStockNotifications } = require('../controllers/stockNotificationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, asyncHandler(createStockNotification));
router.post('/send', asyncHandler(sendStockNotifications));

module.exports = router;
