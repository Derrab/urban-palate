const BookingModel = require('../models/bookingModel');
const whatsappService = require('./whatsappService');
const { normalizePhone, formatBookingMessage } = require('../utils/formatters');
const { AppError } = require('../middleware/errorHandler');

class BookingService {
  /**
   * Create a new booking
   * @param {Object} bookingData - The booking data from the request
   * @returns {Object} The created booking
   */
  async createBooking(bookingData) {
    try {
      // Normalize phone number
      const normalizedData = {
        ...bookingData,
        phone: normalizePhone(bookingData.phone)
      };

      // Create booking in database
      const booking = BookingModel.create(normalizedData);

      // Send WhatsApp notification (fire and forget - non-blocking)
      this._sendWhatsAppNotification(booking).catch(err => {
        console.error(`[BookingService] WhatsApp notification failed for ${booking.id}:`, err.message);
      });

      return booking;

    } catch (error) {
      console.error('[BookingService] Error creating booking:', error.message);
      throw new AppError('Failed to create booking', 500);
    }
  }

  /**
   * Get all bookings
   * @returns {Array} List of all bookings
   */
  async getAllBookings() {
    try {
      return BookingModel.findAll();
    } catch (error) {
      console.error('[BookingService] Error fetching bookings:', error.message);
      throw new AppError('Failed to fetch bookings', 500);
    }
  }

  /**
   * Get a booking by ID
   * @param {string} id - Booking ID
   * @returns {Object} The booking
   */
  async getBookingById(id) {
    try {
      const booking = BookingModel.findById(id);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }
      return booking;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('[BookingService] Error fetching booking:', error.message);
      throw new AppError('Failed to fetch booking', 500);
    }
  }

  /**
   * Get bookings by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Array} List of bookings in date range
   */
  async getBookingsByDateRange(startDate, endDate) {
    try {
      return BookingModel.findByDateRange(startDate, endDate);
    } catch (error) {
      console.error('[BookingService] Error fetching bookings by date:', error.message);
      throw new AppError('Failed to fetch bookings by date', 500);
    }
  }

  /**
   * Send WhatsApp notification for a booking
   * @param {Object} booking - The booking object
   * @returns {Object} Result of the WhatsApp send attempt
   */
  async _sendWhatsAppNotification(booking) {
    try {
      const result = await whatsappService.sendBookingNotification(booking);
      
      if (!result.sent) {
        console.warn(`[BookingService] WhatsApp notification failed for ${booking.id}:`, result.reason);
      } else {
        console.log(`[BookingService] WhatsApp notification sent for ${booking.id}`);
      }
      
      return result;
      
    } catch (error) {
      console.error(`[BookingService] Error sending WhatsApp for ${booking.id}:`, error.message);
      return { sent: false, reason: error.message };
    }
  }

  /**
   * Format booking data for API response
   * @param {Object} booking - The booking object
   * @returns {Object} Formatted booking response
   */
  formatBookingResponse(booking) {
    return {
      success: true,
      id: booking.id,
      message: 'Reservation confirmed!',
      booking: {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
        status: booking.status || 'confirmed'
      }
    };
  }

  /**
   * Get booking statistics
   * @returns {Object} Statistics about bookings
   */
  async getBookingStats() {
    try {
      const bookings = await this.getAllBookings();
      const today = new Date().toISOString().split('T')[0];
      
      const stats = {
        total: bookings.length,
        today: bookings.filter(b => b.date === today).length,
        upcoming: bookings.filter(b => b.date >= today).length,
        byDate: {}
      };

      // Group by date
      bookings.forEach(booking => {
        if (!stats.byDate[booking.date]) {
          stats.byDate[booking.date] = 0;
        }
        stats.byDate[booking.date]++;
      });

      return stats;
      
    } catch (error) {
      console.error('[BookingService] Error fetching stats:', error.message);
      throw new AppError('Failed to fetch booking statistics', 500);
    }
  }

  /**
   * Cancel a booking
   * @param {string} id - Booking ID
   * @returns {Object} Result of cancellation
   */
  async cancelBooking(id) {
    try {
      const booking = await this.getBookingById(id);
      
      // For file-based storage, we need to implement soft delete
      // This is a placeholder for future implementation
      // When using MongoDB, we would update the status field
      
      // For now, we'll just return the booking
      // In a real implementation, you would update the status to 'cancelled'
      console.log(`[BookingService] Booking ${id} cancelled (soft delete placeholder)`);
      
      return {
        success: true,
        message: 'Booking cancelled successfully',
        booking
      };
      
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('[BookingService] Error cancelling booking:', error.message);
      throw new AppError('Failed to cancel booking', 500);
    }
  }

  /**
   * Update booking notes
   * @param {string} id - Booking ID
   * @param {string} notes - New notes
   * @returns {Object} Updated booking
   */
  async updateBookingNotes(id, notes) {
    try {
      const booking = await this.getBookingById(id);
      
      // For file-based storage, we need to implement update
      // This is a placeholder for future implementation
      // In a real implementation, you would update the notes field
      
      console.log(`[BookingService] Booking ${id} notes updated:`, notes);
      
      return {
        success: true,
        message: 'Booking notes updated successfully',
        booking: {
          ...booking,
          notes
        }
      };
      
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('[BookingService] Error updating booking notes:', error.message);
      throw new AppError('Failed to update booking notes', 500);
    }
  }
}

module.exports = new BookingService();