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
    const rawTables = req.body.tables;
    const numTables = rawTables !== undefined ? parseInt(rawTables, 10) : 1;

    if (isNaN(numTables) || numTables < 1) {
      return res.status(400).json({
        success: false,
        message: 'At least 1 table must be booked.'
      });
    }

    // Strict rule: More than 20 tables are not allowed
    if (numTables > 20) {
      return res.status(400).json({
        success: false,
        message: 'More than 20 tables are not allowed.'
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

// PUT /api/reservations/:id/status (Admin or user to update reservation status)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Confirmed', 'Seated', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation status.'
      });
    }

    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.'
      });
    }

    // Only Admin or the booking owner can update
    if (req.user.role !== 'Admin' && reservation.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot update this reservation.'
      });
    }

    const updated = await ReservationModel.findByIdAndUpdate(req.params.id, { status });
    return res.json({
      success: true,
      message: `Reservation status updated to ${status}.`,
      reservation: updated
    });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not update reservation status.'
    });
  }
});

// DELETE /api/reservations/:id (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const removed = await ReservationModel.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found.'
      });
    }
    return res.json({
      success: true,
      message: 'Reservation cancelled and deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not delete reservation.'
    });
  }
});

export default router;
