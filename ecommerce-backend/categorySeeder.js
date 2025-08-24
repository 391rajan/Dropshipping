const mongoose = require('mongoose');
const Category = require('./models/Category');
const slugify = require('slugify');
const config = require('./config');

const categories = [
  {
    name: 'Electronics',
    description: 'Latest electronic gadgets and devices',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    sortOrder: 1
  },
  {
    name: 'Clothing',
    description: 'Fashionable clothing for all ages',
    slug: 'clothing',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    sortOrder: 2
  },
  {
    name: 'Footwear',
    description: 'Comfortable and stylish footwear',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    sortOrder: 3
  },
  {
    name: 'Home & Garden',
    description: 'Everything for your home and garden',
    slug: 'home-garden',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    sortOrder: 4
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    slug: 'sports-fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    sortOrder: 5
  },
  {
    name: 'Books & Stationery',
    description: 'Books, notebooks, and office supplies',
    slug: 'books-stationery',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    sortOrder: 6
  },
  {
    name: 'Beauty & Health',
    description: 'Beauty products and health essentials',
    slug: 'beauty-health',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
    sortOrder: 7
  },
  {
    name: 'Toys & Games',
    description: 'Fun toys and games for all ages',
    slug: 'toys-games',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
    sortOrder: 8
  },
  {
    name: 'Automotive',
    description: 'Car accessories and maintenance',
    slug: 'automotive',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    sortOrder: 9
  },
  {
    name: 'Jewelry & Watches',
    description: 'Elegant jewelry and timepieces',
    slug: 'jewelry-watches',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    sortOrder: 10
  }
];

// Subcategories
const subcategories = [
  {
    name: 'Smartphones',
    description: 'Latest smartphones and mobile devices',
    slug: 'smartphones',
    parent: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    sortOrder: 1
  },
  {
    name: 'Laptops',
    description: 'High-performance laptops and computers',
    slug: 'laptops',
    parent: 'Electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    sortOrder: 2
  },
  {
    name: 'Men\'s Clothing',
    description: 'Fashionable clothing for men',
    slug: 'mens-clothing',
    parent: 'Clothing',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    sortOrder: 1
  },
  {
    name: 'Women\'s Clothing',
    description: 'Trendy clothing for women',
    slug: 'womens-clothing',
    parent: 'Clothing',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    sortOrder: 2
  },
  {
    name: 'Running Shoes',
    description: 'Comfortable running and athletic shoes',
    slug: 'running-shoes',
    parent: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    sortOrder: 1
  },
  {
    name: 'Casual Shoes',
    description: 'Stylish casual and everyday shoes',
    slug: 'casual-shoes',
    parent: 'Footwear',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop',
    sortOrder: 2
  }
];

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected for category seeding');
  
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');
    
    // Create main categories
    const createdCategories = {};
    for (const category of categories) {
      const newCategory = new Category(category);
      await newCategory.save();
      createdCategories[category.name] = newCategory._id;
      console.log(`Created category: ${category.name}`);
    }
    
    // Create subcategories
    for (const subcategory of subcategories) {
      if (createdCategories[subcategory.parent]) {
        subcategory.parent = createdCategories[subcategory.parent];
        const newSubcategory = new Category(subcategory);
        await newSubcategory.save();
        console.log(`Created subcategory: ${subcategory.name} under ${subcategory.parent}`);
      }
    }
    
    console.log('Categories seeded successfully!');
    console.log('Category IDs for product seeding:');
    Object.entries(createdCategories).forEach(([name, id]) => {
      console.log(`${name}: ${id}`);
    });
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    mongoose.disconnect();
  }
})
.catch((err) => {
  console.error('MongoDB connection failed:', err);
  mongoose.disconnect();
});
