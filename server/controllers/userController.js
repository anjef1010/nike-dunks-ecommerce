import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all users
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
});

// @desc    Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        // Ensure consistency: if your DB uses 'role', use user.role.
        // If it uses isAdmin (boolean), this code is perfect:
        if (req.body.isAdmin !== undefined) {
            user.isAdmin = req.body.isAdmin;
        }
        
        // Optional: If you use roles instead of isAdmin boolean:
        // user.role = req.body.role || user.role;

        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
// @desc    Delete user
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('You cannot delete your own admin account');
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});