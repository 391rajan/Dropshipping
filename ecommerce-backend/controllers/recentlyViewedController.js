const RecentlyViewed = require('../models/RecentlyViewed');
const Product = require('../models/Product');

// Get user's recently viewed products
exports.getRecentlyViewed = async (req, res) => {
  try {
    let recentlyViewed = await RecentlyViewed.findOne({ user: req.user.id })
      .populate('products.product', 'name price images stockCount rating numReviews')
      .sort({ 'products.viewedAt': -1 });
    
    if (!recentlyViewed) {
      recentlyViewed = new RecentlyViewed({ user: req.user.id, products: [] });
      await recentlyViewed.save();
    }

    res.json(recentlyViewed.products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recently viewed products', error: error.message });
  }
};

// Add product to recently viewed
exports.addToRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.params;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let recentlyViewed = await RecentlyViewed.findOne({ user: req.user.id });
    
    if (!recentlyViewed) {
      recentlyViewed = new RecentlyViewed({
        user: req.user.id,
        products: [{ product: productId }]
      });
    } else {
      // Remove if product already exists
      recentlyViewed.products = recentlyViewed.products.filter(
        item => item.product.toString() !== productId
      );
      
      // Add to the beginning of the array
      recentlyViewed.products.unshift({
        product: productId,
        viewedAt: Date.now()
      });
    }

    await recentlyViewed.save();
    
    // Populate product details before sending response
    await recentlyViewed.populate('products.product', 'name price images stockCount rating numReviews');
    
    res.json(recentlyViewed.products);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to recently viewed', error: error.message });
  }
};

// Clear recently viewed products
exports.clearRecentlyViewed = async (req, res) => {
  try {
    const recentlyViewed = await RecentlyViewed.findOne({ user: req.user.id });
    if (!recentlyViewed) {
      return res.status(404).json({ message: 'Recently viewed list not found' });
    }

    recentlyViewed.products = [];
    await recentlyViewed.save();
    
    res.json({ message: 'Recently viewed list cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing recently viewed list', error: error.message });
  }
};
