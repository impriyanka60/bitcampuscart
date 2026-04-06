const express = require('express');
const router = express.Router();
const BusSchedule = require('../models/BusSchedule');

// GET all bus schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await BusSchedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by type (weekday / weekend)
router.get('/:type', async (req, res) => {
  try {
    const schedule = await BusSchedule.findOne({ type: req.params.type });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
