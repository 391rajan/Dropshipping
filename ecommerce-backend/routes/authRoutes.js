const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/authController");
const { protect, admin } = require('../middleware/auth');

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);

// User management routes (Admin only)
router.route('/users')
  .get(protect, admin, getAllUsers);
  
router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
