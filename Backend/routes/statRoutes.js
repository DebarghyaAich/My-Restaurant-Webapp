import express from 'express';
import MenuItemModel from '../models/MenuItem.js';
import UserModel from '../models/User.js';
import OrderModel from '../models/Order.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats (Admin Only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalMenuItems = await MenuItemModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();
    const totalOrders = await OrderModel.countDocuments();

    const allOrders = await OrderModel.find({});
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
    const preparingOrders = allOrders.filter(o => o.status === 'Preparing').length;
    const deliveredOrders = allOrders.filter(o => o.status === 'Delivered').length;

    const recentOrders = allOrders.slice(0, 5);

    return res.json({
      success: true,
      stats: {
        totalMenuItems,
        totalUsers,
        totalOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        pendingOrders,
        preparingOrders,
        deliveredOrders,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error computing dashboard statistics:', error);
    return res.status(500).json({ success: false, message: 'Could not load statistics.' });
  }
});

export default router;
