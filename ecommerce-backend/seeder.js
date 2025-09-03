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
      'uploads/iphone15.jpg',
      'uploads/iphone15_1.jpg'
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
      'uploads/macbook_air_m2_1.jpg',
      'uploads/macbook_air_m2_2.jpg'
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
      'uploads/sony_wh1000xm5_1.jpg',
      'uploads/sony_wh1000xm5_2.jpg'
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
      'uploads/samsung_galaxy_s24_1.jpg',
      'uploads/samsung_galaxy_s24_2.jpg'
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
    name: 'Dell XPS 15',
    description: 'Powerful laptop with a stunning 4K display, ideal for professionals',
    price: 1799.99,
    originalPrice: 1999.99,
    images: [
      'uploads/dell_xps_15_1.jpg',
      'uploads/dell_xps_15_2.jpg'
    ],
    brand: 'Dell',
    stock: 20,
    rating: 4.9,
    numReviews: 650,
    tags: ['laptop', '4k display', 'professional', 'powerful'],
    isFeatured: true,
    specifications: {
      'Processor': 'Intel Core i7',
      'RAM': '16GB',
      'Storage': '512GB SSD',
      'Display': '15.6-inch 4K UHD'
    }
  },

  // Clothing
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt with modern fit and sustainable materials',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'uploads/cotton_tshirt_1.jpg',
      'uploads/cotton_tshirt_2.jpg'
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
      'uploads/slim_fit_jeans_1.jpg',
      'uploads/slim_fit_jeans_2.jpg'
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
      'uploads/casual_blazer_1.jpg',
      'uploads/casual_blazer_2.jpg'
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
      'uploads/nike_air_max_270_1.jpg',
      'uploads/nike_air_max_270_2.jpg'
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
      'uploads/adidas_ultraboost_22_1.jpg',
      'uploads/adidas_ultraboost_22_2.jpg'
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
      'uploads/smart_led_desk_lamp_1.jpg',
      'uploads/smart_led_desk_lamp_2.jpg'
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
      'uploads/coffee_maker_1.jpg',
      'uploads/coffee_maker_2.jpg'
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
      'uploads/yoga_mat_1.jpg',
      'uploads/yoga_mat_2.jpg'
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
      'uploads/adjustable_dumbbells_1.jpg',
      'uploads/adjustable_dumbbells_2.jpg'
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

const productToCategoryMap = {
  'iPhone 15 Pro': 'electronics',
  'MacBook Air M2': 'electronics',
  'Sony WH-1000XM5': 'electronics',
  'Samsung Galaxy S24': 'electronics',
  'Dell XPS 15': 'electronics',
  'Premium Cotton T-Shirt': 'clothing',
  'Slim Fit Jeans': 'clothing',
  'Casual Blazer': 'clothing',
  'Nike Air Max 270': 'footwear',
  'Adidas Ultraboost 22': 'footwear',
  'Smart LED Desk Lamp': 'home & garden',
  'Stainless Steel Coffee Maker': 'home & garden',
  'Premium Yoga Mat': 'sports & fitness',
  'Adjustable Dumbbells Set': 'sports & fitness',
};

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
      const categoryName = productToCategoryMap[product.name];
      let categoryId;
      if (categoryName && categoryMap[categoryName.toLowerCase()]) {
        categoryId = categoryMap[categoryName.toLowerCase()];
      } else {
        console.warn(`Category not found for product "${product.name}". Check mapping or category seeder. Skipping product.`);
        continue; // Skip product if category is not found
      }
      
      product.category = categoryId;
      
      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`Created product: ${product.name} in category: ${categoryName} (${product.category})`);
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