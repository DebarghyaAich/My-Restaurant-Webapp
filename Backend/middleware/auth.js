import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'dabba_jwt_secret_key_restaurant_2026';
    const decoded = jwt.verify(token, secret);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    req.user = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'dabba_jwt_secret_key_restaurant_2026';
      const decoded = jwt.verify(token, secret);
      const user = await UserModel.findById(decoded.id);
      if (user) {
        req.user = {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    }
  } catch (err) {
    // optional token failure does not block guest
  }
  next();
};
