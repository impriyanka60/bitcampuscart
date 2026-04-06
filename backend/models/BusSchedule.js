const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripNumber: Number,
  startTime: String,
  endTime: String,
  route: [String]
});

const busScheduleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['weekday', 'weekend'],
    required: true
  },
  trips: [tripSchema]
});

module.exports = mongoose.model('BusSchedule', busScheduleSchema);
