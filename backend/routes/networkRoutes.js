const express = require("express");
const router = express.Router();
const NetworkConfig = require("../models/NetworkConfig");

// COMMON NETWORK SETTINGS (same for all rooms)
const COMMON_CONFIG = {
  subnetMask: "255.255.252.0",
  gateway: "192.168.112.1",
  dns: "192.168.200.1"
};

// GET network config by hostel + room
// /api/network?hostel=Girls Hostel&room=224
router.get("/", async (req, res) => {
  const { hostel, room } = req.query;

  if (!hostel || !room) {
    return res.status(400).json({ message: "Hostel and room are required" });
  }

  try {
    const record = await NetworkConfig.findOne({
      hostel,
      roomNumber: room
    });

    if (!record) {
      return res.status(404).json({ message: "No data found for this room" });
    }

    res.json({
      hostel: record.hostel,
      roomNumber: record.roomNumber,
      ipAddresses: record.ipAddresses,
      ...COMMON_CONFIG
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
