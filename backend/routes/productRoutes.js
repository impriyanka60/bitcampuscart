const express = require('express');
const router = express.Router();

const {
  addProduct,
  getProducts,
  getMyProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');

// Add a product (protected)
router.post('/', protect, addProduct);

// Get all products (public with filters)
router.get('/', getProducts);

// Get logged-in user's products
router.get('/my-products', protect, getMyProducts);

// Update a product
router.put('/:id', protect, updateProduct);

// Delete a product
router.delete('/:id', protect, deleteProduct);

module.exports = router;
