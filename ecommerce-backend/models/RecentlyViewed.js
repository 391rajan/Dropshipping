const mongoose = require('mongoose');

const recentlyViewedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamps
recentlyViewedSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Limit the number of recently viewed products
recentlyViewedSchema.pre('save', function(next) {
  if (this.products.length > 20) {
    this.products = this.products.slice(0, 20);
  }
  next();
});

module.exports = mongoose.model('RecentlyViewed', recentlyViewedSchema);
