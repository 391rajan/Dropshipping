const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 19.99, image: '', category: 'Electronics', stock: 50 },
  { name: 'Bluetooth Headphones', description: 'Noise-cancelling over-ear headphones', price: 59.99, image: '', category: 'Electronics', stock: 30 },
  { name: 'Yoga Mat', description: 'Non-slip yoga mat', price: 15.99, image: '', category: 'Fitness', stock: 40 },
  { name: 'Stainless Steel Water Bottle', description: 'Insulated water bottle', price: 12.99, image: '', category: 'Fitness', stock: 60 },
  { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', price: 22.99, image: '', category: 'Home', stock: 25 },
  { name: 'Coffee Mug', description: 'Ceramic coffee mug', price: 8.99, image: '', category: 'Home', stock: 100 },
  { name: 'Running Shoes', description: 'Lightweight running shoes', price: 49.99, image: '', category: 'Footwear', stock: 35 },
  { name: 'Backpack', description: 'Water-resistant backpack', price: 29.99, image: '', category: 'Accessories', stock: 45 },
  { name: 'Sunglasses', description: 'UV protection sunglasses', price: 17.99, image: '', category: 'Accessories', stock: 70 },
  { name: 'Smart Watch', description: 'Fitness tracking smart watch', price: 89.99, image: '', category: 'Electronics', stock: 20 },
  { name: 'Notebook', description: 'A5 lined notebook', price: 4.99, image: '', category: 'Stationery', stock: 80 },
  { name: 'Ballpoint Pens', description: 'Pack of 10 smooth pens', price: 3.99, image: '', category: 'Stationery', stock: 120 },
  { name: 'Portable Charger', description: '10000mAh power bank', price: 24.99, image: '', category: 'Electronics', stock: 28 },
  { name: 'Travel Pillow', description: 'Memory foam travel pillow', price: 13.99, image: '', category: 'Travel', stock: 38 },
  { name: 'Wireless Keyboard', description: 'Compact wireless keyboard', price: 27.99, image: '', category: 'Electronics', stock: 32 },
  { name: 'Gaming Mouse Pad', description: 'Large mouse pad for gaming', price: 9.99, image: '', category: 'Electronics', stock: 55 },
  { name: 'Electric Kettle', description: '1.7L fast boiling kettle', price: 34.99, image: '', category: 'Home', stock: 18 },
  { name: 'T-shirt', description: '100% cotton t-shirt', price: 11.99, image: '', category: 'Clothing', stock: 75 },
  { name: 'Jeans', description: 'Slim fit jeans', price: 39.99, image: '', category: 'Clothing', stock: 42 },
  { name: 'Sneakers', description: 'Casual sneakers', price: 44.99, image: '', category: 'Footwear', stock: 29 }
];

mongoose.connect('mongodb://localhost:27017/cartdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Products seeded successfully');
  mongoose.disconnect();
})
.catch((err) => {
  console.error('Seeding failed:', err);
  mongoose.disconnect();
});
