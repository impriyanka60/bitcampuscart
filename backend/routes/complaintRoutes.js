const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/authMiddleware");

// Create complaint
router.post("/", protect, async (req, res) => {
  const complaint = new Complaint({
    ...req.body,
    postedBy: req.user._id
  });
  await complaint.save();
  res.json(complaint);
});

// Get all complaints
router.get("/", async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints);
});

// Update status
router.put("/:id/status", protect, async (req, res) => {
  const { status } = req.body;
  await Complaint.findByIdAndUpdate(req.params.id, { status });
  res.json({ message: "Status updated" });
});

module.exports = router;
