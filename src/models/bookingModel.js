const db = require('../config/database');
const { generateBookingId } = require('../utils/formatters');

class BookingModel {
  static create(bookingData) {
    const booking = {
      id: generateBookingId(),
      fullName: String(bookingData.fullName).trim(),
      phone: bookingData.phone,
      date: bookingData.date,
      time: bookingData.time,
      guests: String(bookingData.guests),
      occasion: bookingData.occasion ? String(bookingData.occasion).trim() : '',
      notes: bookingData.notes ? String(bookingData.notes).trim() : '',
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    return db.insert(booking);
  }

  static findAll() {
    return db.findAll();
  }

  static findById(id) {
    return db.findById(id);
  }

  // For future enhancements: filter by date range
  static findByDateRange(startDate, endDate) {
    return db.findAll().filter(booking => {
      return booking.date >= startDate && booking.date <= endDate;
    });
  }
}

module.exports = BookingModel;