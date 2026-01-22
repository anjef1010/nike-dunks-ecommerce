import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js'; // Ensure .js extension
import { protect, admin } from '../middleware/authMiddleware.js'; // Use 'admin', not 'authorize'

const router = express.Router();

// @desc    Get all users / Admin only
router.route('/')
  .get(protect, admin, getUsers);

// @desc    Get, Update, Delete specific user
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;