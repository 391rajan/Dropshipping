const Product = require('../models/Product');
const Category = require('../models/Category');
const RecentlyViewed = require('../models/RecentlyViewed');

// Create a new product
exports.createProduct = async (req, res) => {
  const { images, ...productData } = req.body;

  const newProduct = {
    ...productData,
    images: Array.isArray(images) ? images : [],
  };

  const product = new Product(newProduct);
  await product.save();
  res.status(201).json(product);
};

// Get all products
exports.getProducts = async (req, res) => {
  const { category, minPrice, maxPrice, sortBy, inStock } = req.query;

  const query = {};
  if (category) {
    query.category = category;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (inStock === 'true') {
    query.stockQuantity = { $gt: 0 };
  }

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
    case 'rating_desc':
      sortOptions = { rating: -1 };
      break;
  }

  const products = await Product.find(query)
    .sort(sortOptions)
    .populate('category', 'name');

  const productsWithStockStatus = products.map((product) => {
    const outOfStock = product.stockQuantity === 0;
    return { ...product.toObject(), outOfStock };
  });

  res.json(productsWithStockStatus);
};

// Get all products that are on deal
exports.getDealProducts = async (req, res) => {
  const products = await Product.find({ originalPrice: { $ne: null } })
    .populate('category', 'name');
  res.json(products);
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const outOfStock = product.stockQuantity === 0;
  res.json({ ...product.toObject(), outOfStock });
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  const { images, ...productData } = req.body;

  const updatedProductData = {
    ...productData,
    images: Array.isArray(images) ? images : [],
  };

  const product = await Product.findByIdAndUpdate(req.params.id, updatedProductData, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne(); // or product.remove() for older mongoose
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
};

// @desc    Get total product count
// @route   GET /api/products/count
// @access  Private/Admin
exports.getProductCount = async (req, res) => {
  const count = await Product.countDocuments();
  res.json({ count });
};

// @desc    Add a product to recently viewed
// @route   POST /api/products/:id/recently-viewed
// @access  Private
exports.addToRecentlyViewed = async (req, res) => {
  const { id: productId } = req.params;
  const { _id: userId } = req.user;

  try {
    let recentlyViewed = await RecentlyViewed.findOne({ user: userId });

    if (!recentlyViewed) {
      recentlyViewed = new RecentlyViewed({ user: userId, products: [] });
    }

    // Check if the product is already in the list
    const productIndex = recentlyViewed.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex > -1) {
      // If it is, remove it from the list
      recentlyViewed.products.splice(productIndex, 1);
    }

    // Add the product to the beginning of the list
    recentlyViewed.products.unshift({ product: productId });

    // Limit the list to 20 products
    if (recentlyViewed.products.length > 20) {
      recentlyViewed.products = recentlyViewed.products.slice(0, 20);
    }

    await recentlyViewed.save();

    res.status(200).json(recentlyViewed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};