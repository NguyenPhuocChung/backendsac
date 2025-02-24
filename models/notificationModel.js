const mongoose = require("mongoose");

// Schema definition
const NotificationSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  title: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Model definition
const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
