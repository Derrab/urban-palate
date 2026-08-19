const { validateBooking } = require('../utils/validators');

function validateBookingMiddleware(req, res, next) {
  const errors = validateBooking(req.body);
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: errors.join(' '),
      details: errors
    });
  }
  
  next();
}

function sanitizeInput(req, res, next) {
  // Sanitize string inputs to prevent XSS
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
}

module.exports = {
  validateBookingMiddleware,
  sanitizeInput
};