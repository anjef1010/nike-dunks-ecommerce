// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming your User model path
const Order = require('../models/Order'); // Assuming your Order model path
const { protect, authorize } = require('../middleware/authMiddleware'); // Your authentication middleware

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Fetch all users, exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    res.status(500).json({ message: 'Server Error: Could not fetch users' });
  }
});

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Optional: Prevent deleting the super admin or yourself if logged in
      if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete yourself or another admin directly from this interface if they are the last admin.' });
      }
      await User.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user for admin:', error);
    res.status(500).json({ message: 'Server Error: Could not delete user' });
  }
});


// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, authorize('admin'), async (req, res) => {
  try {
    // Fetch all orders and populate the 'user' field to get user details
    // We select 'name' and 'email' from the user to display in the frontend
    const orders = await Order.find({})
      .populate('user', 'name email') // 'user' is the field to populate, 'name email' are the fields from the User model to include
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders for admin:', error);
    res.status(500).json({ message: 'Server Error: Could not fetch orders' });
  }
});

// @desc    Update order status (e.g., mark delivered) (Admin only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
router.put('/orders/:id/status', protect, authorize('admin'), async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (status === 'pending') {
        order.isDelivered = false;
        order.deliveredAt = undefined; // Clear deliveredAt if set to pending
      }
      // You can add more status updates here (e.g., isPaid)

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server Error: Could not update order status' });
  }
});


module.exports = router;