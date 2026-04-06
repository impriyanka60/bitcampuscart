const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["Internet", "Electricity", "Water", "Cleanliness", "Other"],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open"
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
