const fs = require('fs');
const path = require('path');
const { BOOKINGS_FILE } = require('./constants');

class Database {
  constructor() {
    this.filePath = path.join(__dirname, '../../', BOOKINGS_FILE);
    this.data = [];
    this.load();
  }

  load() {
    if (!fs.existsSync(this.filePath)) {
      this.data = [];
      this.save();
      return;
    }
    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      this.data = JSON.parse(content);
    } catch (error) {
      console.error('Error loading database:', error.message);
      this.data = [];
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error.message);
    }
  }

  findAll() {
    return this.data;
  }

  findById(id) {
    return this.data.find(booking => booking.id === id);
  }

  insert(booking) {
    this.data.push(booking);
    this.save();
    return booking;
  }

  // For future MongoDB migration
  async connect() {
    // Placeholder for MongoDB connection
    return this;
  }
}

module.exports = new Database();