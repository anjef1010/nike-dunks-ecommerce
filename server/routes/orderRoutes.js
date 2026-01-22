import express from "express";
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc   Create order / Get all orders
router.route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// @desc   Get logged in user orders (MUST be above /:id)
router.get("/myorders", protect, getMyOrders);

// @desc   Get order by ID
router.get("/:id", protect, getOrderById);

export default router;