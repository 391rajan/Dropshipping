const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a review
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      title,
      comment
    });

    await review.save();

    // Update product average rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      $set: { rating: avgRating.toFixed(1) },
      $inc: { numReviews: 1 }
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name');
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update review
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    ).populate('user', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update product average rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating.toFixed(1)
    });

    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update product average rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.length 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      : 0;
    
    await Product.findByIdAndUpdate(review.product, {
      rating: avgRating.toFixed(1),
      $inc: { numReviews: -1 }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
