const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBookingMiddleware, sanitizeInput } = require('../middleware/validation');
const adminAuth = require('../middleware/auth');

// Public routes
router.post(
  '/',
  sanitizeInput,
  validateBookingMiddleware,
  bookingController.createBooking
);

// Admin routes (protected)
router.get(
  '/',
  adminAuth,
  bookingController.getAllBookings
);

router.get(
  '/:id',
  adminAuth,
  bookingController.getBookingById
);

module.exports = router;