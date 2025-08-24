const mongoose = require('mongoose');
const Product = require('./models/Product');
const config = require('./config');

// Custom image URLs - Replace these with your own image URLs
const customImages = {
  'iPhone 15 Pro': [
    'https://your-domain.com/images/iphone15pro-1.jpg',
    'https://your-domain.com/images/iphone15pro-2.jpg',
    'https://your-domain.com/images/iphone15pro-3.jpg',
    'https://your-domain.com/images/iphone15pro-4.jpg'
  ],
  'MacBook Air M2': [
    'https://your-domain.com/images/macbook-air-1.jpg',
    'https://your-domain.com/images/macbook-air-2.jpg',
    'https://your-domain.com/images/macbook-air-3.jpg',
    'https://your-domain.com/images/macbook-air-4.jpg'
  ],
  // Add more products as needed
};

// Function to update product images
async function updateProductImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    for (const [productName, imageUrls] of Object.entries(customImages)) {
      const product = await Product.findOne({ name: productName });
      
      if (product) {
        product.images = imageUrls;
        await product.save();
        console.log(`✅ Updated images for: ${productName}`);
        console.log(`   Images: ${imageUrls.length} images added`);
      } else {
        console.log(`❌ Product not found: ${productName}`);
      }
    }

    console.log('\n🎉 Image update completed!');
    
  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Function to add a single product with custom images
async function addProductWithCustomImages(productData) {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const product = new Product(productData);
    await product.save();
    
    console.log(`✅ Added new product: ${productData.name}`);
    console.log(`   Images: ${productData.images.length} images`);
    console.log(`   Price: $${productData.price}`);
    
  } catch (error) {
    console.error('❌ Error adding product:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Example: Add a new product with custom images
const newProduct = {
  name: 'Custom Gaming Laptop',
  description: 'High-performance gaming laptop with RGB lighting and premium graphics',
  price: 1499.99,
  originalPrice: 1699.99,
  images: [
    'https://your-domain.com/images/gaming-laptop-1.jpg',
    'https://your-domain.com/images/gaming-laptop-2.jpg',
    'https://your-domain.com/images/gaming-laptop-3.jpg',
    'https://your-domain.com/images/gaming-laptop-4.jpg'
  ],
  brand: 'GamingPro',
  stock: 25,
  rating: 4.9,
  numReviews: 150,
  tags: ['gaming', 'laptop', 'RGB', 'high-performance'],
  isFeatured: true,
  specifications: {
    'Processor': 'Intel i7-12700H',
    'Graphics': 'RTX 3070',
    'RAM': '16GB DDR4',
    'Storage': '512GB NVMe SSD'
  }
};

// Uncomment the function you want to run:
// updateProductImages();           // Update existing products
// addProductWithCustomImages(newProduct);  // Add new product

console.log('📝 Image utility script loaded!');
console.log('To use:');
console.log('1. Update customImages object with your image URLs');
console.log('2. Uncomment the function you want to run');
console.log('3. Run: node add-custom-images.js');
