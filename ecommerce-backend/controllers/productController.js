const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy,
      inStock
    } = req.query;

    // Build filter query
    const query = {};
    
    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // In stock filter
    if (inStock === 'true') {
      query.stockQuantity = { $gt: 0 };
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'name_desc':
        sortOptions = { name: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 }; // newest first
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .populate('category', 'name');
      
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
