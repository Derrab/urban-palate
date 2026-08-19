const { KENYAN_PHONE_REGEX, MIN_NAME_LENGTH } = require('../config/constants');

function isValidKenyanPhone(phone) {
  const cleaned = String(phone).replace(/[\s-]/g, '');
  return KENYAN_PHONE_REGEX.test(cleaned);
}

function isValidName(name) {
  return name && String(name).trim().length >= MIN_NAME_LENGTH;
}

function isValidDate(date) {
  if (!date || isNaN(Date.parse(date))) return false;
  const chosen = new Date(date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return chosen >= today;
}

function isValidTime(time) {
  return time && /^\d{2}:\d{2}$/.test(time);
}

function isValidGuests(guests) {
  return guests && parseInt(guests) > 0;
}

function validateBooking(data) {
  const errors = [];
  const { fullName, phone, date, time, guests } = data;

  if (!isValidName(fullName)) {
    errors.push('A valid full name is required (minimum 2 characters).');
  }

  if (!isValidKenyanPhone(phone)) {
    errors.push('A valid Kenyan phone number is required (e.g., 07XX XXX XXX).');
  }

  if (!isValidDate(date)) {
    errors.push('A valid date is required (today or later).');
  }

  if (!isValidTime(time)) {
    errors.push('A valid time is required (HH:MM format).');
  }

  if (!isValidGuests(guests)) {
    errors.push('Please specify the number of guests.');
  }

  return errors;
}

module.exports = {
  isValidKenyanPhone,
  isValidName,
  isValidDate,
  isValidTime,
  isValidGuests,
  validateBooking
};