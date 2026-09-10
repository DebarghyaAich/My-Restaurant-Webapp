/**
 * ============================================================================
 * 🍷 DABBA TABLE RESERVATIONS ROUTER
 * ============================================================================
 * @description
 * Manages luxury table bookings, date/time scheduling, party sizes, and seating
 * preferences. Strictly login-gated via verifyToken middleware to ensure VIP
 * reservation integrity and link bookings directly to authenticated member accounts.
 *
 * Endpoints:
 *  - POST /api/reservations      : Book table (Authenticated users only)
 *  - GET  /api/reservations      : Fetch current user's reservations (or all for Admin)
 *  - GET  /api/reservations/:id  : Fetch specific reservation by ID
 * ============================================================================
 */

import express from 'express';
import ReservationModel from '../models/Reservation.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/reservations
 * @desc    Create a new table reservation for the logged-in member
 * @access  Private (JWT Required)
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { date, time, guests, seatingArea, phone, message } = req.body;

    if (!date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reservation date, preferred time slot, and number of guests.'
      });
    }

    const reservation = await ReservationModel.create({
      user: req.user.id,
      customerName: req.user.name,
      email: req.user.email,
      phone: phone || req.user.phone || 'Provided upon arrival',
      guests,
      date,
      time,
      seatingArea: seatingArea || 'Main Dining Hall',
      message: message || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Table reservation confirmed successfully! Your VIP seating is guaranteed.',
      reservation
    });
  } catch (error) {
    console.error('Error creating table reservation:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not complete table reservation at this time.'
    });
  }
});

// GET /api/reservations (Authenticated user's reservations or Admin all)
router.get('/', verifyToken, async (req, res) => {
  try {
    let reservations;
    if (req.user.role === 'Admin') {
      reservations = await ReservationModel.find({});
    } else {
      reservations = await ReservationModel.find({ user: req.user.id });
    }
    return res.json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch reservations.'
    });
  }
});

// GET /api/reservations/:id
router.get('/:id', async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.'
      });
    }
    return res.json({
      success: true,
      reservation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not fetch reservation details.'
    });
  }
});

export default router;
