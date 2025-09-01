const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { subscribeToNewsletter } = require('../controllers/newsletterController');

router.post('/subscribe', asyncHandler(subscribeToNewsletter));

module.exports = router;
