import express from 'express';
import { verifyKhaltiPayment, verifyEsewaPayment } from '../controllers/paymentController.js';
const router = express.Router();

// Khalti verification
router.post('/khalti/verify', verifyKhaltiPayment);

// eSewa verification
router.get('/esewa/success', verifyEsewaPayment);
router.get('/esewa/failure', (req, res) => {
  res.redirect(`http://localhost:3000/payment-failed?method=eSewa`);
});

export default router;
