import express from 'express';
import UserModel from '../models/User.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users (Admin Only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await UserModel.find({});
    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch users list.' });
  }
});

// DELETE /api/users/:id (Admin Only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    // Prevent admin from deleting their own currently logged-in account
    if (targetUserId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own active administrator account.' });
    }

    const deleted = await UserModel.findByIdAndDelete(targetUserId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
});

export default router;
