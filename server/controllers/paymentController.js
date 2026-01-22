import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js'; // Ensure .js is here
import axios from 'axios';

// ------------------ Khalti Payment ------------------
export const verifyKhaltiPayment = asyncHandler(async (req, res) => {
  const { token, amount, orderId } = req.body;

  try {
    const response = await axios.post(
      'https://khalti.com/api/v2/payment/verify/',
      { token, amount },
      { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` } }
    );

    if (response.data.state.name === 'Completed') {
      const order = await Order.findById(orderId);
      if (!order) {
         return res.status(404).json({ success: false, message: 'Order not found' });
      }
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: token,
        status: 'success',
        update_time: new Date().toISOString(),
        email_address: order.user?.email || 'customer@archive.com',
      };
      await order.save();
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Khalti payment not completed' });
    }
  } catch (err) {
    console.error("Khalti Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------ eSewa Payment ------------------
export const verifyEsewaPayment = asyncHandler(async (req, res) => {
  const { orderId, amt, scd, pid, refId } = req.query;
  
  // Use Environment Variable for the Frontend URL
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const verifyUrl = `https://uat.esewa.com.np/epay/transrec`;
  const params = new URLSearchParams({
    amt,
    scd,
    pid,
    rid: refId
  });

  try {
    const response = await axios.post(verifyUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.data.includes('Success')) {
      const order = await Order.findById(orderId);
      if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: refId,
            status: 'success',
            update_time: new Date().toISOString(),
            email_address: order.user?.email || 'customer@archive.com',
          };
          await order.save();
      }
      // Redirect to production Vercel URL
      res.redirect(`${frontendUrl}/payment-success?method=eSewa`);
    } else {
      res.redirect(`${frontendUrl}/payment-failed?method=eSewa`);
    }
  } catch (err) {
    console.error("eSewa Error:", err);
    res.redirect(`${frontendUrl}/payment-failed?method=eSewa`);
  }
});