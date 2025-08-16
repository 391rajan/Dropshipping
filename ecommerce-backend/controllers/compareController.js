const Compare = require('../models/Compare');
const Product = require('../models/Product');

// Get comparison list
exports.getCompareList = async (req, res) => {
  try {
    let compareList = await Compare.findOne({ user: req.user.id })
      .populate('products', 'name price images stockCount rating numReviews brand description');
    
    if (!compareList) {
      compareList = new Compare({ user: req.user.id, products: [] });
      await compareList.save();
    }

    res.json(compareList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comparison list', error: error.message });
  }
};

// Add product to comparison
exports.addToCompare = async (req, res) => {
  try {
    const { productId } = req.params;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let compareList = await Compare.findOne({ user: req.user.id });
    
    if (!compareList) {
      compareList = new Compare({ user: req.user.id, products: [productId] });
    } else if (!compareList.products.includes(productId)) {
      // Check if maximum limit reached
      if (compareList.products.length >= 4) {
        return res.status(400).json({ message: 'Maximum 4 products can be compared at once' });
      }
      compareList.products.push(productId);
    }

    await compareList.save();
    
    // Populate product details before sending response
    await compareList.populate('products', 'name price images stockCount rating numReviews brand description');
    
    res.json(compareList);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to comparison list', error: error.message });
  }
};

// Remove product from comparison
exports.removeFromCompare = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const compareList = await Compare.findOne({ user: req.user.id });
    if (!compareList) {
      return res.status(404).json({ message: 'Comparison list not found' });
    }

    compareList.products = compareList.products.filter(id => id.toString() !== productId);
    await compareList.save();
    
    // Populate product details before sending response
    await compareList.populate('products', 'name price images stockCount rating numReviews brand description');
    
    res.json(compareList);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from comparison list', error: error.message });
  }
};

// Clear comparison list
exports.clearCompareList = async (req, res) => {
  try {
    const compareList = await Compare.findOne({ user: req.user.id });
    if (!compareList) {
      return res.status(404).json({ message: 'Comparison list not found' });
    }

    compareList.products = [];
    await compareList.save();
    
    res.json({ message: 'Comparison list cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing comparison list', error: error.message });
  }
};

// Get detailed comparison of products
exports.getComparisonDetails = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length < 2 || productIds.length > 4) {
      return res.status(400).json({ message: 'Please provide 2-4 product IDs for comparison' });
    }

    const products = await Product.find({ _id: { $in: productIds } })
      .select('name price images stockCount rating numReviews brand description variants');

    if (products.length !== productIds.length) {
      return res.status(404).json({ message: 'One or more products not found' });
    }

    // Create comparison matrix
    const comparisonMatrix = {
      basic: {
        price: products.map(p => p.price),
        rating: products.map(p => p.rating),
        stockCount: products.map(p => p.stockCount),
        brand: products.map(p => p.brand)
      },
      variants: products.map(p => p.variants?.length || 0),
      reviews: products.map(p => p.numReviews)
    };

    res.json({
      products,
      comparisonMatrix
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting comparison details', error: error.message });
  }
};
