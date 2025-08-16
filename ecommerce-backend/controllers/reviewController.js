const Review = require('../models/Review');
const Product = require('../models/Product');

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Verify if user has purchased the product
    // This would require integration with your Order model
    // const hasOrdered = await Order.findOne({ user: userId, 'items.product': productId });
    const verified = false; // Set this based on order verification

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      title,
      comment,
      verified
    });

    const savedReview = await review.save();

    // Update product rating
    const product = await Product.findById(productId);
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    product.rating = avgRating;
    product.numReviews = allReviews.length;
    await product.save();

    // Populate user info before sending response
    await savedReview.populate('user', 'name');
    
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.updatedAt = Date.now();

    const updatedReview = await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    const allReviews = await Review.find({ product: review.product });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    product.rating = avgRating;
    await product.save();

    await updatedReview.populate('user', 'name');
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the user owns this review or is an admin
    if (review.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.remove();

    // Update product rating
    const product = await Product.findById(productId);
    const allReviews = await Review.find({ product: productId });
    
    if (allReviews.length === 0) {
      product.rating = 0;
      product.numReviews = 0;
    } else {
      const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
      product.rating = avgRating;
      product.numReviews = allReviews.length;
    }
    
    await product.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Get helpful count for a review
exports.getHelpfulCount = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ helpfulCount: review.helpfulCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching helpful count', error: error.message });
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user has already marked this review as helpful
    if (review.helpfulUsers.includes(userId)) {
      return res.status(400).json({ message: 'You have already marked this review as helpful' });
    }

    review.helpfulCount += 1;
    review.helpfulUsers.push(userId);
    await review.save();

    res.json({ helpfulCount: review.helpfulCount });
  } catch (error) {
    res.status(500).json({ message: 'Error marking review as helpful', error: error.message });
  }
};
