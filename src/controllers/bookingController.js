const BookingModel = require('../models/bookingModel');
const whatsappService = require('../services/whatsappService');
const { normalizePhone } = require('../utils/formatters');
const { AppError } = require('../middleware/errorHandler');

class BookingController {
  async createBooking(req, res, next) {
    try {
      // Normalize phone number
      const bookingData = {
        ...req.body,
        phone: normalizePhone(req.body.phone)
      };

      // Create booking
      const booking = BookingModel.create(bookingData);

      // Send WhatsApp notification (non-blocking)
      whatsappService.sendBookingNotification(booking)
        .then(result => {
          if (!result.sent) {
            console.warn(`Booking ${booking.id} saved but WhatsApp failed:`, result.reason);
          }
        })
        .catch(err => {
          console.error(`WhatsApp error for booking ${booking.id}:`, err.message);
        });

      res.status(201).json({
        success: true,
        id: booking.id,
        message: 'Reservation confirmed!',
        booking: {
          id: booking.id,
          date: booking.date,
          time: booking.time,
          guests: booking.guests
        }
      });

    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const bookings = BookingModel.findAll();
      res.json({
        success: true,
        count: bookings.length,
        bookings
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  async getBookingById(req, res, next) {
    try {
      const booking = BookingModel.findById(req.params.id);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }
      res.json({
        success: true,
        booking
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();