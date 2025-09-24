const RecentlyViewed = require('../models/RecentlyViewed');
const Product = require('../models/Product');

// Get user's recently viewed products
exports.getRecentlyViewed = async (req, res) => {
  try {
    const recentlyViewedList = await RecentlyViewed.findOne({ user: req.user.id });
    
    if (!recentlyViewedList || recentlyViewedList.products.length === 0) {
      return res.json([]);
    }

    // Extract product IDs and sort them based on viewedAt timestamp
    const sortedProductIds = recentlyViewedList.products
      .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
      .map(p => p.product);

    // Fetch and populate products based on the sorted order
    const products = await Product.find({ '_id': { $in: sortedProductIds } })
      .populate('category', 'name');

    // Re-sort the products to match the recently viewed order, as MongoDB's $in does not preserve order.
    const sortedProducts = sortedProductIds.map(id => 
      products.find(p => p._id.toString() === id.toString())
    ).filter(p => p); // Filter out any nulls if a product was deleted

    // Limit to the latest 4 for a clean UI, you can adjust this number
    res.json(sortedProducts.slice(0, 4));
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
