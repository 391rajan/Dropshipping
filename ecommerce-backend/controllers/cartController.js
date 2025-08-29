const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Helper function to calculate cart totals and apply coupons
const _calculateCartTotals = async (cart) => {
  let subtotal = 0;
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      subtotal += product.price * item.quantity;
    } else {
      // Handle case where product might have been deleted
      // For now, we'll just skip it or remove it from cart
      cart.items = cart.items.filter(i => i.product.toString() !== item.product.toString());
    }
  }
  cart.subtotal = subtotal;

  let discount = 0;
  if (cart.appliedCoupon) {
    const coupon = await Coupon.findById(cart.appliedCoupon);
    if (coupon && coupon.isActive && coupon.endDate >= new Date() && (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)) {
      if (coupon.minCartValue && cart.subtotal < coupon.minCartValue) {
        // Coupon no longer valid due to min cart value
        cart.appliedCoupon = undefined;
      } else {
        if (coupon.discountType === 'percentage') {
          discount = (cart.subtotal * coupon.value) / 100;
          if (coupon.maxDiscountValue && discount > coupon.maxDiscountValue) {
            discount = coupon.maxDiscountValue;
          }
        } else if (coupon.discountType === 'fixed_amount') {
          discount = coupon.value;
        }
      }
    } else {
      // Coupon is no longer valid (expired, used up, or deleted)
      cart.appliedCoupon = undefined;
    }
  }
  cart.discount = discount;
  cart.total = Math.max(0, cart.subtotal - cart.discount);
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product').populate('appliedCoupon');

    if (!cart) {
      cart = new Cart({ user: req.user._id });
      await cart.save();
    }

    await _calculateCartTotals(cart);
    await cart.save(); // Save updated totals and potentially removed coupon

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = product.price; // Update price in case it changed
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await _calculateCartTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await _calculateCartTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1); // Remove if quantity is 0 or less
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await _calculateCartTotals(cart);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item quantity', error: error.message });
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/cart/apply-coupon
// @access  Private
exports.applyCouponToCart = async (req, res) => {
  const { couponCode } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    if (coupon.minCartValue && cart.subtotal < coupon.minCartValue) {
      return res.status(400).json({ message: `Minimum cart value of ${coupon.minCartValue} required` });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    cart.appliedCoupon = coupon._id;
    await _calculateCartTotals(cart);
    await cart.save();

    res.json({ message: 'Coupon applied successfully', cart });

  } catch (error) {
    res.status(500).json({ message: 'Error applying coupon', error: error.message });
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/remove-coupon
// @access  Private
exports.removeCouponFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.appliedCoupon = undefined;
    await _calculateCartTotals(cart);
    await cart.save();

    res.json({ message: 'Coupon removed successfully', cart });

  } catch (error) {
    res.status(500).json({ message: 'Error removing coupon', error: error.message });
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.appliedCoupon = undefined;
    await _calculateCartTotals(cart);
    await cart.save();

    res.json({ message: 'Cart cleared successfully', cart });

  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};