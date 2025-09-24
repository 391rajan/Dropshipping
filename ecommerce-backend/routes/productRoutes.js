const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.get('/deals', asyncHandler(productController.getDealProducts));
// Public routes - specific routes must come before dynamic routes like /:id
router.get('/search/suggestions', asyncHandler(productController.getSearchSuggestions));
router.get('/search', asyncHandler(productController.searchProducts));

// Admin-only route
router.get('/count', protect, admin, asyncHandler(productController.getProductCount));

router.route('/')
  .get(asyncHandler(productController.getProducts))
  // Admin-only route
  .post(protect, admin, asyncHandler(productController.createProduct));

// Image upload route
router.post('/upload', protect, admin, upload.array('images', 5), (req, res) => {
  const filePaths = req.files.map(file => `uploads/${file.filename}`);
  res.status(201).json({ message: 'Images uploaded successfully', images: filePaths });
});

router.post('/:id/recently-viewed', protect, asyncHandler(productController.addToRecentlyViewed));

router.route('/:id')
  .get(asyncHandler(productController.getProductById))
  // Admin-only routes
  .put(protect, admin, asyncHandler(productController.updateProduct))
  .delete(protect, admin, asyncHandler(productController.deleteProduct));

module.exports = router;