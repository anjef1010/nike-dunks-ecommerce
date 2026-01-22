// server/routes/authRoutes.js
import express from 'express';
// REMOVE getUserProfile from this list
import { loginUser, registerUser, getMe } from '../controllers/authController.js'; 
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe); 

// REMOVE any line that looks like: router.get('/profile', protect, getUserProfile);

export default router;