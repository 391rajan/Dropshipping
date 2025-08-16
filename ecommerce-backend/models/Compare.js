const mongoose = require('mongoose');

const compareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
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
compareSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Limit the number of products that can be compared
compareSchema.pre('save', function(next) {
  if (this.products.length > 4) {
    this.products = this.products.slice(0, 4);
  }
  next();
});

module.exports = mongoose.model('Compare', compareSchema);
