const StockNotification = require('../models/StockNotification');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

exports.createStockNotification = async (req, res) => {
  const { productId, email } = req.body;
  const userId = req.user ? req.user._id : null;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock > 0) {
      return res.status(400).json({ message: 'Product is already in stock' });
    }

    const existingNotification = await StockNotification.findOne({ product: productId, email });
    if (existingNotification) {
      return res.status(400).json({ message: 'You have already requested a notification for this product' });
    }

    const notification = new StockNotification({
      user: userId,
      product: productId,
      email,
    });

    await notification.save();

    res.status(201).json({ message: 'You will be notified when the product is back in stock' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating stock notification', error: error.message });
  }
};

exports.sendStockNotifications = async (req, res) => {
  try {
    const notifications = await StockNotification.find({ notified: false }).populate('product');

    for (const notification of notifications) {
      if (notification.product.stock > 0) {
        const message = `The product ${notification.product.name} is back in stock. You can purchase it here: ${req.protocol}://${req.get('host')}/product/${notification.product._id}`;

        await sendEmail({
          to: notification.email,
          subject: `Product back in stock: ${notification.product.name}`,
          text: message,
        });

        notification.notified = true;
        await notification.save();
      }
    }

    res.status(200).json({ message: 'Stock notifications sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending stock notifications', error: error.message });
  }
};
