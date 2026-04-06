const express = require('express');
const router = express.Router();
const MessMenu = require('../models/MessMenu');

// GET mess menu (Girls Hostel)
router.get('/', async (req, res) => {
  try {
    const menu = await MessMenu.findOne({ hostel: "Girls Hostel" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
