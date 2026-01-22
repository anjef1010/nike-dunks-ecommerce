import express from "express"; // Changed
const router = express.Router();
import Order from "../models/Order.js"; // Added .js
import { protect } from "../middleware/authMiddleware.js"; // Added .js

// Use environment variables for URLs
const ESEWA_MERCHANT_CODE = "EPAYTEST";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

router.post("/pay", protect, async (req, res) => {
  // ... (rest of your logic)
});

router.get("/success", async (req, res) => {
    // ...
    res.redirect(`${FRONTEND_URL}/payment-success?method=eSewa&orderId=${order._id}`);
});

export default router; // Changed from module.exports