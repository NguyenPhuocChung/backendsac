const mongoose = require("mongoose");

// Schema definition
const FarmSchema = new mongoose.Schema({
  farmName: {
    type: String,
    required: true,
    trim: true,
  },
  shrimpType: {
    type: String,
    required: true,
  },
  pondStatus: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Model definition
const Ponds = mongoose.model("Ponds", FarmSchema);

module.exports = Ponds;
