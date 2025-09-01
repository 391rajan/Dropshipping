const Question = require('../models/Question');
const Product = require('../models/Product');

// @desc    Create a new question for a product
// @route   POST /api/questions
// @access  Private
exports.createQuestion = async (req, res) => {
  const { productId, questionText } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const question = new Question({
      product: productId,
      user: req.user._id,
      questionText,
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

// @desc    Get all questions for a specific product
// @route   GET /api/questions/product/:productId
// @access  Public
exports.getQuestionsForProduct = async (req, res) => {
  try {
    const questions = await Question.find({ product: req.params.productId })
      .populate('user', 'name')
      .populate('answeredBy', 'name');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

// @desc    Answer a question (Admin only)
// @route   PUT /api/questions/:questionId/answer
// @access  Private/Admin
exports.answerQuestion = async (req, res) => {
  const { answerText } = req.body;

  try {
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.answer) {
      return res.status(400).json({ message: 'Question already answered' });
    }

    question.answer = answerText;
    question.answeredBy = req.user._id;
    question.answeredAt = Date.now();

    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error answering question', error: error.message });
  }
};

// @desc    Get all unanswered questions (Admin only)
// @route   GET /api/questions/unanswered
// @access  Private/Admin
exports.getAllUnansweredQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ answer: { $exists: false } })
      .populate('user', 'name')
      .populate('product', 'name');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unanswered questions', error: error.message });
  }
};
