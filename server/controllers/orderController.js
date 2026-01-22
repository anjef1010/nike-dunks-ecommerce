import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc   Create new order
// @route  POST /api/orders
// @access Private
export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user?._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get logged in user orders
// @route  GET /api/orders/myorders
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all orders (Admin only)
// @route  GET /api/orders
// @access Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get order by ID
// @route  GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update order to paid (Crucial for eSewa/Khalti)
// @route  PUT /api/orders/:id/pay
// @access Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};