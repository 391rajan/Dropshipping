const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser, // Added missing import
  getUserCount,
  getProfile,
} = require("../controllers/authController");
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');

const passport = require('passport');

// Google auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);


router.post("/signup", [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ], asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password/:token", asyncHandler(resetPassword));

router.get('/profile', protect, asyncHandler(getProfile));

// Admin routes for user management
// IMPORTANT: Specific routes like '/count' must come before dynamic routes like '/:id'
router.get('/users/count', protect, admin, asyncHandler(getUserCount));
router.route('/users').get(protect, admin, asyncHandler(getAllUsers));

router.route('/users/:id')
  .get(protect, admin, asyncHandler(getUserById))
  .put(protect, admin, asyncHandler(updateUser))
  .delete(protect, admin, asyncHandler(deleteUser));

module.exports = router;
