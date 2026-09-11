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
 * @route   GET /api/reservations/availability
 * @desc    Check available table capacity for a date and time slot (Max 20 tables)
 * @access  Public
 */
router.get('/availability', async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date and time to check table availability.'
      });
    }

    const existing = await ReservationModel.find({ date, time });
    const activeReservations = (existing || []).filter(r => r.status !== 'Cancelled');
    const bookedTables = activeReservations.reduce((sum, r) => sum + (Number(r.tables) || 1), 0);
    const maxCapacity = 20;
    const availableTables = Math.max(0, maxCapacity - bookedTables);

    return res.json({
      success: true,
      maxCapacity,
      bookedTables,
      availableTables,
      isFullyBooked: availableTables === 0
    });
  } catch (error) {
    console.error('Error fetching table availability:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch table availability.'
    });
  }
});

/**
 * @route   POST /api/reservations
 * @desc    Create a new table reservation for the logged-in member (Max 20 tables allowed)
 * @access  Private (JWT Required)
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { date, time, guests, seatingArea, phone, message } = req.body;
    const numTables = parseInt(req.body.tables, 10) || 1;

    // Strict rule: More than 20 tables are not allowed
    if (numTables > 20) {
      return res.status(400).json({
        success: false,
        message: 'More than 20 tables are not allowed.'
      });
    }

    if (numTables < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least 1 table must be booked.'
      });
    }

    if (!date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reservation date, preferred time slot, and number of guests.'
      });
    }

    // Check slot capacity (Max 20 tables total per date & time)
    const existingReservations = await ReservationModel.find({ date, time });
    const activeReservations = (existingReservations || []).filter(r => r.status !== 'Cancelled');
    const bookedTablesCount = activeReservations.reduce((sum, r) => sum + (Number(r.tables) || 1), 0);

    if (bookedTablesCount + numTables > 20) {
      const remaining = Math.max(0, 20 - bookedTablesCount);
      return res.status(400).json({
        success: false,
        message: remaining === 0
          ? 'More than 20 tables are not allowed. All 20 tables are already booked for this time slot.'
          : `More than 20 tables are not allowed. Only ${remaining} table(s) remaining for this time slot.`
      });
    }

    const reservation = await ReservationModel.create({
      user: req.user.id,
      customerName: req.user.name,
      email: req.user.email,
      phone: phone || req.user.phone || 'Provided upon arrival',
      tables: numTables,
      guests,
      date,
      time,
      seatingArea: seatingArea || 'Main Dining Hall',
      message: message || ''
    });

    return res.status(201).json({
      success: true,
      message: `Table reservation confirmed successfully (${numTables} table${numTables > 1 ? 's' : ''})! Your VIP seating is guaranteed.`,
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
