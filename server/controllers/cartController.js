import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Added .js extension

// @desc    Get user cart
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user.cartItems);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { product, name, image, price, qty } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    const existItem = user.cartItems.find((x) => x.product.toString() === product);
    if (existItem) {
      existItem.qty = qty;
    } else {
      user.cartItems.push({ product, name, image, price, qty });
    }
    await user.save();
    res.status(201).json(user.cartItems);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.cartItems = user.cartItems.filter((x) => x.product.toString() !== req.params.id);
    await user.save();
    res.json(user.cartItems);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});