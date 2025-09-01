const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { createQuestion, getQuestionsForProduct, answerQuestion, getAllUnansweredQuestions } = require('../controllers/questionController');
const { protect, admin } = require('../middleware/auth');

// Public route to get questions for a product
router.get('/product/:productId', asyncHandler(getQuestionsForProduct));

// Private routes
router.post('/', protect, asyncHandler(createQuestion));

// Admin routes
router.put('/:questionId/answer', protect, admin, asyncHandler(answerQuestion));
router.get('/unanswered', protect, admin, asyncHandler(getAllUnansweredQuestions));

module.exports = router;
