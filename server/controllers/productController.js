import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js'; // Fixed casing to 'Product.js'
import multer from 'multer';
import path from 'path';

// Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `product-${Date.now()}${path.extname(file.originalname)}`)
});

export const upload = multer({ storage });

// @desc    Get all products
export const getProducts = asyncHandler(async (req, res) => {
  // If the DB isn't connected or the model casing is wrong, this line throws the 500 error
  const products = await Product.find({});
  res.json({ success: true, products });
});

// @desc    Get single product
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json({ success: true, product });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, countInStock } = req.body;
  const product = new Product({
    user: req.user._id,
    name,
    description,
    price,
    category,
    countInStock,
    image: req.file ? `/uploads/${req.file.filename}` : '/uploads/sample.jpg'
  });
  const createdProduct = await product.save();
  res.status(201).json({ success: true, product: createdProduct });
});

export const updateProduct = asyncHandler(async (req, res) => { /* logic */ });
export const deleteProduct = asyncHandler(async (req, res) => { /* logic */ });