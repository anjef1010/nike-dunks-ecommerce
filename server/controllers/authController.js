import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    Helper to send token in HTTP-only cookie and JSON response
 * @param   {Object} user - User object from DB
 * @param   {Number} statusCode - HTTP status
 * @param   {Object} res - Express response object
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevents XSS attacks
    secure: true,   // Required for HTTPS on Render
    sameSite: 'none' // Required for cross-site (Vercel to Render)
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token, // Token included in body for frontend storage/logic
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user'
  });

  if (user) {
    sendTokenResponse(user, 201, res);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  // This line handles both formats: {email, password} OR {email: {email, password}}
  const email = req.body.email?.email || req.body.email;
  const password = req.body.email?.password || req.body.password;
  console.log("Data received:", email, password);

  console.log(`Attempting login for: ${email}`);

  // Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // This helper sends the HTTP-only cookie
    sendTokenResponse(user, 200, res);
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Logout user / Clear Cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });

  res.status(200).json({ success: true, message: 'User logged out' });
});
