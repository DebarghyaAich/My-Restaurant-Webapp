import express from 'express';
import OrderModel from '../models/Order.js';
import { verifyToken, isAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders (Authenticated users only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { customerDetails, items, subtotal, tax, deliveryFee, totalAmount, paymentMethod } = req.body;

    if (!customerDetails || !customerDetails.fullName || !customerDetails.email || !customerDetails.phone || !customerDetails.address) {
      return res.status(400).json({ success: false, message: 'Please complete all required customer billing details.' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Please select a payment method.' });
    }

    const order = await OrderModel.create({
      user: req.user ? req.user.id : null,
      customerDetails,
      items,
      subtotal: Number(subtotal),
      tax: Number(tax),
      deliveryFee: Number(deliveryFee || 0),
      totalAmount: Number(totalAmount),
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ success: false, message: 'Could not complete order placement.' });
  }
});

// GET /api/orders (Authenticated user's orders or Admin all orders)
router.get('/', verifyToken, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'Admin') {
      orders = await OrderModel.find({});
    } else {
      orders = await OrderModel.find({ user: req.user.id });
    }
    return res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch orders.' });
  }
});

// GET /api/orders/:id (Order Details / Receipt / Invoice)
router.get('/:id', async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not fetch order details.' });
  }
});

// PUT /api/orders/:id/status (Admin Only)
router.put('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, update);
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

export default router;
