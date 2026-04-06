const mongoose = require("mongoose");

const networkConfigSchema = new mongoose.Schema({
  hostel: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  ipAddresses: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model("NetworkConfig", networkConfigSchema);
