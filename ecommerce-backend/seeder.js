const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const config = require('./config');

const products = [
  // Electronics
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
    price: 999.99,
    originalPrice: 1099.99,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'Apple',
    stock: 50,
    rating: 4.8,
    numReviews: 1250,
    tags: ['smartphone', '5G', 'camera', 'premium'],
    isFeatured: true,
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '128GB',
      'Color': 'Titanium',
      'Battery': 'Up to 23 hours'
    }
  },
  {
    name: 'MacBook Air M2',
    description: 'Ultra-thin laptop with M2 chip, perfect for work and creativity',
    price: 1199.99,
    originalPrice: 1299.99,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'Apple',
    stock: 30,
    rating: 4.9,
    numReviews: 890,
    tags: ['laptop', 'ultrabook', 'M2 chip', 'retina display'],
    isFeatured: true,
    specifications: {
      'Processor': 'M2 chip',
      'RAM': '8GB',
      'Storage': '256GB SSD',
      'Display': '13.6-inch Retina'
    }
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise-cancelling wireless headphones with exceptional sound quality',
    price: 399.99,
    originalPrice: 449.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'Sony',
    stock: 75,
    rating: 4.7,
    numReviews: 2100,
    tags: ['headphones', 'noise-cancelling', 'wireless', 'bluetooth'],
    isFeatured: false,
    specifications: {
      'Driver Size': '30mm',
      'Battery Life': 'Up to 30 hours',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.2'
    }
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Android flagship with AI features, stunning display, and powerful performance',
    price: 799.99,
    originalPrice: 899.99,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'Samsung',
    stock: 45,
    rating: 4.6,
    numReviews: 980,
    tags: ['android', 'smartphone', '5G', 'AI'],
    isFeatured: true,
    specifications: {
      'Screen Size': '6.2 inches',
      'Storage': '128GB',
      'Color': 'Phantom Black',
      'Battery': '4000mAh'
    }
  },
  {
    name: 'iPad Air 5th Gen',
    description: 'Versatile tablet with M1 chip, perfect for work, creativity, and entertainment',
    price: 599.99,
    originalPrice: 649.99,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'Apple',
    stock: 60,
    rating: 4.8,
    numReviews: 750,
    tags: ['tablet', 'iPad', 'M1 chip', 'retina display'],
    isFeatured: false,
    specifications: {
      'Processor': 'M1 chip',
      'RAM': '8GB',
      'Storage': '64GB',
      'Display': '10.9-inch Liquid Retina'
    }
  },

  // Clothing
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt with modern fit and sustainable materials',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'EcoWear',
    stock: 200,
    rating: 4.5,
    numReviews: 320,
    tags: ['t-shirt', 'cotton', 'organic', 'sustainable'],
    isFeatured: false,
    variants: [
      { name: 'Size', value: 'S', price: 29.99, stock: 50 },
      { name: 'Size', value: 'M', price: 29.99, stock: 60 },
      { name: 'Size', value: 'L', price: 29.99, stock: 50 },
      { name: 'Size', value: 'XL', price: 29.99, stock: 40 }
    ],
    specifications: {
      'Material': '100% Organic Cotton',
      'Fit': 'Modern',
      'Care': 'Machine wash cold',
      'Origin': 'Made in USA'
    }
  },
  {
    name: 'Slim Fit Jeans',
    description: 'Premium denim jeans with stretch technology for ultimate comfort and style',
    price: 89.99,
    originalPrice: 119.99,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'DenimCo',
    stock: 150,
    rating: 4.6,
    numReviews: 450,
    tags: ['jeans', 'denim', 'slim fit', 'stretch'],
    isFeatured: false,
    variants: [
      { name: 'Size', value: '30x32', price: 89.99, stock: 30 },
      { name: 'Size', value: '32x32', price: 89.99, stock: 40 },
      { name: 'Size', value: '34x32', price: 89.99, stock: 35 },
      { name: 'Size', value: '36x32', price: 89.99, stock: 45 }
    ],
    specifications: {
      'Material': '98% Cotton, 2% Elastane',
      'Fit': 'Slim Fit',
      'Wash': 'Medium Blue',
      'Care': 'Machine wash cold'
    }
  },
  {
    name: 'Casual Blazer',
    description: 'Versatile casual blazer perfect for office and evening wear',
    price: 149.99,
    originalPrice: 199.99,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'StyleCraft',
    stock: 80,
    rating: 4.7,
    numReviews: 180,
    tags: ['blazer', 'casual', 'office wear', 'evening'],
    isFeatured: true,
    variants: [
      { name: 'Size', value: 'S', price: 149.99, stock: 20 },
      { name: 'Size', value: 'M', price: 149.99, stock: 25 },
      { name: 'Size', value: 'L', price: 149.99, stock: 20 },
      { name: 'Size', value: 'XL', price: 149.99, stock: 15 }
    ],
    specifications: {
      'Material': 'Polyester Blend',
      'Fit': 'Regular Fit',
      'Style': 'Single Breasted',
      'Care': 'Dry clean only'
    }
  },

  // Footwear
  {
    name: 'Nike Air Max 270',
    description: 'Iconic running shoes with Air Max technology for maximum comfort and style',
    price: 129.99,
    originalPrice: 149.99,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'Nike',
    stock: 120,
    rating: 4.8,
    numReviews: 890,
    tags: ['running shoes', 'air max', 'comfort', 'style'],
    isFeatured: true,
    variants: [
      { name: 'Size', value: '7', price: 129.99, stock: 20 },
      { name: 'Size', value: '8', price: 129.99, stock: 25 },
      { name: 'Size', value: '9', price: 129.99, stock: 30 },
      { name: 'Size', value: '10', price: 129.99, stock: 25 },
      { name: 'Size', value: '11', price: 129.99, stock: 20 }
    ],
    specifications: {
      'Type': 'Running Shoes',
      'Technology': 'Air Max 270',
      'Weight': '285g',
      'Terrain': 'Road'
    }
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost midsole technology for energy return',
    price: 179.99,
    originalPrice: 199.99,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'Adidas',
    stock: 95,
    rating: 4.9,
    numReviews: 650,
    tags: ['running shoes', 'ultraboost', 'boost technology', 'premium'],
    isFeatured: true,
    variants: [
      { name: 'Size', value: '7', price: 179.99, stock: 15 },
      { name: 'Size', value: '8', price: 179.99, stock: 20 },
      { name: 'Size', value: '9', price: 179.99, stock: 25 },
      { name: 'Size', value: '10', price: 179.99, stock: 20 },
      { name: 'Size', value: '11', price: 179.99, stock: 15 }
    ],
    specifications: {
      'Type': 'Running Shoes',
      'Technology': 'Boost Midsole',
      'Weight': '310g',
      'Terrain': 'Road'
    }
  },

  // Home & Garden
  {
    name: 'Smart LED Desk Lamp',
    description: 'WiFi-enabled desk lamp with adjustable brightness, color temperature, and voice control',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'SmartHome',
    stock: 65,
    rating: 4.6,
    numReviews: 320,
    tags: ['desk lamp', 'LED', 'smart home', 'wifi'],
    isFeatured: false,
    specifications: {
      'Power': '15W LED',
      'Brightness': '1000 lumens',
      'Color Temp': '2700K-6500K',
      'Connectivity': 'WiFi + Bluetooth'
    }
  },
  {
    name: 'Stainless Steel Coffee Maker',
    description: 'Professional-grade coffee maker with thermal carafe and programmable features',
    price: 129.99,
    originalPrice: 159.99,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'BrewMaster',
    stock: 45,
    rating: 4.7,
    numReviews: 280,
    tags: ['coffee maker', 'stainless steel', 'thermal carafe', 'programmable'],
    isFeatured: false,
    specifications: {
      'Capacity': '12 cups',
      'Material': 'Stainless Steel',
      'Features': 'Programmable, Thermal Carafe',
      'Warranty': '2 years'
    }
  },

  // Sports & Fitness
  {
    name: 'Premium Yoga Mat',
    description: 'Non-slip yoga mat with alignment lines, perfect for all types of yoga practice',
    price: 49.99,
    originalPrice: 69.99,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'YogaLife',
    stock: 180,
    rating: 4.8,
    numReviews: 420,
    tags: ['yoga mat', 'non-slip', 'alignment lines', 'premium'],
    isFeatured: false,
    specifications: {
      'Thickness': '6mm',
      'Material': 'TPE',
      'Size': '72" x 24"',
      'Weight': '2.5 lbs'
    }
  },
  {
    name: 'Adjustable Dumbbells Set',
    description: 'Space-saving adjustable dumbbells from 5-50 lbs with quick-change mechanism',
    price: 299.99,
    originalPrice: 399.99,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=face'
    ],
    brand: 'PowerBlock',
    stock: 35,
    rating: 4.9,
    numReviews: 180,
    tags: ['dumbbells', 'adjustable', 'home gym', 'space saving'],
    isFeatured: true,
    specifications: {
      'Weight Range': '5-50 lbs',
      'Material': 'Steel',
      'Grip': 'Rubber coated',
      'Warranty': 'Lifetime'
    }
  }
];

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected for product seeding');
  
  try {
    // Get category IDs
    const categories = await Category.find({});
    const categoryMap = {};
    
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });
    
    console.log('Available categories:', Object.keys(categoryMap));
    
    // Clear existing products
  await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Create products with proper category references
    for (const product of products) {
      // Map category names to IDs
      let categoryId;
      if (product.name.includes('iPhone') || product.name.includes('MacBook') || product.name.includes('iPad')) {
        categoryId = categoryMap['electronics'];
      } else if (product.name.includes('T-Shirt') || product.name.includes('Jeans') || product.name.includes('Blazer')) {
        categoryId = categoryMap['clothing'];
      } else if (product.name.includes('Nike') || product.name.includes('Adidas')) {
        categoryId = categoryMap['footwear'];
      } else if (product.name.includes('Lamp') || product.name.includes('Coffee Maker')) {
        categoryId = categoryMap['home & garden'];
      } else if (product.name.includes('Yoga') || product.name.includes('Dumbbells')) {
        categoryId = categoryMap['sports & fitness'];
      } else {
        categoryId = categoryMap['electronics']; // Default fallback
      }
      
      product.category = categoryId;
      
      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`Created product: ${product.name} in category: ${product.category}`);
    }
    
    console.log('Products seeded successfully!');
    console.log(`Total products created: ${products.length}`);
    
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
  mongoose.disconnect();
  }
})
.catch((err) => {
  console.error('MongoDB connection failed:', err);
  mongoose.disconnect();
});
