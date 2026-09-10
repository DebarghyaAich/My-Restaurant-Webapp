/**
 * ============================================================================
 * 🍽️ DABBA RESTAURANT APPLICATION - BACKEND API MONOLITH SERVER
 * ============================================================================
 * @description
 * High-performance Express.js API backend powering the Dabba MERN ecosystem.
 * Supports dual-mode persistence:
 *  1. Production MongoDB via Mongoose ORM.
 *  2. Resilient file-backed persistent store (data/local_db.json) with auto-seeding.
 *
 * Core Subsystems & Endpoints:
 *  - Authentication & RBAC: /api/auth (JWT, BCrypt, Admin & User roles)
 *  - Culinary Menu Engine: /api/menu-items (Indian, Japanese, Chinese, Continental, etc.)
 *  - VIP Reservations: /api/reservations (Login-gated, instant confirmation codes)
 *  - Orders & Checkout: /api/orders (Dispatches, real-time lifecycle tracking)
 *  - Operational Analytics: /api/stats (Revenue, sales distribution, popular items)
 *  - Static Asset Delivery: /uploads & Production Vite client bundle (/dist)
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { seedDatabase } from './utils/seed.js';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import statRoutes from './routes/statRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (allows frontend from Vercel, Render, localhost, or custom domains)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists and serve statically
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu-items', menuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statRoutes);
app.use('/api/reservations', reservationRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Dabba Restaurant Monolith',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production
const distDir = path.join(__dirname, '../Frontend/dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server & Initialize Database
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 [Dabba Monolith Server] Running on http://localhost:${PORT}`);
      console.log(`🍛 Menu APIs available at: http://localhost:${PORT}/api/menu-items`);
      console.log(`🔐 Auth APIs available at: http://localhost:${PORT}/api/auth`);
      console.log(`🛒 Order APIs available at: http://localhost:${PORT}/api/orders`);
    });
  } catch (error) {
    console.error('Failed to start Dabba server:', error);
    process.exit(1);
  }
};

startServer();
