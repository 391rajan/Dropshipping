const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('slugify');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name slug')
      .sort('sortOrder name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get category tree
exports.getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('children')
      .where('parent').exists(false);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category tree', error: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent, image, sortOrder } = req.body;
    const slug = slugify(name, { lower: true });

    // Check for duplicate slug
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = new Category({
      name,
      description,
      slug,
      parent,
      image,
      sortOrder
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, parent, image, sortOrder, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      const slug = slugify(name, { lower: true });
      const existingCategory = await Category.findOne({ 
        slug, 
        _id: { $ne: category._id } 
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }

      category.name = name;
      category.slug = slug;
    }

    if (description !== undefined) category.description = description;
    if (parent !== undefined) category.parent = parent;
    if (image !== undefined) category.image = image;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has children
    const hasChildren = await Category.exists({ parent: category._id });
    if (hasChildren) {
      return res.status(400).json({ message: 'Cannot delete category with subcategories' });
    }

    // Check if category has products
    const hasProducts = await mongoose.model('Product').exists({ category: category._id });
    if (hasProducts) {
      return res.status(400).json({ 
        message: 'Cannot delete category with products. Deactivate it instead.' 
      });
    }

    await category.remove();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name slug')
      .populate('children', 'name slug');
      
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parent', 'name slug')
      .populate('children', 'name slug');
      
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Get category products
exports.getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt', sortBy } = req.query;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Set up sort configuration
    let sortConfig = sort;
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          sortConfig = { price: 1 };
          break;
        case 'price_desc':
          sortConfig = { price: -1 };
          break;
        case 'name_asc':
          sortConfig = { name: 1 };
          break;
        case 'name_desc':
          sortConfig = { name: -1 };
          break;
        default:
          sortConfig = { createdAt: -1 };
      }
    }

    // Get all descendant category IDs
    const descendantCategories = await Category.find({
      'ancestors._id': category._id
    });
    const categoryIds = [
      category._id,
      ...descendantCategories.map(cat => cat._id)
    ];
    
    console.log('Category:', category.name);
    console.log('CategoryIds for query:', categoryIds);

    console.log('Finding products with categoryIds:', categoryIds);
    console.log('Sort config:', sortConfig);
    
    const query = {
      category: { $in: categoryIds },
      isActive: true
    };
    console.log('Query:', query);
    
    const products = await Product.find(query)
      .sort(sortConfig)
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('category', 'name slug');
    
    console.log('Found products:', products.length);
    
    const total = await Product.countDocuments(query);
    console.log('Total products:', total);

    res.json({
      products,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error in getCategoryProducts:', error);
    res.status(500).json({ message: 'Error fetching category products', error: error.message });
  }
};
