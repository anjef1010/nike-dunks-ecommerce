const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartItemQty,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/cart/add
// @desc    Add item to user's cart
// @access  Private
router.post('/add', protect, addToCart);

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get('/', protect, getCartItems);

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from user's cart
// @access  Private
router.delete('/remove/:productId', protect, removeFromCart);

// @route   PUT /api/cart/update-qty
// @desc    Update quantity of item in cart
// @access  Private
router.put('/update-qty', protect, updateCartItemQty);

// @route   POST /api/cart/clear
// @desc    Clear user's cart
// @access  Private
router.post('/clear', protect, clearCart);


export default router;