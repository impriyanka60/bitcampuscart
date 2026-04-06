const mongoose = require('mongoose');

const dayMenuSchema = new mongoose.Schema({
  breakfast: [String],
  lunch: [String],
  snacks: [String],
  dinner: [String]
});

const messMenuSchema = new mongoose.Schema({
  hostel: {
    type: String,
    required: true
  },
  menus: {
    Monday: dayMenuSchema,
    Tuesday: dayMenuSchema,
    Wednesday: dayMenuSchema,
    Thursday: dayMenuSchema,
    Friday: dayMenuSchema,
    Saturday: dayMenuSchema,
    Sunday: dayMenuSchema
  }
});

module.exports = mongoose.model('MessMenu', messMenuSchema);
