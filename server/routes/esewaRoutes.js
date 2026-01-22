const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

// eSewa Test Credentials
const ESEWA_MERCHANT_CODE = "EPAYTEST";
const ESEWA_RETURN_URL = "http://localhost:5001/api/payment/esewa/success";
const ESEWA_FAIL_URL = "http://localhost:5001/api/payment/esewa/failure";

// --- 1. Redirect to eSewa payment ---
router.post("/pay", protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const amount = order.totalPrice || order.itemsPrice + order.shippingPrice;

    // Build eSewa URL
    const params = new URLSearchParams({
      amt: amount,
      psc: "0",
      pdc: "0",
      tAmt: amount,
      pid: order._id.toString(),
      scd: ESEWA_MERCHANT_CODE,
      su: ESEWA_RETURN_URL,
      fu: ESEWA_FAIL_URL,
    });

    res.json({
      esewaUrl: `https://uat.esewa.com.np/epay/main?${params.toString()}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 2. Success callback ---
router.get("/success", async (req, res) => {
  try {
    const { pid, refId } = req.query; // pid = orderId
    if (!pid) return res.status(400).send("Missing orderId");

    const order = await Order.findById(pid);
    if (!order) return res.status(404).send("Order not found");

    // Test mode: automatically mark paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: `ESEWA-${refId || Date.now()}`,
      status: "success",
      update_time: new Date().toISOString(),
      email_address: order.userEmail || "demo@test.com",
    };

    await order.save();

    res.redirect(`http://localhost:3000/payment-success?method=eSewa&orderId=${order._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// --- 3. Failure callback ---
router.get("/failure", (req, res) => {
  res.redirect("http://localhost:3000/payment-failed?method=eSewa");
});

module.exports = router;
