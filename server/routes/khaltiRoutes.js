import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/create", async (req, res) => {
  const { amount, productIdentity, productName } = req.body;

  if (!amount || !productIdentity || !productName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const response = await axios.post(
      "https://khalti.com/api/v2/payment/initiate/",
      {
        amount,
        product_identity: productIdentity,
        product_name: productName,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, // secret key
        },
      }
    );

    res.json(response.data); // returns token for frontend
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: err.response?.data || err.message,
    });
  }
});

export default router;