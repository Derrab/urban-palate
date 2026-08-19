module.exports = {
  RESTAURANT_NAME: 'Urban Palate',
  BOOKINGS_FILE: 'bookings.json',
  KENYAN_PHONE_REGEX: /^(?:\+254|254|0)(7|1)\d{8}$/,
  TIME_SLOTS: {
    start: 12, // 12:00 PM
    end: 22,   // 10:00 PM
    interval: 30 // minutes
  },
  MAX_BOOKING_DAYS: 60,
  MIN_NAME_LENGTH: 2,
  REFERENCE_PREFIX: 'UP-'
};