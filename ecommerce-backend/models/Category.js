const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter category name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: String,
    slug: String
  }],
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ 'ancestors._id': 1 });

// Update timestamps pre-save
categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to update ancestors
categorySchema.pre('save', async function(next) {
  if (this.parent) {
    const parent = await this.constructor.findById(this.parent);
    if (parent) {
      this.ancestors = [
        ...parent.ancestors,
        {
          _id: parent._id,
          name: parent.name,
          slug: parent.slug
        }
      ];
    }
  } else {
    this.ancestors = [];
  }
  next();
});

// Virtual for child categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
});

// Virtual for products in this category
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

module.exports = mongoose.model('Category', categorySchema);
