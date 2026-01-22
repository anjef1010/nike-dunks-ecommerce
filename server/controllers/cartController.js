import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; 
import Product from '../models/Product.js'; // FIX: Changed 'product.js' to 'Product.js'

/**
 * @desc    Add item to user's cart
 * @route   POST /api/cart/add
 * @access  Private
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  // Use the Uppercase Product model
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    const existingItemIndex = user.cartItems.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      user.cartItems[existingItemIndex].qty += qty;
    } else {
      user.cartItems.push({
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: qty,
      });
    }

    await user.save();
    res.status(200).json(user.cartItems);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get user's cart items
 * @route   GET /api/cart
 * @access  Private
 */
export const getCartItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('cartItems');

  if (user) {
    res.status(200).json(user.cartItems);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Remove item from user's cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);

  if (user) {
    user.cartItems = user.cartItems.filter(
      (item) => item.product.toString() !== productId.toString()
    );
    await user.save();
    res.status(200).json(user.cartItems);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update quantity of item in cart
 * @route   PUT /api/cart/update-qty
 * @access  Private
 */
export const updateCartItemQty = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  if (qty <= 0) {
    res.status(400);
    throw new Error('Quantity must be a positive number');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    const itemToUpdate = user.cartItems.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemToUpdate) {
      itemToUpdate.qty = qty;
      await user.save();
      res.status(200).json(user.cartItems);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Clear user's cart
 * @route   POST /api/cart/clear
 * @access  Private
 */
export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.cartItems = []; 
    await user.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});