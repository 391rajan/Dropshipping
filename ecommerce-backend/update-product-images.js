const mongoose = require('mongoose');
const Product = require('./models/Product');
const config = require('./config');

const IMAGE_URL_TO_ADD = 'https://www.apple.com/in/iphone/home/images/meta/iphone__ky2k6x5u6vue_og.png?202206222215';

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected for image update script');

  try {
    // Find products that have no images or an empty images array
    // You can adjust this query to target specific products, e.g., by name or category
    const filter = {
      $or: [
        { images: { $exists: false } }, // Products where the 'images' field does not exist
        { images: { $size: 0 } }       // Products where the 'images' array is empty
      ]
    };

    // Optional: Add a filter to target specific products, e.g., by name
    // filter.name = { $regex: /iphone/i }; // Case-insensitive search for 'iphone' in product name

    const updateResult = await Product.updateMany(
      filter,
      { $addToSet: { images: IMAGE_URL_TO_ADD } } // $addToSet adds the URL only if it's not already present
    );

    console.log(`Updated ${updateResult.nModified} products.`);

  } catch (error) {
    console.error('Error updating product images:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
})
.catch((err) => {
  console.error('MongoDB connection failed:', err);
  mongoose.disconnect();
});
