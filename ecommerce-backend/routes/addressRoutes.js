const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { protect } = require('../middleware/auth');

// Get all addresses for a user
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new address
router.post('/', protect, async (req, res) => {
  try {
    const address = new Address({
      ...req.body,
      user: req.user._id
    });
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update address
router.put('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete address
router.delete('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
