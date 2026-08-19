const { REFERENCE_PREFIX } = require('../config/constants');

function normalizePhone(raw) {
  const v = String(raw).replace(/[\s-]/g, '');
  if (v.startsWith('+254')) return v;
  if (v.startsWith('254')) return '+' + v;
  if (v.startsWith('0')) return '+254' + v.slice(1);
  return v;
}

function generateBookingId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${REFERENCE_PREFIX}${timestamp}-${random}`;
}

function formatCurrency(amount) {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

function formatBookingMessage(booking) {
  return (
    `*New Reservation — Urban Palate*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 Name: ${booking.fullName}\n` +
    `📱 Phone: ${booking.phone}\n` +
    `📅 Date: ${booking.date}\n` +
    `⏰ Time: ${booking.time}\n` +
    `👥 Guests: ${booking.guests}\n` +
    (booking.occasion ? `🎉 Occasion: ${booking.occasion}\n` : '') +
    (booking.notes ? `📝 Notes: ${booking.notes}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔑 Ref: ${booking.id}`
  );
}

function formatDateForDisplay(date) {
  return new Date(date).toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

module.exports = {
  normalizePhone,
  generateBookingId,
  formatCurrency,
  formatBookingMessage,
  formatDateForDisplay
};